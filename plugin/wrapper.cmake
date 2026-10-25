# The JSFX wrapper, shared by Reverberator and Instrument Creator (each repo
# keeps a copy). CMakeLists.txt sets PLUG_* and YSFX_DIR, then includes this.
# ysfx: the engine and its graphics, not its own plugin
set(YSFX_PLUGIN OFF CACHE BOOL "" FORCE)
set(YSFX_GFX ON CACHE BOOL "" FORCE)
set(YSFX_SKIP_CHECKSUM ON CACHE BOOL "" FORCE)
add_subdirectory("${YSFX_DIR}" ysfx EXCLUDE_FROM_ALL)

# JUCE 8.0.6, the version ysfx's own plugin is built and tested with
add_subdirectory("${JUCE_DIR}" juce EXCLUDE_FROM_ALL)
add_subdirectory("${YSFX_DIR}/thirdparty/clap-juce-extensions" clap-juce-extensions EXCLUDE_FROM_ALL)

if(PLUG_IS_SYNTH)
    set(PLUG_CODE_ROLE "Instrument")
else()
    set(PLUG_CODE_ROLE "Effect")
endif()

juce_add_plugin(JsfxPlugin
    PRODUCT_NAME "${PLUG_NAME}"
    COMPANY_NAME "KallumS"
    BUNDLE_ID "${PLUG_ID}"
    PLUGIN_MANUFACTURER_CODE "Klms"
    PLUGIN_CODE "${PLUG_CODE}"
    DESCRIPTION "${PLUG_NAME}"
    FORMATS VST3 Standalone                # the standalone app is only for checking the window
    IS_SYNTH ${PLUG_IS_SYNTH}
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS TRUE
    VST3_CATEGORIES ${PLUG_VST3_CATEGORIES}
    COPY_PLUGIN_AFTER_BUILD FALSE)

juce_add_binary_data(JsfxData SOURCES "${PLUG_JSFX}")

target_sources(JsfxPlugin PRIVATE
    "${CMAKE_CURRENT_LIST_DIR}/source/JsfxPlugin.cpp"
    "${YSFX_DIR}/plugin/components/graphics_view.cpp"
    "${YSFX_DIR}/plugin/utility/async_updater.cpp"
    "${YSFX_DIR}/plugin/utility/rt_semaphore.cpp")
target_include_directories(JsfxPlugin PRIVATE "${YSFX_DIR}/plugin")
target_compile_definitions(JsfxPlugin PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0
    PLUG_TAIL_SECONDS=${PLUG_TAIL_SECONDS}
    PLUG_MIN_W=${PLUG_MIN_W}
    PLUG_MIN_H=${PLUG_MIN_H}
    PLUG_BACKGROUND=${PLUG_BACKGROUND})
target_link_libraries(JsfxPlugin
    PRIVATE
        JsfxData
        ysfx::ysfx
        juce::juce_audio_processors
        juce::juce_audio_utils
        juce::juce_gui_basics
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)

clap_juce_extensions_plugin(TARGET JsfxPlugin
    CLAP_ID "${PLUG_ID}"
    CLAP_FEATURES ${PLUG_CLAP_FEATURES}
    CLAP_PROCESS_EVENTS_RESOLUTION_SAMPLES 64
    CLAP_USE_JUCE_PARAMETER_RANGES DISCRETE)

# The saved state, round-tripped without a host (test/state_check.cpp):
# build.sh with EXTRA_TARGETS=jsfx_state_check
add_executable(jsfx_state_check EXCLUDE_FROM_ALL "${CMAKE_CURRENT_LIST_DIR}/test/state_check.cpp")
target_link_libraries(jsfx_state_check PRIVATE JsfxPlugin)
target_include_directories(jsfx_state_check PRIVATE $<TARGET_PROPERTY:JsfxPlugin,INCLUDE_DIRECTORIES>)
target_compile_definitions(jsfx_state_check PRIVATE $<TARGET_PROPERTY:JsfxPlugin,COMPILE_DEFINITIONS>)
