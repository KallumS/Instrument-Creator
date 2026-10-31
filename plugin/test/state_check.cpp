// The plugin's saved state, checked without a host (as clap-validator does):
// random parameter values, a few blocks of audio, save; a new instance loads
// that and saves again; both saves must be the same, and so must every
// parameter. Prints the two states as XML where they differ.
//
//   EXTRA_TARGETS=jsfx_state_check plugin/build.sh && plugin/build/jsfx_state_check
#include <juce_audio_processors/juce_audio_processors.h>
#include <iostream>

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

int main()
{
    juce::ScopedJuceInitialiser_GUI gui;
    int failures = 0;
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
