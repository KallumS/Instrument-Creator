#include "JsfxPlugin.h"
#include "BinaryData.h"
#include "components/graphics_view.h"
#include <cmath>

//==============================================================================
// One host parameter per slider the JSFX declares, hidden ones included, so
// the DAW can automate and save everything the window can change. The value
// the host sees is 0..1 along the slider's own curve.
class SliderParameter : public juce::AudioProcessorParameterWithID {
public:
    SliderParameter(JsfxProcessor &owner, ysfx_t *fx, int index)
        : juce::AudioProcessorParameterWithID(
              juce::ParameterID("slider" + juce::String(index + 1), 1),
              sliderName(fx, index)),
          m_owner(owner), m_index(index)
    {
        ysfx_slider_get_curve(fx, (uint32_t)index, &m_curve);
        if (ysfx_slider_is_enum(fx, (uint32_t)index)) {
            uint32_t n = ysfx_slider_get_enum_size(fx, (uint32_t)index);
            for (uint32_t i = 0; i < n; ++i)
                m_enum.add(juce::CharPointer_UTF8(ysfx_slider_get_enum_name(fx, (uint32_t)index, i)));
        }
        m_default = (float)fromYsfx(m_curve.def);
        m_value = toYsfx(m_default);
    }

    double toYsfx(double norm) const
    {
        double v = ysfx_normalized_to_ysfx_value(juce::jlimit(0.0, 1.0, norm), &m_curve);
        if (m_curve.inc > 0)
            v = m_curve.min + std::round((v - m_curve.min) / m_curve.inc) * m_curve.inc;
        return juce::jlimit(juce::jmin(m_curve.min, m_curve.max), juce::jmax(m_curve.min, m_curve.max), v);
    }
    double fromYsfx(double value) const
    {
        return juce::jlimit(0.0, 1.0, (double)ysfx_ysfx_value_to_normalized(value, &m_curve));
    }

    // The parameter holds the slider's own value, snapped to its step, so a
    // value set by the host comes back from a saved project exactly as it was.
    float getValue() const override { return (float)fromYsfx(m_value.load()); }
    void setValue(float v) override
    {
        m_value.store(toYsfx(v));
        if (!syncing) m_owner.markHostChange(m_index);
    }
    double sliderValue() const { return m_value.load(); }
    void setSliderValue(double v) { m_value.store(v); }
    float getDefaultValue() const override { return m_default; }
    bool isDiscrete() const override { return !m_enum.isEmpty(); }
    int getNumSteps() const override
    {
        if (!m_enum.isEmpty()) return m_enum.size();
        if (m_curve.inc > 0)
            return juce::jmax(2, (int)std::round(std::abs(m_curve.max - m_curve.min) / m_curve.inc) + 1);
        return juce::AudioProcessor::getDefaultNumParameterSteps();
    }

    juce::String getText(float norm, int maxLen) const override
    {
        double v = toYsfx(norm);
        juce::String s;
        if (!m_enum.isEmpty()) {
            int i = juce::jlimit(0, m_enum.size() - 1, (int)std::lround(v));
            s = m_enum[i];
        } else {
            int decimals = 2;
            if (m_curve.inc >= 1) decimals = 0;
            else if (m_curve.inc >= 0.1) decimals = 1;
            s = juce::String(v, decimals);
        }
        return maxLen > 0 ? s.substring(0, maxLen) : s;
    }
    float getValueForText(const juce::String &text) const override
    {
        int i = m_enum.indexOf(text.trim(), true);
        if (i >= 0) return (float)fromYsfx(i);
        return (float)fromYsfx(text.getDoubleValue());
    }

    // set while the plugin itself moves the parameter (the window changed
    // the slider, or a project was loaded), so it is not sent back
    bool syncing = false;

private:
    static juce::String sliderName(ysfx_t *fx, int index)
    {
        juce::String n = juce::CharPointer_UTF8(ysfx_slider_get_name(fx, (uint32_t)index));
        n = n.trimCharactersAtStart("-").trim();
        return n.isEmpty() ? "Slider " + juce::String(index + 1) : n;
    }

    JsfxProcessor &m_owner;
    int m_index;
    ysfx_slider_curve_t m_curve{};
    juce::StringArray m_enum;
    float m_default = 0;
    std::atomic<double> m_value{0};
};

//==============================================================================
static juce::String resourceName()
{
    // the one file in BinaryData: the .jsfx
    return BinaryData::namedResourceList[0];
}

// ysfx loads from a path (that is where it finds imports and data), so the
// embedded file is written to the plugin's own folder and loaded from there.
juce::File JsfxProcessor::writeJsfx()
{
    int size = 0;
    const char *data = BinaryData::getNamedResource(resourceName().toRawUTF8(), size);
    juce::String file = BinaryData::getNamedResourceOriginalFilename(resourceName().toRawUTF8());
    juce::File dir = juce::File::getSpecialLocation(juce::File::userApplicationDataDirectory)
#if JUCE_MAC
                         .getChildFile("Application Support")
#endif
                         .getChildFile(JucePlugin_Name);
    dir.createDirectory();
    juce::File out = dir.getChildFile(file);
    juce::MemoryBlock want(data, (size_t)size), have;
    if (!out.loadFileAsData(have) || have != want)
        out.replaceWithData(data, (size_t)size);
    return out;
}

JsfxProcessor::JsfxProcessor()
    : juce::AudioProcessor(BusesProperties()
#if !JucePlugin_IsSynth
                               .withInput("Input", juce::AudioChannelSet::stereo(), true)
#endif
                               .withOutput("Output", juce::AudioChannelSet::stereo(), true))
{
    juce::File path = writeJsfx();

    ysfx_config_u config{ysfx_config_new()};
    ysfx_register_builtin_audio_formats(config.get());
    ysfx_guess_file_roots(config.get(), path.getFullPathName().toRawUTF8());
    auto log = [](intptr_t user, ysfx_log_level level, const char *message) {
        if (level == ysfx_log_error)
            *(juce::String *)user += juce::String(juce::CharPointer_UTF8(message)) + "\n";
    };
    ysfx_set_log_reporter(config.get(), +log);
    ysfx_set_user_data(config.get(), (intptr_t)&m_error);

    m_fx = ysfx_new(config.get());
    bool ok = ysfx_load_file(m_fx, path.getFullPathName().toRawUTF8(), 0) &&
              ysfx_compile(m_fx, 0);
    if (!ok && m_error.isEmpty())
        m_error = "The plugin couldn’t load " + path.getFileName() + ".";

    if (ok) {
        ysfx_set_sample_rate(m_fx, 44100);
        ysfx_set_block_size(m_fx, 512);
        ysfx_init(m_fx);
        // Pass the new instance's state through @serialize once, so what it
        // saves is what it would load: Instrument Creator's @serialize turns
        // an unset interface size (0) into 100% (1), and a project saved
        // before that had happened would otherwise read back different.
        if (ysfx_state_u fresh{ysfx_save_state(m_fx)})
            ysfx_load_state(m_fx, fresh.get());
        for (int i = 0; i < ysfx_max_sliders; ++i) {
            if (!ysfx_slider_exists(m_fx, (uint32_t)i)) continue;
            m_params[(size_t)i] = new SliderParameter(*this, m_fx, i);
            addParameter(m_params[(size_t)i]);
            syncParameterFromSlider(i);
        }
    }
    startTimerHz(30);
}

JsfxProcessor::~JsfxProcessor()
{
    stopTimer();
    ysfx_free(m_fx);
}

void JsfxProcessor::markHostChange(int slider)
{
    uint8_t g = ysfx_fetch_slider_group_index((uint32_t)slider);
    m_hostChanged[g].fetch_or(ysfx_slider_mask((uint32_t)slider, g));
}

void JsfxProcessor::syncParameterFromSlider(int i)
{
    SliderParameter *p = m_params[(size_t)i];
    if (!p) return;
    p->setSliderValue(ysfx_slider_get_value(m_fx, (uint32_t)i));
}

//==============================================================================
bool JsfxProcessor::isBusesLayoutSupported(const BusesLayout &layout) const
{
    auto out = layout.getMainOutputChannelSet();
    if (out != juce::AudioChannelSet::stereo()) return false;
#if !JucePlugin_IsSynth
    if (layout.getMainInputChannelSet() != juce::AudioChannelSet::stereo()) return false;
#endif
    return true;
}

void JsfxProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    const juce::ScopedLock sl(m_lock);
    if (!m_error.isEmpty()) return;
    ysfx_set_sample_rate(m_fx, sampleRate);
    ysfx_set_block_size(m_fx, (uint32_t)samplesPerBlock);
    ysfx_init(m_fx);
    setLatencySamples((int)std::lround(ysfx_get_pdc_delay(m_fx)));
}

// The host's parameter changes become slider changes (and run @slider).
// Called with m_lock held.
void JsfxProcessor::applyHostChanges()
{
    for (uint8_t g = 0; g < ysfx_max_slider_groups; ++g) {
        uint64_t bits = m_hostChanged[g].exchange(0);
        for (int b = 0; bits && b < 64; ++b, bits >>= 1) {
            if (!(bits & 1)) continue;
            int i = g * 64 + b;
            if (SliderParameter *p = m_params[(size_t)i])
                ysfx_slider_set_value(m_fx, (uint32_t)i, p->sliderValue(), true);
        }
    }
}

void JsfxProcessor::processBlock(juce::AudioBuffer<float> &buffer, juce::MidiBuffer &midi)
{
    juce::ScopedNoDenormals noDenormals;
    const juce::ScopedTryLock sl(m_lock);
    if (!sl.isLocked() || !m_error.isEmpty()) {
        buffer.clear();
        midi.clear();
        return;
    }

    applyHostChanges();

    // where the song is, for the JSFX's play_state, tempo and beat_position
    if (auto *ph = getPlayHead()) {
        if (auto pos = ph->getPosition()) {
            auto t = pos->getTimeInSamples();
            if (pos->getIsRecording()) m_time.playback_state = ysfx_playback_recording;
            else if (pos->getIsPlaying()) m_time.playback_state = ysfx_playback_playing;
            else m_time.playback_state = (t && *t == m_lastPosition)
                                             ? ysfx_playback_stopped : ysfx_playback_paused;
            if (t) m_lastPosition = *t;
            if (auto bpm = pos->getBpm()) m_time.tempo = *bpm;
            if (auto s = pos->getTimeInSeconds()) m_time.time_position = *s;
            if (auto q = pos->getPpqPosition()) m_time.beat_position = *q;
            if (auto sig = pos->getTimeSignature()) {
                m_time.time_signature[0] = (uint32_t)sig->numerator;
                m_time.time_signature[1] = (uint32_t)sig->denominator;
            }
        }
    }
    ysfx_set_time_info(m_fx, &m_time);

    for (const auto md : midi) {
        ysfx_midi_event_t ev{};
        ev.offset = (uint32_t)md.samplePosition;
        ev.size = (uint32_t)md.numBytes;
        ev.data = md.data;
        ysfx_send_midi(m_fx, &ev);
    }
    midi.clear();

    ysfx_process_float(m_fx, buffer.getArrayOfReadPointers(), buffer.getArrayOfWritePointers(),
                       (uint32_t)getTotalNumInputChannels(), (uint32_t)getTotalNumOutputChannels(),
                       (uint32_t)buffer.getNumSamples());

    ysfx_midi_event_t out;
    while (ysfx_receive_midi(m_fx, &out)) {}   // a JSFX's MIDI out goes nowhere here

    // sliders the window moved, for the timer to tell the host
    for (uint8_t g = 0; g < ysfx_max_slider_groups; ++g)
        m_scriptChanged[g].fetch_or(ysfx_fetch_slider_automations(m_fx, g) |
                                    ysfx_fetch_slider_changes(m_fx, g));
}

// Thirty times a second, on the message thread: tell the host about sliders
// the window moved, so automation records them and the project saves them.
void JsfxProcessor::timerCallback() { pollScript(); }

void JsfxProcessor::pollScript()
{
    if (!m_error.isEmpty()) return;

    for (uint8_t g = 0; g < ysfx_max_slider_groups; ++g) {
        uint64_t bits = m_scriptChanged[g].exchange(0);
        for (int b = 0; bits && b < 64; ++b, bits >>= 1) {
            if (!(bits & 1)) continue;
            int i = g * 64 + b;
            SliderParameter *p = m_params[(size_t)i];
            if (!p) continue;
            double v = ysfx_slider_get_value(m_fx, (uint32_t)i);
            if (v != p->sliderValue()) {
                p->syncing = true;
                p->beginChangeGesture();
                p->setValueNotifyingHost((float)p->fromYsfx(v));
                p->endChangeGesture();
                p->setSliderValue(v);
                p->syncing = false;
            }
            m_drift[(size_t)i] = 0;
        }
    }

    // A slider can also move without the script saying so (a preset, a
    // project loaded). A few times a second, catch any that has differed from
    // its parameter for two sweeps running and no host change is pending.
    if (++m_tick % 5 == 0) {
        for (int i = 0; i < ysfx_max_sliders; ++i) {
            SliderParameter *p = m_params[(size_t)i];
            if (!p) continue;
            uint8_t g = ysfx_fetch_slider_group_index((uint32_t)i);
            bool pending = (m_hostChanged[g].load() & ysfx_slider_mask((uint32_t)i, g)) != 0;
            double v = ysfx_slider_get_value(m_fx, (uint32_t)i);
            if (pending || v == p->sliderValue()) {
                m_drift[(size_t)i] = 0;
                continue;
            }
            if (++m_drift[(size_t)i] >= 2) {
                p->syncing = true;
                p->setValueNotifyingHost((float)p->fromYsfx(v));
                p->setSliderValue(v);
                p->syncing = false;
                m_drift[(size_t)i] = 0;
            }
        }
        int latency = (int)std::lround(ysfx_get_pdc_delay(m_fx));
        if (latency != getLatencySamples()) setLatencySamples(latency);
    }
}

//==============================================================================
// The project keeps every slider and the JSFX's own @serialize data, as
// REAPER does, plus the window's size.
void JsfxProcessor::getStateInformation(juce::MemoryBlock &dest)
{
    if (!m_error.isEmpty()) return;
    ysfx_state_u state;
    {
        const juce::ScopedLock sl(m_lock);
        applyHostChanges();          // a host may set parameters and save before any audio runs
        state.reset(ysfx_save_state(m_fx));
    }
    juce::ValueTree root("jsfx");
    root.setProperty("version", 1, nullptr);
    root.setProperty("editorWidth", editorWidth, nullptr);
    root.setProperty("editorHeight", editorHeight, nullptr);
    if (state) {
        juce::ValueTree sliders("sliders");
        for (uint32_t i = 0; i < state->slider_count; ++i)
            sliders.setProperty(juce::String(state->sliders[i].index), state->sliders[i].value, nullptr);
        root.addChild(sliders, -1, nullptr);
        root.setProperty("data", juce::Base64::toBase64(state->data, state->data_size), nullptr);
    }
    juce::MemoryOutputStream stream(dest, false);
    root.writeToStream(stream);
}

void JsfxProcessor::setStateInformation(const void *data, int size)
{
    if (!m_error.isEmpty()) return;
    juce::ValueTree root = juce::ValueTree::readFromData(data, (size_t)size);
    if (!root.hasType("jsfx") || (int)root.getProperty("version") != 1) return;
    editorWidth = root.getProperty("editorWidth", 0);
    editorHeight = root.getProperty("editorHeight", 0);

    std::vector<ysfx_state_slider_t> sliders;
    juce::ValueTree st = root.getChildWithName("sliders");
    for (int i = 0; i < ysfx_max_sliders; ++i)
        if (const juce::var *v = st.getPropertyPointer(juce::String(i)))
            sliders.push_back({(uint32_t)i, (ysfx_real)(double)*v});
    juce::MemoryBlock blob;
    {
        juce::MemoryOutputStream out(blob, false);
        juce::Base64::convertFromBase64(out, root.getProperty("data").toString());
    }
    ysfx_state_t state{};
    state.sliders = sliders.data();
    state.slider_count = (uint32_t)sliders.size();
    state.data = (uint8_t *)blob.getData();
    state.data_size = blob.getSize();
    {
        const juce::ScopedLock sl(m_lock);
        ysfx_load_state(m_fx, &state);
        for (auto &bits : m_hostChanged) bits.store(0);
    }
    for (int i = 0; i < ysfx_max_sliders; ++i) syncParameterFromSlider(i);
}

//==============================================================================
// The window: the JSFX's @gfx and nothing else, at the size it asks for.
class JsfxEditor : public juce::AudioProcessorEditor {
public:
    explicit JsfxEditor(JsfxProcessor &p) : juce::AudioProcessorEditor(p), m_proc(p)
    {
        uint32_t dim[2] = {PLUG_MIN_W, PLUG_MIN_H};
        if (p.loadError().isEmpty()) {
            m_view = std::make_unique<YsfxGraphicsView>();
            m_view->setEffect(p.effect());
            addAndMakeVisible(*m_view);
            ysfx_get_gfx_dim(p.effect(), dim);
        } else {
            m_message.setText(p.loadError(), juce::dontSendNotification);
            m_message.setJustificationType(juce::Justification::centred);
            m_message.setColour(juce::Label::textColourId, juce::Colour(0xffdde1e7));
            addAndMakeVisible(m_message);
        }
        int w = p.editorWidth > 0 ? p.editorWidth : (int)juce::jmax<uint32_t>(dim[0], PLUG_MIN_W);
        int h = p.editorHeight > 0 ? p.editorHeight : (int)juce::jmax<uint32_t>(dim[1], PLUG_MIN_H);
        setResizable(true, true);
        setResizeLimits(PLUG_MIN_W, PLUG_MIN_H, 4096, 4096);
        setSize(w, h);
    }

    void paint(juce::Graphics &g) override { g.fillAll(juce::Colour(PLUG_BACKGROUND)); }

    void resized() override
    {
        if (m_view) m_view->setBounds(getLocalBounds());
        m_message.setBounds(getLocalBounds().reduced(24));
        m_proc.editorWidth = getWidth();
        m_proc.editorHeight = getHeight();
    }

    void parentHierarchyChanged() override
    {
        if (m_view && isShowing()) m_view->grabKeyboardFocus();
    }

private:
    JsfxProcessor &m_proc;
    std::unique_ptr<YsfxGraphicsView> m_view;
    juce::Label m_message;
};

juce::AudioProcessorEditor *JsfxProcessor::createEditor() { return new JsfxEditor(*this); }

juce::AudioProcessor *JUCE_CALLTYPE createPluginFilter() { return new JsfxProcessor(); }
