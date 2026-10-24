// The JSFX as a VST3 and CLAP plugin: the same file REAPER runs, compiled
// into the plugin and run by ysfx (the EEL2 engine REAPER uses), with its
// @gfx window as the plugin's window. Nothing about the sound or the window
// is re-implemented, so what was measured in REAPER and in tools/ holds.
//
// The same wrapper serves Reverberator and Instrument Creator; what differs
// (the name, the file, effect or instrument) is set in CMakeLists.txt.
#pragma once
#include <juce_audio_processors/juce_audio_processors.h>
#include <array>
#include <atomic>
#include <vector>
#include "ysfx.h"

class SliderParameter;

class JsfxProcessor : public juce::AudioProcessor, private juce::Timer {
public:
    JsfxProcessor();
    ~JsfxProcessor() override;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override {}
    bool isBusesLayoutSupported(const BusesLayout &layout) const override;
    void processBlock(juce::AudioBuffer<float> &buffer, juce::MidiBuffer &midi) override;
    using juce::AudioProcessor::processBlock;

    juce::AudioProcessorEditor *createEditor() override;
    bool hasEditor() const override { return true; }

    const juce::String getName() const override { return JucePlugin_Name; }
    bool acceptsMidi() const override { return true; }
    bool producesMidi() const override { return false; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return PLUG_TAIL_SECONDS; }

    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram(int) override {}
    const juce::String getProgramName(int) override { return {}; }
    void changeProgramName(int, const juce::String &) override {}

    void getStateInformation(juce::MemoryBlock &dest) override;
    void setStateInformation(const void *data, int size) override;

    ysfx_t *effect() const { return m_fx; }
    const juce::String &loadError() const { return m_error; }

    // the window's size, kept with the project
    int editorWidth = 0, editorHeight = 0;

    // a host change waiting for the audio thread (SliderParameter::setValue)
    void markHostChange(int slider);

private:
    void timerCallback() override;
    void syncParameterFromSlider(int slider);
    juce::File writeJsfx();

    ysfx_t *m_fx = nullptr;
    juce::String m_error;
    juce::CriticalSection m_lock;  // the effect: audio thread vs state calls
    std::array<SliderParameter *, ysfx_max_sliders> m_params{};
    std::array<std::atomic<uint64_t>, ysfx_max_slider_groups> m_hostChanged{};
    std::array<std::atomic<uint64_t>, ysfx_max_slider_groups> m_scriptChanged{};
    std::array<int, ysfx_max_sliders> m_drift{};  // sweeps a slider has differed
    int m_tick = 0;
    int64_t m_lastPosition = -1;
    ysfx_time_info_t m_time{};
};
