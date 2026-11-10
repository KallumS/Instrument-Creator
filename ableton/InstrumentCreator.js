/* Instrument Creator - built by ableton/kit/build.py from ableton/device.json. Do not edit; edit the sources and rebuild. */
var DEVICE = {"audio": true, "main": "Instrument-Creator.jsfx", "title": "Instrument Creator"};
DEVICE.files = {"Instrument-Creator.jsfx": "desc:Instrument Creator \u00e2\u0080\u0094 Build Impossible Instruments from Parts\n//tags: instrument synthesizer physical-modelling\n//author: KallumS\n//\n// A playable MIDI instrument assembled from ten kinds of part, the way a real\n// instrument is: an energy source drives an exciter, which sets a vibrating\n// element going; a coupler passes the vibration to a resonator, and a\n// radiator sends it into the air. Four control parts (frequency control,\n// tuning, damping, modulation) decide how it is played. The vibrating element\n// and the resonator can be made of any of twenty materials, real or silly.\n//\n// Every part is a small physical model. The element's pitch, decay and\n// inharmonicity come from the material's real constants (stiffness, density,\n// loss factor), the air column from Trombolese's boundary-layer physics, and\n// the loop tuning from Reverberator's phase-exact method. See README.md.\n\nslider1:0<0,5,1{Breath,Bow,Finger,Plectrum,Hammer,Electricity}>-Energy Source\nslider2:0<0,5,1{Reed,Lips,Hammer,Bow,Plectrum,Mallet}>-Exciter\nslider3:5<0,5,1{String,Membrane,Bar,Plate,Reed,Air Column}>-Vibrating Element\nslider4:12<0,30,1{Steel,Brass,Bronze,Aluminium,Gold,Glass,Crystal,Ice,Marble,Clay,Spruce,Rosewood,Bamboo,Bone,Gut,Nylon,Carbon Fibre,Rubber,Paper,Jelly,Plastic,PVC,Wood,Leather,Cardboard,Foil,Cling Film,Tin,Car Panel,Chain Link,Handpan Steel}>-Element Material\nslider5:0<0,4,1{Bore,Soundbox,Pipe,Cavity,Body}>-Resonator\nslider6:12<0,30,1{Steel,Brass,Bronze,Aluminium,Gold,Glass,Crystal,Ice,Marble,Clay,Spruce,Rosewood,Bamboo,Bone,Gut,Nylon,Carbon Fibre,Rubber,Paper,Jelly,Plastic,PVC,Wood,Leather,Cardboard,Foil,Cling Film,Tin,Car Panel,Chain Link,Handpan Steel}>-Resonator Material\nslider7:2<0,3,1{Bridge,Soundpost,Mouthpiece,Windway}>-Coupler\nslider8:0<0,3,1{Bell,Soundboard,Drumhead,Cone}>-Radiator\nslider9:1<0,4,1{Fret,Tone Hole,Valve,Slide,Key}>-Frequency Control\nslider10:2<0,3,1{Peg,Tuning Pin,Machine Head,Slide}>-Tuning Mechanism\nslider11:0<0,4,1{Damper,Mute,Palm,Felt,Hand}>-Damping\nslider12:0<0,4,1{Keywork,Pedals,Valves,Levers,Electronics}>-Modulation / Control\nslider13:70<0,100,1>-Force / Pressure (%)\nslider14:100<25,400,1:log=100>-Size (%)\nslider15:0<-100,100,1>-Brightness\nslider16:100<10,400,1:log=100>-Decay (%)\nslider17:20<2,50,1>-Excite Position (%)\nslider18:50<0,100,1>-Resonator Amount (%)\nslider19:0<0,1,1{Poly,Mono (Legato)}>-Play Mode\nslider20:120<5,1000,1:log=150>-Glide Time (ms)\nslider21:0<-100,100,1>-Fine Tune (cents)\nslider22:0<-36,12,0.1>-Output (dB)\nslider23:0<0,100,1>-Age / Rust (%)\n\nin_pin:none\nout_pin:Left output\nout_pin:Right output\n\n@init\n\next_noinit = 1;\ngfx_ext_retina = 1;   // draw at full resolution on Retina/HiDPI screens (gsc in @gfx scales the layout)\n\n// ---------------------------------------------------------------------------\n// Memory map (units: EEL memory slots). Names are long on purpose: EEL2\n// identifiers are case-insensitive (see Reverberator ADR 0010).\n// ---------------------------------------------------------------------------\nVOICE_BASE = 0; VOICE_STRIDE = 512; VOICES_MAX = 8;\nMODE_OFF = 160; MODE_STRIDE = 8; MODES_MAX = 24;\nMAT_TAB = 13600; MAT_STRIDE = 16; MAT_N = 31;\n// 14200: CAT_TAB, each part's box, anchor and label in the drawing (12 x 16, window only; set with the drawing below)\nFOCUS_TAB = 14400; FOCUS_MAX = 64;  // keyboard focus list: id, x, y, w, h per control (window only)\nHIG_TXT = 14800; HIG_TXT_MAX = 180; // text audit for the tests: count, then r, g, b, x, y, w, h, - per string (window only)\nBESSEL_TAB = 4600; BAR_TAB = 4700; CANT_TAB = 4720; PLATE_TAB = 4750;\nBODY_BASE = 5000; BODY_STRIDE = 8; BODY_MAX = 24;\nHEAD_BASE = 5300; HEAD_MAX = 8;\nNOTE_STACK = 5500;\nBIQ_COEF = 5600; BIQ_STATE = 5700;\nMIDIQ = 82000; MIDIQ_MAX = 1000;\nSCOPE_BUF = 11000; SCOPE_LEN = 2048;\nDIFF_BASE = 16384; DIFF_LEN = 8192;\nLINE_BASE = 131072; LINE_LEN = 16384; LINE_MASK = 16383;\n\n// Voice fields\nV_ON = 0; V_NOTE = 1; V_VEL = 2; V_GATE = 3; V_HELD = 4; V_AGE = 5;\nV_PITCH = 6; V_PTGT = 7; V_T = 8; V_ENV = 9; V_LVLF = 10; V_REL = 11;\nV_STRK = 12; V_PT = 13; V_PA = 14; V_PDUR = 15; V_E1 = 16; V_E2 = 17;\nV_C = 18; V_WP = 19; V_DA = 20; V_DB = 21; V_DJ = 22; V_DR = 23;\nV_LB = 24; V_LP = 25; V_LS = 26; V_SGN = 27; V_APA = 28; V_APM = 29;\nV_AP = 30;            // 8 slots: dispersion allpass states\nV_LIPA1 = 38; V_LIPA2 = 39; V_LIPY1 = 40; V_LIPY2 = 41;\nV_DCX = 42; V_DCY = 43; V_LDCX = 44; V_LDCY = 45;\nV_RLS = 46; V_RG = 47; V_RSGN = 48; V_RLB = 49; V_RLP = 50;\nV_PANL = 51; V_PANR = 52; V_NM = 53; V_XLP = 54; V_TRT = 55;\nV_DETC = 56; V_SETL = 57; V_THS = 58; V_THC = 59; V_OG = 60;\nV_FCUR = 61; V_FMOD = 62; V_FBASE = 63; V_WG = 64; V_TWO = 65;\nV_LOOPK = 66; V_XT = 67; V_CONT = 68; V_LEVEL = 69; V_NRES = 70;\nV_BETA = 71; V_TLO = 72; V_THI = 73; V_FB = 74; V_TPA = 75; V_TPB = 76;\nV_DRV = 77; V_LBASE = 78; V_INDC = 79; V_NS = 80; V_NS2 = 81;\nV_PLKN = 82; V_RES_K = 83; V_WOB = 84; V_DIP = 85; V_OUTP = 86;\nV_SUSDRV = 87; V_EG = 88; V_CHOP = 89; V_LIPY = 90; V_LIPV = 91; V_LIPIM = 92; V_FK = 93; V_BANDED = 94; V_NB = 95; V_DRVN = 96; V_LIPR = 97; V_RATS = 98; V_RATX = 99; V_CRKS = 100; V_CRKX = 101;\nBAND_STRIDE = 20;\n\n// ---------------------------------------------------------------------------\n// Air at 20 C (Trombolese constants.py)\n// ---------------------------------------------------------------------------\nC_AIR = 343.2; RHO_AIR = 1.204; NU_AIR = 0.00001506; GAM_AIR = 1.4017; PR_AIR = 0.708;\nBLC = sqrt(NU_AIR) + (GAM_AIR - 1)*sqrt(NU_AIR/PR_AIR);\n\n// ---------------------------------------------------------------------------\n// Materials: stiffness E (GPa), density (kg/m^3), loss factor eta at 1 kHz,\n// how eta grows with frequency, irregularity (grain, cracks, bubbles: splits\n// modes), wall roughness for air columns, hardness (how sharp a strike is),\n// how thick a string of it must be (you cannot draw marble into wire),\n// colour, longest ring the mounting allows (s), wobble (jelly), crackle\n// (crumpled foil) and rattle (loose fixings, film slapping: Reverberator's\n// contact rattle).\n// ---------------------------------------------------------------------------\nM_E = 0; M_RHO = 1; M_ETA = 2; M_SLOPE = 3; M_IRR = 4; M_ROUGH = 5; M_HARD = 6;\nM_THICK = 7; M_CR = 8; M_CG = 9; M_CB = 10; M_TMAX = 11; M_WOB = 12; M_CRK = 13; M_RAT = 14;\nfunction mat_def(idx, ee, rho, eta, slp, irr, rough, hard, thick, cr, cg, cb, tmax, wob) local(p)\n(\n  p = MAT_TAB + idx*MAT_STRIDE;\n  p[13] = p[14] = 0;\n  p[0] = ee; p[1] = rho; p[2] = eta; p[3] = slp; p[4] = irr; p[5] = rough; p[6] = hard;\n  p[7] = thick; p[8] = cr; p[9] = cg; p[10] = cb; p[11] = tmax; p[12] = wob;\n);\nmat_def( 0, 200,   7850,  0.0003,  0.1, 0.001, 1.0, 1.0,  1.0, 0.70, 0.74, 0.80, 16, 0);   // Steel\nmat_def( 1, 110,   8500,  0.0008,  0.1, 0.002, 1.0, 0.9,  1.0, 0.88, 0.72, 0.30, 12, 0);   // Brass\nmat_def( 2, 110,   8700,  0.0004,  0.1, 0.004, 1.0, 0.95, 1.0, 0.74, 0.50, 0.26, 20, 0);   // Bronze\nmat_def( 3, 69,    2700,  0.0003,  0.1, 0.001, 1.0, 0.8,  1.5, 0.84, 0.86, 0.88, 14, 0);   // Aluminium\nmat_def( 4, 79,    19300, 0.003,   0.2, 0.002, 1.0, 0.5,  1.0, 1.00, 0.82, 0.25, 6, 0);    // Gold\nmat_def( 5, 70,    2500,  0.0008,  0.1, 0.004, 0.9, 1.0,  3.0, 0.62, 0.86, 0.94, 10, 0);   // Glass\nmat_def( 6, 80,    2650,  0.00008, 0.0, 0.002, 0.9, 1.0,  3.0, 0.86, 0.78, 1.00, 30, 0);   // Crystal\nmat_def( 7, 9,     917,   0.0025,  0.3, 0.02,  0.8, 0.7,  4.0, 0.80, 0.93, 1.00, 6, 0);    // Ice\nmat_def( 8, 55,    2700,  0.003,   0.2, 0.012, 1.0, 1.0,  4.0, 0.92, 0.90, 0.88, 5, 0);    // Marble\nmat_def( 9, 40,    2000,  0.005,   0.3, 0.02,  2.5, 0.9,  4.0, 0.80, 0.45, 0.30, 3, 0);    // Clay\nmat_def(10, 11,    440,   0.008,   0.4, 0.02,  1.5, 0.45, 3.0, 0.90, 0.76, 0.50, 3, 0);    // Spruce\nmat_def(11, 16,    850,   0.006,   0.4, 0.015, 1.4, 0.55, 3.0, 0.55, 0.28, 0.16, 3, 0);    // Rosewood\nmat_def(12, 20,    700,   0.009,   0.4, 0.02,  1.3, 0.5,  2.5, 0.80, 0.78, 0.42, 3, 0);    // Bamboo\nmat_def(13, 18,    1900,  0.012,   0.3, 0.015, 1.6, 0.8,  3.0, 0.95, 0.92, 0.82, 2.5, 0);  // Bone\nmat_def(14, 4,     1300,  0.006,   0.5, 0.005, 1.3, 0.35, 1.3, 0.90, 0.84, 0.66, 5, 0);    // Gut\nmat_def(15, 3,     1140,  0.004,   0.5, 0.002, 1.0, 0.35, 1.3, 0.96, 0.96, 0.92, 6, 0);    // Nylon\nmat_def(16, 150,   1600,  0.002,   0.2, 0.002, 1.0, 0.9,  1.5, 0.30, 0.31, 0.36, 8, 0);    // Carbon fibre\nmat_def(17, 0.05,  1100,  0.035,   0.3, 0.01,  1.2, 0.12, 2.0, 0.80, 0.25, 0.22, 1.2, 0.4); // Rubber\nmat_def(18, 3,     700,   0.03,    0.3, 0.03,  4.0, 0.2,  3.0, 0.86, 0.82, 0.72, 1.2, 0.15);// Paper\nmat_def(19, 0.00005, 1050, 0.045,  0.2, 0.05,  1.2, 0.05, 6.0, 0.95, 0.25, 0.45, 1.0, 1);  // Jelly\n\n// From Reverberator's objects: PVC pipe, toilet roll tube (cardboard), foil,\n// cling film (polyethylene), corrugated tin roof, car body panel, chain link\n// fence, handpan. The lossiest are made less lossy than the real thing (PVC\n// 0.03, cardboard 0.06, leather 0.06, film 0.12 in Reverberator) so that they\n// can still be played.\nmat_def(20, 2.3,   1050,  0.01,    0.3, 0.005, 1.0, 0.4,  2.0, 0.20, 0.55, 0.90, 2.0, 0);   // Plastic (ABS)\nmat_def(21, 3,     1400,  0.022,   0.3, 0.003, 1.0, 0.45, 2.0, 0.90, 0.90, 0.86, 2.0, 0);   // PVC\nmat_def(22, 12,    650,   0.007,   0.4, 0.02,  1.4, 0.6,  3.0, 0.78, 0.58, 0.36, 3, 0);     // Wood (maple)\nmat_def(23, 0.1,   900,   0.04,    0.3, 0.02,  2.0, 0.2,  3.0, 0.48, 0.30, 0.17, 1.2, 0.1); // Leather\nmat_def(24, 3,     700,   0.04,    0.3, 0.03,  4.0, 0.25, 3.0, 0.70, 0.54, 0.36, 1.2, 0);   // Cardboard\nmat_def(25, 69,    2700,  0.02,    0.2, 0.05,  1.5, 0.6,  1.0, 0.86, 0.88, 0.91, 1.5, 0);   // Foil (crumpled aluminium)\nmat_def(26, 0.2,   920,   0.05,    0.3, 0.01,  1.5, 0.1,  4.0, 0.82, 0.92, 0.96, 1.0, 0.3); // Cling film\nmat_def(27, 207,   7850,  0.004,   0.1, 0.03,  1.2, 0.9,  1.0, 0.64, 0.68, 0.70, 3, 0);     // Tin (galvanised roof sheet)\nmat_def(28, 207,   7850,  0.003,   0.1, 0.01,  1.0, 0.9,  1.0, 0.78, 0.12, 0.15, 2.5, 0);   // Car panel (painted steel)\nmat_def(29, 200,   7850,  0.0015,  0.1, 0.03,  1.0, 1.0,  1.0, 0.62, 0.68, 0.62, 4, 0);     // Chain link (steel wire mesh)\nmat_def(30, 207,   7850,  0.0022,  0.1, 0.001, 1.0, 1.0,  1.0, 0.36, 0.38, 0.44, 8, 0);     // Handpan steel (nitrided)\nMAT_TAB[25*MAT_STRIDE + M_CRK] = 1;                 // foil crinkles\nMAT_TAB[26*MAT_STRIDE + M_RAT] = 1;                 // film slaps and buzzes (a kazoo)\nMAT_TAB[27*MAT_STRIDE + M_RAT] = 0.7;               // loose roofing fixings\nMAT_TAB[28*MAT_STRIDE + M_RAT] = 0.3;               // panel clank\nMAT_TAB[29*MAT_STRIDE + M_RAT] = 1;                 // fence links jangle\n\nfunction mat(m, k) ( MAT_TAB[m*MAT_STRIDE + k]; );\n\n// ---------------------------------------------------------------------------\n// Mode tables\n// ---------------------------------------------------------------------------\n// Circular membrane: Bessel zeros j_mn and their angular order m, sorted\ni = 0;\nfunction jz(j, m) ( BESSEL_TAB[i*2] = j; BESSEL_TAB[i*2+1] = m; i += 1; );\njz(2.4048,0); jz(3.8317,1); jz(5.1356,2); jz(5.5201,0); jz(6.3802,3); jz(7.0156,1);\njz(7.5883,4); jz(8.4172,2); jz(8.6537,0); jz(8.7715,5); jz(9.7610,3); jz(9.9361,6);\njz(10.1735,1); jz(11.0647,4); jz(11.0864,7); jz(11.6198,2); jz(11.7915,0); jz(12.2251,8);\njz(12.3386,5); jz(13.0152,3); jz(13.3237,1); jz(13.3543,9); jz(13.5893,6); jz(14.4755,10);\n// Free-free bar: beta_n L\nBAR_TAB[0] = 4.7300; BAR_TAB[1] = 7.8532; BAR_TAB[2] = 10.9956; BAR_TAB[3] = 14.1372;\nBAR_TAB[4] = 17.2788; BAR_TAB[5] = 20.4204; BAR_TAB[6] = 23.5619; BAR_TAB[7] = 26.7035;\n// Clamped-free cantilever (a reed or a tine): beta_n L\nCANT_TAB[0] = 1.8751; CANT_TAB[1] = 4.6941; CANT_TAB[2] = 7.8548; CANT_TAB[3] = 10.9955;\nCANT_TAB[4] = 14.1372; CANT_TAB[5] = 17.2788;\n// Simply supported rectangular plate, aspect 1 : 0.73: the 20 lowest (m, n)\ni = 0;\ni = 0; loop(60, PLATE_TAB[i] = 0; i += 1;);\nbegin_i = 0; mm_i = 1;\nloop(8, nn_i = 1;\n  loop(8,\n    q = mm_i*mm_i + (nn_i/0.73)^2;\n    // insertion sort into the first 20 slots\n    k = min(begin_i, 20); j = k;\n    while (j > 0 && PLATE_TAB[(j-1)*3] > q) ( j <= 19 ? ( PLATE_TAB[j*3] = PLATE_TAB[(j-1)*3]; PLATE_TAB[j*3+1] = PLATE_TAB[(j-1)*3+1]; PLATE_TAB[j*3+2] = PLATE_TAB[(j-1)*3+2]; ); j -= 1; );\n    j < 20 ? ( PLATE_TAB[j*3] = q; PLATE_TAB[j*3+1] = mm_i; PLATE_TAB[j*3+2] = nn_i; );\n    begin_i += 1; nn_i += 1;\n  );\n  mm_i += 1;\n);\n\n// ---------------------------------------------------------------------------\n// Physics helpers (Reverberator)\n// ---------------------------------------------------------------------------\n// T60 of a mode of material m at frequency f: sigma = pi f eta, T60 = 2.2/(f eta),\n// capped by the losses eta does not describe (mounting, air).\n//\n// Age: rust, cracks and tired joints add loss (more of it at high\n// frequencies, as a corroded or cracked surface rubs), and shorten the\n// longest ring the mounting allows.\nfunction age_eta(f) ( 1 + age_*age_*(AGE_ETA + AGE_ETA_HF*max(0, f/2000)); );\nfunction mat_t60(m, f) local(p, eta)\n(\n  p = MAT_TAB + m*MAT_STRIDE;\n  eta = p[2]*(max(f, 20)/1000)^p[3]*age_eta(f);\n  1/((1 + AGE_TMAX*age_)/p[11] + f*eta/2.2);\n);\n\nfunction gd1(w, a) ( (1 - a*a)/(1 + 2*a*cos(w) + a*a); );\nfunction ph1(w, a) ( w - 2*atan(a*sin(w)/(1 + a*cos(w))); );\nfunction phlp(w, p) ( atan2(p*sin(w), 1 - p*cos(w)); );\n// phase lag of y = (1-k) x + k lowpass(x), the tone-hole shelf\nfunction phshelf(w, c, k) local(p, dd, re, im)\n(\n  p = 1 - c; dd = 1 - 2*p*cos(w) + p*p;\n  re = (1 - k) + k*c*(1 - p*cos(w))/dd; im = k*c*p*sin(w)/dd;\n  atan2(im, re);\n);\n// phase lag of the DC blocker (1 - z^-1)/(1 - R z^-1); negative = a lead\nfunction phdc(w, rr) ( atan2(rr*sin(w), 1 - rr*cos(w)) - 0.5*($pi - w); );\n\n// Fit a one-pole lowpass to per-pass gains ga (DC) and gb (at wb).\nfunction op_fit(ga, gb, wb) local(r2, cb, aa, bb, disc)\n(\n  ga = min(ga, 0.9999995); gb = min(gb, ga);\n  r2 = (gb/ga)^2;\n  r2 > 0.999999 ? ( op_p = 0; op_b = ga; ) : (\n    cb = cos(wb); aa = 1 - r2; bb = 1 - r2*cb;\n    disc = max(0, bb*bb - aa*aa);\n    op_p = max(0, min(0.9995, (bb - sqrt(disc))/aa));\n    op_b = ga*(1 - op_p);\n  );\n);\n\n// The same one-pole fitted at the fundamental (wa) instead of DC, so a strong\n// high-frequency loss cannot eat into the note itself. The DC gain it\n// implies is capped below one, which is what keeps the loop stable.\nfunction op_fit2(ga, wa, gb, wb) local(r2, ca, cb, aa, bb, disc)\n(\n  ga = min(ga, 0.9999995); gb = min(gb, ga);\n  r2 = (gb/ga)^2;\n  r2 > 0.999999 ? ( op_p = 0; op_b = ga; ) : (\n    ca = cos(wa); cb = cos(wb); aa = 1 - r2; bb = ca - r2*cb;\n    disc = max(0, bb*bb - aa*aa);\n    op_p = max(0, min(0.95, (bb - sqrt(disc))/aa));\n    op_b = ga*sqrt(1 - 2*op_p*ca + op_p*op_p);\n    op_b = min(op_b, 0.9999995*(1 - op_p));\n  );\n);\n\nfunction disp_diff(a) ( dd_m*(gd1(dd_wa, a) - gd1(dd_wb, a)); );\ndisp_lim = -0.9;\nfunction disp_solve(dlt) local(lo, hi, mid)\n(\n  (dd_m <= 0 || dlt <= 0) ? 0 : (\n    lo = disp_lim; hi = 0;\n    disp_diff(lo) <= dlt ? lo : (\n      loop(40, mid = 0.5*(lo + hi); disp_diff(mid) > dlt ? lo = mid : hi = mid;);\n      0.5*(lo + hi);\n    );\n  );\n);\n\n// Kirchhoff boundary-layer attenuation in a tube of radius a (Trombolese)\nfunction tube_alpha(f, a) ( sqrt($pi*f)*BLC/(a*C_AIR); );\n\nfunction besj(m, x) local(s, t, k, hx)\n(\n  hx = 0.5*x; t = 1; k = 1;\n  loop(m, t *= hx/k; k += 1;);\n  s = t; k = 1;\n  loop(40, t *= -hx*hx/(k*(k + m)); s += t; k += 1;);\n  s;\n);\n\nfunction cosh_(x) ( 0.5*(exp(x) + exp(-x)); );\nfunction sinh_(x) ( 0.5*(exp(x) - exp(-x)); );\n// Free-free beam mode shape at x (0..1), magnitude 2 at the ends.\nfunction bar_shape(n, x) local(b, u)\n(\n  b = BAR_TAB[n]; u = x - 0.5;\n  (n & 1) == 0 ? cos(b*u)/cos(0.5*b) + cosh_(b*u)/cosh_(0.5*b)\n               : sin(b*u)/sin(0.5*b) + sinh_(b*u)/sinh_(0.5*b);\n);\n// Clamped-free cantilever mode shape at x (0 = clamp, 1 = free tip), ~2 at the tip.\nfunction cant_shape(n, x) local(b, sg)\n(\n  b = CANT_TAB[n];\n  sg = (cosh_(b) + cos(b))/(sinh_(b) + sin(b));\n  cosh_(b*x) - cos(b*x) - sg*(sinh_(b*x) - sin(b*x));\n);\n\nfunction tanh_(x) local(e2) ( x = max(-9, min(9, x)); e2 = exp(2*x); (e2 - 1)/(e2 + 1); );\n// deterministic \"random\" in -1..1 for a seed\nfunction hash1(s) local(x) ( x = sin(s*12.9898 + 78.233)*43758.5453; 2*(x - floor(x)) - 1; );\n\n// RBJ biquads into a 5-slot block: b0 b1 b2 a1 a2\nfunction bq_lp(o, fc, q) local(w, al, cw, a0)\n( w = 2*$pi*min(fc, 0.45*srate)/srate; al = sin(w)/(2*q); cw = cos(w); a0 = 1 + al;\n  o[0] = (1 - cw)/2/a0; o[1] = (1 - cw)/a0; o[2] = (1 - cw)/2/a0; o[3] = -2*cw/a0; o[4] = (1 - al)/a0; );\nfunction bq_hp(o, fc, q) local(w, al, cw, a0)\n( w = 2*$pi*min(fc, 0.45*srate)/srate; al = sin(w)/(2*q); cw = cos(w); a0 = 1 + al;\n  o[0] = (1 + cw)/2/a0; o[1] = -(1 + cw)/a0; o[2] = (1 + cw)/2/a0; o[3] = -2*cw/a0; o[4] = (1 - al)/a0; );\nfunction bq_pk(o, fc, q, db) local(w, al, cw, a0, ag)\n( w = 2*$pi*min(fc, 0.45*srate)/srate; ag = 10^(db/40); al = sin(w)/(2*q); cw = cos(w); a0 = 1 + al/ag;\n  o[0] = (1 + al*ag)/a0; o[1] = -2*cw/a0; o[2] = (1 - al*ag)/a0; o[3] = -2*cw/a0; o[4] = (1 - al/ag)/a0; );\nfunction bq_off(o) ( o[0] = 1; o[1] = o[2] = o[3] = o[4] = 0; );\nfunction bq(o, s, x) local(y)\n( y = o[0]*x + o[1]*s[0] + o[2]*s[1] - o[3]*s[2] - o[4]*s[3];\n  s[1] = s[0]; s[0] = x; s[3] = s[2]; s[2] = y; y; );\n\n// 4-point Lagrange fractional read, delay d >= 2 samples (the sample written\n// last is delay 1).\nfunction lag_read(buf, wp, d) local(n0, fr, i0, x0, x1, x2, x3, d1, d2, d3)\n(\n  n0 = floor(d) - 1; fr = d - n0;\n  i0 = (wp - n0 + LINE_LEN) & LINE_MASK;\n  x0 = buf[i0]; x1 = buf[(i0 - 1 + LINE_LEN) & LINE_MASK];\n  x2 = buf[(i0 - 2 + LINE_LEN) & LINE_MASK]; x3 = buf[(i0 - 3 + LINE_LEN) & LINE_MASK];\n  d1 = fr - 1; d2 = fr - 2; d3 = fr - 3;\n  -d1*d2*d3*(1/6)*x0 + fr*d2*d3*0.5*x1 - fr*d1*d3*0.5*x2 + fr*d1*d2*(1/6)*x3;\n);\nfunction lin_read(buf, wp, d) local(n0, fr)\n(\n  n0 = floor(d); fr = d - n0;\n  (1 - fr)*buf[(wp - n0 + LINE_LEN) & LINE_MASK] + fr*buf[(wp - n0 - 1 + LINE_LEN) & LINE_MASK];\n);\n\n// ---------------------------------------------------------------------------\n// Part parameters, derived from the sliders\n// ---------------------------------------------------------------------------\nfunction energy_params(en)\n(\n  // ep_sus: steady supply; ep_att/ep_rel: how fast it arrives and stops;\n  // ep_noise: turbulence/rosin grain; ep_rate: strikes per second when a\n  // steady supply drives a striking exciter; ep_width: contact softness;\n  // ep_vexp: velocity response; ep_dec: how long a single burst lasts when\n  // it drives a sustaining exciter.\n  en == 0 ? ( ep_sus = 1; ep_att = 0.035; ep_rel = 0.06;  ep_noise = 0.035; ep_rate = 11; ep_jit = 0.25; ep_width = 1.3;  ep_vexp = 1.0; ep_dec = 0.4; ) :\n  en == 1 ? ( ep_sus = 1; ep_att = 0.08;  ep_rel = 0.10;  ep_noise = 0.025; ep_rate = 15; ep_jit = 0.45; ep_width = 1.0;  ep_vexp = 1.0; ep_dec = 0.4; ) :\n  en == 2 ? ( ep_sus = 0; ep_att = 0.004; ep_rel = 0.05;  ep_noise = 0.01; ep_rate = 0;  ep_jit = 0;    ep_width = 2.2;  ep_vexp = 1.3; ep_dec = 0.5; ep_hold = 0.15; ) :\n  en == 3 ? ( ep_sus = 0; ep_att = 0.0015; ep_rel = 0.05; ep_noise = 0.02; ep_rate = 0;  ep_jit = 0;    ep_width = 0.55; ep_vexp = 1.2; ep_dec = 0.35; ep_hold = 0.1; ) :\n  en == 4 ? ( ep_sus = 0; ep_att = 0.0008; ep_rel = 0.05; ep_noise = 0.01; ep_rate = 0;  ep_jit = 0;    ep_width = 0.8;  ep_vexp = 1.8; ep_dec = 0.25; ep_hold = 0.06; ) :\n            ( ep_sus = 1; ep_att = 0.003; ep_rel = 0.012; ep_noise = 0;    ep_rate = 25; ep_jit = 0;    ep_width = 0.6;  ep_vexp = 0.7; ep_dec = 0.4; );\n);\n\n\n// Held-note T60 multiplier from the damping part (what touches the element\n// while it plays), per frequency.\nfunction damp_mul(f)\n(\n  dm_type == 1 ? 1/(1 + f/2500) :                 // mute\n  dm_type == 2 ? 1/(1 + f/1500) :                 // palm (and capped below)\n  dm_type == 3 ? 1/sqrt(1 + (f/600)^2) :          // felt\n  dm_type == 4 ? 1/(1 + f/1200) : 1;              // hand\n);\n// Brightness: lets highs ring longer (+) or die faster (-), full effect by 4 kHz\nfunction bright_mul(f) local(x) ( x = log(max(f, 1)/500)/log(8); bm^max(0, min(1, x)); );\n// Tone holes: harmonics above the lattice's cutoff leak out of the holes.\nfunction hole_mul(f) local(x) ( fc_type == 1 ? ( x = f/max(1500, 2.2*cur_f0); max(0.3, 1/(1 + x*x)); ) : 1; );\nfunction held_t60(m, f) local(t)\n(\n  t = mat_t60(m, f)*decay_*drain*damp_mul(f)*bright_mul(f)*hole_mul(f);\n  dm_type == 2 ? t = min(t, 0.35);\n  t;\n);\nfunction release_t60()\n(\n  (dm_type == 0 ? 0.12 : dm_type == 1 ? 0.4 : dm_type == 2 ? 0.08 : dm_type == 3 ? 0.3 : 0.2)\n    *(md_type == 1 ? 1 + 19*mw : 1);\n);\n\n// Tuning mechanism: a fixed per-note offset in cents.\nfunction tuning_cents(note) local(d)\n(\n  tm_type == 0 ? 8*hash1(note) :                              // peg: never quite in tune\n  tm_type == 1 ? ( d = (note - 69)/12; 2.2*d*abs(d); ) :      // tuning pin: stretched octaves\n  0;                                                          // machine head, slide\n);\n\n// Age: an old instrument is out of tune, differently on every note.\nfunction age_detune(note) ( AGE_DET*age_*hash1(note*7.31 + 3); );\n\n// Valve instruments play some notes on valve combinations that are\n// famously sharp (1+3, 1+2+3).\nfunction valve_cents(note) local(k) ( k = (note + 2) % 12; k == 5 ? 12 : k == 6 ? 22 : k == 11 ? 6 : 0; );\n\n// ---------------------------------------------------------------------------\n// Waveguide elements: string and air column\n// ---------------------------------------------------------------------------\nfunction wg_loss(v, tlo, thi) local(ga, gb)\n(\n  ga = 10^(-3*v[V_TPA]/max(0.002, tlo));\n  gb = 10^(-3*v[V_TPB]/max(0.002, thi));\n  op_fit2(ga, 2*$pi*v[V_FBASE]/srate, gb, 2*$pi*v[V_FB]/srate);\n  v[V_LB] = op_b; v[V_LP] = op_p;\n);\n\nfunction wg_setup(v, f0) local(sl, d, bb, fb, n, ft, ta, tb, tl, rough, a, ga, gb, lo, hi, rad)\n(\n  v[V_WG] = 1;\n  fb = min(5000, 0.4*srate); v[V_FB] = fb;\n  el == 0 ? (\n    // STRING. Tension sets the pitch; the material's stiffness adds\n    // inharmonicity B = pi^2 E d^2 / (64 rho L^4 f0^2). Brittle materials\n    // must be thick rods, so they come out stiff and bell-like.\n    v[V_TWO] = 1; v[V_SGN] = -1; v[V_LOOPK] = 2; v[V_BETA] = beta_;\n    (ex_cont && ex_eff == 1) ? ( v[V_TWO] = 0; v[V_SGN] = 1; v[V_LOOPK] = LIP_LOOPK; v[V_INDC] = 1; );\n    (ex_cont && ex_eff == 6) ? ( v[V_TWO] = 0; v[V_SGN] = -1; v[V_LOOPK] = 3; v[V_INDC] = 1; );\n    sl = max(0.04, min(2.2, 0.65*2^(-(v[V_NOTE] - 52)/18)));\n    d = 0.0008*mat(elm, M_THICK);\n    bb = min(0.05, $pi*$pi*mat(elm, M_E)*10^9*d*d/(64*mat(elm, M_RHO)*sl^4*f0*f0));\n    ft = min(fb, 0.3*srate);\n    n = ft/f0; loop(30, n = 0.5*(n + ft/(f0*sqrt(1 + bb*n*n))););\n    n = max(n, 2);\n    fb = n*f0*sqrt(1 + bb*n*n); v[V_FB] = fb;\n    ta = sqrt(1 + bb)/(f0*(1 + 2*bb)); tb = sqrt(1 + bb*n*n)/(f0*(1 + 2*bb*n*n));\n    v[V_TPA] = ta; v[V_TPB] = tb;\n    dd_m = 4; dd_wa = 2*$pi*f0*sqrt(1 + bb)/srate; dd_wb = 2*$pi*fb/srate;\n    // dispersion budget: the allpasses may take at most 40% of the loop's\n    // phase at the fundamental, or a short stiff string has no delay left\n    disp_lim = -0.9;\n    while (disp_lim < -0.02 && dd_m*ph1(dd_wa, disp_lim) > 0.4*2*$pi) ( disp_lim += 0.02; );\n    v[V_APA] = disp_solve((ta - tb)*srate);\n    disp_lim = -0.9;\n    // a bow's stick-slip corner travels at the group delay of the highs, so\n    // dispersion would drag a bowed note sharp: bowed strings stay harmonic\n    v[V_APM] = (v[V_APA] < 0 && !(ex_cont && ex_eff == 3) && !DBG_NODISP) ? 4 : 0;\n    v[V_TLO] = held_t60(elm, f0); v[V_THI] = held_t60(elm, fb);\n  ) : (\n    // AIR COLUMN. Boundary-layer loss alpha = sqrt(pi f) BLC / (a c) along\n    // the bore, radiation |R| = exp(-(ka)^2/2) at the open end. Rough or\n    // floppy walls (paper, rubber, jelly) lose more.\n    v[V_TWO] = 0;\n    ex_cont ? (\n      ex_eff == 0 ? ( v[V_SGN] = -1; v[V_LOOPK] = 1; ) :                                                    // reed: cylinder (clarinet)\n      ex_eff == 1 ? ( v[V_SGN] = 1; v[V_LOOPK] = LIP_LOOPK; v[V_INDC] = 1; ) :                              // lips: brass\n      ex_eff == 6 ? ( v[V_SGN] = -1; v[V_LOOPK] = 3; v[V_INDC] = 1; ) :                                     // jet: flute, overblown (STK)\n                    ( v[V_SGN] = BOWAIR_SGN; v[V_LOOPK] = BOWAIR_K; );                                        // bow\n    ) : (\n      (cp == 3 || rs == 0) ? ( v[V_SGN] = 1; v[V_LOOPK] = 2; ) : ( v[V_SGN] = -1; v[V_LOOPK] = 1; );\n    );\n    rough = min(2.2, mat(elm, M_ROUGH)*(1 + 0.15*min(6, 1/max(mat(elm, M_E), 0.0001))))*(1 + AGE_BORE*age_);\n    a = max(0.003, min(0.03, 0.007*(262/f0)^0.3));\n    tl = v[V_LOOPK]/(2*f0);\n    v[V_TPA] = tl; v[V_TPB] = tl;\n    rad = 2*$pi*a/C_AIR;\n    ga = exp(-C_AIR*tl*rough*tube_alpha(f0, a))*exp(-0.5*(rad*f0)^2);\n    gb = exp(-C_AIR*tl*rough*tube_alpha(fb, a))*exp(-0.5*(rad*fb)^2);\n    lo = -6.9078*tl/log(min(ga, 0.999999));\n    hi = -6.9078*tl/log(max(0.000001, min(gb, 0.999999)));\n    v[V_TLO] = lo*decay_*drain*damp_mul(f0);\n    v[V_THI] = min(v[V_TLO], hi*decay_*drain*damp_mul(fb)*bright_mul(fb)*hole_mul(fb));\n    dm_type == 2 ? ( v[V_TLO] = min(v[V_TLO], 0.35); v[V_THI] = min(v[V_THI], 0.35); );\n  );\n  wg_loss(v, v[V_TLO], v[V_THI]);\n  v[V_THC] = 0;\n);\n\n// ---------------------------------------------------------------------------\n// Modal elements: membrane, bar, plate, reed (tine)\n// ---------------------------------------------------------------------------\nmode_n = 0;\nfunction mode_put(v, f, wc, wr, t60, nn) local(m, r, th)\n(\n  (f < min(0.45*srate, 18000) && mode_n < MODES_MAX) ? (\n    m = v + MODE_OFF + mode_n*MODE_STRIDE;\n    r = exp(-6.907755/(max(0.003, t60)*srate)); r = min(r, 0.9999995);\n    th = 2*$pi*f/srate;\n    m[0] = 2*r*cos(th); m[1] = r*r; m[2] = 0; m[3] = 0;\n    m[4] = wc/nn; m[5] = wc; m[6] = wr; m[7] = f;\n    mode_n += 1;\n  );\n);\n\nfunction modal_mode(v, f, wc, wr, nn, extra) local(irr, t)\n(\n  t = held_t60(elm, f)*extra;\n  mode_put(v, f, wc, wr, t, nn);\n  irr = mat(elm, M_IRR) + AGE_IRR*age_;\n  // grain, cracks and bubbles split each mode into a beating pair\n  // (buzzing lips cannot choose between two near-equal resonances, so they get one)\n  (irr > 0.004 && !(ex_cont && ex_eff == 1)) ? mode_put(v, f*(1 + irr*(0.6 + 0.4*hash1(f))), 0.6*wc, 0.6*wr, t*0.8, nn);\n);\n\nfunction modal_setup(v, f0) local(nn, k, x, y, r, j, m, st, f, wc, wr, extra, x2)\n(\n  v[V_WG] = 0; mode_n = 0;\n  nn = srate/f0;\n  x = beta_;\n  el == 1 ? (\n    // MEMBRANE. Ideal circular membrane: f_mn = f01 j_mn / j01, with a\n    // stiffness stretch for stiff materials. Struck at radius r: near the\n    // edge rings, the centre thuds. The (0,1) mode radiates hard and dies fast.\n    r = max(0, 0.95 - 1.8*x);\n    st = min(0.03, mat(elm, M_E)*0.0003);\n    k = 0;\n    loop(16,\n      j = BESSEL_TAB[k*2]; m = BESSEL_TAB[k*2+1];\n      f = f0*(j/2.4048)*sqrt(1 + st*(j/2.4048)^2);\n      wc = besj(m, j*r)*(m > 0 ? cos(m*0.7) : 1)*1.7;\n      wr = besj(m, j*0.35)*cos(m*1.9)*1.7 + (m == 0 ? 0.4 : 0);\n      extra = k == 0 ? 0.35 : 1;\n      modal_mode(v, f, wc, wr, nn, extra);\n      k += 1;\n    );\n  ) : el == 2 ? (\n    // BAR. Free-free beam (xylophone, glockenspiel): 1 : 2.76 : 5.40 : 8.93 ...\n    // Struck at x from the end; at the middle the odd (antisymmetric) modes vanish.\n    k = 0;\n    loop(8,\n      f = f0*(BAR_TAB[k]/4.73)^2;\n      wc = 0.5*bar_shape(k, 0.5 - 0.6*x);\n      wr = 0.5*bar_shape(k, 0.12);\n      modal_mode(v, f, wc, wr, nn, 1);\n      k += 1;\n    );\n  ) : el == 3 ? (\n    // PLATE. Simply supported rectangle: f_mn ~ m^2 + (n/0.73)^2 (a gong-ish\n    // or bell-plate spectrum, dense and inharmonic).\n    x = 0.5 - 0.8*beta_; y = 0.5 - 0.7*beta_;\n    k = 0;\n    loop(20,\n      f = f0*PLATE_TAB[k*3]/PLATE_TAB[0];\n      m = PLATE_TAB[k*3+1]; j = PLATE_TAB[k*3+2];\n      wc = sin(m*$pi*x)*sin(j*$pi*y);\n      wr = sin(m*$pi*0.77)*sin(j*$pi*0.31);\n      modal_mode(v, f, wc, wr, nn, 1);\n      k += 1;\n    );\n  ) : (\n    // REED / TINE. Clamped-free cantilever (kalimba, music box, free reed):\n    // 1 : 6.27 : 17.5 : 34.4 ... plucked near the tip by default.\n    x2 = 1 - x;\n    k = 0;\n    loop(6,\n      f = f0*(CANT_TAB[k]/1.8751)^2;\n      wc = 0.5*cant_shape(k, x2);\n      wr = 0.5*cant_shape(k, 1);\n      modal_mode(v, f, wc, wr, nn, 1);\n      k += 1;\n    );\n    v[V_CHOP] = ex_cont;\n  );\n  v[V_NM] = mode_n;\n);\n\nfunction modal_release(v, trel) local(m, r, rn, t)\n(\n  m = v + MODE_OFF;\n  loop(v[V_NM],\n    r = sqrt(m[1]);\n    t = m[7] > 4*v[V_FBASE] ? 0.6*trel : trel;\n    rn = exp(-6.907755/(max(0.003, t)*srate));\n    rn < r ? ( m[0] *= rn/r; m[1] = rn*rn; );\n    m += MODE_STRIDE;\n  );\n);\n\n// Banded waveguides (Essl & Cook, STK BandedWG): when a sustaining exciter\n// (bow, reed, lips, jet) drives a bar, membrane, plate or tine, each mode\n// becomes its own delay loop one period long with a bandpass inside. That\n// gives the exciter travelling waves to scatter, which is what the\n// reflection-function exciters need; a plain resonator bank has none.\n// Descriptors live in line B, the loops' delays in line A.\nfunction band_tune(bd, f) local(th, rr)\n(\n  f = min(f, 0.45*srate);\n  bd[3] = max(2, min(bd[1] - 3, srate/f));\n  th = 2*$pi*f/srate;\n  rr = bd[15];\n  bd[6] = -2*rr*cos(th); bd[7] = rr*rr;\n);\nfunction bands_setup(v) local(m, bd, k, buf, len, f, r, t60, ww)\n(\n  m = v + MODE_OFF; bd = v[V_LBASE] + LINE_LEN; buf = v[V_LBASE];\n  k = 0; ww = 0;\n  loop(v[V_NM],\n    f = m[7]; r = sqrt(m[1]);\n    t60 = -6.907755/(srate*log(r));\n    // a sustaining exciter needs something to push against: very lossy\n    // materials (leather, film, cardboard) get a minimum ring while driven\n    t60 = max(t60, BAND_T60_MIN*(v[V_FBASE]/f)^0.5);\n    len = ceil(2*srate/f) + 6;\n    (buf + len < v[V_LBASE] + LINE_LEN) ? (\n      bd[0] = buf; bd[1] = len; bd[2] = 0; buf += len;\n      bd[4] = 10^(-3/(f*t60));\n      bd[15] = exp(-$pi*max(8, 0.25*f)/srate);\n      bd[5] = 0.5*(1 - bd[15]*bd[15]);\n      bd[8] = bd[9] = bd[10] = bd[11] = bd[16] = 0;\n      // a bow, a lip or a jet touches a patch, not a point: high modes average out\n      bd[12] = m[5]*(v[V_FBASE]/f)^BAND_GAMMA; bd[13] = m[6]; bd[14] = f;\n      band_tune(bd, f);\n      ww += bd[12]*bd[12];\n      bd += BAND_STRIDE; k += 1;\n    );\n    m += MODE_STRIDE;\n  );\n  v[V_NB] = k; v[V_BANDED] = 1;\n  v[V_EG] = 1/max(0.05, ww);\n);\nfunction bands_release(v, trel) local(bd, g)\n(\n  bd = v[V_LBASE] + LINE_LEN;\n  loop(v[V_NB],\n    g = 10^(-3/(bd[14]*(bd[14] > 4*v[V_FBASE] ? 0.6*trel : trel)));\n    bd[4] = min(bd[4], g);\n    bd += BAND_STRIDE;\n  );\n);\n\n// ---------------------------------------------------------------------------\n// Per-voice pitch and control-rate update (every 16 samples)\n// ---------------------------------------------------------------------------\nfunction voice_pitch(v) local(p)\n(\n  p = v[V_PITCH] + v[V_DETC]/100 + v[V_SETL]/100 + fine_st + bend*bend_range + mod_st + v[V_WOB];\n  tm_type == 0 ? p += 0.03*sin(0.8*t_now + v[V_NOTE]);\n  // age: a slow, uneven wander in pitch\n  p += AGE_WOW*age_*age_*(sin(0.43*t_now + 1.7*v[V_NOTE]) + 0.5*sin(1.9*t_now + v[V_NOTE]));\n  440*2^((p - 69)/12);\n);\n\nfunction voice_control(v) local(f, w, ph, dd, db, ratio, m, th, r, wob)\n(\n  v[V_PITCH] += (v[V_PTGT] - v[V_PITCH])*glide_c;\n  v[V_SETL] *= settle_c;\n  wob = mat(elm, M_WOB);\n  wob > 0 ? v[V_WOB] = wob*(0.6*min(1, 3*v[V_LVLF]) + 0.25*sin(2.3*t_now + v[V_NOTE]))*0.5;\n  f = voice_pitch(v);\n  v[V_FCUR] = f;\n  w = 2*$pi*f*v[V_FK]/srate;\n  v[V_WG] ? (\n    ph = phlp(w, v[V_LP]) + v[V_APM]*ph1(w, v[V_APA]);\n    v[V_THC] > 0 ? ph += phshelf(w, v[V_THC], TH_K);\n    v[V_INDC] ? ph += phdc(w, dc_r);\n    dd = (v[V_LOOPK]*$pi - ph)/w;\n    dd = max(4, min(LINE_LEN - 8, dd));\n    v[V_TWO] ? (\n      db = floor((1 - v[V_BETA])*dd);\n      (v[V_DB] < 1 || abs(db - v[V_DB]) > 2 || dd - v[V_DB] < 2.5) ? v[V_DB] = floor(max(1, min(db, dd - 2.5)));\n      v[V_DA] = dd - v[V_DB];\n    ) : v[V_DA] = dd;\n    v[V_DJ] = max(2.5, 0.32*dd);\n  ) : v[V_BANDED] ? (\n    abs(f/v[V_FMOD] - 1) > 0.00001 ? (\n      ratio = f/v[V_FBASE];\n      m = v[V_LBASE] + LINE_LEN;\n      ratio *= v[V_FK];\n      loop(v[V_NB], band_tune(m, m[14]*ratio); m += BAND_STRIDE;);\n      v[V_FMOD] = f;\n    );\n    v[V_DJ] = max(2.5, 0.32*srate/f);\n  ) : (\n    abs(f/v[V_FMOD] - 1) > 0.00001 ? (\n      ratio = f/v[V_FBASE];\n      m = v + MODE_OFF;\n      loop(v[V_NM],\n        th = 2*$pi*min(m[7]*ratio, 0.49*srate)/srate;\n        m[0] = 2*sqrt(m[1])*cos(th);\n        m += MODE_STRIDE;\n      );\n      v[V_FMOD] = f;\n    );\n    v[V_DJ] = max(2.5, 0.32*srate/f);\n  );\n  v[V_XT] == 1 ? (\n    // lip resonance follows the note (the embouchure); A1 = w/Q, A2 = w^2\n    th = 2*$pi*min(f*v[V_LIPR]*(v[V_BANDED] ? v[V_FK] : 1), 0.3*srate);\n    v[V_LIPA1] = th/LIP_Q; v[V_LIPA2] = th*th; v[V_LIPIM] = th*th*LIP_REST/LIP_CLOSE;\n  );\n  v[V_NRES] ? (\n    // per-voice resonator: a bore (all harmonics) or a stopped pipe (odd ones)\n    ph = phlp(w, v[V_RLP]);\n    v[V_DR] = max(2, min(LINE_LEN - 4, (v[V_RES_K]*$pi - ph)/w));\n  );\n);\n\n// ---------------------------------------------------------------------------\n// Voices\n// ---------------------------------------------------------------------------\nfunction start_pulse(v, amp) local(dur, hard)\n(\n  hard = max(0.05, mat(elm, M_HARD));\n  dur = (ex == 2 ? 0.0009 : ex == 4 ? 0.0014 : 0.004)*ep_width*(1.3 - 0.6*v[V_VEL])/sqrt(hard);\n  dm_type == 3 ? dur *= 2;\n  v[V_PDUR] = max(3, min(0.02, dur)*srate);\n  v[V_PT] = 0; v[V_PA] = amp;\n  ex == 4 ? v[V_PLKN] = floor(0.002*srate);\n);\n\nfunction voice_start(v, note, vel) local(vi, vn, f0, rlo, rhi, tl, gr, rm, lg2, pc)\n(\n  vi = (v - VOICE_BASE)/VOICE_STRIDE;\n  memset(v, 0, VOICE_STRIDE);\n  memset(LINE_BASE + vi*4*LINE_LEN, 0, 4*LINE_LEN);\n  v[V_LBASE] = LINE_BASE + vi*4*LINE_LEN;\n  v[V_EG] = 1;\n  v[V_ON] = 1; v[V_NOTE] = note; v[V_GATE] = 1; v[V_AGE] = age_ctr; age_ctr += 1;\n  v[V_REL] = -1; v[V_PT] = -1;\n  vn = max(0.05, vel/127);\n  v[V_VEL] = vn;\n  v[V_LEVEL] = max(0.02, force*vn^ep_vexp)*(soft_ped ? 0.6 : 1);\n  v[V_DETC] = tuning_cents(note) + (fc_type == 2 ? valve_cents(note) : 0) + (dm_type == 4 ? -15 : 0) + age_detune(note);\n  v[V_PTGT] = note;\n  v[V_PITCH] = (fc_type == 3 && last_pitch > 0) ? last_pitch : note;\n  tm_type == 3 ? v[V_SETL] = -30;\n  last_pitch = note;\n  f0 = 440*2^((note + v[V_DETC]/100 + fine_st - 69)/12);\n  cur_f0 = f0;\n  v[V_FBASE] = f0; v[V_FCUR] = f0; v[V_FMOD] = f0;\n  (el == 0 || el == 5) ? wg_setup(v, f0) : ( modal_setup(v, f0); (ex_cont || DEBUG_BANDED) ? bands_setup(v); );\n  v[V_XT] = ex_eff; v[V_CONT] = ex_cont;\n  v[V_SUSDRV] = ep_sus;\n  !ex_cont ? (\n    ep_sus ? v[V_STRK] = 0 : start_pulse(v, v[V_LEVEL]);\n  );\n  // per-voice resonator: bore or pipe, tuned to the note\n  v[V_NRES] = (rs == 0 || rs == 2);\n  v[V_NRES] ? (\n    rm = rsm;\n    v[V_RES_K] = rs == 0 ? 2 : 1;\n    v[V_RSGN] = rs == 0 ? 1 : -1;\n    tl = v[V_RES_K]/(2*f0);\n    rlo = min(mat_t60(rm, f0), 0.5)*decay_*0.6/mat(rm, M_ROUGH);\n    rhi = rlo*0.4*bright_mul(4000);\n    op_fit(10^(-3*tl/rlo), 10^(-3*tl/rhi), 2*$pi*min(4000, 0.4*srate)/srate);\n    v[V_RLB] = op_b; v[V_RLP] = op_p;\n    gr = op_b/(1 - op_p);\n    v[V_RG] = gr;\n  );\n  v[V_OG] = 10^(TRIM_TAB[(ep_sus ? 0 : 36) + ex*6 + el]/20);\n  v[V_LIPY] = LIP_REST;\n  v[V_FK] = (ex_eff == 1 && v[V_WG]) ? LIP_BORE : 1;\n  // lips pull the pitch up by a measured amount on each element: lower the\n  // lips and the element together by that much\n  v[V_LIPR] = LIP_RATIO;\n  (ex_eff == 1 && v[V_BANDED]) ? v[V_FK] = 2^(-(el == 1 ? LM_SOFT - (LM_SOFT - 50)*max(0, min(1, (min(0.03, mat(elm, M_E)*0.0003) - LM_EDGE)/0.009)) : el == 2 ? LIPC_BAR : el == 3 ? LIPC_PLATE : LIPC_TINE)/1200);\n  // measured pull of the sustaining exciters on the loop's pitch (cents),\n  // taken out by tuning the loop flat by the same amount\n  v[V_WG] ? (\n    lg2 = log(f0/261.6)/log(2);\n    pc = ex_eff == 6 ? max(0, min(26, JET_C0 + JET_C1*lg2)) :\n         (ex_eff == 3 && el == 0) ? max(0, min(15, BOW_C0 + BOW_C1*lg2)) : 0;\n    v[V_FK] *= 2^(-pc/1200);\n  );\n  v[V_BANDED] ? v[V_FMOD] = 0;\n  pn = 0.5 + 0.3*max(-1, min(1, (note - 60)/30));\n  v[V_PANL] = cos(pn*0.5*$pi)*1.4142; v[V_PANR] = sin(pn*0.5*$pi)*1.4142;\n  voice_control(v);\n);\n\nfunction voice_release(v) local(tr)\n(\n  v[V_REL] = 0;\n  tr = release_t60();\n  v[V_WG] ? (\n    wg_loss(v, min(v[V_TLO], tr), min(v[V_THI], 0.6*tr));\n  ) : v[V_BANDED] ? bands_release(v, tr) : modal_release(v, tr);\n);\n\nfunction find_voice() local(i, v, best, bv, sc)\n(\n  best = -1; bv = 10^30; i = 0;\n  loop(VOICES_MAX,\n    v = VOICE_BASE + i*VOICE_STRIDE;\n    // free first, then the quietest released voice, then the oldest\n    sc = !v[V_ON] ? -10^20 : (v[V_REL] >= 0 ? -10^10 + v[V_LVLF]*10^9 : v[V_AGE]);\n    sc < bv ? ( bv = sc; best = v; );\n    i += 1;\n  );\n  best;\n);\n\nfunction note_on(note, vel) local(v, lg)\n(\n  mono ? (\n    v = VOICE_BASE;\n    lg = v[V_ON] && v[V_GATE] && fc_type != 4;\n    NOTE_STACK[stack_n] = note; stack_n = min(stack_n + 1, 60);\n    lg ? (\n      // legato: the frequency control decides how the pitch changes\n      v[V_PTGT] = note; last_pitch = note;\n      v[V_NOTE] = note;\n      fc_type != 3 ? v[V_PITCH] = note;\n      v[V_DETC] = tuning_cents(note) + (fc_type == 2 ? valve_cents(note) : 0) + (dm_type == 4 ? -15 : 0) + age_detune(note);\n      fc_type == 1 ? v[V_DIP] = 0.012*srate;          // tone holes: a quick blip\n      fc_type == 2 ? v[V_DIP] = 0.028*srate;          // valves: a deeper, longer one\n      (fc_type == 0 && !ex_cont) ? start_pulse(v, 0.35*v[V_LEVEL]);   // fret: hammer-on\n    ) : voice_start(v, note, vel);\n  ) : (\n    v = find_voice();\n    voice_start(v, note, vel);\n  );\n);\n\nfunction note_off(note) local(i, v, k, j)\n(\n  mono ? (\n    // remove from the held-note stack; fall back to the previous note\n    j = 0; k = 0;\n    loop(stack_n, NOTE_STACK[k] != note ? ( NOTE_STACK[j] = NOTE_STACK[k]; j += 1; ); k += 1;);\n    stack_n = j;\n    v = VOICE_BASE;\n    (v[V_ON] && v[V_NOTE] == note) ? (\n      (stack_n > 0 && fc_type != 4) ? (\n        k = NOTE_STACK[stack_n - 1];\n        v[V_PTGT] = k; v[V_NOTE] = k; fc_type != 3 ? v[V_PITCH] = k;\n        v[V_DETC] = tuning_cents(k) + (fc_type == 2 ? valve_cents(k) : 0) + (dm_type == 4 ? -15 : 0);\n        fc_type == 1 ? v[V_DIP] = 0.012*srate; fc_type == 2 ? v[V_DIP] = 0.028*srate;\n      ) : (\n        v[V_GATE] = 0;\n        sustain ? v[V_HELD] = 1 : voice_release(v);\n      );\n    );\n  ) : (\n    i = 0;\n    loop(VOICES_MAX,\n      v = VOICE_BASE + i*VOICE_STRIDE;\n      (v[V_ON] && v[V_GATE] && v[V_NOTE] == note) ? (\n        v[V_GATE] = 0;\n        sustain ? v[V_HELD] = 1 : voice_release(v);\n      );\n      i += 1;\n    );\n  );\n);\n\nfunction all_off() local(i, v)\n( i = 0; loop(VOICES_MAX, v = VOICE_BASE + i*VOICE_STRIDE; v[V_ON] = 0; i += 1;); stack_n = 0; );\n\nfunction pedal_up() local(i, v)\n(\n  i = 0;\n  loop(VOICES_MAX,\n    v = VOICE_BASE + i*VOICE_STRIDE;\n    (v[V_ON] && v[V_HELD]) ? ( v[V_HELD] = 0; voice_release(v); );\n    i += 1;\n  );\n);\n\n// ---------------------------------------------------------------------------\n// The exciter: what touches the element. c is the element's motion at the\n// contact point; the return value is what the exciter pushes back in.\n// Sustaining exciters follow STK's reflection-function forms (clarinet reed,\n// brass lips, bowed string, flute jet), which stay passive at any pressure.\n// ---------------------------------------------------------------------------\nfunction excite(v, c) local(xt, pp, e, pd, rr, inc, area, kq, flow, dp, acc, dv, bs, jin, jo, bj, x)\n(\n  xt = v[V_XT]; e = 0;\n  v[V_CONT] ? (\n    pp = v[V_DRV];\n    xt == 0 ? (\n      pd = c - pp;\n      rr = max(-1, min(1, 0.7 - 0.3*pd));\n      e = (pp - c)*(1 - rr);\n    ) : xt == 1 ? (\n      // Trombolese's lip valve: a mass-spring that blows open, Bernoulli\n      // flow through it, solved exactly against the bore impedance.\n      inc = pp - 2*c*PSCALE;\n      area = LIP_WIDTH*max(v[V_LIPY], 0);\n      kq = 2*area*area/RHO_AIR;\n      flow = area > 0 ? 0.5*(-kq*LIP_Z + sqrt((kq*LIP_Z)^2 + 4*kq*abs(inc)))*sign(inc) : 0;\n      dp = inc - LIP_Z*flow;\n      acc = dp*v[V_LIPIM] - v[V_LIPA1]*v[V_LIPV] - v[V_LIPA2]*(v[V_LIPY] - LIP_REST);\n      v[V_LIPV] += acc*dt; v[V_LIPY] += v[V_LIPV]*dt;\n      v[V_LIPY] < 0 ? ( v[V_LIPY] = 0; v[V_LIPV] = max(0, v[V_LIPV]); );\n      v[V_LIPY] > 3*LIP_REST ? ( v[V_LIPY] = 3*LIP_REST; v[V_LIPV] = min(0, v[V_LIPV]); );\n      e = LIP_Z*flow/PSCALE;\n    ) : xt == 3 ? (\n      dv = pp - c;\n      // Schelleng: nearer the bridge the bow must press harder (a lower slope)\n      bs = abs((dv + 0.001)*(v[V_BANDED] ? BOW_SLOPE_B : BOW_SLOPE*(v[V_TWO] ? (max(0.02, v[V_BETA])/0.2)^BOW_FEXP : BOW_TUBE))) + 0.75;\n      bs = bs*bs; bs = 1/(bs*bs);\n      e = dv*max(0.01, min(0.98, bs));\n    ) : (\n      bj = v[V_LBASE] + 2*LINE_LEN;\n      jin = pp - 0.5*c;\n      jo = lin_read(bj, v[V_WP], v[V_DJ]);\n      bj[v[V_WP]] = jin;\n      e = max(-1, min(1, jo*(jo*jo - 1))) - 0.5*c;\n    );\n  ) : (\n    v[V_PT] >= 0 ? (\n      x = v[V_PT]/v[V_PDUR];\n      x < 1 ? (\n        e = xt == 4 ? v[V_PA]*x : v[V_PA]*sin($pi*x);\n        v[V_PT] += 1;\n      ) : v[V_PT] = -1;\n    );\n    xt == 5 ? ( v[V_XLP] += mallet_c*(e - v[V_XLP]); e = v[V_XLP]*1.5; );\n    (xt == 4 && v[V_PLKN] > 0) ? ( e += (rand(2) - 1)*0.15*v[V_PA]; v[V_PLKN] -= 1; );\n  );\n  e;\n);\n\n// One sample of one voice. Leaves its direct and resonated output in\n// vo_dir and vo_res.\nfunction voice_tick(v) local(tgt, env, lvl, pp, nz, ba, bb, wp, aout, y, mm, aa, s, r1, r2, c, e, outa, out, m, cc, oo, ex2, br, rdl, res, t, ns, n0, fr, ri, rj, x, bk)\n(\n  t = v[V_T]; v[V_T] = t + dt;\n  // --- energy: the drive envelope\n  v[V_SUSDRV] ? (\n    tgt = (v[V_GATE] || v[V_HELD]) ? 1 : 0;\n    v[V_ENV] += (tgt - v[V_ENV])*(tgt > v[V_ENV] ? att_c : rel_c);\n  ) : (\n    // a single push: rises, holds briefly, then fades\n    v[V_ENV] = t < ep_att ? t/ep_att : t < ep_att + ep_hold ? 1 : exp(-(t - ep_att - ep_hold)/ep_dec);\n  );\n  env = v[V_ENV];\n  lvl = v[V_LEVEL]*expr*(1 + 0.4*at_press + (md_type == 0 ? 0.3*mw : 0));\n  v[V_DIP] > 0 ? ( env *= 1 - 0.6*sin($pi*v[V_DIP]/(fc_type == 2 ? 0.028*srate : 0.012*srate)); v[V_DIP] -= 1; );\n  nz = rand(2) - 1;\n  v[V_CONT] ? (\n    pp = v[V_XT] == 0 ? 0.6 + 0.3*lvl :\n         v[V_XT] == 1 ? 1500 + 4500*lvl :\n         v[V_XT] == 3 ? 0.03 + 0.2*lvl :\n                        1.0 + 0.25*lvl;\n    pp *= env;\n    pp += pp*nz*(ep_noise + (cp == 3 ? 0.02 : 0) + AGE_LEAK*age_);\n    v[V_DRV] = pp; v[V_DRVN] = env*lvl;\n  ) : (\n    // a steady supply keeps striking: a roll, a tremolo, a buzzer\n    (v[V_SUSDRV] && env > 0.02) ? (\n      v[V_STRK] -= dt;\n      v[V_STRK] <= 0 ? (\n        start_pulse(v, lvl*env*(0.85 + 0.3*rand(1)));\n        v[V_STRK] = (1 + ep_jit*(rand(2) - 1))/(ep_rate*(0.6 + 0.8*env*lvl));\n      );\n    );\n  );\n  wp = v[V_WP];\n  // --- the vibrating element\n  v[V_WG] ? (\n    ba = v[V_LBASE]; bb = ba + LINE_LEN;\n    aout = lag_read(ba, wp, v[V_DA]);\n    y = v[V_LB]*aout + v[V_LP]*v[V_LS]; v[V_LS] = y;\n    mm = v[V_APM];\n    mm > 0 ? (\n      aa = v[V_APA]; s = v + V_AP;\n      loop(mm, e = aa*(y - s[1]) + s[0]; s[0] = y; s[1] = e; y = e; s += 2;);\n    );\n    v[V_THC] > 0 ? ( v[V_THS] += v[V_THC]*(y - v[V_THS]); y += TH_K*(v[V_THS] - y); );\n    r1 = v[V_SGN]*y;\n    v[V_TWO] ? ( r2 = -bb[(wp - v[V_DB] + LINE_LEN) & LINE_MASK]; c = r1 + r2; ) : c = r1;\n    e = excite(v, c);\n    outa = (v[V_TWO] ? r2 : c) + e;\n    v[V_INDC] ? ( y = outa - v[V_LDCX] + dc_r*v[V_LDCY]; v[V_LDCX] = outa; v[V_LDCY] = y; outa = y; );\n    ba[wp] = outa;\n    v[V_TWO] ? bb[wp] = r1 + e;\n    out = el == 5 ? aout + r1 : aout;\n  ) : v[V_BANDED] ? (\n    m = v[V_LBASE] + LINE_LEN; c = 0;\n    loop(v[V_NB],\n      n0 = floor(m[3]); fr = m[3] - n0; ri = m[2] - n0; ri < 0 ? ri += m[1];\n      rj = ri - 1; rj < 0 ? rj += m[1];\n      bk = m[0]; y = (1 - fr)*bk[ri] + fr*bk[rj];\n      m[16] = y; c += m[12]*y;\n      m += BAND_STRIDE;\n    );\n    // extra grip only while driven, so the junction is passive once released\n    e = excite(v, c)*v[V_EG]*(1 + (BAND_G - 1)*min(1, 2*env));\n    m = v[V_LBASE] + LINE_LEN; oo = 0;\n    loop(v[V_NB],\n      x = m[12]*e + m[4]*m[16];\n      y = m[5]*(x - m[9]) - m[6]*m[10] - m[7]*m[11];\n      m[9] = m[8]; m[8] = x; m[11] = m[10]; m[10] = y;\n      bk = m[0]; bk[m[2]] = y; m[2] += 1; m[2] >= m[1] ? m[2] = 0;\n      oo += m[13]*y;\n      m += BAND_STRIDE;\n    );\n    out = oo;\n    v[V_CHOP] ? out += 0.6*v[V_DRVN]*tanh_(4*c);\n  ) : (\n    c = v[V_C];\n    e = excite(v, v[V_CONT] ? tanh_(c) : c);\n    ex2 = e - v[V_E2]; v[V_E2] = v[V_E1]; v[V_E1] = e;\n    m = v + MODE_OFF; cc = 0; oo = 0;\n    loop(v[V_NM],\n      y = m[0]*m[2] - m[1]*m[3] + m[4]*ex2;\n      m[3] = m[2]; m[2] = y;\n      cc += m[5]*y; oo += m[6]*y;\n      m += MODE_STRIDE;\n    );\n    v[V_C] = cc;\n    out = oo;\n    // a free reed chops the airflow: the buzz of a harmonica or accordion\n    v[V_CHOP] ? out += 0.6*v[V_DRVN]*tanh_(4*cc);\n  );\n  // DC blocker on what leaves the element\n  y = out - v[V_DCX] + dc_r*v[V_DCY]; v[V_DCX] = out; v[V_DCY] = y; out = y;\n  // a windway hisses\n  // a windway hisses, and so does a leaky old instrument\n  ((cp == 3 || age_ > 0) && v[V_CONT]) ? (\n    v[V_NS] += 0.3*(nz - v[V_NS]); ns = nz - v[V_NS];\n    out += ((cp == 3 ? 0.02 : 0) + AGE_HISS*age_*age_)*ns*v[V_DRVN];\n  );\n  out *= v[V_OG];\n  // rattle: past a small gap the material slaps against its fixings; crackle:\n  // crumpled foil pops at random, more often the harder it vibrates. Both\n  // only read the element (never feed back into it), so they cannot destabilise it.\n  mat_rat > 0 ? (\n    x = out - max(-RAT_GAP, min(RAT_GAP, out));\n    y = 0.9*(v[V_RATS] + x - v[V_RATX]); v[V_RATX] = x; v[V_RATS] = y;\n    out += mat_rat*RAT_GAIN*y;\n  );\n  mat_crk > 0 ? (\n    x = rand(1) < mat_crk*min(1, 8*abs(out))*CRK_RATE ? (rand(2) - 1)*(0.05 + abs(out)) : 0;\n    y = 0.6*(v[V_CRKS] + x - v[V_CRKX]); v[V_CRKX] = x; v[V_CRKS] = y;\n    out += y;\n  );\n  // --- per-voice resonator\n  res = out;\n  v[V_NRES] ? (\n    br = v[V_LBASE] + 3*LINE_LEN;\n    rdl = lin_read(br, wp, v[V_DR]);\n    y = v[V_RLB]*rdl + v[V_RLP]*v[V_RLS]; v[V_RLS] = y;\n    res = out + v[V_RSGN]*y;\n    br[wp] = res;\n    res *= 0.5*(1 - min(0.97, v[V_RG]));\n    res *= 2.5;\n  );\n  v[V_WP] = (wp + 1) & LINE_MASK;\n  // --- level follower and voice freeing\n  aa = abs(out);\n  v[V_LVLF] = max(aa, v[V_LVLF]*lvl_decay);\n  (v[V_T] > 0.05 && v[V_LVLF] < 0.00002 && env < 0.002 && v[V_PT] < 0 &&\n   (v[V_REL] >= 0 || !v[V_SUSDRV])) ? v[V_ON] = 0;\n  vo_dir = out; vo_res = res;\n);\n\n// ---------------------------------------------------------------------------\n// Coupler, shared resonators and radiator (all voices summed: they are linear)\n// ---------------------------------------------------------------------------\nfunction setup_coupler() local(o)\n(\n  o = BIQ_COEF;\n  cp == 0 ? ( bq_pk(o, 2500, 1.2, 6); bq_hp(o + 5, 90, 0.7); ) :             // bridge: the \"bridge hill\"\n  cp == 1 ? ( bq_pk(o, 450, 1.0, 6); bq_lp(o + 5, 7000, 0.7); ) :            // soundpost: body-heavy\n  cp == 2 ? ( bq_pk(o, 800/sqrt(size_), 2.0, 8); bq_lp(o + 5, 9000, 0.7); ) :// mouthpiece: cup formant\n            ( bq_pk(o, 1800, 0.9, 3); bq_hp(o + 5, 200, 0.7); );             // windway\n);\n\nbody_n = 0;\nfunction body_mode(f, q, amp, wl, wr) local(p, r, th)\n(\n  (f > 20 && f < 0.45*srate && body_n < BODY_MAX) ? (\n    p = BODY_BASE + body_n*BODY_STRIDE;\n    r = exp(-$pi*f/(q*srate));\n    th = 2*$pi*f/srate;\n    p[0] = 2*r*cos(th); p[1] = r*r; p[4] = (1 - r)*amp; p[5] = wl; p[6] = wr;\n    body_n += 1;\n  );\n);\n\nfunction setup_body() local(k, f, q, sc, qm, eta, ee, rho, h, dd, fr)\n(\n  body_n = 0;\n  memset(BODY_BASE, 0, BODY_MAX*BODY_STRIDE);\n  // stiffer-for-its-weight materials push the wooden modes up\n  sc = max(0.35, min(2.5, sqrt((mat(rsm, M_E)*10^9/mat(rsm, M_RHO))/(11*10^9/440))));\n  eta = mat(rsm, M_ETA);\n  rs == 1 ? (\n    // SOUNDBOX: a guitar-like body (air mode ~98 Hz, top/back modes above),\n    // measured frequencies scaled by the material and the Size control\n    k = 0;\n    loop(12,\n      f = k==0?98:k==1?204:k==2?226:k==3?381:k==4?437:k==5?552:k==6?650:k==7?780:k==8?920:k==9?1100:k==10?1450:2000;\n      f = (k == 0 ? f : f*sc)/size_;\n      q = k == 0 ? 20/(1 + age_) : 1/(mat(rsm, M_ETA)*(f/1000)^mat(rsm, M_SLOPE)*age_eta(f) + 0.018);\n      body_mode(f, q, 1/sqrt(1 + 0.5*k), sin(k*2.1 + 0.4), cos(k*1.3 + 0.9));\n      k += 1;\n    );\n  ) : rs == 3 ? (\n    // CAVITY: a Helmholtz resonator (a gourd, a bottle) and a few cavity\n    // modes, with the walls ringing in the chosen material\n    body_mode(140/size_, 14, 1.4, 1, 1);\n    body_mode(640/size_, 22, 0.6, 0.8, -0.5);\n    body_mode(1060/size_, 25, 0.45, -0.4, 0.8);\n    body_mode(1480/size_, 25, 0.35, 0.6, 0.6);\n    k = 2;\n    loop(6,\n      f = 520*sc*k*(k*k - 1)/sqrt(k*k + 1)/(3*size_);\n      q = 1/(eta*(f/1000)^mat(rsm, M_SLOPE)*age_eta(f) + 0.004);\n      body_mode(f, q, 0.35/sqrt(k), cos(k*0.5), sin(k*2.2));\n      k += 1;\n    );\n  ) : rs == 4 ? (\n    // BODY: a solid block of the material; plate-like modes that give the\n    // instrument the material's own ring (stone clink, glass shimmer)\n    k = 0;\n    loop(16,\n      f = 280*sc*PLATE_TAB[k*3]/PLATE_TAB[0]/size_;\n      q = 1/(eta*(f/1000)^mat(rsm, M_SLOPE)*age_eta(f) + 0.003);\n      body_mode(f, q, 0.9/sqrt(1 + 0.3*k), sin(PLATE_TAB[k*3+1]*2.2), cos(PLATE_TAB[k*3+2]*1.7));\n      k += 1;\n    );\n  );\n);\n\nfunction setup_radiator() local(o, k, j, f, r, th, p)\n(\n  o = BIQ_COEF + 10;\n  rd == 0 ? ( bq_hp(o, 180, 0.6); bq_pk(o + 5, 1500, 0.8, 4); bq_off(o + 10); ) :                 // bell\n  rd == 1 ? ( bq_pk(o, 250, 0.9, 3); bq_lp(o + 5, 7500, 0.7); bq_off(o + 10); ) :                 // soundboard\n  rd == 2 ? ( bq_hp(o, 120, 0.7); bq_pk(o + 5, 2200, 1.5, 6); bq_lp(o + 10, 9000, 0.7); ) :      // drumhead\n            ( bq_hp(o, 90, 0.8); bq_lp(o + 5, 5000, 0.9); bq_pk(o + 10, 2800, 3, 4); );           // cone\n  // drumhead: its own few membrane modes ring along (like a banjo's head)\n  memset(HEAD_BASE, 0, HEAD_MAX*8);\n  k = 0;\n  loop(HEAD_MAX,\n    p = HEAD_BASE + k*8;\n    f = 170/size_*BESSEL_TAB[k*2]/2.4048;\n    r = exp(-6.9078/(0.25*srate));\n    th = 2*$pi*min(f, 0.45*srate)/srate;\n    p[0] = 2*r*cos(th); p[1] = r*r; p[4] = (1 - r)*0.8/sqrt(1 + k); p[5] = cos(k*1.1); p[6] = sin(k*1.1 + 0.6);\n    k += 1;\n  );\n  // soundboard: allpass diffusion lengths (ms)\n  k = 0;\n  loop(8,\n    DIFF_TMP[k] = floor(min(DIFF_LEN - 2, (k==0?3.1:k==1?5.3:k==2?7.9:k==3?11.3:k==4?3.7:k==5?5.9:k==6?8.3:12.1)*0.001*srate*size_));\n    k += 1;\n  );\n);\nDIFF_TMP = 5900; DIFF_W = 5950;\n\nfunction blown_now() ( (slider2|0) <= 1; );\nfunction update_globals()\n(\n  en = slider1|0; ex = slider2|0; el = slider3|0; elm = slider4|0;\n  rs = slider5|0; rsm = slider6|0; cp = slider7|0; rd = slider8|0;\n  fc_type = slider9|0; tm_type = slider10|0; dm_type = slider11|0; md_type = slider12|0;\n  force = slider13/100; size_ = slider14/100; bright = slider15; decay_ = slider16/100;\n  beta_ = slider17/100; res_amt = slider18/100; mono = slider19|0;\n  glide_ms = slider20; fine_st = slider21/100; out_g = 10^(slider22/20);\n  energy_params(en);\n  // an old instrument is quieter when struck (it rings less); give some back.\n  // Reeds and lips keep blowing at their own level, so they get none.\n  age_ = slider23/100; age_gain = blown_now() ? 1 : 10^(AGE_MAKEUP*age_/20);\n  // age loosens every fixing (rattle) and leaves rust grit (crackle)\n  mat_rat = max(mat(elm, M_RAT), AGE_RAT*age_^1.5); mat_crk = max(mat(elm, M_CRK), AGE_CRK*age_*age_);\n  ex_cont = (ex == 0 || ex == 1 || ex == 3);\n  // a windway turns lips or a bow into an air jet (a flute); a reed stays a reed (a windcap)\n  ex_eff = (cp == 3 && (ex == 1 || ex == 3)) ? 6 : ex;\n  bend_range = fc_type == 3 ? 7 : 2;\n  bm = 2^(bright/50);\n  // couplers drain energy from the element into the body\n  drain = cp == 0 ? 0.9 : cp == 1 ? 0.75 : 1;\n  att_c = 1 - exp(-1/(max(0.0005, ep_att)*srate));\n  rel_c = 1 - exp(-1/(max(0.002, ep_rel)*srate));\n  glide_c = fc_type == 3 ? 1 - exp(-16*3/(max(5, glide_ms)*0.001*srate)) : 1;\n  settle_c = exp(-16/(0.09*srate));\n  mallet_c = 1 - exp(-2*$pi*900/srate);\n  setup_coupler(); setup_body(); setup_radiator();\n  master_trim = 10^((PART_TRIM[rs] + PART_TRIM[5 + cp] + PART_TRIM[9 + rd])/20);\n  globals_ok = 1;\n);\n\ndc_r = 1 - 2*$pi*10/srate;\nmaster_trim = 1;\n// Loudness trims (dB), measured with tools/trims.py: exciter x element, for a\n// steady energy source (row 0) and a single push (row 1); then per part.\nTRIM_TAB = 6400; PART_TRIM = 6480;\nfunction trim_row(c, ex, t0, t1, t2, t3, t4, t5) local(p)\n( p = TRIM_TAB + c*36 + ex*6; p[0] = t0; p[1] = t1; p[2] = t2; p[3] = t3; p[4] = t4; p[5] = t5; );\nmemset(TRIM_TAB, 0, 100);\n//TRIMS_BEGIN\ntrim_row(0, 0, -10.1, -19.1, -14.5, -12.6, -20.0, -2.5);\ntrim_row(0, 1, 1.1, -10.4, -2.7, -2.0, -11.3, -4.3);\ntrim_row(0, 2, -7.7, -3.8, 8.5, 1.1, -2.1, -1.4);\ntrim_row(0, 3, -5.2, -1.7, 3.4, -1.9, -6.1, 11.0);\ntrim_row(0, 4, -4.0, -0.8, 12.5, 4.5, 2.0, 1.9);\ntrim_row(0, 5, -6.2, -3.7, 8.4, 2.2, -2.1, -0.2);\ntrim_row(1, 0, -8.7, -14.5, -10.7, -7.7, -18.0, 0.6);\ntrim_row(1, 1, 2.6, -5.6, 0.0, -1.9, -8.1, -2.7);\ntrim_row(1, 2, 2.0, 5.1, 18.3, 11.0, 7.7, 8.9);\ntrim_row(1, 3, -3.1, 3.7, 8.7, 4.1, -0.7, 14.8);\ntrim_row(1, 4, 3.1, 6.5, 19.3, 11.8, 8.8, 9.6);\ntrim_row(1, 5, 14.3, 16.7, 20.0, 20.0, 19.5, 19.4);\n// PART_TRIM_VALUES = [0.0, 5.3, 0.2, 5.0, 5.3, 2.0, 0.6, 0.0, -0.1, 0.0, -3.6, -2.5, -0.5]\ni = 0; loop(13, PART_TRIM[i] = 0; i += 1;);\nPART_TRIM[0] = 0.0;\nPART_TRIM[1] = 5.3;\nPART_TRIM[2] = 0.2;\nPART_TRIM[3] = 5.0;\nPART_TRIM[4] = 5.3;\nPART_TRIM[5] = 2.0;\nPART_TRIM[6] = 0.6;\nPART_TRIM[7] = 0.0;\nPART_TRIM[8] = -0.1;\nPART_TRIM[9] = 0.0;\nPART_TRIM[10] = -3.6;\nPART_TRIM[11] = -2.5;\nPART_TRIM[12] = -0.5;\n//TRIMS_END\n// lip valve (Trombolese reed.py: brass end of the morph)\nLIP_WIDTH = 0.012; LIP_REST = 0.0003; LIP_CLOSE = 12000; LIP_Q = 15; LIP_Z = 2700000;\nLIP_RATIO = 0.92; LIP_LOOPK = 2; LIP_BORE = 0.88; PSCALE = 4000;\nTH_K = 0.6;\nAGE_ETA = 2; AGE_ETA_HF = 3; AGE_TMAX = 1.5; AGE_MAKEUP = 6; AGE_BORE = 0.8; AGE_IRR = 0.015; AGE_DET = 25; AGE_WOW = 0.12;\nAGE_LEAK = 0.06; AGE_HISS = 0.04; AGE_RAT = 0.6; AGE_CRK = 0.25; age_ = 0; age_gain = 1; RAT_GAP = 0.2; RAT_GAIN = 2.5; DEBUG_BANDED = 0; DBG_NODISP = 0; BOW_SLOPE_B = 3; BAND_G = 3; BAND_GAMMA = 0.7; BOWAIR_SGN = -1; BOWAIR_K = 1;\nLM_SOFT = 100; LM_EDGE = 0.0045; LIPC_BAR = 124; LIPC_PLATE = 113; LIPC_TINE = 148; BOW_SLOPE = 1.5; BOW_FEXP = 0.5; BOW_TUBE = 1.333; BAND_T60_MIN = 0.3;\nJET_C0 = 16; JET_C1 = 7; BOW_C0 = 6; BOW_C1 = 5;\ndt = 1/srate;\nlvl_decay = exp(-1/(0.05*srate));\nCRK_RATE = 900/srate;\nvis_dec = exp(-1/(0.3*srate)); vis_lvl = 0;\nlim_att = 1 - exp(-1/(0.0005*srate)); lim_rel = exp(-1/(0.15*srate)); lim_env = 0;\nexpr = 1; cc11 = 1; cc2 = 1; breath_seen = 0; at_press = 0; mw = 0; bend = 0; mod_st = 0;\nsustain = 0; soft_ped = 0; last_pitch = 0; stack_n = 0; age_ctr = 0; t_now = 0; ctl_ctr = 0;\nlfo_ph = 0; trem = 1;\nmemset(BIQ_STATE, 0, 100);\nmemset(DIFF_BASE, 0, 8*DIFF_LEN);\nmemset(DIFF_W, 0, 8);\nscope_w = 0;\nall_off();\nupdate_globals();\n\n// ===========================================================================\n// GUI: part names, descriptions and presets\n// ===========================================================================\nfunction cat_count(c) ( c==0?6 : c==1?6 : c==2?6 : c==3?MAT_N : c==4?5 : c==5?MAT_N : c==6?4 : c==7?4 : c==8?5 : c==9?4 : 5; );\nfunction cat_short(c)\n(\n  c==0?\"ENERGY\" : c==1?\"EXCITER\" : c==2?\"ELEMENT\" : c==4?\"RESONATOR\" : c==6?\"COUPLER\" : c==7?\"RADIATOR\" :\n  c==8?\"FREQUENCY\" : c==9?\"TUNING\" : c==10?\"DAMPING\" : c==11?\"MODULATION\" : \"MATERIAL\";\n);\nfunction cat_title(c)\n(\n  c==0?\"ENERGY SOURCE\" : c==1?\"EXCITER\" : c==2?\"VIBRATING ELEMENT\" : c==3?\"ELEMENT MATERIAL\" :\n  c==4?\"RESONATOR\" : c==5?\"RESONATOR MATERIAL\" : c==6?\"COUPLER\" : c==7?\"RADIATOR\" :\n  c==8?\"FREQUENCY CONTROL\" : c==9?\"TUNING MECHANISM\" : c==10?\"DAMPING\" : \"MODULATION / CONTROL\";\n);\nfunction mat_name(i)\n(\n  i==0?\"Steel\":i==1?\"Brass\":i==2?\"Bronze\":i==3?\"Aluminium\":i==4?\"Gold\":i==5?\"Glass\":i==6?\"Crystal\":\n  i==7?\"Ice\":i==8?\"Marble\":i==9?\"Clay\":i==10?\"Spruce\":i==11?\"Rosewood\":i==12?\"Bamboo\":i==13?\"Bone\":\n  i==14?\"Gut\":i==15?\"Nylon\":i==16?\"Carbon Fibre\":i==17?\"Rubber\":i==18?\"Paper\":i==19?\"Jelly\":\n  i==20?\"Plastic\":i==21?\"PVC\":i==22?\"Wood\":i==23?\"Leather\":i==24?\"Cardboard\":i==25?\"Foil\":\n  i==26?\"Cling Film\":i==27?\"Tin\":i==28?\"Car Panel\":i==29?\"Chain Link\":\"Handpan Steel\";\n);\nfunction opt_name(c, i)\n(\n  c==0 ? (i==0?\"Breath\":i==1?\"Bow\":i==2?\"Finger\":i==3?\"Plectrum\":i==4?\"Hammer\":\"Electricity\") :\n  c==1 ? (i==0?\"Reed\":i==1?\"Lips\":i==2?\"Hammer\":i==3?\"Bow\":i==4?\"Plectrum\":\"Mallet\") :\n  c==2 ? (i==0?\"String\":i==1?\"Membrane\":i==2?\"Bar\":i==3?\"Plate\":i==4?\"Reed\":\"Air Column\") :\n  (c==3 || c==5) ? mat_name(i) :\n  c==4 ? (i==0?\"Bore\":i==1?\"Soundbox\":i==2?\"Pipe\":i==3?\"Cavity\":\"Body\") :\n  c==6 ? (i==0?\"Bridge\":i==1?\"Soundpost\":i==2?\"Mouthpiece\":\"Windway\") :\n  c==7 ? (i==0?\"Bell\":i==1?\"Soundboard\":i==2?\"Drumhead\":\"Cone\") :\n  c==8 ? (i==0?\"Fret\":i==1?\"Tone Hole\":i==2?\"Valve\":i==3?\"Slide\":\"Key\") :\n  c==9 ? (i==0?\"Peg\":i==1?\"Tuning Pin\":i==2?\"Machine Head\":\"Slide\") :\n  c==10 ? (i==0?\"Damper\":i==1?\"Mute\":i==2?\"Palm\":i==3?\"Felt\":\"Hand\") :\n          (i==0?\"Keywork\":i==1?\"Pedals\":i==2?\"Valves\":i==3?\"Levers\":\"Electronics\");\n);\nfunction mat_desc(i)\n(\n  i==0?\"Stiff and dense. Rings for a very long time, bright and pure.\" :\n  i==1?\"Warm metal with a little more internal loss than steel.\" :\n  i==2?\"Bell metal: rings long, with a slightly uneven, shimmering decay.\" :\n  i==3?\"Light and stiff for its weight: a clear, glassy-metal ring.\" :\n  i==4?\"Very heavy and soft for a metal: rich but dull, it stops quickly.\" :\n  i==5?\"Stiff and light with very low loss: bright, glassy and long.\" :\n  i==6?\"Quartz crystal: almost no internal loss, so it rings for ages.\" :\n  i==7?\"Frozen water: fairly soft, and bubbles and cracks split every resonance into a beating pair.\" :\n  i==8?\"Stone: stiff, heavy and a little lossy. Short, stony and pitched.\" :\n  i==9?\"Fired clay: rough and porous, earthy and quick to fade.\" :\n  i==10?\"Light, stiff wood with the grain: the classic soundboard wood.\" :\n  i==11?\"Dense hardwood (marimba bars): warm, woody, medium decay.\" :\n  i==12?\"Light and springy wood: soft and breathy.\" :\n  i==13?\"Hard but lossy: dry and clicky.\" :\n  i==14?\"Soft and lossy string material: warm and mellow.\" :\n  i==15?\"Soft, smooth plastic string: gentle and round.\" :\n  i==16?\"Very stiff and light: bright and precise.\" :\n  i==17?\"Absurdly soft and lossy: thuds, and wobbles in pitch.\" :\n  i==18?\"Light, rough and floppy: a papery buzz that dies at once.\" :\n  i==19?\"Hardly a solid at all: very lossy, and it wobbles in pitch.\" :\n  i==20?\"Everyday hard plastic: light, soft and quite lossy. A dull, toy-like knock.\" :\n  i==21?\"Plumbing pipe plastic: smooth inside, so a PVC air column still speaks well; dull when struck.\" :\n  i==22?\"Plain hardwood: warm and woody, medium decay.\" :\n  i==23?\"A hide: very soft and lossy, a dead, thumpy thud, sagging a little in pitch.\" :\n  i==24?\"Paperboard, like a toilet roll tube: rough and porous, a honky, papery thud.\" :\n  i==25?\"Crumpled aluminium foil: every crease splits the ring, and it crackles when it vibrates hard.\" :\n  i==26?\"Stretched polyethylene film: floppy and lossy, and it slaps and buzzes like a kazoo when played hard.\" :\n  i==27?\"Galvanised roofing sheet: metallic and uneven, and its loose fixings rattle.\" :\n  i==28?\"Painted car-body steel: the paint damps it, so it clanks rather than rings.\" :\n  i==29?\"Steel wire mesh: a metallic twang with a jangle as the links rattle.\" :\n        \"Nitrided steel, as hammered into a handpan: sweet, pure and long-ringing.\";\n);\nfunction opt_desc(c, i)\n(\n  c==0 ? (\n    i==0?\"A steady stream of air. Notes sustain while held; a breath controller (CC2), expression (CC11) or key pressure sets how hard you blow.\" :\n    i==1?\"A bow drawn at steady speed. Sustains while held, with a little rosin grit.\" :\n    i==2?\"A single soft push from a fingertip. Each note is played once, gently.\" :\n    i==3?\"A single sharp flick. Bright and quick.\" :\n    i==4?\"A single hard blow. Very sensitive to how hard you play.\" :\n         \"A steady, noiseless electric drive. Sustains forever; with a striking exciter it becomes a buzzer.\") :\n  c==1 ? (\n    i==0?\"A cane reed that chops the airflow into pulses, like a clarinet. Needs a push to get going.\" :\n    i==1?\"Buzzing lips: a valve that blows open, like a trumpet (Trombolese\u00e2\u0080\u0099s lip model). Through a windway it becomes a flute\u00e2\u0080\u0099s air jet.\" :\n    i==2?\"A hard, short strike, like a piano hammer.\" :\n    i==3?\"Stick-slip friction, like a violin bow. Keeps the element singing while it is driven. Through a windway it becomes an air jet.\" :\n    i==4?\"Pulls the element aside and lets go, like a guitar pick.\" :\n         \"A soft, padded strike, like a marimba mallet.\") :\n  c==2 ? (\n    i==0?\"A stretched string. Tension sets the pitch; stiff materials (stone, glass, ice) must be thick rods, so they ring like bells.\" :\n    i==1?\"A stretched circular skin, like a drum. Inharmonic: rings near the edge, thuds at the centre.\" :\n    i==2?\"A free bar, like a xylophone key. Its partials sit at 1 : 2.76 : 5.40 : 8.93.\" :\n    i==3?\"A flat sheet, like a bell plate or gong: dense, shimmering and inharmonic.\" :\n    i==4?\"A clamped tongue, like a kalimba tine or harmonica reed. Blown, it buzzes.\" :\n         \"A column of air in a tube, like a clarinet or trumpet. Its losses come from Trombolese\u00e2\u0080\u0099s physics.\") :\n  (c==3 || c==5) ? mat_desc(i) :\n  c==4 ? (\n    i==0?\"A cone-shaped tube tuned to each note. Reinforces every harmonic, like a saxophone.\" :\n    i==1?\"A hollow box, like a guitar body: resonances from about 100 to 2000 Hz, scaled by its material and Size.\" :\n    i==2?\"A stopped tube under each note, like a marimba resonator. Reinforces the odd harmonics.\" :\n    i==3?\"An enclosed pocket of air, like a gourd or bottle: a hollow boom with ringing walls.\" :\n         \"A solid block of the material. Adds the material\u00e2\u0080\u0099s own ring: stone clinks, glass shimmers.\") :\n  c==6 ? (\n    i==0?\"Carries the vibration into the body, with the bright \u00e2\u0080\u009cbridge hill\u00e2\u0080\u009d around 2.5 kHz.\" :\n    i==1?\"A post that couples strongly into the body: warm and woody, with a shorter ring.\" :\n    i==2?\"A small cup between exciter and element: a vocal, brassy formant.\" :\n         \"A narrow air duct, like a recorder\u00e2\u0080\u0099s: breathy. Turns lips or a bow into a flute\u00e2\u0080\u0099s air jet.\") :\n  c==7 ? (\n    i==0?\"A flared bell. Throws the high frequencies forward, and gets brassy when loud.\" :\n    i==1?\"A wide board that spreads and softens the sound.\" :\n    i==2?\"A skin that rings along, like a banjo head: twangy, with a low boom.\" :\n         \"A loudspeaker cone: electric-instrument tone with a little amplifier grit.\") :\n  c==8 ? (\n    i==0?\"Fixed semitone stops. In Mono mode, a new note hammers on instead of re-plucking.\" :\n    i==1?\"Holes along the element. Harmonics above about 1.5 kHz leak out, like a woodwind. In Mono mode notes change with a quick key blip.\" :\n    i==2?\"Switches lengths of tube in and out. A few notes are famously a little sharp, as on a real trumpet.\" :\n    i==3?\"A continuous length: every note glides from the last one, like a trombone. Pitch bend covers 7 semitones.\" :\n         \"One element per key, like a piano: every note is fresh and independent.\") :\n  c==9 ? (\n    i==0?\"Friction pegs: never quite in tune, and drifting a little.\" :\n    i==1?\"Piano-style stretched octaves: the bass a little flat, the treble a little sharp.\" :\n    i==2?\"Geared tuners: exact equal temperament.\" :\n         \"A tuning slide: each note starts a little flat and settles into tune.\") :\n  c==10 ? (\n    i==0?\"A felt damper stops the note when you let go, like a piano. The sustain pedal (CC64) lifts it.\" :\n    i==1?\"A mute: darker and more nasal, with a softer release.\" :\n    i==2?\"A palm resting on it: short, chunky notes.\" :\n    i==3?\"Felt against the element: soft, dark and intimate. Strikes are softer too.\" :\n         \"A hand in the bell: darker and slightly flat, like a horn.\") :\n  (\n    i==0?\"Plain keys. The mod wheel blows or bows harder.\" :\n    i==1?\"Sustain (CC64) and soft (CC67) pedals. The mod wheel lifts the dampers, so released notes ring on.\" :\n    i==2?\"The mod wheel half-presses a valve: the pitch sags and the tone gets stuffy.\" :\n    i==3?\"The mod wheel bends notes up by as much as a whole tone, like a B-bender.\" :\n         \"The mod wheel adds vibrato and tremolo, like a vibraphone motor.\"\n  );\n);\nfunction combo_hint()\n(\n  (cp == 3 && (ex == 1 || ex == 3)) ? \"The windway turns this exciter into an air jet: it plays like a flute.\" :\n  (ep_sus && ex_cont) ? \"Notes sustain while you hold the key. Play harder, or push the mod wheel, for more.\" :\n  (!ep_sus && ex_cont) ? \"A single push drives a sustaining exciter: each note swells, then fades.\" :\n  (ep_sus && !ex_cont) ? \"A steady supply keeps striking while you hold the key: a roll, a tremolo, a buzz.\" :\n                         \"Each note is struck once and rings.\";\n);\n\n// ===========================================================================\n// The instrument as one line drawing (ADR 0024). Every part is a few\n// polylines in a drawing space 900 wide and 360 tall (y down); the twelve\n// choices decide which. The coupler decides the build: a mouthpiece or a\n// windway joins the parts end to end, like a wind instrument (\"in a line\");\n// a bridge or a soundpost holds the element over the body, like a guitar or a\n// marimba (\"in layers\"). The other parts sit where they act: tone holes and\n// frets on the element, the tuning at its end, a mute or a hand in the bell,\n// pedals and electronics underneath. Window only: built into a list of\n// segments when a part changes, then drawn by @gfx each frame.\n// ===========================================================================\nWF_AUX = 690000;                  // window only: transform stack, smoothing buffers, the parts being drawn\nWF_STK = WF_AUX; WF_CHA = WF_AUX + 100; WF_CHB = WF_AUX + 1200; WF_P = WF_AUX + 2400;\nWF_LAST = WF_AUX + 2420;          // the twelve choices the drawing was built from\nWF_OBB = WF_AUX + 2440;           // the picker: each option's part, bounding box (6 x 4)\nWF_GEO = 700000; WF_GEO_MAX = 4000;          // the instrument: count, then x1 y1 x2 y2 part hidden\nWF_OPT = 725000; WF_OPT_STRIDE = 25000;      // the picker's six versions of it, one per option\nCAT_TAB = 14200; CAT_STRIDE = 16;            // per part: box, anchor, label (12 x 16)\n\n// ---- the pen: an affine transform (a stack of eight) and the current point\nfunction wf_reset() ( tf_a = 1; tf_b = 0; tf_c = 0; tf_d = 1; tf_e = 0; tf_f = 0; tf_sp = 0; wfhid = 0; );\n// draw what follows translated to (ox, oy), turned by ang, mirrored if sx = -1\nfunction wf_push(ox, oy, ang, sx) local(p, ca, sa, a, b, c, d, ta, tb, tc, td)\n(\n  p = WF_STK + tf_sp*6; p[0] = tf_a; p[1] = tf_b; p[2] = tf_c; p[3] = tf_d; p[4] = tf_e; p[5] = tf_f; tf_sp += 1;\n  ca = cos(ang); sa = sin(ang); a = sx*ca; b = sx*sa; c = -sa; d = ca;\n  tf_e += tf_a*ox + tf_c*oy; tf_f += tf_b*ox + tf_d*oy;\n  ta = tf_a; tb = tf_b; tc = tf_c; td = tf_d;\n  tf_a = ta*a + tc*b; tf_b = tb*a + td*b; tf_c = ta*c + tc*d; tf_d = tb*c + td*d;\n);\nfunction wf_pop() local(p)\n(\n  tf_sp -= 1; p = WF_STK + tf_sp*6;\n  tf_a = p[0]; tf_b = p[1]; tf_c = p[2]; tf_d = p[3]; tf_e = p[4]; tf_f = p[5];\n);\nfunction wf_seg(x1, y1, x2, y2) local(p)\n(\n  wfn < WF_GEO_MAX ? ( p = wfbuf + 1 + wfn*6; p[0] = x1; p[1] = y1; p[2] = x2; p[3] = y2; p[4] = wfcat; p[5] = wfhid; wfn += 1; );\n);\nfunction wf_mv(x, y) ( wflx = tf_a*x + tf_c*y + tf_e; wfly = tf_b*x + tf_d*y + tf_f; wffx = wflx; wffy = wfly; );\nfunction wf_to(x, y) local(nx, ny)\n(\n  nx = tf_a*x + tf_c*y + tf_e; ny = tf_b*x + tf_d*y + tf_f;\n  wf_seg(wflx, wfly, nx, ny); wflx = nx; wfly = ny;\n);\nfunction wf_close() ( wf_seg(wflx, wfly, wffx, wffy); wflx = wffx; wfly = wffy; );\nfunction wf_line(x1, y1, x2, y2) ( wf_mv(x1, y1); wf_to(x2, y2); );\n// a hidden edge (drawn dashed)\nfunction wf_lineh(x1, y1, x2, y2) ( wfhid = 1; wf_mv(x1, y1); wf_to(x2, y2); wfhid = 0; );\nfunction wf_rect(x, y, w, h) ( wf_mv(x, y); wf_to(x + w, y); wf_to(x + w, y + h); wf_to(x, y + h); wf_close(); );\nfunction wf_arc(cx, cy, rx, ry, a0, a1) local(n, i, a)\n(\n  n = max(6, ceil(abs(a1 - a0)/(2*$pi)*32)); i = 0;\n  loop(n + 1,\n    a = a0 + (a1 - a0)*i/n;\n    i == 0 ? wf_mv(cx + rx*cos(a), cy + ry*sin(a)) : wf_to(cx + rx*cos(a), cy + ry*sin(a));\n    i += 1;\n  );\n);\nfunction wf_arch(cx, cy, rx, ry, a0, a1) ( wfhid = 1; wf_arc(cx, cy, rx, ry, a0, a1); wfhid = 0; );\nfunction wf_ell(cx, cy, rx, ry) ( wf_arc(cx, cy, rx, ry, 0, 2*$pi); );\n// a box seen from the front, a little from above and the right\nfunction wf_box(x, y, w, h, dep) local(dx, dy)\n(\n  dx = dep*0.55; dy = -dep*0.45;\n  wf_rect(x, y, w, h);\n  wf_mv(x, y); wf_to(x + dx, y + dy); wf_to(x + w + dx, y + dy); wf_to(x + w, y);\n  wf_mv(x + w + dx, y + dy); wf_to(x + w + dx, y + h + dy); wf_to(x + w, y + h);\n  wfhid = 1;\n  wf_mv(x + dx, y + dy); wf_to(x + dx, y + h + dy); wf_to(x + w + dx, y + h + dy);\n  wf_mv(x, y + h); wf_to(x + dx, y + h + dy);\n  wfhid = 0;\n);\n// a tube lying along x, radius r0 at x0 to r1 at x1; capl/capr: draw its ends\nfunction wf_tube(x0, x1, cy, r0, r1, capl, capr)\n(\n  wf_line(x0, cy - r0, x1, cy - r1); wf_line(x0, cy + r0, x1, cy + r1);\n  capl ? ( wf_arc(x0, cy, r0*0.3, r0, 0.5*$pi, 1.5*$pi); wf_arch(x0, cy, r0*0.3, r0, -0.5*$pi, 0.5*$pi); );\n  capr ? wf_ell(x1, cy, r1*0.3, r1) : ( wf_arc(x1, cy, r1*0.3, r1, -0.5*$pi, 0.5*$pi); wf_arch(x1, cy, r1*0.3, r1, 0.5*$pi, 1.5*$pi); );\n);\n// a tube standing upright\nfunction wf_vtube(cx, y0, y1, r, captop)\n(\n  wf_line(cx - r, y0, cx - r, y1); wf_line(cx + r, y0, cx + r, y1);\n  captop ? wf_ell(cx, y0, r, r*0.32);\n  wf_arc(cx, y1, r, r*0.32, 0, $pi); wf_arch(cx, y1, r, r*0.32, $pi, 2*$pi);\n);\nfunction wf_ring(cx, cy, r) ( wf_arc(cx, cy, r*0.3, r, -0.5*$pi, 0.5*$pi); wf_arch(cx, cy, r*0.3, r, 0.5*$pi, 1.5*$pi); );\nfunction wf_arrow(x, y, a, s)\n(\n  wf_mv(x - s*cos(a - 0.45), y - s*sin(a - 0.45)); wf_to(x, y); wf_to(x - s*cos(a + 0.45), y - s*sin(a + 0.45));\n);\n// smooth outlines (Chaikin's corner cutting): add points, run, draw\nfunction wf_chs() ( wf_chn = 0; );\nfunction wf_ch(x, y) ( WF_CHA[wf_chn*2] = x; WF_CHA[wf_chn*2 + 1] = y; wf_chn += 1; );\nfunction wf_chrun(n, closed) local(m, o, i, j, ax, ay, bx, by)\n(\n  loop(n,\n    m = wf_chn; o = 0;\n    !closed ? ( WF_CHB[0] = WF_CHA[0]; WF_CHB[1] = WF_CHA[1]; o = 1; );\n    i = 0;\n    loop(closed ? m : m - 1,\n      j = (i + 1) % m; ax = WF_CHA[i*2]; ay = WF_CHA[i*2 + 1]; bx = WF_CHA[j*2]; by = WF_CHA[j*2 + 1];\n      WF_CHB[o*2] = 0.75*ax + 0.25*bx; WF_CHB[o*2 + 1] = 0.75*ay + 0.25*by; o += 1;\n      WF_CHB[o*2] = 0.25*ax + 0.75*bx; WF_CHB[o*2 + 1] = 0.25*ay + 0.75*by; o += 1;\n      i += 1;\n    );\n    !closed ? ( WF_CHB[o*2] = WF_CHA[(m - 1)*2]; WF_CHB[o*2 + 1] = WF_CHA[(m - 1)*2 + 1]; o += 1; );\n    i = 0; loop(o*2, WF_CHA[i] = WF_CHB[i]; i += 1;);\n    wf_chn = o;\n  );\n);\nfunction wf_chdraw(closed, s) local(i)\n(\n  i = 0;\n  loop(wf_chn, i == 0 ? wf_mv(s*WF_CHA[0], s*WF_CHA[1]) : wf_to(s*WF_CHA[i*2], s*WF_CHA[i*2 + 1]); i += 1;);\n  closed ? wf_close();\n);\n// a flat hand, fingers pointing along +x\nfunction wf_hand(x, y, s, a) local(i, fy, l)\n(\n  wf_push(x, y, a, 1);\n  wf_chs(); wf_ch(-30, -14); wf_ch(-4, -16); wf_ch(0, -12); wf_ch(0, 12); wf_ch(-4, 18); wf_ch(-30, 16); wf_ch(-38, 2);\n  wf_chrun(2, 1); wf_chdraw(1, s);\n  i = 0;\n  loop(4,\n    fy = (-11 + i*7.3)*s; l = (i == 0 ? 22 : i == 1 ? 26 : i == 2 ? 25 : 20)*s;\n    wf_chs(); wf_ch(0, fy - 3*s); wf_ch(l, fy - 2.6*s); wf_ch(l + 3*s, fy); wf_ch(l, fy + 2.6*s); wf_ch(0, fy + 3*s);\n    wf_chrun(2, 0); wf_chdraw(0, 1);\n    i += 1;\n  );\n  wf_chs(); wf_ch(-14*s, -15*s); wf_ch(-2*s, -26*s); wf_ch(8*s, -30*s); wf_ch(10*s, -26*s); wf_ch(0, -14*s);\n  wf_chrun(2, 0); wf_chdraw(0, 1);\n  wf_pop();\n);\n// a guitar's outline: half its width at x (0 to 1 along it)\nfunction wf_gh(x) local(a, b, h)\n(\n  a = max(0, 0.09 - (x - 0.68)*(x - 0.68)); b = max(0, 0.0529 - (x - 0.24)*(x - 0.24));\n  h = max(sqrt(a), 0.92*sqrt(b));\n  max(h, (x > 0.3 && x < 0.55) ? 0.16 : 0);\n);\n\n// ---- the parts. md: 0 in a line, 1 in layers. The element leaves where it\n// lies (el_*), the resonator where a radiator can join it (rz_*).\nfunction wf_element(opt, md) local(x0, x1, y, r, n, i, dx, dy, cx, rx, ry, yt, hg, a, lx, n1, n2, dep, w, xs, yf, bl, lt, xa, ya)\n(\n  x0 = lay_ex0; x1 = lay_ex1; y = lay_ey; el_x0 = x0; el_x1 = x1; el_y = y;\n  r = md == 0 ? 22 : 16;\n  opt == 0 ? (\n    // strings between a nut and a saddle (on a neck when in a line)\n    n = md == 0 ? 3 : 4;\n    md == 0 ? wf_box(x0, y + 6, x1 - x0, 9, 26);\n    wf_box(x0 + 4, y - 6, 8, 12, 14); wf_box(x1 - 14, y - 6, 8, 12, 14);\n    i = 0; loop(n, dx = i*6*0.55*1.4; dy = -i*6*0.45*1.4; wf_line(x0 + 8 + dx, y - 5 + dy, x1 - 10 + dx, y - 5 + dy); i += 1;);\n    el_top = y - 12; el_bot = md == 0 ? y + 15 : y; el_r = 6;\n  ) : opt == 1 ? (\n    // a skin: a drum in a line, a head over the body in layers\n    cx = 0.5*(x0 + x1); rx = min(130, 0.5*(x1 - x0)); ry = rx*0.26;\n    md == 0 ? (\n      yt = y - 22; hg = 50;\n      wf_ell(cx, yt, rx, ry); wf_ell(cx, yt, rx*0.95, ry*0.92);\n      wf_line(cx - rx, yt, cx - rx, yt + hg); wf_line(cx + rx, yt, cx + rx, yt + hg);\n      wf_arc(cx, yt + hg, rx, ry, 0, $pi); wf_arch(cx, yt + hg, rx, ry, $pi, 2*$pi);\n      i = 1; loop(5, a = $pi*i/6; lx = cx - rx*cos(a); wf_line(lx, yt + ry*sin(a), lx, yt + ry*sin(a) + 0.5*hg); i += 1;);\n      el_top = yt - ry; el_bot = yt + hg + ry;\n    ) : (\n      wf_ell(cx, y + 12, rx, ry); wf_ell(cx, y + 12, rx*1.04, ry*1.1);\n      i = 0; loop(10, a = 2*$pi*i/10; wf_line(cx + rx*1.04*cos(a), y + 12 + ry*1.1*sin(a), cx + rx*1.1*cos(a), y + 12 + ry*1.2*sin(a)); i += 1;);\n      el_top = y + 12 - ry; el_bot = y + 12 + ry;\n    );\n    el_x0 = cx - rx; el_x1 = cx + rx; el_r = ry;\n  ) : opt == 2 ? (\n    // a bar on two supports at its nodes\n    wf_box(x0 + 8, y - 7, x1 - x0 - 16, 14, md == 0 ? 30 : 34);\n    n1 = x0 + 8 + 0.224*(x1 - x0 - 16); n2 = x0 + 8 + 0.776*(x1 - x0 - 16);\n    md == 0 ? (\n      wf_mv(n1 - 8, y + 22); wf_to(n1, y + 7); wf_to(n1 + 8, y + 22); wf_close();\n      wf_mv(n2 - 8, y + 22); wf_to(n2, y + 7); wf_to(n2 + 8, y + 22); wf_close();\n    ) : (\n      wf_lineh(n1, y + 7, n1 + 12, y - 4); wf_ell(n1 + 6, y - 13, 2.5, 1.5);\n      wf_lineh(n2, y + 7, n2 + 12, y - 4); wf_ell(n2 + 6, y - 13, 2.5, 1.5);\n    );\n    el_top = y - 22; el_bot = y + 7; el_r = 7;\n  ) : opt == 3 ? (\n    // a flat sheet, with its thickness\n    dep = md == 0 ? 70 : 64; w = x1 - x0 - 20; xs = x0 + 10; yf = y + 14;\n    dx = dep*0.55; dy = -dep*0.45;\n    wf_mv(xs, yf); wf_to(xs + w, yf); wf_to(xs + w + dx, yf + dy); wf_to(xs + dx, yf + dy); wf_close();\n    wf_mv(xs, yf); wf_to(xs, yf + 4); wf_to(xs + w, yf + 4); wf_to(xs + w, yf);\n    wf_line(xs + w, yf + 4, xs + w + dx, yf + dy + 4); wf_line(xs + w + dx, yf + dy, xs + w + dx, yf + dy + 4);\n    el_top = yf + dy; el_bot = yf + 4; el_r = 10;\n  ) : opt == 4 ? (\n    // tines clamped in a block, a comb of them in layers\n    n = md == 0 ? 4 : 7; bl = md == 0 ? 30 : 40;\n    wf_box(x0, y - 12, bl, 24, n*8 + 6);\n    i = 0;\n    loop(n,\n      lt = (x1 - x0 - bl - 10)*(1 - i*(md == 0 ? 0.16 : 0.1));\n      dx = (i*8 + 4)*0.55; dy = -(i*8 + 4)*0.45; xa = x0 + bl + dx; ya = y + dy;\n      wf_mv(xa, ya - 3); wf_to(xa + lt - 4, ya - 2); wf_to(xa + lt, ya); wf_to(xa + lt - 4, ya + 2); wf_to(xa, ya + 3);\n      i += 1;\n    );\n    el_top = y - 12 - (n*8 + 6)*0.45; el_bot = y + 12; el_r = 12; el_x1 = x0 + bl + (x1 - x0 - bl - 10);\n  ) : (\n    // a tube of air\n    wf_tube(x0, x1, y, r, r, 1, 1);\n    wf_ring(x0 + (x1 - x0)*0.36, y, r); wf_ring(x0 + (x1 - x0)*0.68, y, r);\n    el_top = y - r; el_bot = y + r; el_r = r;\n  );\n);\n\nfunction wf_res(opt, md) local(x0, x1, y, r0, w, sy, dep, i, t, cx, rr, bx0, bx1, by0, by1, cy, yt, cyy)\n(\n  rz_cone = 0;\n  md == 0 ? (\n    x0 = lay_rx0; x1 = lay_rx1; y = lay_ey; r0 = el_r > 4 ? min(el_r, 22) : 14;\n    opt == 0 ? (\n      wf_tube(x0, x1, y, r0, 40, 0, 0);\n      wf_ring(x0 + 70, y, r0 + (40 - r0)*70/(x1 - x0)); wf_ring(x0 + 140, y, r0 + (40 - r0)*140/(x1 - x0));\n      rz_x = x1; rz_y = y; rz_r = 40;\n    ) : opt == 1 ? (\n      w = x1 - x0; sy = 0.42*w; dep = 22;\n      i = 0; loop(41, t = i/40; i == 0 ? wf_mv(x0 + t*w, y - wf_gh(t)*sy) : wf_to(x0 + t*w, y - wf_gh(t)*sy); i += 1;);\n      i = 40; loop(41, t = i/40; wf_to(x0 + t*w, y + wf_gh(t)*sy); i -= 1;); wf_close();\n      i = 40; loop(41, t = i/40; i == 40 ? wf_mv(x0 + t*w, y + wf_gh(t)*sy + dep) : wf_to(x0 + t*w, y + wf_gh(t)*sy + dep); i -= 1;);\n      wf_line(x0 + w*0.98, y, x0 + w*0.98, y + dep); wf_lineh(x0 + 2, y, x0 + 2, y + dep);\n      wf_ell(x0 + w*0.46, y, w*0.08, w*0.08);\n      rz_x = x1; rz_y = y; rz_r = 20;\n    ) : opt == 2 ? (\n      wf_tube(x0, x1, y, r0, r0, 0, 1); wf_ell(x1, y, r0*0.24, r0*0.8); wf_lineh(x1 - 8, y - r0, x1 - 8, y + r0);\n      rz_x = x1; rz_y = y; rz_r = r0;\n    ) : opt == 3 ? (\n      cx = x0 + (x1 - x0)*0.6; rr = (x1 - x0)*0.36;\n      wf_tube(x0, cx - rr*0.92, y, 9, 9, 1, 0);\n      wf_ell(cx, y, rr, rr); wf_arc(cx, y, rr, rr*0.3, 0, $pi); wf_arch(cx, y, rr, rr*0.3, $pi, 2*$pi);\n      wf_arc(cx, y, rr*0.4, rr, -0.5*$pi, 0.5*$pi);\n      rz_x = cx + rr; rz_y = y; rz_r = 14;\n    ) : (\n      wf_box(x0, y - 42, x1 - x0 - 24, 84, 40); rz_x = x1 - 24; rz_y = y; rz_r = 26;\n    );\n  ) : (\n    bx0 = lay_bx0; bx1 = lay_bx1; by0 = lay_by0; by1 = lay_by1; cy = 0.5*(by0 + by1);\n    opt == 0 ? (\n      wf_tube(bx0, bx1, cy + 10, 16, 46, 1, 1);\n      wf_ring(bx0 + 150, cy + 10, 16 + 30*150/(bx1 - bx0)); wf_ring(bx0 + 300, cy + 10, 16 + 30*300/(bx1 - bx0));\n      rz_fx = bx1; rz_fy = cy + 10; rz_fr = 46; rz_top = cy - 36;\n    ) : opt == 1 ? (\n      w = bx1 - bx0; sy = 1.05*(by1 - by0); dep = 30; yt = by0 + 22;\n      i = 0; loop(49, t = i/48; i == 0 ? wf_mv(bx0 + t*w, yt + 8 - wf_gh(t)*sy) : wf_to(bx0 + t*w, yt + 8 - wf_gh(t)*sy); i += 1;);\n      i = 48; loop(49, t = i/48; wf_to(bx0 + t*w, yt + 8 + wf_gh(t)*sy); i -= 1;); wf_close();\n      i = 48; loop(49, t = i/48; i == 48 ? wf_mv(bx0 + t*w, yt + 8 + wf_gh(t)*sy + dep) : wf_to(bx0 + t*w, yt + 8 + wf_gh(t)*sy + dep); i -= 1;);\n      wf_line(bx0 + w*0.98, yt + 8, bx0 + w*0.98, yt + 8 + dep);\n      wf_ell(bx0 + w*0.42, yt + 8, w*0.07, w*0.07*0.42);\n      rz_fx = bx1; rz_fy = yt + 30; rz_fr = 22; rz_top = yt + 8 - 0.3*sy; rz_cone = 1; rz_cx = bx0 + w*0.7; rz_cy = yt + 8 + 0.18*sy;\n    ) : opt == 2 ? (\n      i = 0; loop(7, cx = bx0 + 20 + i*(bx1 - bx0 - 40)/6; wf_vtube(cx, by0 + 6, by0 + 126 - i*11, 13, 1); i += 1;);\n      wf_lineh(bx0 + 4, by0 + 18, bx1 - 4, by0 + 18);\n      rz_fx = bx1 + 14; rz_fy = by0 + 40; rz_fr = 16; rz_top = by0;\n    ) : opt == 3 ? (\n      cx = 0.5*(bx0 + bx1); rr = 58; cyy = by0 + 66;\n      wf_vtube(cx, lay_ey + 6, cyy - rr*0.94, 9, 0);\n      wf_ell(cx, cyy, rr*1.25, rr); wf_arc(cx, cyy, rr*1.25, rr*0.3, 0, $pi); wf_arch(cx, cyy, rr*1.25, rr*0.3, $pi, 2*$pi);\n      wf_arc(cx, cyy, rr*0.45, rr, -0.5*$pi, 0.5*$pi);\n      rz_fx = cx + rr*1.25; rz_fy = cyy; rz_fr = 16; rz_top = cyy - rr; rz_cone = 1; rz_cx = cx + rr*0.55; rz_cy = cyy + rr*0.35;\n    ) : (\n      wf_box(bx0, by0 + 14, bx1 - bx0 - 40, by1 - by0 - 18, 60);\n      rz_fx = bx1 - 40; rz_fy = cy + 12; rz_fr = 24; rz_top = by0 + 14; rz_cone = 1; rz_cx = bx1 - 110; rz_cy = cy + 12;\n    );\n  );\n);\n\nfunction wf_coupler(opt) local(a, b, x, yt, yb, y)\n(\n  y = lay_ey;\n  opt == 2 ? (\n    a = lay_cx0; b = lay_cx1;\n    wf_tube(a, a + 26, y, 9, 5, 1, 0); wf_tube(a + 26, b, y, 5, min(el_r > 4 ? el_r : 14, 22), 0, 0); wf_lineh(a + 26, y - 5, a + 26, y + 5);\n  ) : opt == 3 ? (\n    a = lay_cx0; b = lay_cx1; wf_box(a, y - 13, b - a, 26, 20);\n    wf_mv(b - 26, y - 13); wf_to(b - 18, y - 20); wf_to(b - 6, y - 20); wf_to(b - 12, y - 13); wf_close();\n    wf_lineh(a + 4, y, b - 22, y - 9);\n  ) : opt == 0 ? (\n    x = lay_cpx; yt = el_bot + 1; yb = lay_cpy;\n    wf_mv(x - 22, yb); wf_to(x - 14, yt); wf_to(x + 14, yt); wf_to(x + 22, yb); wf_to(x + 12, yb); wf_to(x + 6, yb - 7); wf_to(x - 6, yb - 7); wf_to(x - 12, yb); wf_close();\n    wf_line(x + 14, yt, x + 22, yt - 6); wf_line(x + 22, yt - 6, x + 30, yb - 6); wf_line(x + 22, yb, x + 30, yb - 6);\n  ) : (\n    x = lay_cpx; yt = el_bot + 1; yb = lay_cpy + 4; wf_vtube(x, yt, yb, 5, 1);\n  );\n);\n\n// a flared bell from (x0, y, radius r0) to x1, mouth radius r1\nfunction wf_bell(x0, x1, y, r0, r1) local(i, t, x, r)\n(\n  i = 0; loop(25, t = i/24; x = x0 + t*(x1 - x0); r = r0 + (r1 - r0)*t*t*t; i == 0 ? wf_mv(x, y - r) : wf_to(x, y - r); i += 1;);\n  i = 0; loop(25, t = i/24; x = x0 + t*(x1 - x0); r = r0 + (r1 - r0)*t*t*t; i == 0 ? wf_mv(x, y + r) : wf_to(x, y + r); i += 1;);\n  wf_ell(x1, y, r1*0.28, r1);\n);\nfunction wf_rad(opt, md) local(x0, y, r0, x1, i, a, aa, xa, xb, yf, dx, dy, cx, yy)\n(\n  md == 0 ? (\n    x0 = rz_x; y = rz_y; r0 = rz_r; x1 = lay_dx1;\n    opt == 0 ? (\n      wf_bell(x0, x1, y, r0, 78); wf_ell(x1, y, 78*0.24, 78*0.88);\n    ) : opt == 1 ? (\n      wf_tube(x0, x0 + 30, y, 8, 8, 0, 0); wf_box(x0 + 30, y - 85, 12, 150, 70);\n    ) : opt == 2 ? (\n      a = x0 + 50; wf_tube(x0, a, y, min(r0, 12), min(r0, 12), 0, 0);\n      wf_line(a, y - 70, x1 - 20, y - 70); wf_line(a, y + 70, x1 - 20, y + 70);\n      wf_arc(a, y, 22, 70, 0.5*$pi, 1.5*$pi); wf_arch(a, y, 22, 70, -0.5*$pi, 0.5*$pi);\n      wf_ell(x1 - 20, y, 22, 70); wf_ell(x1 - 20, y, 19, 64);\n      i = 1; loop(4, aa = -0.5*$pi + $pi*i/5; wf_line(a + 22*cos(aa) + 10, y + 70*sin(aa), x1 - 20 + 22*cos(aa) - 10, y + 70*sin(aa)); i += 1;);\n    ) : (\n      a = x0 + 30; wf_box(x0, y - 16, 30, 32, 16);\n      wf_ell(x1 - 20, y, 22, 72); wf_ell(x1 - 20, y, 17, 60); wf_ell(x1 - 44, y, 7, 22);\n      wf_line(x1 - 20, y - 60, x1 - 44, y - 22); wf_line(x1 - 20, y + 60, x1 - 44, y + 22);\n      wf_lineh(a, y - 16, x1 - 44, y - 22); wf_lineh(a, y + 16, x1 - 44, y + 22);\n    );\n  ) : (\n    opt == 0 ? (\n      wf_bell(rz_fx, 880, rz_fy, min(rz_fr, 16), 62);\n    ) : opt == 1 ? (\n      xa = lay_bx0 + 30; xb = lay_bx1 - 60; yf = rz_top - 2; dx = 50*0.55; dy = -50*0.45;\n      wf_mv(xa, yf); wf_to(xb, yf); wf_to(xb + dx, yf + dy); wf_to(xa + dx, yf + dy); wf_close();\n      wf_mv(xa, yf); wf_to(xa, yf + 4); wf_to(xb, yf + 4); wf_to(xb, yf);\n      wf_line(xb, yf + 4, xb + dx, yf + dy + 4); wf_line(xb + dx, yf + dy, xb + dx, yf + dy + 4);\n      wf_ell(xa + (xb - xa)*0.35 + 0.5*dx, yf + 0.5*dy, 22, 7);\n    ) : opt == 2 ? (\n      cx = 0.5*(lay_bx0 + lay_bx1) - 10; yy = rz_top + 2;\n      wf_ell(cx, yy, 150, 30); wf_ell(cx, yy, 158, 34);\n      i = 0; loop(12, a = 2*$pi*i/12; wf_line(cx + 158*cos(a), yy + 34*sin(a), cx + 158*cos(a), yy + 34*sin(a) + 10); i += 1;);\n    ) : (\n      cx = rz_cone ? rz_cx : lay_bx1 - 100; yy = rz_cone ? rz_cy : 0.5*(lay_by0 + lay_by1);\n      wf_ell(cx, yy, 34, 34); wf_ell(cx, yy, 26, 26); wf_ell(cx, yy, 9, 9);\n      i = 0; loop(4, a = 0.25*$pi + 0.5*$pi*i; wf_ell(cx + 30*cos(a), yy + 30*sin(a), 1.8, 1.8); i += 1;);\n    );\n  );\n);\n\n// the exciter, touching the element at the origin, coming from -x\nfunction wf_exc(opt)\n(\n  opt == 0 ? (\n    wf_mv(-88, -10); wf_to(-22, -12); wf_to(0, -5); wf_to(0, 5); wf_to(-22, 10); wf_to(-88, 10);\n    wf_arc(-88, 0, 3, 10, 0.5*$pi, 1.5*$pi);\n    wf_line(-70, 12, -2, 7); wf_line(-70, 15, -2, 9);\n    wf_ring(-58, 0, 14); wf_ring(-48, 0, 14);\n  ) : opt == 1 ? (\n    wf_chs(); wf_ch(-44, -30); wf_ch(-30, -26); wf_ch(-12, -20); wf_ch(0, -10); wf_ch(-3, -3); wf_ch(-24, -6); wf_ch(-44, -10); wf_chrun(2, 1); wf_chdraw(1, 1);\n    wf_chs(); wf_ch(-44, 30); wf_ch(-30, 28); wf_ch(-12, 20); wf_ch(0, 10); wf_ch(-3, 3); wf_ch(-24, 7); wf_ch(-44, 12); wf_chrun(2, 1); wf_chdraw(1, 1);\n    wf_chs(); wf_ch(-46, -42); wf_ch(-36, -36); wf_ch(-44, -30); wf_chrun(1, 0); wf_chdraw(0, 1);\n  ) : opt == 2 ? (\n    wf_chs(); wf_ch(-30, -14); wf_ch(-6, -12); wf_ch(0, 0); wf_ch(-6, 12); wf_ch(-30, 14); wf_ch(-36, 0); wf_chrun(2, 1); wf_chdraw(1, 1);\n    wf_line(-24, 12, -24, 70); wf_line(-14, 13, -14, 70); wf_rect(-30, 70, 22, 10);\n  ) : opt == 3 ? (\n    wf_line(28, -70, -12, 78); wf_line(18, -72, -20, 70); wf_line(28, -70, 18, -72); wf_box(-26, 64, 16, 18, 10);\n  ) : opt == 4 ? (\n    wf_chs(); wf_ch(0, 0); wf_ch(-38, -20); wf_ch(-44, 0); wf_ch(-38, 20); wf_chrun(2, 1); wf_chdraw(1, 1);\n  ) : (\n    wf_ell(-16, 0, 16, 16); wf_arc(-16, 0, 16, 5, 0, $pi); wf_arch(-16, 0, 16, 5, $pi, 2*$pi);\n    wf_line(-24, 14, -66, 82); wf_line(-18, 16, -60, 84);\n  );\n);\n// the energy source, ending at the origin, coming from -x\nfunction wf_energy(opt) local(k, i, x)\n(\n  opt == 0 ? (\n    k = -1;\n    loop(3,\n      i = 0; loop(25, x = -84 + i*3; i == 0 ? wf_mv(x, k*13 + 4*sin(i*0.7 + k)) : wf_to(x, k*13 + 4*sin(i*0.7 + k)); i += 1;);\n      wf_arrow(-12, k*13 + 4*sin(16.8 + k), 0.3*cos(16.8 + k), 6);\n      k += 1;\n    );\n  ) : opt == 1 ? (\n    wf_line(-40, -38, -40, 38); wf_arrow(-40, -38, -0.5*$pi, 8); wf_arrow(-40, 38, 0.5*$pi, 8);\n    wf_lineh(-56, -26, -56, 26); wf_lineh(-24, -26, -24, 26);\n  ) : opt == 2 ? (\n    wf_chs(); wf_ch(-90, -8); wf_ch(-18, -8); wf_ch(-6, -5); wf_ch(-2, 0); wf_ch(-6, 6); wf_ch(-18, 8); wf_ch(-90, 8); wf_chrun(2, 0); wf_chdraw(0, 1);\n    wf_chs(); wf_ch(-26, -8); wf_ch(-10, -6); wf_ch(-6, 0); wf_chrun(1, 0); wf_chdraw(0, 1);\n    wf_lineh(-50, -8, -50, 8);\n  ) : opt == 3 ? (\n    wf_arc(-44, 30, 40, 40, -0.95*$pi, -0.15*$pi); wf_arrow(-44 + 40*cos(-0.15*$pi), 30 + 40*sin(-0.15*$pi), 0.35*$pi, 8);\n  ) : opt == 4 ? (\n    wf_push(-36, 6, -0.5, 1);\n    wf_line(-50, 0, 0, 0); wf_line(-50, 6, 0, 6); wf_box(0, -14, 14, 34, 10); wf_line(0, -14, -8, -22);\n    wf_pop();\n  ) : (\n    wf_mv(-50, -40); wf_to(-28, -40); wf_to(-38, -6); wf_to(-20, -6); wf_to(-52, 40); wf_to(-42, 4); wf_to(-60, 4); wf_close();\n  );\n);\n\nfunction wf_freq(opt, md) local(x0, x1, k, x, a, b, yb, d, ky, kw)\n(\n  x0 = el_x0 + (el_x1 - el_x0)*0.18; x1 = el_x0 + (el_x1 - el_x0)*0.86;\n  opt == 0 ? (\n    // frets, closer together up the neck\n    k = 0;\n    while (x = x0 + (x1 - x0)*(1 - 2^(-k/7))*1.6; k < 9 && x <= x1) ( wf_line(x, el_bot + 3, x + 10, el_top - 2); k += 1; );\n  ) : opt == 1 ? (\n    k = 0; loop(6, x = x0 + (x1 - x0)*k/5; wf_ell(x, el_top + 4, 6, 2.6); wf_ell(x, el_top + 4, 3.5, 1.4); k += 1;);\n  ) : opt == 2 ? (\n    k = 0;\n    loop(3,\n      x = x0 + 30 + k*32; wf_vtube(x, el_top - 42, el_top, 8, 1); wf_vtube(x, el_top - 52, el_top - 44, 5, 1);\n      wf_line(x - 8, el_bot, x - 8, el_bot + 16); wf_line(x + 8, el_bot, x + 8, el_bot + 16); wf_arc(x, el_bot + 16, 8, 2.6, 0, $pi);\n      k += 1;\n    );\n  ) : opt == 3 ? (\n    a = x0 + 40; b = x1 - 30; yb = el_bot + 4; d = 58;\n    wf_line(a, yb, a, yb + d); wf_line(a + 10, yb, a + 10, yb + d - 10); wf_line(b, yb, b, yb + d); wf_line(b - 10, yb, b - 10, yb + d - 10);\n    wf_line(a, yb + d, b, yb + d); wf_line(a + 10, yb + d - 10, b - 10, yb + d - 10);\n    wf_line(a - 6, yb + d*0.45, a + 16, yb + d*0.45); wf_line(b - 16, yb + d*0.45, b + 6, yb + d*0.45);\n  ) : (\n    // a keyboard: under the element in a line, in front of the body in layers\n    ky = el_bot + 14; md == 1 ? ( x0 = 28; x1 = 222; ky = el_y + 74; );\n    kw = (x1 - x0)/10;\n    k = 0; loop(10, wf_box(x0 + k*kw, ky, kw - 1.5, 9, 22); k += 1;);\n    k = 0; loop(9, (k != 2 && k != 6) ? wf_box(x0 + (k + 0.68)*kw + 5, ky - 6, kw*0.55, 6, 13); k += 1;);\n  );\n);\n\nfunction wf_tune(opt, x, y) local(k, px, py, a, b, yt)\n(\n  opt == 0 ? (\n    wf_box(x - 22, y - 10, 26, 20, 16);\n    wf_line(x - 14, y - 10, x - 14, y - 30); wf_ell(x - 14, y - 36, 7, 9);\n    wf_line(x - 2, y - 6, x - 2, y - 30); wf_ell(x - 2, y - 36, 7, 9);\n  ) : opt == 1 ? (\n    wf_box(x - 30, y - 6, 36, 12, 18);\n    k = 0; loop(4, px = x - 22 + k*8; py = y - 6 - k*2.5; wf_line(px, py, px, py - 16); wf_ell(px, py - 17, 2.4, 1.2); k += 1;);\n  ) : opt == 2 ? (\n    wf_box(x - 26, y - 8, 30, 10, 18); wf_vtube(x - 12, y - 30, y - 8, 4, 1); wf_ell(x - 12, y - 18, 9, 3);\n    wf_line(x - 4, y - 14, x + 10, y - 14); wf_ell(x + 16, y - 14, 4, 8);\n  ) : (\n    a = x - 24; b = x + 6; yt = y - 40;\n    wf_line(a, y - 4, a, yt); wf_line(a + 8, y - 4, a + 8, yt + 8); wf_line(b, y - 4, b, yt); wf_line(b - 8, y - 4, b - 8, yt + 8);\n    wf_arc(0.5*(a + b), yt, 0.5*(b - a), 10, $pi, 2*$pi); wf_arc(0.5*(a + b), yt + 8, 0.5*(b - a) - 8, 6, $pi, 2*$pi);\n  );\n);\n\n// mouth: the bell's mouth is at (mx, my), where a mute or a hand goes\nfunction wf_damp(opt, mouth, mx, my) local(x, a)\n(\n  x = el_x0 + (el_x1 - el_x0)*0.9;\n  opt == 0 ? (\n    wf_line(x, el_top - 60, x, el_top - 16); wf_box(x - 10, el_top - 16, 20, 14, 14);\n  ) : opt == 1 ? (\n    mouth ? ( wf_ell(mx - 14, my, 6, 24); wf_ell(mx + 18, my, 12, 46); wf_line(mx - 14, my - 24, mx + 18, my - 46); wf_line(mx - 14, my + 24, mx + 18, my + 46); ) :\n            ( wf_box(x - 12, el_top - 14, 24, 14, 16); wf_line(x - 12, el_top - 7, x - 20, el_top + 4); );\n  ) : opt == 2 ? (\n    wf_hand(x - 10, el_top - 10, 0.9, 0.08);\n  ) : opt == 3 ? (\n    a = el_x0 + (el_x1 - el_x0)*0.06; wf_box(a, el_top - 6, (el_x1 - el_x0)*0.1, 6, 18); wf_line(a + 10, el_top - 10, a + 10, el_top - 40);\n  ) : (\n    mouth ? wf_hand(mx - 10, my + 6, 1.1, -1.35) : wf_hand(x - 10, el_top - 10, 0.9, 0.08);\n  );\n);\n\n// ytop: where the modulation part reaches up to (under the element, or the body)\nfunction wf_mod(opt, ytop) local(base, k, x, a, b, ry, cx, yy, i, bx, by, t)\n(\n  base = lay_floor;\n  opt == 0 ? (\n    a = el_x0 + (el_x1 - el_x0)*0.25; b = el_x0 + (el_x1 - el_x0)*0.8; ry = max(ytop + 30, base - 34);\n    wf_line(a, ry, b, ry);\n    k = 0; loop(3, x = a + 20 + k*(b - a - 40)/2; wf_line(x, ry, x, ytop + 2); wf_ell(x, ry + 10, 9, 3); wf_line(x, ry, x, ry + 10); k += 1;);\n  ) : opt == 1 ? (\n    cx = lay_pedx; wf_box(cx - 50, base - 10, 100, 10, 30);\n    k = 0; loop(3, x = cx - 34 + k*28; wf_mv(x, base - 10); wf_to(x + 10, base - 10); wf_to(x + 20, base - 36); wf_to(x + 10, base - 36); wf_close(); k += 1;);\n    wf_lineh(cx, base - 30, cx, lay_pedtop);\n  ) : opt == 2 ? (\n    x = el_x0 + (el_x1 - el_x0)*0.55; wf_vtube(x, ytop + 4, ytop + 40, 7, 1); wf_line(x, ytop + 40, x + 40, ytop + 52); wf_ell(x + 44, ytop + 53, 6, 2.4);\n  ) : opt == 3 ? (\n    x = el_x0 + (el_x1 - el_x0)*0.4; yy = max(ytop + 34, base - 30);\n    wf_line(x - 50, yy, x + 50, yy - 14); wf_mv(x - 6, yy + 10); wf_to(x, yy - 7); wf_to(x + 6, yy + 10); wf_close();\n    i = 0; loop(9, i == 0 ? wf_mv(x + 28, yy - 12) : wf_to(x + 34 + (i % 2 ? 6 : -6), yy - 12 + i*(base - yy + 6)/8); i += 1;);\n    wf_lineh(x - 50, yy, x - 50, ytop + 2);\n  ) : (\n    bx = lay_elx; by = base - 34; wf_box(bx, by, 80, 30, 26);\n    wf_ell(bx + 20, by + 15, 6, 6); wf_ell(bx + 42, by + 15, 6, 6); wf_rect(bx + 58, by + 11, 12, 8);\n    i = 0; loop(17, t = i/16; x = bx + 2 - t*60; yy = by + 15 + sin(t*$pi)*22 - t*t*(by + 15 - ytop - 4); i == 0 ? wf_mv(x, yy) : wf_to(x, yy); i += 1;);\n  );\n);\n\n// The whole instrument from the twelve choices in WF_P, into buf: buf[0] is\n// the number of segments, then six values each.\nfunction wf_build(buf) local(md, cx, cxx, cyy)\n(\n  wf_reset(); wfbuf = buf; wfn = 0;\n  md = WF_P[6] >= 2 ? 0 : 1; wf_mode = md;\n  md == 0 ? (\n    lay_ey = 176; lay_cx0 = 196; lay_cx1 = 262; lay_ex0 = 262; lay_ex1 = 520; lay_rx0 = 520; lay_rx1 = 712; lay_dx1 = 872;\n    lay_floor = 352; lay_pedx = 640; lay_pedtop = 216; lay_elx = 610;\n  ) : (\n    lay_ey = 150; lay_ex0 = 176; lay_ex1 = 770; lay_bx0 = 240; lay_bx1 = 700; lay_by0 = 186; lay_by1 = 300; lay_cpx = 600; lay_cpy = 188;\n    lay_floor = 352; lay_pedx = 470; lay_pedtop = 300; lay_elx = 740;\n  );\n  wfcat = 2; wf_element(WF_P[2], md);\n  wfcat = 4; wf_res(WF_P[4], md);\n  md == 1 ? lay_cpy = max(el_bot + 12, rz_top);\n  wfcat = 6; wf_coupler(WF_P[6]);\n  wfcat = 7; wf_rad(WF_P[7], md);\n  md == 0 ? (\n    cx = lay_cx0;\n    wfcat = 1; WF_P[1] == 3 ? wf_push(cx - 30, lay_ey, 0, 1) : wf_push(cx, lay_ey, 0, 1); wf_exc(WF_P[1]); wf_pop();\n    wfcat = 0; wf_push(cx - 100, lay_ey, 0, 1); wf_energy(WF_P[0]); wf_pop();\n  ) : (\n    cxx = el_x0 + (el_x1 - el_x0)*0.22; cyy = el_top + 2;\n    wfcat = 1; WF_P[1] == 3 ? wf_push(cxx, el_y - 36, 0, 1) : wf_push(cxx, cyy, 0.5*$pi, 1); wf_exc(WF_P[1]); wf_pop();\n    // the energy comes in from the upper right, mirrored, clear of the exciter\n    wfcat = 0; wf_push(cxx + 34, max(48, el_top - 62), 0, -1); wf_energy(WF_P[0]); wf_pop();\n  );\n  wfcat = 8; wf_freq(WF_P[8], md);\n  wfcat = 9; md == 0 ? wf_tune(WF_P[9], el_x0 + 26, el_top) : wf_tune(WF_P[9], el_x0 - 4, el_y);\n  wfcat = 10; wf_damp(WF_P[10], WF_P[7] == 0, md == 0 ? lay_dx1 : 880, md == 0 ? lay_ey : rz_fy);\n  wfcat = 11; wf_mod(WF_P[11], md == 0 ? max(el_bot, lay_ey + 22) : lay_by1);\n  buf[0] = wfn;\n);\n// the bounding box of part c in buf, into (wbx0, wby0) - (wbx1, wby1)\nfunction wf_bbox(buf, c) local(n, p, k)\n(\n  wbx0 = wby0 = 1000000; wbx1 = wby1 = -1000000; n = buf[0]; p = buf + 1; k = 0;\n  loop(n,\n    p[4] == c ? (\n      wbx0 = min(wbx0, min(p[0], p[2])); wbx1 = max(wbx1, max(p[0], p[2]));\n      wby0 = min(wby0, min(p[1], p[3])); wby1 = max(wby1, max(p[1], p[3]));\n    );\n    p += 6;\n  );\n);\n\n// Word-wrapped text; returns the y below the last line.\n// every word in the window is drawn through say(): it draws s at gfx_x, gfx_y\n// in the current colour, as gfx_drawstr does. When the test host sets\n// hig_audit it also writes down the colour and the box of each string, and\n// with hig_notext it leaves the words out, so the host can measure the ground\n// under every string (tools/hig.cpp, ADR 0023).\nfunction say(s) local(tw, th, p)\n(\n  gfx_measurestr(s, tw, th);\n  hig_audit && HIG_TXT[0] < HIG_TXT_MAX ? (\n    p = HIG_TXT + 1 + HIG_TXT[0]*8;\n    p[0] = gfx_r; p[1] = gfx_g; p[2] = gfx_b; p[3] = gfx_x; p[4] = gfx_y; p[5] = tw; p[6] = th;\n    HIG_TXT[0] += 1;\n  );\n  hig_notext ? gfx_x += tw : gfx_drawstr(s);\n);\nfunction draw_wrapped(s, x, y, w, lh) local(n, k, ch, tw, th, cy)\n(\n  n = strlen(s); k = 0; cy = y;\n  strcpy(#wl, \"\"); strcpy(#ww, \"\");\n  while (k <= n) (\n    ch = k < n ? str_getchar(s, k) : 32;\n    ch == 32 ? (\n      strcpy(#wt, #wl); strlen(#wt) ? strcat(#wt, \" \"); strcat(#wt, #ww);\n      gfx_measurestr(#wt, tw, th);\n      (tw > w && strlen(#wl)) ? ( cy + lh <= wrap_ymax ? ( gfx_x = x; gfx_y = cy; say(#wl); ) : wrap_ymax >= 0 ? wrap_cut += 1; cy += lh; strcpy(#wl, #ww); ) : strcpy(#wl, #wt);\n      strcpy(#ww, \"\");\n    ) : (\n      strcpy_substr(#wc, s, k, 1); strcat(#ww, #wc);\n    );\n    k += 1;\n  );\n  strlen(#wl) ? ( cy + lh <= wrap_ymax ? ( gfx_x = x; gfx_y = cy; say(#wl); ) : wrap_ymax >= 0 ? wrap_cut += 1; );\n  strlen(#wl) ? cy += lh;\n  cy;\n);\n\n// ---- presets: the ten parts and two materials, then force, size,\n// brightness, decay, position, resonator amount, play mode\nPRESET_TAB = 13100; PRESET_STRIDE = 20; PRESET_N = 19;\nfunction preset_name(k)\n(\n  k==0?\"Bamboo Saxophone\":k==1?\"Ice Violin\":k==2?\"Marble Marimba\":k==3?\"Glass Trumpet\":\n  k==4?\"Crystal Music Box\":k==5?\"Rubber Tuba\":k==6?\"Electric Bone Harp\":k==7?\"Clay Drum\":\n  k==8?\"Jelly Gong\":k==9?\"Steel Flute\":k==10?\"Bowed Ice Bar\":k==11?\"Golden Piano\":\n  k==12?\"Paper Accordion\":k==13?\"Carbon Trombone\":k==14?\"Buzzing Glockenspiel\":k==15?\"Bronze Bell Plate\":\n  k==16?\"Plastic Recorder\":k==17?\"Cling Film Kazoo\":\"Tin Roof Banjo\";\n);\nfunction pdef(k, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, f, sz, br, dc, ps, ra, mo) local(p)\n(\n  p = PRESET_TAB + k*PRESET_STRIDE;\n  p[0] = a0; p[1] = a1; p[2] = a2; p[3] = a3; p[4] = a4; p[5] = a5; p[6] = a6; p[7] = a7;\n  p[8] = a8; p[9] = a9; p[10] = a10; p[11] = a11; p[12] = f; p[13] = sz; p[14] = br; p[15] = dc;\n  p[16] = ps; p[17] = ra; p[18] = mo;\n);\n//     en ex el elm rs rsm cp rd fc tm dm md  force size bright decay pos res mono\npdef( 0, 0, 0, 5, 12, 0, 12, 2, 0, 1, 2, 0, 0,  70, 100,   0, 100, 20, 50, 0);\npdef( 1, 1, 3, 0,  7, 1,  7, 0, 1, 0, 0, 0, 4,  70, 100,  10, 100, 15, 60, 0);\npdef( 2, 4, 5, 2,  8, 2,  8, 0, 1, 4, 2, 0, 1,  70, 100,   0, 100, 12, 60, 0);\npdef( 3, 0, 1, 5,  5, 0,  5, 2, 0, 2, 3, 0, 2,  75, 100,   0, 100, 20, 50, 0);\npdef( 4, 3, 4, 4,  6, 4,  6, 0, 1, 4, 2, 0, 1,  60, 100,  20, 100, 10, 50, 0);\npdef( 5, 0, 1, 5, 17, 0, 17, 2, 0, 2, 2, 0, 0,  80, 200,   0, 100, 20, 50, 0);\npdef( 6, 2, 4, 0, 13, 3, 13, 0, 3, 4, 1, 0, 4,  70, 100,   0, 100, 20, 40, 0);\npdef( 7, 4, 5, 1,  9, 3,  9, 1, 2, 4, 0, 2, 0,  80, 100,   0, 100, 30, 60, 0);\npdef( 8, 1, 5, 3, 19, 4, 19, 0, 1, 4, 0, 0, 1,  80, 150,   0, 150, 25, 50, 0);\npdef( 9, 0, 1, 5,  0, 2,  0, 3, 1, 1, 2, 0, 0,  70, 100,   0, 100, 20, 40, 0);\npdef(10, 1, 3, 2,  7, 2,  7, 0, 1, 4, 2, 0, 4,  70, 100,   0, 100,  8, 50, 0);\npdef(11, 2, 2, 0,  4, 1, 10, 0, 1, 4, 1, 0, 1,  70, 100,   0, 100, 12, 50, 0);\npdef(12, 0, 0, 4, 18, 3, 18, 3, 1, 4, 2, 0, 4,  70, 100,   0, 100, 20, 50, 0);\npdef(13, 0, 1, 5, 16, 0, 16, 2, 0, 3, 3, 0, 0,  75, 100,   0, 100, 20, 50, 1);\npdef(14, 5, 2, 2,  3, 2,  3, 0, 3, 4, 2, 0, 4,  60, 100,   0, 100, 15, 50, 0);\npdef(15, 4, 2, 3,  2, 4,  2, 0, 1, 4, 2, 0, 1,  80, 100,   0, 200, 20, 50, 0);\npdef(16, 0, 1, 5, 20, 2, 20, 3, 1, 1, 2, 0, 0,  65, 100,   0, 100, 20, 40, 0);\npdef(17, 0, 1, 1, 26, 3, 24, 2, 1, 4, 2, 0, 0,  90, 100,   0, 100, 20, 50, 0);\npdef(18, 3, 4, 0,  0, 3, 27, 0, 2, 0, 0, 0, 3,  75, 100,   0, 100, 12, 50, 0);\n\nfunction apply_preset(k) local(p, j)\n(\n  p = PRESET_TAB + k*PRESET_STRIDE; j = 0;\n  loop(19, slider(j + 1) = p[j]; j += 1;);\n  slider_automate(2^19 - 1);\n  gui_dirty = 1; cur_preset = k;\n);\nfunction set_part(c, val)\n(\n  val = max(0, min(cat_count(c) - 1, val));\n  slider(c + 1) = val;\n  slider_automate(2^c);\n  gui_dirty = 1; last_cat = c; cur_preset = -1;\n);\nfunction randomise() local(c)\n(\n  c = 0; loop(12, slider(c + 1) = floor(rand(cat_count(c))); c += 1;);\n  slider_automate(2^12 - 1);\n  gui_dirty = 1; cur_preset = -1;\n);\ncur_preset = 0; last_cat = 2; aud_note = 60; wrap_ymax = 1000000; drag_k = -1; pop_c = -1; wf_optc = -1;\n\n@slider\nupdate_globals();\n\n@block\n// MIDI into a queue, handled at the right sample in @sample\nnq = 0;\nwhile (midirecv(mofs, m1, m2, m3)) (\n  nq < MIDIQ_MAX ? ( MIDIQ[nq*4] = mofs; MIDIQ[nq*4+1] = m1; MIDIQ[nq*4+2] = m2; MIDIQ[nq*4+3] = m3; nq += 1; );\n);\n// audition request from the GUI\naud_req ? (\n  nq < MIDIQ_MAX ? ( MIDIQ[nq*4] = 0; MIDIQ[nq*4+1] = 0x90; MIDIQ[nq*4+2] = aud_note; MIDIQ[nq*4+3] = 100; nq += 1; );\n  aud_req = 0; aud_left = 1.2*srate; aud_on = 1;\n);\naud_on ? (\n  aud_left -= samplesblock;\n  aud_left <= 0 ? ( nq < MIDIQ_MAX ? ( MIDIQ[nq*4] = 0; MIDIQ[nq*4+1] = 0x80; MIDIQ[nq*4+2] = aud_note; MIDIQ[nq*4+3] = 0; nq += 1; ); aud_on = 0; );\n);\ngui_dirty ? ( update_globals(); gui_dirty = 0; );\nqi = 0; spos = 0;\nexpr = cc11*(breath_seen ? cc2 : 1);\n\n@sample\nwhile (qi < nq && MIDIQ[qi*4] <= spos) (\n  st = MIDIQ[qi*4+1] & 0xF0; d1 = MIDIQ[qi*4+2]; d2 = MIDIQ[qi*4+3];\n  st == 0x90 && d2 > 0 ? note_on(d1, d2) :\n  (st == 0x80 || (st == 0x90 && d2 == 0)) ? note_off(d1) :\n  st == 0xE0 ? bend = ((d2*128 + d1) - 8192)/8192 :\n  st == 0xD0 ? at_press = d1/127 :\n  st == 0xB0 ? (\n    d1 == 1 ? mw = d2/127 :\n    d1 == 2 ? ( cc2 = d2/127; breath_seen = 1; expr = cc11*cc2; ) :\n    d1 == 11 ? ( cc11 = d2/127; expr = cc11*(breath_seen ? cc2 : 1); ) :\n    d1 == 64 ? ( sustain = d2 >= 64; !sustain ? pedal_up(); ) :\n    d1 == 67 ? soft_ped = d2 >= 64 :\n    (d1 == 120 || d1 == 123) ? all_off();\n  );\n  qi += 1;\n);\nspos += 1;\n\n// control rate: every 16 samples\nctl_ctr -= 1;\nctl_ctr <= 0 ? (\n  ctl_ctr = 16;\n  t_now += 16*dt;\n  lfo_ph += 16*dt*5.5; lfo_ph >= 1 ? lfo_ph -= 1;\n  mod_st = md_type == 2 ? -0.4*mw : md_type == 3 ? 2*mw : md_type == 4 ? 0.3*mw*sin(2*$pi*lfo_ph) : 0;\n  trem = md_type == 4 ? 1 - 0.3*mw*(0.5 + 0.5*sin(2*$pi*lfo_ph + 1.2)) : md_type == 2 ? 1 - 0.3*mw : 1;\n  vi = 0;\n  loop(VOICES_MAX, vv = VOICE_BASE + vi*VOICE_STRIDE; vv[V_ON] ? voice_control(vv); vi += 1;);\n);\n\nsel = 0; ser = 0; srl = 0; srr = 0; nact = 0;\nvi = 0;\nloop(VOICES_MAX,\n  vv = VOICE_BASE + vi*VOICE_STRIDE;\n  vv[V_ON] ? (\n    voice_tick(vv);\n    sel += vo_dir*vv[V_PANL]; ser += vo_dir*vv[V_PANR];\n    srl += vo_res*vv[V_PANL]; srr += vo_res*vv[V_PANR];\n    nact += 1;\n  );\n  vi += 1;\n);\n\n// coupler and resonator\n(rs == 0 || rs == 2) ? (\n  xl = sel + res_amt*(srl - sel); xr = ser + res_amt*(srr - ser);\n  xl = bq(BIQ_COEF + 5, BIQ_STATE + 4, bq(BIQ_COEF, BIQ_STATE, xl));\n  xr = bq(BIQ_COEF + 5, BIQ_STATE + 12, bq(BIQ_COEF, BIQ_STATE + 8, xr));\n) : (\n  xl = bq(BIQ_COEF + 5, BIQ_STATE + 4, bq(BIQ_COEF, BIQ_STATE, sel));\n  xr = bq(BIQ_COEF + 5, BIQ_STATE + 12, bq(BIQ_COEF, BIQ_STATE + 8, ser));\n  xm = 0.5*(xl + xr); xm2 = xm - bx2; bx2 = bx1; bx1 = xm;\n  bl = 0; br_ = 0; p = BODY_BASE;\n  loop(body_n, y = p[0]*p[2] - p[1]*p[3] + p[4]*xm2; p[3] = p[2]; p[2] = y; bl += y*p[5]; br_ += y*p[6]; p += BODY_STRIDE;);\n  xl += res_amt*(3*bl - xl); xr += res_amt*(3*br_ - xr);\n);\n\n// radiator\no = BIQ_COEF + 10;\nyl = bq(o + 10, BIQ_STATE + 36, bq(o + 5, BIQ_STATE + 32, bq(o, BIQ_STATE + 28, xl)));\nyr = bq(o + 10, BIQ_STATE + 48, bq(o + 5, BIQ_STATE + 44, bq(o, BIQ_STATE + 40, xr)));\nrd == 0 ? (\n  yl = tanh_(1.3*yl)/1.3; yr = tanh_(1.3*yr)/1.3;\n) : rd == 1 ? (\n  // soundboard: four allpass diffusers per side spread the sound out\n  dl = yl; dr = yr; dk = 0;\n  loop(4,\n    bufd = DIFF_BASE + dk*DIFF_LEN; w = DIFF_W[dk];\n    z = bufd[(w - DIFF_TMP[dk] + DIFF_LEN) % DIFF_LEN];\n    u = dl + 0.6*z; bufd[w] = u; dl = z - 0.6*u;\n    DIFF_W[dk] = (w + 1) % DIFF_LEN;\n    bufd = DIFF_BASE + (dk + 4)*DIFF_LEN; w = DIFF_W[dk + 4];\n    z = bufd[(w - DIFF_TMP[dk + 4] + DIFF_LEN) % DIFF_LEN];\n    u = dr + 0.6*z; bufd[w] = u; dr = z - 0.6*u;\n    DIFF_W[dk + 4] = (w + 1) % DIFF_LEN;\n    dk += 1;\n  );\n  yl = 0.6*yl + 0.55*dl; yr = 0.6*yr + 0.55*dr;\n) : rd == 2 ? (\n  hm = 0.5*(yl + yr); hm2 = hm - hx2; hx2 = hx1; hx1 = hm;\n  hl = 0; hr = 0; p = HEAD_BASE;\n  loop(HEAD_MAX, y = p[0]*p[2] - p[1]*p[3] + p[4]*hm2; p[3] = p[2]; p[2] = y; hl += y*p[5]; hr += y*p[6]; p += 8;);\n  yl += 2*hl; yr += 2*hr;\n) : (\n  yl = tanh_(2*yl)*0.5; yr = tanh_(2*yr)*0.5;\n);\n\n// age make-up gain (see update_globals)\ngl = out_g*trem*master_trim*age_gain;\nyl *= gl; yr *= gl;\n// safety limiter: instant attack, slow release, only acts above -3 dBFS\nsab = max(abs(yl), abs(yr));\nlim_env = sab > lim_env ? sab : lim_env*lim_rel;\nlim_g = lim_env > 0.7 ? 0.7/lim_env : 1;\nyl *= lim_g; yr *= lim_g;\n// soft ceiling\nsab = abs(yl); sab > 0.9 ? yl = sign(yl)*(0.9 + 0.1*tanh_((sab - 0.9)*10));\nsab = abs(yr); sab > 0.9 ? yr = sign(yr)*(0.9 + 0.1*tanh_((sab - 0.9)*10));\nspl0 = yl; spl1 = yr;\nvis_lvl = max(abs(yl), vis_lvl*vis_dec);\nSCOPE_BUF[scope_w] = 0.5*(yl + yr); scope_w = (scope_w + 1) & (SCOPE_LEN - 1);\n\n@serialize\n// The window's own preferences, kept with the project (ADR 0023): the\n// interface size and Reduce Motion. Nothing the sound reads is here, and the\n// sliders are saved by REAPER as before. An older project has neither and\n// reads back as 100% with motion on.\nfile_var(0, ui_zoom);\nfile_var(0, calm);\n(ui_zoom != 1.25 && ui_zoom != 1.5 && ui_zoom != 2) ? ui_zoom = 1;\ncalm = calm > 0.5;\n\n@gfx 940 720\n\n// ---- one scale for every size in the window: Retina (ADR 0021) times the\n// interface size chosen under Options (ADR 0023)\nui_zoom < 1 ? ui_zoom = 1;\n// A size the window cannot hold is drawn as large as the window allows (the\n// layout needs 800 x 480 points at 100%), never below 100%: nothing is pushed\n// off the window, which cannot scroll. Options still ticks the size chosen,\n// and it comes back when the window is made larger (final sweep, ADR 0023).\nret_ = max(1, gfx_ext_retina);\nzoom_fit = max(1, min(ui_zoom, min(gfx_w/(800*ret_), gfx_h/(480*ret_))));\ngsc = ret_*zoom_fit;\n// Reduce Motion stills the sounding element's tremble\ncalm ? anim_ph = 0 : ( anim_ph += 0.3; anim_ph > 628.3 ? anim_ph -= 628.3; );\ngw = gfx_w; gh = gfx_h;\n\n// ---- colours (0xRRGGBB). Every word is at least 7:1 on what it sits on\n// (ADR 0023); tools/hig_check.py measures each one on the real pixels.\nC_WIN = 0x1B1C20; C_TILE = 0x25262D; C_TILE_HOV = 0x30333D; C_PREV = 0x212228; C_SUNK = 0x17181C;\nC_BTN = 0x2E303B; C_BTN_HOV = 0x404552; C_ON = 0x2B4C80; C_EDGE = 0x6D7581; C_SEG = 0x1C1D21; C_MAT_HOV = 0x3D424F;\nC_POP = 0x30323C;    // the picker: a raised surface, lighter than the window (ADR 0024)\nC_CTX = 0x5C626E;    // the rest of the instrument behind a part in the picker\nT_MAIN = 0xF2F2F7;   // names, values, button labels: 11:1 or more\nT_BODY = 0xCCD1DE;   // descriptions and messages: 10:1 on the close-up\nT_DIM = 0xB0B6C0;    // secondary words on the window and the close-up: 7.8:1 or more\nT_LABEL = 0xC4C9D2;  // captions and control names on a label, cell or the picker: 7.6:1 even hovered\nT_HINT = 0x8CD999;   // the hint and a control's value in the close-up: 9.4:1\nT_AGE = 0xF5B48A;    // the age note: 9.5:1\nT_ELEM = 0x7FD8F5; T_RES = 0x8EE29A;  // a material's name, in its group's hue: 7.8:1 hovered\nC_RING = 0xF2F4F7;   // the keyboard focus ring\n// edges (final sweep): C_EDGE outlines every button, label and control\n// cell, 3.7:1 on the window; C_TRACK outlines what sits inside a cell (a\n// slider's track, Play Mode's two halves), 3.5:1 on the cell even hovered\nC_TRACK = 0x80879A;\nfunction col(c) ( gfx_set(((c >> 16) & 255)/255, ((c >> 8) & 255)/255, (c & 255)/255, 1); );\n// an outline in colour c, inside (x, y, w, h), thicker at larger sizes\nfunction edge(c, x, y, w, h) local(k)\n(\n  col(c); k = 0;\n  loop(max(1, floor(gsc + 0.5)), gfx_rect(x + k, y + k, w - 2*k, h - 2*k, 0); k += 1;);\n);\n// a filled rectangle with round corners (antialiased)\nfunction rfill(x, y, w, h, r) local(rr)\n(\n  rr = floor(min(r, 0.5*min(w, h)));\n  rr < 1 ? gfx_rect(x, y, w, h, 1) : (\n    gfx_rect(x + rr, y, w - 2*rr, h, 1);\n    gfx_rect(x, y + rr, rr, h - 2*rr, 1); gfx_rect(x + w - rr, y + rr, rr, h - 2*rr, 1);\n    gfx_circle(x + rr, y + rr, rr, 1, 1); gfx_circle(x + w - 1 - rr, y + rr, rr, 1, 1);\n    gfx_circle(x + rr, y + h - 1 - rr, rr, 1, 1); gfx_circle(x + w - 1 - rr, y + h - 1 - rr, rr, 1, 1);\n  );\n);\n// the shape of every button, label and cell: rounded, filled, and edged in\n// ec, 3:1 on the window (final sweep), thicker at larger sizes\nfunction rbox(x, y, w, h, r, fill, ec) local(t)\n(\n  x = floor(x + 0.5); y = floor(y + 0.5); w = floor(w + 0.5); h = floor(h + 0.5);\n  t = max(1, floor(gsc + 0.5));\n  col(ec); rfill(x, y, w, h, r);\n  col(fill); rfill(x + t, y + t, w - 2*t, h - 2*t, max(0, r - t));\n);\ncol(C_WIN); gfx_rect(0, 0, gw, gh, 1);\n\n// ---- the system's own typeface: Segoe UI on Windows, San Francisco on a\n// Mac, else Arial. gfx_getfont names the face actually given, so a missing\n// font is caught rather than guessed. Nothing is under 10 px at 100%.\nfunction pick_font()\n(\n  gfx_setfont(1, \"Segoe UI\", 13, 0); gfx_getfont(#fgot);\n  matchi(\"Segoe UI*\", #fgot) ? ( strcpy(#ui_font, \"Segoe UI\"); font_kind = 1; ) : (\n    gfx_setfont(1, \".AppleSystemUIFont\", 13, 0); gfx_getfont(#fgot);\n    (matchi(\"*System*\", #fgot) || matchi(\"*SF*\", #fgot)) ? ( strcpy(#ui_font, \".AppleSystemUIFont\"); font_kind = 2; ) :\n                                                           ( strcpy(#ui_font, \"Arial\"); font_kind = 3; );\n  );\n  font_ready = 1;\n);\n!font_ready ? pick_font();\ngfx_setfont(1, #ui_font, 13*gsc);\ngfx_setfont(2, #ui_font, 15*gsc, 'b');\ngfx_setfont(3, #ui_font, 19*gsc, 'b');\ngfx_setfont(4, #ui_font, 10*gsc, 'b');\ngfx_setfont(5, #ui_font, 19*gsc, 'b');\n\nclicked = (mouse_cap & 1) && !(last_cap & 1);\nlast_cap = mouse_cap;\nwheel = mouse_wheel; mouse_wheel = 0;\nhov = -1; hovc = -1; focc = -1;\n// one key a frame; Tab, Return, Space, the arrows, Delete and Esc are used\nkey = gfx_getchar(); key < 0 ? key = 0;\nclicked ? focus_id = 0;     // pointing takes over from the keyboard\nfl_n = 0; fr_on = 0; wrap_cut = 0;   // lines of a wrapped text that did not fit (none should)\nhig_audit ? HIG_TXT[0] = 0;\n// While the picker is open it has the mouse and the keyboard to itself: a\n// click anywhere else only closes it (ADR 0024). inbox() and focusable()\n// below ignore everything else while ui_block is set.\nui_block = pop_c >= 0;\npclick = clicked; pwheel = wheel;\n// A preset or Surprise Me replaces the whole instrument. The frame that asks\n// for it adds a REAPER undo point (sliderchange(-1) from @gfx); this one makes\n// the change and adds another, so Edit -> Undo puts back the instrument as it\n// was, controls included (final sweep, ADR 0023).\nwant_preset || want_rand ? (\n  want_preset ? apply_preset(want_preset - 1) : randomise();\n  sliderchange(-1); want_preset = 0; want_rand = 0;\n);\n\nfunction inbox(x, y, w, h) ( !ui_block && mouse_x >= x && mouse_x < x + w && mouse_y >= y && mouse_y < y + h; );\n// the same for the picker, which is not blocked by itself\nfunction pinbox(x, y, w, h) ( mouse_x >= x && mouse_x < x + w && mouse_y >= y && mouse_y < y + h; );\n\n// ---- keyboard focus (ADR 0023). Every control registers itself as it is\n// drawn, so Tab and Shift+Tab move through them in the order they are drawn:\n// top to bottom, then the parts in the order the energy flows. While the\n// picker is open only its own controls take part (ids 70 and up). The ring is\n// drawn last, over everything, round the focused control.\nfunction focusable(id, x, y, w, h) local(p)\n(\n  (ui_block && id < 70) ? 0 : (\n    fl_n < FOCUS_MAX ? ( p = FOCUS_TAB + fl_n*5; p[0] = id; p[1] = x; p[2] = y; p[3] = w; p[4] = h; fl_n += 1; );\n    focus_id == id ? ( fr_on = 1; fr_x = x; fr_y = y; fr_w = w; fr_h = h; );\n    focus_id == id;\n  );\n);\n// Return or Space presses the focused control\nfunction activated(id) ( (focus_id == id && (key == 13 || key == 32)) ? ( key = 0; 1; ) : 0; );\n\n// a button 28 px tall, never narrower than its label. On (Playing\u00e2\u0080\u00a6), it is\n// blue and has a bar under its label, so colour is not the only sign.\nfunction bwidth(s) local(tw, th) ( gfx_setfont(2); gfx_measurestr(s, tw, th); max(72*gsc, tw + 28*gsc); );\nfunction button(id, x, y, w, h, s, on) local(hv, tw, th, f)\n(\n  f = focusable(id, x, y, w, h);\n  hv = id >= 70 ? pinbox(x, y, w, h) : inbox(x, y, w, h);\n  // (inside the picker the edge is the lighter grey, 3:1 on its raised surface)\n  rbox(x, y, w, h, 6*gsc, on ? C_ON : hv ? C_BTN_HOV : C_BTN, id >= 70 ? C_TRACK : C_EDGE);\n  gfx_setfont(2); col(T_MAIN);\n  gfx_measurestr(s, tw, th); gfx_x = x + 0.5*(w - tw); gfx_y = y + 0.5*(h - th) - (on ? gsc : 0); say(s);\n  on ? gfx_rect(x + 0.5*(w - tw), y + h - 5*gsc, tw, max(1, 2*gsc), 1);\n  (hv && (id >= 70 ? pclick : clicked)) || activated(id);\n);\n// the four kinds of part have a colour each: energy and exciter orange, the\n// element blue, resonator, coupler and radiator green, the controls purple\nfunction group_hex(c) ( c <= 1 ? 0xF29940 : c <= 3 ? 0x59CCF2 : c <= 7 ? 0x73D980 : 0xB88CF2; );\nfunction group_col(c) ( col(group_hex(c)); );\n// the material category (3 or 5) that a part is made of, or -1\nfunction mat_cat(c) ( c == 2 ? 3 : (c == 4 || c == 6 || c == 7) ? 5 : -1; );\nfunction is_metal(m) ( m <= 4 || m == 25 || m >= 27; );\n// A part's colour in the drawing: its group's, turning towards rust as Age\n// goes up when it is made of a material (metals most), as the pictures did\n// (ADR 0018). Every shade stays 3:1 or more on the window.\nfunction part_col(c) local(h, r, g, b, m, a)\n(\n  h = group_hex(c); r = ((h >> 16) & 255)/255; g = ((h >> 8) & 255)/255; b = (h & 255)/255;\n  m = mat_cat(c);\n  (m >= 0 && age_ > 0.02) ? (\n    m = slider(m + 1)|0; a = age_*(is_metal(m) ? 0.8 : 0.45);\n    r += a*(0.80 - r); g += a*(0.50 - g); b += a*(0.33 - b);\n  );\n  gfx_set(r, g, b, 1);\n);\n// a part's kind in title style, for the picker's heading\nfunction cat_name(c)\n(\n  c==0?\"Energy Source\" : c==1?\"Exciter\" : c==2?\"Vibrating Element\" : c==3?\"Element Material\" :\n  c==4?\"Resonator\" : c==5?\"Resonator Material\" : c==6?\"Coupler\" : c==7?\"Radiator\" :\n  c==8?\"Frequency Control\" : c==9?\"Tuning Mechanism\" : c==10?\"Damping\" : \"Modulation / Control\";\n);\n// the 31 materials, for a part made of one, opened at (mx, my)\nfunction mat_menu(mc, mx, my) local(k, r)\n(\n  strcpy(#menu, \"\"); k = 0;\n  loop(MAT_N, k > 0 ? strcat(#menu, \"|\"); (slider(mc + 1)|0) == k ? strcat(#menu, \"!\"); strcat(#menu, mat_name(k)); k += 1;);\n  gfx_x = mx; gfx_y = my;\n  r = gfx_showmenu(#menu);\n  r > 0 ? set_part(mc, r - 1);\n);\n\n// ---- the drawing (ADR 0024): the segments built by wf_build, drawn with\n// antialiased lines that grow with the interface size\nfunction wline(x1, y1, x2, y2, t) local(dx, dy, l, nx, ny, n, o, s)\n(\n  dx = x2 - x1; dy = y2 - y1; l = max(0.001, sqrt(dx*dx + dy*dy)); nx = -dy/l; ny = dx/l;\n  n = max(1, floor(t + 0.5)); s = t/n; o = -0.5*(n - 1)*s;\n  loop(n, gfx_line(x1 + nx*o, y1 + ny*o, x2 + nx*o, y2 + ny*o, 1); o += s;);\n);\n// an edge hidden behind the part, dashed; the dashes carry on round a curve\nfunction wdash(x1, y1, x2, y2, t) local(dx, dy, l, on, per, a, m, sl, n)\n(\n  (abs(x1 - wd_lx) > 0.5 || abs(y1 - wd_ly) > 0.5) ? wd_ph = 0;\n  dx = x2 - x1; dy = y2 - y1; l = sqrt(dx*dx + dy*dy); on = 4*gsc; per = 7*gsc; a = 0; n = 0;\n  // (every step moves at least a hundredth of a pixel, so rounding can't stall it)\n  while (a < l - 0.01 && n < 1000) (\n    m = wd_ph - floor(wd_ph/per)*per;\n    m < on - 0.01 ? (\n      sl = min(on - m, l - a);\n      wline(x1 + dx*a/l, y1 + dy*a/l, x1 + dx*(a + sl)/l, y1 + dy*(a + sl)/l, t);\n    ) : sl = min(per - m, l - a);\n    sl = max(sl, 0.01); a += sl; wd_ph += sl; n += 1;\n  );\n  wd_lx = x2; wd_ly = y2;\n);\n// keep the part of (x0, y0)-(x1, y1) inside a box (Liang-Barsky): 1 if any is\nfunction wclip(x0, y0, x1, y1, xa, ya, xb, yb) local(t0, t1, dx, dy, p, q, r, k, ok)\n(\n  t0 = 0; t1 = 1; dx = x1 - x0; dy = y1 - y0; ok = 1; k = 0;\n  loop(4,\n    p = k == 0 ? -dx : k == 1 ? dx : k == 2 ? -dy : dy;\n    q = k == 0 ? x0 - xa : k == 1 ? xb - x0 : k == 2 ? y0 - ya : yb - y0;\n    p == 0 ? ( q < 0 ? ok = 0; ) : (\n      r = q/p;\n      p < 0 ? ( r > t1 ? ok = 0 : r > t0 ? t0 = r; ) : ( r < t0 ? ok = 0 : r < t1 ? t1 = r; );\n    );\n    k += 1;\n  );\n  ok ? ( wcx0 = x0 + t0*dx; wcy0 = y0 + t0*dy; wcx1 = x0 + t1*dx; wcy1 = y0 + t1*dy; );\n  ok;\n);\n// Draw buf at scale s from (ox, oy). The instrument (one < 0): every part in\n// its colour, part hl heavier, the element trembling while it sounds. The\n// picker (one = a part): that part in its colour and the rest faint, clipped\n// to the cell.\nfunction wf_draw(buf, s, ox, oy, hl, one, xa, ya, xb, yb) local(n, p, c, x1, y1, x2, y2, t, u1, u2, ok)\n(\n  n = buf[0]; p = buf + 1; wd_lx = -1000000;\n  loop(n,\n    c = p[4]; x1 = p[0]; y1 = p[1]; x2 = p[2]; y2 = p[3];\n    (one < 0 && c == 2 && wf_vib != 0) ? (\n      u1 = max(0, min(1, (x1 - wm_ex0)/max(1, wm_ex1 - wm_ex0))); u2 = max(0, min(1, (x2 - wm_ex0)/max(1, wm_ex1 - wm_ex0)));\n      y1 += wf_vib*sin($pi*u1); y2 += wf_vib*sin($pi*u2);\n    );\n    x1 = ox + s*x1; y1 = oy + s*y1; x2 = ox + s*x2; y2 = oy + s*y2;\n    ok = one < 0 ? 1 : wclip(x1, y1, x2, y2, xa, ya, xb, yb);\n    one >= 0 && ok ? ( x1 = wcx0; y1 = wcy0; x2 = wcx1; y2 = wcy1; );\n    ok ? (\n      one >= 0 ? ( c == one ? part_col(c) : col(C_CTX); t = (c == one ? 1.6 : 1)*gsc; ) :\n                 ( part_col(c); t = (c == hl ? 2.4 : 1.4)*gsc; );\n      p[5] ? wdash(x1, y1, x2, y2, t) : ( wline(x1, y1, x2, y2, t); wd_lx = -1000000; );\n    );\n    p += 6;\n  );\n);\n// the part whose lines pass within r px of the mouse, or -1\nfunction wf_hit(buf, s, ox, oy, r) local(n, p, best, bc, x1, y1, dx, dy, t, ex, ey, d)\n(\n  n = buf[0]; p = buf + 1; best = r*r; bc = -1;\n  loop(n,\n    x1 = ox + s*p[0]; y1 = oy + s*p[1]; dx = s*(p[2] - p[0]); dy = s*(p[3] - p[1]);\n    t = max(0, min(1, ((mouse_x - x1)*dx + (mouse_y - y1)*dy)/max(0.0001, dx*dx + dy*dy)));\n    ex = x1 + t*dx - mouse_x; ey = y1 + t*dy - mouse_y; d = ex*ex + ey*ey;\n    d < best ? ( best = d; bc = p[4]; );\n    p += 6;\n  );\n  bc;\n);\n// each part's anchor for its label's line: its own point nearest the middle\n// of its side facing the label's row (target at +12, +13; anchor to +4, +5)\nfunction wf_anchors(buf, s, ox, oy) local(n, p, c, q, x, y, d, j)\n(\n  c = 0; loop(12, CAT_TAB[c*CAT_STRIDE + 14] = 1000000000; c += 1;);\n  n = buf[0]; p = buf + 1;\n  loop(n,\n    q = CAT_TAB + p[4]*CAT_STRIDE; j = 0;\n    loop(2,\n      x = ox + s*p[j*2]; y = oy + s*p[j*2 + 1];\n      d = 0.15*(x - q[12])*(x - q[12]) + (y - q[13])*(y - q[13]);\n      d < q[14] ? ( q[14] = d; q[4] = x; q[5] = y; );\n      j += 1;\n    );\n    p += 6;\n  );\n);\n\n// ---- the labels round the drawing. Each part's label sits above the drawing\n// (row 0) or below it (row 1), as near over its part as the others allow,\n// with a line to the part. lv says how much each label holds when a row is\n// short of room: 0 the full caption, 1 a short one, 2 a short one and the\n// name in the smaller font, 3 no caption. A name is never cut short.\nLAB_ORD = WF_AUX + 2470;\nfunction lab_rows() local(c)\n(\n  c = 0; loop(12, CAT_TAB[c*CAT_STRIDE + 6] = -1; c += 1;);\n  c = 0;\n  loop(12,\n    (c != 3 && c != 5) ? CAT_TAB[c*CAT_STRIDE + 6] =\n      wm_mode == 0 ? ((c == 0 || c == 1 || c == 9 || c == 8 || c == 10) ? 0 : 1) :\n                     ((c == 0 || c == 1 || c == 9 || c == 2 || c == 10 || (c == 8 && (slider(9)|0) != 4)) ? 0 : 1);\n    c += 1;\n  );\n);\nfunction lab_w(c, lv) local(tw, th, w, mc)\n(\n  w = 0;\n  lv < 3 ? ( gfx_setfont(4); gfx_measurestr(lv == 0 ? cat_title(c) : cat_short(c), tw, th); w = tw; );\n  gfx_setfont(lv < 2 ? 2 : 1); gfx_measurestr(opt_name(c, slider(c + 1)|0), tw, th); w = max(w, tw);\n  mc = mat_cat(c); mc >= 0 ? ( gfx_setfont(1); gfx_measurestr(mat_name(slider(mc + 1)|0), tw, th); w = max(w, tw); );\n  ceil(w + 24*gsc);\n);\nfunction row_w(row, lv) local(c, s, n)\n(\n  s = 0; n = 0; c = 0;\n  loop(12, CAT_TAB[c*CAT_STRIDE + 6] == row ? ( s += lab_w(c, lv); n += 1; ); c += 1;);\n  s + max(0, n - 1)*12*gsc;\n);\nfunction lab_place(row, y, lv, lh) local(n, i, j, c, t, x, mr, q)\n(\n  n = 0; c = 0;\n  loop(12, CAT_TAB[c*CAT_STRIDE + 6] == row ? ( LAB_ORD[n] = c; n += 1; ); c += 1;);\n  // in order of their anchors, left to right\n  i = 1;\n  loop(max(0, n - 1),\n    t = LAB_ORD[i]; j = i - 1;\n    while (j >= 0 && CAT_TAB[LAB_ORD[j]*CAT_STRIDE + 4] > CAT_TAB[t*CAT_STRIDE + 4]) ( LAB_ORD[j + 1] = LAB_ORD[j]; j -= 1; );\n    LAB_ORD[j + 1] = t; i += 1;\n  );\n  x = pad; i = 0;\n  loop(n,\n    q = CAT_TAB + LAB_ORD[i]*CAT_STRIDE;\n    q[8] = lab_w(LAB_ORD[i], lv); q[7] = max(x, floor(q[4] - 0.5*q[8])); q[9] = y; q[10] = lh;\n    x = q[7] + q[8] + 12*gsc; i += 1;\n  );\n  mr = gw - pad; i = n - 1;\n  loop(n, q = CAT_TAB + LAB_ORD[i]*CAT_STRIDE; q[7] + q[8] > mr ? q[7] = mr - q[8]; mr = q[7] - 12*gsc; i -= 1;);\n);\n// open the picker for part c (kb: from the keyboard, so its focus goes in)\nfunction pop_open(c, kb) ( pop_c = c; pop_kb = kb; focus_id = kb ? 70 + (slider(c + 1)|0) : 0; wf_optc = -1; );\n// one label: a coloured tab, the kind of part, the option and (for parts\n// made of one) the material. Click for the picker; scroll to step (over the\n// material: step the material). From the keyboard: Return or Space opens the\n// picker, the arrow keys step.\nfunction label(c, lv) local(q, x, y, w, h, v, mc, m, f, hv, onm, tw, th, tx, ty, s, t1, t2, t4, bh, on)\n(\n  q = CAT_TAB + c*CAT_STRIDE; x = q[7]; y = q[9]; w = q[8]; h = q[10];\n  v = slider(c + 1)|0; mc = mat_cat(c); on = c == hl;\n  f = focusable(10 + c, x, y, w, h); f ? focc = c;\n  hv = inbox(x, y, w, h);\n  rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, on ? group_hex(c) : C_EDGE);\n  // the tab: longer on the part lit up in the drawing\n  group_col(c); rfill(x + 10*gsc, y + 4*gsc, on ? w - 20*gsc : 18*gsc, 3*gsc, 1.5*gsc);\n  gfx_setfont(4); gfx_measurestr(\"A\", tw, t4); gfx_setfont(lv < 2 ? 2 : 1); gfx_measurestr(\"A\", tw, t2); gfx_setfont(1); gfx_measurestr(\"A\", tw, t1);\n  bh = (lv < 3 ? t4 + gsc : 0) + t2 + (mc >= 0 ? t1 : 0);\n  tx = x + 12*gsc; ty = y + 9*gsc + 0.5*(h - 14*gsc - bh);\n  lv < 3 ? ( gfx_setfont(4); col(T_LABEL); gfx_x = tx; gfx_y = ty; say(lv == 0 ? cat_title(c) : cat_short(c)); ty += t4 + gsc; );\n  gfx_setfont(lv < 2 ? 2 : 1); col(T_MAIN); gfx_x = tx; gfx_y = ty; say(opt_name(c, v)); ty += t2;\n  onm = 0;\n  mc >= 0 ? (\n    m = slider(mc + 1)|0; s = mat_name(m); gfx_setfont(1); gfx_measurestr(s, tw, th);\n    onm = inbox(tx - 4*gsc, ty, tw + 8*gsc, t1); onm ? hov = mc;\n    col(mc == 3 ? T_ELEM : T_RES); gfx_x = tx; gfx_y = ty; say(s);\n  );\n  hv && clicked ? pop_open(c, 0);\n  hv && wheel != 0 ? (\n    onm ? set_part(mc, (m + (wheel > 0 ? MAT_N - 1 : 1)) % MAT_N) :\n          set_part(c, (v + (wheel > 0 ? cat_count(c) - 1 : 1)) % cat_count(c));\n  );\n  f ? (\n    (key == 'rght' || key == 'down') ? ( key = 0; set_part(c, (v + 1) % cat_count(c)); ) :\n    (key == 'left' || key == 'up') ? ( key = 0; set_part(c, (v + cat_count(c) - 1) % cat_count(c)); );\n    activated(10 + c) ? pop_open(c, 1);\n  );\n);\n// strings the picker covers can't be seen: the test host's audit forgets them\nfunction hig_forget(x, y, w, h) local(n, i, j, k, p, q)\n(\n  n = HIG_TXT[0]; i = 0; j = 0;\n  loop(n,\n    p = HIG_TXT + 1 + i*8;\n    (p[3] + p[5] > x && p[3] < x + w && p[4] + p[6] > y && p[4] < y + h) ? 0 : (\n      q = HIG_TXT + 1 + j*8; k = 0; loop(8, q[k] = p[k]; k += 1;); j += 1;\n    );\n    i += 1;\n  );\n  HIG_TXT[0] = j;\n);\n// The picker (ADR 0024): every option of a part, each drawn on this\n// instrument, beside its label. Click one (or Return on it) to use it; it\n// stays open so you can play and compare. Done, Esc or a click elsewhere\n// closes it. For a part made of a material, a menu of the 31 materials.\nfunction chooser() local(c, n, mc, v, cols, rows, cw, chh, g, ip, hh, pw, ph, px, py, q, i, cx, cy, fi, hvc, on, tx0, ty0, tx1, ty1, bw, bh, s, ox, oy, tw, th, my, mw, k, inside, dw)\n(\n  c = pop_c; n = cat_count(c); mc = mat_cat(c); v = slider(c + 1)|0;\n  cols = min(3, n); rows = ceil(n/cols);\n  cw = 132*gsc; chh = 92*gsc; g = 12*gsc; ip = 16*gsc; hh = 28*gsc;\n  pw = cols*cw + (cols - 1)*g + 2*ip;\n  ph = ip + hh + g + rows*chh + (rows - 1)*g + (mc >= 0 ? g + hh : 0) + ip;\n  q = CAT_TAB + c*CAT_STRIDE;\n  px = floor(max(pad, min(gw - pad - pw, q[7] + 0.5*q[8] - 0.5*pw)));\n  py = q[6] == 0 ? q[9] + q[10] + 8*gsc : q[9] - 8*gsc - ph;\n  py = floor(max(pad, min(gh - pad - ph, py)));\n  hig_audit ? hig_forget(px, py, pw, ph);\n  // a soft shadow, then the raised surface\n  k = 3; loop(3, gfx_set(0, 0, 0, 0.12); rfill(px - k*gsc, py - k*gsc + 3*gsc, pw + 2*k*gsc, ph + 2*k*gsc, (10 + k)*gsc); k -= 1;);\n  rbox(px, py, pw, ph, 10*gsc, C_POP, C_EDGE);\n  gfx_setfont(2); col(T_MAIN); gfx_measurestr(cat_name(c), tw, th);\n  gfx_x = px + ip; gfx_y = py + ip + 0.5*(hh - th); say(cat_name(c));\n  dw = bwidth(\"Done\");\n  button(81, px + pw - ip - dw, py + ip, dw, hh, \"Done\", 0) ? ( pop_c = -1; focus_id = pop_kb && focus_id > 0 ? 10 + c : 0; );\n  pop_hv = -1;\n  i = 0;\n  loop(n,\n    cx = px + ip + (i % cols)*(cw + g); cy = py + ip + hh + g + floor(i/cols)*(chh + g);\n    fi = focusable(70 + i, cx, cy, cw, chh);\n    hvc = pinbox(cx, cy, cw, chh);\n    (hvc || fi) ? pop_hv = i;\n    on = i == v;\n    rbox(cx, cy, cw, chh, 8*gsc, hvc ? C_TILE_HOV : C_TILE, on ? group_hex(c) : C_TRACK);\n    // the option, drawn on this instrument, framed on its part\n    tx0 = cx + 8*gsc; ty0 = cy + 8*gsc; tx1 = cx + cw - 8*gsc; ty1 = cy + chh - 30*gsc;\n    bw = max(WF_OBB[i*4 + 2] - WF_OBB[i*4] + 40, 120); bh = max(WF_OBB[i*4 + 3] - WF_OBB[i*4 + 1] + 30, 64);\n    s = min((tx1 - tx0)/bw, (ty1 - ty0)/bh);\n    ox = 0.5*(tx0 + tx1) - s*0.5*(WF_OBB[i*4] + WF_OBB[i*4 + 2]); oy = 0.5*(ty0 + ty1) - s*0.5*(WF_OBB[i*4 + 1] + WF_OBB[i*4 + 3]);\n    wf_draw(WF_OPT + i*WF_OPT_STRIDE, s, ox, oy, -1, c, tx0, ty0, tx1, ty1);\n    gfx_setfont(1); col(T_MAIN); gfx_measurestr(opt_name(c, i), tw, th);\n    gfx_x = cx + 0.5*(cw - tw); gfx_y = cy + chh - 25*gsc; say(opt_name(c, i));\n    // the one in use: an edge in its colour and a bar under its name\n    on ? ( col(T_MAIN); gfx_rect(floor(cx + 0.5*(cw - tw)), floor(cy + chh - 25*gsc + th) + gsc, tw, max(1, floor(1.5*gsc)), 1); );\n    (ui_block && hvc && pclick) || activated(70 + i) ? set_part(c, i);\n    i += 1;\n  );\n  // the arrow keys move between the options\n  (focus_id >= 70 && focus_id < 70 + n) ? (\n    i = focus_id - 70;\n    key == 'rght' ? ( key = 0; i = min(n - 1, i + 1); ) : key == 'left' ? ( key = 0; i = max(0, i - 1); ) :\n    key == 'down' ? ( key = 0; i = min(n - 1, i + cols); ) : key == 'up' ? ( key = 0; i = max(0, i - cols); );\n    focus_id = 70 + i;\n  );\n  mc >= 0 ? (\n    my = py + ip + hh + g + rows*chh + (rows - 1)*g + g;\n    gfx_setfont(1); col(T_LABEL); gfx_measurestr(\"Made of\", tw, th);\n    gfx_x = px + ip; gfx_y = my + 0.5*(hh - th); say(\"Made of\");\n    cx = px + ip + tw + 12*gsc;\n    gfx_measurestr(mat_name(slider(mc + 1)|0), tw, th); mw = max(130*gsc, tw + 40*gsc);\n    fi = focusable(80, cx, my, mw, hh); hvc = pinbox(cx, my, mw, hh);\n    rbox(cx, my, mw, hh, 6*gsc, hvc ? C_BTN_HOV : C_BTN, C_TRACK);\n    col(T_MAIN); gfx_x = cx + 12*gsc; gfx_y = my + 0.5*(hh - th); say(mat_name(slider(mc + 1)|0));\n    tx0 = cx + mw - 20*gsc; ty0 = my + 0.5*hh;\n    gfx_triangle(tx0, ty0 - 2*gsc, tx0 + 8*gsc, ty0 - 2*gsc, tx0 + 4*gsc, ty0 + 2*gsc);\n    (ui_block && hvc && pclick) || activated(80) ? mat_menu(mc, cx, my + hh);\n    (c == 6 || c == 7) ? (\n      gfx_measurestr(\"Shared with the resonator\", tw, th);\n      cx + mw + 12*gsc + tw <= px + pw - ip ? ( col(T_LABEL); gfx_x = cx + mw + 12*gsc; gfx_y = my + 0.5*(hh - th); say(\"Shared with the resonator\"); );\n    );\n  );\n  pop_x = px; pop_y = py; pop_w = pw; pop_h = ph;\n  // a click outside closes it (and does nothing else)\n  inside = pinbox(px, py, pw, ph);\n  ui_block && pclick && !inside ? pop_c = -1;\n);\n\n// ---- the eleven controls (sliders 13-23, control k is slider 13 + k). They\n// are hidden from REAPER's slider list (which would sit above the window and\n// take its height) and drawn here; they stay automatable.\nfunction ctl_title(k)\n(\n  k==0?\"Force\":k==1?\"Size\":k==2?\"Brightness\":k==3?\"Decay\":k==4?\"Excite Position\":k==5?\"Resonator Amount\":\n  k==6?\"Play Mode\":k==7?\"Glide Time\":k==8?\"Fine Tune\":k==9?\"Output\":\"Age / Rust\";\n);\nfunction ctl_desc(k)\n(\n  k==0?\"How hard it is blown, bowed or struck.\":\n  k==1?\"Scales the resonator, coupler and radiator: bigger is lower and boomier.\":\n  k==2?\"Lets the high frequencies ring longer (right) or die faster (left).\":\n  k==3?\"A longer or shorter ring, without changing anything else.\":\n  k==4?\"Where the exciter touches: near the end (thin, bright) or towards the middle (full, round).\":\n  k==5?\"How much of the resonator you hear against the bare vibrating element.\":\n  k==6?\"Poly plays chords. Mono (Legato) plays one note at a time, so frets, tone holes, valves and slides change pitch the way they do on the real thing.\":\n  k==7?\"How long a Slide takes to reach the next note.\":\n  k==8?\"Moves the whole instrument up or down, by up to a semitone.\":\n  k==9?\"The overall level.\":\n  \"How old and neglected it is, from new to found in a skip: duller, shorter, out of tune, rattly and leaky. Applies from the next note.\";\n);\nfunction ctl_short(k) ( k==4?\"Position\":k==5?\"Resonator\":k==7?\"Glide\":k==10?\"Age\":ctl_title(k); );\n// the widest value a control can show, so a row can be laid out once\nfunction ctl_widest(k) ( k==2?\"+100\":k==4?\"50%\":k==6?\"\":k==7?\"1000 ms\":k==8?\"+100 cents\":k==9?\"-36.0 dB\":\"400%\"; );\n// can every control in a row show its short name and its widest value side\n// by side in cells w wide? (k0, n: the row is controls k0 .. k0+n-1, 6 meaning Age)\nfunction ctl_row_fits(k0, n, w) local(j, k, a, b, th, ok)\n(\n  gfx_setfont(1); ok = 1; j = 0;\n  loop(n, k = k0 + j; k == 6 && k0 == 0 ? k = 10;\n    gfx_measurestr(ctl_short(k), a, th); gfx_measurestr(ctl_widest(k), b, th);\n    a + b + 26*gsc > w ? ok = 0; j += 1;);\n  ok;\n);\nfunction ctl_min(k) ( k==1?25:k==2?-100:k==3?10:k==4?2:k==7?5:k==8?-100:k==9?-36:0; );\nfunction ctl_max(k) ( k==1?400:k==3?400:k==4?50:k==6?1:k==7?1000:k==9?12:100; );\nfunction ctl_def(k) ( k==0?70:k==1?100:k==3?100:k==4?20:k==5?50:k==7?120:0; );\n// log controls: the value at the middle of the track (0 = linear)\nfunction ctl_mid(k) ( k==1?100:k==3?100:k==7?150:0; );\nfunction ctl_step(k) ( k==9?0.1:1; );\n// the part whose colour the control takes\nfunction ctl_part(k) ( k==0?0:k==1?4:k==2?2:k==3?10:k==4?1:k==5?4:k==6?11:k==7?8:k==8?9:k==9?7:2; );\nfunction ctl_col(k) ( k == 10 ? gfx_set(0.85, 0.5, 0.3, 1) : group_col(ctl_part(k)); );\nfunction ctl_pos(k, v) local(a, b, m)\n(\n  a = ctl_min(k); b = ctl_max(k); m = ctl_mid(k);\n  m > 0 ? ( v <= m ? 0.5*log(v/a)/log(m/a) : 0.5 + 0.5*log(v/m)/log(b/m); ) : (v - a)/(b - a);\n);\nfunction ctl_val(k, p) local(a, b, m, s, v)\n(\n  a = ctl_min(k); b = ctl_max(k); m = ctl_mid(k); s = ctl_step(k);\n  p = max(0, min(1, p));\n  v = m > 0 ? ( p <= 0.5 ? a*(m/a)^(2*p) : m*(b/m)^(2*p - 1); ) : a + p*(b - a);\n  max(a, min(b, floor(v/s + 0.5)*s));\n);\n// one step of the wheel or an arrow key (z = +1 or -1), finer with Shift\nfunction ctl_nudge(k, v, z, fine) local(d)\n(\n  ctl_mid(k) > 0 ? ( d = ctl_val(k, ctl_pos(k, v) + z*(fine ? 0.005 : 0.02)); d == v ? d = v + z*ctl_step(k); ) :\n                   d = v + z*(fine ? ctl_step(k) : max(ctl_step(k), floor(0.02*(ctl_max(k) - ctl_min(k)) + 0.5)));\n  d;\n);\nfunction ctl_text(k) local(v)\n(\n  v = slider(13 + k);\n  k == 6 ? strcpy(#cv, v >= 0.5 ? \"Mono\" : \"Poly\") :\n  k == 7 ? sprintf(#cv, \"%d ms\", v) :\n  k == 8 ? sprintf(#cv, v > 0 ? \"+%d cents\" : \"%d cents\", v) :\n  k == 9 ? sprintf(#cv, v > 0.04 ? \"+%.1f dB\" : \"%.1f dB\", v) :\n  k == 2 ? sprintf(#cv, v > 0 ? \"+%d\" : \"%d\", v) :\n  sprintf(#cv, \"%d%%\", v);\n  #cv;\n);\nfunction set_ctl(k, v)\n(\n  v = max(ctl_min(k), min(ctl_max(k), v));\n  slider(13 + k) = v;\n  slider_automate(2^(12 + k));\n  gui_dirty = 1; last_cat = 100 + k;\n);\n// one control, 44 px tall: drag the track (Shift for fine steps), roll the\n// wheel, double-click to reset; Play mode is a two-way switch. From the\n// keyboard: the arrow keys step (Shift finer), Delete resets, and Return or\n// Space flips Play mode. The name is never cut short: with vin the value\n// sits beside it, else at the end of the track, and the name has the width.\nfunction control(k, x, y, w, h, vin) local(v, p, hv, x0, x1, ty, hx, tw, th, tw1, tw2, z, s, d, f, segy, segh, sw_, on, vw)\n(\n  v = slider(13 + k);\n  f = focusable(40 + k, x, y, w, h); f ? focc = 100 + k;\n  hv = inbox(x, y, w, h) && drag_k < 0; hv ? hovc = k;\n  rbox(x, y, w, h, 6*gsc, hv || drag_k == k ? C_TILE_HOV : C_TILE, C_EDGE);\n  ctl_col(k); rfill(floor(x + 4*gsc), floor(y + 9*gsc), max(2, floor(3*gsc)), floor(h - 18*gsc), 1.5*gsc);\n  gfx_setfont(1);\n  s = ctl_text(k); gfx_measurestr(s, tw, th); k == 6 ? tw = 0;\n  gfx_measurestr(ctl_widest(k), vw, th);\n  // the full name where it fits, else the short one\n  gfx_measurestr(ctl_title(k), tw1, th); gfx_measurestr(ctl_short(k), tw2, th);\n  col(T_LABEL); gfx_x = x + 10*gsc; gfx_y = y + 6*gsc;\n  say(tw1 + (vin ? vw + 26*gsc : 20*gsc) <= w ? ctl_title(k) : ctl_short(k));\n  x0 = x + 12*gsc; x1 = x + w - 12*gsc; ty = y + h - 13*gsc;\n  k != 6 ? (\n    col(T_MAIN);\n    vin ? ( gfx_x = x + w - 9*gsc - tw; gfx_y = y + 6*gsc; ) :\n          ( x1 -= vw + 8*gsc; gfx_x = x + w - 9*gsc - tw; gfx_y = ty - 0.5*th; );\n    say(s);\n  );\n  k == 6 ? (\n    // Poly | Mono: the chosen half is blue, its word white and underlined\n    segy = y + 23*gsc; segh = h - 27*gsc; sw_ = 0.5*(x1 - x0) - 2*gsc;\n    z = 0;\n    loop(2,\n      d = x0 + z*0.5*(x1 - x0); on = (v >= 0.5) == z;\n      rbox(d, segy, sw_, segh, 4*gsc, on ? C_ON : C_SEG, C_TRACK);\n      gfx_setfont(4); col(on ? T_MAIN : T_DIM);\n      s = z ? \"MONO\" : \"POLY\"; gfx_measurestr(s, tw, th);\n      // (clear of the half's edge, which sits on whole pixels)\n      wy_ = floor(segy + 0.5) + max(1, floor(gsc + 0.5)) + 0.5*gsc;\n      gfx_x = d + 0.5*(sw_ - tw); gfx_y = wy_; say(s);\n      // (on whole pixels below the word's box, whatever the size)\n      on ? gfx_rect(d + 0.5*(sw_ - tw), ceil(wy_ + th) + floor(0.5*gsc), tw, max(1, floor(1.5*gsc)), 1);\n      z += 1;\n    );\n    hv && clicked ? set_ctl(k, mouse_x >= x + 0.5*w);\n    hv && wheel != 0 ? set_ctl(k, v < 0.5);\n  ) : (\n    p = ctl_pos(k, v); hx = x0 + p*(x1 - x0);\n    col(C_SUNK); gfx_rect(x0, ty - 2*gsc, x1 - x0, 4*gsc, 1);\n    edge(C_TRACK, x0, ty - 2*gsc, x1 - x0, 4*gsc);\n    ctl_col(k);\n    // bipolar controls fill from the middle\n    d = (k == 2 || k == 8) ? 0.5*(x0 + x1) : x0;\n    gfx_rect(min(d, hx), ty - 2*gsc, abs(hx - d), 4*gsc, 1);\n    col(T_MAIN); gfx_circle(hx, ty, (hv || drag_k == k ? 6 : 5)*gsc, 1, 1);\n    hv && clicked ? (\n      (time_precise() - ctl_t < 0.35 && ctl_last == k) ? (\n        set_ctl(k, ctl_def(k)); ctl_t = 0;\n      ) : (\n        ctl_t = time_precise(); ctl_last = k;\n        // clicking away from the handle moves it there first\n        (abs(mouse_x - hx) > 8*gsc && !(mouse_cap & 8)) ? ( p = max(0, min(1, (mouse_x - x0)/(x1 - x0))); set_ctl(k, ctl_val(k, p)); );\n        drag_k = k; drag_p = drag_p0 = p; drag_x0 = mouse_x; drag_sh = (mouse_cap & 8) > 0;\n        // a drag is as fine as the whole cell is wide, even with the value at the end of the track\n        drag_w = w - 24*gsc;\n      );\n    );\n    hv && wheel != 0 ? set_ctl(k, ctl_nudge(k, v, wheel > 0 ? 1 : -1, (mouse_cap & 8) > 0));\n  );\n  f ? (\n    z = (key == 'rght' || key == 'up') ? 1 : (key == 'left' || key == 'down') ? -1 : 0;\n    z != 0 ? ( key = 0; set_ctl(k, k == 6 ? z > 0 : ctl_nudge(k, v, z, (mouse_cap & 8) > 0)); );\n    k == 6 ? ( activated(40 + k) ? set_ctl(k, v < 0.5); ) :\n             ( (key == 8 || key == 'del') ? ( key = 0; set_ctl(k, ctl_def(k)); ); );\n  );\n);\n// More / Less, at the end of the first row of controls\nfunction more_button(x, y, w, h) local(hv, f, tw, th, s, tx, ty)\n(\n  f = focusable(60, x, y, w, h);\n  hv = inbox(x, y, w, h) && drag_k < 0;\n  rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, C_EDGE);\n  s = more_ctl ? \"Less\" : \"More\";\n  gfx_setfont(1); col(T_BODY); gfx_measurestr(s, tw, th);\n  gfx_x = x + 0.5*(w - tw) - 6*gsc; gfx_y = y + 0.5*(h - th); say(s);\n  tx = gfx_x + 6*gsc; ty = y + 0.5*h;\n  more_ctl ? gfx_triangle(tx, ty + 2*gsc, tx + 8*gsc, ty + 2*gsc, tx + 4*gsc, ty - 2*gsc) :\n             gfx_triangle(tx, ty - 2*gsc, tx + 8*gsc, ty - 2*gsc, tx + 4*gsc, ty + 2*gsc);\n  ((hv && clicked) || activated(60)) ? more_ctl = !more_ctl;\n);\n\n// ---- header: the instrument's name and the buttons, all at the top (Apple:\n// nothing that matters along a window's bottom edge, which can end up off\n// the screen). REAPER's title bar already says \"Instrument Creator\".\npad = 12*gsc; bh_ = 28*gsc; bgap = 12*gsc;\n// is this still the chosen preset, or has a part been changed (here or by automation)?\ncur_preset >= 0 ? ( k = 0; pm = PRESET_TAB + cur_preset*PRESET_STRIDE; loop(12, (slider(k + 1)|0) != pm[k] ? cur_preset = -1; k += 1;); );\nwP = bwidth(\"Presets\"); wS = bwidth(\"Surprise Me\"); wA = max(bwidth(\"Play C4\"), bwidth(\"Playing\u00e2\u0080\u00a6\")); wO = bwidth(\"Options\");\nbws = wP + wS + wA + wO + 3*bgap;\nnm_ = cur_preset >= 0 ? preset_name(cur_preset) : \"Your Own Instrument\";\ngfx_setfont(3); gfx_measurestr(nm_, nw_, nh_);\n// one row while the name and the buttons fit side by side, else two\none_row = pad + nw_ + 24*gsc + bws + pad <= gw;\nbxx = one_row ? gw - pad - bws : pad; byy = one_row ? pad : pad + max(nh_, bh_) + 8*gsc;\nnw_ > gw - 2*pad ? gfx_setfont(2);\ncol(T_MAIN); gfx_x = pad; gfx_y = pad + 0.5*(bh_ - nh_); say(nm_);\nnmr = one_row ? bxx - 24*gsc : gw - pad;\n// the age note, shortened (or left out) when it would run under the buttons\nage_ > 0 ? (\n  gfx_setfont(1);\n  sprintf(#agestr, age_ < 0.34 ? \"  (a little worn: age %d%%)\" : age_ < 0.67 ? \"  (old and rusty: age %d%%)\" : \"  (found in a skip: age %d%%)\", age_*100);\n  gfx_measurestr(#agestr, aw_, ah_); gfx_x + aw_ > nmr ? sprintf(#agestr, \"  (age %d%%)\", age_*100);\n  gfx_measurestr(#agestr, aw_, ah_); gfx_y = pad + 0.5*(bh_ - ah_);\n  gfx_x + aw_ <= nmr ? ( col(T_AGE); say(#agestr); );\n);\nbutton(1, bxx, byy, wP, bh_, \"Presets\", 0) ? (\n  strcpy(#menu, \"\"); k = 0;\n  loop(PRESET_N, k > 0 ? strcat(#menu, \"|\"); k == cur_preset ? strcat(#menu, \"!\"); strcat(#menu, preset_name(k)); k += 1;);\n  strcat(#menu, \"||#Edit \u00e2\u0086\u0092 Undo Puts Your Instrument Back\");\n  gfx_x = bxx; gfx_y = byy + bh_;\n  r = gfx_showmenu(#menu);\n  r > 0 && r <= PRESET_N ? ( sliderchange(-1); want_preset = r; );\n);\nbxx += wP + bgap;\nbutton(2, bxx, byy, wS, bh_, \"Surprise Me\", 0) ? ( sliderchange(-1); want_rand = 1; );\nbxx += wS + bgap;\nbutton(3, bxx, byy, wA, bh_, aud_on ? \"Playing\u00e2\u0080\u00a6\" : \"Play C4\", aud_on) ? ( aud_note = 60; aud_req = 1; );\nbxx += wA + bgap;\nbutton(4, bxx, byy, wO, bh_, \"Options\", 0) ? (\n  sprintf(#menu, \"%sInterface Size 100%%|%sInterface Size 125%%|%sInterface Size 150%%|%sInterface Size 200%%||%sReduce Motion\",\n          ui_zoom == 1 ? \"!\" : \"\", ui_zoom == 1.25 ? \"!\" : \"\", ui_zoom == 1.5 ? \"!\" : \"\", ui_zoom == 2 ? \"!\" : \"\", calm ? \"!\" : \"\");\n  // a size the window cannot hold says so, greyed, at the end (it takes no number)\n  zoom_fit < ui_zoom - 0.005 ? ( sprintf(#zf, \"||#Shown at %d%% Until the Window Is Larger\", floor(100*zoom_fit + 0.5)); strcat(#menu, #zf); );\n  gfx_x = bxx; gfx_y = byy + bh_;\n  r = gfx_showmenu(#menu);\n  r >= 1 && r <= 4 ? ui_zoom = (r == 1 ? 1 : r == 2 ? 1.25 : r == 3 ? 1.5 : 2);\n  r == 5 ? calm = !calm;\n);\ntop_ = byy + bh_;\n\n// ---- the controls: the seven that shape the sound, then More, which shows\n// the four that are usually set once (play mode, glide, fine tune, output).\n// Cells 44 px tall and 12 apart; they wrap onto more rows when the window is\n// narrow for the interface size.\ncth = 44*gsc; cgp = 12*gsc; cty = top_ + 12*gsc; cw_all = gw - 2*pad;\ngfx_setfont(1); gfx_measurestr(\"More\", tww, thh); mbw = max(64*gsc, tww + 34*gsc);\n// a cell is never narrower than its short name needs, with the value at the\n// end of the track\ncmin = 86*gsc; j = 0;\nloop(11, gfx_measurestr(ctl_short(j), tww, thh); cmin = max(cmin, tww + 20*gsc); j += 1;);\ncpr = max(1, min(7, floor((cw_all - mbw)/(cmin + cgp))));\ncw2 = (cw_all - mbw - cgp - (cpr - 1)*cgp)/cpr;\nvin1 = ctl_row_fits(0, 7, cw2);\nj = 0;\nloop(7,\n  control(j < 6 ? j : 10, pad + (j % cpr)*(cw2 + cgp), cty + floor(j/cpr)*(cth + cgp), cw2, cth, vin1);\n  j == min(cpr, 7) - 1 ? more_button(gw - pad - mbw, cty, mbw, cth);\n  j += 1;\n);\ny2 = cty + ceil(7/cpr)*(cth + cgp);\nmore_ctl ? (\n  cpr2 = max(1, min(4, floor((cw_all + cgp)/(cmin + cgp)))); cw3 = (cw_all - (cpr2 - 1)*cgp)/cpr2; j = 0;\n  vin2 = ctl_row_fits(6, 4, cw3);\n  loop(4, control(6 + j, pad + (j % cpr2)*(cw3 + cgp), y2 + floor(j/cpr2)*(cth + cgp), cw3, cth, vin2); j += 1;);\n  y2 += ceil(4/cpr2)*(cth + cgp);\n);\n// a drag carries on wherever the mouse goes, until the button is let go\ndrag_k >= 0 ? (\n  (mouse_cap & 1) ? (\n    dsh = (mouse_cap & 8) > 0;\n    dsh != drag_sh ? ( drag_p0 = drag_p; drag_x0 = mouse_x; drag_sh = dsh; );\n    drag_p = max(0, min(1, drag_p0 + (mouse_x - drag_x0)/drag_w*(dsh ? 0.1 : 1)));\n    dv = ctl_val(drag_k, drag_p); dv != slider(13 + drag_k) ? set_ctl(drag_k, dv);\n  ) : (\n    slider_automate(2^(12 + drag_k), 1); drag_k = -1;\n  );\n);\n\n// ---- the instrument (ADR 0024): one drawing of the whole thing, built again\n// whenever a part changes (here, by a preset or by automation)\nk = 0; wf_dirty = !wf_built; loop(12, (slider(k + 1)|0) != WF_LAST[k] ? wf_dirty = 1; k += 1;);\nwf_dirty ? (\n  k = 0; loop(12, WF_P[k] = WF_LAST[k] = slider(k + 1)|0; k += 1;);\n  wf_build(WF_GEO); wm_ex0 = el_x0; wm_ex1 = el_x1; wm_mode = wf_mode;\n  k = 0; loop(12, wf_bbox(WF_GEO, k); q = CAT_TAB + k*CAT_STRIDE; q[0] = wbx0; q[1] = wby0; q[2] = wbx1; q[3] = wby1; k += 1;);\n  wf_built = 1; wf_optc = -1;\n);\n// the picker's drawings: the instrument once per option of its part\npop_c >= 0 && wf_optc != pop_c ? (\n  i = 0;\n  loop(cat_count(pop_c),\n    k = 0; loop(12, WF_P[k] = slider(k + 1)|0; k += 1;); WF_P[pop_c] = i;\n    wf_build(WF_OPT + i*WF_OPT_STRIDE); wf_bbox(WF_OPT + i*WF_OPT_STRIDE, pop_c);\n    WF_OBB[i*4] = wbx0; WF_OBB[i*4 + 1] = wby0; WF_OBB[i*4 + 2] = wbx1; WF_OBB[i*4 + 3] = wby1;\n    i += 1;\n  );\n  wf_optc = pop_c;\n);\n\n// where everything goes: the labels' rows, the drawing between them, and the\n// close-up under them while there is room for it (it gives way first)\nax = pad; aw = gw - 2*pad;\ngfx_setfont(4); gfx_measurestr(\"A\", tww, t4_); gfx_setfont(2); gfx_measurestr(\"A\", tww, t2_); gfx_setfont(1); gfx_measurestr(\"A\", tww, t1_);\n// (a fixed height, so 200% is 100% doubled; taller only if a font needs it)\nlh_ = max(ceil(62*gsc), ceil(14*gsc + t4_ + gsc + t2_ + t1_));\nlty = y2;\navail = gh - pad - lty;\nph_ = max(124*gsc, 0.24*avail);\nprev_on = avail - (2*lh_ + 28*gsc + 110*gsc) - 12*gsc >= ph_;\npy_ = gh - pad - ph_;\nlby = prev_on ? py_ - 12*gsc - lh_ : gh - pad - lh_;\ndtop = lty + lh_ + 14*gsc; dbot = lby - 14*gsc;\n// the drawing's own space is 900 x 360. What it reaches (measured over\n// 20,000 random instruments) is shown, so the scale stays the same whatever\n// the parts, and changes only between the two builds\nwm_mode == 0 ? ( WX0 = 0; WY0 = 56; WX1 = 906; WY1 = 356; ) : ( WX0 = 20; WY0 = 4; WX1 = 915; WY1 = 358; );\nws_ = max(0.05, min(aw/(WX1 - WX0), (dbot - dtop)/(WY1 - WY0)));\nwox = ax + 0.5*(aw - ws_*(WX1 + WX0)); woy = dtop + 0.5*(dbot - dtop) - ws_*0.5*(WY0 + WY1);\nlab_rows();\nk = 0;\nloop(12,\n  q = CAT_TAB + k*CAT_STRIDE;\n  q[12] = wox + ws_*0.5*(q[0] + q[2]); q[13] = q[6] == 0 ? dtop : dbot;\n  k += 1;\n);\nwf_anchors(WF_GEO, ws_, wox, woy);\nlv_ = 0;\nwhile (lv_ < 3 && (row_w(0, lv_) > aw + 0.5 || row_w(1, lv_) > aw + 0.5)) ( lv_ += 1; );\nlab_place(0, lty, lv_, lh_); lab_place(1, lby, lv_, lh_);\n\n// what the mouse is over: a label, or a part of the drawing\nk = 0;\nloop(12, q = CAT_TAB + k*CAT_STRIDE; q[6] >= 0 && inbox(q[7], q[9], q[8], q[10]) ? hov = k; k += 1;);\nwhit = (!ui_block && hov < 0 && drag_k < 0 && inbox(ax, dtop - 8*gsc, aw, dbot - dtop + 16*gsc)) ? wf_hit(WF_GEO, ws_, wox, woy, 7*gsc) : -1;\nwhit >= 0 ? hov = whit;\n// the part shown in the close-up and lit up in the drawing: the picker's, the\n// focused, the hovered, else the last changed\npfoc = (focus_id >= 10 && focus_id < 22) ? focus_id - 10 : -1;\npc0 = pop_c >= 0 ? pop_c : pfoc >= 0 ? pfoc : hov >= 0 ? hov : last_cat;\nhl = pc0 >= 100 ? -1 : pc0 == 3 ? 2 : pc0 == 5 ? 4 : pc0;\n// the sounding element trembles (Reduce Motion holds anim_ph at 0, which stills it)\nwf_vib = min(4, 30*vis_lvl)*sin(anim_ph);\nwf_draw(WF_GEO, ws_, wox, woy, hl, -1, 0, 0, 0, 0);\n// a click on a part opens its picker; scrolling over it steps it\nwhit >= 0 && clicked ? pop_open(whit, 0);\nwhit >= 0 && wheel != 0 ? set_part(whit, ((slider(whit + 1)|0) + (wheel > 0 ? cat_count(whit) - 1 : 1)) % cat_count(whit));\n// each label's line to its part\nk = 0;\nloop(12,\n  q = CAT_TAB + k*CAT_STRIDE;\n  q[6] >= 0 ? (\n    sx = floor(q[7] + 0.5*q[8]) + 0.5; sy = q[6] == 0 ? q[9] + q[10] : q[9]; my_ = q[6] == 0 ? sy + 6*gsc : sy - 6*gsc;\n    k == hl ? group_col(k) : col(C_EDGE);\n    wline(sx, sy, sx, my_, (k == hl ? 1.5 : 1)*gsc); wline(sx, my_, q[4], q[5], (k == hl ? 1.5 : 1)*gsc);\n    col(T_DIM); gfx_circle(q[4], q[5], 2.5*gsc, 1, 1);\n  );\n  k += 1;\n);\n// the labels, in the order the energy flows (so Tab goes that way too)\nlabel(0, lv_); label(1, lv_); label(2, lv_); label(6, lv_); label(4, lv_); label(7, lv_);\nlabel(8, lv_); label(9, lv_); label(10, lv_); label(11, lv_);\n\n// ---- the close-up of the part or control in hand: the picker's (the option\n// under the mouse or the focus), the focused, the hovered, else the last changed\npc = pop_c >= 0 ? pop_c : focus_id > 0 && focc >= 0 ? focc : hov >= 0 ? hov : drag_k >= 0 ? 100 + drag_k : hovc >= 0 ? 100 + hovc : last_cat;\nprev_on ? (\n  col(C_PREV); rfill(ax, py_, aw, ph_, 8*gsc);\n  v = pc >= 100 ? 0 : slider(pc + 1)|0;\n  pop_c >= 0 && pop_hv >= 0 ? v = pop_hv;\n  sw = aw > 560*gsc ? min(200*gsc, 0.22*aw) : 0;\n  tx = ax + 18*gsc; tw2 = aw - 36*gsc - (sw > 0 ? sw + 16*gsc : 0);\n  wrap_ymax = py_ + ph_ - 6*gsc;\n  // the kind, with a dot in its colour\n  pc >= 100 ? ctl_col(pc - 100) : group_col(pc); gfx_circle(tx + 3*gsc, py_ + 16*gsc, 3*gsc, 1, 1);\n  gfx_setfont(4); col(T_DIM); gfx_x = tx + 12*gsc; gfx_y = py_ + 10*gsc; say(pc >= 100 ? \"CONTROL\" : cat_title(pc));\n  gfx_setfont(5); col(T_MAIN); gfx_x = tx; gfx_y = py_ + 24*gsc;\n  pc >= 100 ? (\n    say(ctl_title(pc - 100)); say(\"   \"); col(T_HINT); say(ctl_text(pc - 100));\n  ) : (\n    say(opt_name(pc, v));\n    mat_cat(pc) >= 0 ? ( say(\"   \"); col(pc == 2 ? T_ELEM : T_RES); say(mat_name(slider(mat_cat(pc) + 1)|0)); );\n  );\n  gfx_setfont(1); col(T_BODY);\n  yy = draw_wrapped(pc >= 100 ? ctl_desc(pc - 100) : opt_desc(pc, v), tx, py_ + 52*gsc, tw2, 17*gsc);\n  // how to use it: with the mouse, or (when the keyboard is in use) the keys\n  strcpy(#info,\n    pop_c >= 0 ? (focus_id > 0 ? \"The arrow keys move between them; Return uses one; Esc closes.\" :\n                                 \"Click one to use it, then play to hear it. Click Done when you\u00e2\u0080\u0099re finished.\") :\n    focus_id > 0 ? (pc >= 100 ? (pc == 106 ? \"Return or the arrow keys switch it.\" : \"The arrow keys change it (hold Shift for small steps); Delete resets it.\") :\n                                \"Return shows every choice; the arrow keys step through them.\") :\n    pc >= 100 ? (pc == 106 ? \"Click either side to choose.\" : \"Drag to change it (hold Shift for small steps), scroll, or double-click to reset.\") :\n    (pc == 3 || pc == 5) ? \"Scroll over it to step through the materials.\" :\n                           \"Click it, or its name, to see every choice; scroll over it to step through them.\");\n  wlim = wrap_ymax; wrap_ymax = -1; hy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); wrap_ymax = wlim;\n  hy <= wrap_ymax ? ( col(T_DIM); yy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); );\n  // the coupler decides how the instrument is built\n  pc == 6 ? (\n    strcpy(#info, v >= 2 ? (v == 2 ? \"Built in a line: the mouthpiece joins the parts end to end, like a wind instrument.\" :\n                                     \"Built in a line: the windway joins the parts end to end, like a wind instrument.\") :\n                           (v == 0 ? \"Built in layers: the bridge holds the element over the body, like a guitar or a marimba.\" :\n                                     \"Built in layers: the soundpost holds the element over the body, like a guitar or a marimba.\"));\n    wlim = wrap_ymax; wrap_ymax = -1; hy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); wrap_ymax = wlim;\n    hy <= wrap_ymax ? ( col(T_DIM); yy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); );\n  );\n  (pc == 3 || pc == 5) ? (\n    t60 = mat_t60(v, 440);\n    ee = mat(v, M_E);\n    ee >= 1 ? sprintf(#stf, \"%g GPa\", ee) : ee >= 0.001 ? sprintf(#stf, \"%g MPa\", ee*1000) : sprintf(#stf, \"%g kPa\", ee*1000000);\n    t60 >= 1 ? sprintf(#rng, \"%.1f s\", t60) : sprintf(#rng, \"%d ms\", t60*1000);\n    sprintf(#info, \"Stiffness %s, density %d kg/m\u00c2\u00b3. A 440 Hz ring lasts about %s.\", #stf, mat(v, M_RHO), #rng);\n    wlim = wrap_ymax; wrap_ymax = -1; hy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); wrap_ymax = wlim;\n    hy <= wrap_ymax ? ( col(T_DIM); yy = draw_wrapped(#info, tx, yy + 4*gsc, tw2, 17*gsc); );\n  );\n  // the hint only if it fits whole (measure it first by drawing nothing)\n  wlim = wrap_ymax; wrap_ymax = -1; hy = draw_wrapped(combo_hint(), tx, yy + 6*gsc, tw2, 17*gsc); wrap_ymax = wlim;\n  hy <= wrap_ymax ? ( col(T_HINT); yy = draw_wrapped(combo_hint(), tx, yy + 6*gsc, tw2, 17*gsc); );\n  wrap_ymax = 1000000;\n  // what it sounds like right now, in its own column (real audio, so it\n  // moves with Reduce Motion too)\n  sh = min(90*gsc, ph_ - 20*gsc);\n  (sw > 0 && sh > 16*gsc) ? (\n    sx = ax + aw - sw - 12*gsc; sy = py_ + 0.5*(ph_ - sh);\n    col(C_SUNK); rfill(sx, sy, sw, sh, 6*gsc);\n    st0 = (scope_w - 1024 + SCOPE_LEN) & (SCOPE_LEN - 1); k = 0;\n    while (k < 400 && !(SCOPE_BUF[(st0 + k) & (SCOPE_LEN - 1)] <= 0 && SCOPE_BUF[(st0 + k + 1) & (SCOPE_LEN - 1)] > 0)) ( k += 1; );\n    st0 += k; sc_ = 0.45*sh/max(0.05, vis_lvl);\n    gfx_set(0.45, 0.9, 0.6, 1); k = 0;\n    loop(sw - 1,\n      y0 = SCOPE_BUF[(st0 + floor(k*512/sw)) & (SCOPE_LEN - 1)]; y1 = SCOPE_BUF[(st0 + floor((k + 1)*512/sw)) & (SCOPE_LEN - 1)];\n      j = 0; loop(max(1, floor(gsc + 0.5)), gfx_line(sx + k, sy + 0.5*sh - y0*sc_ + j, sx + k + 1, sy + 0.5*sh - y1*sc_ + j, 1); j += 1;);\n      k += 1;\n    );\n  );\n);\n\n// ---- the picker, over everything\npop_c >= 0 ? chooser();\n\n// ---- the keyboard: Tab and Shift+Tab move the focus, Esc closes the picker,\n// then lets the focus go. The controls above have already taken Return,\n// Space, the arrows and Delete.\nkey == 9 ? (\n  fl_n > 0 ? (\n    cur = -1; i = 0;\n    loop(fl_n, FOCUS_TAB[i*5] == focus_id ? cur = i; i += 1;);\n    (mouse_cap & 8) ? ( cur = cur <= 0 ? fl_n - 1 : cur - 1; ) : ( cur = cur < 0 ? 0 : (cur + 1) % fl_n; );\n    focus_id = FOCUS_TAB[cur*5];\n  );\n) : key == 27 ? (\n  pop_c >= 0 ? ( focus_id = focus_id > 0 ? 10 + pop_c : 0; pop_c = -1; ) : focus_id = 0;\n);\n// the focus ring, near-white and two pixels thick, drawn over everything\nfr_on && focus_id > 0 ? (\n  col(C_RING); k = 0;\n  loop(max(2, floor(2*gsc + 0.5)), gfx_roundrect(floor(fr_x - 3*gsc) - k, floor(fr_y - 3*gsc) - k, floor(fr_w + 6*gsc) + 2*k, floor(fr_h + 6*gsc) + 2*k, floor(9*gsc) + k, 0); k += 1;);\n);\n"};

/* ---- kit/runtime/jsfx.js ---- */
/* Middaw's JSFX runtime: the family's REAPER plug-ins, run unchanged.
 *
 * A JSFX file is a header (sliders, pins, imports) and sections of EEL2 code:
 * @init, @slider, @block, @sample, @serialize and @gfx. This file reads the
 * header, compiles the EEL2 in each section to JavaScript, and runs it the way
 * REAPER does: @init once, @slider when a slider moves, then for every block
 * @block once and @sample once per sample frame. MIDI arrives through
 * midirecv() and leaves through midisend() with its sample offset.
 *
 * @gfx is not run by default: Middaw draws each device's controls itself from
 * the sliders, so a device looks like the rest of the app. With
 * `{ gfx: true }` it is compiled too, and `runGfx(host, ...)` runs it: every
 * gfx_* call goes to the host, which draws (the Ableton devices' [v8ui]).
 *
 * Everything in EEL2 is a double. Variables live in one Float64Array, so the
 * generated code reads `v[12]`; memory (`buf[i]`) is EEL2's 8M words, given
 * out in 64k-word blocks only when written to, as EEL2 itself does.
 */
(function (NS) {
  'use strict';

  var EPS = 0.00001;
  var MAXLOOP = 1048576;
  var BLOCK = 65536, NBLOCKS = 128;

  // ------------------------------------------------------------ header ----
  function parseSliderLine(line) {
    var m = /^slider(\d+):(?:([A-Za-z_][\w.]*)=)?\s*([^<]*?)\s*<([^>]*)>(.*)$/.exec(line);
    if (!m) return null;
    var inner = m[4], enumNames = null;
    var em = /\{([^}]*)\}/.exec(inner);
    if (em) { enumNames = em[1].split(','); inner = inner.replace(em[0], ''); }
    var shape = null, sm = /:(log|sqr)(?:=([^,>]*))?/.exec(inner);
    if (sm) { shape = { kind: sm[1], value: sm[2] === undefined ? null : Number(sm[2]) }; inner = inner.replace(sm[0], ''); }
    var parts = inner.split(',').map(function (s) { return s.trim(); });
    var desc = m[5].trim();
    var hidden = desc[0] === '-';
    if (hidden) desc = desc.slice(1);
    return {
      index: Number(m[1]), variable: (m[2] || ('slider' + m[1])).toLowerCase(),
      def: Number(m[3]) || 0, min: Number(parts[0]) || 0, max: parts[1] === undefined ? 1 : Number(parts[1]),
      step: parts[2] === undefined || parts[2] === '' ? 0 : Number(parts[2]),
      names: enumNames, shape: shape, name: desc, hidden: hidden
    };
  }

  // A JSFX file and its imports -> header and sections.
  function parseFile(text, readImport) {
    var out = { desc: '', sliders: [], inPins: [], outPins: [], options: '', sections: {}, gfxSize: null };
    var order = ['init', 'slider', 'block', 'sample', 'serialize', 'gfx'];
    order.forEach(function (s) { out.sections[s] = []; });
    function take(src, isImport) {
      var lines = src.replace(/\r\n?/g, '\n').split('\n');
      var section = null, buf = [], startLine = 0;
      function flush() {
        if (section && out.sections[section]) out.sections[section].push({ code: buf.join('\n'), line: startLine });
        buf = [];
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var sm = /^@(\w+)(.*)$/.exec(line);
        if (sm) {
          flush();
          section = sm[1].toLowerCase();
          startLine = i + 2;
          if (section === 'gfx') {
            var sz = sm[2].trim().split(/\s+/).map(Number);
            if (sz.length >= 2 && !out.gfxSize) out.gfxSize = [sz[0], sz[1]];
          }
          continue;
        }
        if (section) { buf.push(line); continue; }
        var t = line.trim();
        if (/^desc:/.test(t)) { if (!isImport || !out.desc) out.desc = t.slice(5).trim(); }
        else if (/^slider\d+:/.test(t)) { var s = parseSliderLine(t); if (s) out.sliders.push(s); }
        else if (/^in_pin:/.test(t)) out.inPins.push(t.slice(7).trim());
        else if (/^out_pin:/.test(t)) out.outPins.push(t.slice(8).trim());
        else if (/^options:/.test(t)) out.options += ' ' + t.slice(8).trim();
        else if (/^import\s+/.test(t)) {
          var name = t.replace(/^import\s+/, '').trim();
          var inc = readImport ? readImport(name) : null;
          if (inc === null || inc === undefined) throw new Error('JSFX import not found: ' + name);
          take(inc, true);
        }
      }
      flush();
    }
    take(text, false);
    out.sliders.sort(function (a, b) { return a.index - b.index; });
    out.inPins = out.inPins.filter(function (p) { return p !== 'none'; });
    out.outPins = out.outPins.filter(function (p) { return p !== 'none'; });
    return out;
  }

  // ------------------------------------------------------------- lexer ----
  var OPS = ['===', '!==', '<<=', '>>=', '==', '!=', '<=', '>=', '<<', '>>', '&&', '||',
    '+=', '-=', '*=', '/=', '%=', '^=', '|=', '&=', '~=',
    '+', '-', '*', '/', '%', '^', '<', '>', '!', '&', '|', '~', '?', ':',
    '(', ')', '[', ']', ',', ';', '='];
  var CONSTS = { pi: Math.PI, phi: (1 + Math.sqrt(5)) / 2, e: Math.E };

  function EelError(msg, line) { this.message = (line ? 'line ' + line + ': ' : '') + msg; this.line = line; }
  EelError.prototype = Object.create(Error.prototype);
  EelError.prototype.name = 'EelError';

  // REAPER's strings are bytes: one character per UTF-8 byte, as the C runtime
  // keeps them.
  function bytes(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.codePointAt(i);
      if (c > 0xffff) i++;
      if (c < 0x80) out += String.fromCharCode(c);
      else if (c < 0x800) out += String.fromCharCode(0xc0 | c >> 6, 0x80 | c & 63);
      else if (c < 0x10000) out += String.fromCharCode(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
      else out += String.fromCharCode(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return out;
  }

  function lex(src, firstLine) {
    var toks = [], i = 0, n = src.length, line = firstLine || 1;
    while (i < n) {
      var c = src[i];
      if (c === '\n') { line++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { var j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
      if (c === '/' && src[i + 1] === '*') {
        var k = src.indexOf('*/', i + 2); if (k < 0) k = n;
        for (var q = i; q < k; q++) if (src[q] === '\n') line++;
        i = k + 2; continue;
      }
      if (c === '"') {
        var buf = '', p = i + 1;
        while (p < n && src[p] !== '"') {
          if (src[p] === '\\' && p + 1 < n) {
            var e = src[p + 1];
            buf += e === 'n' ? '\n' : e === 't' ? '\t' : e === 'r' ? '\r' : e; p += 2;
          } else { if (src[p] === '\n') line++; buf += src[p++]; }
        }
        toks.push({ k: 'str', v: bytes(buf), line: line }); i = p + 1; continue;
      }
      if (c === "'") {
        var close = src.indexOf("'", i + 1);
        var val = 0;
        var lit = bytes(src.slice(i + 1, close));
        for (var x = 0; x < lit.length; x++) val = val * 256 + lit.charCodeAt(x);
        toks.push({ k: 'num', v: val, line: line }); i = close + 1; continue;
      }
      if (c === '#') {
        var nm = /^#[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i, i + 200));
        if (nm) { toks.push({ k: 'nstr', v: nm[0].toLowerCase(), line: line }); i += nm[0].length; }
        else { toks.push({ k: 'tmpstr', line: line }); i++; }
        continue;
      }
      if (c === '$') {
        var rest = src.slice(i, i + 64), m;
        if ((m = /^\$x([0-9A-Fa-f]+)/.exec(rest))) { toks.push({ k: 'num', v: parseInt(m[1], 16), line: line }); i += m[0].length; continue; }
        if ((m = /^\$'(.)'/.exec(rest))) { toks.push({ k: 'num', v: m[1].charCodeAt(0), line: line }); i += m[0].length; continue; }
        if ((m = /^\$~(\d+)/.exec(rest))) { toks.push({ k: 'num', v: Math.pow(2, Number(m[1])) - 1, line: line }); i += m[0].length; continue; }
        if ((m = /^\$(pi|phi|e)\b/i.exec(rest))) { toks.push({ k: 'num', v: CONSTS[m[1].toLowerCase()], line: line }); i += m[0].length; continue; }
        throw new EelError('bad $ constant', line);
      }
      var hx = /^0[xX][0-9A-Fa-f]+/.exec(src.slice(i, i + 40));
      if (hx) { toks.push({ k: 'num', v: parseInt(hx[0], 16), line: line }); i += hx[0].length; continue; }
      var num = /^(\d+\.\d*|\.\d+|\d+)/.exec(src.slice(i, i + 64));
      if (num) { toks.push({ k: 'num', v: Number(num[0]), line: line }); i += num[0].length; continue; }
      var id = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i, i + 200));
      if (id) {
        var w = id[0].toLowerCase();
        toks.push({ k: (w === 'function' || w === 'local' || w === 'instance' || w === 'globals' || w === 'global' || w === 'static') ? 'kw' : 'id', v: w, line: line });
        i += id[0].length; continue;
      }
      var op = null;
      for (var o = 0; o < OPS.length; o++) if (src.substr(i, OPS[o].length) === OPS[o]) { op = OPS[o]; break; }
      if (!op) throw new EelError("unexpected '" + c + "'", line);
      toks.push({ k: 'op', v: op, line: line }); i += op.length;
    }
    toks.push({ k: 'eof', line: line });
    return toks;
  }

  // ------------------------------------------------------------ parser ----
  var ASSIGN = { '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1, '^=': 1, '|=': 1, '&=': 1, '~=': 1, '<<=': 1, '>>=': 1 };
  var CMP = { '==': 1, '===': 1, '!=': 1, '!==': 1, '<': 1, '>': 1, '<=': 1, '>=': 1 };

  function parse(toks, funcs) {
    var p = 0;
    function peek() { return toks[p]; }
    function at(k, v) { var t = toks[p]; return t.k === k && (v === undefined || t.v === v); }
    function eat(k, v) { if (at(k, v)) return toks[p++]; return null; }
    function expect(k, v) {
      var t = eat(k, v);
      if (!t) { var q = toks[p]; throw new EelError('expected ' + (v || k) + ', got ' + (q.v !== undefined ? q.v : q.k), q.line); }
      return t;
    }

    function program() {
      var items = [];
      for (;;) {
        while (eat('op', ';')) {}
        if (at('eof')) break;
        if (at('kw', 'function')) { func(); continue; }
        items.push(assign());
        if (!at('op', ';') && !at('eof') && !at('kw', 'function')) {
          var t = peek();
          throw new EelError("missing ';' before " + (t.v !== undefined ? t.v : t.k), t.line);
        }
      }
      return { k: 'seq', items: items };
    }
    function func() {
      var line = expect('kw', 'function').line;
      var name = expect('id').v;
      expect('op', '(');
      var params = [];
      while (!at('op', ')')) { params.push(expect('id').v.replace(/\*$/, '')); eat('op', ','); }
      expect('op', ')');
      var locals = [], instance = [], globals = null;
      while (at('kw')) {
        var kw = toks[p++].v;
        expect('op', '(');
        var list = [];
        while (!at('op', ')')) {
          if (at('op', '*')) { p++; list.push('*'); }
          else list.push(expect('id').v.replace(/\*$/, ''));
          eat('op', ',');
        }
        expect('op', ')');
        if (kw === 'local' || kw === 'static') locals = locals.concat(list);
        else if (kw === 'instance') instance = instance.concat(list);
        else globals = (globals || []).concat(list);
      }
      expect('op', '(');
      var body = block();
      expect('op', ')');
      while (eat('op', ';')) {}
      funcs[name] = { name: name, params: params, locals: locals, instance: instance, globals: globals, body: body, line: line };
    }
    function block() {
      var items = [];
      for (;;) {
        while (eat('op', ';')) {}
        if (at('op', ')') || at('eof')) break;
        if (at('kw', 'function')) { func(); continue; }
        items.push(assign());
        if (!at('op', ';')) break;
      }
      while (eat('op', ';')) {}
      return items.length === 1 ? items[0] : { k: 'seq', items: items };
    }
    function arg() {
      var items = [assign()];
      while (at('op', ';')) {
        p++;
        if (at('op', ')') || at('op', ',')) break;
        items.push(assign());
      }
      return items.length === 1 ? items[0] : { k: 'seq', items: items };
    }
    function assign() {
      var lhs = ternary();
      var t = peek();
      if (t.k === 'op' && ASSIGN[t.v]) {
        p++;
        return { k: 'assign', op: t.v, lhs: lhs, rhs: assign(), line: t.line };
      }
      return lhs;
    }
    function ternary() {
      var c = logic();
      if (eat('op', '?')) {
        var a = at('op', ':') ? { k: 'num', v: 0 } : assign();
        var b = null;
        if (eat('op', ':')) b = assign();
        return { k: 'if', c: c, a: a, b: b };
      }
      return c;
    }
    function logic() {
      var n = cmp();
      while (at('op', '&&') || at('op', '||')) n = { k: 'logic', op: toks[p++].v, a: n, b: cmp() };
      return n;
    }
    function cmp() {
      var n = bit();
      while (peek().k === 'op' && CMP[peek().v]) n = { k: 'bin', op: toks[p++].v, a: n, b: bit() };
      return n;
    }
    function bit() {
      var n = add();
      while (at('op', '|') || at('op', '&') || at('op', '~')) n = { k: 'bin', op: toks[p++].v, a: n, b: add() };
      return n;
    }
    function add() {
      var n = mul();
      while (at('op', '+') || at('op', '-')) n = { k: 'bin', op: toks[p++].v, a: n, b: mul() };
      return n;
    }
    function mul() {
      var n = shift();
      while (at('op', '*') || at('op', '/')) n = { k: 'bin', op: toks[p++].v, a: n, b: shift() };
      return n;
    }
    function shift() {
      var n = mod();
      while (at('op', '<<') || at('op', '>>')) n = { k: 'bin', op: toks[p++].v, a: n, b: mod() };
      return n;
    }
    function mod() {
      var n = pow();
      while (at('op', '%')) { p++; n = { k: 'bin', op: '%', a: n, b: pow() }; }
      return n;
    }
    function pow() {
      var n = unary();
      if (at('op', '^')) { p++; return { k: 'bin', op: '^', a: n, b: pow() }; }
      return n;
    }
    function unary() {
      var t = peek();
      if (t.k === 'op' && (t.v === '!' || t.v === '-' || t.v === '+')) { p++; return { k: 'un', op: t.v, a: unary() }; }
      return postfix();
    }
    function postfix() {
      var n = primary();
      while (at('op', '[')) {
        p++;
        var idx = at('op', ']') ? { k: 'num', v: 0 } : assign();
        expect('op', ']');
        n = { k: 'index', base: n, idx: idx };
      }
      return n;
    }
    function primary() {
      var t = toks[p++];
      switch (t.k) {
        case 'num': return { k: 'num', v: t.v };
        case 'str': return { k: 'strlit', v: t.v };
        case 'nstr': return { k: 'nstr', v: t.v };
        case 'tmpstr': return { k: 'tmpstr', id: p };
        case 'op':
          if (t.v === '(') { var b = block(); expect('op', ')'); return b; }
          break;
        case 'id':
          if (at('op', '(')) {
            p++;
            var args = [];
            while (!at('op', ')')) { args.push(arg()); if (!eat('op', ',')) break; }
            expect('op', ')');
            if ((t.v === 'while' || t.v === 'loop') && at('op', '(')) {
              p++; var body = block(); expect('op', ')');
              args.push(body);
            }
            return { k: 'call', name: t.v, args: args, line: t.line };
          }
          return { k: 'var', name: t.v, line: t.line };
      }
      throw new EelError('unexpected ' + (t.v !== undefined ? t.v : t.k), t.line);
    }
    return program();
  }

  // ---------------------------------------------------------- compiler ----
  // Builtins that are plain maths: name -> JS expression template.
  var MATH = {
    sin: 'Math.sin', cos: 'Math.cos', tan: 'Math.tan', asin: 'Math.asin', acos: 'Math.acos',
    atan: 'Math.atan', atan2: 'Math.atan2', sqrt: 'H.sqrt', exp: 'Math.exp', log: 'Math.log',
    log10: 'Math.log10', abs: 'Math.abs', floor: 'Math.floor', ceil: 'Math.ceil',
    min: 'Math.min', max: 'Math.max', pow: 'Math.pow', sign: 'H.sign', invsqrt: 'H.invsqrt',
    sqr: 'H.sqr', rand: 'H.rand', exp2: 'H.exp2'
  };

  function Compiler(slotsOf) {
    this.slots = slotsOf;          // name -> index into v
    this.funcs = {};
    this.compiledFuncs = {};
    this.funcCode = [];
    this.strConsts = [];
    this.temps = 0;
    this.gfx = false;              // compile gfx_* calls for a host to draw
  }
  Compiler.prototype.slot = function (name) {
    var s = this.slots[name];
    if (s === undefined) { s = this.slots.__count++; this.slots[name] = s; }
    return s;
  };

  Compiler.prototype.compileSection = function (code, firstLine) {
    var ast = parse(lex(code, firstLine), this.funcs);
    var saveTemps = this.temps;
    this.temps = 0;
    var body = this.stmts(ast, null, true, 'r');
    var temps = this.tempDecl();
    this.temps = saveTemps;
    return 'var r = 0;' + temps + body + 'return r;';
  };
  Compiler.prototype.tempDecl = function () {
    if (!this.temps) return '';
    var names = [];
    for (var i = 1; i <= this.temps; i++) names.push('t' + i);
    return 'var ' + names.join(', ') + ';';
  };
  Compiler.prototype.temp = function () { this.temps++; return 't' + this.temps; };

  // Names inside a function: parameters, statics, instance variables, or
  // globals. A function called as ns.f() keeps its instance() variables, and
  // anything it names as this.x, in ns: ns.x (REAPER's pseudo-objects).
  Compiler.prototype.ref = function (name, ctx) {
    if (ctx) {
      var pi = ctx.fn.params.indexOf(name);
      if (pi >= 0) return 'p' + pi;
      if (ctx.fn.locals.indexOf(name) >= 0) return 'v[' + this.slot(ctx.fn.name + '::' + name) + ']';
      if (ctx.fn.instance.indexOf(name) >= 0) return 'v[' + this.slot(ctx.ns ? ctx.ns + '.' + name : name) + ']';
    }
    if (name.indexOf('this.') === 0) return 'v[' + this.slot(resolveThis(name, ctx)) + ']';
    return 'v[' + this.slot(name) + ']';
  };
  // this.x, this.child.x: the namespace the function was called in.
  function resolveThis(name, ctx) {
    var ns = ctx && ctx.ns ? ctx.ns : '';
    if (name === 'this') return ns;
    return ns ? ns + '.' + name.slice(5) : name.slice(5);
  }

  function hasControl(n) {
    if (!n || typeof n !== 'object') return false;
    if (n.k === 'call' && (n.name === 'loop' || n.name === 'while')) return true;
    for (var key in n) {
      var c = n[key];
      if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) if (hasControl(c[i])) return true; }
      else if (c && typeof c === 'object' && c.k && hasControl(c)) return true;
    }
    return false;
  }

  // Statements computing `n`; the value lands in `target` when wanted.
  Compiler.prototype.stmts = function (n, ctx, want, target) {
    if (n.k === 'seq') {
      var out = '';
      if (!n.items.length) return want ? target + ' = 0;' : '';
      for (var i = 0; i < n.items.length; i++) {
        var last = i === n.items.length - 1;
        out += this.stmts(n.items[i], ctx, want && last, target);
      }
      return out;
    }
    if (n.k === 'call' && n.name === 'loop') {
      var cnt = this.temp(), ii = this.temp();
      var s = cnt + ' = Math.min(' + MAXLOOP + ', Math.trunc(' + this.expr(n.args[0], ctx) + ')); ';
      if (want) s += target + ' = 0; ';
      s += 'for (' + ii + ' = 0; ' + ii + ' < ' + cnt + '; ' + ii + '++) {' + (n.args[1] ? this.stmts(n.args[1], ctx, want, target) : '') + '}';
      return s;
    }
    if (n.k === 'call' && n.name === 'while') {
      var guard = this.temp(), r = this.temp();
      if (n.args.length >= 2) {
        return guard + ' = 0; ' + (want ? target + ' = 0; ' : '') + 'while (Math.abs(' + this.expr(n.args[0], ctx) + ') >= ' + EPS + ' && ' + guard + '++ < ' + MAXLOOP + ') {' +
          this.stmts(n.args[1], ctx, want, target) + '}';
      }
      return guard + ' = 0; do {' + this.stmts(n.args[0], ctx, true, r) + (want ? target + ' = ' + r + ';' : '') +
        '} while (Math.abs(' + r + ') >= ' + EPS + ' && ++' + guard + ' < ' + MAXLOOP + ');';
    }
    if (n.k === 'if' && hasControl(n)) {
      var o = 'if (Math.abs(' + this.expr(n.c, ctx) + ') >= ' + EPS + ') {' + this.stmts(n.a, ctx, want, target) + '}';
      if (n.b) o += ' else {' + this.stmts(n.b, ctx, want, target) + '}';
      else if (want) o += ' else { ' + target + ' = 0; }';
      return o;
    }
    var e = this.expr(n, ctx);
    return (want ? target + ' = ' + e : e) + ';';
  };

  function T(e) { return '(Math.abs(' + e + ') >= ' + EPS + ')'; }

  Compiler.prototype.expr = function (n, ctx) {
    var self = this;
    // A loop inside an expression: the statements holding it run in a
    // closure. Only a loop, a sequence or a conditional is one; anything else
    // compiles its parts, each of which takes its own closure if it needs one.
    if (hasControl(n) && (n.k === 'seq' || n.k === 'if' || (n.k === 'call' && (n.name === 'loop' || n.name === 'while')))) {
      return '(() => { var rr = 0; ' + this.stmts(n, ctx, true, 'rr') + ' return rr; })()';
    }
    switch (n.k) {
      case 'raw': return n.code;
      case 'num': return n.v < 0 ? '(' + String(n.v) + ')' : String(n.v);
      case 'strlit': return String(this.strConst(n.v));
      case 'nstr': return 'S.named(' + JSON.stringify(n.v) + ')';
      case 'tmpstr': return 'S.tempStr(' + n.id + ')';
      case 'var': return this.varRead(n.name, ctx);
      case 'seq': {
        if (!n.items.length) return '0';
        return '(' + n.items.map(function (x) { return self.expr(x, ctx); }).join(', ') + ')';
      }
      case 'if':
        return '(' + T(this.expr(n.c, ctx)) + ' ? ' + this.expr(n.a, ctx) + ' : ' + (n.b ? this.expr(n.b, ctx) : '0') + ')';
      case 'logic': {
        var a = T(this.expr(n.a, ctx)), b = T(this.expr(n.b, ctx));
        return '((' + a + (n.op === '&&' ? ' && ' : ' || ') + b + ') ? 1 : 0)';
      }
      case 'un':
        if (n.op === '!') return '(' + T(this.expr(n.a, ctx)) + ' ? 0 : 1)';
        if (n.op === '-') return '(-' + this.expr(n.a, ctx) + ')';
        return this.expr(n.a, ctx);
      case 'bin': return this.binary(n.op, this.expr(n.a, ctx), this.expr(n.b, ctx));
      case 'index': return this.memRead(n, ctx);
      case 'assign': return this.assignment(n, ctx);
      case 'call': return this.call(n, ctx);
    }
    throw new EelError('cannot compile ' + n.k);
  };

  Compiler.prototype.binary = function (op, a, b) {
    switch (op) {
      case '+': return '(' + a + ' + ' + b + ')';
      case '-': return '(' + a + ' - ' + b + ')';
      case '*': return '(' + a + ' * ' + b + ')';
      case '/': return '(' + a + ' / ' + b + ')';
      case '%': return 'H.mod(' + a + ', ' + b + ')';
      case '^': return 'Math.pow(' + a + ', ' + b + ')';
      case '<<': return 'H.shl(' + a + ', ' + b + ')';
      case '>>': return 'H.shr(' + a + ', ' + b + ')';
      case '|': return 'H.bor(' + a + ', ' + b + ')';
      case '&': return 'H.band(' + a + ', ' + b + ')';
      case '~': return 'H.bxor(' + a + ', ' + b + ')';
      case '==': return '(Math.abs(' + a + ' - ' + b + ') < ' + EPS + ' ? 1 : 0)';
      case '!=': return '(Math.abs(' + a + ' - ' + b + ') < ' + EPS + ' ? 0 : 1)';
      case '===': return '(' + a + ' === ' + b + ' ? 1 : 0)';
      case '!==': return '(' + a + ' !== ' + b + ' ? 1 : 0)';
      case '<': case '>': case '<=': case '>=': return '(' + a + ' ' + op + ' ' + b + ' ? 1 : 0)';
    }
    throw new EelError('bad operator ' + op);
  };

  Compiler.prototype.strConst = function (s) {
    var i = this.strConsts.indexOf(s);
    if (i < 0) { i = this.strConsts.length; this.strConsts.push(s); }
    return 10000 + i;
  };

  Compiler.prototype.varRead = function (name, ctx) {
    if (name === 'gmem') return 'S.gmemBase';
    return this.ref(name, ctx);
  };

  Compiler.prototype.address = function (n, ctx) {
    if (n.base.k === 'var' && n.base.name === 'gmem') return { gmem: true, addr: this.expr(n.idx, ctx) };
    var base = this.expr(n.base, ctx);
    var idx = n.idx.k === 'num' && n.idx.v === 0 ? null : this.expr(n.idx, ctx);
    return { gmem: false, addr: idx === null ? base : '(' + base + ' + ' + idx + ')' };
  };
  Compiler.prototype.memRead = function (n, ctx) {
    var a = this.address(n, ctx);
    if (a.gmem) return 'S.grd(' + a.addr + ')';
    // Inline: a typed array read out of range is undefined, which || makes 0.
    return '(M[(' + a.addr + ' + ' + EPS + ') | 0] || 0)';
  };

  var COMPOUND = { '+=': '+', '-=': '-', '*=': '*', '/=': '/', '%=': '%', '^=': '^', '|=': '|', '&=': '&', '~=': '~', '<<=': '<<', '>>=': '>>' };

  Compiler.prototype.assignment = function (n, ctx) {
    var self = this;
    var lhs = n.lhs, rhs = this.expr(n.rhs, ctx);
    function value(cur) { return n.op === '=' ? rhs : self.binary(COMPOUND[n.op], cur, rhs); }
    if (lhs.k === 'var') {
      var r = this.ref(lhs.name, ctx);
      return '(' + r + ' = ' + value(r) + ')';
    }
    if (lhs.k === 'index') {
      var a = this.address(lhs, ctx), t = this.temp();
      var rdf = a.gmem ? 'S.grd' : 'rd', wrf = a.gmem ? 'S.gwr' : 'wr';
      return '(' + t + ' = ' + a.addr + ', ' + wrf + '(' + t + ', ' + value(rdf + '(' + t + ')') + '))';
    }
    if (lhs.k === 'if') {
      var tv = this.temp();
      var asg = function (side) { return side ? self.assignment({ k: 'assign', op: '=', lhs: side, rhs: { k: 'raw', code: tv } }, ctx) : '0'; };
      if (n.op !== '=') throw new EelError('compound assignment to a conditional is not supported');
      return '(' + tv + ' = ' + rhs + ', ' + T(this.expr(lhs.c, ctx)) + ' ? ' + asg(lhs.a) + ' : ' + asg(lhs.b) + ')';
    }
    if (lhs.k === 'nstr' || lhs.k === 'strlit') {
      return 'S.strcpy(' + this.expr(lhs, ctx) + ', ' + rhs + ')';
    }
    if (lhs.k === 'call' && lhs.name === 'slider') {
      var si = this.temp();
      return '(' + si + ' = ' + this.expr(lhs.args[0], ctx) + ', S.setSliderByIndex(' + si + ', ' + value('S.sliderByIndex(' + si + ')') + '))';
    }
    if (lhs.k === 'seq' && lhs.items.length) {
      var head = lhs.items.slice(0, -1).map(function (x) { return self.expr(x, ctx); });
      return '(' + head.concat([this.assignment({ k: 'assign', op: n.op, lhs: lhs.items[lhs.items.length - 1], rhs: n.rhs }, ctx)]).join(', ') + ')';
    }
    throw new EelError('cannot assign to ' + lhs.k);
  };

  // A variable passed by reference (midirecv, file_var): its JS lvalue.
  Compiler.prototype.lvalue = function (n, ctx) {
    if (n.k === 'var') return this.ref(n.name, ctx);
    return null;
  };

  Compiler.prototype.call = function (n, ctx) {
    var self = this, name = n.name, args = n.args;
    function A(i) { return args[i] === undefined ? '0' : self.expr(args[i], ctx); }
    function all() { return args.map(function (x) { return self.expr(x, ctx); }).join(', '); }
    if (MATH[name]) return MATH[name] + '(' + all() + ')';
    switch (name) {
      case 'midirecv': {
        var lv = args.map(function (x) { return self.lvalue(x, ctx); });
        var sets = [];
        for (var i = 0; i < lv.length; i++) {
          if (!lv[i]) continue;
          var src = lv.length >= 4 ? 'S.mr[' + i + ']' : (i === 2 ? '(S.mr[2] + S.mr[3] * 256)' : 'S.mr[' + i + ']');
          sets.push(lv[i] + ' = ' + src);
        }
        return '(S.midirecv() ? (' + (sets.length ? sets.join(', ') + ', ' : '') + 'S.mr[1]) : 0)';
      }
      case 'midisend':
        if (args.length >= 4) return 'S.midisend(' + A(0) + ', ' + A(1) + ', ' + A(2) + ', ' + A(3) + ')';
        return 'S.midisend3(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'midisend_buf': return 'S.midisendBuf(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'midisyx': return 'S.midisendBuf(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'file_var': {
        var fv = this.lvalue(args[1], ctx);
        if (!fv) return 'S.fileVar(' + A(0) + ', ' + A(1) + ')';
        return '(' + fv + ' = S.fileVar(' + A(0) + ', ' + fv + '))';
      }
      case 'file_riff': {
        // channels and sample rate come back through the arguments
        var nc = this.lvalue(args[1], ctx), fr = this.lvalue(args[2], ctx);
        var t0 = this.temp();
        return '(' + t0 + ' = S.fileRiff(' + A(0) + ')' + (nc ? ', ' + nc + ' = S.riff[0]' : '') + (fr ? ', ' + fr + ' = S.riff[1]' : '') + ', ' + t0 + ')';
      }
      case 'slider': return 'S.sliderByIndex(' + A(0) + ')';
      case 'loop': case 'while':
        return '(() => { var rr = 0; ' + this.stmts(n, ctx, true, 'rr') + ' return rr; })()';
      case 'match': case 'matchi': {
        var refs = args.slice(2).map(function (x) { return self.lvalue(x, ctx); });
        var call = 'S.match(' + (name === 'matchi' ? 'true' : 'false') + ', ' + A(0) + ', ' + A(1) + ')';
        if (!refs.length) return call;
        var tm = this.temp();
        var assigns = refs.map(function (r, k) { return r ? r + ' = S.matchOut[' + k + ']' : ''; }).filter(Boolean);
        return '(' + tm + ' = ' + call + ', ' + tm + ' ? (' + (assigns.length ? assigns.join(', ') + ', ' : '') + '1) : 0)';
      }
    }
    if (this.funcs[name]) return this.userCall(this.funcs[name], args, ctx, '');
    if (name.indexOf('.') > 0) {
      var base = name.slice(name.lastIndexOf('.') + 1), prefix = name.slice(0, name.lastIndexOf('.'));
      if (this.funcs[base]) return this.userCall(this.funcs[base], args, ctx, prefix === 'this' || prefix.indexOf('this.') === 0 ? resolveThis(prefix, ctx) : prefix);
    }
    if (/^gfx_|^mouse_/.test(name)) {
      if (!this.gfx) return '(' + (args.length ? all() + ', ' : '') + '0)';
      // Width and height come back through the arguments, as file_riff's do.
      if (name === 'gfx_measurestr' || name === 'gfx_measurechar' || name === 'gfx_getimgdim') {
        var mw = this.lvalue(args[1] || { k: 'num', v: 0 }, ctx), mh = this.lvalue(args[2] || { k: 'num', v: 0 }, ctx);
        var tg = this.temp();
        return '(' + tg + ' = S.call(' + JSON.stringify(name) + ', ' + A(0) + ')' + (mw ? ', ' + mw + ' = S.gm[0]' : '') +
               (mh ? ', ' + mh + ' = S.gm[1]' : '') + ', ' + tg + ')';
      }
    }
    return 'S.call(' + JSON.stringify(name) + (args.length ? ', ' + all() : '') + ')';
  };

  // One compiled copy per function and namespace, as EEL2 does: a.f() and
  // b.f() are two functions, each with its own instance variables.
  Compiler.prototype.userCall = function (fn, args, ctx, ns) {
    var self = this;
    ns = ns || '';
    if (args.length !== fn.params.length && !(args.length === 1 && fn.params.length === 0)) {
      // EEL2 refuses the wrong number of arguments at compile time.
      throw new EelError(fn.name + '() takes ' + fn.params.length + ' arguments, given ' + args.length);
    }
    var jsName = 'F_' + fn.name.replace(/\./g, '_') + (ns ? '$' + ns.replace(/\./g, '$') : '');
    var key = fn.name + '@' + ns;
    if (!this.compiledFuncs[key]) {
      this.compiledFuncs[key] = true;
      var saved = this.temps;
      this.temps = 0;
      var body = this.stmts(fn.body, { fn: fn, ns: ns }, true, 'r');
      var temps = this.tempDecl();
      this.temps = saved;
      var params = fn.params.map(function (_, i) { return 'p' + i; });
      this.funcCode.push('function ' + jsName + '(' + params.join(', ') + ') { var r = 0;' + temps + body + ' return r; }');
    }
    return jsName + '(' + args.slice(0, fn.params.length).map(function (x) { return self.expr(x, ctx); }).join(', ') + ')';
  };

  // ----------------------------------------------------------- helpers ----
  function i64(x) { return Math.trunc(x); }
  function bigOp(a, b, f) { return Number(BigInt.asIntN(64, f(BigInt(i64(a)), BigInt(i64(b))))); }
  var H = {
    sqrt: function (x) { return Math.sqrt(Math.abs(x)); },
    sign: function (x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); },
    invsqrt: function (x) { return 1 / Math.sqrt(x); },
    sqr: function (x) { return x * x; },
    exp2: function (x) { return Math.pow(2, x); },
    rand: function (x) { return Math.random() * (x === undefined ? 1 : x); },
    mod: function (a, b) {
      var ib = Math.trunc(Math.abs(b));
      return ib ? Math.trunc(Math.abs(a)) % ib : 0;
    },
    shl: function (a, b) { return bigOp(a, b, function (x, y) { return x << (y & 63n); }); },
    shr: function (a, b) { return bigOp(a, b, function (x, y) { return x >> (y & 63n); }); },
    bor: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) | i64(b));
      return bigOp(a, b, function (x, y) { return x | y; });
    },
    band: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) & i64(b));
      return bigOp(a, b, function (x, y) { return x & y; });
    },
    bxor: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) ^ i64(b));
      return bigOp(a, b, function (x, y) { return x ^ y; });
    }
  };

  // C's %f: the double's exact decimal value, rounded half to even.
  var F64 = new Float64Array(1), U32 = new Uint32Array(F64.buffer);
  function toFixedC(x, f) {
    if (!isFinite(x)) return String(x);
    var neg = x < 0; F64[0] = Math.abs(x);
    var hi = U32[1], lo = U32[0], exp = (hi >>> 20) & 0x7ff;
    var mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
    if (exp === 0) exp = 1; else mant |= 1n << 52n;
    var e = exp - 1075, D, sc;
    if (e >= 0) { D = mant << BigInt(e); sc = 0; } else { D = mant * (5n ** BigInt(-e)); sc = -e; }
    var q;
    if (f >= sc) q = D * (10n ** BigInt(f - sc));
    else {
      var div = 10n ** BigInt(sc - f); q = D / div; var r2 = (D % div) * 2n;
      if (r2 > div || (r2 === div && (q & 1n) === 1n)) q += 1n;
    }
    var s = q.toString();
    if (f > 0) { while (s.length <= f) s = '0' + s; s = s.slice(0, s.length - f) + '.' + s.slice(s.length - f); }
    return (neg && /[1-9]/.test(s) ? '-' : (neg ? '-' : '')) + s;
  }

  // EEL2's sprintf, on doubles.
  function eelFormat(fmt, values) {
    var vi = 0;
    return fmt.replace(/%([-+ 0#]*)(\d*)(?:\.(\d+))?([dixXfgecs%])/g, function (all, flags, width, prec, conv) {
      if (conv === '%') return '%';
      var v = values[vi++], s;
      if (v === undefined) v = 0;
      switch (conv) {
        case 'd': case 'i': s = String(Math.trunc(v.num !== undefined ? v.num : v)); break;
        case 'x': s = (Math.trunc(v) >>> 0).toString(16); break;
        case 'X': s = (Math.trunc(v) >>> 0).toString(16).toUpperCase(); break;
        case 'f': s = toFixedC(Number(v), prec === undefined ? 6 : Number(prec)); break;
        case 'e': s = Number(v).toExponential(prec === undefined ? 6 : Number(prec)); break;
        case 'g': s = String(Number(Number(v).toPrecision(prec === undefined ? 6 : Math.max(1, Number(prec))))); break;
        case 'c': s = String.fromCharCode(Math.trunc(v)); break;
        case 's': s = v.str !== undefined ? v.str : String(v); break;
      }
      if (flags.indexOf('+') >= 0 && conv !== 's' && Number(v) >= 0) s = '+' + s;
      var w = Number(width || 0);
      while (s.length < w) s = flags.indexOf('-') >= 0 ? s + ' ' : (flags.indexOf('0') >= 0 && conv !== 's' ? '0' + s : ' ' + s);
      return s;
    });
  }

  // ---------------------------------------------------------- instance ----
  function JSFX(text, opts) {
    opts = opts || {};
    this.file = parseFile(text, opts.readImport);
    this.srate = opts.sampleRate || 48000;
    this.slots = { __count: 0 };
    var self = this;
    var C = new Compiler(this.slots);
    C.gfx = !!opts.gfx;
    // Predeclare what the host reads and writes.
    ['srate', 'samplesblock', 'tempo', 'play_state', 'play_position', 'beat_position', 'ts_num', 'ts_denom',
     'num_ch', 'trigger', 'pdc_delay', 'pdc_bot_ch', 'pdc_top_ch', 'pdc_midi', 'ext_noinit', 'ext_nodenorm',
     'ext_midi_bus', 'midi_bus', 'gfx_ext_retina'].forEach(function (n) { C.slot(n); });
    for (var c = 0; c < 64; c++) C.slot('spl' + c);
    for (var s = 1; s <= 64; s++) C.slot('slider' + s);
    this.file.sliders.forEach(function (sl) { C.slot(sl.variable); });
    if (C.gfx) ['gfx_r', 'gfx_g', 'gfx_b', 'gfx_a', 'gfx_a2', 'gfx_x', 'gfx_y', 'gfx_w', 'gfx_h', 'gfx_texth', 'gfx_mode', 'gfx_clear',
                'gfx_dest', 'gfx_ext_flags', 'mouse_x', 'mouse_y', 'mouse_cap', 'mouse_wheel', 'mouse_hwheel'].forEach(function (n) { C.slot(n); });

    var sections = {};
    ['init', 'slider', 'block', 'sample', 'serialize'].concat(C.gfx ? ['gfx'] : []).forEach(function (name) {
      var parts = self.file.sections[name];
      if (!parts.length) return;
      sections[name] = parts.map(function (part) { return C.compileSection(part.code, part.line); });
    });
    // @gfx is parsed for its functions only, so @init code that calls a
    // helper defined there still compiles.
    if (!C.gfx) this.file.sections.gfx.forEach(function (part) {
      try { parse(lex(part.code, part.line), C.funcs); } catch (e) { /* the window is not run */ }
    });

    // Room for names a later eval() adds: the generated code holds on to v.
    this.v = new Float64Array(this.slots.__count + 4096);
    this.strConsts = C.strConsts;
    var src = [];
    src.push('"use strict";');
    // Memory is one Float64Array that doubles when written past its end, up
    // to EEL2's 8M words; rd and wr sit beside it so V8 can inline them.
    src.push('var v = S.v, M = new Float64Array(' + BLOCK + ');');
    src.push('function rd(a) { var i = (a + ' + EPS + ') | 0; return (i >= 0 && i < M.length) ? M[i] : 0; }');
    src.push('function wr(a, x) { var i = (a + ' + EPS + ') | 0; if (i >= 0 && i < M.length) { M[i] = x; return x; } return grow(i, x); }');
    src.push('function grow(i, x) { if (i < 0 || i >= ' + (BLOCK * NBLOCKS) + ') return x; var n = M.length; while (n <= i) n *= 2;' +
             ' var N = new Float64Array(Math.min(n, ' + (BLOCK * NBLOCKS) + ')); N.set(M); M = N; M[i] = x; return x; }');
    src.push('S.rd = rd; S.wr = wr; S.clearMem = function () { M = new Float64Array(' + BLOCK + '); };');
    // Code compiled later (eval) runs in this scope, beside M, v and the helpers.
    src.push('S.evalIn = function (code) { return eval(code); };');
    src.push(C.funcCode.join('\n'));
    Object.keys(sections).forEach(function (name) {
      src.push('S.sec_' + name + ' = [' + sections[name].map(function (b) { return 'function () {' + b + '}'; }).join(',\n') + '];');
    });
    this.code = src.join('\n');
    this.reset();
    new Function('S', 'H', this.code)(this, H);
  }

  JSFX.prototype.reset = function () {
    this.v.fill(0);
    this.mem = new Array(NBLOCKS);
    this.gmem = NS.sharedGmem || (NS.sharedGmem = {});
    this.gmemName = (/gmem=(\S+)/.exec(this.file.options) || [])[1] || '';
    this.strings = {};
    this.namedIds = {};
    this.nextNamed = 90000;
    this.midiIn = []; this.midiInPos = 0; this.midiOut = [];
    this.mr = [0, 0, 0, 0];
    this.matchOut = [];
    this.serial = null;
    this.blockCount = 0;
    this.sliderDirty = true;
    this.sampleFrame = 0;
    var self = this;
    if (this.clearMem) this.clearMem();
    this.file.sliders.forEach(function (sl) { self.v[self.slots[sl.variable]] = sl.def; });
  };

  JSFX.prototype.slot = function (name) { return this.slots[name.toLowerCase()]; };
  JSFX.prototype.getVar = function (name) { var s = this.slot(name); return s === undefined ? 0 : this.v[s]; };
  JSFX.prototype.setVar = function (name, val) { var s = this.slot(name); if (s !== undefined) this.v[s] = val; };

  JSFX.prototype.sliderVar = function (n) {
    for (var i = 0; i < this.file.sliders.length; i++) if (this.file.sliders[i].index === n) return this.file.sliders[i].variable;
    return 'slider' + n;
  };
  JSFX.prototype.sliderByIndex = function (n) { return this.v[this.slots[this.sliderVar(Math.trunc(n))]] || 0; };
  JSFX.prototype.setSliderByIndex = function (n, val) { this.v[this.slots[this.sliderVar(Math.trunc(n))]] = val; return val; };
  JSFX.prototype.getSlider = function (n) { return this.sliderByIndex(n); };
  JSFX.prototype.setSlider = function (n, val) {
    this.setSliderByIndex(n, val);
    this.sliderDirty = true;
  };

  JSFX.prototype.runSection = function (name) {
    var list = this['sec_' + name];
    if (!list) return 0;
    var r = 0;
    for (var i = 0; i < list.length; i++) r = list[i]();
    return r;
  };

  JSFX.prototype.setTime = function (t) {
    var v = this.v, s = this.slots;
    if (t.tempo !== undefined) v[s.tempo] = t.tempo;
    if (t.playState !== undefined) v[s.play_state] = t.playState;
    if (t.beat !== undefined) v[s.beat_position] = t.beat;
    if (t.seconds !== undefined) v[s.play_position] = t.seconds;
    if (t.num !== undefined) v[s.ts_num] = t.num;
    if (t.den !== undefined) v[s.ts_denom] = t.den;
  };

  JSFX.prototype.init = function (sampleRate) {
    if (sampleRate) this.srate = sampleRate;
    var keep = this.file.sliders.map(function (sl) { return this.v[this.slots[sl.variable]]; }, this);
    this.reset();
    this.file.sliders.forEach(function (sl, i) { this.v[this.slots[sl.variable]] = keep[i]; }, this);
    var v = this.v, s = this.slots;
    v[s.srate] = this.srate;
    v[s.num_ch] = Math.max(this.file.inPins.length, this.file.outPins.length);
    v[s.tempo] = v[s.tempo] || 120; v[s.ts_num] = v[s.ts_num] || 4; v[s.ts_denom] = v[s.ts_denom] || 4;
    this.runSection('init');
    this.runSection('slider');
    this.sliderDirty = false;
    this.initialised = true;
  };

  /* One block: `inputs`/`outputs` are arrays of Float32Array per channel (or
   * null for a MIDI-only device), `midi` is [{offset, data:[b1,b2,b3]}]
   * sorted by offset. Returns the MIDI sent, with offsets. */
  JSFX.prototype.process = function (n, inputs, outputs, midi) {
    if (!this.initialised) this.init();
    var v = this.v, s = this.slots;
    if (this.sliderDirty) { this.sliderDirty = false; this.runSection('slider'); }
    v[s.samplesblock] = n;
    this.midiIn = midi || [];
    this.midiInPos = 0;
    this.midiOut = [];
    this.runSection('block');
    var sec = this.sec_sample;
    if (sec && sec.length) {
      var nIn = inputs ? inputs.length : 0, nOut = outputs ? outputs.length : 0;
      var nch = Math.max(nIn, nOut, 2);
      var spl = [];
      for (var c = 0; c < nch; c++) spl.push(s['spl' + c]);
      for (var i = 0; i < n; i++) {
        this.sampleFrame = i;
        for (var ci = 0; ci < nch; ci++) v[spl[ci]] = ci < nIn && inputs[ci] ? inputs[ci][i] : 0;
        for (var k = 0; k < sec.length; k++) sec[k]();
        for (var co = 0; co < nOut; co++) if (outputs[co]) outputs[co][i] = v[spl[co]];
      }
    } else if (outputs && inputs) {
      for (var ch = 0; ch < outputs.length; ch++) if (outputs[ch] && inputs[ch]) outputs[ch].set(inputs[ch]);
    }
    // MIDI a plug-in did not read passes through, as in REAPER.
    for (var r = this.midiInPos; r < this.midiIn.length; r++) this.midiOut.push(this.midiIn[r]);
    this.blockCount++;
    var out = this.midiOut;
    out.sort(function (a, b) { return a.offset - b.offset; });
    return out;
  };

  // ------------------------------------------------------- the host API --
  JSFX.prototype.midirecv = function () {
    if (this.midiInPos >= this.midiIn.length) return 0;
    var ev = this.midiIn[this.midiInPos++];
    this.mr[0] = ev.offset; this.mr[1] = ev.data[0]; this.mr[2] = ev.data[1] || 0; this.mr[3] = ev.data[2] || 0;
    return 1;
  };
  JSFX.prototype.midisend = function (offset, b1, b2, b3) {
    this.midiOut.push({ offset: Math.max(0, Math.trunc(offset)), data: [Math.trunc(b1) & 255, Math.trunc(b2) & 127, Math.trunc(b3) & 127] });
    return b1;
  };
  JSFX.prototype.midisend3 = function (offset, b1, b23) {
    b23 = Math.trunc(b23);
    return this.midisend(offset, b1, b23 & 255, (b23 >> 8) & 255);
  };
  JSFX.prototype.midisendBuf = function (offset, buf, len) {
    var data = [];
    for (var i = 0; i < len; i++) data.push(Math.trunc(this.rd(buf + i)) & 255);
    this.midiOut.push({ offset: Math.max(0, Math.trunc(offset)), data: data });
    return len;
  };

  JSFX.prototype.grd = function (a) { var g = this.gmem[this.gmemName]; if (!g) return 0; var i = (a + EPS) | 0; return g[i] || 0; };
  JSFX.prototype.gwr = function (a, val) {
    var g = this.gmem[this.gmemName] || (this.gmem[this.gmemName] = {});
    g[(a + EPS) | 0] = val; return val;
  };

  // Strings: literals are 10000+, named strings 90000+, slots 0-1023 free.
  JSFX.prototype.str = function (id) {
    id = Math.trunc(id);
    if (id >= 10000 && id < 90000) return this.strConsts[id - 10000] || '';
    return this.strings[id] || '';
  };
  JSFX.prototype.setStr = function (id, s) { this.strings[Math.trunc(id)] = s; return id; };
  JSFX.prototype.named = function (name) {
    var id = this.namedIds[name];
    if (id === undefined) { id = this.namedIds[name] = this.nextNamed++; this.strings[id] = ''; }
    return id;
  };
  JSFX.prototype.tempStr = function (site) { var id = 200000 + site; if (this.strings[id] === undefined) this.strings[id] = ''; return id; };
  JSFX.prototype.strcpy = function (d, s) { return this.setStr(d, this.str(s)); };
  JSFX.prototype.match = function (ci, pat, sid) {
    var p = this.str(pat), s = this.str(sid);
    var re = '^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
    return new RegExp(re, ci ? 'i' : '').test(s) ? 1 : 0;
  };

  JSFX.prototype.riff = [0, 0];
  JSFX.prototype.fileRiff = function (h) {
    var f = this.files && this.files[Math.trunc(h)];
    this.riff = f ? [f.channels, f.rate] : [0, 0];
    return f ? 1 : 0;
  };
  // One frame of @gfx, drawn by `host`: an object with a method per gfx_*
  // function (each called with the JSFX first), as the Ableton devices give.
  // `w`, `h` and `mouse` ({x, y, cap, wheel, hwheel}) are what REAPER sets.
  JSFX.prototype.runGfx = function (host, w, h, mouse) {
    if (!this.sec_gfx) return 0;
    if (!this.initialised) this.init();
    var v = this.v, s = this.slots;
    this.gfxHost = host;
    v[s.gfx_w] = w; v[s.gfx_h] = h;
    if (mouse) {
      v[s.mouse_x] = mouse.x; v[s.mouse_y] = mouse.y; v[s.mouse_cap] = mouse.cap;
      if (mouse.wheel) v[s.mouse_wheel] += mouse.wheel;
      if (mouse.hwheel) v[s.mouse_hwheel] += mouse.hwheel;
    }
    return this.runSection('gfx');
  };
  JSFX.prototype.gm = [0, 0];

  JSFX.prototype.call = function (name) {
    var a = Array.prototype.slice.call(arguments, 1);
    if (this.gfxHost && this.gfxHost[name]) return +this.gfxHost[name].apply(this.gfxHost, [this].concat(a)) || 0;
    var f = BUILTINS[name];
    if (!f) {
      if (!this.warned) this.warned = {};
      if (!this.warned[name] && typeof console !== 'undefined') { this.warned[name] = true; console.warn('JSFX: no ' + name + '()'); }
      return 0;
    }
    return f.apply(this, a);
  };

  // @serialize: values written in order, read back in order.
  JSFX.prototype.fileVar = function (h, cur) {
    h = Math.trunc(h);
    if (h === 0 && this.serial) {
      if (this.serial.mode === 'write') { this.serial.data.push(cur); return cur; }
      var d = this.serial.data[this.serial.pos++];
      return d === undefined ? cur : (typeof d === 'number' ? d : cur);
    }
    var f = this.files && this.files[h];
    if (f && f.pos < f.values.length) return f.values[f.pos++];
    return cur;
  };
  JSFX.prototype.serialize = function () {
    this.serial = { mode: 'write', data: [], pos: 0 };
    this.runSection('serialize');
    var data = this.serial.data;
    this.serial = null;
    return { sliders: this.file.sliders.map(function (sl) { return this.v[this.slots[sl.variable]]; }, this), data: data };
  };
  JSFX.prototype.deserialize = function (state) {
    if (!state) return;
    if (!this.initialised) this.init();
    if (state.sliders) this.file.sliders.forEach(function (sl, i) {
      if (state.sliders[i] !== undefined) this.v[this.slots[sl.variable]] = state.sliders[i];
    }, this);
    this.serial = { mode: 'read', data: state.data || [], pos: 0 };
    this.runSection('serialize');
    this.serial = null;
    this.sliderDirty = true;
  };

  // Run a line of EEL2 against this instance: how a device's own buttons
  // (Panic, Transfer to Pads...) are pressed from Middaw's controls.
  JSFX.prototype.eval = function (code) {
    var C = new Compiler(this.slots);
    C.gfx = !!opts.gfx;
    C.strConsts = this.strConsts;
    // reuse the instance's functions by recompiling them into this snippet
    var funcs = {};
    var self = this;
    ['init', 'slider', 'block', 'sample', 'serialize', 'gfx'].forEach(function (name) {
      self.file.sections[name].forEach(function (part) { try { parse(lex(part.code, part.line), funcs); } catch (e) {} });
    });
    C.funcs = funcs;
    var body = C.compileSection(code, 1);
    var fn = this.evalIn('(function () {' + C.funcCode.join('\n') + ' return function () {' + body + '}; })()');
    if (this.slots.__count > this.v.length) throw new EelError('too many new variables in eval');
    return fn();
  };

  var BUILTINS = {
    memset: function (d, val, n) { for (var i = 0; i < n; i++) this.wr(d + i, val); return d; },
    memcpy: function (d, s, n) {
      var tmp = [];
      for (var i = 0; i < n; i++) tmp.push(this.rd(s + i));
      for (var j = 0; j < n; j++) this.wr(d + j, tmp[j]);
      return d;
    },
    freembuf: function (n) { return n; },
    mem_set_values: function () { return 0; },
    time: function () { return Math.floor(Date.now() / 1000); },
    time_precise: function () { return (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000; },
    sliderchange: function () { if (this.onSliderChange) this.onSliderChange(); return 0; },
    slider_automate: function () { if (this.onSliderChange) this.onSliderChange(); return 0; },
    slider_show: function () { return 0; },
    strlen: function (s) { return this.str(s).length; },
    strcpy: function (d, s) { return this.setStr(d, this.str(s)); },
    strcat: function (d, s) { return this.setStr(d, this.str(d) + this.str(s)); },
    strcmp: function (a, b) { var x = this.str(a), y = this.str(b); return x < y ? -1 : x > y ? 1 : 0; },
    stricmp: function (a, b) { var x = this.str(a).toLowerCase(), y = this.str(b).toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; },
    strncpy: function (d, s, n) { return this.setStr(d, this.str(s).slice(0, n)); },
    strcpy_substr: function (d, s, off, len) {
      var str = this.str(s);
      if (off < 0) off = Math.max(0, str.length + off);
      return this.setStr(d, len === undefined ? str.slice(off) : str.substr(off, Math.max(0, len)));
    },
    str_getchar: function (s, i) { var str = this.str(s); if (i < 0) i += str.length; return i >= 0 && i < str.length ? str.charCodeAt(i) : 0; },
    str_setchar: function (s, i, c) {
      var str = this.str(s); if (i < 0) i += str.length;
      if (i >= 0 && i <= str.length) this.setStr(s, str.slice(0, i) + String.fromCharCode(c) + str.slice(i + 1));
      return c;
    },
    sprintf: function (d, fmt) {
      var self = this, vals = Array.prototype.slice.call(arguments, 2);
      var f = this.str(fmt);
      // %s takes a string handle
      var vi = 0;
      var mapped = [];
      f.replace(/%[-+ 0#]*\d*(?:\.\d+)?([dixXfgecs%])/g, function (all, conv) {
        if (conv === '%') return all;
        var x = vals[vi++];
        mapped.push(conv === 's' ? { str: self.str(x) } : x);
        return all;
      });
      return this.setStr(d, eelFormat(f, mapped));
    },
    file_open: function (s) {
      var name = this.str(s);
      var vals = this.openFile ? this.openFile(name) : null;
      if (!vals) return -1;
      if (!this.files) { this.files = {}; this.nextFile = 1; }
      var h = this.nextFile++;
      this.files[h] = { values: vals.samples || vals, pos: 0, channels: vals.channels || 1, rate: vals.rate || this.srate };
      return h;
    },
    file_close: function (h) { if (this.files) delete this.files[h]; return 0; },
    file_rewind: function (h) { if (this.files && this.files[h]) this.files[h].pos = 0; return 0; },
    file_avail: function (h) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) return this.serial.mode === 'write' ? -1 : this.serial.data.length - this.serial.pos;
      var f = this.files && this.files[h];
      return f ? f.values.length - f.pos : 0;
    },
    file_riff: function () { return 0; },
    file_text: function () { return 0; },
    file_mem: function (h, addr, n) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) {
        if (this.serial.mode === 'write') { for (var i = 0; i < n; i++) this.serial.data.push(this.rd(addr + i)); }
        else { for (var j = 0; j < n; j++) { var d = this.serial.data[this.serial.pos++]; this.wr(addr + j, typeof d === 'number' ? d : 0); } }
        return n;
      }
      var f = this.files && this.files[h];
      if (!f) return 0;
      var k = 0;
      for (; k < n && f.pos < f.values.length; k++) this.wr(addr + k, f.values[f.pos++]);
      return k;
    },
    file_string: function (h, s) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) {
        if (this.serial.mode === 'write') this.serial.data.push({ s: this.str(s) });
        else { var d = this.serial.data[this.serial.pos++]; if (d && d.s !== undefined) this.setStr(s, d.s); }
      }
      return 1;
    },
    export_buffer_to_project: function () { return this.exportBuffer ? this.exportBuffer.apply(this, arguments) : 0; },
    get_host_placement: function () { return 0; },
    get_host_numchan: function () { return 2; },
    set_host_numchan: function () { return 0; },
    get_pin_mapping: function () { return 0; },
    set_pdc: function () { return 0; },
    printf: function () { return 0; },
    gfx_getchar: function () { return 0; }
  };

  NS.JSFX = JSFX;
  NS.parseFile = parseFile;
  NS.parseSliderLine = parseSliderLine;
  NS.lexEel = lex;
  NS.parseEel = parse;
  NS.EelError = EelError;
})(typeof module === 'object' && module.exports
  ? (module.exports = (globalThis.MiddawJSFX = globalThis.MiddawJSFX || {}))
  : (globalThis.MiddawJSFX = globalThis.MiddawJSFX || {}));


/* ---- kit/gfx.js ---- */
/* REAPER's gfx_* drawing, on Max's mgraphics: the host a JSFX's @gfx runs on
 * (MiddawJSFX's runGfx). Each method takes the JSFX first, reads gfx_r, gfx_x
 * and the rest from its variables, and draws as REAPER would: text from its
 * top-left, gfx_x moved on past it, angles from twelve o'clock clockwise.
 *
 * gfx_showmenu cannot wait for a choice inside a frame, so it asks for one:
 * `menu` is set, the frame returns 0, and the device draws the menu. When an
 * item is chosen the device puts the variables back as they were at the start
 * of that frame and runs it again, and this time gfx_showmenu returns the item.
 */
var Gfx = (function () {
  'use strict';
  function Host(g) {
    this.g = g;
    this.fonts = { 0: { name: 'Arial', size: 13, flags: 0 } };
    this.font = 0;
    this.menu = null;        // { text, x, y } asked for this frame
    this.choice = 0;         // the item to give gfx_showmenu on the replayed frame
    this.slots = null;
  }
  Host.prototype.begin = function (g, fx) {
    this.g = g;
    if (!this.slots || this.fx !== fx) {
      this.fx = fx;
      var s = fx.slots;
      this.slots = { r: s.gfx_r, g: s.gfx_g, b: s.gfx_b, a: s.gfx_a, x: s.gfx_x, y: s.gfx_y, texth: s.gfx_texth,
                     mx: s.mouse_x, my: s.mouse_y, clear: s.gfx_clear };
    }
    this.menu = null;
    this.applyFont();
  };
  Host.prototype.v = function (k) { return this.fx.v[this.slots[k]]; };
  Host.prototype.set = function (k, x) { this.fx.v[this.slots[k]] = x; };
  Host.prototype.colour = function () {
    this.g.set_source_rgba(clamp(this.v('r')), clamp(this.v('g')), clamp(this.v('b')), clamp(this.v('a')));
  };
  // EEL2 strings are bytes; REAPER draws them as UTF-8.
  function utf8(s) { try { return decodeURIComponent(escape(s)); } catch (e) { return s; } }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : (x || 0); }
  function num(x, d) { return x === undefined || x !== x ? d : x; }

  // ------------------------------------------------------------ colour ---
  Host.prototype.gfx_set = function (fx, r, g, b, a) {
    r = num(r, 0);
    this.set('r', r); this.set('g', num(g, r)); this.set('b', num(b, r)); this.set('a', num(a, 1));
    return 0;
  };

  // ------------------------------------------------------------ shapes ---
  Host.prototype.gfx_rect = function (fx, x, y, w, h, filled) {
    if (!(w > 0 && h > 0)) return 0;
    this.colour();
    if (num(filled, 1)) { this.g.rectangle(x, y, w, h); this.g.fill(); }
    else { this.g.set_line_width(1); this.g.rectangle(x + 0.5, y + 0.5, w - 1, h - 1); this.g.stroke(); }
    return 0;
  };
  Host.prototype.gfx_line = function (fx, x1, y1, x2, y2) {
    this.colour();
    this.g.set_line_width(1);
    this.g.move_to(x1 + 0.5, y1 + 0.5); this.g.line_to(x2 + 0.5, y2 + 0.5); this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_lineto = function (fx, x, y) {
    this.gfx_line(fx, this.v('x'), this.v('y'), x, y);
    this.set('x', x); this.set('y', y);
    return 0;
  };
  Host.prototype.gfx_circle = function (fx, x, y, r, fill) {
    this.colour();
    this.g.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    if (num(fill, 0)) this.g.fill(); else { this.g.set_line_width(1); this.g.stroke(); }
    return 0;
  };
  Host.prototype.gfx_arc = function (fx, x, y, r, a1, a2) {
    this.colour();
    this.g.set_line_width(1);
    this.g.arc(x, y, Math.max(0, r), a1 - Math.PI / 2, a2 - Math.PI / 2);
    this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_roundrect = function (fx, x, y, w, h, radius) {
    this.colour();
    this.g.set_line_width(1);
    this.g.rectangle_rounded(x + 0.5, y + 0.5, w, h, radius * 2, radius * 2);
    this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_triangle = function (fx) {
    var p = Array.prototype.slice.call(arguments, 1);
    if (p.length < 6) return 0;
    this.colour();
    this.g.move_to(p[0], p[1]);
    for (var i = 2; i + 1 < p.length; i += 2) this.g.line_to(p[i], p[i + 1]);
    this.g.close_path();
    this.g.fill();
    return 0;
  };
  Host.prototype.gfx_gradrect = function (fx, x, y, w, h, r, g, b, a) {
    this.g.set_source_rgba(clamp(r), clamp(g), clamp(b), clamp(num(a, 1)));
    this.g.rectangle(x, y, w, h); this.g.fill();
    return 0;
  };

  // -------------------------------------------------------------- text ---
  // gfx_setfont(idx, name, size, flags): flags is a character code, 'b' bold, 'i' italic.
  Host.prototype.gfx_setfont = function (fx, idx, name, size, flags) {
    idx = Math.trunc(num(idx, 0));
    if (name !== undefined && idx > 0) {
      this.fonts[idx] = { name: fx.str(name) || 'Arial', size: num(size, 13), flags: Math.trunc(num(flags, 0)) };
    }
    this.font = this.fonts[idx] ? idx : 0;
    this.applyFont();
    return 1;
  };
  Host.prototype.gfx_getfont = function () { return this.font; };
  Host.prototype.applyFont = function () {
    var f = this.fonts[this.font] || this.fonts[0], fl = f.flags;
    var bold = fl === 98 || ((fl >> 8) & 255) === 98 || ((fl >> 16) & 255) === 98;
    var italic = fl === 105 || ((fl >> 8) & 255) === 105 || ((fl >> 16) & 255) === 105;
    this.g.select_font_face(f.name, italic ? 'italic' : 'normal', bold ? 'bold' : 'normal');
    this.g.set_font_size(f.size);
    this.size = f.size;
    if (this.slots) this.set('texth', Math.round(f.size));
  };
  Host.prototype.measure = function (s) {
    var m = this.g.text_measure(s);
    return [m[0], Math.max(m[1], this.size)];
  };
  Host.prototype.gfx_measurestr = function (fx, s) { this.fx.gm = this.measure(utf8(fx.str(s))); return this.fx.gm[0]; };
  Host.prototype.gfx_measurechar = function (fx, c) { this.fx.gm = this.measure(String.fromCharCode(c)); return this.fx.gm[0]; };
  Host.prototype.text = function (s, flags, right, bottom) {
    var x = this.v('x'), y = this.v('y'), m = this.measure(s);
    flags = Math.trunc(num(flags, 0));
    if (right !== undefined && !(flags & 256)) {
      if (flags & 1) x = x + (right - x - m[0]) / 2; else if (flags & 2) x = right - m[0];
      if (flags & 4) y = y + (bottom - y - m[1]) / 2; else if (flags & 8) y = bottom - m[1];
    }
    this.colour();
    this.g.move_to(x, y + this.size * 0.8);
    this.g.show_text(s);
    this.set('x', x + m[0]);
    return 0;
  };
  Host.prototype.gfx_drawstr = function (fx, s, flags, right, bottom) { return this.text(utf8(fx.str(s)), flags, right, bottom); };
  Host.prototype.gfx_drawchar = function (fx, c) { return this.text(String.fromCharCode(c)); };
  Host.prototype.gfx_drawnumber = function (fx, n, digits) { return this.text(Number(n).toFixed(Math.max(0, Math.trunc(num(digits, 0))))); };
  Host.prototype.gfx_printf = function (fx, fmt) {
    var args = Array.prototype.slice.call(arguments, 2);
    var s = fx.str(fmt).replace(/%(-?\d*)(?:\.(\d+))?([dfsxXc%])/g, function (m, w, p, k) {
      if (k === '%') return '%';
      var a = args.shift();
      if (k === 's') return fx.str(a);
      if (k === 'c') return String.fromCharCode(a);
      if (k === 'x' || k === 'X') { var h = Math.trunc(a).toString(16); return k === 'X' ? h.toUpperCase() : h; }
      return k === 'd' ? String(Math.trunc(a)) : Number(a).toFixed(p === undefined ? 6 : +p);
    });
    return this.text(utf8(s));
  };

  // ------------------------------------------------------------- input ---
  // gfx_getchar(65536) asks about the window: 1 it has focus, 2 it is shown,
  // 4 the mouse is in it. With no argument it is the next key typed, which the
  // window's [key] hands in (Host.key); with a key it asks whether it is held.
  Host.prototype.gfx_getchar = function (fx, c) {
    if (c === 65536) return 1 | 2 | (this.mouseIn ? 4 : 0);
    if (c) return 0;
    return this.keys && this.keys.length ? this.keys.shift() : 0;
  };
  // Max's key codes as REAPER's gfx_getchar gives them: the arrows and the
  // editing keys are four-letter codes there.
  var KEYS = { 28: 0x6C656674, 29: 0x72676874, 30: 0x7570, 31: 0x646F776E, 127: 0x64656C, 8: 8, 9: 9, 13: 13, 27: 27,
               '-9': 0x6C656674, '-10': 0x72676874, '-11': 0x7570, '-12': 0x646F776E };
  Host.prototype.key = function (code) {
    (this.keys = this.keys || []).push(KEYS[code] !== undefined ? KEYS[code] : code);
    if (this.keys.length > 32) this.keys.shift();
  };
  Host.prototype.gfx_showmenu = function (fx, s) {
    if (this.choice) { var k = this.choice; this.choice = 0; return k; }
    this.menu = { text: utf8(fx.str(s)), x: this.v('x'), y: this.v('y') };
    return 0;
  };
  Host.prototype.gfx_setcursor = function () { return 0; };
  Host.prototype.gfx_getdropfile = function () { return 0; };
  Host.prototype.gfx_update = function () { return 0; };

  // A menu as gfx_showmenu writes it: items split by |, '#' greyed, '!'
  // ticked, '>' opens a submenu, '<' closes one. Numbered as REAPER numbers
  // them: every item that is not a submenu's title, in order, from 1.
  function parseMenu(text) {
    var out = [], depth = 0, n = 0;
    String(text).split('|').forEach(function (raw) {
      var t = raw, grey = false, tick = false, opens = false, closes = false;
      for (;;) {
        var c = t.charAt(0);
        if (c === '#') { grey = true; t = t.slice(1); } else if (c === '!') { tick = true; t = t.slice(1); }
        else if (c === '>') { opens = true; t = t.slice(1); } else if (c === '<') { closes = true; t = t.slice(1); } else break;
      }
      if (opens) { out.push({ label: t, title: true, depth: depth }); depth++; return; }
      if (t === '' && !closes) { out.push({ rule: true, depth: depth }); return; }
      n++;
      out.push({ label: t, index: n, grey: grey, tick: tick, depth: depth });
      if (closes) depth = Math.max(0, depth - 1);
    });
    return out;
  }

  return { Host: Host, parseMenu: parseMenu };
})();


/* ---- kit/live.js ---- */
/* The Live set, as the family's devices need it: the song's tempo, meter and
 * scale, the notes of the clip being edited, somewhere to put new notes, and
 * a way to hear notes before they are used.
 *
 * Everything goes through the Live Object Model (LiveAPI). Times are beats,
 * which in Live are quarter notes - the unit every family engine already
 * speaks - so nothing is converted but the field names.
 */
var Live = (function () {
  'use strict';
  function api(path) { return new LiveAPI(null, path); }
  function one(a, prop) { var v = a.get(prop); return Array.isArray(v) ? v[0] : v; }
  function exists(a) { return a && Number(a.id) !== 0; }
  function json(v) {
    if (typeof v === 'string') return JSON.parse(v);
    if (Array.isArray(v) && typeof v[0] === 'string' && v.length === 1) return JSON.parse(v[0]);
    return v;
  }

  // Live 12's scale names, as ScaleView numbers its scales (1-16). A scale
  // ScaleView has no name for is left out: the device keeps its own key.
  var SCALE = {
    'Major': 1, 'Minor': 2, 'Harmonic Minor': 3, 'Dorian': 5, 'Phrygian': 6, 'Lydian': 7,
    'Mixolydian': 8, 'Major Pentatonic': 10, 'Minor Pentatonic': 11, 'Minor Blues': 13,
    'Whole Tone': 14, 'Whole-half Dim.': 15, 'Half-whole Dim.': 16
  };
  // ScaleView's eighteen roots, and the spelling a key on each pitch class
  // takes: flats for the major side, sharps where a minor key has them.
  var ROOTS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb'];
  var MAJOR_SIDE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  var MINOR_SIDE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var MINORISH = { 2: 1, 3: 1, 5: 1, 6: 1, 11: 1, 13: 1 };
  var SCALE_NAMES = ['Major', 'Minor (Natural)', 'Harmonic Minor', 'Ionian', 'Dorian', 'Phrygian', 'Lydian',
                     'Mixolydian', 'Aeolian', 'Major Pentatonic', 'Minor Pentatonic', 'Major Blues', 'Minor Blues',
                     'Whole Tone', 'Diminished Whole-Half', 'Diminished Half-Whole'];

  function song() {
    var s = api('live_set');
    var out = { tempo: +one(s, 'tempo') || 120, num: +one(s, 'signature_numerator') || 4,
                den: +one(s, 'signature_denominator') || 4, playing: !!+one(s, 'is_playing'),
                position: +one(s, 'current_song_time') || 0, key: null };
    var mode = s.get('scale_mode');
    if (mode !== undefined && mode !== null) {
      var name = String(one(s, 'scale_name')), pc = +one(s, 'root_note');
      var sc = SCALE[name];
      out.liveScale = { on: !!+(Array.isArray(mode) ? mode[0] : mode), name: name, root: pc };
      if (sc) out.key = { root: ROOTS.indexOf((MINORISH[sc] ? MINOR_SIDE : MAJOR_SIDE)[((pc % 12) + 12) % 12]) + 1, scale: sc };
    }
    return out;
  }

  function detailClip() {
    var c = api('live_set view detail_clip');
    if (!exists(c) || !+one(c, 'is_midi_clip')) return null;
    return c;
  }

  // The clip being edited: its selected notes if any are selected, else every
  // note in its loop. Starts are from the start of what was taken.
  function clipNotes() {
    var c = detailClip();
    if (!c) return null;
    var from = +one(c, 'loop_start') || 0, to = +one(c, 'loop_end') || 0;
    var raw = null, selected = false;
    try { raw = json(c.call('get_selected_notes_extended')); selected = raw && raw.notes && raw.notes.length > 0; } catch (e) { raw = null; }
    if (!selected) raw = json(c.call('get_notes_extended', 0, 128, from, Math.max(0, to - from)));
    var notes = ((raw && raw.notes) || []).filter(function (n) { return !n.mute; }).map(function (n) {
      return { start: n.start_time, len: n.duration, pitch: n.pitch, vel: Math.round(n.velocity) };
    });
    var first = selected && notes.length ? Math.min.apply(null, notes.map(function (n) { return n.start; })) : from;
    var beats = to - from;
    if (selected) {
      var bar = 4, end = 0;
      notes.forEach(function (n) { end = Math.max(end, n.start + n.len); });
      first = Math.floor(first / bar) * bar;
      beats = Math.ceil((end - first) / bar) * bar;
    }
    notes.forEach(function (n) { n.start -= first; });
    notes.sort(function (a, b) { return a.start - b.start || a.pitch - b.pitch; });
    return { notes: notes, beats: beats, name: String(one(c, 'name') || ''), selected: selected, drums: drumTrack() };
  }

  // A track whose instrument is a Drum Rack plays drums: its note numbers name
  // drums, not pitches, and the engines treat them that way.
  function drumTrack() {
    try {
      var track = api('this_device canonical_parent'), n = track.getcount('devices');
      for (var i = 0; i < n; i++) if (+one(api(track.unquotedpath + ' devices ' + i), 'can_have_drum_pads')) return true;
    } catch (e) { /* not known: not drums */ }
    return false;
  }

  function liveNotes(notes) {
    return { notes: notes.map(function (n) {
      return { pitch: Math.max(0, Math.min(127, Math.round(n.pitch))), start_time: Math.max(0, n.start),
               duration: Math.max(1 / 128, n.len), velocity: Math.max(1, Math.min(127, Math.round(n.vel || 100))), mute: 0 };
    }) };
  }

  function undoable(fn) {
    var s = api('live_set');
    try { s.call('begin_undo_step'); } catch (e) { /* Live before 11.1 */ }
    try { return fn(); } finally { try { s.call('end_undo_step'); } catch (e2) { /* as above */ } }
  }

  function show(clip) {
    try { api('live_set view').set('detail_clip', 'id', Number(clip.id)); } catch (e) { /* the clip is made either way */ }
  }

  function selectedScene() {
    var scene = api('live_set view selected_scene'), n = api('live_set').getcount('scenes');
    for (var i = 0; i < n; i++) if (Number(api('live_set scenes ' + i).id) === Number(scene.id)) return i;
    return 0;
  }
  function thisTrack() {
    var track = api('this_device canonical_parent');
    if (!exists(track) || !+one(track, 'has_midi_input')) return null;
    return track;
  }
  // Where this device's track is in the set, for putting new tracks beside it.
  function trackIndex(track) {
    var n = api('live_set').getcount('tracks');
    for (var i = 0; i < n; i++) if (Number(api('live_set tracks ' + i).id) === Number(track.id)) return i;
    return n - 1;
  }
  function clipInSlot(slot, notes, beats, name) {
    slot.call('create_clip', Math.max(1, beats));
    var clip = api(slot.unquotedpath + ' clip');
    if (name) clip.set('name', name);
    clip.call('add_new_notes', liveNotes(notes));
    return clip;
  }
  function freeSlot(track, from) {
    var n = track.getcount('clip_slots');
    for (var k = 0; k < n; k++) {
      var at = (from + k) % n, slot = api(track.unquotedpath + ' clip_slots ' + at);
      if (!+one(slot, 'has_clip')) return { slot: slot, at: at };
    }
    return null;
  }
  function arrangementClipOn(track, notes, beats, name, at) {
    var before = track.getcount('arrangement_clips');
    try { track.call('create_midi_clip', at, Math.max(1, beats)); } catch (e) { /* checked below */ }
    var count = track.getcount('arrangement_clips');
    if (!(count > before)) return false;
    for (var i = 0; i < count; i++) {
      var clip = api(track.unquotedpath + ' arrangement_clips ' + i);
      if (Math.abs((+one(clip, 'start_time') || 0) - at) < 1e-6) {
        if (name) clip.set('name', name);
        clip.call('add_new_notes', liveNotes(notes));
        return true;
      }
    }
    return false;
  }

  // New notes, as a new clip in the first free slot on this device's track,
  // from the selected scene down. `more` are further parts ({name, notes}),
  // each on a new MIDI track after this one, in the same scene. Returns what
  // happened, for the status line.
  function newClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var free = freeSlot(track, selectedScene());
    if (!free) return { ok: false, message: 'Every clip slot on this track is full. Add a scene, then try again.' };
    return undoable(function () {
      var clip = clipInSlot(free.slot, notes, beats, name);
      var made = newTracks(track, more, function (t) {
        clipInSlot(api(t.unquotedpath + ' clip_slots ' + free.at), this.notes, beats, this.name);
      });
      show(clip);
      return { ok: true, message: 'Added a clip in scene ' + (free.at + 1) + (made ? ', and ' + made + ' on new tracks beside it.' : '.') };
    });
  }

  // New notes on a new MIDI track beside this one, in the selected scene:
  // a suggestion goes with the music it was made for, not over it.
  function newTrackClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var scene = selectedScene();
    return undoable(function () {
      var parts = [{ name: name, notes: notes }].concat(more || []);
      newTracks(track, parts, function (t) { show(clipInSlot(api(t.unquotedpath + ' clip_slots ' + scene), this.notes, beats, this.name)); });
      return { ok: true, message: parts.length === 1 ? 'Added a track beside this one, with the clip in scene ' + (scene + 1) + '.'
                                                     : 'Added ' + parts.length + ' tracks beside this one, with the clips in scene ' + (scene + 1) + '.' };
    });
  }

  // Each further part on a new MIDI track, in order, after this one.
  function newTracks(track, more, put) {
    if (!more || !more.length) return '';
    var at = trackIndex(track), song = api('live_set');
    more.forEach(function (part, k) {
      song.call('create_midi_track', at + 1 + k);
      var t = api('live_set tracks ' + (at + 1 + k));
      t.set('name', part.name);
      put.call(part, t);
    });
    return more.length === 1 ? 'one more part' : more.length + ' more parts';
  }

  // New notes in place of the notes of the clip being edited, from its loop start.
  function replaceInClip(notes, beats) {
    var c = detailClip();
    if (!c) return { ok: false, message: 'No MIDI clip is open. Open one in Detail View, then try again.' };
    var from = +one(c, 'loop_start') || 0;
    return undoable(function () {
      var span = Math.max(beats, (+one(c, 'loop_end') || 0) - from);
      c.call('remove_notes_extended', 0, 128, from, span);
      c.call('add_new_notes', liveNotes(notes.map(function (n) {
        return { start: n.start + from, len: n.len, pitch: n.pitch, vel: n.vel };
      })));
      if ((+one(c, 'loop_end') || 0) < from + beats) c.set('loop_end', from + beats);
      return { ok: true, message: 'Replaced the notes in “' + (String(one(c, 'name') || '') || 'the clip') + '”.' };
    });
  }

  // New notes in the Arrangement at the insert marker, on this device's track
  // (Track.create_midi_clip, Live 12.2 and later); further parts as above.
  function arrangementClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var at = +one(api('live_set'), 'current_song_time') || 0;
    return undoable(function () {
      if (!arrangementClipOn(track, notes, beats, name, at)) {
        return { ok: false, message: 'This version of Live can\u2019t add Arrangement clips from a device. Choose New Clip instead.' };
      }
      var made = newTracks(track, more, function (t) { arrangementClipOn(t, this.notes, beats, this.name, at); });
      return { ok: true, message: 'Added a clip to the Arrangement at beat ' + (Math.round(at * 100) / 100 + 1) +
               (made ? ', and ' + made + ' on new tracks beside it.' : '.') };
    });
  }

  // ------------------------------------------------------------ player ---
  // Notes heard through this device's MIDI out: the instrument after it on
  // the track plays them. A Task ticks every few milliseconds and sends what
  // is due; nothing waits on the transport.
  function Player(send) {
    this.send = send; this.events = []; this.pos = 0; this.t0 = 0; this.task = null; this.sounding = {};
    this.onEnd = null;
  }
  Player.prototype.play = function (notes, tempo, onEnd) {
    this.stop();
    var ms = 60000 / (tempo || 120), ev = [];
    notes.forEach(function (n) {
      ev.push({ t: n.start * ms, on: true, pitch: n.pitch, vel: n.vel || 100 });
      ev.push({ t: (n.start + n.len) * ms - 1, on: false, pitch: n.pitch });
    });
    ev.sort(function (a, b) { return a.t - b.t || (a.on === b.on ? 0 : a.on ? 1 : -1); });
    this.events = ev; this.pos = 0; this.t0 = Date.now(); this.onEnd = onEnd || null;
    var self = this;
    this.task = new Task(function () { self.tick(); }, this);
    this.task.interval = 4;
    this.task.repeat();
    this.tick();
  };
  Player.prototype.tick = function () {
    var now = Date.now() - this.t0;
    while (this.pos < this.events.length && this.events[this.pos].t <= now) {
      var e = this.events[this.pos++];
      if (e.on) { this.sounding[e.pitch] = (this.sounding[e.pitch] || 0) + 1; this.send([0x90, e.pitch, Math.max(1, Math.min(127, Math.round(e.vel)))]); }
      else if (this.sounding[e.pitch]) { this.sounding[e.pitch]--; this.send([0x80, e.pitch, 0]); }
    }
    if (this.pos >= this.events.length) {
      var end = this.onEnd;
      this.stop();
      if (end) end();
    }
  };
  Player.prototype.playing = function () { return !!this.task; };
  Player.prototype.stop = function () {
    if (this.task) { this.task.cancel(); this.task.freepeer && this.task.freepeer(); this.task = null; }
    var self = this;
    Object.keys(this.sounding).forEach(function (p) {
      for (var i = 0; i < self.sounding[p]; i++) self.send([0x80, +p, 0]);
    });
    this.sounding = {};
    this.onEnd = null;
  };

  return { song: song, clipNotes: clipNotes, newClip: newClip, newTrackClip: newTrackClip, replaceInClip: replaceInClip,
           arrangementClip: arrangementClip, drumTrack: drumTrack, Player: Player, ROOTS: ROOTS, SCALE_NAMES: SCALE_NAMES };
})();


/* ---- actions.js ---- */
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


/* ---- kit/jsfx_device.js ---- */
/* A family JSFX as a Max for Live MIDI effect: the .jsfx itself, unchanged,
 * on Middaw's EEL2 runtime, with its own @gfx window drawn in this [v8ui].
 *
 * The [v8ui] sits in the device's window subpatcher, which the device strip's
 * Show Window button opens. Its code runs whether the window is open or not.
 *
 * A Task ticks every few milliseconds: the MIDI that arrived since the last
 * tick goes in, a block as long as the time that passed is run, and what the
 * plug-in sends comes straight out. Live's tempo, meter, transport and song
 * position are what REAPER would give it.
 *
 * Expects, before it: Gfx, Live, MiddawJSFX, and DEVICE = { main, files,
 * actions? }. A device's own buttons (Load Clip, Insert the Take) are in
 * ACTIONS, defined in the repository's ableton/actions.js, which shares this
 * file's global scope: its own functions must not reuse a name defined here
 * (send, say, load, tick...), or this file's takes its place.
 * Inlet 0: bang (Live is ready), MIDI bytes, restore, and the strip's
 * commands. Outlets: 0 MIDI bytes, 1 the saved state to [pattr], 2 the
 * strip's status line.
 *
 * DEVICE.audio: the sound is gen~'s (ableton/kit/jsfx2gen.js), not this
 * file's. The plug-in here runs @init, @slider and @gfx only, for its window;
 * what its sliders say goes to gen~ (outlet 3, "sliderN value"), with Live's
 * tempo and transport, and MIDI goes to gen~ through the buffer~ the patcher
 * names in "mqname" (three values a message, the count at 0).
 */
inlets = 1;
outlets = DEVICE.audio ? 4 : 3;
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var SR = 48000;
var ACTIONS = typeof ACTIONS === 'undefined' ? {} : ACTIONS;

// The bundle keeps files as bytes; the runtime reads a .jsfx as text.
function source(name) {
  var t = DEVICE.files[name];
  if (t === undefined) return null;
  try { return decodeURIComponent(escape(t)); } catch (e) { return t; }
}
var fx = new MiddawJSFX.JSFX(source(DEVICE.main), { gfx: true, sampleRate: SR, readImport: source });
fx.init(SR);

var D = {
  ready: false, pending: null, task: null, last: 0, beat: 0, pos: 0,
  midiIn: [], running: [], status: '', host: new Gfx.Host(mgraphics),
  mouse: { x: -1, y: -1, cap: 0, wheel: 0 }, release: false, frameSaw: true,
  menu: null, menuSnap: null, menuMouse: null, frames: 0, song: { tempo: 120, num: 4, den: 4, playing: false }
};

function say(msg) { D.status = msg || ''; outlet(2, 'set', D.status); }
function send(data) { for (var i = 0; i < data.length; i++) outlet(0, data[i]); }

// ---------------------------------------------------------------- MIDI --
// [midiin] gives a byte at a time; a message is whole once its data are in.
function msg_int(b) {
  b = b & 255;
  if (b >= 0xF8) return;                      // real-time: not passed to the plug-in
  if (b & 0x80) { D.running = [b]; return; }
  if (!D.running.length) return;
  D.running.push(b);
  var st = D.running[0] & 0xF0, need = (st === 0xC0 || st === 0xD0) ? 2 : 3;
  if (D.running[0] >= 0xF0) { D.running = []; return; }  // system messages are not passed on
  if (D.running.length === need) {
    D.midiIn.push(need === 2 ? [D.running[0], D.running[1], 0] : D.running.slice());
    D.running = [D.running[0]];
  }
}

// --------------------------------------------------------------- clock --
function readSong() {
  try {
    var s = Live.song();
    D.song = { tempo: s.tempo, num: s.num, den: s.den, playing: s.playing, position: s.position };
  } catch (e) { /* outside Live */ }
}
// ------------------------------------------------------------ gen~ ----
var GEN = { sent: {}, mq: null, written: 0, CAP: 256, every: 0 };
function mqname(name) {
  try { GEN.mq = new Buffer(String(name)); } catch (e) { GEN.mq = null; }
}
function toGen() {
  fx.file.sliders.forEach(function (sl) {
    var v = fx.sliderByIndex(sl.index);
    if (GEN.sent[sl.index] !== v) { GEN.sent[sl.index] = v; outlet(3, 'slider' + sl.index, v); }
  });
  if ((GEN.every++ % 12) === 0) {
    outlet(3, 'tempo', D.song.tempo); outlet(3, 'play_state', D.song.playing ? 1 : 0);
    outlet(3, 'beat_position', D.song.playing ? D.song.position : D.beat);
    outlet(3, 'ts_num', D.song.num); outlet(3, 'ts_denom', D.song.den);
  }
}
function midiToGen(data) {
  if (!GEN.mq) return;
  var at = 1 + 3 * (GEN.written % GEN.CAP);
  GEN.mq.poke(1, at, [data[0], data[1], data[2]]);
  GEN.written++;
  GEN.mq.poke(1, 0, GEN.written);
}

function tick() {
  if (DEVICE.audio) {
    if ((D.frames++ & 63) === 0) readSong();
    if (D.midiIn.length) { D.midiIn.forEach(midiToGen); D.midiIn = []; }
    if ((D.frames % 5) === 0) toGen();
    if (ACTIONS.tick) ACTIONS.tick(fx);
    if ((D.frames & 511) === 0) save();
    return;
  }
  var now = Date.now();
  var ms = Math.min(100, Math.max(0, now - D.last));
  D.last = now;
  if ((D.frames++ & 63) === 0 || D.song.playing) readSong();
  var n = Math.max(1, Math.round(ms * SR / 1000));
  var spb = SR * 60 / D.song.tempo;
  fx.setTime({ tempo: D.song.tempo, num: D.song.num, den: D.song.den, playState: D.song.playing ? 1 : 0,
               beat: D.song.playing ? D.song.position : D.beat, seconds: (D.song.playing ? D.song.position : D.beat) * 60 / D.song.tempo });
  if (!D.song.playing) D.beat += n / spb;
  var midi = D.midiIn.map(function (data) { return { offset: 0, data: data }; });
  D.midiIn = [];
  var out = fx.process(n, null, null, midi);
  for (var i = 0; i < out.length; i++) send(out[i].data);
  if (ACTIONS.tick) ACTIONS.tick(fx);
  if ((D.frames & 511) === 0) save();
}
function start() {
  if (D.task) return;
  D.last = Date.now();
  D.task = new Task(tick, this);
  D.task.interval = 4;
  D.task.repeat();
  var draw = new Task(function () { mgraphics.redraw(); }, this);
  draw.interval = 33;
  draw.repeat();
  D.drawTask = draw;
}

// ------------------------------------------------------------ messages --
function bang() {
  D.ready = true;
  readSong();
  if (D.pending) { load(D.pending); D.pending = null; }
  start();
}
function restore(text) {
  var st = null;
  try { st = JSON.parse(String(text)); } catch (e) { return; }
  if (!D.ready) { D.pending = st; return; }
  load(st);
}
function load(st) {
  if (st && st.v === 1 && st.fx) { fx.deserialize(st.fx); fx.runSection('slider'); lastSaved = JSON.stringify(st); GEN.sent = {}; }
}
// The plug-in's @serialize, kept with the Live set: written when it changes,
// so an untouched device does not mark the set as changed.
var lastSaved = '';
function save() {
  var s = JSON.stringify({ v: 1, fx: fx.serialize() });
  if (s === lastSaved) return;
  lastSaved = s;
  outlet(1, 'set', s);
}
// The strip's buttons: "action <name>".
function action(name) {
  var a = ACTIONS[name];
  if (!a) return;
  try { var msg = a(fx, Live); if (msg) say(msg); } catch (e) { say(String(e.message || e)); }
  save();
  mgraphics.redraw();
}
// Keys typed while the window has focus, from its [key].
function key(code) { D.host.key(code); mgraphics.redraw(); }
function anything() {
  var a = ACTIONS[messagename];
  if (a) action(messagename);
}

// --------------------------------------------------------------- paint --
function size() {
  var r = (typeof box !== 'undefined' && box.rect) ? box.rect : [0, 0].concat(fx.file.gfxSize || [800, 600]);
  return [r[2] - r[0], r[3] - r[1]];
}
function paint() {
  var g = mgraphics, sz = size(), h = D.host;
  var clear = fx.getVar('gfx_clear');
  var c = clear >= 0 ? clear : 0;           // REAPER keeps the last frame for -1; a [v8ui] cannot
  g.set_source_rgba((c & 255) / 255, ((c >> 8) & 255) / 255, ((c >> 16) & 255) / 255, 1);
  g.rectangle(0, 0, sz[0], sz[1]);
  g.fill();
  if (D.menu) { frame(g, sz, D.menuMouse); drawMenu(g, sz); return; }
  var snap = new Float64Array(fx.v);
  var mouse = { x: D.mouse.x, y: D.mouse.y, cap: D.mouse.cap, wheel: D.mouse.wheel };
  D.mouse.wheel = 0;
  frame(g, sz, mouse);
  D.frameSaw = true;
  if (D.release) { D.release = false; D.mouse.cap = 0; }
  if (h.menu) { D.menu = { items: Gfx.parseMenu(h.menu.text), x: mouse.x, y: mouse.y, hover: -1 }; D.menuSnap = snap; D.menuMouse = mouse; }
}
function frame(g, sz, mouse) {
  D.host.begin(g, fx);
  D.host.mouseIn = mouse.x >= 0 && mouse.y >= 0 && mouse.x < sz[0] && mouse.y < sz[1];
  try { fx.runGfx(D.host, sz[0], sz[1], mouse); } catch (e) { say('The window stopped: ' + (e.message || e)); }
}

// The menu gfx_showmenu asked for, over the window.
var ITEM_H = 20;
function menuRect(sz) {
  var m = D.menu, w = 40;
  mgraphics.select_font_face('Arial', 'normal', 'normal');
  mgraphics.set_font_size(12);
  m.items.forEach(function (it) { if (it.label) w = Math.max(w, mgraphics.text_measure(it.label)[0] + 40 + it.depth * 12); });
  var h = m.items.length * ITEM_H + 8;
  var x = Math.min(m.x, sz[0] - w - 2), y = Math.min(m.y, sz[1] - h - 2);
  return [Math.max(0, x), Math.max(0, y), w, h];
}
function drawMenu(g, sz) {
  var r = menuRect(sz), m = D.menu;
  g.set_source_rgba(0.165, 0.184, 0.216, 1); g.rectangle(r[0], r[1], r[2], r[3]); g.fill();
  g.set_source_rgba(0.227, 0.251, 0.29, 1); g.set_line_width(1); g.rectangle(r[0] + 0.5, r[1] + 0.5, r[2] - 1, r[3] - 1); g.stroke();
  m.items.forEach(function (it, i) {
    var y = r[1] + 4 + i * ITEM_H;
    if (it.rule) { g.set_source_rgba(0.227, 0.251, 0.29, 1); g.rectangle(r[0] + 6, y + ITEM_H / 2, r[2] - 12, 1); g.fill(); return; }
    if (i === m.hover && it.index && !it.grey) { g.set_source_rgba(1, 0.949, 0, 1); g.rectangle(r[0] + 2, y, r[2] - 4, ITEM_H); g.fill(); }
    var on = i === m.hover && it.index && !it.grey;
    var ink = on ? [0.078, 0.09, 0.11] : it.grey || it.title ? [0.714, 0.737, 0.776] : [0.867, 0.882, 0.906];
    g.set_source_rgba(ink[0], ink[1], ink[2], 1);
    g.move_to(r[0] + 22 + it.depth * 12, y + 14);
    g.show_text(it.label);
    if (it.tick) { g.move_to(r[0] + 7 + it.depth * 12, y + 14); g.show_text('✓'); }
  });
}
function menuAt(x, y) {
  var r = menuRect(size());
  if (x < r[0] || x >= r[0] + r[2] || y < r[1] + 4 || y >= r[1] + r[3] - 4) return -1;
  return Math.floor((y - r[1] - 4) / ITEM_H);
}
function chooseMenu(i) {
  var m = D.menu, it = i >= 0 ? m.items[i] : null;
  if (it && (!it.index || it.grey)) return;          // a title, a rule or a greyed item: the menu stays
  D.menu = null;
  // The frame that asked runs again from where it started, and gets the answer.
  fx.v.set(D.menuSnap);
  D.host.choice = it ? it.index : 0;
  if (!it) { D.host.choice = 0; D.host.cancelled = true; }
  var g = mgraphics, sz = size();
  if (it) frame(g, sz, D.menuMouse);
  D.host.choice = 0;
  D.mouse.cap = 0;
  save();
  mgraphics.redraw();
}

// --------------------------------------------------------------- mouse --
// REAPER's mouse_cap: 1 left, 2 right, 4 Command, 8 Shift, 16 Option, 32 Control.
function caps(but, cmd, shift, opt, ctrl) {
  return (ctrl ? 2 : 1) | (cmd ? 4 : 0) | (shift ? 8 : 0) | (opt ? 16 : 0);
}
function onclick(x, y, but, cmd, shift, capslock, opt, ctrl) {
  if (D.menu) { chooseMenu(menuAt(x, y)); return; }
  D.mouse.x = x; D.mouse.y = y; D.mouse.cap = caps(but, cmd, shift, opt, ctrl);
  D.frameSaw = false;
  mgraphics.redraw();
}
function ondrag(x, y, but) {
  if (D.menu) return;
  D.mouse.x = x; D.mouse.y = y;
  if (!but) {
    // A click shorter than a frame is still seen down for one frame.
    if (D.frameSaw) D.mouse.cap = 0; else D.release = true;
    save();
  }
  mgraphics.redraw();
}
function onidle(x, y) {
  if (D.menu) { var i = menuAt(x, y); if (i !== D.menu.hover) { D.menu.hover = i; mgraphics.redraw(); } return; }
  D.mouse.x = x; D.mouse.y = y;
}
function onidleout() { if (!D.menu) { D.mouse.x = -1; D.mouse.y = -1; } }
function onwheel(x, y, dx, dy) { D.mouse.wheel += Math.round(dy * 120); mgraphics.redraw(); }

