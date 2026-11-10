/* Instrument Creator in Live: the window's Play C4.
 *
 * In REAPER the window asks the plug-in's @block for the note (aud_req,
 * aud_note) and @block plays it for 1.2 seconds. Here @block is gen~'s and
 * the window's copy of the plug-in hears nothing, so the device answers the
 * request: the note goes to gen~ as if played on the track, and the window is
 * told it is playing (aud_on) until it stops. */
var audition = { note: 0, until: 0 };
var ACTIONS = {
  tick: function (fx) {
    if (fx.getVar('aud_req')) {
      var note = Math.round(fx.getVar('aud_note')) || 60;
      fx.setVar('aud_req', 0);
      if (audition.until) midiToGen([0x80, audition.note, 0]);
      midiToGen([0x90, note, 100]);
      audition = { note: note, until: Date.now() + 1200 };
      fx.setVar('aud_on', 1);
    }
    if (audition.until && Date.now() >= audition.until) {
      midiToGen([0x80, audition.note, 0]);
      audition.until = 0;
      fx.setVar('aud_on', 0);
    }
  }
};
