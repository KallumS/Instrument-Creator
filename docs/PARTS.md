# The parts, and the physics behind each

Everything here is in `Instrument-Creator.jsfx`. Numbers are SI unless stated.
"Measured" means measured with the headless rig in `tools/` (see
`SESSION-LOG.md`), not taken from a book.

## The signal path

```
energy source ──> exciter <──> vibrating element ──> (per voice) bore / pipe
   drive envelope     │   junction                         │
                      └── contact signal c ────────────────┘
                                                            ▼
            coupler filter ──> shared body (soundbox / cavity / body) ──> radiator ──> limiter
```

The exciter and the element form a feedback loop: the exciter reads the
element's motion at the contact point (`c`) and pushes back (`e`). Everything
after the element is linear and feed-forward, so it is shared by all voices
and cannot make the instrument unstable (Reverberator ADR 0008).

## Energy source

Each source sets five things (`energy_params`): whether the supply is steady,
how fast it arrives and stops, turbulence noise, and, for single pushes, a
hold and decay.

| Source | Steady | Attack | Noise | Strikes/s (with a striking exciter) | Single push (hold, decay) |
|---|---|---|---|---|---|
| Breath | yes | 35 ms | 3.5 % | 11 ± 25 % | |
| Bow | yes | 80 ms | 2.5 % | 15 ± 45 % | |
| Finger | no | 4 ms | 1 % | | 150 ms, 0.5 s |
| Plectrum | no | 1.5 ms | 2 % | | 100 ms, 0.35 s |
| Hammer | no | 0.8 ms | 1 % | | 60 ms, 0.25 s |
| Electricity | yes | 3 ms | 0 | 25, exact | |

Velocity maps to level as `force × velocity^k`, with k from 0.7 (electricity)
to 1.8 (hammer).

## Exciter

Sustaining exciters use reflection-function forms that stay passive at any
drive: each returns what it adds to the wave leaving the junction, `e`, from
the wave arriving, `c`.

- **Reed** (STK clarinet): `R = clip(0.7 − 0.3 (c − P))`, `e = (P − c)(1 − R)`,
  with mouth pressure `P = 0.6 + 0.3 × level`.
- **Lips** (Trombolese `reed.py`, the outward-striking valve): opening `y`
  obeys `y'' + (ω/Q) y' + ω²(y − y₀) = Δp/μ` with Q = 15, rest opening
  0.3 mm, width 12 mm, closing pressure 12 kPa; flow
  `U = w·y·sgn(Δp)·√(2|Δp|/ρ)` is solved exactly against the bore impedance
  (a quadratic in U). Mouth pressure 1.5–6 kPa.
- **Bow** (STK bowed string): `e = Δv · (|2Δv| + 0.75)⁻⁴` (slope 3 on bars,
  plates, membranes and tines), bow speed `0.03 + 0.2 × level`.
- **Air jet** (STK flute; a windway turns lips or a bow into this): jet delay
  0.32 × the loop, `e = clip(j(j² − 1)) − c/2`. The bore is tuned to 2/3 of the
  note because the jet overblows to its second resonance, as in STK.
- **Hammer, plectrum, mallet**: shaped force pulses. Duration 0.9 / 1.4 / 4 ms
  × the source's softness × (1.3 − 0.6 × velocity) / √(material hardness);
  twice as long with Felt damping. A hammer and mallet are half-sines (the
  mallet low-passed), a plectrum a ramp that snaps off, plus 2 ms of pick noise.

### Pitch pull, measured and taken out

A sustaining exciter moves the pitch away from the element's own resonance.
Each pull was measured across the keyboard and is corrected by retuning:

| Combination | Pull before | Correction | After (C2–G6) |
|---|---|---|---|
| Lips, air column | +181 c | bore × 0.88, lips at 0.92 × note | −9 … +4 c (−18 c at C2) |
| Lips, bar / plate / membrane / tine | +41 … +148 c | lips and element lowered together by 124 / 113 / 41 / 148 c | ±2 c at C4 |
| Jet | +6 … +26 c, rising with pitch | 16 + 7·log₂(f/262) c | −3 … 0 c |
| Bow, string | +3 … +15 c | 6 + 5·log₂(f/262) c | +1 … +7 c |
| Reed, air column | none | | −2 … +1 c |

Lowering the lips alone does not work: below about 0.9 × the resonance the
valve stops oscillating (as Trombolese found). Lowering the element alone made
the membrane *sharper*, because the lips, not the element, set the pitch there.

## Vibrating element

### String (waveguide)

Two delay segments either side of the exciter (STK bowed-string layout), so
the excite position works for bows, plucks and hammers. The bridge end holds
the loss filter and the stiffness allpasses.

- Length `L = 0.65 · 2^(−(note − 52)/18)` m (clamped 4 cm – 2.2 m), diameter
  0.8 mm × the material's thickness factor (1 for metals, 3–6 for glass, ice,
  stone, wood, jelly: you cannot draw marble into wire).
- Inharmonicity `B = π² E d² / (64 ρ L⁴ f₀²)` (from `B = π³Ed⁴/64TL²` with
  the tension that gives f₀), capped at 0.05.
- Dispersion: four first-order allpasses solved for the group-delay difference
  between the fundamental and the partial near 5 kHz (Reverberator
  `disp_solve`), limited so they take at most 40 % of the loop's phase at the
  fundamental. Bowed strings have none: the stick-slip corner travels at the
  group delay of the highs, and dispersion pulled every bowed note sharp.
- Losses from the material: T60 = 1 / (1/t_max + f·η(f)/2.2), with
  `η(f) = η₁ₖ (f/1 kHz)^slope`, at the fundamental and at the 5 kHz partial;
  a one-pole fitted at those two frequencies.
- Lips and air jets drive a string from its end, as on a tube.

### Air column (waveguide)

- Radius `a = 7 mm × (262/f₀)^0.3`, clamped 3–30 mm.
- Per-pass loss `exp(−c·T·rough·α(f)) · exp(−(ka)²/2)`, with Trombolese's
  boundary-layer attenuation `α = √(πf)·BLC/(a c)`,
  `BLC = √ν + (γ−1)√(ν/Pr)`, and the radiation loss of the open end.
- Wall factor: the material's roughness × (1 + 0.15 × min(6, 1 GPa/E)), capped
  at 2.2, so paper, rubber and jelly tubes are lossy but still speak.
- Loop configurations (sign of the round trip, and its length in half-periods):

| Exciter | Loop | Why |
|---|---|---|
| Reed | −, ½ period | a cylinder closed at the reed: odd harmonics (clarinet). A cone (+) does not oscillate in this reflection form. |
| Lips | +, 1 period, DC blocker | all harmonics, brass-like |
| Jet | −, 1½ periods, DC blocker | STK flute (overblown) |
| Bow | −, ½ period | the only configuration that oscillated |
| Strikes | − ½ (+1 with a windway or bore) | closed or open tube |

### Membrane, bar, plate, tine (modes)

Each mode is a two-pole bandpass `y = a₁y₁ − a₂y₂ + (w/N)(e − e₂)`, which
matches a waveguide of the same decay: its peak admittance `b/(1−r)` equals
the loop's `1/(1−g)` when `b = 1/N` (N = samples per period). Modes above
18 kHz or 0.45 × the sample rate are dropped; at most 24.

| Element | Mode frequencies (× f₀) | Excite position mapping |
|---|---|---|
| Membrane | Bessel zeros j_mn / 2.4048 (16 modes), stretched by `√(1 + s·r²)`, s = 0.0003 × E[GPa] ≤ 0.03; the (0,1) mode decays 3× faster (it radiates hard) | radius 0.95 − 1.8 × position |
| Bar | free-free beam (βₙ/4.73)²: 1, 2.756, 5.404, 8.933, 13.34, 18.64, 24.81, 31.87 | 0.5 − 0.6 × position from the middle; pickup at 12 % |
| Plate | simply supported, aspect 1 : 0.73, the 20 lowest m² + (n/0.73)² | (0.5 − 0.8p, 0.5 − 0.7p) |
| Tine | clamped-free cantilever (βₙ/1.875)²: 1, 6.267, 17.55, 34.39, 56.84, 84.91 | 1 − position from the tip |

Irregular materials (irregularity > 0.004: ice, marble, clay, woods, bone,
jelly...) add a twin to every mode, detuned by `irr × (0.6 + 0.4 × hash)`, at
60 % amplitude: a slowly beating pair.

A blown tine adds the chopped airflow, `0.6 × drive × tanh(4c)`: the buzz of
a harmonica.

### Banded waveguides (a sustaining exciter on a modal element)

A plain bank of resonators has nothing for a reflection-function exciter to
scatter: a bow's steady push just sits at DC and the bandpasses reject it.
So when a reed, lips, bow or jet drives a membrane, bar, plate or tine, each
mode becomes a delay loop one period long with a unit-peak bandpass inside
(Essl & Cook; STK `BandedWG`). The contact weights fall as `(f₀/f)^0.7`
(a bow or lip touches a patch, which averages out the high modes), and the
exciter's grip is tripled while driven, returning to exactly passive as the
drive fades. Without the extra grip bamboo bars would not bow at all (a real
marimba bar barely does); with a permanent ×8 the loop kept ringing after
release.

## Materials

| Material | E (GPa) | ρ (kg/m³) | η at 1 kHz | slope | irregular | wall rough | hardness | thickness | t_max (s) |
|---|---|---|---|---|---|---|---|---|---|
| Steel | 200 | 7850 | 0.0003 | 0.1 | 0.001 | 1.0 | 1.0 | 1 | 16 |
| Brass | 110 | 8500 | 0.0008 | 0.1 | 0.002 | 1.0 | 0.9 | 1 | 12 |
| Bronze | 110 | 8700 | 0.0004 | 0.1 | 0.004 | 1.0 | 0.95 | 1 | 20 |
| Aluminium | 69 | 2700 | 0.0003 | 0.1 | 0.001 | 1.0 | 0.8 | 1.5 | 14 |
| Gold | 79 | 19300 | 0.003 | 0.2 | 0.002 | 1.0 | 0.5 | 1 | 6 |
| Glass | 70 | 2500 | 0.0008 | 0.1 | 0.004 | 0.9 | 1.0 | 3 | 10 |
| Crystal | 80 | 2650 | 0.00008 | 0 | 0.002 | 0.9 | 1.0 | 3 | 30 |
| Ice | 9 | 917 | 0.0025 | 0.3 | 0.02 | 0.8 | 0.7 | 4 | 6 |
| Marble | 55 | 2700 | 0.003 | 0.2 | 0.012 | 1.0 | 1.0 | 4 | 5 |
| Clay | 40 | 2000 | 0.005 | 0.3 | 0.02 | 2.5 | 0.9 | 4 | 3 |
| Spruce | 11 | 440 | 0.008 | 0.4 | 0.02 | 1.5 | 0.45 | 3 | 3 |
| Rosewood | 16 | 850 | 0.006 | 0.4 | 0.015 | 1.4 | 0.55 | 3 | 3 |
| Bamboo | 20 | 700 | 0.009 | 0.4 | 0.02 | 1.3 | 0.5 | 2.5 | 3 |
| Bone | 18 | 1900 | 0.012 | 0.3 | 0.015 | 1.6 | 0.8 | 3 | 2.5 |
| Gut | 4 | 1300 | 0.006 | 0.5 | 0.005 | 1.3 | 0.35 | 1.3 | 5 |
| Nylon | 3 | 1140 | 0.004 | 0.5 | 0.002 | 1.0 | 0.35 | 1.3 | 6 |
| Carbon fibre | 150 | 1600 | 0.002 | 0.2 | 0.002 | 1.0 | 0.9 | 1.5 | 8 |
| Rubber | 0.05 | 1100 | 0.035 | 0.3 | 0.01 | 1.2 | 0.12 | 2 | 1.2 |
| Paper | 3 | 700 | 0.03 | 0.3 | 0.03 | 4.0 | 0.2 | 3 | 1.2 |
| Jelly | 0.00005 | 1050 | 0.045 | 0.2 | 0.05 | 1.2 | 0.05 | 6 | 1.0 |

E, ρ and the order of magnitude of η are handbook values; η for the solids
matches the values Reverberator uses. Rubber, paper and jelly are made less
lossy than they really are (really η ~ 0.1–0.3), so that they can still be
played; see the session log. Jelly also wobbles: up to 0.3 semitone with
level, plus a slow drift.

## Resonator

- **Bore / Pipe** (per voice, tuned to the note): a comb `y = x ± g·lp(y[n−N])`
  with N one period (bore, +: all harmonics) or half a period (stopped pipe,
  −: odd harmonics), its loss from the resonator material's T60 (≤ 0.5 s) × 0.6
  / wall roughness, fitted with a one-pole.
- **Soundbox**: 12 measured guitar-body modes (98, 204, 226, 381, 437, 552,
  650, 780, 920, 1100, 1450, 2000 Hz; Reverberator's guitar), the plate modes
  scaled by `√((E/ρ)/(E/ρ)_spruce)` (clamped 0.35–2.5), all by 1/Size; Q from
  the material's η plus 0.018 radiation loss.
- **Cavity**: a Helmholtz mode at 140 Hz/Size (Q 14), three cavity modes, and
  six ring modes of the wall (`n(n² − 1)/√(n² + 1)`) in the material.
- **Body**: 16 plate modes of the material starting at 280 Hz × the stiffness
  scale / Size.

## Coupler, radiator

| Part | Filters |
|---|---|
| Bridge | peak 2.5 kHz Q 1.2 +6 dB, high-pass 90 Hz; element decay × 0.9 |
| Soundpost | peak 450 Hz Q 1 +6 dB, low-pass 7 kHz; element decay × 0.75 |
| Mouthpiece | peak 800/√Size Hz Q 2 +8 dB, low-pass 9 kHz |
| Windway | peak 1.8 kHz Q 0.9 +3 dB, high-pass 200 Hz, breath hiss |
| Bell | high-pass 180 Hz, peak 1.5 kHz +4 dB, soft saturation |
| Soundboard | peak 250 Hz +3 dB, low-pass 7.5 kHz, four allpass diffusers a side |
| Drumhead | high-pass 120 Hz, peak 2.2 kHz +6 dB, 8 head modes at 170 Hz/Size × Bessel ratios |
| Cone | band-pass 90 Hz – 5 kHz, peak 2.8 kHz Q 3, amplifier saturation |

## Controls

| Part | Implementation |
|---|---|
| Tone hole | loss at the 5 kHz partial × max(0.3, 1/(1 + (f/f_c)²)), f_c = max(1.5 kHz, 2.2 f₀); in Mono, a 12 ms 60 % dip on note changes |
| Valve | +12, +22, +6 c on the notes a trumpet plays with 1+3, 1+2+3 and 2 valves; 28 ms dip |
| Slide | glide time constant = glide time / 3; bend range 7 semitones |
| Fret | in Mono, a new note re-strikes at 35 % (hammer-on) |
| Peg | ±8 c per note (fixed), ±3 c slow drift |
| Tuning pin | 2.2 · d·|d| cents, d = octaves from A4 |
| Slide (tuning) | starts 30 c flat, settles with a 90 ms time constant |
| Damping on release | T60 0.12 / 0.4 / 0.08 / 0.3 / 0.2 s (damper, mute, palm, felt, hand) |
| Damping while held | mute ÷(1 + f/2.5k), palm ÷(1 + f/1.5k) and ≤ 0.35 s, felt ÷√(1 + (f/600)²), hand ÷(1 + f/1.2k) and −15 c |
| Modulation | keywork: +30 % drive; pedals: release × (1 + 19·mw); valves: −40 c and −30 % level; levers: +2 semitones; electronics: ±30 c vibrato and 30 % tremolo at 5.5 Hz |

## Level matching

`tools/trims.py` measures the maximum momentary (400 ms) loudness of one note
at C3, C4 and C5, for every exciter × element with a steady source (breath)
and with a single push (finger), and the effect of each coupler, resonator and
radiator, and prints trims. Three passes converge to within 0.2 dB. Trims are
capped at ±20 dB: a bowed air column driven by a single push stays quieter
than the rest (its trim wanted +38 dB, which only amplifies noise). A peak
limiter at −3 dBFS, then a soft ceiling, catch chords.
