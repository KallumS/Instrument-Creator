/* The Max for Live device, run in Node on a pretend Max and a pretend Live.
 *   python3 ableton/kit/build.py ableton/device.json && node --test ableton/tests/ */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const suite = require('../kit/test/audio_suite.js');
const { compare } = require('../kit/test/gen_compare.js');
require('../kit/test/palette_suite.js')();

const ROOT = path.join(__dirname, '..', '..');
const JSFX = path.join(ROOT, 'Instrument-Creator.jsfx');
suite({ bundle: path.join(__dirname, '..', 'InstrumentCreator.js'), maxpat: path.join(__dirname, '..', 'InstrumentCreator.maxpat'),
        jsfx: JSFX, name: 'Instrument Creator', window: [940, 720], memory: 524288, instrument: true, vary: 1 });

test('every built-in instrument sounds in gen~ as it does in the runtime', () => {
  const text = fs.readFileSync(JSFX, 'utf8');
  const fx = require('../kit/runtime/jsfx.js');
  const sl = new fx.JSFX(text).file.sliders.find((s) => s.index === 1);
  const notes = [[0, 0x90, 60, 110], [12000, 0x80, 60, 0], [13000, 0x90, 67, 80]];
  for (let k = sl.min; k <= sl.max; k++) {
    const r = compare(text, { seconds: 0.4, midi: notes, sliders: { 1: k }, memory: 524288 });
    assert.ok(r.worst < 1e-6, 'instrument ' + k + ': worst ' + r.worst + ' at ' + r.at);
  }
});

test('the window’s Play C4 plays C4 in gen~ for 1.2 seconds', () => {
  const { load } = require('../kit/test/max.js');
  const d = load(path.join(__dirname, '..', 'InstrumentCreator.js'), { width: 940, height: 720 });
  d.send('bang'); d.send('mqname', 'mq-1');
  d.run(50);
  d.ctx.fx.setVar('aud_note', 60); d.ctx.fx.setVar('aud_req', 1);
  d.run(20);
  const mq = d.buffers['mq-1'];
  assert.deepStrictEqual(Array.from(mq.slice(0, 4)), [1, 0x90, 60, 100]);
  assert.strictEqual(d.ctx.fx.getVar('aud_on'), 1, 'the window shows it playing');
  d.run(1300);
  assert.deepStrictEqual([mq[0]].concat(Array.from(mq.slice(4, 7))), [2, 0x80, 60, 0]);
  assert.strictEqual(d.ctx.fx.getVar('aud_on'), 0);
});
