# Parts and materials: models, derivations, constants

Technical reference for `Instrument-Creator.jsfx`. Every expression here is
the one implemented; function and constant names are given so each can be
found with grep. Design rationale is in [`adr/`](adr/README.md); the
measurement history is in [`SESSION-LOG.md`](SESSION-LOG.md); the user-facing
description is the README.

Conventions: SI units; `fs` sample rate; `f₀` the note's fundamental after
tuning offsets; `N = fs/f₀` samples per period; `ω = 2πf/fs` normalised
angular frequency; `a` the Age slider in 0…1; cents `c = 1200 log₂(f/f_ref)`.
"Measured" = rendered with `tools/render` (ysfx, REAPER's EEL2 JIT) at
48 kHz and analysed with `tools/analyse.py` (YIN pitch, BS.1770 loudness),
C4 and velocity 100 unless stated.

## Contents

1. [Architecture](#1-architecture)
2. [Shared numerical machinery](#2-shared-numerical-machinery)
3. [Energy sources](#3-energy-sources)
4. [Exciters](#4-exciters)
5. [Vibrating elements](#5-vibrating-elements)
6. [Materials](#6-materials)
7. [Resonators](#7-resonators)
8. [Couplers](#8-couplers)
9. [Radiators](#9-radiators)
10. [Controls](#10-controls)
11. [Age](#11-age)
12. [Output stage and level matching](#12-output-stage-and-level-matching)
13. [Validation summary](#13-validation-summary)
14. [Deviations, limitations, vestigial code](#14-deviations-limitations-vestigial-code)
15. [References](#15-references)

---

## 1. Architecture

### 1.1 Signal flow

```
per voice (8):
  energy envelope ─> drive P ─> exciter e = f(P, c) <═> element (waveguide | modes | banded WG)
                                                              │ out (× trim, DC-blocked)
                                   rattle / crackle / hiss ───┤ (feed-forward)
                                                              ├─> per-voice comb (Bore | Pipe) ─> res
                                                              └─> dir
summed over voices, stereo (constant-power pan by note):
  mix = rs∈{Bore,Pipe} ? lerp(dir, res, amount) : dir
  coupler (2 biquads) ─> [shared body modes, wet = amount × 3 × body] ─> radiator (≤ 3 biquads
  + saturation | diffusion | head modes) ─> × output × tremolo × master trim × age gain
  ─> peak limiter (−3 dBFS) ─> soft ceiling ─> out
```

The only feedback path is exciter ↔ element within a voice (ADR 0007).
Everything downstream is LTI except the radiator saturations, the rattle
nonlinearity and the limiter, all feed-forward.

### 1.2 Rates and threads

- `@sample`: MIDI events are queued in `@block` with their sample offset and
  dispatched sample-accurately (`MIDIQ`, 1000 events/block).
- Control rate: every 16 samples `voice_control` updates glide, settle,
  wobble, the loop delays (phase tuning, §2.2), band/mode coefficients when
  the frequency changed by > 10⁻⁵ relative, the lip oscillator and the
  per-voice comb. `mod_st`, `trem` and the LFO (5.5 Hz) are updated at the same
  rate.
- `@gfx` runs concurrently with `@sample` in REAPER (separate thread). The
  only global written by both is `aud_req`.
- Globals derived from sliders are recomputed by `update_globals` in
  `@slider`, and in `@block` when the window has changed a slider
  (`gui_dirty`). Part changes take effect at the next note-on (per-voice
  setup is done in `voice_start`), except shared-stage filters and the
  controls, which are global.

### 1.3 Voices

8 voices (`VOICES_MAX`), 512 memory slots each (fields `V_*` 0–101, modes at
`MODE_OFF` = 160, 24 × 8), and four delay lines of 16384 samples each (A:
element / band delays; B: second string segment / band descriptors; J: jet
delay; R: per-voice comb). Allocation (`find_voice`): a free voice, else the
released voice with the lowest level follower, else the oldest. A voice is
freed when `t > 50 ms`, the level follower (peak, 50 ms release) < 2·10⁻⁵,
the drive envelope < 0.002, no pulse is active, and it is released or has a
non-steady source. Mono mode uses voice 0 with a held-note stack
(`NOTE_STACK`) for last-note priority.

Pan: `p = 0.5 + 0.3·clip((note − 60)/30, ±1)`, gains `√2·cos(πp/2)`,
`√2·sin(πp/2)`.

---

## 2. Shared numerical machinery

### 2.1 Loss per pass and one-pole fits

A mode or loop partial with ring time T60 loses amplitude `10^(−3 t/T60)`;
over one pass of duration `T_p` the gain is `g = 10^(−3·T_p/T60)`.
The loop loss filter is `H(z) = b/(1 − p z⁻¹)`, `|H(ω)|² = b²/(1 − 2p cos ω + p²)`.

**`op_fit2(ga, ωa, gb, ωb)`** (loops): fit `|H(ωa)| = ga` at the fundamental,
`|H(ωb)| = gb` at the reference partial. With `R² = (gb/ga)²`:

```
(1 − R²) p² − 2 (cos ωa − R² cos ωb) p + (1 − R²) = 0
p = [B − √(B² − A²)] / A,   A = 1 − R²,  B = cos ωa − R² cos ωb
b = ga · √(1 − 2p cos ωa + p²)
```

then `p ≤ 0.95` and `b ≤ 0.9999995 (1 − p)` (DC gain < 1, so the loop is
passive at every frequency: `|H|` is monotone decreasing for p ≥ 0). This
replaced a DC-anchored fit (`op_fit`, Reverberator's), which for steep
high-frequency losses drove p → 0.9994 and attenuated the fundamental
(ADR 0008). `op_fit` is still used for the per-voice comb (§7.1), which is
feed-forward.

`wg_loss(v, T60_lo, T60_hi)` applies it with `T_p` = the loop's pass time at
f₀ (`V_TPA`) and at the reference partial (`V_TPB`).

### 2.2 Phase-exact loop tuning

Every 16 samples the loop delay D (samples) solves

```
ω·D + φ_lp(ω) + M·φ_ap(ω, a_d) + φ_dc(ω) = K·π
```

with `ω = 2π·f·F_K/fs` (F_K the pitch-pull correction, §4.6) and K =
`V_LOOPK` (2: a positive loop at its fundamental; 1: a negative loop, half a
period; 3: the overblown jet; the lips use `LIP_LOOPK` = 2). Phase lags:

```
φ_lp = atan2(p sin ω, 1 − p cos ω)                       one-pole loss
φ_ap = ω − 2 atan(a sin ω / (1 + a cos ω))                first-order allpass (a < 0)
φ_dc = atan2(R sin ω, 1 − R cos ω) − (π − ω)/2            DC blocker (1 − z⁻¹)/(1 − R z⁻¹), R = 1 − 2π·10/fs
```

(φ_dc is negative: a lead.) D is clamped to [4, 16376]. The fractional read
is 4-point Lagrange (`lag_read`) with `n₀ = ⌊D⌋ − 1`, `d = D − n₀ ∈ [1, 2)`:

```
h₀ = −(d−1)(d−2)(d−3)/6,  h₁ = d(d−2)(d−3)/2,  h₂ = −d(d−1)(d−3)/2,  h₃ = d(d−1)(d−2)/6
```

on taps at delays n₀ … n₀ + 3. Its phase delay equals d at low frequency;
the residual error at the fundamental is < 1 c for all tested notes.

### 2.3 Dispersion (stiff strings)

For `f_n = n f₀ √(1 + B n²)` the round-trip group delay at partial n is
`τ(n) = 1/(df_n/dn) = √(1 + Bn²) / (f₀ (1 + 2Bn²))`. Four identical
first-order allpasses (group delay `gd(ω, a) = (1 − a²)/(1 + 2a cos ω + a²)`)
are solved by bisection (`disp_solve`) so that

```
M·[gd(ω₁, a) − gd(ω_n, a)] = (τ(1) − τ(n))·fs,    a ∈ [a_lim, 0]
```

where n is the partial nearest f_ref = min(5 kHz, 0.3 fs) (solved by fixed
point `n ← (n + f_ref/(f₀√(1 + Bn²)))/2`). Budget: `a_lim` starts at −0.9 and
is raised in steps of 0.02 until `M·φ_ap(ω₁, a_lim) ≤ 0.4·2π`, i.e. the
allpasses take at most 40 % of the loop phase at the fundamental
(Reverberator ADR 0005; without it short stiff strings above C5 had negative
residual delay). Not applied to bowed strings (§4.4).

### 2.4 Two-pole modal resonator and its equivalence to a waveguide

Each mode (`mode_put`) is

```
y[n] = 2r cos θ · y[n−1] − r² · y[n−2] + (w/N)·(e[n] − e[n−2])
r = exp(−6.9078/(T60·fs)),  θ = 2πf/fs
```

At resonance the bandpass numerator gives zero phase (a real admittance) and
peak gain `≈ b/(1 − r)` with `b = w/N`. A waveguide loop with the same decay
has per-period gain `g = r^N`, so `1 − g ≈ N(1 − r)` and its peak
`1/(1 − g) ≈ 1/(N(1 − r))`: equal for w = 1. The impulse response is
`≈ 2b·rⁿ cos(nθ)`, i.e. amplitude `2w/N`, the same as a waveguide partial
excited by a unit impulse. This keeps modal and waveguide elements at
comparable levels before trims. Modes with f ≥ min(0.45 fs, 18 kHz) are
dropped; at most `MODES_MAX` = 24.

### 2.5 Banded waveguides

For a sustaining exciter on a modal element (`bands_setup`), each mode k
becomes `y_k = BP_k(g_k·y_k[n − N_k] + w'_k·e)`:

- `N_k = fs/f_k` (linear interpolation; zero-phase BP, so no phase correction),
  buffer length `⌈2fs/f_k⌉ + 6` (bends down to an octave);
- `BP_k`: `b₀(x − x₂) − a₁y₁ − a₂y₂`, `R_k = exp(−π·max(8, f_k/4)/fs)`,
  `b₀ = (1 − R²)/2`, `a₁ = −2R cos θ_k`, `a₂ = R²` (unit peak gain);
- `g_k = 10^(−3/(f_k·T60_k))`, `T60_k = max(T60_mode, 0.3·√(f₀/f_k))`
  (`BAND_T60_MIN`);
- contact `c = Σ w'_k y_k[n − N_k]`, `w'_k = w_k·(f₀/f_k)^0.7` (`BAND_GAMMA`);
- injection `e_band = e · (1/Σw'²) · (1 + (BAND_G − 1)·min(1, 2·env))`,
  `BAND_G` = 3: the junction gain is 1 (passive) when the drive envelope is
  0.

Release (`bands_release`) lowers `g_k` to the release T60 (× 0.6 above 4 f₀).

---

## 3. Energy sources

`energy_params(en)` sets globals; the drive envelope is per voice
(`V_ENV`).

| Source | steady | attack (s) | release (s) | noise | strikes/s ± jitter | hold (s) | decay τ (s) | contact × | velocity exponent k |
|---|---|---|---|---|---|---|---|---|---|
| Breath | 1 | 0.035 | 0.06 | 0.035 | 11 ± 25 % | | | 1.3 | 1.0 |
| Bow | 1 | 0.08 | 0.10 | 0.025 | 15 ± 45 % | | | 1.0 | 1.0 |
| Finger | 0 | 0.004 | | 0.01 | | 0.15 | 0.5 | 2.2 | 1.3 |
| Plectrum | 0 | 0.0015 | | 0.02 | | 0.10 | 0.35 | 0.55 | 1.2 |
| Hammer | 0 | 0.0008 | | 0.01 | | 0.06 | 0.25 | 0.8 | 1.8 |
| Electricity | 1 | 0.003 | 0.012 | 0 | 25 exact | | | 0.6 | 0.7 |

- Level: `L = max(0.02, force·v^k)·(0.6 if soft pedal)`, v = velocity/127
  (≥ 0.05). Live level: `L·expr·(1 + 0.4·aftertouch + 0.3·mw·[keywork])`,
  `expr = CC11·(CC2 if any CC2 has been received)`.
- Steady envelope: one-pole towards 1 while gated or held by the sustain
  pedal, coefficients `1 − exp(−1/(t·fs))`.
- Single push: `env = t/att` (t < att); 1 (t < att + hold); `exp(−(t − att − hold)/τ)`.
- Steady source + striking exciter: while `env > 0.02`, a pulse is started
  every `(1 ± jitter·u)/(rate·(0.6 + 0.8·env·L))` s with amplitude
  `L·env·(0.85 + 0.3u)`, u uniform.
- Noise: the drive gets `P ← P(1 + n·(noise + 0.02·[windway] + 0.06a))`,
  n uniform in ±1, per sample.

---

## 4. Exciters

Notation: c is the wave arriving at the junction (sum of arrivals for a
two-segment string, the band sum for banded elements, `tanh(c)` for plain
modal elements), e is what the exciter adds to the outgoing wave(s). A
steady exciter's drive is `P = env·P(L)`. All sustaining forms are passive
at P = 0 (ADR 0005).

### 4.1 Reed (STK clarinet)

`P = 0.6 + 0.3L`. Reflection coefficient of the reed channel
`R = clip(0.7 − 0.3·(c − P), −1, 1)`; outgoing `P + (c − P)R`, hence

```
e = (P − c)(1 − R)
```

With the first mapping, `0.55 + 0.3L`, notes above C5 fell silent at force
70 % (near threshold); force 100 % restored them, hence the 0.6 offset.

### 4.2 Lips (Trombolese `reed.py`, outward-striking valve)

Opening y (m), velocity ẏ:

```
ÿ = Δp/μ − (ω_l/Q)·ẏ − ω_l²·(y − y₀),     1/μ = ω_l²·y₀/p_c
```

`Q = 15`, `y₀ = 0.3 mm` (`LIP_REST`), width `w = 12 mm`, closing pressure
`p_c = 12 kPa`; ω_l from the note (below). Semi-implicit Euler at fs, y
clamped to [0, 3y₀] with the velocity zeroed at the stops. Flow through the
gap `U = A·sgn(Δp)·√(2|Δp|/ρ)`, `A = w·max(y, 0)`, with
`Δp = p_inc − Z·U` and `p_inc = P − 2·c·P_s` (the pressure the valve would see
at zero flow; `P_s = 4000 Pa` scales normalised waves, `Z = 2.7·10⁶ Pa·s/m³`
≈ ρc/πa² for a = 7 mm). Substituting gives `U² + kZ·U − k·|p_inc| = 0`,
`k = 2A²/ρ`:

```
U = ½(−kZ + √((kZ)² + 4k|p_inc|))·sgn(p_inc),    e = Z·U/P_s
```

Mouth pressure `P = (1500 + 4500 L)·env` Pa. The lip frequency is
`f_l = f·LIP_RATIO·(F_K if banded)` = 0.92 f on waveguides. Measured on the
air column (loop +, one period, with in-loop DC blocker):

| f_l/f | bore/f | played |
|---|---|---|
| 0.9 | 1 | no oscillation |
| 1.0 | 1 | +181 c |
| 0.88 | 0.88 | −41 c |
| **0.92** | **0.88** | **+1 c** |

i.e. the valve plays ≈ 11 % above its own resonance, locked by the bore.
Below ≈ 0.9 of the resonance it does not oscillate (as in Trombolese). With
0.92/0.88: −9 … +4 c from C2 to C6 (−18 c at C2, −33 c at G6).

### 4.3 Air jet (STK flute; `ex_eff` = 6 when coupler = Windway and exciter ∈ {lips, bow})

`P = (1.0 + 0.25L)·env`; jet input `j_in = P − c/2` into a delay
`D_J = 0.32·D` (linear interpolation, line J):

```
j = clip(j_out·(j_out² − 1), ±1),     e = j − c/2     (outgoing = j + c/2)
```

Loop: −, K = 3 (the bore is tuned to 2/3 of the note because the jet locks to
the second resonance, as STK's `lastFrequency = f·0.6667`). Before the
1.5-period loop it played a fifth sharp. Low notes (C2, G2) produce only odd
harmonics.

### 4.4 Bow (STK bowed string)

Bow speed `v_b = (0.03 + 0.2L)·env`, `Δv = v_b − c`:

```
e = Δv · clip((|k(Δv + 0.001)| + 0.75)⁻⁴, 0.01, 0.98)
```

Slope k (inverse bow force): `1.5·(max(0.02, β)/0.2)^0.5` on strings
(Schelleng: the minimum force rises as the bow approaches the bridge; β =
excite position), `1.5·1.333 = 2` on tubes (`BOW_TUBE`), 3 on banded
elements (`BOW_SLOPE_B`). Strings are bowed without dispersion: the
Helmholtz corner propagates at the group velocity of the high partials, which
the allpasses make faster; with dispersion every bowed steel note was +20 …
+35 c.

Measured octave (double-slip) failures on a grid of 6 low-loss materials ×
9 positions × 5 notes: k₀ = 2 → 9/270, 1.5 → 7/270, all at β = 0.2 or 0.33
on steel, chain link or handpan steel. Offsetting β by 3–10 % made it worse
(8–15/270); extra high-frequency loss had no effect.

### 4.5 Strikes (`start_pulse`)

Duration `τ = τ₀·s_src·(1.3 − 0.6v)/√(hardness)`, ×2 with Felt, clamped to
[3 samples, 20 ms]; `τ₀` = 0.9 ms (hammer), 1.4 ms (plectrum), 4 ms
(mallet); `s_src` the source's contact factor (§3). Amplitude L (single
push) or per-strike (steady source). Shapes, `x = t/τ ∈ [0, 1)`:

- hammer, mallet: `A sin(πx)`; mallet then one-pole low-pass at 900 Hz, × 1.5;
- plectrum: `A·x` (the force ramps as the pick deflects the string, then
  releases), plus 2 ms of uniform noise at 0.15 A.

A half-sine of duration τ has its first spectral zero at 1.5/τ (1.7 kHz for
τ = 0.9 ms), which is how velocity, source, material hardness and Felt set
brightness.

### 4.6 Pitch-pull corrections

Applied as `F_K` on the loop frequency (and on the lip frequency for banded
elements):

| Case | Pull measured (uncorrected) | Correction | Residual |
|---|---|---|---|
| Lips, waveguide | +181 c | bore × 0.88 (`LIP_BORE`), lips 0.92 × note | −9 … +4 c C2–C6 |
| Lips, bar / plate / tine | +124 / +113 / +148 c | lips and bands × 2^(−c/1200) | −6 … +2 c (median over 8 materials) |
| Lips, membrane | ≈ +50 c (stiff) … +100 c (soft) | `100 − 50·clip((s − 0.0045)/0.009, 0, 1)` c, s = min(0.03, 0.0003·E_GPa) | within 25 c on 29/31 materials; bone −57, jelly +26 |
| Jet | +6 … +26 c, rising with f | `clip(16 + 7 log₂(f/261.6), 0, 26)` c | −3 … 0 c |
| Bow, string | +3 … +15 c | `clip(6 + 5 log₂(f/261.6), 0, 15)` c | +1 … +7 c |
| Reed, air column | none | | −2 … +1 c |

Lowering only the lips stops the oscillation (< 0.9 × resonance); lowering
only the bands made the membrane *sharper* (+101 c): the pitch is set by the
lips there. The membrane pull is bimodal in stiffness and the boundary cases
(bamboo, bone: s ≈ 0.0054–0.006) flip between regimes, hence the residuals.

---

## 5. Vibrating elements

### 5.1 String (two-segment waveguide)

Geometry: `L = clip(0.65·2^(−(note − 52)/18), 0.04, 2.2)` m (a piano-like
scale), `d = 0.8 mm × thickness`. Inharmonicity from `B = π³Ed⁴/(64TL²)` with
the tension that gives f₀ (`T = μ(2Lf₀)²`, `μ = ρπd²/4`):

```
B = π²·E·d² / (64·ρ·L⁴·f₀²),   capped at 0.05
```

Junction (`V_TWO` = 1, STK layout): delays A (bridge side, holds the loss
filter, the four allpasses and sign −1) and B (nut side, sign −1),
`D_B = ⌊(1 − β)D⌋` (hysteresis of 2 samples so glides don't click),
`D_A = D − D_B ≥ 2.5`:

```
r₁ = −AP⁴(LP(A_out)),   r₂ = −B[n − D_B],   c = r₁ + r₂
A_in = r₂ + e,   B_in = r₁ + e,   out = A_out
```

Round-trip sign +1, K = 2. Loss targets: `T60_lo = held_t60(m, f₀)`,
`T60_hi = held_t60(m, f_n)` at the partial nearest 5 kHz (§6.2), with pass
times τ(1) and τ(n) from §2.3. Lips and jets drive a string from its end
(`V_TWO` = 0) with the air-column configurations.

Derived inharmonicity for C4 (L = 0.477 m): steel 7.1·10⁻⁴ (10th partial
+59 c), aluminium 1.6·10⁻³ (+128 c), glass 7.0·10⁻³ (+458 c), marble 9.0·10⁻³
(+557 c), nylon 1.2·10⁻⁴ (+11 c). Real piano B at C4 ≈ 10⁻⁴…10⁻³.

### 5.2 Air column (single-ended waveguide)

Radius `a = clip(7 mm·(262/f₀)^0.3, 3, 30 mm)`. Kirchhoff wide-tube
boundary-layer attenuation (Trombolese `acoustics.py`):

```
α(f) = √(πf)·BLC / (a·c),   BLC = √ν + (γ − 1)√(ν/Pr)
c = 343.2 m/s, ρ = 1.204, ν = 1.506·10⁻⁵ m²/s, γ = 1.4017, Pr = 0.708  (air, 20 °C)
```

Per pass of duration `T_p = K/(2f₀)` (path `ℓ = c·T_p`), with wall factor ψ
and the open-end radiation magnitude `|R| ≈ exp(−(ka)²/2)`:

```
g(f) = exp(−ℓ·ψ·α(f))·exp(−½(2πfa/c)²),    T60 = −6.9078·T_p / ln g(f)
ψ = min(2.2, rough·(1 + 0.15·min(6, 1 GPa/E)))·(1 + 0.8a_age)
```

evaluated at f₀ and at `f_ref = min(5 kHz, 0.4 fs)`; T60_hi is further scaled
by damping, brightness and tone holes. Example, C4, ψ = 1: g(f₀) = 0.956
(T60 0.29 s), g(4 kHz) ≈ 0.74. The end correction is not added (the loop is
tuned by phase to the note regardless).

Loop configurations (sign σ, K), `wg_setup`:

| Exciter | σ | K | Note |
|---|---|---|---|
| Reed | − | 1 | closed cylinder: odd harmonics. (+, 2) never oscillated at any pressure |
| Lips | + | 2 | in-loop DC blocker |
| Jet | − | 3 | in-loop DC blocker; STK overblown flute |
| Bow | − | 1 | (+, 2) silent |
| Strikes | + (Windway or Bore) / − | 2 / 1 | open / closed tube |

`out = A_out + r₁` (transmitted wave, a high-pass relative to the loop).

### 5.3 Modal elements

Weights `w` (drive/contact) and `w_r` (radiation) per mode, then `mode_put`
(§2.4). `irr > 0.004` adds a twin per mode at `f·(1 + irr·(0.6 + 0.4 h))`
(h a fixed hash in ±1), 0.6 × the weights, 0.8 × the T60 (not for lips).

**Membrane** (16 modes). `f_mn = f₀·(j_mn/2.4048)·√(1 + s·(j_mn/2.4048)²)`,
`s = min(0.03, 0.0003·E_GPa)`; j_mn the sorted Bessel zeros (2.4048, 3.8317,
5.1356, 5.5201, 6.3802, 7.0156, 7.5883, 8.4172, 8.6537, 8.7715, 9.7610,
9.9361, 10.1735, 11.0647, 11.0864, 11.6198…). Strike radius
`r = max(0, 0.95 − 1.8β)`; `w = 1.7·J_m(j_mn r)·(cos 0.7m if m > 0)`,
`w_r = 1.7·J_m(0.35 j_mn)·cos 1.9m + 0.4δ_m0`; J_m by its power series
(`besj`, adequate for x < 15). The (0,1) mode's T60 × 0.35 (radiation
damping of the monopole mode). Degenerate cos/sin pairs are not split.

**Bar** (8 modes). Free–free Euler–Bernoulli beam, βₙL = 4.7300, 7.8532,
10.9956, 14.1372, 17.2788, 20.4204, 23.5619, 26.7035; `f_n = f₀(βₙ/4.73)²` =
1, 2.756, 5.404, 8.933, 13.34, 18.64, 24.81, 31.87. Mode shape, u = x − ½:

```
symmetric (n = 0, 2, …):      φ = cos(βu)/cos(β/2) + cosh(βu)/cosh(β/2)
antisymmetric (n = 1, 3, …):  φ = sin(βu)/sin(β/2) + sinh(βu)/sinh(β/2)
```

(|φ| = 2 at the ends). Strike at `x = 0.5 − 0.6β`, `w = φ(x)/2`; pickup
`w_r = φ(0.12)/2`. (A pickup mixing x = 0.5 and 0.05 cancelled mode 1: level
−46 … −69 LUFS.) Timoshenko corrections are ignored (thin-bar limit).

**Plate** (20 modes). Simply supported rectangle, aspect 1 : 0.73:
`f_mn ∝ m² + (n/0.73)²`, the 20 lowest sorted at init (`PLATE_TAB`), ratios
to (1,1). `w = sin(mπx)·sin(nπy)` at `(x, y) = (0.5 − 0.8β, 0.5 − 0.7β)`;
`w_r` at (0.77, 0.31). Isotropic, Poisson effects absent (they cancel in the
ratios).

**Tine / reed** (6 modes). Clamped–free cantilever, βₙL = 1.8751, 4.6941,
7.8548, 10.9955, 14.1372, 17.2788; ratios 1, 6.267, 17.55, 34.39, 56.84, 84.91.

```
φ(x) = cosh βx − cos βx − σ(sinh βx − sin βx),   σ = (cosh β + cos β)/(sinh β + sin β)
```

x from the clamp; strike at `x = 1 − β_pos`, `w = φ/2`, `w_r = φ(1)/2`. With
a sustaining exciter the chopped flow is added: `out += 0.6·env·L·tanh(4c)`.

**Wobble**: `Δpitch = wob·(0.6·min(1, 3·level) + 0.25 sin(2.3t + note))/2`
semitones, for materials with wobble > 0.

**Release** (`modal_release`): `r ← min(r, exp(−6.9078/(T_rel·fs)))`, with
`T_rel × 0.6` for modes above 4 f₀; `a₁` rescaled accordingly.

---

## 6. Materials

### 6.1 Parameters (`mat_def`, `MAT_TAB`, stride 16)

| Field | Symbol | Used by |
|---|---|---|
| `M_E` | Young's modulus E (GPa) | string B; membrane stretch s; body stiffness scale; air-wall floppiness |
| `M_RHO` | density ρ (kg/m³) | string B; body stiffness scale |
| `M_ETA`, `M_SLOPE` | η₁ₖ, q: `η(f) = η₁ₖ·(max(f, 20)/1000)^q` | every T60 |
| `M_IRR` | irregularity | twin modes (§5.3) |
| `M_ROUGH` | wall roughness | air column ψ; per-voice comb loss |
| `M_HARD` | hardness | strike duration ∝ 1/√hardness |
| `M_THICK` | string diameter factor | string d |
| `M_TMAX` | t_max (s) | T60 cap |
| `M_WOB`, `M_RAT`, `M_CRK` | wobble, rattle, crackle | §5.3, §6.5 |
| `M_CR/CG/CB` | colour | GUI only |

### 6.2 Decay law

Modal energy decays at `2σ` with `σ = πfη`, so `T60 = 3 ln 10/σ =
2.199/(fη)`. Loss channels add as rates:

```
mat_t60(m, f) = 1 / ( (1 + 1.5a)/t_max + f·η(f)·A(f)/2.2 ),   A(f) = 1 + a²(2 + 3f/2000)
held_t60(m, f) = mat_t60 · Decay · drain · damp(f) · bright(f) · hole(f)      (palm: ≤ 0.35 s)
```

`drain` = 0.9 (Bridge), 0.75 (Soundpost), 1 otherwise;
`bright(f) = 2^(Brightness/50 · clip(log₈(f/500), 0, 1))`; damping and hole
factors in §10. Release T60s in §10.

### 6.3 Constants

| # | Material | E (GPa) | ρ | η₁ₖ | q | irr | rough | hard | thick | t_max | wob | rat | crk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Steel | 200 | 7850 | 0.0003 | 0.1 | 0.001 | 1.0 | 1.0 | 1 | 16 | | | |
| 1 | Brass | 110 | 8500 | 0.0008 | 0.1 | 0.002 | 1.0 | 0.9 | 1 | 12 | | | |
| 2 | Bronze | 110 | 8700 | 0.0004 | 0.1 | 0.004 | 1.0 | 0.95 | 1 | 20 | | | |
| 3 | Aluminium | 69 | 2700 | 0.0003 | 0.1 | 0.001 | 1.0 | 0.8 | 1.5 | 14 | | | |
| 4 | Gold | 79 | 19300 | 0.003 | 0.2 | 0.002 | 1.0 | 0.5 | 1 | 6 | | | |
| 5 | Glass | 70 | 2500 | 0.0008 | 0.1 | 0.004 | 0.9 | 1.0 | 3 | 10 | | | |
| 6 | Crystal | 80 | 2650 | 0.00008 | 0 | 0.002 | 0.9 | 1.0 | 3 | 30 | | | |
| 7 | Ice | 9 | 917 | 0.0025 | 0.3 | 0.02 | 0.8 | 0.7 | 4 | 6 | | | |
| 8 | Marble | 55 | 2700 | 0.003 | 0.2 | 0.012 | 1.0 | 1.0 | 4 | 5 | | | |
| 9 | Clay | 40 | 2000 | 0.005 | 0.3 | 0.02 | 2.5 | 0.9 | 4 | 3 | | | |
| 10 | Spruce | 11 | 440 | 0.008 | 0.4 | 0.02 | 1.5 | 0.45 | 3 | 3 | | | |
| 11 | Rosewood | 16 | 850 | 0.006 | 0.4 | 0.015 | 1.4 | 0.55 | 3 | 3 | | | |
| 12 | Bamboo | 20 | 700 | 0.009 | 0.4 | 0.02 | 1.3 | 0.5 | 2.5 | 3 | | | |
| 13 | Bone | 18 | 1900 | 0.012 | 0.3 | 0.015 | 1.6 | 0.8 | 3 | 2.5 | | | |
| 14 | Gut | 4 | 1300 | 0.006 | 0.5 | 0.005 | 1.3 | 0.35 | 1.3 | 5 | | | |
| 15 | Nylon | 3 | 1140 | 0.004 | 0.5 | 0.002 | 1.0 | 0.35 | 1.3 | 6 | | | |
| 16 | Carbon fibre | 150 | 1600 | 0.002 | 0.2 | 0.002 | 1.0 | 0.9 | 1.5 | 8 | | | |
| 17 | Rubber | 0.05 | 1100 | 0.035 | 0.3 | 0.01 | 1.2 | 0.12 | 2 | 1.2 | 0.4 | | |
| 18 | Paper | 3 | 700 | 0.03 | 0.3 | 0.03 | 4.0 | 0.2 | 3 | 1.2 | 0.15 | | |
| 19 | Jelly | 0.00005 | 1050 | 0.045 | 0.2 | 0.05 | 1.2 | 0.05 | 6 | 1.0 | 1 | | |
| 20 | Plastic (ABS) | 2.3 | 1050 | 0.01 | 0.3 | 0.005 | 1.0 | 0.4 | 2 | 2 | | | |
| 21 | PVC | 3 | 1400 | 0.022 | 0.3 | 0.003 | 1.0 | 0.45 | 2 | 2 | | | |
| 22 | Wood (maple) | 12 | 650 | 0.007 | 0.4 | 0.02 | 1.4 | 0.6 | 3 | 3 | | | |
| 23 | Leather | 0.1 | 900 | 0.04 | 0.3 | 0.02 | 2.0 | 0.2 | 3 | 1.2 | 0.1 | | |
| 24 | Cardboard | 3 | 700 | 0.04 | 0.3 | 0.03 | 4.0 | 0.25 | 3 | 1.2 | | | |
| 25 | Foil | 69 | 2700 | 0.02 | 0.2 | 0.05 | 1.5 | 0.6 | 1 | 1.5 | | | 1 |
| 26 | Cling film | 0.2 | 920 | 0.05 | 0.3 | 0.01 | 1.5 | 0.1 | 4 | 1.0 | 0.3 | 1 | |
| 27 | Tin (galvanised) | 207 | 7850 | 0.004 | 0.1 | 0.03 | 1.2 | 0.9 | 1 | 3 | | 0.7 | |
| 28 | Car panel | 207 | 7850 | 0.003 | 0.1 | 0.01 | 1.0 | 0.9 | 1 | 2.5 | | 0.3 | |
| 29 | Chain link | 200 | 7850 | 0.0015 | 0.1 | 0.03 | 1.0 | 1.0 | 1 | 4 | | 1 | |
| 30 | Handpan steel | 207 | 7850 | 0.0022 | 0.1 | 0.001 | 1.0 | 1.0 | 1 | 8 | | | |

Provenance: E and ρ are handbook values (Reverberator's where it had them:
steel, bronze, glass, marble, ice, aluminium, PVC, paperboard, spruce). η of
the solids is Reverberator's or the same order; `q` encodes the rise of
damping with frequency typical of polymers and wood. **Softened for
playability** (ADR 0015; real values in brackets): rubber 0.035 (≈ 0.1),
paper 0.03 (0.05), jelly 0.045 (≈ 0.25), PVC 0.022 (0.03), cardboard 0.04
(0.06), leather 0.04 (0.06), cling film 0.05 (0.12, Reverberator's effective
value including air loading).

### 6.4 Derived behaviour

Computed from the table (a = 0, Decay 100 %, no damping, drain or
brightness): ring at 262 Hz and 2 kHz; C4 string (L = 0.477 m) inharmonicity
and its 10th-partial shift `1200 log₂√(1 + 100B)`; soundbox plate-mode scale
`s_b = clip(√((E/ρ)/(E/ρ)_spruce), 0.35, 2.5)` with (E/ρ)_spruce =
2.5·10⁷ m²/s², shown as the 204 Hz mode; air-column ψ; membrane stretch s;
strike duration factor 1/√hardness.

| Material | T60 262 Hz | T60 2 kHz | B (C4) | 10th partial | s_b × 204 Hz | ψ | s | 1/√hard |
|---|---|---|---|---|---|---|---|---|
| Steel | 10.7 | 2.82 | 7.1e-4 | +59 c | 206 | 1.00 | 0.030 | 1.00 |
| Brass | 6.00 | 1.16 | 3.6e-4 | +30 c | 147 | 1.00 | 0.030 | 1.05 |
| Bronze | 10.9 | 2.27 | 3.5e-4 | +30 c | 145 | 1.00 | 0.030 | 1.03 |
| Aluminium | 9.74 | 2.75 | 1.6e-3 | +128 c | 206 | 1.00 | 0.021 | 1.12 |
| Gold | 2.27 | 0.30 | 1.1e-4 | +10 c | 83 | 1.00 | 0.024 | 1.41 |
| Glass | 5.45 | 1.14 | 7.0e-3 | +458 c | 216 | 0.90 | 0.021 | 1.00 |
| Crystal | 23.3 | 9.43 | 7.5e-3 | +486 c | 224 | 0.90 | 0.024 | 1.00 |
| Ice | 2.73 | 0.34 | 4.4e-3 | +313 c | 128 | 0.81 | 0.0027 | 1.20 |
| Marble | 2.11 | 0.30 | 9.0e-3 | +557 c | 184 | 1.00 | 0.0165 | 1.00 |
| Clay | 1.37 | 0.17 | 8.9e-3 | +549 c | 182 | 2.20 | 0.012 | 1.05 |
| Spruce | 1.12 | 0.10 | 6.2e-3 | +419 c | 204 | 1.52 | 0.0033 | 1.49 |
| Rosewood | 1.33 | 0.13 | 4.7e-3 | +333 c | 177 | 1.41 | 0.0048 | 1.35 |
| Bamboo | 1.04 | 0.09 | 5.0e-3 | +348 c | 218 | 1.31 | 0.0060 | 1.41 |
| Bone | 0.74 | 0.07 | 2.4e-3 | +184 c | 126 | 1.61 | 0.0054 | 1.12 |
| Gut | 1.77 | 0.13 | 1.4e-4 | +12 c | 72 | 1.35 | 0.0012 | 1.69 |
| Nylon | 2.44 | 0.19 | 1.2e-4 | +11 c | 71 | 1.05 | 0.0009 | 1.69 |
| Carbon fibre | 3.26 | 0.45 | 5.8e-3 | +398 c | 395 | 1.00 | 0.030 | 1.05 |
| Rubber | 0.28 | 0.02 | 5.0e-6 | 0 | 71 | 2.20 | 0 | 2.89 |
| Paper | 0.31 | 0.03 | 1.1e-3 | +88 c | 84 | 2.20 | 0.0009 | 2.24 |
| Jelly | 0.20 | 0.02 | 4.8e-8 | 0 | 71 | 2.20 | 0 | 4.47 |
| Plastic | 0.77 | 0.09 | 2.4e-4 | +21 c | 71 | 1.07 | 0.0007 | 1.58 |
| PVC | 0.44 | 0.04 | 2.4e-4 | +20 c | 71 | 1.05 | 0.0009 | 1.49 |
| Wood | 1.22 | 0.11 | 4.6e-3 | +328 c | 175 | 1.42 | 0.0036 | 1.29 |
| Leather | 0.25 | 0.02 | 2.8e-5 | +2 c | 71 | 2.20 | 0 | 2.24 |
| Cardboard | 0.25 | 0.02 | 1.1e-3 | +88 c | 84 | 2.20 | 0.0009 | 2.00 |
| Foil | 0.40 | 0.05 | 7.1e-4 | +59 c | 206 | 1.50 | 0.021 | 1.29 |
| Cling film | 0.20 | 0.02 | 9.6e-5 | +8 c | 71 | 2.20 | 0.0001 | 3.16 |
| Tin | 1.33 | 0.24 | 7.3e-4 | +61 c | 210 | 1.20 | 0.030 | 1.05 |
| Car panel | 1.40 | 0.30 | 7.3e-4 | +61 c | 210 | 1.00 | 0.030 | 1.05 |
| Chain link | 2.46 | 0.58 | 7.1e-4 | +59 c | 206 | 1.00 | 0.030 | 1.00 |
| Handpan steel | 2.82 | 0.44 | 7.3e-4 | +61 c | 210 | 1.00 | 0.030 | 1.00 |

Observations: specific stiffness E/ρ ≈ 2.5·10⁷ for steel, spruce and
aluminium, so their soundboxes coincide; the thickness factor (brittle
materials as 3–4× rods) is what separates glass/stone strings (B ~ 10⁻²)
from metal ones (10⁻³); the T60 cap `t_max` dominates at low frequency for
crystal, steel and bronze, η dominates everywhere for the soft materials.

### 6.5 Rattle and crackle (feed-forward, per voice, after the trim)

```
rattle:  x = out − clip(out, ±0.2);  y = 0.9(y₁ + x − x₁);  out += 2.5·ρ_r·y
crackle: with probability ρ_c·min(1, 8|out|)·900/fs per sample, x = ±(0.05 + |out|);
         y = 0.6(y₁ + x − x₁);  out += y
```

`ρ_r = max(M_RAT, 0.6a^1.5)`, `ρ_c = max(M_CRK, 0.25a²)`. The gap is in
trimmed units, so it gates on playing level: tin bar, energy above 3 kHz
relative to total, −69 dB at velocity 40 (identical to rattle off), −41 dB at
80, −39 dB at 127. Gap 0.06 (first version) rattled at every velocity.

---

## 7. Resonators

### 7.1 Bore and Pipe (per voice, tuned to the note)

`y = x + σ_r·LP(y[n − D_r])`, `D_r` from phase tuning with K_r = 2 (Bore,
σ_r = +: peaks at all harmonics) or 1 (Pipe, σ_r = −: odd harmonics, a
stopped quarter-wave pipe). Loss (DC-anchored `op_fit`): T60 at f₀
`= min(mat_t60(m_r, f₀), 0.5)·Decay·0.6/rough`, at 4 kHz 0.4 × that ×
bright(4 kHz); output normalised by `1.25·(1 − min(0.97, g_DC))`. Mixed with
the dry element by Resonator amount; the coupler follows.

### 7.2 Shared body modes

Each `body_mode(f, Q, amp, w_L, w_R)`: `r = exp(−πf/(Q fs))`, bandpass
`(1 − r)·amp·(x − x₂)` into the same two-pole form (unit peak), driven by the
mono coupler output; wet `= 3·(Σ w_L y, Σ w_R y)`, mixed by Resonator amount.

- **Soundbox**: 98 (air, Q 20/(1 + a)), 204, 226, 381, 437, 552, 650, 780, 920,
  1100, 1450, 2000 Hz (a guitar, from Reverberator); plate modes × s_b; all
  ÷ Size; `Q = 1/(η(f)·A(f) + 0.018)`; amp `1/√(1 + k/2)`.
- **Cavity**: Helmholtz 140/Size Hz (Q 14, amp 1.4); cavity modes 640, 1060,
  1480 Hz/Size (Q 22–25); wall ring modes of a cylinder,
  `f_n = 520·s_b·n(n² − 1)/(3√(n² + 1)·Size)`, n = 2…7,
  `Q = 1/(η(f)A(f) + 0.004)`.
- **Body**: 16 plate modes (§5.3 ratios) from 280·s_b/Size Hz,
  `Q = 1/(η(f)A(f) + 0.003)`, amp `0.9/√(1 + 0.3k)`.

---

## 8. Couplers

RBJ biquads (`bq_pk`, `bq_lp`, `bq_hp`), two per channel, before the body:

| Coupler | Filters | Element T60 × | Other |
|---|---|---|---|
| Bridge | peak 2.5 kHz, Q 1.2, +6 dB; HP 90 Hz Q 0.7 | 0.9 | |
| Soundpost | peak 450 Hz, Q 1, +6 dB; LP 7 kHz | 0.75 | |
| Mouthpiece | peak 800/√Size Hz, Q 2, +8 dB; LP 9 kHz | 1 | |
| Windway | peak 1.8 kHz, Q 0.9, +3 dB; HP 200 Hz | 1 | drive noise +0.02; hiss `0.02·n_hp·env·L`; lips/bow → jet (§4.3); strikes use an open tube |

---

## 9. Radiators

Up to three biquads per channel after the body, then:

| Radiator | Filters | Nonlinear / extra |
|---|---|---|
| Bell | HP 180 Hz Q 0.6; peak 1.5 kHz Q 0.8 +4 dB | `tanh(1.3y)/1.3` |
| Soundboard | peak 250 Hz Q 0.9 +3 dB; LP 7.5 kHz | 4 Schroeder allpasses per side, g 0.6, delays (3.1, 5.3, 7.9, 11.3 ms) L and (3.7, 5.9, 8.3, 12.1 ms) R × Size; out `0.6·dry + 0.55·diffused` |
| Drumhead | HP 120 Hz; peak 2.2 kHz Q 1.5 +6 dB; LP 9 kHz | 8 head modes at `170/Size·j_mn/2.4048` Hz, T60 0.25 s, amp `0.8/√(1 + k)`, added × 2 |
| Cone | HP 90 Hz Q 0.8; LP 5 kHz Q 0.9; peak 2.8 kHz Q 3 +4 dB | `tanh(2y)/2` |

---

## 10. Controls

**Frequency control.** Fret: in Mono, legato re-strikes at 0.35 L (hammer-on)
for striking exciters. Tone hole: `hole(f) = max(0.3, 1/(1 + (f/f_c)²))`,
`f_c = max(1500, 2.2 f₀)` applied to T60_hi (a shelf filter in the loop was
tried first: −3.4 % per pass at 523 Hz, strings died in 0.3 s); Mono legato
dip `env × (1 − 0.6 sin(π t/12 ms))`. Valve: `+12, +22, +6 c` for
`(note + 2) mod 12 ∈ {5, 6, 11}`; dip over 28 ms. Slide: glide
`p ← p + (p_t − p)·(1 − exp(−48/(t_glide fs)))` per control tick (time
constant t_glide/3), new notes start from the last pitch in Poly too; bend
range 7 semitones (else 2). Key: Mono always re-triggers.

**Tuning.** Peg: `8·h(note)` c fixed plus `0.03 sin(0.8t + note)` semitones.
Tuning pin: `2.2·d|d|` c, d = (note − 69)/12 (−35 c at A0, +23 c at C8).
Machine head: 0. Slide: starts −30 c, `×exp(−16/(0.09 fs))` per tick.

**Damping.**

| | held: T60 factor | held: other | release T60 (s) |
|---|---|---|---|
| Damper | 1 | | 0.12 |
| Mute | `1/(1 + f/2500)` | | 0.40 |
| Palm | `1/(1 + f/1500)` | T60 ≤ 0.35 s | 0.08 |
| Felt | `1/√(1 + (f/600)²)` | strike τ × 2 | 0.30 |
| Hand | `1/(1 + f/1200)` | −15 c | 0.20 |

Release applies `min(current, T_rel)` at f₀ and `min(current, 0.6 T_rel)` at
the reference partial (waveguides) or per mode (§5.3); × (1 + 19·mw) with
Pedals. Sustain (CC64) defers release.

**Modulation (mod wheel mw).** Keywork: L × (1 + 0.3 mw). Pedals: release
× (1 + 19 mw); CC67 soft pedal L × 0.6. Valves: −0.4 mw semitone, gain
1 − 0.3 mw. Levers: +2 mw semitones. Electronics: ±0.3 mw semitone vibrato
and gain `1 − 0.3 mw·(½ + ½ sin(2π·5.5t + 1.2))`. Always: pitch bend,
aftertouch (+0.4 L), CC2, CC11, CC64, CC67, CC120/123 (all off).

---

## 11. Age

`a = slider23/100`, applied at note-on (loss, irregularity, detune, wall) and
live (wander, rattle, crackle, leak):

| Effect | Expression |
|---|---|
| Loss | η × `1 + a²(2 + 3f/2000)`; t_max ÷ `(1 + 1.5a)`; soundbox air-mode Q ÷ (1 + a); all body Qs via η |
| Irregularity | `+ 0.015a` (twins on every material for a > 0.27) |
| Detune | `25a·h(7.31·note + 3)` c, fixed per note |
| Wander | `0.12a²·(sin(0.43t + 1.7 note) + 0.5 sin(1.9t + note))` semitones |
| Rattle, crackle | `ρ_r ≥ 0.6a^1.5`, `ρ_c ≥ 0.25a²` (§6.5) |
| Leak | drive noise + 0.06a; hiss `0.04a²·n_hp·env·L` from sustaining elements |
| Bore | ψ × (1 + 0.8a) |
| Make-up | `+6a` dB unless the exciter is reed or lips |

Measured (C4, velocity 100), a = 0 / 0.5 / 1: −20 dB times Marble Marimba
0.85 / 0.60 / 0.35 s, Golden Piano 0.75 / 0.50 / 0.10 s; loudness saxophone
−18.4 / −19.2 / −19.3 LUFS, trumpet −19.4 / −19.2 / −18.6, violin −10.9 /
−11.1 / −12.0, marimba −9.8 / −10.8 / −13.8. Without the make-up gain the
violin lost 7 dB and the piano 8 dB; blown instruments gain level with age
(self-oscillation restores the amplitude, and the hiss adds).

---

## 12. Output stage and level matching

- Per voice: `out × 10^(T/20)`, T from `TRIM_TAB[(steady ? 0 : 36) + 6·exciter
  + element]`. Master: `10^((T_res + T_coupler + T_rad)/20)` (`PART_TRIM`).
- `tools/trims.py`: the maximum 400 ms K-weighted loudness of one note at
  C3, C4, C5 (power average), target −18 LUFS, for every exciter × element
  with breath (steady) and finger (single push), bamboo, defaults; parts
  measured relative to defaults on four reference instruments. Converged in
  three passes to < 0.2 dB, except capped cells (±20 dB): steady reed on tine
  −20 (wants −21), single-push mallet on bar and plate +20, single-push bow on
  air column +14.8 (the last is weak by physics).
- Limiter: `env = max(|y|, env·exp(−1/(0.15 fs)))`, gain `min(1, 0.7/env)`
  (instant attack); then soft ceiling above 0.9: `0.9 + 0.1·tanh(10(|y| −
  0.9))`, so |y| < 1.

---

## 13. Validation summary

| Check | Result |
|---|---|
| Stability (`check.py`): every energy × exciter × element at age 0 and 100 (48 kHz), at 44.1 and 96 kHz, 19 slider extremes and every option of every part (31 materials) on six instruments; chord at three velocities; fails on non-finite output, a tail growing after release, or a tail > −45 dB | 0 failures |
| Pitch, reed on air column, C2–G6 | −2 … +1 c |
| Pitch, plucked steel / nylon string, C2–G4 | 0 … +7 c |
| Pitch, lips / jet / bowed string | §4.6 |
| Loudness spread across parts | < 0.2 dB (except capped) |
| CPU, 8-note chords at 48 kHz | reed 3 %, struck plate 7 %, bowed string 8 %, bowed plate 14 % of one core; worst sweep case 27.5 % (3 notes, 96 kHz) |
| Playing behaviour | Mono slide C4→E4 ≈ 150 ms; bend and Levers reach D4 (293.2 Hz); sustain pedal holds; Electronics vibrato at 5.5 Hz |
| GUI | screenshots of every option and material, and of Age (`tools/shot.py`); rendered in REAPER on macOS (Retina) as in ysfx; layout checked at 800×480, 966×565, 940×640, 1200×800 |

---

## 14. Deviations, limitations, vestigial code

Physics deliberately not modelled: nonlinear (brassy) propagation (only the
Bell's saturation); the air column's end correction and tone-hole lattice as
geometry; string–body two-way coupling (a T60 drain instead); degenerate
mode pairs of membranes; Timoshenko and orthotropic plate/bar corrections;
tension modulation (except material wobble).

Known limitations: reed on a cone (ADR 0017); double-slip on lossless steels
at β = 1/5, 1/3; lips on membranes of bone (−57 c) and jelly (+26 c); a
single push into lips sags in pitch (the pull depends on pressure); softened
lossy materials (§6.3).

Vestigial code (harmless, candidates for removal): the in-loop tone-hole
shelf (`V_THC`, `V_THS`, `phshelf`, `TH_K`; `V_THC` is always 0); debug
switches `DEBUG_BANDED` (forces banded waveguides for strikes) and
`DBG_NODISP` (disables dispersion), both 0; `LIP_LOOPK` is a constant 2;
`V_EG` is also set to 1 before `bands_setup` overwrites it.

---

## 15. References

- J. O. Smith, *Physical Audio Signal Processing* (online, CCRMA): digital
  waveguides, scattering junctions, loss filters, allpass dispersion.
- P. R. Cook and G. P. Scavone, *The Synthesis ToolKit in C++* (STK):
  `Clarinet` reed table, `Bowed` two-segment string and bow table, `Flute`
  jet (overblown tuning, jet ratio 0.32), `BandedWG`.
- G. Essl and P. R. Cook, "Banded waveguides: towards physical modeling of
  bowed bar percussion instruments", ICMC 1999.
- N. H. Fletcher and T. D. Rossing, *The Physics of Musical Instruments*,
  2nd ed., Springer 1998: bar, plate, membrane and cantilever modes; string
  inharmonicity; bridge hill; tone-hole cut-off; stretched tuning.
- J. C. Schelleng, "The bowed string and the player", JASA 53 (1973):
  bow-force limits against bow position.
- M. E. McIntyre, R. T. Schumacher, J. Woodhouse, "On the oscillations of
  musical instruments", JASA 74 (1983): reflection-function self-oscillators.
- Trombolese (`src/trombolese/reed.py`, `acoustics.py`, `constants.py`): the
  lip valve and its exact coupled solve, air constants, boundary-layer
  attenuation; measured pitch compensation.
- Reverberator (`Reverberator.jsfx`, `docs/MATERIALS.md`, ADRs 0002, 0005,
  0006, 0007, 0008, 0009, 0010): material constants, T60 from η,
  `disp_solve`, `op_fit`, guitar-body modes, contact rattle, headless ysfx.
