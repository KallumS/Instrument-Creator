// The plugin checked without a host. First, that it makes sound: a note
// into an instrument, a burst of noise into an effect. Then its saved state,
// as clap-validator checks it: random parameter values, a few blocks of
// audio, save; a new instance loads that and saves again; both saves must be
// the same, and so must every parameter. Prints the two states as XML where
// they differ.
//
//   EXTRA_TARGETS=jsfx_state_check plugin/build.sh && plugin/build/jsfx_state_check
#include <juce_audio_processors/juce_audio_processors.h>
#include <iostream>
#include "../source/JsfxPlugin.h"

// Counts the parameter changes the plugin reports to the host.
struct Reports : juce::AudioProcessorListener {
    int n = 0;
    void audioProcessorParameterChanged(juce::AudioProcessor *, int, float) override { ++n; }
    void audioProcessorChanged(juce::AudioProcessor *, const ChangeDetails &) override {}
};

// A host sets parameters; the plugin must not report them back as if the
// JSFX had moved them (clap-validator's host crashed on exactly that).
static int echoCheck()
{
    std::unique_ptr<juce::AudioProcessor> base(createPluginFilter());
    auto &p = dynamic_cast<JsfxProcessor &>(*base);
    Reports reports;
    p.addListener(&reports);
    p.prepareToPlay(48000, 256);
    juce::AudioBuffer<float> audio(2, 256);
    juce::MidiBuffer midi;
    juce::Random rng(99);
    for (int round = 0; round < 50; ++round) {
        for (auto *param : p.getParameters()) param->setValue(rng.nextFloat());
        for (int b = 0; b < 3; ++b) {
            audio.clear();
            midi.clear();
            p.processBlock(audio, midi);
        }
        for (int t = 0; t < 12; ++t) p.pollScript();
    }
    p.removeListener(&reports);
    return reports.n;
}

static juce::String xml(const juce::MemoryBlock &m)
{
    auto t = juce::ValueTree::readFromData(m.getData(), m.getSize());
    return t.toXmlString();
}

static void run(juce::AudioProcessor &p, int blocks)
{
    p.prepareToPlay(48000, 256);
    juce::AudioBuffer<float> audio(2, 256);
    juce::MidiBuffer midi;
    for (int i = 0; i < blocks; ++i) {
        audio.clear();
        midi.clear();
        p.processBlock(audio, midi);
    }
}

// Peak level of a second of output: a held note (instrument) or a tenth of a
// second of noise (effect), at the plugin's default settings.
static float soundCheck()
{
    std::unique_ptr<juce::AudioProcessor> p(createPluginFilter());
    p->prepareToPlay(48000, 256);
    juce::AudioBuffer<float> audio(2, 256);
    juce::MidiBuffer midi;
    juce::Random rng(7);
    float peak = 0;
    for (int b = 0; b < 188; ++b) {
        audio.clear();
        midi.clear();
#if JucePlugin_IsSynth
        if (b == 0) midi.addEvent(juce::MidiMessage::noteOn(1, 45, (juce::uint8)100), 0);
#else
        if (b < 19)
            for (int c = 0; c < 2; ++c)
                for (int i = 0; i < 256; ++i) audio.setSample(c, i, rng.nextFloat() * 0.5f - 0.25f);
#endif
        p->processBlock(audio, midi);
        if (b >= 19) peak = juce::jmax(peak, audio.getMagnitude(0, 256));
    }
    return peak;
}

int main()
{
    juce::ScopedJuceInitialiser_GUI gui;
    int failures = 0;
    float peak = soundCheck();
    std::cout << "sound: peak " << juce::Decibels::gainToDecibels(peak) << " dB after the first 0.1 s"
              << (peak > 0.001f && peak < 4.0f ? "" : "  FAILED (silent or blown up)") << "\n";
    if (!(peak > 0.001f && peak < 4.0f)) ++failures;
    int echoes = echoCheck();
    std::cout << "host changes reported back as the plugin's own: " << echoes
              << (echoes ? "  FAILED" : "") << "\n";
    if (echoes) ++failures;
    for (int round = 0; round < 5; ++round) {
        juce::Random rng(1234 + round);
        std::unique_ptr<juce::AudioProcessor> a(createPluginFilter());
        run(*a, 2);
        for (auto *p : a->getParameters()) p->setValueNotifyingHost(rng.nextFloat());
        run(*a, 4);
        juce::MemoryBlock s1;
        a->getStateInformation(s1);

        std::unique_ptr<juce::AudioProcessor> b(createPluginFilter());
        b->setStateInformation(s1.getData(), (int)s1.getSize());
        juce::MemoryBlock s2;
        b->getStateInformation(s2);

        bool same = s1 == s2;
        int params = 0;
        for (int i = 0; i < a->getParameters().size(); ++i)
            if (a->getParameters()[i]->getValue() != b->getParameters()[i]->getValue()) ++params;
        std::cout << "round " << round << ": state " << (same ? "same" : "DIFFERS")
                  << ", parameters differing " << params << "\n";
        if (!same || params) {
            ++failures;
            juce::StringArray x1, x2;
            x1.addLines(xml(s1));
            x2.addLines(xml(s2));
            for (int i = 0; i < juce::jmax(x1.size(), x2.size()); ++i)
                if (x1[i] != x2[i])
                    std::cout << "  saved:    " << x1[i] << "\n  reloaded: " << x2[i] << "\n";
            for (int i = 0; i < a->getParameters().size(); ++i)
                if (a->getParameters()[i]->getValue() != b->getParameters()[i]->getValue())
                    std::cout << "  parameter " << a->getParameters()[i]->getName(40) << ": "
                              << a->getParameters()[i]->getValue() << " vs "
                              << b->getParameters()[i]->getValue() << "\n";
        }
    }
    std::cout << (failures ? "FAILED\n" : "all passed\n");
    return failures ? 1 : 0;
}
