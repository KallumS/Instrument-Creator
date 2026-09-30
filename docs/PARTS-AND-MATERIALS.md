# Every part and every material, and the physics behind them

This is the long version. For each part it explains what the part is in a real
instrument, the physics of what it does, how Instrument Creator models it, and
what you hear. For each material it explains what its numbers are and what
they do to every kind of element.

The short reference tables are in [`PARTS.md`](PARTS.md); the reasons behind
the big design choices are in [`adr/`](adr/README.md); how it was built and
measured is in [`SESSION-LOG.md`](SESSION-LOG.md). Numbers here are the ones
the plugin uses. "Measured" means measured with the headless test rig in
`tools/`, not taken from a book.

## Contents

1. [A little physics first](#1-a-little-physics-first)
2. [How a note travels through the instrument](#2-how-a-note-travels-through-the-instrument)
3. [Energy sources](#3-energy-sources)
4. [Exciters](#4-exciters)
5. [Vibrating elements](#5-vibrating-elements)
6. [Materials](#6-materials)
7. [Resonators](#7-resonators)
8. [Couplers](#8-couplers)
9. [Radiators](#9-radiators)
10. [Frequency controls](#10-frequency-controls)
11. [Tuning mechanisms](#11-tuning-mechanisms)
12. [Damping](#12-damping)
13. [Modulation and control](#13-modulation-and-control)
14. [Age and rust](#14-age-and-rust)
15. [After the parts: level, limiter, stereo](#15-after-the-parts-level-limiter-stereo)
16. [Sources](#16-sources)

---

## 1. A little physics first

Seven ideas explain almost everything below.

**Resonances.** Anything that can vibrate has a set of frequencies it
prefers, its *resonances* or *modes*. Tap a wine glass and you hear its
resonances. The lowest usually sets the pitch you hear; the others set the
tone.

**Harmonic and inharmonic.** A string or a tube of air has resonances at
(nearly) whole-number multiples of the lowest: 1, 2, 3, 4… times the note.
Those are *harmonic*, and the ear fuses them into one clear pitch. A bar, a
drum skin or a bell plate has resonances at odd ratios (1, 2.76, 5.40… for a
bar), which are *inharmonic*: the pitch is still there but the sound is
clangy, bell-like or drum-like.

**Loss and ring time.** Every material turns a little vibration into heat on
every cycle. The *loss factor* η measures how much. A mode at frequency f
dies away with a *ring time* (the time to fall by 60 dB, "T60") of

> T60 = 2.2 / (f · η)

so a high note dies faster than a low one, and a lossy material dies faster
than a stiff, clean one. Steel has η ≈ 0.0003 (rings for many seconds);
rubber has η ≈ 0.1 (a thud). Real objects also lose energy to their mounting
and to the air, so each material has a longest possible ring, `t_max`.

**Stiffness makes things inharmonic.** A perfectly floppy string is perfectly
harmonic. A real string also resists bending, and that stiffness pushes its
high overtones sharp, more and more the higher they go. It is measured by the
*inharmonicity* B: overtone n sits at `n·f₀·√(1 + B·n²)`. Piano strings have
B ≈ 0.0002–0.001. A thick, stiff rod has much more, and starts to sound like
a bell.

**Waveguides.** A wave running along a string reflects at each end and comes
back. A *digital waveguide* is exactly that: a delay line one round trip
long, with the losses and stiffness of the trip built into filters in the
loop. It automatically has every harmonic, for almost no computing cost.

**Feedback and self-oscillation.** A struck bar rings and dies. A bowed
string, a clarinet reed or a buzzing lip keeps a note going, because the
exciter *listens* to the vibration and pushes in time with it, adding back
the energy that loss removes. That is feedback, and it has to be built
carefully, or it runs away and explodes.

**Impedance.** How hard it is to push something into motion. A tube with a
narrow bore resists airflow more than a wide one; a heavy bar resists a
hammer more than a light one. The exciter and the element have to be matched
for energy to flow between them.

---

## 2. How a note travels through the instrument

```
 energy source ──> exciter <══> vibrating element ──> bore / pipe (per note)
   how the power     what         what sets the          │
   arrives           touches it   pitch                  ▼
                                          coupler ──> soundbox / cavity / body ──> radiator ──> you
```

1. The **energy source** decides how the power arrives: a steady supply or a
   single push, how quickly it starts and stops, and how much noise it
   carries.
2. The **exciter** turns that power into motion of the element. The double
   arrow is the one feedback loop in the instrument: the exciter feels the
   element move and pushes back.
3. The **vibrating element**, made of the chosen material, sets the pitch
   and most of the character.
4. A **bore** or **pipe** resonator is tuned to each note and sits on the note
   itself. The other resonators are shared by all notes, like a real body.
5. The **coupler** shapes how vibration gets from the element into the body.
6. The **radiator** shapes how the sound leaves.
7. The four **controls** decide how notes are played: how pitch changes,
   how it is tuned, what happens when you let go, and what the mod wheel does.

Everything after the element is feed-forward: it colours the sound but never
feeds back into it, so it can never make the instrument unstable
([ADR 0007](adr/0007-only-the-exciter-and-the-element-form-a-feedback.md)).

Up to 8 notes sound at once. When a ninth arrives, the plugin reuses a free
voice, else the quietest released note, else the oldest.

---

## 3. Energy sources

The energy source is not what touches the element (that is the exciter). It is
*how the power arrives*. It has one big property, whether the supply is
**steady** or a **single push**, and that combines with the exciter's own big
property, whether it **sustains** or **strikes**:

| | Sustaining exciter (reed, lips, bow) | Striking exciter (hammer, plectrum, mallet) |
|---|---|---|
| **Steady source** (breath, bow, electricity) | the note lasts as long as you hold the key | the exciter keeps striking: a roll, a tremolo, a buzzer |
| **Single push** (finger, plectrum, hammer) | each note swells, then fades, like squeezing a bulb | the note is struck once and rings |

How hard you play maps to level as `force × velocity^k`: a hammer is very
dynamic (k = 1.8), electricity hardly at all (k = 0.7).

### Breath

**In real instruments**: the lungs push air at 1–10 kPa through a reed, lips
or a jet. Breath is never perfectly smooth: turbulence adds a hiss that is
part of every wind instrument's sound.

**Physics and model**: a steady pressure that rises in 35 ms and falls in
60 ms when you release, with 3.5 % random turbulence on it. A breath
controller (CC2), expression (CC11) or aftertouch changes the pressure while
the note sounds, just like blowing harder. With a striking exciter, breath
drives a striker at about 11 strikes a second (±25 % irregular), like a
drum roll powered by air.

**What you hear**: natural, breathing sustain; a soft, quick start; the tone
grows brighter as you blow harder, because the reed or lips close more
violently.

### Bow

**In real instruments**: the arm draws the bow at a steady speed; rosin makes
the hair grip and slip.

**Physics and model**: a steady bow speed, rising over 80 ms (a bow stroke
takes time to start), stopping in 100 ms, with 2.5 % grain from the rosin.
Driving a striking exciter, it gives 15 irregular strikes a second (±45 %),
like a bouncing *ricochet* stroke.

**What you hear**: a slower, swelling attack than breath and a slightly
gritty sustain.

### Finger

**In real instruments**: a fingertip pressing a key, plucking a string or
tapping a drum: soft flesh, one gesture per note.

**Physics and model**: a single push. It rises in 4 ms, holds for 150 ms,
then fades over half a second. Soft flesh means a long contact: finger
strikes last 2.2 times longer than the exciter's normal strike, so they are
darker. Velocity response k = 1.3.

**What you hear**: gentle, round notes; a finger into a reed or bow is a soft
squeeze that blooms and fades.

### Plectrum

**In real instruments**: a guitar pick, a harpsichord quill: a sharp flick.

**Physics and model**: a single push that rises in 1.5 ms, holds 100 ms and
fades over 0.35 s. Strikes are half as long as usual (bright), plus a little
pick noise.

**What you hear**: bright, quick, articulate notes.

### Hammer

**In real instruments**: a piano hammer thrown at the strings by the key
mechanism: a single, hard, very fast blow whose hardness depends on how fast
it travels.

**Physics and model**: a single push rising in 0.8 ms, holding 60 ms, fading
over 0.25 s. The most dynamic source (k = 1.8): soft notes are much quieter
and darker than hard ones, because a faster hammer also makes a shorter
contact (see Hammer under Exciters).

**What you hear**: percussive, very responsive to your playing.

### Electricity

**In real instruments**: an electromagnet driving a string (an EBow), a
motor, a solenoid buzzer, a vibraphone motor.

**Physics and model**: a perfectly steady, noise-free supply that starts in
3 ms and stops in 12 ms. With a striking exciter it drives a solenoid at
exactly 25 strikes a second, a buzzer.

**What you hear**: machine-like: perfectly even sustain, no breath, no grit.
With a hammer on a bar: a doorbell.

---

## 4. Exciters

The exciter is the part that actually touches the vibrating element.
Sustaining exciters (reed, lips, bow, and the air jet a windway makes) are
feedback loops; striking exciters (hammer, plectrum, mallet) are shaped
pushes.

Every sustaining exciter here is written in the same way: from the drive and
the wave arriving at the contact point, work out what to add to the wave
leaving it. The forms were chosen because they cannot put out more energy
than the drive supplies: when you stop blowing or bowing, the instrument
must fall silent ([ADR 0005](adr/0005-sustaining-exciters-are-passive-reflection-funct.md)).

### Reed

**In real instruments**: a clarinet or saxophone reed, a thin blade of cane
over a slot. Blowing presses it shut against the mouthpiece; the pressure
wave coming back up the tube pushes it open again. It chops the airflow into
pulses in step with the tube.

**Physics**: a pressure-controlled valve that *blows closed*: the harder you
blow, the more it closes, which is what lets it keep a tube oscillating. On
a tube closed at the reed end it produces the odd harmonics (1, 3, 5, …) that
give a clarinet its hollow sound.

**Model**: the reed table from Stanford's Synthesis ToolKit (STK). The
reflection through the reed is `R = clip(0.7 − 0.3·(c − P))`, and the reed
adds `e = (P − c)(1 − R)`, where P is the mouth pressure (0.6 + 0.3 × level)
and c the returning wave. It is always used on a cylinder
([ADR 0017](adr/0017-the-reed-always-plays-a-cylinder.md)): a reed on a cone
does not oscillate in this form.

**Measured**: a breath-blown reed on an air column plays within 2 cents of
the note from C2 to G6.

**What you hear**: clarinet-like on an air column; on a string, a strange
bowed-reed buzz; on a tine, a harmonica.

### Lips

**In real instruments**: a trumpet player's lips, buzzing against a
mouthpiece. Unlike a reed, lips *blow open*: more pressure pushes them apart.
The player tunes the lips close to the note; the tube locks them onto it.

**Physics**: Trombolese's lip model, which was measured and verified in that
project. The lip opening y is a mass on a spring,

> y'' + (ω/Q)·y' + ω²·(y − y₀) = Δp / μ

with Q = 15, a 0.3 mm resting gap, 12 mm width and a mass set so that 12 kPa
would close them. Air flows through the gap by Bernoulli's law,
`U = w·y·√(2|Δp|/ρ)`. Because the pressure the lips feel depends on the
flow they let through, the two are solved together exactly (a quadratic),
which keeps it stable at any pressure.

**Model details**: mouth pressure is 1.5–6 kPa with level. Lips pull the
pitch up (they play about 11 % above their own resonance on a tube), so the
plugin tunes the tube to 0.88 × the note and the lips to 0.92 × the note,
which lands within −9 … +4 cents from C2 to C6. On bars, plates, tines and
membranes the lips and the element are lowered together by the measured pull
(113–148 cents; 50–100 on membranes, depending on stiffness). Through a
windway, the lips become a flute's air jet instead.

**What you hear**: brass. Louder playing is brighter and more brassy (and the
Bell radiator adds to that).

### Hammer

**In real instruments**: a piano hammer: felt over wood, thrown at the
string and bouncing off.

**Physics**: a hammer squashes on contact; the harder it hits, the stiffer
the squashed felt gets and the shorter the contact. A short contact puts
energy into high frequencies (bright); a long one only into low ones (dark).

**Model**: a half-sine push lasting 0.9 ms × the source's softness ×
(1.3 − 0.6 × velocity) ÷ √(material hardness). So a hard note is shorter and
brighter, a soft material (rubber, jelly) is hit more softly, and Felt
damping doubles the contact time.

**What you hear**: a piano-like attack whose brightness follows your
velocity.

### Bow

**In real instruments**: a violin bow. Rosined hair grips the string and
drags it sideways (*stick*), until the string's tension snaps it back
(*slip*); the string then gets caught again. A sharp kink runs round the
string once per cycle ("Helmholtz motion"), which gives the bowed sawtooth
tone.

**Physics**: friction that falls as sliding gets faster. That falling
friction is what feeds energy in. How hard you must press depends on where
you bow: nearer the bridge needs more force (Schelleng's rule).

**Model**: STK's bow table, `e = Δv · (|kΔv| + 0.75)⁻⁴`, where Δv is the bow
speed minus the string's. The slope k is 1.5 × (position/20 %)^0.5 on
strings (nearer the bridge presses harder), 2 on tubes and 3 on bars, plates,
membranes and tines. Bowed strings have no stiffness filter, because the
kink travels at the speed of the high overtones and the stiffness pulled
every bowed note sharp. The remaining pull (3–15 cents, rising with pitch) is
taken out. Bars, plates and membranes use banded waveguides (see below) so
the bow can grip them, and the bow grips a patch rather than a point, so
their high modes are down-weighted.

**Measured**: bowed strings play the right note at 263 of 270 combinations
of material, bow position and note tested. The exceptions are the most
lossless steels bowed at exactly 1/5 or 1/3 of the string, which can flip to
the octave (real violins do something similar, the "whistle" of a badly
placed bow). Move the Excite position a little if it happens.

**What you hear**: a real bowed sound on strings; singing, glass-harmonica
tones on bars and plates; a strange rasp on a bowed air column.

### Plectrum

**In real instruments**: a guitar pick or harpsichord quill pushes the string
aside and lets go.

**Physics**: the string is pulled into a triangle shape and released. The
release is sudden, which is what makes a pluck bright; where you pluck
decides which overtones are missing (plucking at 1/5 of the length removes
the 5th, 10th, 15th…).

**Model**: a force that ramps up for 1.4 ms × softness and then snaps to
zero, plus 2 ms of pick scrape. On a string, the two-segment waveguide puts
the pluck at the Excite position, so the missing overtones come out right.

**What you hear**: guitar, harp, harpsichord.

### Mallet

**In real instruments**: a yarn- or rubber-wrapped ball on a stick: a
marimba or timpani mallet.

**Physics**: a soft, heavy head makes a long contact (several
milliseconds), which gives a round, dark tone.

**Model**: a 4 ms half-sine × softness, then low-passed at 900 Hz, so the
highs are soft.

**What you hear**: marimba, vibraphone, timpani.

### Banded waveguides: letting a bow, reed or lips grip a bar

A bar, plate, membrane or tine is modelled as a set of resonators (see
Vibrating elements). A resonator bank has no travelling waves, and a
sustaining exciter needs them: a bow on a plain resonator bank made no sound
at all, because a sticking bow pushes a constant and resonators ignore
constants. So when a sustaining exciter drives one of these elements, each
mode becomes its own small waveguide: a delay one period of that mode long,
with a narrow filter at the mode's frequency inside. This is Essl and Cook's
*banded waveguide*, as in STK. Three extras, each found by measurement:

- a bow or lip touches a patch, not a point, so mode weights fall as
  `(f₀/f)^0.7` (without it bars and plates locked onto high modes);
- the exciter grips three times as hard while driven, falling back to
  exactly normal as the drive fades, so the note stops when released (a
  permanent ×8 kept ringing after release);
- each mode rings for at least 0.3 s × √(f₀/f) while driven, so leather,
  cling film and cardboard still give the exciter something to push against.

Lips get no split twin modes (see Irregularity), because they cannot choose
between two near-equal resonances.

---

## 5. Vibrating elements

The element sets the pitch. It is always tuned so that its lowest resonance
is the note you play; the material decides everything else.

### String

**In real instruments**: violin, guitar, piano, harp. Tension sets the pitch;
the string's own stiffness makes its overtones slightly sharp.

**Physics**: for an ideal string, overtones are exact multiples of the note.
A real string of diameter d, length L, stiffness E and density ρ, tuned to
f₀, has inharmonicity

> B = π² · E · d² / (64 · ρ · L⁴ · f₀²)

(from the textbook `B = π³Ed⁴/(64TL²)` with the tension that gives f₀).

**Model**: a two-segment waveguide either side of the Excite position. The
string's length follows the note like a piano's scale, `L = 0.65 m ×
2^(−(note − 52)/18)` (4 cm to 2.2 m). Its diameter is 0.8 mm × the material's
*thickness factor*: 1 for metals and nylon, 3–6 for glass, stone, ice, wood
and jelly, because you cannot draw marble into a wire; it would have to be a
rod. Stiffness is four allpass filters in the loop, solved so the overtone
near 5 kHz lands where B says, but never taking more than 40 % of the
loop's delay (short, stiff strings would otherwise have no delay left). The
loss filter is fitted at the fundamental and at that overtone (ADR 0008).

**What you hear**: steel and nylon strings sound like strings; glass, marble
and ice "strings" are bell-like rods (at C4, marble's 10th overtone is more
than half a semitone sharp; see the materials table).

### Membrane

**In real instruments**: drum skins, banjo heads, the membrane of a kazoo.

**Physics**: a stretched circular skin. Its modes are set by the zeros of
Bessel functions: relative to the lowest, 1, 1.59, 2.14, 2.30, 2.65, 2.92…
(inharmonic, which is why most drums have no clear pitch). Where you strike
matters: at the centre only the round, symmetric modes move (a dull thud);
near the edge all of them do (a ringing tone). The lowest mode pushes a lot
of air, so it radiates its energy away quickly.

**Model**: 16 modes from the Bessel table. Each one's strength is its shape
at the strike radius (0.95 − 1.8 × position: small positions strike near the
rim). Stiff materials stretch the overtones slightly (`√(1 + s·r²)`,
s = 0.0003 × E in GPa, at most 0.03: a steel "skin" is less drum-like, more
bell-like). The lowest mode decays three times faster.

**What you hear**: a tom or timpani; with lips, a kazoo; a leather membrane
thuds, a steel one rings.

### Bar

**In real instruments**: xylophone, marimba and glockenspiel bars, tuning
forks' prongs.

**Physics**: a bar free at both ends bends in modes at 1, 2.756, 5.404,
8.933, 13.34, 18.64, 24.81 and 31.87 times the lowest (from the beam
equation's roots βₙL = 4.730, 7.853, 10.996…). The lowest mode has nodes at
22.4 % from each end, which is where real bars are supported by cords.
Striking the middle excites only the symmetric modes; striking off-centre
adds the others.

**Model**: those 8 modes, weighted by the exact beam mode shape at the strike
point (0.5 − 0.6 × position from the centre) and heard at 12 % from the end.
(An early version listened at the nodal point and cancelled its own
fundamental.)

**What you hear**: marimba, xylophone, glockenspiel; with a bow, a singing
vibraphone-like tone.

### Plate

**In real instruments**: bell plates, gongs, cymbals, thunder sheets.

**Physics**: a rectangular plate supported at its edges has modes at
`m² + (n/0.73)²` (for a plate 1 × 0.73 in shape), relative to the lowest:
dense, overlapping and very inharmonic. The shimmer of a gong is many of
these beating against each other.

**Model**: the 20 lowest (m, n) modes, weighted by `sin(mπx)·sin(nπy)` at the
strike point (near the middle for small positions, where the lowest mode
dominates).

**What you hear**: bells, gongs and metallic clangs; with a bow, a glassy
singing tone.

### Reed (tine)

**In real instruments**: a kalimba or music-box tine, an accordion or
harmonica reed: a tongue clamped at one end.

**Physics**: a cantilever. Its modes are at 1, 6.267, 17.55, 34.39, 56.84 and
84.91 times the lowest (βₙL = 1.875, 4.694, 7.855…): the overtones are so far
up that a plucked tine sounds almost pure. Blown, a free reed chops the
airflow, and the chopped air is buzzy and full of harmonics.

**Model**: 6 cantilever modes, weighted by the mode shape at the pluck point
(position measured from the tip). With a sustaining exciter, the chopped
airflow is added: `0.6 × drive × tanh(4c)`.

**What you hear**: plucked, a kalimba or music box; blown, an accordion or
harmonica.

### Air column

**In real instruments**: the air inside a clarinet, trumpet, flute or organ
pipe. The air itself is what vibrates; the tube just holds it.

**Physics**: a pressure wave runs up and down the tube. A tube closed at one
end (a clarinet, closed by the reed) has odd harmonics; open at both ends
(a flute) or conical (a saxophone) it has all of them. The air loses energy
to a thin layer rubbing on the wall (the *boundary layer*) and at the open
end, where some sound escapes.

**Model**: a waveguide whose loss is Trombolese's air physics:

- boundary-layer attenuation `α = √(πf) · BLC / (a · c)`, with
  `BLC = √ν + (γ − 1)√(ν/Pr)` for air at 20 °C;
- radiation loss at the open end, `exp(−(ka)²/2)`;
- a bore radius of 7 mm at middle C, wider for low notes
  (`a = 7 mm × (262/f₀)^0.3`, 3–30 mm);
- a wall factor from the material: rougher walls (clay, paper, cardboard)
  and floppier ones (rubber, jelly) lose more, capped at 2.2 × a smooth
  wall so they still speak.

Each exciter uses the tube configuration that makes it work: a reed on a
closed cylinder, lips on an open tube, the air jet on STK's overblown flute
layout, a bow on a closed tube, strikes on either depending on the coupler.

**What you hear**: clarinets, trumpets, flutes, and wind instruments of any
material.

---

## 6. Materials

### What the numbers mean

| Number | What it is | What it does |
|---|---|---|
| **E** (stiffness, GPa) | Young's modulus: how hard it is to stretch or bend | stiffer strings are more inharmonic; stiffer membranes stretch their overtones; stiffer-for-its-weight bodies have higher resonances |
| **ρ** (density, kg/m³) | how heavy it is | heavier means less inharmonic and lower body resonances |
| **η** (loss factor at 1 kHz) | how much vibration turns to heat each cycle | how long it rings: T60 = 2.2/(f·η) |
| **slope** | how η grows with frequency | woods and soft materials lose their highs fastest (dark) |
| **irregularity** | bubbles, cracks, grain, creases | splits every mode into a slowly beating pair |
| **wall roughness** | the inside of a tube | air columns of rough materials lose more |
| **hardness** | how hard a strike on it is | harder materials give shorter, brighter strikes |
| **thickness** | how thick a string of it must be | brittle materials become thick rods |
| **t_max** | the longest ring the mounting allows | caps the ring of very clean materials |
| **wobble, rattle, crackle** | special behaviours | jelly wobbles in pitch; tin, chain link, car panel and film rattle; foil crackles |

### What each material does

Derived numbers, calculated from the plugin's own table: ring time of a
mode at middle C (262 Hz) and at 2 kHz, before the Decay slider, damping,
coupler or age; how far a C4 string's 10th overtone is pushed sharp by
stiffness (in cents); where a soundbox made of it puts its first top-plate
resonance (spruce: 204 Hz); and the air-column wall factor.

| Material | Ring at 262 Hz | Ring at 2 kHz | C4 string, 10th overtone | Soundbox top mode | Air wall factor |
|---|---|---|---|---|---|
| Steel | 10.7 s | 2.8 s | +59 c | 206 Hz | 1.0 |
| Brass | 6.0 s | 1.2 s | +30 c | 147 Hz | 1.0 |
| Bronze | 10.9 s | 2.3 s | +30 c | 145 Hz | 1.0 |
| Aluminium | 9.7 s | 2.8 s | +128 c | 206 Hz | 1.0 |
| Gold | 2.3 s | 0.3 s | +10 c | 83 Hz | 1.0 |
| Glass | 5.5 s | 1.1 s | +458 c | 216 Hz | 0.9 |
| Crystal | 23 s | 9.4 s | +486 c | 224 Hz | 0.9 |
| Ice | 2.7 s | 0.34 s | +313 c | 128 Hz | 0.81 |
| Marble | 2.1 s | 0.30 s | +557 c | 184 Hz | 1.0 |
| Clay | 1.4 s | 0.17 s | +549 c | 182 Hz | 2.2 |
| Spruce | 1.1 s | 0.10 s | +419 c | 204 Hz | 1.5 |
| Rosewood | 1.3 s | 0.13 s | +333 c | 177 Hz | 1.4 |
| Bamboo | 1.0 s | 0.09 s | +348 c | 218 Hz | 1.3 |
| Bone | 0.74 s | 0.07 s | +184 c | 126 Hz | 1.6 |
| Gut | 1.8 s | 0.13 s | +12 c | 72 Hz | 1.35 |
| Nylon | 2.4 s | 0.19 s | +11 c | 71 Hz | 1.05 |
| Carbon fibre | 3.3 s | 0.45 s | +398 c | 395 Hz | 1.0 |
| Rubber | 0.28 s | 0.02 s | 0 c | 71 Hz | 2.2 |
| Paper | 0.31 s | 0.03 s | +88 c | 84 Hz | 2.2 |
| Jelly | 0.20 s | 0.02 s | 0 c | 71 Hz | 2.2 |
| Plastic | 0.77 s | 0.09 s | +21 c | 71 Hz | 1.07 |
| PVC | 0.44 s | 0.04 s | +20 c | 71 Hz | 1.05 |
| Wood | 1.2 s | 0.11 s | +328 c | 175 Hz | 1.4 |
| Leather | 0.25 s | 0.02 s | +2 c | 71 Hz | 2.2 |
| Cardboard | 0.25 s | 0.02 s | +88 c | 84 Hz | 2.2 |
| Foil | 0.40 s | 0.05 s | +59 c | 206 Hz | 1.5 |
| Cling film | 0.20 s | 0.02 s | +8 c | 71 Hz | 2.2 |
| Tin | 1.3 s | 0.24 s | +61 c | 210 Hz | 1.2 |
| Car panel | 1.4 s | 0.30 s | +61 c | 210 Hz | 1.0 |
| Chain link | 2.5 s | 0.58 s | +59 c | 206 Hz | 1.0 |
| Handpan steel | 2.8 s | 0.44 s | +61 c | 210 Hz | 1.0 |

(71 Hz is the lower limit of the soundbox's stiffness scaling; very soft
materials all sit there.)

### Metals

Metals are stiff, heavy and very low-loss: they ring. Their differences are
mostly in loss and density.

- **Steel** (E 200 GPa, ρ 7850, η 0.0003). The benchmark: strings, wires,
  bells. Rings for over ten seconds at middle C, bright and pure. A C4 steel
  string is slightly inharmonic (+59 c at the 10th overtone), like a real
  piano string.
- **Brass** (110 GPa, 8500, η 0.0008). Softer and a little lossier than
  steel: a warmer, shorter ring. Its soundbox resonances sit lower (heavy for
  its stiffness).
- **Bronze** (110 GPa, 8700, η 0.0004). Bell metal: as long-ringing as steel
  (a 20 s maximum ring, the longest of the metals), and slightly irregular
  (0.004), which gives a bell's uneven shimmer.
- **Aluminium** (69 GPa, 2700, η 0.0003). Light and stiff for its weight:
  clear and long-ringing; as a string it must be 1.5× thicker than steel,
  so it is noticeably more inharmonic (+128 c).
- **Gold** (79 GPa, 19 300, η 0.003). Very heavy and soft for a metal, and
  lossy: rich but dull, stops quickly (2.3 s at middle C, 0.3 s at 2 kHz). Its
  soundbox resonances are very low (83 Hz). Soft, so strikes are gentle
  (hardness 0.5).
- **Tin** (galvanised steel sheet, as in a corrugated roof; 207 GPa, 7850,
  η 0.004). Like steel, but the zinc coating, ribs and fixings make it lossy
  (1.3 s) and uneven (irregularity 0.03), and **its loose fixings rattle**
  when played hard (rattle 0.7). From Reverberator's tin roof.
- **Car panel** (painted steel; 207 GPa, η 0.003). The paint damps it, so it
  clanks rather than rings (1.4 s), with a little **clank** rattle (0.3).
  From Reverberator's car body panel.
- **Chain link** (steel wire mesh; 200 GPa, η 0.0015). A metallic twang
  (2.5 s) with a strong **jangle** as the links rattle (1.0), and very
  uneven (0.03). From Reverberator's chain link fence.
- **Handpan steel** (nitrided steel, 207 GPa, η 0.0022, irregularity 0.001).
  Hammered and hardened: sweet, pure and even, with a long maximum ring (8 s).
  From Reverberator's steel handpan.
- **Foil** (crumpled aluminium; 69 GPa, η 0.02). Every crease splits the
  ring (irregularity 0.05, the most irregular solid) and damps it (0.4 s), and
  it **crackles** at random when it vibrates hard. From Reverberator's
  aluminium foil.

### Glass and stone

Stiff, light for their stiffness, and brittle: as strings they have to be
thick rods (3–4× the diameter), so they are strongly inharmonic and
bell-like.

- **Glass** (70 GPa, 2500, η 0.0008). Bright, glassy and long (5.5 s). A
  "glass string" is a rod whose 10th overtone is more than four semitones
  sharp: a glockenspiel-like ring.
- **Crystal** (quartz; 80 GPa, 2650, η 0.00008). Almost no internal loss:
  23 seconds at middle C and 9 s even at 2 kHz, the longest ring of all. The
  rods are as bell-like as glass.
- **Ice** (9 GPa, 917, η 0.0025, irregularity 0.02). Soft for a solid, and full
  of bubbles and cracks: each resonance splits into a beating pair. Rings
  2.7 s. As a string, a thick ice rod (+313 c).
- **Marble** (55 GPa, 2700, η 0.003, irregularity 0.012). Stiff, heavy and a
  little lossy: short, stony and pitched (2.1 s), with gentle beating from
  its grain. The most inharmonic strings of all (+557 c).
- **Clay** (fired earthenware; 40 GPa, 2000, η 0.005, irregularity 0.02,
  rough 2.5). Earthy and quick to fade (1.4 s); porous, so a clay air column is
  as lossy as the wall factor allows (2.2).

### Woods

Woods are light, stiff along the grain and lose their high frequencies fast
(slope 0.4): warm, woody, short-ringing highs, strongly uneven grain
(irregularity 0.015–0.02). As strings they are thick rods.

- **Spruce** (11 GPa, 440, η 0.008). The classic soundboard wood: very light
  for its stiffness, so a spruce soundbox sits exactly at the guitar's
  measured resonances (204 Hz). Its highs die in 0.1 s.
- **Rosewood** (16 GPa, 850, η 0.006). Dense hardwood, the marimba-bar wood:
  warm and woody (1.3 s).
- **Bamboo** (20 GPa, 700, η 0.009). Light and springy: soft and breathy
  (1.0 s). The default instrument is a bamboo saxophone.
- **Wood** (plain hardwood, like maple; 12 GPa, 650, η 0.007). Warm, woody,
  medium decay (1.2 s), a little harder than spruce.

### Plastics

- **Plastic** (ABS, as in toys and recorders; 2.3 GPa, 1050, η 0.01). Soft
  and fairly lossy: a dull, toy-like knock (0.8 s). Tubes of it are smooth
  (wall 1.07), so a plastic recorder speaks well.
- **PVC** (plumbing pipe; 3 GPa, 1400, η 0.022). Dull when struck (0.44 s),
  but smooth inside, so a PVC air column still plays cleanly. From
  Reverberator's PVC pipe (which used η 0.03).
- **Nylon** (3 GPa, 1140, η 0.004). The classical-guitar string: soft,
  smooth and round (2.4 s), almost harmonic (+11 c).
- **Carbon fibre** (150 GPa, 1600, η 0.002). Very stiff and light: bright and
  precise, and its soundbox resonances sit high (395 Hz, the highest).
- **Cling film** (polyethylene film; 0.2 GPa, 920, η 0.05). Floppy and lossy
  (0.2 s), and **it slaps and buzzes** like a kazoo when played hard (rattle
  1.0). From Reverberator's cling film (which used η 0.12, mostly air
  loading).

### Soft and natural

These are very soft and lossy. They thud rather than ring, which is right;
they were made somewhat less lossy than the real things so that bows, reeds
and lips can still play them
([ADR 0015](adr/0015-playable-beats-physically-exact-for-extreme-mate.md)).

- **Bone** (18 GPa, 1900, η 0.012). Hard but lossy: dry and clicky (0.7 s).
- **Gut** (4 GPa, 1300, η 0.006). Traditional violin and harp string: warm
  and mellow (1.8 s), almost harmonic.
- **Leather** (0.1 GPa, 900, η 0.04). A hide: a dead, thumpy thud (0.25 s),
  sagging slightly in pitch (wobble 0.1). From Reverberator's leather (which
  used η 0.06).
- **Rubber** (0.05 GPa, 1100, η 0.035, wobble 0.4). Absurdly soft: thuds,
  and wobbles in pitch when played hard.
- **Paper** (3 GPa, 700, η 0.03, rough 4.0). Light, rough and floppy: a
  papery buzz that dies at once.
- **Cardboard** (paperboard; 3 GPa, 700, η 0.04, rough 4.0). A honky, papery
  thud; the toilet-roll tube of Reverberator.
- **Jelly** (0.00005 GPa, i.e. 50 kPa; 1050, η 0.045, wobble 1.0). Hardly a
  solid at all: a 0.2 s thud and a pitch that wobbles up to 0.3 semitone with
  level, plus a slow drift.

### Irregularity, wobble, rattle and crackle, in more detail

- **Irregularity**: above 0.004, every mode gets a twin, detuned by
  `irregularity × (0.6 + 0.4 × a fixed random number)` (0.2–5 %), at 60 %
  strength. Two nearly equal frequencies beat, slowly for small detunes,
  giving the shimmer of ice, bells and gongs.
- **Wobble**: jelly (1.0), rubber (0.4), cling film (0.3), paper (0.15) and
  leather (0.1) wobble in pitch by up to 0.3 semitone × wobble with loudness,
  plus a slow drift: soft materials stretch as they move.
- **Rattle**: after level matching, whatever exceeds a gap of ±0.2 is
  high-passed and added back × 2.5 × the material's rattle. Soft notes stay
  below the gap; loud ones slap against their fixings. Measured on a tin bar:
  high-frequency energy −69 dB at velocity 40 (the same as without rattle),
  −41 dB at 80, −39 dB at 127.
- **Crackle**: foil pops at random, about 900 times a second at full
  loudness, each pop ±(0.05 + level), high-passed.

### Every Reverberator option

Reverberator's options are objects. Their materials here: chain link fence →
Chain link; ice sheet → Ice; tension wire, piano and guitar strings, metal
barrel → Steel; gong → Bronze; PVC pipe → PVC; glass pane and wine bottle →
Glass; marble slab → Marble; car body panel → Car panel; leather → Leather;
violin string → Gut or Steel; steel handpan → Handpan steel; toilet roll tube
→ Cardboard; aluminium foil → Foil; cling film → Cling film; corrugated tin
roof → Tin.

---

## 7. Resonators

A resonator is what the vibration fills: the body of a guitar, the tube under
a marimba bar, the bore of a saxophone. The **Resonator amount** slider sets
how much of it you hear against the bare element; the **resonator material**
decides how its walls behave; **Size** scales it.

### Bore

**In real instruments**: a saxophone's or oboe's conical tube, which
reinforces every harmonic of the note.

**Model**: a comb resonator on each note, tuned to the note's period, so it
reinforces harmonics 1, 2, 3, 4…: `y = x + g·lowpass(y delayed one period)`,
its ring from the resonator material (at most 0.5 s, × 0.6, ÷ wall
roughness), losing its highs faster. With a reed, the reed always plays a
clarinet-like cylinder, and the Bore adds the even harmonics a cone would
have.

**What you hear**: a fuller, rounder wind tone; on strings and bars, a hollow
tubular reinforcement.

### Soundbox

**In real instruments**: a guitar or violin body: a hollow box whose air and
wooden plates resonate.

**Model**: twelve resonances measured on a guitar body (98, 204, 226, 381,
437, 552, 650, 780, 920, 1100, 1450 and 2000 Hz; the same list Reverberator
uses). The first is the air inside (the Helmholtz mode), so it stays at
98 Hz whatever the material. The others are the wooden plates, so they move
with the material's stiffness-to-weight ratio, `√((E/ρ)/(E/ρ)_spruce)`
(between 0.35 and 2.5; see the materials table), and all move with 1/Size.
Each plate mode's sharpness comes from the material's loss plus a little
radiation (Q = 1/(η(f) + 0.018)).

**What you hear**: a guitar-like body. A metal soundbox rings, a rubber one
is dead and low, a carbon one is bright and high.

### Pipe

**In real instruments**: the tubes hanging under marimba and vibraphone bars:
closed at the bottom, a quarter wavelength long.

**Model**: a comb on each note tuned to half its period with a sign flip, so
it reinforces the odd harmonics (1, 3, 5…), as a stopped pipe does.

**What you hear**: the warm "bloom" of a marimba. With a bar it reinforces the
fundamental strongly (the Marble Marimba preset).

### Cavity

**In real instruments**: a gourd (a mbira's or a balafon's), a bottle, a
drum's shell: a pocket of air with a small opening.

**Model**: a Helmholtz resonance (the "blowing over a bottle" note) at
140 Hz / Size, three higher cavity modes (640, 1060, 1480 Hz / Size), and six
ring modes of the wall in the resonator material (the bending modes of a
cylinder, `n(n² − 1)/√(n² + 1)` for n = 2…7), whose sharpness comes from the
material.

**What you hear**: a hollow boom, with the walls ringing: glassy in glass,
dull in clay.

### Body

**In real instruments**: the solid body of an electric guitar, the block of a
wood block, the metal of a bell.

**Model**: 16 plate modes of the resonator material, starting at 280 Hz ×
the stiffness scale / Size, with the material's own sharpness.

**What you hear**: the material's own voice added to every note: stone
clinks, glass shimmers, metal rings.

---

## 8. Couplers

A coupler carries the vibration from the element into the resonator. It
colours the sound on the way, and a strong coupler also drains energy from
the element, which then rings for less time.

- **Bridge** (violin, guitar). Real bridges have a resonance around
  2–3 kHz, the "bridge hill", which gives a violin its brilliance. Model: a
  +6 dB peak at 2.5 kHz (Q 1.2), a high-pass at 90 Hz; the element's ring ×
  0.9.
- **Soundpost** (the post inside a violin that joins top and back). It
  couples the element strongly into the body. Model: a +6 dB peak at 450 Hz,
  a low-pass at 7 kHz; the element's ring × 0.75. Warm, woody, shorter.
- **Mouthpiece** (brass, clarinet). The small cup and narrow throat of a
  mouthpiece form their own resonance, which gives brass its vocal, brassy
  formant. Model: a +8 dB peak at 800 Hz / √Size (Q 2), a low-pass at 9 kHz.
- **Windway** (recorder, organ flue pipe). A narrow duct that shapes breath
  into a thin jet, which then oscillates across a sharp edge. Model: a +3 dB
  peak at 1.8 kHz, a high-pass at 200 Hz, breath hiss, and it turns lips or a
  bow into STK's flute air jet (the jet is delayed by 0.32 of the tube's loop
  and bent by a cubic; the tube is tuned to 2/3 of the note because a jet
  overblows). A reed stays a reed (a windcap, like a crumhorn's).

---

## 9. Radiators

A radiator is how the sound gets into the air. Air is hard to push with a
small vibrating object; radiators are large, shaped surfaces or openings that
couple it to the room.

- **Bell** (brass). A flared bell lets high frequencies out easily and
  reflects low ones back into the tube; at loud levels the wave steepens and
  the sound goes brassy. Model: a high-pass at 180 Hz, a +4 dB peak at 1.5 kHz,
  and soft saturation.
- **Soundboard** (piano, harp). A big board radiates efficiently and spreads
  the sound out in time and space. Model: a +3 dB warmth at 250 Hz, a low-pass
  at 7.5 kHz, and four allpass diffusers on each side (3–12 ms × Size, at
  0.6), mixed with the direct sound.
- **Drumhead** (banjo). A skin under the bridge rings along with the strings,
  twangy, with a low boom. Model: a high-pass at 120 Hz, a +6 dB peak at
  2.2 kHz (Q 1.5), a low-pass at 9 kHz, and eight membrane modes of its own
  (170 Hz / Size × Bessel ratios, ringing 0.25 s) driven by the sound.
- **Cone** (loudspeaker). An electric instrument's amplifier and speaker:
  band-limited, with a cone break-up peak and some amplifier grit. Model: a
  high-pass at 90 Hz, a low-pass at 5 kHz, a +4 dB peak at 2.8 kHz (Q 3), and
  saturation.

---

## 10. Frequency controls

How the pitch changes from note to note. Most of the difference shows in
**Mono** play mode, where one note follows another the way it does on the
real instrument.

- **Fret** (guitar). Fixed semitone stops. In Mono, a new note while one is
  held is a hammer-on: the pitch jumps and the string is re-struck lightly
  (35 %) rather than plucked afresh.
- **Tone hole** (woodwinds). A row of holes: harmonics above the holes'
  *cut-off frequency* leak out of them rather than reflecting, which is part
  of a woodwind's sound. Model: the ring time of the 5 kHz partial is reduced
  by `1/(1 + (f/f_c)²)` (never below 0.3 ×), with f_c the larger of 1.5 kHz
  and 2.2 × the note. In Mono, notes change with a quick 12 ms blip as the
  keys move.
- **Valve** (trumpet). Valves add lengths of tube. The combinations are a
  compromise, and some notes are famously sharp: the plugin plays the notes a
  trumpet fingers with valves 1+3 (+12 c), 1+2+3 (+22 c) and 2 (+6 c) sharp.
  In Mono, a deeper 28 ms blip between notes.
- **Slide** (trombone). A continuous length: every note glides from the last
  one (Glide time), in Poly mode too. Pitch bend covers 7 semitones.
- **Key** (piano). One element per key: every note fresh and independent; in
  Mono, every note re-strikes.

---

## 11. Tuning mechanisms

How well the instrument holds its tuning.

- **Peg** (violin). Friction pegs never hold perfectly: each note is off by
  its own fixed amount (up to ±8 cents) and drifts slowly (±3 cents).
- **Tuning pin** (piano). Piano tuners stretch the octaves, because stiff
  strings' overtones are sharp and the ear expects the octaves to match them.
  Model: `2.2 · d·|d|` cents, where d is octaves from A4: the bass a little
  flat, the treble a little sharp (about −35 c at the lowest A, +23 c at the
  top C).
- **Machine head** (guitar). Geared tuners: exact equal temperament.
- **Slide** (a brass tuning slide). Each note starts 30 cents flat and
  settles into tune (90 ms), the way a player lips a note into place.

---

## 12. Damping

What touches the element to quieten it, while it plays and when you let go.
The sustain pedal (CC64) holds every note, whatever the damping.

| Damping | While the note is held | When you let go |
|---|---|---|
| **Damper** (piano felt) | nothing | stops in 0.12 s |
| **Mute** (brass mute) | highs shortened by `1/(1 + f/2.5 kHz)` | fades in 0.4 s |
| **Palm** (palm muting) | highs shortened by `1/(1 + f/1.5 kHz)`, and nothing rings longer than 0.35 s | stops in 0.08 s |
| **Felt** (felt against the element) | highs strongly shortened, `1/√(1 + (f/600)²)`; strikes twice as soft | fades in 0.3 s |
| **Hand** (a hand in a horn's bell) | highs shortened by `1/(1 + f/1.2 kHz)`, 15 cents flat | fades in 0.2 s |

"Stops in 0.12 s" is the ring time after release, applied to every mode or to
the loop (never lengthening what was already shorter).

---

## 13. Modulation and control

What the mod wheel (CC1) does, and which pedals work. In every mode:
velocity, pitch bend (2 semitones, 7 with a Slide), aftertouch (+40 %
pressure), breath controller (CC2), expression (CC11), sustain (CC64) and
soft (CC67) pedals.

- **Keywork**: plain keys; the mod wheel blows or bows up to 30 % harder.
- **Pedals**: the mod wheel lifts the dampers, so released notes ring on (up
  to 20 × longer); the soft pedal makes new notes quieter and gentler (× 0.6).
- **Valves**: the mod wheel half-presses a valve: the pitch sags by up to 40
  cents and the level drops 30 %, the stuffy sound of a half-valved trumpet.
- **Levers**: the mod wheel bends notes up by up to a whole tone, like a
  pedal-steel lever or a B-bender.
- **Electronics**: the mod wheel adds vibrato (±30 cents) and tremolo (30 %)
  at 5.5 Hz, like a vibraphone's motor.

---

## 14. Age and rust

One slider, from new (0 %) to found in a skip (100 %), that wears the whole
instrument out. It does not add a new effect; it turns up physics already in
the model ([ADR 0018](adr/0018-age-is-one-macro-over-the-existing-physics.md)):

- **Loss**: rust, cracks and tired joints turn more vibration into heat,
  especially at high frequencies. The loss factor is multiplied by
  `1 + a² × (2 + 3 × f/2 kHz)` in the element and in the soundbox, cavity and
  body, and the longest possible ring is divided by `1 + 1.5a`. At 100 %, a
  Marble Marimba note falls by 20 dB in 0.35 s instead of 0.85 s; the Golden
  Piano in 0.1 s instead of 0.75 s.
- **Unevenness**: 0.015 × a is added to the irregularity, so from about 27 %
  every material has split, beating modes.
- **Tuning**: each note is off by its own fixed amount (up to ±25 cents × a)
  and wanders slowly (up to 0.12 semitone × a²).
- **Loose parts**: rattle of at least 0.6 × a^1.5 and rusty grit (crackle)
  of at least 0.25 × a², through the same gap as tin's rattle, so soft notes
  stay clean.
- **Leaks**: a leaky instrument hisses: drive noise + 6 % × a, and a hiss of
  4 % × a² × drive from every sustaining element. Air-column walls are
  rougher (× (1 + 0.8a)).
- **Level**: struck, plucked and bowed instruments get up to 6 dB back at
  100 % (their ring shortens); reeds and lips keep themselves going and get
  none. Measured loudness, new / half / fully aged: saxophone −18.4 / −19.2 /
  −19.3 LUFS, trumpet −19.4 / −19.2 / −18.6, violin −10.9 / −11.1 / −12.0,
  marimba −9.8 / −10.8 / −13.8.

The window's pictures rust (metals) or get grimy (everything else), material
swatches get rust spots, and the ring times shown for a material include the
age.

---

## 15. After the parts: level, limiter, stereo

- **Level matching**: every exciter × element, for a steady source and for a
  single push, and every resonator, coupler and radiator, has a measured
  loudness trim, so swapping parts doesn't jump in volume (within 0.2 dB,
  except three combinations at the ±20 dB cap). Materials are not trimmed: a
  lossy material really is quieter when struck
  ([ADR 0011](adr/0011-level-match-by-measurement-then-limit.md)).
- **Limiter**: an instant peak limiter at −3 dBFS, then a soft ceiling, keep
  chords and rattles from clipping.
- **Stereo**: notes are spread by pitch (low left, high right, gently), and
  the body modes, soundboard and drumhead have their own left/right patterns.

---

## 16. Sources

- Julius O. Smith, *Physical Audio Signal Processing*: digital waveguides,
  scattering junctions, loss filters.
- Perry Cook and Gary Scavone, *The Synthesis ToolKit (STK)*: the clarinet
  reed table, bowed-string bow table and layout, flute jet, banded waveguides.
- Georg Essl and Perry Cook, "Banded Waveguides" (ICMC 1999).
- Neville Fletcher and Thomas Rossing, *The Physics of Musical Instruments*:
  mode frequencies of bars, plates, membranes and cantilevers, inharmonicity,
  the bridge hill, tone-hole cut-off, stretched piano tuning.
- John Schelleng, "The bowed string and the player" (JASA 1973): bow force
  against bow position.
- Trombolese (this user's project): the lip valve, air constants at 20 °C,
  boundary-layer attenuation, measuring and removing the exciter's pull.
- Reverberator (this user's project): the material table, loss factor → ring
  time, stiff-string inharmonicity, phase-exact tuning and the dispersion
  budget, the guitar-body resonances, contact rattle and foil crinkle, the
  ysfx test rig.
