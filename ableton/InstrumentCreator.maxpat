{
 "patcher": {
  "fileversion": 1,
  "appversion": {
   "major": 9,
   "minor": 0,
   "revision": 0,
   "architecture": "x64",
   "modernui": 1
  },
  "classnamespace": "box",
  "rect": [
   100.0,
   100.0,
   960.0,
   560.0
  ],
  "openinpresentation": 1,
  "default_fontsize": 10.0,
  "default_fontface": 0,
  "default_fontname": "Arial",
  "gridonopen": 1,
  "gridsize": [
   8.0,
   8.0
  ],
  "gridsnaponopen": 1,
  "objectsnaponopen": 1,
  "statusbarvisible": 2,
  "toolbarvisible": 1,
  "boxes": [
   {
    "box": {
     "id": "obj-1",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      20.0,
      20.0,
      50.0,
      22.0
     ],
     "outlettype": [
      "int"
     ],
     "text": "midiin"
    }
   },
   {
    "box": {
     "id": "obj-2",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      120.0,
      20.0,
      90.0,
      22.0
     ],
     "outlettype": [
      "bang",
      "int",
      "int"
     ],
     "text": "live.thisdevice"
    }
   },
   {
    "box": {
     "id": "obj-3",
     "maxclass": "newobj",
     "numinlets": 2,
     "numoutlets": 4,
     "patching_rect": [
      20.0,
      200.0,
      140.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      "",
      ""
     ],
     "text": "p window",
     "patcher": {
      "fileversion": 1,
      "appversion": {
       "major": 9,
       "minor": 0,
       "revision": 0,
       "architecture": "x64",
       "modernui": 1
      },
      "classnamespace": "box",
      "rect": [
       80.0,
       80.0,
       940.0,
       720.0
      ],
      "openinpresentation": 1,
      "toolbarvisible": 0,
      "statusbarvisible": 0,
      "enablehscroll": 0,
      "enablevscroll": 0,
      "title": "Instrument Creator",
      "boxes": [
       {
        "box": {
         "id": "obj-1",
         "maxclass": "inlet",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          20.0,
          20.0,
          30.0,
          30.0
         ],
         "outlettype": [
          ""
         ],
         "text": "inlet",
         "comment": "window"
        }
       },
       {
        "box": {
         "id": "obj-2",
         "maxclass": "inlet",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          120.0,
          20.0,
          30.0,
          30.0
         ],
         "outlettype": [
          ""
         ],
         "text": "inlet",
         "comment": "MIDI, bang, restore, actions"
        }
       },
       {
        "box": {
         "id": "obj-3",
         "maxclass": "v8ui",
         "numinlets": 1,
         "numoutlets": 4,
         "patching_rect": [
          120.0,
          80.0,
          940.0,
          720.0
         ],
         "outlettype": [
          "",
          "",
          "",
          ""
         ],
         "filename": "InstrumentCreator.js",
         "parameter_enable": 0,
         "border": 0,
         "presentation": 1,
         "presentation_rect": [
          0.0,
          0.0,
          940.0,
          720.0
         ]
        }
       },
       {
        "box": {
         "id": "obj-4",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          120.0,
          840.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-5",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          240.0,
          840.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-6",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          360.0,
          840.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-7",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          480.0,
          840.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-8",
         "maxclass": "newobj",
         "numinlets": 0,
         "numoutlets": 4,
         "patching_rect": [
          320.0,
          20.0,
          40.0,
          22.0
         ],
         "outlettype": [
          "int",
          "int",
          "int",
          "int"
         ],
         "text": "key"
        }
       },
       {
        "box": {
         "id": "obj-9",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 1,
         "patching_rect": [
          320.0,
          50.0,
          75.0,
          22.0
         ],
         "outlettype": [
          ""
         ],
         "text": "prepend key"
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "obj-8",
          0
         ],
         "destination": [
          "obj-9",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-9",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-2",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          0
         ],
         "destination": [
          "obj-4",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          1
         ],
         "destination": [
          "obj-5",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          2
         ],
         "destination": [
          "obj-6",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          3
         ],
         "destination": [
          "obj-7",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "obj-4",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 0,
     "patching_rect": [
      20.0,
      420.0,
      55.0,
      22.0
     ],
     "text": "midiout"
    }
   },
   {
    "box": {
     "id": "obj-5",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      200.0,
      420.0,
      80.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      ""
     ],
     "text": "pattr state",
     "parameter_enable": 1,
     "varname": "state",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "state",
       "parameter_shortname": "state",
       "parameter_type": 3,
       "parameter_invisible": 1,
       "parameter_initial_enable": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-6",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      200.0,
      460.0,
      95.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "prepend restore"
    }
   },
   {
    "box": {
     "id": "obj-7",
     "maxclass": "comment",
     "numinlets": 1,
     "numoutlets": 0,
     "patching_rect": [
      420.0,
      420.0,
      244.0,
      40.0
     ],
     "text": "Show Window opens Instrument Creator's own window.",
     "presentation": 1,
     "presentation_rect": [
      8.0,
      8.0,
      244.0,
      40.0
     ],
     "linecount": 2,
     "textcolor": [
      0.867,
      0.882,
      0.906,
      1.0
     ],
     "fontsize": 11.0
    }
   },
   {
    "box": {
     "id": "obj-8",
     "maxclass": "live.text",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      420.0,
      20.0,
      120.0,
      20.0
     ],
     "outlettype": [
      "",
      ""
     ],
     "text": "Show Window",
     "texton": "Show Window",
     "mode": 0,
     "parameter_enable": 0,
     "presentation": 1,
     "presentation_rect": [
      8.0,
      56.0,
      118.0,
      22.0
     ]
    }
   },
   {
    "box": {
     "id": "obj-9",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      420.0,
      60.0,
      80.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      ""
     ],
     "text": "route bang 1"
    }
   },
   {
    "box": {
     "id": "obj-10",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      100.0,
      30.0,
      22.0
     ],
     "outlettype": [
      "bang"
     ],
     "text": "t b"
    }
   },
   {
    "box": {
     "id": "obj-11",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      140.0,
      40.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "open"
    }
   },
   {
    "box": {
     "id": "obj-12",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      180.0,
      60.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "pcontrol"
    }
   },
   {
    "box": {
     "id": "obj-13",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      20.0,
      300.0,
      160.0,
      22.0
     ],
     "outlettype": [
      "signal",
      "signal"
     ],
     "text": "gen~",
     "patcher": {
      "fileversion": 1,
      "appversion": {
       "major": 9,
       "minor": 0,
       "revision": 0,
       "architecture": "x64",
       "modernui": 1
      },
      "classnamespace": "dsp.gen",
      "rect": [
       100.0,
       100.0,
       700.0,
       600.0
      ],
      "boxes": [
       {
        "box": {
         "id": "obj-1",
         "maxclass": "newobj",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          20.0,
          20.0,
          40.0,
          22.0
         ],
         "outlettype": [
          ""
         ],
         "text": "in 1"
        }
       },
       {
        "box": {
         "id": "obj-2",
         "maxclass": "codebox",
         "numinlets": 1,
         "numoutlets": 2,
         "patching_rect": [
          20.0,
          80.0,
          600.0,
          400.0
         ],
         "outlettype": [
          "",
          ""
         ],
         "code": "// Instrument Creator \u2014 Build Impossible Instruments from Parts - translated by ableton/kit/jsfx2gen.js. Do not edit; rebuild.\nData V(691);\nData M(524288);\nBuffer mq;\nParam slider1(0, min=0, max=5);\nParam slider2(0, min=0, max=5);\nParam slider3(5, min=0, max=5);\nParam slider4(12, min=0, max=30);\nParam slider5(0, min=0, max=4);\nParam slider6(12, min=0, max=30);\nParam slider7(2, min=0, max=3);\nParam slider8(0, min=0, max=3);\nParam slider9(1, min=0, max=4);\nParam slider10(2, min=0, max=3);\nParam slider11(0, min=0, max=4);\nParam slider12(0, min=0, max=4);\nParam slider13(70, min=0, max=100);\nParam slider14(100, min=25, max=400);\nParam slider15(0, min=(-100), max=100);\nParam slider16(100, min=10, max=400);\nParam slider17(20, min=2, max=50);\nParam slider18(50, min=0, max=100);\nParam slider19(0, min=0, max=1);\nParam slider20(120, min=5, max=1000);\nParam slider21(0, min=(-100), max=100);\nParam slider22(0, min=(-36), max=12);\nParam slider23(0, min=0, max=100);\nParam tempo(120, min=1, max=999);\nParam play_state(0, min=0, max=8);\nParam beat_position(0);\nParam ts_num(4, min=1, max=64);\nParam ts_denom(4, min=1, max=64);\n\neel_mod(a, b) { ib = trunc(abs(b)); return ib >= 1 ? trunc(abs(a)) - ib * floor(trunc(abs(a)) / ib) : 0; }\neel_bor(a, b) { return bitor(trunc(a), trunc(b)); }\neel_band(a, b) { return bitand(trunc(a), trunc(b)); }\neel_bxor(a, b) { return bitxor(trunc(a), trunc(b)); }\neel_shl(a, b) { return trunc(a) * pow(2, trunc(b)); }\neel_shr(a, b) { return floor(trunc(a) / pow(2, trunc(b))); }\n\nf_mat_def(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0;\n  r = 0;\n  t1 = (peek(V, 103) + (p0 * peek(V, 104)));\n  poke(V, t1, 248);\n  t2 = trunc(peek(V, 248) + 13 + 0.00001);\n  t3 = trunc(peek(V, 248) + 14 + 0.00001);\n  poke(M, 0, t3);\n  poke(M, 0, t2);\n  t4 = trunc(peek(V, 248) + 0.00001);\n  t5 = p1;\n  poke(M, t5, t4);\n  t6 = trunc(peek(V, 248) + 1 + 0.00001);\n  t7 = p2;\n  poke(M, t7, t6);\n  t8 = trunc(peek(V, 248) + 2 + 0.00001);\n  t9 = p3;\n  poke(M, t9, t8);\n  t10 = trunc(peek(V, 248) + 3 + 0.00001);\n  t11 = p4;\n  poke(M, t11, t10);\n  t12 = trunc(peek(V, 248) + 4 + 0.00001);\n  t13 = p5;\n  poke(M, t13, t12);\n  t14 = trunc(peek(V, 248) + 5 + 0.00001);\n  t15 = p6;\n  poke(M, t15, t14);\n  t16 = trunc(peek(V, 248) + 6 + 0.00001);\n  t17 = p7;\n  poke(M, t17, t16);\n  t18 = trunc(peek(V, 248) + 7 + 0.00001);\n  t19 = p8;\n  poke(M, t19, t18);\n  t20 = trunc(peek(V, 248) + 8 + 0.00001);\n  t21 = p9;\n  poke(M, t21, t20);\n  t22 = trunc(peek(V, 248) + 9 + 0.00001);\n  t23 = p10;\n  poke(M, t23, t22);\n  t24 = trunc(peek(V, 248) + 10 + 0.00001);\n  t25 = p11;\n  poke(M, t25, t24);\n  t26 = trunc(peek(V, 248) + 11 + 0.00001);\n  t27 = p12;\n  poke(M, t27, t26);\n  t28 = trunc(peek(V, 248) + 12 + 0.00001);\n  t29 = p13;\n  poke(M, t29, t28);\n  r = t29;\n  return r;\n}\n\nf_jz(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  t1 = trunc(peek(V, 110) + (peek(V, 249) * 2) + 0.00001);\n  t2 = p0;\n  poke(M, t2, t1);\n  t3 = trunc(peek(V, 110) + ((peek(V, 249) * 2) + 1) + 0.00001);\n  t4 = p1;\n  poke(M, t4, t3);\n  t5 = (peek(V, 249) + 1);\n  poke(V, t5, 249);\n  r = t5;\n  return r;\n}\n\nf_trim_row(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0;\n  r = 0;\n  t1 = ((peek(V, 263) + (p0 * 36)) + (p1 * 6));\n  poke(V, t1, 265);\n  t2 = trunc(peek(V, 265) + 0.00001);\n  t3 = p2;\n  poke(M, t3, t2);\n  t4 = trunc(peek(V, 265) + 1 + 0.00001);\n  t5 = p3;\n  poke(M, t5, t4);\n  t6 = trunc(peek(V, 265) + 2 + 0.00001);\n  t7 = p4;\n  poke(M, t7, t6);\n  t8 = trunc(peek(V, 265) + 3 + 0.00001);\n  t9 = p5;\n  poke(M, t9, t8);\n  t10 = trunc(peek(V, 265) + 4 + 0.00001);\n  t11 = p6;\n  poke(M, t11, t10);\n  t12 = trunc(peek(V, 265) + 5 + 0.00001);\n  t13 = p7;\n  poke(M, t13, t12);\n  r = t13;\n  return r;\n}\n\nf_all_off(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  poke(V, 0, 338);\n  t1 = min(1048576, trunc(peek(V, 99)));\n  for (t2 = 0; t2 < t1; t2 += 1) {\n    t3 = (peek(V, 97) + (peek(V, 338) * peek(V, 98)));\n    poke(V, t3, 339);\n    t4 = trunc(peek(V, 339) + peek(V, 131) + 0.00001);\n    poke(M, 0, t4);\n    t5 = (peek(V, 338) + 1);\n    poke(V, t5, 338);\n  }\n  poke(V, 0, 331);\n  r = 0;\n  return r;\n}\n\nf_energy_params(V, M, mq, p0) {\n  r = 0;\n  if ((abs((abs(p0 - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 1, 362);\n    poke(V, 0.035, 363);\n    poke(V, 0.06, 364);\n    poke(V, 0.035, 365);\n    poke(V, 11, 366);\n    poke(V, 0.25, 367);\n    poke(V, 1.3, 368);\n    poke(V, 1, 369);\n    poke(V, 0.4, 370);\n    r = 0.4;\n  }\n  else {\n    if ((abs((abs(p0 - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      poke(V, 1, 362);\n      poke(V, 0.08, 363);\n      poke(V, 0.1, 364);\n      poke(V, 0.025, 365);\n      poke(V, 15, 366);\n      poke(V, 0.45, 367);\n      poke(V, 1, 368);\n      poke(V, 1, 369);\n      poke(V, 0.4, 370);\n      r = 0.4;\n    }\n    else {\n      if ((abs((abs(p0 - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        poke(V, 0, 362);\n        poke(V, 0.004, 363);\n        poke(V, 0.05, 364);\n        poke(V, 0.01, 365);\n        poke(V, 0, 366);\n        poke(V, 0, 367);\n        poke(V, 2.2, 368);\n        poke(V, 1.3, 369);\n        poke(V, 0.5, 370);\n        poke(V, 0.15, 371);\n        r = 0.15;\n      }\n      else {\n        if ((abs((abs(p0 - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          poke(V, 0, 362);\n          poke(V, 0.0015, 363);\n          poke(V, 0.05, 364);\n          poke(V, 0.02, 365);\n          poke(V, 0, 366);\n          poke(V, 0, 367);\n          poke(V, 0.55, 368);\n          poke(V, 1.2, 369);\n          poke(V, 0.35, 370);\n          poke(V, 0.1, 371);\n          r = 0.1;\n        }\n        else {\n          if ((abs((abs(p0 - 4) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n            poke(V, 0, 362);\n            poke(V, 0.0008, 363);\n            poke(V, 0.05, 364);\n            poke(V, 0.01, 365);\n            poke(V, 0, 366);\n            poke(V, 0, 367);\n            poke(V, 0.8, 368);\n            poke(V, 1.8, 369);\n            poke(V, 0.25, 370);\n            poke(V, 0.06, 371);\n            r = 0.06;\n          }\n          else {\n            poke(V, 1, 362);\n            poke(V, 0.003, 363);\n            poke(V, 0.012, 364);\n            poke(V, 0, 365);\n            poke(V, 25, 366);\n            poke(V, 0, 367);\n            poke(V, 0.6, 368);\n            poke(V, 0.7, 369);\n            poke(V, 0.4, 370);\n            r = 0.4;\n          }\n        }\n      }\n    }\n  }\n  return r;\n}\n\nf_blown_now(V, M, mq) {\n  r = 0;\n  r = (eel_bor(peek(V, 1), 0) <= 1 ? 1 : 0);\n  return r;\n}\n\nf_mat(V, M, mq, p0, p1) {\n  r = 0;\n  r = peek(M, trunc(peek(V, 103) + ((p0 * peek(V, 104)) + p1) + 0.00001));\n  return r;\n}\n\nf_bq_pk(V, M, mq, p0, p1, p2, p3) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0;\n  r = 0;\n  t1 = (((2 * 3.141592653589793) * min(p1, (0.45 * peek(V, 89)))) / peek(V, 89));\n  poke(V, t1, 385);\n  t2 = pow(10, (p3 / 40));\n  poke(V, t2, 386);\n  t3 = (sin(peek(V, 385)) / (2 * p2));\n  poke(V, t3, 387);\n  t4 = cos(peek(V, 385));\n  poke(V, t4, 388);\n  t5 = (1 + (peek(V, 387) / peek(V, 386)));\n  poke(V, t5, 389);\n  t6 = trunc(p0 + 0.00001);\n  t7 = ((1 + (peek(V, 387) * peek(V, 386))) / peek(V, 389));\n  poke(M, t7, t6);\n  t8 = trunc(p0 + 1 + 0.00001);\n  t9 = (((-2) * peek(V, 388)) / peek(V, 389));\n  poke(M, t9, t8);\n  t10 = trunc(p0 + 2 + 0.00001);\n  t11 = ((1 - (peek(V, 387) * peek(V, 386))) / peek(V, 389));\n  poke(M, t11, t10);\n  t12 = trunc(p0 + 3 + 0.00001);\n  t13 = (((-2) * peek(V, 388)) / peek(V, 389));\n  poke(M, t13, t12);\n  t14 = trunc(p0 + 4 + 0.00001);\n  t15 = ((1 - (peek(V, 387) / peek(V, 386))) / peek(V, 389));\n  poke(M, t15, t14);\n  r = t15;\n  return r;\n}\n\nf_bq_hp(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (((2 * 3.141592653589793) * min(p1, (0.45 * peek(V, 89)))) / peek(V, 89));\n  poke(V, t1, 390);\n  t2 = (sin(peek(V, 390)) / (2 * p2));\n  poke(V, t2, 391);\n  t3 = cos(peek(V, 390));\n  poke(V, t3, 392);\n  t4 = (1 + peek(V, 391));\n  poke(V, t4, 393);\n  t5 = trunc(p0 + 0.00001);\n  t6 = (((1 + peek(V, 392)) / 2) / peek(V, 393));\n  poke(M, t6, t5);\n  t7 = trunc(p0 + 1 + 0.00001);\n  t8 = ((-(1 + peek(V, 392))) / peek(V, 393));\n  poke(M, t8, t7);\n  t9 = trunc(p0 + 2 + 0.00001);\n  t10 = (((1 + peek(V, 392)) / 2) / peek(V, 393));\n  poke(M, t10, t9);\n  t11 = trunc(p0 + 3 + 0.00001);\n  t12 = (((-2) * peek(V, 392)) / peek(V, 393));\n  poke(M, t12, t11);\n  t13 = trunc(p0 + 4 + 0.00001);\n  t14 = ((1 - peek(V, 391)) / peek(V, 393));\n  poke(M, t14, t13);\n  r = t14;\n  return r;\n}\n\nf_bq_lp(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (((2 * 3.141592653589793) * min(p1, (0.45 * peek(V, 89)))) / peek(V, 89));\n  poke(V, t1, 394);\n  t2 = (sin(peek(V, 394)) / (2 * p2));\n  poke(V, t2, 395);\n  t3 = cos(peek(V, 394));\n  poke(V, t3, 396);\n  t4 = (1 + peek(V, 395));\n  poke(V, t4, 397);\n  t5 = trunc(p0 + 0.00001);\n  t6 = (((1 - peek(V, 396)) / 2) / peek(V, 397));\n  poke(M, t6, t5);\n  t7 = trunc(p0 + 1 + 0.00001);\n  t8 = ((1 - peek(V, 396)) / peek(V, 397));\n  poke(M, t8, t7);\n  t9 = trunc(p0 + 2 + 0.00001);\n  t10 = (((1 - peek(V, 396)) / 2) / peek(V, 397));\n  poke(M, t10, t9);\n  t11 = trunc(p0 + 3 + 0.00001);\n  t12 = (((-2) * peek(V, 396)) / peek(V, 397));\n  poke(M, t12, t11);\n  t13 = trunc(p0 + 4 + 0.00001);\n  t14 = ((1 - peek(V, 395)) / peek(V, 397));\n  poke(M, t14, t13);\n  r = t14;\n  return r;\n}\n\nf_setup_coupler(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0;\n  r = 0;\n  t1 = peek(V, 120);\n  poke(V, t1, 384);\n  if ((abs((abs(peek(V, 346) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t2 = f_bq_pk(V, M, mq, peek(V, 384), 2500, 1.2, 6);\n    t3 = f_bq_hp(V, M, mq, (peek(V, 384) + 5), 90, 0.7);\n    r = t3;\n  }\n  else {\n    if ((abs((abs(peek(V, 346) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t4 = f_bq_pk(V, M, mq, peek(V, 384), 450, 1, 6);\n      t5 = f_bq_lp(V, M, mq, (peek(V, 384) + 5), 7000, 0.7);\n      r = t5;\n    }\n    else {\n      if ((abs((abs(peek(V, 346) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t6 = f_bq_pk(V, M, mq, peek(V, 384), (800 / sqrt(abs(peek(V, 353)))), 2, 8);\n        t7 = f_bq_lp(V, M, mq, (peek(V, 384) + 5), 9000, 0.7);\n        r = t7;\n      }\n      else {\n        t8 = f_bq_pk(V, M, mq, peek(V, 384), 1800, 0.9, 3);\n        t9 = f_bq_hp(V, M, mq, (peek(V, 384) + 5), 200, 0.7);\n        r = t9;\n      }\n    }\n  }\n  return r;\n}\n\nf_age_eta(V, M, mq, p0) {\n  r = 0;\n  r = (1 + ((peek(V, 288) * peek(V, 288)) * (peek(V, 276) + (peek(V, 277) * max(0, (p0 / 2000))))));\n  return r;\n}\n\nf_body_mode(V, M, mq, p0, p1, p2, p3, p4) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  if ((abs((((abs((((abs((p0 > 20 ? 1 : 0)) >= 0.00001) && (abs((p0 < (0.45 * peek(V, 89)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((peek(V, 258) < peek(V, 116) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t1 = (peek(V, 114) + (peek(V, 258) * peek(V, 115)));\n    poke(V, t1, 403);\n    t2 = exp((((-3.141592653589793) * p0) / (p1 * peek(V, 89))));\n    poke(V, t2, 404);\n    t3 = (((2 * 3.141592653589793) * p0) / peek(V, 89));\n    poke(V, t3, 405);\n    t4 = trunc(peek(V, 403) + 0.00001);\n    t5 = ((2 * peek(V, 404)) * cos(peek(V, 405)));\n    poke(M, t5, t4);\n    t6 = trunc(peek(V, 403) + 1 + 0.00001);\n    t7 = (peek(V, 404) * peek(V, 404));\n    poke(M, t7, t6);\n    t8 = trunc(peek(V, 403) + 4 + 0.00001);\n    t9 = ((1 - peek(V, 404)) * p2);\n    poke(M, t9, t8);\n    t10 = trunc(peek(V, 403) + 5 + 0.00001);\n    t11 = p3;\n    poke(M, t11, t10);\n    t12 = trunc(peek(V, 403) + 6 + 0.00001);\n    t13 = p4;\n    poke(M, t13, t12);\n    t14 = (peek(V, 258) + 1);\n    poke(V, t14, 258);\n    r = t14;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_setup_body(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0;\n  r = 0;\n  poke(V, 0, 258);\n  t1 = peek(V, 114);\n  t2 = min(trunc((peek(V, 116) * peek(V, 115))), 8388608);\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    poke(M, 0, trunc(t1 + t3 + 0.00001));\n  }\n  t4 = f_mat(V, M, mq, peek(V, 345), peek(V, 233));\n  t5 = (t4 * pow(10, 9));\n  t6 = f_mat(V, M, mq, peek(V, 345), peek(V, 234));\n  t7 = max(0.35, min(2.5, sqrt(abs(((t5 / t6) / ((11 * pow(10, 9)) / 440))))));\n  poke(V, t7, 398);\n  t8 = f_mat(V, M, mq, peek(V, 345), peek(V, 235));\n  poke(V, t8, 399);\n  if ((abs((abs(peek(V, 344) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 400);\n    t9 = min(1048576, trunc(12));\n    r = 0;\n    for (t10 = 0; t10 < t9; t10 += 1) {\n      t11 = ((abs((abs(peek(V, 400) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 98 : ((abs((abs(peek(V, 400) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 204 : ((abs((abs(peek(V, 400) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 226 : ((abs((abs(peek(V, 400) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 381 : ((abs((abs(peek(V, 400) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 437 : ((abs((abs(peek(V, 400) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 552 : ((abs((abs(peek(V, 400) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 650 : ((abs((abs(peek(V, 400) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 780 : ((abs((abs(peek(V, 400) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 920 : ((abs((abs(peek(V, 400) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1100 : ((abs((abs(peek(V, 400) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1450 : 2000)))))))))));\n      poke(V, t11, 401);\n      t12 = (((abs((abs(peek(V, 400) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? peek(V, 401) : (peek(V, 401) * peek(V, 398))) / peek(V, 353));\n      poke(V, t12, 401);\n      if ((abs((abs(peek(V, 400) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t13 = (20 / (1 + peek(V, 288)));\n      }\n      else {\n        t14 = f_mat(V, M, mq, peek(V, 345), peek(V, 235));\n        t15 = (peek(V, 401) / 1000);\n        t16 = f_mat(V, M, mq, peek(V, 345), peek(V, 236));\n        t17 = (t14 * pow(t15, t16));\n        t18 = f_age_eta(V, M, mq, peek(V, 401));\n        t13 = (1 / ((t17 * t18) + 0.018));\n      }\n      poke(V, t13, 402);\n      t19 = f_body_mode(V, M, mq, peek(V, 401), peek(V, 402), (1 / sqrt(abs((1 + (0.5 * peek(V, 400)))))), sin(((peek(V, 400) * 2.1) + 0.4)), cos(((peek(V, 400) * 1.3) + 0.9)));\n      t20 = (peek(V, 400) + 1);\n      poke(V, t20, 400);\n      r = t20;\n    }\n  }\n  else {\n    if ((abs((abs(peek(V, 344) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t21 = f_body_mode(V, M, mq, (140 / peek(V, 353)), 14, 1.4, 1, 1);\n      t22 = f_body_mode(V, M, mq, (640 / peek(V, 353)), 22, 0.6, 0.8, (-0.5));\n      t23 = f_body_mode(V, M, mq, (1060 / peek(V, 353)), 25, 0.45, (-0.4), 0.8);\n      t24 = f_body_mode(V, M, mq, (1480 / peek(V, 353)), 25, 0.35, 0.6, 0.6);\n      poke(V, 2, 400);\n      t25 = min(1048576, trunc(6));\n      r = 0;\n      for (t26 = 0; t26 < t25; t26 += 1) {\n        t27 = (((((520 * peek(V, 398)) * peek(V, 400)) * ((peek(V, 400) * peek(V, 400)) - 1)) / sqrt(abs(((peek(V, 400) * peek(V, 400)) + 1)))) / (3 * peek(V, 353)));\n        poke(V, t27, 401);\n        t28 = peek(V, 399);\n        t29 = (peek(V, 401) / 1000);\n        t30 = f_mat(V, M, mq, peek(V, 345), peek(V, 236));\n        t31 = (t28 * pow(t29, t30));\n        t32 = f_age_eta(V, M, mq, peek(V, 401));\n        t33 = (1 / ((t31 * t32) + 0.004));\n        poke(V, t33, 402);\n        t34 = f_body_mode(V, M, mq, peek(V, 401), peek(V, 402), (0.35 / sqrt(abs(peek(V, 400)))), cos((peek(V, 400) * 0.5)), sin((peek(V, 400) * 2.2)));\n        t35 = (peek(V, 400) + 1);\n        poke(V, t35, 400);\n        r = t35;\n      }\n    }\n    else {\n      if ((abs((abs(peek(V, 344) - 4) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        poke(V, 0, 400);\n        t36 = min(1048576, trunc(16));\n        r = 0;\n        for (t37 = 0; t37 < t36; t37 += 1) {\n          t38 = ((((280 * peek(V, 398)) * peek(M, trunc(peek(V, 113) + (peek(V, 400) * 3) + 0.00001))) / peek(M, trunc(peek(V, 113) + 0.00001))) / peek(V, 353));\n          poke(V, t38, 401);\n          t39 = peek(V, 399);\n          t40 = (peek(V, 401) / 1000);\n          t41 = f_mat(V, M, mq, peek(V, 345), peek(V, 236));\n          t42 = (t39 * pow(t40, t41));\n          t43 = f_age_eta(V, M, mq, peek(V, 401));\n          t44 = (1 / ((t42 * t43) + 0.003));\n          poke(V, t44, 402);\n          t45 = f_body_mode(V, M, mq, peek(V, 401), peek(V, 402), (0.9 / sqrt(abs((1 + (0.3 * peek(V, 400)))))), sin((peek(M, trunc(peek(V, 113) + ((peek(V, 400) * 3) + 1) + 0.00001)) * 2.2)), cos((peek(M, trunc(peek(V, 113) + ((peek(V, 400) * 3) + 2) + 0.00001)) * 1.7)));\n          t46 = (peek(V, 400) + 1);\n          poke(V, t46, 400);\n          r = t46;\n        }\n      }\n      else {\n        r = 0;\n      }\n    }\n  }\n  return r;\n}\n\nf_bq_off(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  t1 = trunc(p0 + 0.00001);\n  poke(M, 1, t1);\n  t2 = trunc(p0 + 1 + 0.00001);\n  t3 = trunc(p0 + 2 + 0.00001);\n  t4 = trunc(p0 + 3 + 0.00001);\n  t5 = trunc(p0 + 4 + 0.00001);\n  poke(M, 0, t5);\n  poke(M, 0, t4);\n  poke(M, 0, t3);\n  poke(M, 0, t2);\n  r = 0;\n  return r;\n}\n\nf_setup_radiator(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0;\n  r = 0;\n  t1 = (peek(V, 120) + 10);\n  poke(V, t1, 406);\n  if ((abs((abs(peek(V, 347) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t2 = f_bq_hp(V, M, mq, peek(V, 406), 180, 0.6);\n    t3 = f_bq_pk(V, M, mq, (peek(V, 406) + 5), 1500, 0.8, 4);\n    t4 = f_bq_off(V, M, mq, (peek(V, 406) + 10));\n  }\n  else {\n    if ((abs((abs(peek(V, 347) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t5 = f_bq_pk(V, M, mq, peek(V, 406), 250, 0.9, 3);\n      t6 = f_bq_lp(V, M, mq, (peek(V, 406) + 5), 7500, 0.7);\n      t7 = f_bq_off(V, M, mq, (peek(V, 406) + 10));\n    }\n    else {\n      if ((abs((abs(peek(V, 347) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t8 = f_bq_hp(V, M, mq, peek(V, 406), 120, 0.7);\n        t9 = f_bq_pk(V, M, mq, (peek(V, 406) + 5), 2200, 1.5, 6);\n        t10 = f_bq_lp(V, M, mq, (peek(V, 406) + 10), 9000, 0.7);\n      }\n      else {\n        t11 = f_bq_hp(V, M, mq, peek(V, 406), 90, 0.8);\n        t12 = f_bq_lp(V, M, mq, (peek(V, 406) + 5), 5000, 0.9);\n        t13 = f_bq_pk(V, M, mq, (peek(V, 406) + 10), 2800, 3, 4);\n      }\n    }\n  }\n  t14 = peek(V, 117);\n  t15 = min(trunc((peek(V, 118) * 8)), 8388608);\n  for (t16 = 0; t16 < t15; t16 += 1) {\n    poke(M, 0, trunc(t14 + t16 + 0.00001));\n  }\n  poke(V, 0, 407);\n  t17 = min(1048576, trunc(peek(V, 118)));\n  for (t18 = 0; t18 < t17; t18 += 1) {\n    t19 = (peek(V, 117) + (peek(V, 407) * 8));\n    poke(V, t19, 408);\n    t20 = (((170 / peek(V, 353)) * peek(M, trunc(peek(V, 110) + (peek(V, 407) * 2) + 0.00001))) / 2.4048);\n    poke(V, t20, 409);\n    t21 = exp(((-6.9078) / (0.25 * peek(V, 89))));\n    poke(V, t21, 410);\n    t22 = (((2 * 3.141592653589793) * min(peek(V, 409), (0.45 * peek(V, 89)))) / peek(V, 89));\n    poke(V, t22, 411);\n    t23 = trunc(peek(V, 408) + 0.00001);\n    t24 = ((2 * peek(V, 410)) * cos(peek(V, 411)));\n    poke(M, t24, t23);\n    t25 = trunc(peek(V, 408) + 1 + 0.00001);\n    t26 = (peek(V, 410) * peek(V, 410));\n    poke(M, t26, t25);\n    t27 = trunc(peek(V, 408) + 4 + 0.00001);\n    t28 = (((1 - peek(V, 410)) * 0.8) / sqrt(abs((1 + peek(V, 407)))));\n    poke(M, t28, t27);\n    t29 = trunc(peek(V, 408) + 5 + 0.00001);\n    t30 = cos((peek(V, 407) * 1.1));\n    poke(M, t30, t29);\n    t31 = trunc(peek(V, 408) + 6 + 0.00001);\n    t32 = sin(((peek(V, 407) * 1.1) + 0.6));\n    poke(M, t32, t31);\n    t33 = (peek(V, 407) + 1);\n    poke(V, t33, 407);\n  }\n  poke(V, 0, 407);\n  t34 = min(1048576, trunc(8));\n  r = 0;\n  for (t35 = 0; t35 < t34; t35 += 1) {\n    t36 = trunc(peek(V, 259) + peek(V, 407) + 0.00001);\n    t37 = floor(min((peek(V, 127) - 2), (((((abs((abs(peek(V, 407) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3.1 : ((abs((abs(peek(V, 407) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5.3 : ((abs((abs(peek(V, 407) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 7.9 : ((abs((abs(peek(V, 407) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 11.3 : ((abs((abs(peek(V, 407) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3.7 : ((abs((abs(peek(V, 407) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5.9 : ((abs((abs(peek(V, 407) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 8.3 : 12.1))))))) * 0.001) * peek(V, 89)) * peek(V, 353))));\n    poke(M, t37, t36);\n    t38 = (peek(V, 407) + 1);\n    poke(V, t38, 407);\n    r = t38;\n  }\n  return r;\n}\n\nf_update_globals(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0;\n  r = 0;\n  t1 = eel_bor(peek(V, 0), 0);\n  poke(V, t1, 340);\n  t2 = eel_bor(peek(V, 1), 0);\n  poke(V, t2, 341);\n  t3 = eel_bor(peek(V, 2), 0);\n  poke(V, t3, 342);\n  t4 = eel_bor(peek(V, 3), 0);\n  poke(V, t4, 343);\n  t5 = eel_bor(peek(V, 4), 0);\n  poke(V, t5, 344);\n  t6 = eel_bor(peek(V, 5), 0);\n  poke(V, t6, 345);\n  t7 = eel_bor(peek(V, 6), 0);\n  poke(V, t7, 346);\n  t8 = eel_bor(peek(V, 7), 0);\n  poke(V, t8, 347);\n  t9 = eel_bor(peek(V, 8), 0);\n  poke(V, t9, 348);\n  t10 = eel_bor(peek(V, 9), 0);\n  poke(V, t10, 349);\n  t11 = eel_bor(peek(V, 10), 0);\n  poke(V, t11, 350);\n  t12 = eel_bor(peek(V, 11), 0);\n  poke(V, t12, 351);\n  t13 = (peek(V, 12) / 100);\n  poke(V, t13, 352);\n  t14 = (peek(V, 13) / 100);\n  poke(V, t14, 353);\n  t15 = peek(V, 14);\n  poke(V, t15, 354);\n  t16 = (peek(V, 15) / 100);\n  poke(V, t16, 355);\n  t17 = (peek(V, 16) / 100);\n  poke(V, t17, 356);\n  t18 = (peek(V, 17) / 100);\n  poke(V, t18, 357);\n  t19 = eel_bor(peek(V, 18), 0);\n  poke(V, t19, 358);\n  t20 = peek(V, 19);\n  poke(V, t20, 359);\n  t21 = (peek(V, 20) / 100);\n  poke(V, t21, 360);\n  t22 = pow(10, (peek(V, 21) / 20));\n  poke(V, t22, 361);\n  t23 = f_energy_params(V, M, mq, peek(V, 340));\n  t24 = (peek(V, 22) / 100);\n  poke(V, t24, 288);\n  t25 = f_blown_now(V, M, mq);\n  t26 = ((abs(t25) >= 0.00001) ? 1 : pow(10, ((peek(V, 279) * peek(V, 288)) / 20)));\n  poke(V, t26, 289);\n  t27 = f_mat(V, M, mq, peek(V, 343), peek(V, 247));\n  t28 = max(t27, (peek(V, 286) * pow(peek(V, 288), 1.5)));\n  poke(V, t28, 372);\n  t29 = f_mat(V, M, mq, peek(V, 343), peek(V, 246));\n  t30 = max(t29, ((peek(V, 287) * peek(V, 288)) * peek(V, 288)));\n  poke(V, t30, 373);\n  t31 = (((abs((((abs((abs(peek(V, 341) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 341) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 341) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0);\n  poke(V, t31, 374);\n  t32 = ((abs((((abs((abs(peek(V, 346) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((((abs((abs(peek(V, 341) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 341) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 6 : peek(V, 341));\n  poke(V, t32, 375);\n  t33 = ((abs((abs(peek(V, 348) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 7 : 2);\n  poke(V, t33, 376);\n  t34 = pow(2, (peek(V, 354) / 50));\n  poke(V, t34, 377);\n  t35 = ((abs((abs(peek(V, 346) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.9 : ((abs((abs(peek(V, 346) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.75 : 1));\n  poke(V, t35, 378);\n  t36 = (1 - exp(((-1) / (max(0.0005, peek(V, 363)) * peek(V, 89)))));\n  poke(V, t36, 379);\n  t37 = (1 - exp(((-1) / (max(0.002, peek(V, 364)) * peek(V, 89)))));\n  poke(V, t37, 380);\n  t38 = ((abs((abs(peek(V, 348) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? (1 - exp((((-16) * 3) / ((max(5, peek(V, 359)) * 0.001) * peek(V, 89))))) : 1);\n  poke(V, t38, 381);\n  t39 = exp(((-16) / (0.09 * peek(V, 89))));\n  poke(V, t39, 382);\n  t40 = (1 - exp(((((-2) * 3.141592653589793) * 900) / peek(V, 89))));\n  poke(V, t40, 383);\n  t41 = f_setup_coupler(V, M, mq);\n  t42 = f_setup_body(V, M, mq);\n  t43 = f_setup_radiator(V, M, mq);\n  t44 = pow(10, (((peek(M, trunc(peek(V, 264) + peek(V, 344) + 0.00001)) + peek(M, trunc(peek(V, 264) + (5 + peek(V, 346)) + 0.00001))) + peek(M, trunc(peek(V, 264) + (9 + peek(V, 347)) + 0.00001))) / 20));\n  poke(V, t44, 262);\n  poke(V, 1, 412);\n  r = 1;\n  return r;\n}\n\nf_pdef(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0;\n  r = 0;\n  t1 = (peek(V, 426) + (p0 * peek(V, 427)));\n  poke(V, t1, 429);\n  t2 = trunc(peek(V, 429) + 0.00001);\n  t3 = p1;\n  poke(M, t3, t2);\n  t4 = trunc(peek(V, 429) + 1 + 0.00001);\n  t5 = p2;\n  poke(M, t5, t4);\n  t6 = trunc(peek(V, 429) + 2 + 0.00001);\n  t7 = p3;\n  poke(M, t7, t6);\n  t8 = trunc(peek(V, 429) + 3 + 0.00001);\n  t9 = p4;\n  poke(M, t9, t8);\n  t10 = trunc(peek(V, 429) + 4 + 0.00001);\n  t11 = p5;\n  poke(M, t11, t10);\n  t12 = trunc(peek(V, 429) + 5 + 0.00001);\n  t13 = p6;\n  poke(M, t13, t12);\n  t14 = trunc(peek(V, 429) + 6 + 0.00001);\n  t15 = p7;\n  poke(M, t15, t14);\n  t16 = trunc(peek(V, 429) + 7 + 0.00001);\n  t17 = p8;\n  poke(M, t17, t16);\n  t18 = trunc(peek(V, 429) + 8 + 0.00001);\n  t19 = p9;\n  poke(M, t19, t18);\n  t20 = trunc(peek(V, 429) + 9 + 0.00001);\n  t21 = p10;\n  poke(M, t21, t20);\n  t22 = trunc(peek(V, 429) + 10 + 0.00001);\n  t23 = p11;\n  poke(M, t23, t22);\n  t24 = trunc(peek(V, 429) + 11 + 0.00001);\n  t25 = p12;\n  poke(M, t25, t24);\n  t26 = trunc(peek(V, 429) + 12 + 0.00001);\n  t27 = p13;\n  poke(M, t27, t26);\n  t28 = trunc(peek(V, 429) + 13 + 0.00001);\n  t29 = p14;\n  poke(M, t29, t28);\n  t30 = trunc(peek(V, 429) + 14 + 0.00001);\n  t31 = p15;\n  poke(M, t31, t30);\n  t32 = trunc(peek(V, 429) + 15 + 0.00001);\n  t33 = p16;\n  poke(M, t33, t32);\n  t34 = trunc(peek(V, 429) + 16 + 0.00001);\n  t35 = p17;\n  poke(M, t35, t34);\n  t36 = trunc(peek(V, 429) + 17 + 0.00001);\n  t37 = p18;\n  poke(M, t37, t36);\n  t38 = trunc(peek(V, 429) + 18 + 0.00001);\n  t39 = p19;\n  poke(M, t39, t38);\n  r = t39;\n  return r;\n}\n\nf_hash1(V, M, mq, p0) {\n  t1 = 0;\n  r = 0;\n  t1 = (sin(((p0 * 12.9898) + 78.233)) * 43758.5453);\n  poke(V, t1, 460);\n  r = ((2 * (peek(V, 460) - floor(peek(V, 460)))) - 1);\n  return r;\n}\n\nf_tuning_cents(V, M, mq, p0) {\n  t1 = 0; t2 = 0;\n  r = 0;\n  if ((abs((abs(peek(V, 349) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t1 = f_hash1(V, M, mq, p0);\n    r = (8 * t1);\n  }\n  else {\n    if ((abs((abs(peek(V, 349) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t2 = ((p0 - 69) / 12);\n      poke(V, t2, 461);\n      r = ((2.2 * peek(V, 461)) * abs(peek(V, 461)));\n    }\n    else {\n      r = 0;\n    }\n  }\n  return r;\n}\n\nf_valve_cents(V, M, mq, p0) {\n  t1 = 0;\n  r = 0;\n  t1 = eel_mod((p0 + 2), 12);\n  poke(V, t1, 462);\n  if ((abs((abs(peek(V, 462) - 5) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    r = 12;\n  }\n  else {\n    if ((abs((abs(peek(V, 462) - 6) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      r = 22;\n    }\n    else {\n      if ((abs((abs(peek(V, 462) - 11) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        r = 6;\n      }\n      else {\n        r = 0;\n      }\n    }\n  }\n  return r;\n}\n\nf_age_detune(V, M, mq, p0) {\n  t1 = 0; t2 = 0;\n  r = 0;\n  t1 = (peek(V, 282) * peek(V, 288));\n  t2 = f_hash1(V, M, mq, ((p0 * 7.31) + 3));\n  r = (t1 * t2);\n  return r;\n}\n\nf_start_pulse(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0;\n  r = 0;\n  t1 = f_mat(V, M, mq, peek(V, 343), peek(V, 239));\n  t2 = max(0.05, t1);\n  poke(V, t2, 463);\n  t3 = (((((abs((abs(peek(V, 341) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.0009 : ((abs((abs(peek(V, 341) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.0014 : 0.004)) * peek(V, 368)) * (1.3 - (0.6 * peek(M, trunc(p0 + peek(V, 133) + 0.00001))))) / sqrt(abs(peek(V, 463))));\n  poke(V, t3, 464);\n  if ((abs((abs(peek(V, 350) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t4 = (peek(V, 464) * 2);\n    poke(V, t4, 464);\n  }\n  t5 = trunc(p0 + peek(V, 146) + 0.00001);\n  t6 = max(3, (min(0.02, peek(V, 464)) * peek(V, 89)));\n  poke(M, t6, t5);\n  t7 = trunc(p0 + peek(V, 144) + 0.00001);\n  poke(M, 0, t7);\n  t8 = trunc(p0 + peek(V, 145) + 0.00001);\n  t9 = p1;\n  poke(M, t9, t8);\n  if ((abs((abs(peek(V, 341) - 4) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t10 = trunc(p0 + peek(V, 206) + 0.00001);\n    t11 = floor((0.002 * peek(V, 89)));\n    poke(M, t11, t10);\n    r = t11;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_ph1(V, M, mq, p0, p1) {\n  r = 0;\n  r = (p0 - (2 * atan(((p1 * sin(p0)) / (1 + (p1 * cos(p0)))))));\n  return r;\n}\n\nf_gd1(V, M, mq, p0, p1) {\n  r = 0;\n  r = ((1 - (p1 * p1)) / ((1 + ((2 * p1) * cos(p0))) + (p1 * p1)));\n  return r;\n}\n\nf_disp_diff(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0;\n  r = 0;\n  t1 = peek(V, 477);\n  t2 = f_gd1(V, M, mq, peek(V, 478), p0);\n  t3 = f_gd1(V, M, mq, peek(V, 479), p0);\n  r = (t1 * (t2 - t3));\n  return r;\n}\n\nf_disp_solve(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0;\n  r = 0;\n  if ((abs((((abs((peek(V, 477) <= 0 ? 1 : 0)) >= 0.00001) || (abs((p0 <= 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    r = 0;\n  }\n  else {\n    t1 = peek(V, 256);\n    poke(V, t1, 480);\n    poke(V, 0, 481);\n    t2 = f_disp_diff(V, M, mq, peek(V, 480));\n    if ((abs((t2 <= p0 ? 1 : 0)) >= 0.00001)) {\n      r = peek(V, 480);\n    }\n    else {\n      t3 = min(1048576, trunc(40));\n      for (t4 = 0; t4 < t3; t4 += 1) {\n        t5 = (0.5 * (peek(V, 480) + peek(V, 481)));\n        poke(V, t5, 482);\n        t6 = f_disp_diff(V, M, mq, peek(V, 482));\n        if ((abs((t6 > p0 ? 1 : 0)) >= 0.00001)) {\n          t7 = peek(V, 482);\n          poke(V, t7, 480);\n        }\n        else {\n          t8 = peek(V, 482);\n          poke(V, t8, 481);\n        }\n      }\n      r = (0.5 * (peek(V, 480) + peek(V, 481)));\n    }\n  }\n  return r;\n}\n\nf_mat_t60(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0;\n  r = 0;\n  t1 = (peek(V, 103) + (p0 * peek(V, 104)));\n  poke(V, t1, 483);\n  t2 = (peek(M, trunc(peek(V, 483) + 2 + 0.00001)) * pow((max(p1, 20) / 1000), peek(M, trunc(peek(V, 483) + 3 + 0.00001))));\n  t3 = f_age_eta(V, M, mq, p1);\n  t4 = (t2 * t3);\n  poke(V, t4, 484);\n  r = (1 / (((1 + (peek(V, 278) * peek(V, 288))) / peek(M, trunc(peek(V, 483) + 11 + 0.00001))) + ((p1 * peek(V, 484)) / 2.2)));\n  return r;\n}\n\nf_damp_mul(V, M, mq, p0) {\n  r = 0;\n  if ((abs((abs(peek(V, 350) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    r = (1 / (1 + (p0 / 2500)));\n  }\n  else {\n    if ((abs((abs(peek(V, 350) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      r = (1 / (1 + (p0 / 1500)));\n    }\n    else {\n      if ((abs((abs(peek(V, 350) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        r = (1 / sqrt(abs((1 + pow((p0 / 600), 2)))));\n      }\n      else {\n        if ((abs((abs(peek(V, 350) - 4) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          r = (1 / (1 + (p0 / 1200)));\n        }\n        else {\n          r = 1;\n        }\n      }\n    }\n  }\n  return r;\n}\n\nf_bright_mul(V, M, mq, p0) {\n  t1 = 0;\n  r = 0;\n  t1 = (log((max(p0, 1) / 500)) / log(8));\n  poke(V, t1, 485);\n  r = pow(peek(V, 377), max(0, min(1, peek(V, 485))));\n  return r;\n}\n\nf_hole_mul(V, M, mq, p0) {\n  t1 = 0;\n  r = 0;\n  if ((abs((abs(peek(V, 348) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t1 = (p0 / max(1500, (2.2 * peek(V, 468))));\n    poke(V, t1, 486);\n    r = max(0.3, (1 / (1 + (peek(V, 486) * peek(V, 486)))));\n  }\n  else {\n    r = 1;\n  }\n  return r;\n}\n\nf_held_t60(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0;\n  r = 0;\n  t1 = f_mat_t60(V, M, mq, p0, p1);\n  t2 = ((t1 * peek(V, 355)) * peek(V, 378));\n  t3 = f_damp_mul(V, M, mq, p1);\n  t4 = (t2 * t3);\n  t5 = f_bright_mul(V, M, mq, p1);\n  t6 = (t4 * t5);\n  t7 = f_hole_mul(V, M, mq, p1);\n  t8 = (t6 * t7);\n  poke(V, t8, 487);\n  if ((abs((abs(peek(V, 350) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t9 = min(peek(V, 487), 0.35);\n    poke(V, t9, 487);\n  }\n  r = peek(V, 487);\n  return r;\n}\n\nf_tube_alpha(V, M, mq, p0, p1) {\n  r = 0;\n  r = ((sqrt(abs((3.141592653589793 * p0))) * peek(V, 232)) / (p1 * peek(V, 227)));\n  return r;\n}\n\nf_op_fit2(V, M, mq, p0, p1, p2, p3) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0;\n  r = 0;\n  t1 = min(p0, 0.9999995);\n  p0 = t1;\n  t2 = min(p2, p0);\n  p2 = t2;\n  t3 = pow((p2 / p0), 2);\n  poke(V, t3, 498);\n  if ((abs((peek(V, 498) > 0.999999 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 499);\n    t4 = p0;\n    poke(V, t4, 500);\n    r = t4;\n  }\n  else {\n    t5 = cos(p1);\n    poke(V, t5, 501);\n    t6 = cos(p3);\n    poke(V, t6, 502);\n    t7 = (1 - peek(V, 498));\n    poke(V, t7, 503);\n    t8 = (peek(V, 501) - (peek(V, 498) * peek(V, 502)));\n    poke(V, t8, 504);\n    t9 = max(0, ((peek(V, 504) * peek(V, 504)) - (peek(V, 503) * peek(V, 503))));\n    poke(V, t9, 505);\n    t10 = max(0, min(0.95, ((peek(V, 504) - sqrt(abs(peek(V, 505)))) / peek(V, 503))));\n    poke(V, t10, 499);\n    t11 = (p0 * sqrt(abs(((1 - ((2 * peek(V, 499)) * peek(V, 501))) + (peek(V, 499) * peek(V, 499))))));\n    poke(V, t11, 500);\n    t12 = min(peek(V, 500), (0.9999995 * (1 - peek(V, 499))));\n    poke(V, t12, 500);\n    r = t12;\n  }\n  return r;\n}\n\nf_wg_loss(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0;\n  r = 0;\n  t1 = pow(10, (((-3) * peek(M, trunc(p0 + peek(V, 199) + 0.00001))) / max(0.002, p1)));\n  poke(V, t1, 496);\n  t2 = pow(10, (((-3) * peek(M, trunc(p0 + peek(V, 200) + 0.00001))) / max(0.002, p2)));\n  poke(V, t2, 497);\n  t3 = f_op_fit2(V, M, mq, peek(V, 496), (((2 * 3.141592653589793) * peek(M, trunc(p0 + peek(V, 187) + 0.00001))) / peek(V, 89)), peek(V, 497), (((2 * 3.141592653589793) * peek(M, trunc(p0 + peek(V, 198) + 0.00001))) / peek(V, 89)));\n  t4 = trunc(p0 + peek(V, 155) + 0.00001);\n  t5 = peek(V, 500);\n  poke(M, t5, t4);\n  t6 = trunc(p0 + peek(V, 156) + 0.00001);\n  t7 = peek(V, 499);\n  poke(M, t7, t6);\n  r = t7;\n  return r;\n}\n\nf_wg_setup(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0; t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0; t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0; t106 = 0; t107 = 0; t108 = 0; t109 = 0; t110 = 0; t111 = 0;\n  r = 0;\n  t1 = trunc(p0 + peek(V, 188) + 0.00001);\n  poke(M, 1, t1);\n  t2 = min(5000, (0.4 * peek(V, 89)));\n  poke(V, t2, 469);\n  t3 = trunc(p0 + peek(V, 198) + 0.00001);\n  t4 = peek(V, 469);\n  poke(M, t4, t3);\n  if ((abs((abs(peek(V, 342) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t5 = trunc(p0 + peek(V, 189) + 0.00001);\n    poke(M, 1, t5);\n    t6 = trunc(p0 + peek(V, 158) + 0.00001);\n    poke(M, (-1), t6);\n    t7 = trunc(p0 + peek(V, 190) + 0.00001);\n    poke(M, 2, t7);\n    t8 = trunc(p0 + peek(V, 195) + 0.00001);\n    t9 = peek(V, 356);\n    poke(M, t9, t8);\n    if ((abs((((abs(peek(V, 374)) >= 0.00001) && (abs((abs(peek(V, 375) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t10 = trunc(p0 + peek(V, 189) + 0.00001);\n      poke(M, 0, t10);\n      t11 = trunc(p0 + peek(V, 158) + 0.00001);\n      poke(M, 1, t11);\n      t12 = trunc(p0 + peek(V, 190) + 0.00001);\n      t13 = peek(V, 272);\n      poke(M, t13, t12);\n      t14 = trunc(p0 + peek(V, 203) + 0.00001);\n      poke(M, 1, t14);\n    }\n    if ((abs((((abs(peek(V, 374)) >= 0.00001) && (abs((abs(peek(V, 375) - 6) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t15 = trunc(p0 + peek(V, 189) + 0.00001);\n      poke(M, 0, t15);\n      t16 = trunc(p0 + peek(V, 158) + 0.00001);\n      poke(M, (-1), t16);\n      t17 = trunc(p0 + peek(V, 190) + 0.00001);\n      poke(M, 3, t17);\n      t18 = trunc(p0 + peek(V, 203) + 0.00001);\n      poke(M, 1, t18);\n    }\n    t19 = max(0.04, min(2.2, (0.65 * pow(2, ((-(peek(M, trunc(p0 + peek(V, 132) + 0.00001)) - 52)) / 18)))));\n    poke(V, t19, 470);\n    t20 = f_mat(V, M, mq, peek(V, 343), peek(V, 240));\n    t21 = (0.0008 * t20);\n    poke(V, t21, 471);\n    t22 = (3.141592653589793 * 3.141592653589793);\n    t23 = f_mat(V, M, mq, peek(V, 343), peek(V, 233));\n    t24 = ((((t22 * t23) * pow(10, 9)) * peek(V, 471)) * peek(V, 471));\n    t25 = f_mat(V, M, mq, peek(V, 343), peek(V, 234));\n    t26 = min(0.05, (t24 / ((((64 * t25) * pow(peek(V, 470), 4)) * p1) * p1)));\n    poke(V, t26, 472);\n    t27 = min(peek(V, 469), (0.3 * peek(V, 89)));\n    poke(V, t27, 473);\n    t28 = (peek(V, 473) / p1);\n    poke(V, t28, 474);\n    t29 = min(1048576, trunc(30));\n    for (t30 = 0; t30 < t29; t30 += 1) {\n      t31 = (0.5 * (peek(V, 474) + (peek(V, 473) / (p1 * sqrt(abs((1 + ((peek(V, 472) * peek(V, 474)) * peek(V, 474)))))))));\n      poke(V, t31, 474);\n    }\n    t32 = max(peek(V, 474), 2);\n    poke(V, t32, 474);\n    t33 = ((peek(V, 474) * p1) * sqrt(abs((1 + ((peek(V, 472) * peek(V, 474)) * peek(V, 474))))));\n    poke(V, t33, 469);\n    t34 = trunc(p0 + peek(V, 198) + 0.00001);\n    t35 = peek(V, 469);\n    poke(M, t35, t34);\n    t36 = (sqrt(abs((1 + peek(V, 472)))) / (p1 * (1 + (2 * peek(V, 472)))));\n    poke(V, t36, 475);\n    t37 = (sqrt(abs((1 + ((peek(V, 472) * peek(V, 474)) * peek(V, 474))))) / (p1 * (1 + (((2 * peek(V, 472)) * peek(V, 474)) * peek(V, 474)))));\n    poke(V, t37, 476);\n    t38 = trunc(p0 + peek(V, 199) + 0.00001);\n    t39 = peek(V, 475);\n    poke(M, t39, t38);\n    t40 = trunc(p0 + peek(V, 200) + 0.00001);\n    t41 = peek(V, 476);\n    poke(M, t41, t40);\n    poke(V, 4, 477);\n    t42 = ((((2 * 3.141592653589793) * p1) * sqrt(abs((1 + peek(V, 472))))) / peek(V, 89));\n    poke(V, t42, 478);\n    t43 = (((2 * 3.141592653589793) * peek(V, 469)) / peek(V, 89));\n    poke(V, t43, 479);\n    poke(V, (-0.9), 256);\n    t44 = 0;\n    while (t44 < 1048576) {\n      t45 = (abs((peek(V, 256) < (-0.02) ? 1 : 0)) >= 0.00001) ? 1 : 0;\n      if (t45 != 0) {\n        t46 = peek(V, 477);\n        t47 = f_ph1(V, M, mq, peek(V, 478), peek(V, 256));\n        t45 = (abs(((t46 * t47) > ((0.4 * 2) * 3.141592653589793) ? 1 : 0)) >= 0.00001) ? 1 : 0;\n      }\n      if (!(abs(t45) >= 0.00001)) {\n        break;\n      }\n      t48 = (peek(V, 256) + 0.02);\n      poke(V, t48, 256);\n      t44 += 1;\n    }\n    t49 = trunc(p0 + peek(V, 159) + 0.00001);\n    t50 = f_disp_solve(V, M, mq, ((peek(V, 475) - peek(V, 476)) * peek(V, 89)));\n    poke(M, t50, t49);\n    poke(V, (-0.9), 256);\n    t51 = trunc(p0 + peek(V, 160) + 0.00001);\n    t52 = ((abs((((abs((((abs((peek(M, trunc(p0 + peek(V, 159) + 0.00001)) < 0 ? 1 : 0)) >= 0.00001) && (abs(((abs((((abs(peek(V, 374)) >= 0.00001) && (abs((abs(peek(V, 375) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs(((abs(peek(V, 293)) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 4 : 0);\n    poke(M, t52, t51);\n    t53 = trunc(p0 + peek(V, 196) + 0.00001);\n    t54 = f_held_t60(V, M, mq, peek(V, 343), p1);\n    poke(M, t54, t53);\n    t55 = trunc(p0 + peek(V, 197) + 0.00001);\n    t56 = f_held_t60(V, M, mq, peek(V, 343), peek(V, 469));\n    poke(M, t56, t55);\n  }\n  else {\n    t57 = trunc(p0 + peek(V, 189) + 0.00001);\n    poke(M, 0, t57);\n    if ((abs(peek(V, 374)) >= 0.00001)) {\n      if ((abs((abs(peek(V, 375) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t58 = trunc(p0 + peek(V, 158) + 0.00001);\n        poke(M, (-1), t58);\n        t59 = trunc(p0 + peek(V, 190) + 0.00001);\n        poke(M, 1, t59);\n      }\n      else {\n        if ((abs((abs(peek(V, 375) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t60 = trunc(p0 + peek(V, 158) + 0.00001);\n          poke(M, 1, t60);\n          t61 = trunc(p0 + peek(V, 190) + 0.00001);\n          t62 = peek(V, 272);\n          poke(M, t62, t61);\n          t63 = trunc(p0 + peek(V, 203) + 0.00001);\n          poke(M, 1, t63);\n        }\n        else {\n          if ((abs((abs(peek(V, 375) - 6) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n            t64 = trunc(p0 + peek(V, 158) + 0.00001);\n            poke(M, (-1), t64);\n            t65 = trunc(p0 + peek(V, 190) + 0.00001);\n            poke(M, 3, t65);\n            t66 = trunc(p0 + peek(V, 203) + 0.00001);\n            poke(M, 1, t66);\n          }\n          else {\n            t67 = trunc(p0 + peek(V, 158) + 0.00001);\n            t68 = peek(V, 297);\n            poke(M, t68, t67);\n            t69 = trunc(p0 + peek(V, 190) + 0.00001);\n            t70 = peek(V, 298);\n            poke(M, t70, t69);\n          }\n        }\n      }\n    }\n    else {\n      if ((abs((((abs((abs(peek(V, 346) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 344) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t71 = trunc(p0 + peek(V, 158) + 0.00001);\n        poke(M, 1, t71);\n        t72 = trunc(p0 + peek(V, 190) + 0.00001);\n        poke(M, 2, t72);\n      }\n      else {\n        t73 = trunc(p0 + peek(V, 158) + 0.00001);\n        poke(M, (-1), t73);\n        t74 = trunc(p0 + peek(V, 190) + 0.00001);\n        poke(M, 1, t74);\n      }\n    }\n    t75 = f_mat(V, M, mq, peek(V, 343), peek(V, 238));\n    t76 = f_mat(V, M, mq, peek(V, 343), peek(V, 233));\n    t77 = (min(2.2, (t75 * (1 + (0.15 * min(6, (1 / max(t76, 0.0001))))))) * (1 + (peek(V, 280) * peek(V, 288))));\n    poke(V, t77, 488);\n    t78 = max(0.003, min(0.03, (0.007 * pow((262 / p1), 0.3))));\n    poke(V, t78, 489);\n    t79 = (peek(M, trunc(p0 + peek(V, 190) + 0.00001)) / (2 * p1));\n    poke(V, t79, 490);\n    t80 = trunc(p0 + peek(V, 199) + 0.00001);\n    t81 = peek(V, 490);\n    poke(M, t81, t80);\n    t82 = trunc(p0 + peek(V, 200) + 0.00001);\n    t83 = peek(V, 490);\n    poke(M, t83, t82);\n    t84 = (((2 * 3.141592653589793) * peek(V, 489)) / peek(V, 227));\n    poke(V, t84, 491);\n    t85 = (((-peek(V, 227)) * peek(V, 490)) * peek(V, 488));\n    t86 = f_tube_alpha(V, M, mq, p1, peek(V, 489));\n    t87 = (exp((t85 * t86)) * exp(((-0.5) * pow((peek(V, 491) * p1), 2))));\n    poke(V, t87, 492);\n    t88 = (((-peek(V, 227)) * peek(V, 490)) * peek(V, 488));\n    t89 = f_tube_alpha(V, M, mq, peek(V, 469), peek(V, 489));\n    t90 = (exp((t88 * t89)) * exp(((-0.5) * pow((peek(V, 491) * peek(V, 469)), 2))));\n    poke(V, t90, 493);\n    t91 = (((-6.9078) * peek(V, 490)) / log(min(peek(V, 492), 0.999999)));\n    poke(V, t91, 494);\n    t92 = (((-6.9078) * peek(V, 490)) / log(max(0.000001, min(peek(V, 493), 0.999999))));\n    poke(V, t92, 495);\n    t93 = trunc(p0 + peek(V, 196) + 0.00001);\n    t94 = ((peek(V, 494) * peek(V, 355)) * peek(V, 378));\n    t95 = f_damp_mul(V, M, mq, p1);\n    t96 = (t94 * t95);\n    poke(M, t96, t93);\n    t97 = trunc(p0 + peek(V, 197) + 0.00001);\n    t98 = peek(M, trunc(p0 + peek(V, 196) + 0.00001));\n    t99 = ((peek(V, 495) * peek(V, 355)) * peek(V, 378));\n    t100 = f_damp_mul(V, M, mq, peek(V, 469));\n    t101 = (t99 * t100);\n    t102 = f_bright_mul(V, M, mq, peek(V, 469));\n    t103 = (t101 * t102);\n    t104 = f_hole_mul(V, M, mq, peek(V, 469));\n    t105 = min(t98, (t103 * t104));\n    poke(M, t105, t97);\n    if ((abs((abs(peek(V, 350) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t106 = trunc(p0 + peek(V, 196) + 0.00001);\n      t107 = min(peek(M, trunc(p0 + peek(V, 196) + 0.00001)), 0.35);\n      poke(M, t107, t106);\n      t108 = trunc(p0 + peek(V, 197) + 0.00001);\n      t109 = min(peek(M, trunc(p0 + peek(V, 197) + 0.00001)), 0.35);\n      poke(M, t109, t108);\n    }\n  }\n  t110 = f_wg_loss(V, M, mq, p0, peek(M, trunc(p0 + peek(V, 196) + 0.00001)), peek(M, trunc(p0 + peek(V, 197) + 0.00001)));\n  t111 = trunc(p0 + peek(V, 183) + 0.00001);\n  poke(M, 0, t111);\n  r = 0;\n  return r;\n}\n\nf_besj(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (0.5 * p1);\n  poke(V, t1, 514);\n  poke(V, 1, 515);\n  poke(V, 1, 516);\n  t2 = min(1048576, trunc(p0));\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = (peek(V, 514) / peek(V, 516));\n    t5 = (peek(V, 515) * t4);\n    poke(V, t5, 515);\n    t6 = (peek(V, 516) + 1);\n    poke(V, t6, 516);\n  }\n  t7 = peek(V, 515);\n  poke(V, t7, 517);\n  poke(V, 1, 516);\n  t8 = min(1048576, trunc(40));\n  for (t9 = 0; t9 < t8; t9 += 1) {\n    t10 = (((-peek(V, 514)) * peek(V, 514)) / (peek(V, 516) * (peek(V, 516) + p0)));\n    t11 = (peek(V, 515) * t10);\n    poke(V, t11, 515);\n    t12 = peek(V, 515);\n    t13 = (peek(V, 517) + t12);\n    poke(V, t13, 517);\n    t14 = (peek(V, 516) + 1);\n    poke(V, t14, 516);\n  }\n  r = peek(V, 517);\n  return r;\n}\n\nf_mode_put(V, M, mq, p0, p1, p2, p3, p4, p5) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0;\n  r = 0;\n  if ((abs((((abs((p1 < min((0.45 * peek(V, 89)), 18000) ? 1 : 0)) >= 0.00001) && (abs((peek(V, 257) < peek(V, 102) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t1 = ((p0 + peek(V, 100)) + (peek(V, 257) * peek(V, 101)));\n    poke(V, t1, 522);\n    t2 = exp(((-6.907755) / (max(0.003, p4) * peek(V, 89))));\n    poke(V, t2, 523);\n    t3 = min(peek(V, 523), 0.9999995);\n    poke(V, t3, 523);\n    t4 = (((2 * 3.141592653589793) * p1) / peek(V, 89));\n    poke(V, t4, 524);\n    t5 = trunc(peek(V, 522) + 0.00001);\n    t6 = ((2 * peek(V, 523)) * cos(peek(V, 524)));\n    poke(M, t6, t5);\n    t7 = trunc(peek(V, 522) + 1 + 0.00001);\n    t8 = (peek(V, 523) * peek(V, 523));\n    poke(M, t8, t7);\n    t9 = trunc(peek(V, 522) + 2 + 0.00001);\n    poke(M, 0, t9);\n    t10 = trunc(peek(V, 522) + 3 + 0.00001);\n    poke(M, 0, t10);\n    t11 = trunc(peek(V, 522) + 4 + 0.00001);\n    t12 = (p2 / p5);\n    poke(M, t12, t11);\n    t13 = trunc(peek(V, 522) + 5 + 0.00001);\n    t14 = p2;\n    poke(M, t14, t13);\n    t15 = trunc(peek(V, 522) + 6 + 0.00001);\n    t16 = p3;\n    poke(M, t16, t15);\n    t17 = trunc(peek(V, 522) + 7 + 0.00001);\n    t18 = p1;\n    poke(M, t18, t17);\n    t19 = (peek(V, 257) + 1);\n    poke(V, t19, 257);\n    r = t19;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_modal_mode(V, M, mq, p0, p1, p2, p3, p4, p5) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0;\n  r = 0;\n  t1 = f_held_t60(V, M, mq, peek(V, 343), p1);\n  t2 = (t1 * p5);\n  poke(V, t2, 521);\n  t3 = f_mode_put(V, M, mq, p0, p1, p2, p3, peek(V, 521), p4);\n  t4 = f_mat(V, M, mq, peek(V, 343), peek(V, 237));\n  t5 = (t4 + (peek(V, 281) * peek(V, 288)));\n  poke(V, t5, 525);\n  if ((abs((((abs((peek(V, 525) > 0.004 ? 1 : 0)) >= 0.00001) && (abs(((abs((((abs(peek(V, 374)) >= 0.00001) && (abs((abs(peek(V, 375) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t6 = p0;\n    t7 = p1;\n    t8 = peek(V, 525);\n    t9 = f_hash1(V, M, mq, p1);\n    t10 = f_mode_put(V, M, mq, t6, (t7 * (1 + (t8 * (0.6 + (0.4 * t9))))), (0.6 * p2), (0.6 * p3), (peek(V, 521) * 0.8), p4);\n    r = t10;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_cosh_(V, M, mq, p0) {\n  r = 0;\n  r = (0.5 * (exp(p0) + exp((-p0))));\n  return r;\n}\n\nf_sinh_(V, M, mq, p0) {\n  r = 0;\n  r = (0.5 * (exp(p0) - exp((-p0))));\n  return r;\n}\n\nf_bar_shape(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0;\n  r = 0;\n  t1 = peek(M, trunc(peek(V, 111) + p0 + 0.00001));\n  poke(V, t1, 526);\n  t2 = (p1 - 0.5);\n  poke(V, t2, 527);\n  if ((abs((abs(eel_band(p0, 1) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t3 = (cos((peek(V, 526) * peek(V, 527))) / cos((0.5 * peek(V, 526))));\n    t4 = f_cosh_(V, M, mq, (peek(V, 526) * peek(V, 527)));\n    t5 = f_cosh_(V, M, mq, (0.5 * peek(V, 526)));\n    r = (t3 + (t4 / t5));\n  }\n  else {\n    t6 = (sin((peek(V, 526) * peek(V, 527))) / sin((0.5 * peek(V, 526))));\n    t7 = f_sinh_(V, M, mq, (peek(V, 526) * peek(V, 527)));\n    t8 = f_sinh_(V, M, mq, (0.5 * peek(V, 526)));\n    r = (t6 + (t7 / t8));\n  }\n  return r;\n}\n\nf_cant_shape(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0;\n  r = 0;\n  t1 = peek(M, trunc(peek(V, 112) + p0 + 0.00001));\n  poke(V, t1, 530);\n  t2 = f_cosh_(V, M, mq, peek(V, 530));\n  t3 = (t2 + cos(peek(V, 530)));\n  t4 = f_sinh_(V, M, mq, peek(V, 530));\n  t5 = (t3 / (t4 + sin(peek(V, 530))));\n  poke(V, t5, 531);\n  t6 = f_cosh_(V, M, mq, (peek(V, 530) * p1));\n  t7 = (t6 - cos((peek(V, 530) * p1)));\n  t8 = peek(V, 531);\n  t9 = f_sinh_(V, M, mq, (peek(V, 530) * p1));\n  r = (t7 - (t8 * (t9 - sin((peek(V, 530) * p1)))));\n  return r;\n}\n\nf_modal_setup(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0;\n  r = 0;\n  t1 = trunc(p0 + peek(V, 188) + 0.00001);\n  poke(M, 0, t1);\n  poke(V, 0, 257);\n  t2 = (peek(V, 89) / p1);\n  poke(V, t2, 506);\n  t3 = peek(V, 356);\n  poke(V, t3, 507);\n  if ((abs((abs(peek(V, 342) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t4 = max(0, (0.95 - (1.8 * peek(V, 507))));\n    poke(V, t4, 508);\n    t5 = f_mat(V, M, mq, peek(V, 343), peek(V, 233));\n    t6 = min(0.03, (t5 * 0.0003));\n    poke(V, t6, 509);\n    poke(V, 0, 510);\n    t7 = min(1048576, trunc(16));\n    for (t8 = 0; t8 < t7; t8 += 1) {\n      t9 = peek(M, trunc(peek(V, 110) + (peek(V, 510) * 2) + 0.00001));\n      poke(V, t9, 511);\n      t10 = peek(M, trunc(peek(V, 110) + ((peek(V, 510) * 2) + 1) + 0.00001));\n      poke(V, t10, 512);\n      t11 = ((p1 * (peek(V, 511) / 2.4048)) * sqrt(abs((1 + (peek(V, 509) * pow((peek(V, 511) / 2.4048), 2))))));\n      poke(V, t11, 513);\n      t12 = f_besj(V, M, mq, peek(V, 512), (peek(V, 511) * peek(V, 508)));\n      t13 = ((t12 * ((abs((peek(V, 512) > 0 ? 1 : 0)) >= 0.00001) ? cos((peek(V, 512) * 0.7)) : 1)) * 1.7);\n      poke(V, t13, 518);\n      t14 = f_besj(V, M, mq, peek(V, 512), (peek(V, 511) * 0.35));\n      t15 = (((t14 * cos((peek(V, 512) * 1.9))) * 1.7) + ((abs((abs(peek(V, 512) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.4 : 0));\n      poke(V, t15, 519);\n      t16 = ((abs((abs(peek(V, 510) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.35 : 1);\n      poke(V, t16, 520);\n      t17 = f_modal_mode(V, M, mq, p0, peek(V, 513), peek(V, 518), peek(V, 519), peek(V, 506), peek(V, 520));\n      t18 = (peek(V, 510) + 1);\n      poke(V, t18, 510);\n    }\n  }\n  else {\n    if ((abs((abs(peek(V, 342) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      poke(V, 0, 510);\n      t19 = min(1048576, trunc(8));\n      for (t20 = 0; t20 < t19; t20 += 1) {\n        t21 = (p1 * pow((peek(M, trunc(peek(V, 111) + peek(V, 510) + 0.00001)) / 4.73), 2));\n        poke(V, t21, 513);\n        t22 = f_bar_shape(V, M, mq, peek(V, 510), (0.5 - (0.6 * peek(V, 507))));\n        t23 = (0.5 * t22);\n        poke(V, t23, 518);\n        t24 = f_bar_shape(V, M, mq, peek(V, 510), 0.12);\n        t25 = (0.5 * t24);\n        poke(V, t25, 519);\n        t26 = f_modal_mode(V, M, mq, p0, peek(V, 513), peek(V, 518), peek(V, 519), peek(V, 506), 1);\n        t27 = (peek(V, 510) + 1);\n        poke(V, t27, 510);\n      }\n    }\n    else {\n      if ((abs((abs(peek(V, 342) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t28 = (0.5 - (0.8 * peek(V, 356)));\n        poke(V, t28, 507);\n        t29 = (0.5 - (0.7 * peek(V, 356)));\n        poke(V, t29, 528);\n        poke(V, 0, 510);\n        t30 = min(1048576, trunc(20));\n        for (t31 = 0; t31 < t30; t31 += 1) {\n          t32 = ((p1 * peek(M, trunc(peek(V, 113) + (peek(V, 510) * 3) + 0.00001))) / peek(M, trunc(peek(V, 113) + 0.00001)));\n          poke(V, t32, 513);\n          t33 = peek(M, trunc(peek(V, 113) + ((peek(V, 510) * 3) + 1) + 0.00001));\n          poke(V, t33, 512);\n          t34 = peek(M, trunc(peek(V, 113) + ((peek(V, 510) * 3) + 2) + 0.00001));\n          poke(V, t34, 511);\n          t35 = (sin(((peek(V, 512) * 3.141592653589793) * peek(V, 507))) * sin(((peek(V, 511) * 3.141592653589793) * peek(V, 528))));\n          poke(V, t35, 518);\n          t36 = (sin(((peek(V, 512) * 3.141592653589793) * 0.77)) * sin(((peek(V, 511) * 3.141592653589793) * 0.31)));\n          poke(V, t36, 519);\n          t37 = f_modal_mode(V, M, mq, p0, peek(V, 513), peek(V, 518), peek(V, 519), peek(V, 506), 1);\n          t38 = (peek(V, 510) + 1);\n          poke(V, t38, 510);\n        }\n      }\n      else {\n        t39 = (1 - peek(V, 507));\n        poke(V, t39, 529);\n        poke(V, 0, 510);\n        t40 = min(1048576, trunc(6));\n        for (t41 = 0; t41 < t40; t41 += 1) {\n          t42 = (p1 * pow((peek(M, trunc(peek(V, 112) + peek(V, 510) + 0.00001)) / 1.8751), 2));\n          poke(V, t42, 513);\n          t43 = f_cant_shape(V, M, mq, peek(V, 510), peek(V, 529));\n          t44 = (0.5 * t43);\n          poke(V, t44, 518);\n          t45 = f_cant_shape(V, M, mq, peek(V, 510), 1);\n          t46 = (0.5 * t45);\n          poke(V, t46, 519);\n          t47 = f_modal_mode(V, M, mq, p0, peek(V, 513), peek(V, 518), peek(V, 519), peek(V, 506), 1);\n          t48 = (peek(V, 510) + 1);\n          poke(V, t48, 510);\n        }\n        t49 = trunc(p0 + peek(V, 213) + 0.00001);\n        t50 = peek(V, 374);\n        poke(M, t50, t49);\n      }\n    }\n  }\n  t51 = trunc(p0 + peek(V, 177) + 0.00001);\n  t52 = peek(V, 257);\n  poke(M, t52, t51);\n  r = t52;\n  return r;\n}\n\nf_band_tune(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0;\n  r = 0;\n  t1 = min(p1, (0.45 * peek(V, 89)));\n  p1 = t1;\n  t2 = trunc(p0 + 3 + 0.00001);\n  t3 = max(2, min((peek(M, trunc(p0 + 1 + 0.00001)) - 3), (peek(V, 89) / p1)));\n  poke(M, t3, t2);\n  t4 = (((2 * 3.141592653589793) * p1) / peek(V, 89));\n  poke(V, t4, 541);\n  t5 = peek(M, trunc(p0 + 15 + 0.00001));\n  poke(V, t5, 542);\n  t6 = trunc(p0 + 6 + 0.00001);\n  t7 = (((-2) * peek(V, 542)) * cos(peek(V, 541)));\n  poke(M, t7, t6);\n  t8 = trunc(p0 + 7 + 0.00001);\n  t9 = (peek(V, 542) * peek(V, 542));\n  poke(M, t9, t8);\n  r = t9;\n  return r;\n}\n\nf_bands_setup(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0;\n  r = 0;\n  t1 = (p0 + peek(V, 100));\n  poke(V, t1, 532);\n  t2 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129));\n  poke(V, t2, 533);\n  t3 = peek(M, trunc(p0 + peek(V, 202) + 0.00001));\n  poke(V, t3, 534);\n  poke(V, 0, 535);\n  poke(V, 0, 536);\n  t4 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 177) + 0.00001))));\n  for (t5 = 0; t5 < t4; t5 += 1) {\n    t6 = peek(M, trunc(peek(V, 532) + 7 + 0.00001));\n    poke(V, t6, 537);\n    t7 = sqrt(abs(peek(M, trunc(peek(V, 532) + 1 + 0.00001))));\n    poke(V, t7, 538);\n    t8 = ((-6.907755) / (peek(V, 89) * log(peek(V, 538))));\n    poke(V, t8, 539);\n    t9 = max(peek(V, 539), (peek(V, 307) * pow((peek(M, trunc(p0 + peek(V, 187) + 0.00001)) / peek(V, 537)), 0.5)));\n    poke(V, t9, 539);\n    t10 = (ceil(((2 * peek(V, 89)) / peek(V, 537))) + 6);\n    poke(V, t10, 540);\n    if ((abs(((peek(V, 534) + peek(V, 540)) < (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129)) ? 1 : 0)) >= 0.00001)) {\n      t11 = trunc(peek(V, 533) + 0.00001);\n      t12 = peek(V, 534);\n      poke(M, t12, t11);\n      t13 = trunc(peek(V, 533) + 1 + 0.00001);\n      t14 = peek(V, 540);\n      poke(M, t14, t13);\n      t15 = trunc(peek(V, 533) + 2 + 0.00001);\n      poke(M, 0, t15);\n      t16 = peek(V, 540);\n      t17 = (peek(V, 534) + t16);\n      poke(V, t17, 534);\n      t18 = trunc(peek(V, 533) + 4 + 0.00001);\n      t19 = pow(10, ((-3) / (peek(V, 537) * peek(V, 539))));\n      poke(M, t19, t18);\n      t20 = trunc(peek(V, 533) + 15 + 0.00001);\n      t21 = exp((((-3.141592653589793) * max(8, (0.25 * peek(V, 537)))) / peek(V, 89)));\n      poke(M, t21, t20);\n      t22 = trunc(peek(V, 533) + 5 + 0.00001);\n      t23 = (0.5 * (1 - (peek(M, trunc(peek(V, 533) + 15 + 0.00001)) * peek(M, trunc(peek(V, 533) + 15 + 0.00001)))));\n      poke(M, t23, t22);\n      t24 = trunc(peek(V, 533) + 8 + 0.00001);\n      t25 = trunc(peek(V, 533) + 9 + 0.00001);\n      t26 = trunc(peek(V, 533) + 10 + 0.00001);\n      t27 = trunc(peek(V, 533) + 11 + 0.00001);\n      t28 = trunc(peek(V, 533) + 16 + 0.00001);\n      poke(M, 0, t28);\n      poke(M, 0, t27);\n      poke(M, 0, t26);\n      poke(M, 0, t25);\n      poke(M, 0, t24);\n      t29 = trunc(peek(V, 533) + 12 + 0.00001);\n      t30 = (peek(M, trunc(peek(V, 532) + 5 + 0.00001)) * pow((peek(M, trunc(p0 + peek(V, 187) + 0.00001)) / peek(V, 537)), peek(V, 296)));\n      poke(M, t30, t29);\n      t31 = trunc(peek(V, 533) + 13 + 0.00001);\n      t32 = peek(M, trunc(peek(V, 532) + 6 + 0.00001));\n      poke(M, t32, t31);\n      t33 = trunc(peek(V, 533) + 14 + 0.00001);\n      t34 = peek(V, 537);\n      poke(M, t34, t33);\n      t35 = f_band_tune(V, M, mq, peek(V, 533), peek(V, 537));\n      t36 = (peek(M, trunc(peek(V, 533) + 12 + 0.00001)) * peek(M, trunc(peek(V, 533) + 12 + 0.00001)));\n      t37 = (peek(V, 536) + t36);\n      poke(V, t37, 536);\n      t38 = peek(V, 226);\n      t39 = (peek(V, 533) + t38);\n      poke(V, t39, 533);\n      t40 = (peek(V, 535) + 1);\n      poke(V, t40, 535);\n    }\n    t41 = peek(V, 101);\n    t42 = (peek(V, 532) + t41);\n    poke(V, t42, 532);\n  }\n  t43 = trunc(p0 + peek(V, 219) + 0.00001);\n  t44 = peek(V, 535);\n  poke(M, t44, t43);\n  t45 = trunc(p0 + peek(V, 218) + 0.00001);\n  poke(M, 1, t45);\n  t46 = trunc(p0 + peek(V, 212) + 0.00001);\n  t47 = (1 / max(0.05, peek(V, 536)));\n  poke(M, t47, t46);\n  r = t47;\n  return r;\n}\n\nf_op_fit(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0;\n  r = 0;\n  t1 = min(p0, 0.9999995);\n  p0 = t1;\n  t2 = min(p1, p0);\n  p1 = t2;\n  t3 = pow((p1 / p0), 2);\n  poke(V, t3, 547);\n  if ((abs((peek(V, 547) > 0.999999 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 499);\n    t4 = p0;\n    poke(V, t4, 500);\n    r = t4;\n  }\n  else {\n    t5 = cos(p2);\n    poke(V, t5, 548);\n    t6 = (1 - peek(V, 547));\n    poke(V, t6, 549);\n    t7 = (1 - (peek(V, 547) * peek(V, 548)));\n    poke(V, t7, 550);\n    t8 = max(0, ((peek(V, 550) * peek(V, 550)) - (peek(V, 549) * peek(V, 549))));\n    poke(V, t8, 551);\n    t9 = max(0, min(0.9995, ((peek(V, 550) - sqrt(abs(peek(V, 551)))) / peek(V, 549))));\n    poke(V, t9, 499);\n    t10 = (p0 * (1 - peek(V, 499)));\n    poke(V, t10, 500);\n    r = t10;\n  }\n  return r;\n}\n\nf_voice_pitch(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  t1 = ((((((peek(M, trunc(p0 + peek(V, 137) + 0.00001)) + (peek(M, trunc(p0 + peek(V, 180) + 0.00001)) / 100)) + (peek(M, trunc(p0 + peek(V, 181) + 0.00001)) / 100)) + peek(V, 360)) + (peek(V, 326) * peek(V, 376))) + peek(V, 327)) + peek(M, trunc(p0 + peek(V, 208) + 0.00001)));\n  poke(V, t1, 557);\n  if ((abs((abs(peek(V, 349) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t2 = (0.03 * sin(((0.8 * peek(V, 333)) + peek(M, trunc(p0 + peek(V, 132) + 0.00001)))));\n    t3 = (peek(V, 557) + t2);\n    poke(V, t3, 557);\n  }\n  t4 = (((peek(V, 283) * peek(V, 288)) * peek(V, 288)) * (sin(((0.43 * peek(V, 333)) + (1.7 * peek(M, trunc(p0 + peek(V, 132) + 0.00001))))) + (0.5 * sin(((1.9 * peek(V, 333)) + peek(M, trunc(p0 + peek(V, 132) + 0.00001)))))));\n  t5 = (peek(V, 557) + t4);\n  poke(V, t5, 557);\n  r = (440 * pow(2, ((peek(V, 557) - 69) / 12)));\n  return r;\n}\n\nf_phlp(V, M, mq, p0, p1) {\n  r = 0;\n  r = atan2((p1 * sin(p0)), (1 - (p1 * cos(p0))));\n  return r;\n}\n\nf_phshelf(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0;\n  r = 0;\n  t1 = (1 - p1);\n  poke(V, t1, 561);\n  t2 = ((1 - ((2 * peek(V, 561)) * cos(p0))) + (peek(V, 561) * peek(V, 561)));\n  poke(V, t2, 562);\n  t3 = ((1 - p2) + (((p2 * p1) * (1 - (peek(V, 561) * cos(p0)))) / peek(V, 562)));\n  poke(V, t3, 563);\n  t4 = ((((p2 * p1) * peek(V, 561)) * sin(p0)) / peek(V, 562));\n  poke(V, t4, 564);\n  r = atan2(peek(V, 564), peek(V, 563));\n  return r;\n}\n\nf_phdc(V, M, mq, p0, p1) {\n  r = 0;\n  r = (atan2((p1 * sin(p0)), (1 - (p1 * cos(p0)))) - (0.5 * (3.141592653589793 - p0)));\n  return r;\n}\n\nf_voice_control(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0;\n  r = 0;\n  t1 = trunc(p0 + peek(V, 137) + 0.00001);\n  t2 = ((peek(M, trunc(p0 + peek(V, 138) + 0.00001)) - peek(M, trunc(p0 + peek(V, 137) + 0.00001))) * peek(V, 381));\n  t3 = (peek(M, t1) + t2);\n  poke(M, t3, t1);\n  t4 = trunc(p0 + peek(V, 181) + 0.00001);\n  t5 = peek(V, 382);\n  t6 = (peek(M, t4) * t5);\n  poke(M, t6, t4);\n  t7 = f_mat(V, M, mq, peek(V, 343), peek(V, 245));\n  poke(V, t7, 556);\n  if ((abs((peek(V, 556) > 0 ? 1 : 0)) >= 0.00001)) {\n    t8 = trunc(p0 + peek(V, 208) + 0.00001);\n    t9 = ((peek(V, 556) * ((0.6 * min(1, (3 * peek(M, trunc(p0 + peek(V, 141) + 0.00001))))) + (0.25 * sin(((2.3 * peek(V, 333)) + peek(M, trunc(p0 + peek(V, 132) + 0.00001))))))) * 0.5);\n    poke(M, t9, t8);\n  }\n  t10 = f_voice_pitch(V, M, mq, p0);\n  poke(V, t10, 558);\n  t11 = trunc(p0 + peek(V, 185) + 0.00001);\n  t12 = peek(V, 558);\n  poke(M, t12, t11);\n  t13 = ((((2 * 3.141592653589793) * peek(V, 558)) * peek(M, trunc(p0 + peek(V, 217) + 0.00001))) / peek(V, 89));\n  poke(V, t13, 559);\n  if ((abs(peek(M, trunc(p0 + peek(V, 188) + 0.00001))) >= 0.00001)) {\n    t14 = f_phlp(V, M, mq, peek(V, 559), peek(M, trunc(p0 + peek(V, 156) + 0.00001)));\n    t15 = peek(M, trunc(p0 + peek(V, 160) + 0.00001));\n    t16 = f_ph1(V, M, mq, peek(V, 559), peek(M, trunc(p0 + peek(V, 159) + 0.00001)));\n    t17 = (t14 + (t15 * t16));\n    poke(V, t17, 560);\n    if ((abs((peek(M, trunc(p0 + peek(V, 183) + 0.00001)) > 0 ? 1 : 0)) >= 0.00001)) {\n      t18 = f_phshelf(V, M, mq, peek(V, 559), peek(M, trunc(p0 + peek(V, 183) + 0.00001)), peek(V, 275));\n      t19 = (peek(V, 560) + t18);\n      poke(V, t19, 560);\n    }\n    if ((abs(peek(M, trunc(p0 + peek(V, 203) + 0.00001))) >= 0.00001)) {\n      t20 = f_phdc(V, M, mq, peek(V, 559), peek(V, 261));\n      t21 = (peek(V, 560) + t20);\n      poke(V, t21, 560);\n    }\n    t22 = (((peek(M, trunc(p0 + peek(V, 190) + 0.00001)) * 3.141592653589793) - peek(V, 560)) / peek(V, 559));\n    poke(V, t22, 565);\n    t23 = max(4, min((peek(V, 129) - 8), peek(V, 565)));\n    poke(V, t23, 565);\n    if ((abs(peek(M, trunc(p0 + peek(V, 189) + 0.00001))) >= 0.00001)) {\n      t24 = floor(((1 - peek(M, trunc(p0 + peek(V, 195) + 0.00001))) * peek(V, 565)));\n      poke(V, t24, 566);\n      if ((abs((((abs((((abs((peek(M, trunc(p0 + peek(V, 152) + 0.00001)) < 1 ? 1 : 0)) >= 0.00001) || (abs((abs((peek(V, 566) - peek(M, trunc(p0 + peek(V, 152) + 0.00001)))) > 2 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) || (abs(((peek(V, 565) - peek(M, trunc(p0 + peek(V, 152) + 0.00001))) < 2.5 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t25 = trunc(p0 + peek(V, 152) + 0.00001);\n        t26 = floor(max(1, min(peek(V, 566), (peek(V, 565) - 2.5))));\n        poke(M, t26, t25);\n      }\n      t27 = trunc(p0 + peek(V, 151) + 0.00001);\n      t28 = (peek(V, 565) - peek(M, trunc(p0 + peek(V, 152) + 0.00001)));\n      poke(M, t28, t27);\n    }\n    else {\n      t29 = trunc(p0 + peek(V, 151) + 0.00001);\n      t30 = peek(V, 565);\n      poke(M, t30, t29);\n    }\n    t31 = trunc(p0 + peek(V, 153) + 0.00001);\n    t32 = max(2.5, (0.32 * peek(V, 565)));\n    poke(M, t32, t31);\n  }\n  else {\n    if ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001)) {\n      if ((abs((abs(((peek(V, 558) / peek(M, trunc(p0 + peek(V, 186) + 0.00001))) - 1)) > 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t33 = (peek(V, 558) / peek(M, trunc(p0 + peek(V, 187) + 0.00001)));\n        poke(V, t33, 567);\n        t34 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129));\n        poke(V, t34, 568);\n        t35 = peek(M, trunc(p0 + peek(V, 217) + 0.00001));\n        t36 = (peek(V, 567) * t35);\n        poke(V, t36, 567);\n        t37 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 219) + 0.00001))));\n        for (t38 = 0; t38 < t37; t38 += 1) {\n          t39 = f_band_tune(V, M, mq, peek(V, 568), (peek(M, trunc(peek(V, 568) + 14 + 0.00001)) * peek(V, 567)));\n          t40 = peek(V, 226);\n          t41 = (peek(V, 568) + t40);\n          poke(V, t41, 568);\n        }\n        t42 = trunc(p0 + peek(V, 186) + 0.00001);\n        t43 = peek(V, 558);\n        poke(M, t43, t42);\n      }\n      t44 = trunc(p0 + peek(V, 153) + 0.00001);\n      t45 = max(2.5, ((0.32 * peek(V, 89)) / peek(V, 558)));\n      poke(M, t45, t44);\n    }\n    else {\n      if ((abs((abs(((peek(V, 558) / peek(M, trunc(p0 + peek(V, 186) + 0.00001))) - 1)) > 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t46 = (peek(V, 558) / peek(M, trunc(p0 + peek(V, 187) + 0.00001)));\n        poke(V, t46, 567);\n        t47 = (p0 + peek(V, 100));\n        poke(V, t47, 568);\n        t48 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 177) + 0.00001))));\n        for (t49 = 0; t49 < t48; t49 += 1) {\n          t50 = (((2 * 3.141592653589793) * min((peek(M, trunc(peek(V, 568) + 7 + 0.00001)) * peek(V, 567)), (0.49 * peek(V, 89)))) / peek(V, 89));\n          poke(V, t50, 569);\n          t51 = trunc(peek(V, 568) + 0.00001);\n          t52 = ((2 * sqrt(abs(peek(M, trunc(peek(V, 568) + 1 + 0.00001))))) * cos(peek(V, 569)));\n          poke(M, t52, t51);\n          t53 = peek(V, 101);\n          t54 = (peek(V, 568) + t53);\n          poke(V, t54, 568);\n        }\n        t55 = trunc(p0 + peek(V, 186) + 0.00001);\n        t56 = peek(V, 558);\n        poke(M, t56, t55);\n      }\n      t57 = trunc(p0 + peek(V, 153) + 0.00001);\n      t58 = max(2.5, ((0.32 * peek(V, 89)) / peek(V, 558)));\n      poke(M, t58, t57);\n    }\n  }\n  if ((abs((abs(peek(M, trunc(p0 + peek(V, 191) + 0.00001)) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t59 = ((2 * 3.141592653589793) * min(((peek(V, 558) * peek(M, trunc(p0 + peek(V, 221) + 0.00001))) * ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001) ? peek(M, trunc(p0 + peek(V, 217) + 0.00001)) : 1)), (0.3 * peek(V, 89))));\n    poke(V, t59, 569);\n    t60 = trunc(p0 + peek(V, 162) + 0.00001);\n    t61 = (peek(V, 569) / peek(V, 269));\n    poke(M, t61, t60);\n    t62 = trunc(p0 + peek(V, 163) + 0.00001);\n    t63 = (peek(V, 569) * peek(V, 569));\n    poke(M, t63, t62);\n    t64 = trunc(p0 + peek(V, 216) + 0.00001);\n    t65 = (((peek(V, 569) * peek(V, 569)) * peek(V, 267)) / peek(V, 268));\n    poke(M, t65, t64);\n  }\n  if ((abs(peek(M, trunc(p0 + peek(V, 194) + 0.00001))) >= 0.00001)) {\n    t66 = f_phlp(V, M, mq, peek(V, 559), peek(M, trunc(p0 + peek(V, 174) + 0.00001)));\n    poke(V, t66, 560);\n    t67 = trunc(p0 + peek(V, 154) + 0.00001);\n    t68 = max(2, min((peek(V, 129) - 4), (((peek(M, trunc(p0 + peek(V, 207) + 0.00001)) * 3.141592653589793) - peek(V, 560)) / peek(V, 559))));\n    poke(M, t68, t67);\n    r = t68;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_voice_start(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0; t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0; t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0;\n  r = 0;\n  t1 = ((p0 - peek(V, 97)) / peek(V, 98));\n  poke(V, t1, 465);\n  t2 = p0;\n  t3 = min(trunc(peek(V, 98)), 8388608);\n  for (t4 = 0; t4 < t3; t4 += 1) {\n    poke(M, 0, trunc(t2 + t4 + 0.00001));\n  }\n  t5 = (peek(V, 128) + ((peek(V, 465) * 4) * peek(V, 129)));\n  t6 = min(trunc((4 * peek(V, 129))), 8388608);\n  for (t7 = 0; t7 < t6; t7 += 1) {\n    poke(M, 0, trunc(t5 + t7 + 0.00001));\n  }\n  t8 = trunc(p0 + peek(V, 202) + 0.00001);\n  t9 = (peek(V, 128) + ((peek(V, 465) * 4) * peek(V, 129)));\n  poke(M, t9, t8);\n  t10 = trunc(p0 + peek(V, 212) + 0.00001);\n  poke(M, 1, t10);\n  t11 = trunc(p0 + peek(V, 131) + 0.00001);\n  poke(M, 1, t11);\n  t12 = trunc(p0 + peek(V, 132) + 0.00001);\n  t13 = p1;\n  poke(M, t13, t12);\n  t14 = trunc(p0 + peek(V, 134) + 0.00001);\n  poke(M, 1, t14);\n  t15 = trunc(p0 + peek(V, 136) + 0.00001);\n  t16 = peek(V, 332);\n  poke(M, t16, t15);\n  t17 = (peek(V, 332) + 1);\n  poke(V, t17, 332);\n  t18 = trunc(p0 + peek(V, 142) + 0.00001);\n  poke(M, (-1), t18);\n  t19 = trunc(p0 + peek(V, 144) + 0.00001);\n  poke(M, (-1), t19);\n  t20 = max(0.05, (p2 / 127));\n  poke(V, t20, 466);\n  t21 = trunc(p0 + peek(V, 133) + 0.00001);\n  t22 = peek(V, 466);\n  poke(M, t22, t21);\n  t23 = trunc(p0 + peek(V, 193) + 0.00001);\n  t24 = (max(0.02, (peek(V, 352) * pow(peek(V, 466), peek(V, 369)))) * ((abs(peek(V, 329)) >= 0.00001) ? 0.6 : 1));\n  poke(M, t24, t23);\n  t25 = trunc(p0 + peek(V, 180) + 0.00001);\n  t26 = f_tuning_cents(V, M, mq, p1);\n  if ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t28 = f_valve_cents(V, M, mq, p1);\n    t27 = t28;\n  }\n  else {\n    t27 = 0;\n  }\n  t29 = ((t26 + t27) + ((abs((abs(peek(V, 350) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? (-15) : 0));\n  t30 = f_age_detune(V, M, mq, p1);\n  t31 = (t29 + t30);\n  poke(M, t31, t25);\n  t32 = trunc(p0 + peek(V, 138) + 0.00001);\n  t33 = p1;\n  poke(M, t33, t32);\n  t34 = trunc(p0 + peek(V, 137) + 0.00001);\n  t35 = ((abs((((abs((abs(peek(V, 348) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((peek(V, 330) > 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? peek(V, 330) : p1);\n  poke(M, t35, t34);\n  if ((abs((abs(peek(V, 349) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t36 = trunc(p0 + peek(V, 181) + 0.00001);\n    poke(M, (-30), t36);\n  }\n  t37 = p1;\n  poke(V, t37, 330);\n  t38 = (440 * pow(2, ((((p1 + (peek(M, trunc(p0 + peek(V, 180) + 0.00001)) / 100)) + peek(V, 360)) - 69) / 12)));\n  poke(V, t38, 467);\n  t39 = peek(V, 467);\n  poke(V, t39, 468);\n  t40 = trunc(p0 + peek(V, 187) + 0.00001);\n  t41 = peek(V, 467);\n  poke(M, t41, t40);\n  t42 = trunc(p0 + peek(V, 185) + 0.00001);\n  t43 = peek(V, 467);\n  poke(M, t43, t42);\n  t44 = trunc(p0 + peek(V, 186) + 0.00001);\n  t45 = peek(V, 467);\n  poke(M, t45, t44);\n  if ((abs((((abs((abs(peek(V, 342) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 342) - 5) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t46 = f_wg_setup(V, M, mq, p0, peek(V, 467));\n  }\n  else {\n    t47 = f_modal_setup(V, M, mq, p0, peek(V, 467));\n    if ((abs((((abs(peek(V, 374)) >= 0.00001) || (abs(peek(V, 292)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t48 = f_bands_setup(V, M, mq, p0);\n    }\n  }\n  t49 = trunc(p0 + peek(V, 191) + 0.00001);\n  t50 = peek(V, 375);\n  poke(M, t50, t49);\n  t51 = trunc(p0 + peek(V, 192) + 0.00001);\n  t52 = peek(V, 374);\n  poke(M, t52, t51);\n  t53 = trunc(p0 + peek(V, 211) + 0.00001);\n  t54 = peek(V, 362);\n  poke(M, t54, t53);\n  if ((abs(((abs(peek(V, 374)) >= 0.00001) ? 0 : 1)) >= 0.00001)) {\n    if ((abs(peek(V, 362)) >= 0.00001)) {\n      t55 = trunc(p0 + peek(V, 143) + 0.00001);\n      poke(M, 0, t55);\n    }\n    else {\n      t56 = f_start_pulse(V, M, mq, p0, peek(M, trunc(p0 + peek(V, 193) + 0.00001)));\n    }\n  }\n  t57 = trunc(p0 + peek(V, 194) + 0.00001);\n  t58 = (((abs((abs(peek(V, 344) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 344) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0);\n  poke(M, t58, t57);\n  if ((abs(peek(M, trunc(p0 + peek(V, 194) + 0.00001))) >= 0.00001)) {\n    t59 = peek(V, 345);\n    poke(V, t59, 543);\n    t60 = trunc(p0 + peek(V, 207) + 0.00001);\n    t61 = ((abs((abs(peek(V, 344) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2 : 1);\n    poke(M, t61, t60);\n    t62 = trunc(p0 + peek(V, 172) + 0.00001);\n    t63 = ((abs((abs(peek(V, 344) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1 : (-1));\n    poke(M, t63, t62);\n    t64 = (peek(M, trunc(p0 + peek(V, 207) + 0.00001)) / (2 * peek(V, 467)));\n    poke(V, t64, 544);\n    t65 = f_mat_t60(V, M, mq, peek(V, 543), peek(V, 467));\n    t66 = ((min(t65, 0.5) * peek(V, 355)) * 0.6);\n    t67 = f_mat(V, M, mq, peek(V, 543), peek(V, 238));\n    t68 = (t66 / t67);\n    poke(V, t68, 545);\n    t69 = (peek(V, 545) * 0.4);\n    t70 = f_bright_mul(V, M, mq, 4000);\n    t71 = (t69 * t70);\n    poke(V, t71, 546);\n    t72 = f_op_fit(V, M, mq, pow(10, (((-3) * peek(V, 544)) / peek(V, 545))), pow(10, (((-3) * peek(V, 544)) / peek(V, 546))), (((2 * 3.141592653589793) * min(4000, (0.4 * peek(V, 89)))) / peek(V, 89)));\n    t73 = trunc(p0 + peek(V, 173) + 0.00001);\n    t74 = peek(V, 500);\n    poke(M, t74, t73);\n    t75 = trunc(p0 + peek(V, 174) + 0.00001);\n    t76 = peek(V, 499);\n    poke(M, t76, t75);\n    t77 = (peek(V, 500) / (1 - peek(V, 499)));\n    poke(V, t77, 552);\n    t78 = trunc(p0 + peek(V, 171) + 0.00001);\n    t79 = peek(V, 552);\n    poke(M, t79, t78);\n  }\n  t80 = trunc(p0 + peek(V, 184) + 0.00001);\n  t81 = pow(10, (peek(M, trunc(peek(V, 263) + ((((abs(peek(V, 362)) >= 0.00001) ? 0 : 36) + (peek(V, 341) * 6)) + peek(V, 342)) + 0.00001)) / 20));\n  poke(M, t81, t80);\n  t82 = trunc(p0 + peek(V, 214) + 0.00001);\n  t83 = peek(V, 267);\n  poke(M, t83, t82);\n  t84 = trunc(p0 + peek(V, 217) + 0.00001);\n  t85 = ((abs((((abs((abs(peek(V, 375) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs(peek(M, trunc(p0 + peek(V, 188) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? peek(V, 273) : 1);\n  poke(M, t85, t84);\n  t86 = trunc(p0 + peek(V, 221) + 0.00001);\n  t87 = peek(V, 271);\n  poke(M, t87, t86);\n  if ((abs((((abs((abs(peek(V, 375) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t88 = trunc(p0 + peek(V, 217) + 0.00001);\n    if ((abs((abs(peek(V, 342) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t90 = peek(V, 299);\n      t91 = (peek(V, 299) - 50);\n      t92 = f_mat(V, M, mq, peek(V, 343), peek(V, 233));\n      t89 = (t90 - (t91 * max(0, min(1, ((min(0.03, (t92 * 0.0003)) - peek(V, 300)) / 0.009)))));\n    }\n    else {\n      if ((abs((abs(peek(V, 342) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t89 = peek(V, 301);\n      }\n      else {\n        if ((abs((abs(peek(V, 342) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t89 = peek(V, 302);\n        }\n        else {\n          t89 = peek(V, 303);\n        }\n      }\n    }\n    t93 = pow(2, ((-t89) / 1200));\n    poke(M, t93, t88);\n  }\n  if ((abs(peek(M, trunc(p0 + peek(V, 188) + 0.00001))) >= 0.00001)) {\n    t94 = (log((peek(V, 467) / 261.6)) / log(2));\n    poke(V, t94, 553);\n    t95 = ((abs((abs(peek(V, 375) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? max(0, min(26, (peek(V, 308) + (peek(V, 309) * peek(V, 553))))) : ((abs((((abs((abs(peek(V, 375) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((abs(peek(V, 342) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? max(0, min(15, (peek(V, 310) + (peek(V, 311) * peek(V, 553))))) : 0));\n    poke(V, t95, 554);\n    t96 = trunc(p0 + peek(V, 217) + 0.00001);\n    t97 = pow(2, ((-peek(V, 554)) / 1200));\n    t98 = (peek(M, t96) * t97);\n    poke(M, t98, t96);\n  }\n  if ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001)) {\n    t99 = trunc(p0 + peek(V, 186) + 0.00001);\n    poke(M, 0, t99);\n  }\n  t100 = (0.5 + (0.3 * max((-1), min(1, ((p1 - 60) / 30)))));\n  poke(V, t100, 555);\n  t101 = trunc(p0 + peek(V, 175) + 0.00001);\n  t102 = (cos(((peek(V, 555) * 0.5) * 3.141592653589793)) * 1.4142);\n  poke(M, t102, t101);\n  t103 = trunc(p0 + peek(V, 176) + 0.00001);\n  t104 = (sin(((peek(V, 555) * 0.5) * 3.141592653589793)) * 1.4142);\n  poke(M, t104, t103);\n  t105 = f_voice_control(V, M, mq, p0);\n  r = t105;\n  return r;\n}\n\nf_find_voice(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0;\n  r = 0;\n  poke(V, (-1), 570);\n  t1 = pow(10, 30);\n  poke(V, t1, 571);\n  poke(V, 0, 572);\n  t2 = min(1048576, trunc(peek(V, 99)));\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = (peek(V, 97) + (peek(V, 572) * peek(V, 98)));\n    poke(V, t4, 573);\n    t5 = ((abs(((abs(peek(M, trunc(peek(V, 573) + peek(V, 131) + 0.00001))) >= 0.00001) ? 0 : 1)) >= 0.00001) ? pow((-10), 20) : ((abs((peek(M, trunc(peek(V, 573) + peek(V, 142) + 0.00001)) >= 0 ? 1 : 0)) >= 0.00001) ? (pow((-10), 10) + (peek(M, trunc(peek(V, 573) + peek(V, 141) + 0.00001)) * pow(10, 9))) : peek(M, trunc(peek(V, 573) + peek(V, 136) + 0.00001))));\n    poke(V, t5, 574);\n    if ((abs((peek(V, 574) < peek(V, 571) ? 1 : 0)) >= 0.00001)) {\n      t6 = peek(V, 574);\n      poke(V, t6, 571);\n      t7 = peek(V, 573);\n      poke(V, t7, 570);\n    }\n    t8 = (peek(V, 572) + 1);\n    poke(V, t8, 572);\n  }\n  r = peek(V, 570);\n  return r;\n}\n\nf_note_on(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0;\n  r = 0;\n  if ((abs(peek(V, 358)) >= 0.00001)) {\n    t1 = peek(V, 97);\n    poke(V, t1, 458);\n    t2 = (((abs((((abs(peek(M, trunc(peek(V, 458) + peek(V, 131) + 0.00001))) >= 0.00001) && (abs(peek(M, trunc(peek(V, 458) + peek(V, 134) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((abs(peek(V, 348) - 4) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0);\n    poke(V, t2, 459);\n    t3 = trunc(peek(V, 119) + peek(V, 331) + 0.00001);\n    t4 = p0;\n    poke(M, t4, t3);\n    t5 = min((peek(V, 331) + 1), 60);\n    poke(V, t5, 331);\n    if ((abs(peek(V, 459)) >= 0.00001)) {\n      t6 = trunc(peek(V, 458) + peek(V, 138) + 0.00001);\n      t7 = p0;\n      poke(M, t7, t6);\n      t8 = p0;\n      poke(V, t8, 330);\n      t9 = trunc(peek(V, 458) + peek(V, 132) + 0.00001);\n      t10 = p0;\n      poke(M, t10, t9);\n      if ((abs((abs(peek(V, 348) - 3) < 0.00001 ? 0 : 1)) >= 0.00001)) {\n        t11 = trunc(peek(V, 458) + peek(V, 137) + 0.00001);\n        t12 = p0;\n        poke(M, t12, t11);\n      }\n      t13 = trunc(peek(V, 458) + peek(V, 180) + 0.00001);\n      t14 = f_tuning_cents(V, M, mq, p0);\n      if ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t16 = f_valve_cents(V, M, mq, p0);\n        t15 = t16;\n      }\n      else {\n        t15 = 0;\n      }\n      t17 = ((t14 + t15) + ((abs((abs(peek(V, 350) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? (-15) : 0));\n      t18 = f_age_detune(V, M, mq, p0);\n      t19 = (t17 + t18);\n      poke(M, t19, t13);\n      if ((abs((abs(peek(V, 348) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t20 = trunc(peek(V, 458) + peek(V, 209) + 0.00001);\n        t21 = (0.012 * peek(V, 89));\n        poke(M, t21, t20);\n      }\n      if ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t22 = trunc(peek(V, 458) + peek(V, 209) + 0.00001);\n        t23 = (0.028 * peek(V, 89));\n        poke(M, t23, t22);\n      }\n      if ((abs((((abs((abs(peek(V, 348) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs(((abs(peek(V, 374)) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t24 = f_start_pulse(V, M, mq, peek(V, 458), (0.35 * peek(M, trunc(peek(V, 458) + peek(V, 193) + 0.00001))));\n        r = t24;\n      }\n      else {\n        r = 0;\n      }\n    }\n    else {\n      t25 = f_voice_start(V, M, mq, peek(V, 458), p0, p1);\n      r = t25;\n    }\n  }\n  else {\n    t26 = f_find_voice(V, M, mq);\n    poke(V, t26, 458);\n    t27 = f_voice_start(V, M, mq, peek(V, 458), p0, p1);\n    r = t27;\n  }\n  return r;\n}\n\nf_release_t60(V, M, mq) {\n  r = 0;\n  r = (((abs((abs(peek(V, 350) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.12 : ((abs((abs(peek(V, 350) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.4 : ((abs((abs(peek(V, 350) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.08 : ((abs((abs(peek(V, 350) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.3 : 0.2)))) * ((abs((abs(peek(V, 351) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? (1 + (19 * peek(V, 325))) : 1));\n  return r;\n}\n\nf_bands_release(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0;\n  r = 0;\n  t1 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129));\n  poke(V, t1, 579);\n  t2 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 219) + 0.00001))));\n  r = 0;\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = pow(10, ((-3) / (peek(M, trunc(peek(V, 579) + 14 + 0.00001)) * ((abs((peek(M, trunc(peek(V, 579) + 14 + 0.00001)) > (4 * peek(M, trunc(p0 + peek(V, 187) + 0.00001))) ? 1 : 0)) >= 0.00001) ? (0.6 * p1) : p1))));\n    poke(V, t4, 580);\n    t5 = trunc(peek(V, 579) + 4 + 0.00001);\n    t6 = min(peek(M, trunc(peek(V, 579) + 4 + 0.00001)), peek(V, 580));\n    poke(M, t6, t5);\n    t7 = peek(V, 226);\n    t8 = (peek(V, 579) + t7);\n    poke(V, t8, 579);\n    r = t8;\n  }\n  return r;\n}\n\nf_modal_release(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0;\n  r = 0;\n  t1 = (p0 + peek(V, 100));\n  poke(V, t1, 581);\n  t2 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 177) + 0.00001))));\n  r = 0;\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = sqrt(abs(peek(M, trunc(peek(V, 581) + 1 + 0.00001))));\n    poke(V, t4, 582);\n    t5 = ((abs((peek(M, trunc(peek(V, 581) + 7 + 0.00001)) > (4 * peek(M, trunc(p0 + peek(V, 187) + 0.00001))) ? 1 : 0)) >= 0.00001) ? (0.6 * p1) : p1);\n    poke(V, t5, 583);\n    t6 = exp(((-6.907755) / (max(0.003, peek(V, 583)) * peek(V, 89))));\n    poke(V, t6, 584);\n    if ((abs((peek(V, 584) < peek(V, 582) ? 1 : 0)) >= 0.00001)) {\n      t7 = trunc(peek(V, 581) + 0.00001);\n      t8 = (peek(V, 584) / peek(V, 582));\n      t9 = (peek(M, t7) * t8);\n      poke(M, t9, t7);\n      t10 = trunc(peek(V, 581) + 1 + 0.00001);\n      t11 = (peek(V, 584) * peek(V, 584));\n      poke(M, t11, t10);\n    }\n    t12 = peek(V, 101);\n    t13 = (peek(V, 581) + t12);\n    poke(V, t13, 581);\n    r = t13;\n  }\n  return r;\n}\n\nf_voice_release(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  t1 = trunc(p0 + peek(V, 142) + 0.00001);\n  poke(M, 0, t1);\n  t2 = f_release_t60(V, M, mq);\n  poke(V, t2, 578);\n  if ((abs(peek(M, trunc(p0 + peek(V, 188) + 0.00001))) >= 0.00001)) {\n    t3 = f_wg_loss(V, M, mq, p0, min(peek(M, trunc(p0 + peek(V, 196) + 0.00001)), peek(V, 578)), min(peek(M, trunc(p0 + peek(V, 197) + 0.00001)), (0.6 * peek(V, 578))));\n    r = t3;\n  }\n  else {\n    if ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001)) {\n      t4 = f_bands_release(V, M, mq, p0, peek(V, 578));\n      r = t4;\n    }\n    else {\n      t5 = f_modal_release(V, M, mq, p0, peek(V, 578));\n      r = t5;\n    }\n  }\n  return r;\n}\n\nf_note_off(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0;\n  r = 0;\n  if ((abs(peek(V, 358)) >= 0.00001)) {\n    poke(V, 0, 575);\n    poke(V, 0, 576);\n    t1 = min(1048576, trunc(peek(V, 331)));\n    for (t2 = 0; t2 < t1; t2 += 1) {\n      if ((abs((abs(peek(M, trunc(peek(V, 119) + peek(V, 576) + 0.00001)) - p0) < 0.00001 ? 0 : 1)) >= 0.00001)) {\n        t3 = trunc(peek(V, 119) + peek(V, 575) + 0.00001);\n        t4 = peek(M, trunc(peek(V, 119) + peek(V, 576) + 0.00001));\n        poke(M, t4, t3);\n        t5 = (peek(V, 575) + 1);\n        poke(V, t5, 575);\n      }\n      t6 = (peek(V, 576) + 1);\n      poke(V, t6, 576);\n    }\n    t7 = peek(V, 575);\n    poke(V, t7, 331);\n    t8 = peek(V, 97);\n    poke(V, t8, 577);\n    if ((abs((((abs(peek(M, trunc(peek(V, 577) + peek(V, 131) + 0.00001))) >= 0.00001) && (abs((abs(peek(M, trunc(peek(V, 577) + peek(V, 132) + 0.00001)) - p0) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      if ((abs((((abs((peek(V, 331) > 0 ? 1 : 0)) >= 0.00001) && (abs((abs(peek(V, 348) - 4) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t9 = peek(M, trunc(peek(V, 119) + (peek(V, 331) - 1) + 0.00001));\n        poke(V, t9, 576);\n        t10 = trunc(peek(V, 577) + peek(V, 138) + 0.00001);\n        t11 = peek(V, 576);\n        poke(M, t11, t10);\n        t12 = trunc(peek(V, 577) + peek(V, 132) + 0.00001);\n        t13 = peek(V, 576);\n        poke(M, t13, t12);\n        if ((abs((abs(peek(V, 348) - 3) < 0.00001 ? 0 : 1)) >= 0.00001)) {\n          t14 = trunc(peek(V, 577) + peek(V, 137) + 0.00001);\n          t15 = peek(V, 576);\n          poke(M, t15, t14);\n        }\n        t16 = trunc(peek(V, 577) + peek(V, 180) + 0.00001);\n        t17 = f_tuning_cents(V, M, mq, peek(V, 576));\n        if ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t19 = f_valve_cents(V, M, mq, peek(V, 576));\n          t18 = t19;\n        }\n        else {\n          t18 = 0;\n        }\n        t20 = ((t17 + t18) + ((abs((abs(peek(V, 350) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? (-15) : 0));\n        poke(M, t20, t16);\n        if ((abs((abs(peek(V, 348) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t21 = trunc(peek(V, 577) + peek(V, 209) + 0.00001);\n          t22 = (0.012 * peek(V, 89));\n          poke(M, t22, t21);\n        }\n        if ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t23 = trunc(peek(V, 577) + peek(V, 209) + 0.00001);\n          t24 = (0.028 * peek(V, 89));\n          poke(M, t24, t23);\n          r = t24;\n        }\n        else {\n          r = 0;\n        }\n      }\n      else {\n        t25 = trunc(peek(V, 577) + peek(V, 134) + 0.00001);\n        poke(M, 0, t25);\n        if ((abs(peek(V, 328)) >= 0.00001)) {\n          t26 = trunc(peek(V, 577) + peek(V, 135) + 0.00001);\n          poke(M, 1, t26);\n          r = 1;\n        }\n        else {\n          t27 = f_voice_release(V, M, mq, peek(V, 577));\n          r = t27;\n        }\n      }\n    }\n    else {\n      r = 0;\n    }\n  }\n  else {\n    poke(V, 0, 585);\n    t28 = min(1048576, trunc(peek(V, 99)));\n    r = 0;\n    for (t29 = 0; t29 < t28; t29 += 1) {\n      t30 = (peek(V, 97) + (peek(V, 585) * peek(V, 98)));\n      poke(V, t30, 577);\n      if ((abs((((abs((((abs(peek(M, trunc(peek(V, 577) + peek(V, 131) + 0.00001))) >= 0.00001) && (abs(peek(M, trunc(peek(V, 577) + peek(V, 134) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((abs(peek(M, trunc(peek(V, 577) + peek(V, 132) + 0.00001)) - p0) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t31 = trunc(peek(V, 577) + peek(V, 134) + 0.00001);\n        poke(M, 0, t31);\n        if ((abs(peek(V, 328)) >= 0.00001)) {\n          t32 = trunc(peek(V, 577) + peek(V, 135) + 0.00001);\n          poke(M, 1, t32);\n        }\n        else {\n          t33 = f_voice_release(V, M, mq, peek(V, 577));\n        }\n      }\n      t34 = (peek(V, 585) + 1);\n      poke(V, t34, 585);\n      r = t34;\n    }\n  }\n  return r;\n}\n\nf_pedal_up(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0;\n  r = 0;\n  poke(V, 0, 586);\n  t1 = min(1048576, trunc(peek(V, 99)));\n  r = 0;\n  for (t2 = 0; t2 < t1; t2 += 1) {\n    t3 = (peek(V, 97) + (peek(V, 586) * peek(V, 98)));\n    poke(V, t3, 587);\n    if ((abs((((abs(peek(M, trunc(peek(V, 587) + peek(V, 131) + 0.00001))) >= 0.00001) && (abs(peek(M, trunc(peek(V, 587) + peek(V, 135) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t4 = trunc(peek(V, 587) + peek(V, 135) + 0.00001);\n      poke(M, 0, t4);\n      t5 = f_voice_release(V, M, mq, peek(V, 587));\n    }\n    t6 = (peek(V, 586) + 1);\n    poke(V, t6, 586);\n    r = t6;\n  }\n  return r;\n}\n\nf_lag_read(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0;\n  r = 0;\n  t1 = (floor(p2) - 1);\n  poke(V, t1, 604);\n  t2 = (p2 - peek(V, 604));\n  poke(V, t2, 605);\n  t3 = eel_band(((p1 - peek(V, 604)) + peek(V, 129)), peek(V, 130));\n  poke(V, t3, 606);\n  t4 = peek(M, trunc(p0 + peek(V, 606) + 0.00001));\n  poke(V, t4, 607);\n  t5 = peek(M, trunc(p0 + eel_band(((peek(V, 606) - 1) + peek(V, 129)), peek(V, 130)) + 0.00001));\n  poke(V, t5, 608);\n  t6 = peek(M, trunc(p0 + eel_band(((peek(V, 606) - 2) + peek(V, 129)), peek(V, 130)) + 0.00001));\n  poke(V, t6, 609);\n  t7 = peek(M, trunc(p0 + eel_band(((peek(V, 606) - 3) + peek(V, 129)), peek(V, 130)) + 0.00001));\n  poke(V, t7, 610);\n  t8 = (peek(V, 605) - 1);\n  poke(V, t8, 611);\n  t9 = (peek(V, 605) - 2);\n  poke(V, t9, 612);\n  t10 = (peek(V, 605) - 3);\n  poke(V, t10, 613);\n  r = ((((((((-peek(V, 611)) * peek(V, 612)) * peek(V, 613)) * (1 / 6)) * peek(V, 607)) + ((((peek(V, 605) * peek(V, 612)) * peek(V, 613)) * 0.5) * peek(V, 608))) - ((((peek(V, 605) * peek(V, 611)) * peek(V, 613)) * 0.5) * peek(V, 609))) + ((((peek(V, 605) * peek(V, 611)) * peek(V, 612)) * (1 / 6)) * peek(V, 610)));\n  return r;\n}\n\nf_lin_read(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0;\n  r = 0;\n  t1 = floor(p2);\n  poke(V, t1, 638);\n  t2 = (p2 - peek(V, 638));\n  poke(V, t2, 639);\n  r = (((1 - peek(V, 639)) * peek(M, trunc(p0 + eel_band(((p1 - peek(V, 638)) + peek(V, 129)), peek(V, 130)) + 0.00001))) + (peek(V, 639) * peek(M, trunc(p0 + eel_band((((p1 - peek(V, 638)) - 1) + peek(V, 129)), peek(V, 130)) + 0.00001))));\n  return r;\n}\n\nf_excite(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0;\n  r = 0;\n  t1 = peek(M, trunc(p0 + peek(V, 191) + 0.00001));\n  poke(V, t1, 623);\n  poke(V, 0, 624);\n  if ((abs(peek(M, trunc(p0 + peek(V, 192) + 0.00001))) >= 0.00001)) {\n    t2 = peek(M, trunc(p0 + peek(V, 201) + 0.00001));\n    poke(V, t2, 625);\n    if ((abs((abs(peek(V, 623) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t3 = (p1 - peek(V, 625));\n      poke(V, t3, 626);\n      t4 = max((-1), min(1, (0.7 - (0.3 * peek(V, 626)))));\n      poke(V, t4, 627);\n      t5 = ((peek(V, 625) - p1) * (1 - peek(V, 627)));\n      poke(V, t5, 624);\n    }\n    else {\n      if ((abs((abs(peek(V, 623) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t6 = (peek(V, 625) - ((2 * p1) * peek(V, 274)));\n        poke(V, t6, 628);\n        t7 = (peek(V, 266) * max(peek(M, trunc(p0 + peek(V, 214) + 0.00001)), 0));\n        poke(V, t7, 629);\n        t8 = (((2 * peek(V, 629)) * peek(V, 629)) / peek(V, 228));\n        poke(V, t8, 630);\n        t9 = peek(V, 628);\n        t10 = ((abs((peek(V, 629) > 0 ? 1 : 0)) >= 0.00001) ? ((0.5 * (((-peek(V, 630)) * peek(V, 270)) + sqrt(abs((pow((peek(V, 630) * peek(V, 270)), 2) + ((4 * peek(V, 630)) * abs(peek(V, 628)))))))) * (t9 > 0 ? 1 : (t9 < 0 ? -1 : 0))) : 0);\n        poke(V, t10, 631);\n        t11 = (peek(V, 628) - (peek(V, 270) * peek(V, 631)));\n        poke(V, t11, 632);\n        t12 = (((peek(V, 632) * peek(M, trunc(p0 + peek(V, 216) + 0.00001))) - (peek(M, trunc(p0 + peek(V, 162) + 0.00001)) * peek(M, trunc(p0 + peek(V, 215) + 0.00001)))) - (peek(M, trunc(p0 + peek(V, 163) + 0.00001)) * (peek(M, trunc(p0 + peek(V, 214) + 0.00001)) - peek(V, 267))));\n        poke(V, t12, 633);\n        t13 = trunc(p0 + peek(V, 215) + 0.00001);\n        t14 = (peek(V, 633) * peek(V, 312));\n        t15 = (peek(M, t13) + t14);\n        poke(M, t15, t13);\n        t16 = trunc(p0 + peek(V, 214) + 0.00001);\n        t17 = (peek(M, trunc(p0 + peek(V, 215) + 0.00001)) * peek(V, 312));\n        t18 = (peek(M, t16) + t17);\n        poke(M, t18, t16);\n        if ((abs((peek(M, trunc(p0 + peek(V, 214) + 0.00001)) < 0 ? 1 : 0)) >= 0.00001)) {\n          t19 = trunc(p0 + peek(V, 214) + 0.00001);\n          poke(M, 0, t19);\n          t20 = trunc(p0 + peek(V, 215) + 0.00001);\n          t21 = max(0, peek(M, trunc(p0 + peek(V, 215) + 0.00001)));\n          poke(M, t21, t20);\n        }\n        if ((abs((peek(M, trunc(p0 + peek(V, 214) + 0.00001)) > (3 * peek(V, 267)) ? 1 : 0)) >= 0.00001)) {\n          t22 = trunc(p0 + peek(V, 214) + 0.00001);\n          t23 = (3 * peek(V, 267));\n          poke(M, t23, t22);\n          t24 = trunc(p0 + peek(V, 215) + 0.00001);\n          t25 = min(0, peek(M, trunc(p0 + peek(V, 215) + 0.00001)));\n          poke(M, t25, t24);\n        }\n        t26 = ((peek(V, 270) * peek(V, 631)) / peek(V, 274));\n        poke(V, t26, 624);\n      }\n      else {\n        if ((abs((abs(peek(V, 623) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t27 = (peek(V, 625) - p1);\n          poke(V, t27, 634);\n          t28 = (abs(((peek(V, 634) + 0.001) * ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001) ? peek(V, 294) : (peek(V, 304) * ((abs(peek(M, trunc(p0 + peek(V, 189) + 0.00001))) >= 0.00001) ? pow((max(0.02, peek(M, trunc(p0 + peek(V, 195) + 0.00001))) / 0.2), peek(V, 305)) : peek(V, 306)))))) + 0.75);\n          poke(V, t28, 635);\n          t29 = (peek(V, 635) * peek(V, 635));\n          poke(V, t29, 635);\n          t30 = (1 / (peek(V, 635) * peek(V, 635)));\n          poke(V, t30, 635);\n          t31 = (peek(V, 634) * max(0.01, min(0.98, peek(V, 635))));\n          poke(V, t31, 624);\n        }\n        else {\n          t32 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + (2 * peek(V, 129)));\n          poke(V, t32, 636);\n          t33 = (peek(V, 625) - (0.5 * p1));\n          poke(V, t33, 637);\n          t34 = f_lin_read(V, M, mq, peek(V, 636), peek(M, trunc(p0 + peek(V, 150) + 0.00001)), peek(M, trunc(p0 + peek(V, 153) + 0.00001)));\n          poke(V, t34, 640);\n          t35 = trunc(peek(V, 636) + peek(M, trunc(p0 + peek(V, 150) + 0.00001)) + 0.00001);\n          t36 = peek(V, 637);\n          poke(M, t36, t35);\n          t37 = (max((-1), min(1, (peek(V, 640) * ((peek(V, 640) * peek(V, 640)) - 1)))) - (0.5 * p1));\n          poke(V, t37, 624);\n        }\n      }\n    }\n  }\n  else {\n    if ((abs((peek(M, trunc(p0 + peek(V, 144) + 0.00001)) >= 0 ? 1 : 0)) >= 0.00001)) {\n      t38 = (peek(M, trunc(p0 + peek(V, 144) + 0.00001)) / peek(M, trunc(p0 + peek(V, 146) + 0.00001)));\n      poke(V, t38, 641);\n      if ((abs((peek(V, 641) < 1 ? 1 : 0)) >= 0.00001)) {\n        t39 = ((abs((abs(peek(V, 623) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? (peek(M, trunc(p0 + peek(V, 145) + 0.00001)) * peek(V, 641)) : (peek(M, trunc(p0 + peek(V, 145) + 0.00001)) * sin((3.141592653589793 * peek(V, 641)))));\n        poke(V, t39, 624);\n        t40 = trunc(p0 + peek(V, 144) + 0.00001);\n        t41 = (peek(M, t40) + 1);\n        poke(M, t41, t40);\n      }\n      else {\n        t42 = trunc(p0 + peek(V, 144) + 0.00001);\n        poke(M, (-1), t42);\n      }\n    }\n    if ((abs((abs(peek(V, 623) - 5) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t43 = trunc(p0 + peek(V, 178) + 0.00001);\n      t44 = (peek(V, 383) * (peek(V, 624) - peek(M, trunc(p0 + peek(V, 178) + 0.00001))));\n      t45 = (peek(M, t43) + t44);\n      poke(M, t45, t43);\n      t46 = (peek(M, trunc(p0 + peek(V, 178) + 0.00001)) * 1.5);\n      poke(V, t46, 624);\n    }\n    if ((abs((((abs((abs(peek(V, 623) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((peek(M, trunc(p0 + peek(V, 206) + 0.00001)) > 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n      t47 = ((((peek(V, 88) / 2147483647 * 2) - 1) * 0.15) * peek(M, trunc(p0 + peek(V, 145) + 0.00001)));\n      t48 = (peek(V, 624) + t47);\n      poke(V, t48, 624);\n      t49 = trunc(p0 + peek(V, 206) + 0.00001);\n      t50 = (peek(M, t49) - 1);\n      poke(M, t50, t49);\n    }\n  }\n  r = peek(V, 624);\n  return r;\n}\n\nf_tanh_(V, M, mq, p0) {\n  t1 = 0; t2 = 0;\n  r = 0;\n  t1 = max((-9), min(9, p0));\n  p0 = t1;\n  t2 = exp((2 * p0));\n  poke(V, t2, 652);\n  r = ((peek(V, 652) - 1) / (peek(V, 652) + 1));\n  return r;\n}\n\nf_voice_tick(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0; t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0; t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0; t106 = 0; t107 = 0; t108 = 0; t109 = 0; t110 = 0; t111 = 0; t112 = 0; t113 = 0; t114 = 0; t115 = 0; t116 = 0; t117 = 0; t118 = 0; t119 = 0; t120 = 0; t121 = 0; t122 = 0; t123 = 0; t124 = 0; t125 = 0; t126 = 0; t127 = 0; t128 = 0; t129 = 0; t130 = 0; t131 = 0; t132 = 0; t133 = 0; t134 = 0; t135 = 0; t136 = 0; t137 = 0; t138 = 0; t139 = 0; t140 = 0; t141 = 0; t142 = 0; t143 = 0; t144 = 0; t145 = 0; t146 = 0; t147 = 0; t148 = 0; t149 = 0; t150 = 0; t151 = 0; t152 = 0; t153 = 0; t154 = 0; t155 = 0; t156 = 0; t157 = 0; t158 = 0; t159 = 0; t160 = 0; t161 = 0; t162 = 0; t163 = 0; t164 = 0; t165 = 0; t166 = 0; t167 = 0; t168 = 0; t169 = 0; t170 = 0; t171 = 0; t172 = 0; t173 = 0; t174 = 0; t175 = 0; t176 = 0; t177 = 0; t178 = 0; t179 = 0; t180 = 0; t181 = 0; t182 = 0; t183 = 0; t184 = 0; t185 = 0; t186 = 0; t187 = 0; t188 = 0; t189 = 0; t190 = 0; t191 = 0; t192 = 0; t193 = 0; t194 = 0; t195 = 0; t196 = 0; t197 = 0; t198 = 0; t199 = 0; t200 = 0; t201 = 0; t202 = 0; t203 = 0; t204 = 0; t205 = 0;\n  r = 0;\n  t1 = peek(M, trunc(p0 + peek(V, 139) + 0.00001));\n  poke(V, t1, 595);\n  t2 = trunc(p0 + peek(V, 139) + 0.00001);\n  t3 = (peek(V, 595) + peek(V, 312));\n  poke(M, t3, t2);\n  if ((abs(peek(M, trunc(p0 + peek(V, 211) + 0.00001))) >= 0.00001)) {\n    t4 = ((abs((((abs(peek(M, trunc(p0 + peek(V, 134) + 0.00001))) >= 0.00001) || (abs(peek(M, trunc(p0 + peek(V, 135) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 1 : 0);\n    poke(V, t4, 596);\n    t5 = trunc(p0 + peek(V, 140) + 0.00001);\n    t6 = ((peek(V, 596) - peek(M, trunc(p0 + peek(V, 140) + 0.00001))) * ((abs((peek(V, 596) > peek(M, trunc(p0 + peek(V, 140) + 0.00001)) ? 1 : 0)) >= 0.00001) ? peek(V, 379) : peek(V, 380)));\n    t7 = (peek(M, t5) + t6);\n    poke(M, t7, t5);\n  }\n  else {\n    t8 = trunc(p0 + peek(V, 140) + 0.00001);\n    t9 = ((abs((peek(V, 595) < peek(V, 363) ? 1 : 0)) >= 0.00001) ? (peek(V, 595) / peek(V, 363)) : ((abs((peek(V, 595) < (peek(V, 363) + peek(V, 371)) ? 1 : 0)) >= 0.00001) ? 1 : exp(((-((peek(V, 595) - peek(V, 363)) - peek(V, 371))) / peek(V, 370)))));\n    poke(M, t9, t8);\n  }\n  t10 = peek(M, trunc(p0 + peek(V, 140) + 0.00001));\n  poke(V, t10, 597);\n  t11 = ((peek(M, trunc(p0 + peek(V, 193) + 0.00001)) * peek(V, 320)) * ((1 + (0.4 * peek(V, 324))) + ((abs((abs(peek(V, 351) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? (0.3 * peek(V, 325)) : 0)));\n  poke(V, t11, 598);\n  if ((abs((peek(M, trunc(p0 + peek(V, 209) + 0.00001)) > 0 ? 1 : 0)) >= 0.00001)) {\n    t12 = (1 - (0.6 * sin(((3.141592653589793 * peek(M, trunc(p0 + peek(V, 209) + 0.00001))) / ((abs((abs(peek(V, 348) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? (0.028 * peek(V, 89)) : (0.012 * peek(V, 89)))))));\n    t13 = (peek(V, 597) * t12);\n    poke(V, t13, 597);\n    t14 = trunc(p0 + peek(V, 209) + 0.00001);\n    t15 = (peek(M, t14) - 1);\n    poke(M, t15, t14);\n  }\n  poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n  t16 = ((peek(V, 88) / 2147483647 * 2) - 1);\n  poke(V, t16, 599);\n  if ((abs(peek(M, trunc(p0 + peek(V, 192) + 0.00001))) >= 0.00001)) {\n    t17 = ((abs((abs(peek(M, trunc(p0 + peek(V, 191) + 0.00001)) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? (0.6 + (0.3 * peek(V, 598))) : ((abs((abs(peek(M, trunc(p0 + peek(V, 191) + 0.00001)) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? (1500 + (4500 * peek(V, 598))) : ((abs((abs(peek(M, trunc(p0 + peek(V, 191) + 0.00001)) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? (0.03 + (0.2 * peek(V, 598))) : (1 + (0.25 * peek(V, 598))))));\n    poke(V, t17, 600);\n    t18 = peek(V, 597);\n    t19 = (peek(V, 600) * t18);\n    poke(V, t19, 600);\n    t20 = ((peek(V, 600) * peek(V, 599)) * ((peek(V, 365) + ((abs((abs(peek(V, 346) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.02 : 0)) + (peek(V, 284) * peek(V, 288))));\n    t21 = (peek(V, 600) + t20);\n    poke(V, t21, 600);\n    t22 = trunc(p0 + peek(V, 201) + 0.00001);\n    t23 = peek(V, 600);\n    poke(M, t23, t22);\n    t24 = trunc(p0 + peek(V, 220) + 0.00001);\n    t25 = (peek(V, 597) * peek(V, 598));\n    poke(M, t25, t24);\n  }\n  else {\n    if ((abs((((abs(peek(M, trunc(p0 + peek(V, 211) + 0.00001))) >= 0.00001) && (abs((peek(V, 597) > 0.02 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t26 = trunc(p0 + peek(V, 143) + 0.00001);\n      t27 = peek(V, 312);\n      t28 = (peek(M, t26) - t27);\n      poke(M, t28, t26);\n      if ((abs((peek(M, trunc(p0 + peek(V, 143) + 0.00001)) <= 0 ? 1 : 0)) >= 0.00001)) {\n        t29 = p0;\n        t30 = (peek(V, 598) * peek(V, 597));\n        poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n        t31 = f_start_pulse(V, M, mq, t29, (t30 * (0.85 + (0.3 * (peek(V, 88) / 2147483647 * 1)))));\n        t32 = trunc(p0 + peek(V, 143) + 0.00001);\n        t33 = peek(V, 367);\n        poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n        t34 = ((1 + (t33 * ((peek(V, 88) / 2147483647 * 2) - 1))) / (peek(V, 366) * (0.6 + ((0.8 * peek(V, 597)) * peek(V, 598)))));\n        poke(M, t34, t32);\n      }\n    }\n  }\n  t35 = peek(M, trunc(p0 + peek(V, 150) + 0.00001));\n  poke(V, t35, 601);\n  if ((abs(peek(M, trunc(p0 + peek(V, 188) + 0.00001))) >= 0.00001)) {\n    t36 = peek(M, trunc(p0 + peek(V, 202) + 0.00001));\n    poke(V, t36, 602);\n    t37 = (peek(V, 602) + peek(V, 129));\n    poke(V, t37, 603);\n    t38 = f_lag_read(V, M, mq, peek(V, 602), peek(V, 601), peek(M, trunc(p0 + peek(V, 151) + 0.00001)));\n    poke(V, t38, 614);\n    t39 = ((peek(M, trunc(p0 + peek(V, 155) + 0.00001)) * peek(V, 614)) + (peek(M, trunc(p0 + peek(V, 156) + 0.00001)) * peek(M, trunc(p0 + peek(V, 157) + 0.00001))));\n    poke(V, t39, 615);\n    t40 = trunc(p0 + peek(V, 157) + 0.00001);\n    t41 = peek(V, 615);\n    poke(M, t41, t40);\n    t42 = peek(M, trunc(p0 + peek(V, 160) + 0.00001));\n    poke(V, t42, 616);\n    if ((abs((peek(V, 616) > 0 ? 1 : 0)) >= 0.00001)) {\n      t43 = peek(M, trunc(p0 + peek(V, 159) + 0.00001));\n      poke(V, t43, 617);\n      t44 = (p0 + peek(V, 161));\n      poke(V, t44, 618);\n      t45 = min(1048576, trunc(peek(V, 616)));\n      for (t46 = 0; t46 < t45; t46 += 1) {\n        t47 = ((peek(V, 617) * (peek(V, 615) - peek(M, trunc(peek(V, 618) + 1 + 0.00001)))) + peek(M, trunc(peek(V, 618) + 0.00001)));\n        poke(V, t47, 619);\n        t48 = trunc(peek(V, 618) + 0.00001);\n        t49 = peek(V, 615);\n        poke(M, t49, t48);\n        t50 = trunc(peek(V, 618) + 1 + 0.00001);\n        t51 = peek(V, 619);\n        poke(M, t51, t50);\n        t52 = peek(V, 619);\n        poke(V, t52, 615);\n        t53 = (peek(V, 618) + 2);\n        poke(V, t53, 618);\n      }\n    }\n    if ((abs((peek(M, trunc(p0 + peek(V, 183) + 0.00001)) > 0 ? 1 : 0)) >= 0.00001)) {\n      t54 = trunc(p0 + peek(V, 182) + 0.00001);\n      t55 = (peek(M, trunc(p0 + peek(V, 183) + 0.00001)) * (peek(V, 615) - peek(M, trunc(p0 + peek(V, 182) + 0.00001))));\n      t56 = (peek(M, t54) + t55);\n      poke(M, t56, t54);\n      t57 = (peek(V, 275) * (peek(M, trunc(p0 + peek(V, 182) + 0.00001)) - peek(V, 615)));\n      t58 = (peek(V, 615) + t57);\n      poke(V, t58, 615);\n    }\n    t59 = (peek(M, trunc(p0 + peek(V, 158) + 0.00001)) * peek(V, 615));\n    poke(V, t59, 620);\n    if ((abs(peek(M, trunc(p0 + peek(V, 189) + 0.00001))) >= 0.00001)) {\n      t60 = (-peek(M, trunc(peek(V, 603) + eel_band(((peek(V, 601) - peek(M, trunc(p0 + peek(V, 152) + 0.00001))) + peek(V, 129)), peek(V, 130)) + 0.00001)));\n      poke(V, t60, 621);\n      t61 = (peek(V, 620) + peek(V, 621));\n      poke(V, t61, 622);\n    }\n    else {\n      t62 = peek(V, 620);\n      poke(V, t62, 622);\n    }\n    t63 = f_excite(V, M, mq, p0, peek(V, 622));\n    poke(V, t63, 619);\n    t64 = (((abs(peek(M, trunc(p0 + peek(V, 189) + 0.00001))) >= 0.00001) ? peek(V, 621) : peek(V, 622)) + peek(V, 619));\n    poke(V, t64, 642);\n    if ((abs(peek(M, trunc(p0 + peek(V, 203) + 0.00001))) >= 0.00001)) {\n      t65 = ((peek(V, 642) - peek(M, trunc(p0 + peek(V, 168) + 0.00001))) + (peek(V, 261) * peek(M, trunc(p0 + peek(V, 169) + 0.00001))));\n      poke(V, t65, 615);\n      t66 = trunc(p0 + peek(V, 168) + 0.00001);\n      t67 = peek(V, 642);\n      poke(M, t67, t66);\n      t68 = trunc(p0 + peek(V, 169) + 0.00001);\n      t69 = peek(V, 615);\n      poke(M, t69, t68);\n      t70 = peek(V, 615);\n      poke(V, t70, 642);\n    }\n    t71 = trunc(peek(V, 602) + peek(V, 601) + 0.00001);\n    t72 = peek(V, 642);\n    poke(M, t72, t71);\n    if ((abs(peek(M, trunc(p0 + peek(V, 189) + 0.00001))) >= 0.00001)) {\n      t73 = trunc(peek(V, 603) + peek(V, 601) + 0.00001);\n      t74 = (peek(V, 620) + peek(V, 619));\n      poke(M, t74, t73);\n    }\n    t75 = ((abs((abs(peek(V, 342) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? (peek(V, 614) + peek(V, 620)) : peek(V, 614));\n    poke(V, t75, 643);\n  }\n  else {\n    if ((abs(peek(M, trunc(p0 + peek(V, 218) + 0.00001))) >= 0.00001)) {\n      t76 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129));\n      poke(V, t76, 644);\n      poke(V, 0, 622);\n      t77 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 219) + 0.00001))));\n      for (t78 = 0; t78 < t77; t78 += 1) {\n        t79 = floor(peek(M, trunc(peek(V, 644) + 3 + 0.00001)));\n        poke(V, t79, 645);\n        t80 = (peek(M, trunc(peek(V, 644) + 3 + 0.00001)) - peek(V, 645));\n        poke(V, t80, 646);\n        t81 = (peek(M, trunc(peek(V, 644) + 2 + 0.00001)) - peek(V, 645));\n        poke(V, t81, 647);\n        if ((abs((peek(V, 647) < 0 ? 1 : 0)) >= 0.00001)) {\n          t82 = peek(M, trunc(peek(V, 644) + 1 + 0.00001));\n          t83 = (peek(V, 647) + t82);\n          poke(V, t83, 647);\n        }\n        t84 = (peek(V, 647) - 1);\n        poke(V, t84, 648);\n        if ((abs((peek(V, 648) < 0 ? 1 : 0)) >= 0.00001)) {\n          t85 = peek(M, trunc(peek(V, 644) + 1 + 0.00001));\n          t86 = (peek(V, 648) + t85);\n          poke(V, t86, 648);\n        }\n        t87 = peek(M, trunc(peek(V, 644) + 0.00001));\n        poke(V, t87, 649);\n        t88 = (((1 - peek(V, 646)) * peek(M, trunc(peek(V, 649) + peek(V, 647) + 0.00001))) + (peek(V, 646) * peek(M, trunc(peek(V, 649) + peek(V, 648) + 0.00001))));\n        poke(V, t88, 615);\n        t89 = trunc(peek(V, 644) + 16 + 0.00001);\n        t90 = peek(V, 615);\n        poke(M, t90, t89);\n        t91 = (peek(M, trunc(peek(V, 644) + 12 + 0.00001)) * peek(V, 615));\n        t92 = (peek(V, 622) + t91);\n        poke(V, t92, 622);\n        t93 = peek(V, 226);\n        t94 = (peek(V, 644) + t93);\n        poke(V, t94, 644);\n      }\n      t95 = f_excite(V, M, mq, p0, peek(V, 622));\n      t96 = ((t95 * peek(M, trunc(p0 + peek(V, 212) + 0.00001))) * (1 + ((peek(V, 295) - 1) * min(1, (2 * peek(V, 597))))));\n      poke(V, t96, 619);\n      t97 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + peek(V, 129));\n      poke(V, t97, 644);\n      poke(V, 0, 650);\n      t98 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 219) + 0.00001))));\n      for (t99 = 0; t99 < t98; t99 += 1) {\n        t100 = ((peek(M, trunc(peek(V, 644) + 12 + 0.00001)) * peek(V, 619)) + (peek(M, trunc(peek(V, 644) + 4 + 0.00001)) * peek(M, trunc(peek(V, 644) + 16 + 0.00001))));\n        poke(V, t100, 651);\n        t101 = (((peek(M, trunc(peek(V, 644) + 5 + 0.00001)) * (peek(V, 651) - peek(M, trunc(peek(V, 644) + 9 + 0.00001)))) - (peek(M, trunc(peek(V, 644) + 6 + 0.00001)) * peek(M, trunc(peek(V, 644) + 10 + 0.00001)))) - (peek(M, trunc(peek(V, 644) + 7 + 0.00001)) * peek(M, trunc(peek(V, 644) + 11 + 0.00001))));\n        poke(V, t101, 615);\n        t102 = trunc(peek(V, 644) + 9 + 0.00001);\n        t103 = peek(M, trunc(peek(V, 644) + 8 + 0.00001));\n        poke(M, t103, t102);\n        t104 = trunc(peek(V, 644) + 8 + 0.00001);\n        t105 = peek(V, 651);\n        poke(M, t105, t104);\n        t106 = trunc(peek(V, 644) + 11 + 0.00001);\n        t107 = peek(M, trunc(peek(V, 644) + 10 + 0.00001));\n        poke(M, t107, t106);\n        t108 = trunc(peek(V, 644) + 10 + 0.00001);\n        t109 = peek(V, 615);\n        poke(M, t109, t108);\n        t110 = peek(M, trunc(peek(V, 644) + 0.00001));\n        poke(V, t110, 649);\n        t111 = trunc(peek(V, 649) + peek(M, trunc(peek(V, 644) + 2 + 0.00001)) + 0.00001);\n        t112 = peek(V, 615);\n        poke(M, t112, t111);\n        t113 = trunc(peek(V, 644) + 2 + 0.00001);\n        t114 = (peek(M, t113) + 1);\n        poke(M, t114, t113);\n        if ((abs((peek(M, trunc(peek(V, 644) + 2 + 0.00001)) >= peek(M, trunc(peek(V, 644) + 1 + 0.00001)) ? 1 : 0)) >= 0.00001)) {\n          t115 = trunc(peek(V, 644) + 2 + 0.00001);\n          poke(M, 0, t115);\n        }\n        t116 = (peek(M, trunc(peek(V, 644) + 13 + 0.00001)) * peek(V, 615));\n        t117 = (peek(V, 650) + t116);\n        poke(V, t117, 650);\n        t118 = peek(V, 226);\n        t119 = (peek(V, 644) + t118);\n        poke(V, t119, 644);\n      }\n      t120 = peek(V, 650);\n      poke(V, t120, 643);\n      if ((abs(peek(M, trunc(p0 + peek(V, 213) + 0.00001))) >= 0.00001)) {\n        t121 = (0.6 * peek(M, trunc(p0 + peek(V, 220) + 0.00001)));\n        t122 = f_tanh_(V, M, mq, (4 * peek(V, 622)));\n        t123 = (t121 * t122);\n        t124 = (peek(V, 643) + t123);\n        poke(V, t124, 643);\n      }\n    }\n    else {\n      t125 = peek(M, trunc(p0 + peek(V, 149) + 0.00001));\n      poke(V, t125, 622);\n      t126 = p0;\n      if ((abs(peek(M, trunc(p0 + peek(V, 192) + 0.00001))) >= 0.00001)) {\n        t128 = f_tanh_(V, M, mq, peek(V, 622));\n        t127 = t128;\n      }\n      else {\n        t127 = peek(V, 622);\n      }\n      t129 = f_excite(V, M, mq, t126, t127);\n      poke(V, t129, 619);\n      t130 = (peek(V, 619) - peek(M, trunc(p0 + peek(V, 148) + 0.00001)));\n      poke(V, t130, 653);\n      t131 = trunc(p0 + peek(V, 148) + 0.00001);\n      t132 = peek(M, trunc(p0 + peek(V, 147) + 0.00001));\n      poke(M, t132, t131);\n      t133 = trunc(p0 + peek(V, 147) + 0.00001);\n      t134 = peek(V, 619);\n      poke(M, t134, t133);\n      t135 = (p0 + peek(V, 100));\n      poke(V, t135, 644);\n      poke(V, 0, 654);\n      poke(V, 0, 650);\n      t136 = min(1048576, trunc(peek(M, trunc(p0 + peek(V, 177) + 0.00001))));\n      for (t137 = 0; t137 < t136; t137 += 1) {\n        t138 = (((peek(M, trunc(peek(V, 644) + 0.00001)) * peek(M, trunc(peek(V, 644) + 2 + 0.00001))) - (peek(M, trunc(peek(V, 644) + 1 + 0.00001)) * peek(M, trunc(peek(V, 644) + 3 + 0.00001)))) + (peek(M, trunc(peek(V, 644) + 4 + 0.00001)) * peek(V, 653)));\n        poke(V, t138, 615);\n        t139 = trunc(peek(V, 644) + 3 + 0.00001);\n        t140 = peek(M, trunc(peek(V, 644) + 2 + 0.00001));\n        poke(M, t140, t139);\n        t141 = trunc(peek(V, 644) + 2 + 0.00001);\n        t142 = peek(V, 615);\n        poke(M, t142, t141);\n        t143 = (peek(M, trunc(peek(V, 644) + 5 + 0.00001)) * peek(V, 615));\n        t144 = (peek(V, 654) + t143);\n        poke(V, t144, 654);\n        t145 = (peek(M, trunc(peek(V, 644) + 6 + 0.00001)) * peek(V, 615));\n        t146 = (peek(V, 650) + t145);\n        poke(V, t146, 650);\n        t147 = peek(V, 101);\n        t148 = (peek(V, 644) + t147);\n        poke(V, t148, 644);\n      }\n      t149 = trunc(p0 + peek(V, 149) + 0.00001);\n      t150 = peek(V, 654);\n      poke(M, t150, t149);\n      t151 = peek(V, 650);\n      poke(V, t151, 643);\n      if ((abs(peek(M, trunc(p0 + peek(V, 213) + 0.00001))) >= 0.00001)) {\n        t152 = (0.6 * peek(M, trunc(p0 + peek(V, 220) + 0.00001)));\n        t153 = f_tanh_(V, M, mq, (4 * peek(V, 654)));\n        t154 = (t152 * t153);\n        t155 = (peek(V, 643) + t154);\n        poke(V, t155, 643);\n      }\n    }\n  }\n  t156 = ((peek(V, 643) - peek(M, trunc(p0 + peek(V, 166) + 0.00001))) + (peek(V, 261) * peek(M, trunc(p0 + peek(V, 167) + 0.00001))));\n  poke(V, t156, 615);\n  t157 = trunc(p0 + peek(V, 166) + 0.00001);\n  t158 = peek(V, 643);\n  poke(M, t158, t157);\n  t159 = trunc(p0 + peek(V, 167) + 0.00001);\n  t160 = peek(V, 615);\n  poke(M, t160, t159);\n  t161 = peek(V, 615);\n  poke(V, t161, 643);\n  if ((abs((((abs((((abs((abs(peek(V, 346) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((peek(V, 288) > 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs(peek(M, trunc(p0 + peek(V, 192) + 0.00001))) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t162 = trunc(p0 + peek(V, 204) + 0.00001);\n    t163 = (0.3 * (peek(V, 599) - peek(M, trunc(p0 + peek(V, 204) + 0.00001))));\n    t164 = (peek(M, t162) + t163);\n    poke(M, t164, t162);\n    t165 = (peek(V, 599) - peek(M, trunc(p0 + peek(V, 204) + 0.00001)));\n    poke(V, t165, 655);\n    t166 = (((((abs((abs(peek(V, 346) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.02 : 0) + ((peek(V, 285) * peek(V, 288)) * peek(V, 288))) * peek(V, 655)) * peek(M, trunc(p0 + peek(V, 220) + 0.00001)));\n    t167 = (peek(V, 643) + t166);\n    poke(V, t167, 643);\n  }\n  t168 = peek(M, trunc(p0 + peek(V, 184) + 0.00001));\n  t169 = (peek(V, 643) * t168);\n  poke(V, t169, 643);\n  if ((abs((peek(V, 372) > 0 ? 1 : 0)) >= 0.00001)) {\n    t170 = (peek(V, 643) - max((-peek(V, 290)), min(peek(V, 290), peek(V, 643))));\n    poke(V, t170, 651);\n    t171 = (0.9 * ((peek(M, trunc(p0 + peek(V, 222) + 0.00001)) + peek(V, 651)) - peek(M, trunc(p0 + peek(V, 223) + 0.00001))));\n    poke(V, t171, 615);\n    t172 = trunc(p0 + peek(V, 223) + 0.00001);\n    t173 = peek(V, 651);\n    poke(M, t173, t172);\n    t174 = trunc(p0 + peek(V, 222) + 0.00001);\n    t175 = peek(V, 615);\n    poke(M, t175, t174);\n    t176 = ((peek(V, 372) * peek(V, 291)) * peek(V, 615));\n    t177 = (peek(V, 643) + t176);\n    poke(V, t177, 643);\n  }\n  if ((abs((peek(V, 373) > 0 ? 1 : 0)) >= 0.00001)) {\n    poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n    if ((abs(((peek(V, 88) / 2147483647 * 1) < ((peek(V, 373) * min(1, (8 * abs(peek(V, 643))))) * peek(V, 314)) ? 1 : 0)) >= 0.00001)) {\n      poke(V, peek(V, 88) * 16807 - 2147483647 * floor(peek(V, 88) * 16807 / 2147483647), 88);\n      t178 = (((peek(V, 88) / 2147483647 * 2) - 1) * (0.05 + abs(peek(V, 643))));\n    }\n    else {\n      t178 = 0;\n    }\n    poke(V, t178, 651);\n    t179 = (0.6 * ((peek(M, trunc(p0 + peek(V, 224) + 0.00001)) + peek(V, 651)) - peek(M, trunc(p0 + peek(V, 225) + 0.00001))));\n    poke(V, t179, 615);\n    t180 = trunc(p0 + peek(V, 225) + 0.00001);\n    t181 = peek(V, 651);\n    poke(M, t181, t180);\n    t182 = trunc(p0 + peek(V, 224) + 0.00001);\n    t183 = peek(V, 615);\n    poke(M, t183, t182);\n    t184 = peek(V, 615);\n    t185 = (peek(V, 643) + t184);\n    poke(V, t185, 643);\n  }\n  t186 = peek(V, 643);\n  poke(V, t186, 656);\n  if ((abs(peek(M, trunc(p0 + peek(V, 194) + 0.00001))) >= 0.00001)) {\n    t187 = (peek(M, trunc(p0 + peek(V, 202) + 0.00001)) + (3 * peek(V, 129)));\n    poke(V, t187, 657);\n    t188 = f_lin_read(V, M, mq, peek(V, 657), peek(V, 601), peek(M, trunc(p0 + peek(V, 154) + 0.00001)));\n    poke(V, t188, 658);\n    t189 = ((peek(M, trunc(p0 + peek(V, 173) + 0.00001)) * peek(V, 658)) + (peek(M, trunc(p0 + peek(V, 174) + 0.00001)) * peek(M, trunc(p0 + peek(V, 170) + 0.00001))));\n    poke(V, t189, 615);\n    t190 = trunc(p0 + peek(V, 170) + 0.00001);\n    t191 = peek(V, 615);\n    poke(M, t191, t190);\n    t192 = (peek(V, 643) + (peek(M, trunc(p0 + peek(V, 172) + 0.00001)) * peek(V, 615)));\n    poke(V, t192, 656);\n    t193 = trunc(peek(V, 657) + peek(V, 601) + 0.00001);\n    t194 = peek(V, 656);\n    poke(M, t194, t193);\n    t195 = (0.5 * (1 - min(0.97, peek(M, trunc(p0 + peek(V, 171) + 0.00001)))));\n    t196 = (peek(V, 656) * t195);\n    poke(V, t196, 656);\n    t197 = (peek(V, 656) * 2.5);\n    poke(V, t197, 656);\n  }\n  t198 = trunc(p0 + peek(V, 150) + 0.00001);\n  t199 = eel_band((peek(V, 601) + 1), peek(V, 130));\n  poke(M, t199, t198);\n  t200 = abs(peek(V, 643));\n  poke(V, t200, 617);\n  t201 = trunc(p0 + peek(V, 141) + 0.00001);\n  t202 = max(peek(V, 617), (peek(M, trunc(p0 + peek(V, 141) + 0.00001)) * peek(V, 313)));\n  poke(M, t202, t201);\n  if ((abs((((abs((((abs((((abs((((abs((peek(M, trunc(p0 + peek(V, 139) + 0.00001)) > 0.05 ? 1 : 0)) >= 0.00001) && (abs((peek(M, trunc(p0 + peek(V, 141) + 0.00001)) < 0.00002 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((peek(V, 597) < 0.002 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((peek(M, trunc(p0 + peek(V, 144) + 0.00001)) < 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((((abs((peek(M, trunc(p0 + peek(V, 142) + 0.00001)) >= 0 ? 1 : 0)) >= 0.00001) || (abs(((abs(peek(M, trunc(p0 + peek(V, 211) + 0.00001))) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t203 = trunc(p0 + peek(V, 131) + 0.00001);\n    poke(M, 0, t203);\n  }\n  t204 = peek(V, 643);\n  poke(V, t204, 659);\n  t205 = peek(V, 656);\n  poke(V, t205, 660);\n  r = t205;\n  return r;\n}\n\nf_bq(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0;\n  r = 0;\n  t1 = (((((peek(M, trunc(p0 + 0.00001)) * p2) + (peek(M, trunc(p0 + 1 + 0.00001)) * peek(M, trunc(p1 + 0.00001)))) + (peek(M, trunc(p0 + 2 + 0.00001)) * peek(M, trunc(p1 + 1 + 0.00001)))) - (peek(M, trunc(p0 + 3 + 0.00001)) * peek(M, trunc(p1 + 2 + 0.00001)))) - (peek(M, trunc(p0 + 4 + 0.00001)) * peek(M, trunc(p1 + 3 + 0.00001))));\n  poke(V, t1, 663);\n  t2 = trunc(p1 + 1 + 0.00001);\n  t3 = peek(M, trunc(p1 + 0.00001));\n  poke(M, t3, t2);\n  t4 = trunc(p1 + 0.00001);\n  t5 = p2;\n  poke(M, t5, t4);\n  t6 = trunc(p1 + 3 + 0.00001);\n  t7 = peek(M, trunc(p1 + 2 + 0.00001));\n  poke(M, t7, t6);\n  t8 = trunc(p1 + 2 + 0.00001);\n  t9 = peek(V, 663);\n  poke(M, t9, t8);\n  r = peek(V, 663);\n  return r;\n}\n\n// every sample\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0;\n  t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0;\n  t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0;\n  t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0;\n  t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0;\n  t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0;\n  t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0; t106 = 0; t107 = 0; t108 = 0; t109 = 0; t110 = 0; t111 = 0; t112 = 0;\n  t113 = 0; t114 = 0; t115 = 0; t116 = 0; t117 = 0; t118 = 0; t119 = 0; t120 = 0; t121 = 0; t122 = 0; t123 = 0; t124 = 0; t125 = 0; t126 = 0; t127 = 0; t128 = 0;\n  t129 = 0; t130 = 0; t131 = 0; t132 = 0; t133 = 0; t134 = 0; t135 = 0; t136 = 0; t137 = 0; t138 = 0; t139 = 0; t140 = 0; t141 = 0; t142 = 0; t143 = 0; t144 = 0;\n  t145 = 0; t146 = 0; t147 = 0; t148 = 0; t149 = 0; t150 = 0; t151 = 0; t152 = 0; t153 = 0; t154 = 0; t155 = 0; t156 = 0; t157 = 0; t158 = 0; t159 = 0; t160 = 0;\n  t161 = 0; t162 = 0; t163 = 0; t164 = 0; t165 = 0; t166 = 0; t167 = 0; t168 = 0; t169 = 0; t170 = 0; t171 = 0; t172 = 0; t173 = 0; t174 = 0; t175 = 0; t176 = 0;\n  t177 = 0; t178 = 0; t179 = 0; t180 = 0; t181 = 0; t182 = 0; t183 = 0; t184 = 0; t185 = 0; t186 = 0; t187 = 0; t188 = 0; t189 = 0; t190 = 0; t191 = 0; t192 = 0;\n  t193 = 0; t194 = 0; t195 = 0; t196 = 0; t197 = 0; t198 = 0; t199 = 0; t200 = 0; t201 = 0; t202 = 0; t203 = 0; t204 = 0; t205 = 0; t206 = 0; t207 = 0; t208 = 0;\n  t209 = 0; t210 = 0; t211 = 0; t212 = 0; t213 = 0; t214 = 0; t215 = 0; t216 = 0; t217 = 0; t218 = 0; t219 = 0; t220 = 0; t221 = 0; t222 = 0; t223 = 0; t224 = 0;\n  t225 = 0; t226 = 0; t227 = 0; t228 = 0; t229 = 0; t230 = 0; t231 = 0; t232 = 0; t233 = 0; t234 = 0; t235 = 0; t236 = 0; t237 = 0; t238 = 0; t239 = 0; t240 = 0;\n  t241 = 0; t242 = 0; t243 = 0; t244 = 0; t245 = 0; t246 = 0; t247 = 0; t248 = 0; t249 = 0; t250 = 0; t251 = 0; t252 = 0; t253 = 0; t254 = 0; t255 = 0; t256 = 0;\n  t257 = 0; t258 = 0; t259 = 0; t260 = 0; t261 = 0; t262 = 0; t263 = 0; t264 = 0; t265 = 0; t266 = 0; t267 = 0; t268 = 0; t269 = 0; t270 = 0; t271 = 0; t272 = 0;\n  t273 = 0; t274 = 0; t275 = 0; t276 = 0; t277 = 0; t278 = 0; t279 = 0; t280 = 0; t281 = 0; t282 = 0; t283 = 0; t284 = 0; t285 = 0; t286 = 0; t287 = 0; t288 = 0;\n  t289 = 0; t290 = 0; t291 = 0; t292 = 0; t293 = 0; t294 = 0; t295 = 0; t296 = 0; t297 = 0; t298 = 0; t299 = 0; t300 = 0; t301 = 0; t302 = 0; t303 = 0; t304 = 0;\n  t305 = 0; t306 = 0; t307 = 0; t308 = 0; t309 = 0; t310 = 0; t311 = 0; t312 = 0; t313 = 0; t314 = 0; t315 = 0; t316 = 0; t317 = 0; t318 = 0; t319 = 0; t320 = 0;\n  t321 = 0; t322 = 0; t323 = 0; t324 = 0; t325 = 0; t326 = 0; t327 = 0; t328 = 0; t329 = 0; t330 = 0; t331 = 0; t332 = 0; t333 = 0; t334 = 0; t335 = 0; t336 = 0;\n  t337 = 0; t338 = 0; t339 = 0; t340 = 0; t341 = 0; t342 = 0; t343 = 0; t344 = 0; t345 = 0; t346 = 0; t347 = 0; t348 = 0; t349 = 0; t350 = 0; t351 = 0; t352 = 0;\n  t353 = 0; t354 = 0; t355 = 0; t356 = 0; t357 = 0; t358 = 0; t359 = 0; t360 = 0; t361 = 0; t362 = 0; t363 = 0; t364 = 0; t365 = 0; t366 = 0; t367 = 0; t368 = 0;\n  t369 = 0; t370 = 0; t371 = 0; t372 = 0; t373 = 0; t374 = 0; t375 = 0; t376 = 0; t377 = 0; t378 = 0; t379 = 0; t380 = 0; t381 = 0; t382 = 0; t383 = 0; t384 = 0;\n  t385 = 0; t386 = 0; t387 = 0; t388 = 0; t389 = 0; t390 = 0; t391 = 0; t392 = 0; t393 = 0; t394 = 0; t395 = 0;\n  moved = 0;\n  // @init and @slider, once\n  if (peek(V, 64) == 0) {\n    poke(V, slider1, 0);\n    poke(V, slider1, 65);\n    poke(V, slider2, 1);\n    poke(V, slider2, 66);\n    poke(V, slider3, 2);\n    poke(V, slider3, 67);\n    poke(V, slider4, 3);\n    poke(V, slider4, 68);\n    poke(V, slider5, 4);\n    poke(V, slider5, 69);\n    poke(V, slider6, 5);\n    poke(V, slider6, 70);\n    poke(V, slider7, 6);\n    poke(V, slider7, 71);\n    poke(V, slider8, 7);\n    poke(V, slider8, 72);\n    poke(V, slider9, 8);\n    poke(V, slider9, 73);\n    poke(V, slider10, 9);\n    poke(V, slider10, 74);\n    poke(V, slider11, 10);\n    poke(V, slider11, 75);\n    poke(V, slider12, 11);\n    poke(V, slider12, 76);\n    poke(V, slider13, 12);\n    poke(V, slider13, 77);\n    poke(V, slider14, 13);\n    poke(V, slider14, 78);\n    poke(V, slider15, 14);\n    poke(V, slider15, 79);\n    poke(V, slider16, 15);\n    poke(V, slider16, 80);\n    poke(V, slider17, 16);\n    poke(V, slider17, 81);\n    poke(V, slider18, 17);\n    poke(V, slider18, 82);\n    poke(V, slider19, 18);\n    poke(V, slider19, 83);\n    poke(V, slider20, 19);\n    poke(V, slider20, 84);\n    poke(V, slider21, 20);\n    poke(V, slider21, 85);\n    poke(V, slider22, 21);\n    poke(V, slider22, 86);\n    poke(V, slider23, 22);\n    poke(V, slider23, 87);\n    poke(V, 22222, 88);\n    poke(V, samplerate, 89);\n    poke(V, 2, 90);\n    poke(V, 32, 91);\n    poke(V, tempo, 92);\n    poke(V, ts_num, 93);\n    poke(V, ts_denom, 94);\n    poke(V, 1, 95);\n    poke(V, 1, 96);\n    poke(V, 0, 97);\n    poke(V, 512, 98);\n    poke(V, 8, 99);\n    poke(V, 160, 100);\n    poke(V, 8, 101);\n    poke(V, 24, 102);\n    poke(V, 13600, 103);\n    poke(V, 16, 104);\n    poke(V, 31, 105);\n    poke(V, 14400, 106);\n    poke(V, 64, 107);\n    poke(V, 14800, 108);\n    poke(V, 180, 109);\n    poke(V, 4600, 110);\n    poke(V, 4700, 111);\n    poke(V, 4720, 112);\n    poke(V, 4750, 113);\n    poke(V, 5000, 114);\n    poke(V, 8, 115);\n    poke(V, 24, 116);\n    poke(V, 5300, 117);\n    poke(V, 8, 118);\n    poke(V, 5500, 119);\n    poke(V, 5600, 120);\n    poke(V, 5700, 121);\n    poke(V, 82000, 122);\n    poke(V, 1000, 123);\n    poke(V, 11000, 124);\n    poke(V, 2048, 125);\n    poke(V, 16384, 126);\n    poke(V, 8192, 127);\n    poke(V, 131072, 128);\n    poke(V, 16384, 129);\n    poke(V, 16383, 130);\n    poke(V, 0, 131);\n    poke(V, 1, 132);\n    poke(V, 2, 133);\n    poke(V, 3, 134);\n    poke(V, 4, 135);\n    poke(V, 5, 136);\n    poke(V, 6, 137);\n    poke(V, 7, 138);\n    poke(V, 8, 139);\n    poke(V, 9, 140);\n    poke(V, 10, 141);\n    poke(V, 11, 142);\n    poke(V, 12, 143);\n    poke(V, 13, 144);\n    poke(V, 14, 145);\n    poke(V, 15, 146);\n    poke(V, 16, 147);\n    poke(V, 17, 148);\n    poke(V, 18, 149);\n    poke(V, 19, 150);\n    poke(V, 20, 151);\n    poke(V, 21, 152);\n    poke(V, 22, 153);\n    poke(V, 23, 154);\n    poke(V, 24, 155);\n    poke(V, 25, 156);\n    poke(V, 26, 157);\n    poke(V, 27, 158);\n    poke(V, 28, 159);\n    poke(V, 29, 160);\n    poke(V, 30, 161);\n    poke(V, 38, 162);\n    poke(V, 39, 163);\n    poke(V, 40, 164);\n    poke(V, 41, 165);\n    poke(V, 42, 166);\n    poke(V, 43, 167);\n    poke(V, 44, 168);\n    poke(V, 45, 169);\n    poke(V, 46, 170);\n    poke(V, 47, 171);\n    poke(V, 48, 172);\n    poke(V, 49, 173);\n    poke(V, 50, 174);\n    poke(V, 51, 175);\n    poke(V, 52, 176);\n    poke(V, 53, 177);\n    poke(V, 54, 178);\n    poke(V, 55, 179);\n    poke(V, 56, 180);\n    poke(V, 57, 181);\n    poke(V, 58, 182);\n    poke(V, 59, 183);\n    poke(V, 60, 184);\n    poke(V, 61, 185);\n    poke(V, 62, 186);\n    poke(V, 63, 187);\n    poke(V, 64, 188);\n    poke(V, 65, 189);\n    poke(V, 66, 190);\n    poke(V, 67, 191);\n    poke(V, 68, 192);\n    poke(V, 69, 193);\n    poke(V, 70, 194);\n    poke(V, 71, 195);\n    poke(V, 72, 196);\n    poke(V, 73, 197);\n    poke(V, 74, 198);\n    poke(V, 75, 199);\n    poke(V, 76, 200);\n    poke(V, 77, 201);\n    poke(V, 78, 202);\n    poke(V, 79, 203);\n    poke(V, 80, 204);\n    poke(V, 81, 205);\n    poke(V, 82, 206);\n    poke(V, 83, 207);\n    poke(V, 84, 208);\n    poke(V, 85, 209);\n    poke(V, 86, 210);\n    poke(V, 87, 211);\n    poke(V, 88, 212);\n    poke(V, 89, 213);\n    poke(V, 90, 214);\n    poke(V, 91, 215);\n    poke(V, 92, 216);\n    poke(V, 93, 217);\n    poke(V, 94, 218);\n    poke(V, 95, 219);\n    poke(V, 96, 220);\n    poke(V, 97, 221);\n    poke(V, 98, 222);\n    poke(V, 99, 223);\n    poke(V, 100, 224);\n    poke(V, 101, 225);\n    poke(V, 20, 226);\n    poke(V, 343.2, 227);\n    poke(V, 1.204, 228);\n    poke(V, 0.00001506, 229);\n    poke(V, 1.4017, 230);\n    poke(V, 0.708, 231);\n    t1 = (sqrt(abs(peek(V, 229))) + ((peek(V, 230) - 1) * sqrt(abs((peek(V, 229) / peek(V, 231))))));\n    poke(V, t1, 232);\n    poke(V, 0, 233);\n    poke(V, 1, 234);\n    poke(V, 2, 235);\n    poke(V, 3, 236);\n    poke(V, 4, 237);\n    poke(V, 5, 238);\n    poke(V, 6, 239);\n    poke(V, 7, 240);\n    poke(V, 8, 241);\n    poke(V, 9, 242);\n    poke(V, 10, 243);\n    poke(V, 11, 244);\n    poke(V, 12, 245);\n    poke(V, 13, 246);\n    poke(V, 14, 247);\n    t2 = f_mat_def(V, M, mq, 0, 200, 7850, 0.0003, 0.1, 0.001, 1, 1, 1, 0.7, 0.74, 0.8, 16, 0);\n    t3 = f_mat_def(V, M, mq, 1, 110, 8500, 0.0008, 0.1, 0.002, 1, 0.9, 1, 0.88, 0.72, 0.3, 12, 0);\n    t4 = f_mat_def(V, M, mq, 2, 110, 8700, 0.0004, 0.1, 0.004, 1, 0.95, 1, 0.74, 0.5, 0.26, 20, 0);\n    t5 = f_mat_def(V, M, mq, 3, 69, 2700, 0.0003, 0.1, 0.001, 1, 0.8, 1.5, 0.84, 0.86, 0.88, 14, 0);\n    t6 = f_mat_def(V, M, mq, 4, 79, 19300, 0.003, 0.2, 0.002, 1, 0.5, 1, 1, 0.82, 0.25, 6, 0);\n    t7 = f_mat_def(V, M, mq, 5, 70, 2500, 0.0008, 0.1, 0.004, 0.9, 1, 3, 0.62, 0.86, 0.94, 10, 0);\n    t8 = f_mat_def(V, M, mq, 6, 80, 2650, 0.00008, 0, 0.002, 0.9, 1, 3, 0.86, 0.78, 1, 30, 0);\n    t9 = f_mat_def(V, M, mq, 7, 9, 917, 0.0025, 0.3, 0.02, 0.8, 0.7, 4, 0.8, 0.93, 1, 6, 0);\n    t10 = f_mat_def(V, M, mq, 8, 55, 2700, 0.003, 0.2, 0.012, 1, 1, 4, 0.92, 0.9, 0.88, 5, 0);\n    t11 = f_mat_def(V, M, mq, 9, 40, 2000, 0.005, 0.3, 0.02, 2.5, 0.9, 4, 0.8, 0.45, 0.3, 3, 0);\n    t12 = f_mat_def(V, M, mq, 10, 11, 440, 0.008, 0.4, 0.02, 1.5, 0.45, 3, 0.9, 0.76, 0.5, 3, 0);\n    t13 = f_mat_def(V, M, mq, 11, 16, 850, 0.006, 0.4, 0.015, 1.4, 0.55, 3, 0.55, 0.28, 0.16, 3, 0);\n    t14 = f_mat_def(V, M, mq, 12, 20, 700, 0.009, 0.4, 0.02, 1.3, 0.5, 2.5, 0.8, 0.78, 0.42, 3, 0);\n    t15 = f_mat_def(V, M, mq, 13, 18, 1900, 0.012, 0.3, 0.015, 1.6, 0.8, 3, 0.95, 0.92, 0.82, 2.5, 0);\n    t16 = f_mat_def(V, M, mq, 14, 4, 1300, 0.006, 0.5, 0.005, 1.3, 0.35, 1.3, 0.9, 0.84, 0.66, 5, 0);\n    t17 = f_mat_def(V, M, mq, 15, 3, 1140, 0.004, 0.5, 0.002, 1, 0.35, 1.3, 0.96, 0.96, 0.92, 6, 0);\n    t18 = f_mat_def(V, M, mq, 16, 150, 1600, 0.002, 0.2, 0.002, 1, 0.9, 1.5, 0.3, 0.31, 0.36, 8, 0);\n    t19 = f_mat_def(V, M, mq, 17, 0.05, 1100, 0.035, 0.3, 0.01, 1.2, 0.12, 2, 0.8, 0.25, 0.22, 1.2, 0.4);\n    t20 = f_mat_def(V, M, mq, 18, 3, 700, 0.03, 0.3, 0.03, 4, 0.2, 3, 0.86, 0.82, 0.72, 1.2, 0.15);\n    t21 = f_mat_def(V, M, mq, 19, 0.00005, 1050, 0.045, 0.2, 0.05, 1.2, 0.05, 6, 0.95, 0.25, 0.45, 1, 1);\n    t22 = f_mat_def(V, M, mq, 20, 2.3, 1050, 0.01, 0.3, 0.005, 1, 0.4, 2, 0.2, 0.55, 0.9, 2, 0);\n    t23 = f_mat_def(V, M, mq, 21, 3, 1400, 0.022, 0.3, 0.003, 1, 0.45, 2, 0.9, 0.9, 0.86, 2, 0);\n    t24 = f_mat_def(V, M, mq, 22, 12, 650, 0.007, 0.4, 0.02, 1.4, 0.6, 3, 0.78, 0.58, 0.36, 3, 0);\n    t25 = f_mat_def(V, M, mq, 23, 0.1, 900, 0.04, 0.3, 0.02, 2, 0.2, 3, 0.48, 0.3, 0.17, 1.2, 0.1);\n    t26 = f_mat_def(V, M, mq, 24, 3, 700, 0.04, 0.3, 0.03, 4, 0.25, 3, 0.7, 0.54, 0.36, 1.2, 0);\n    t27 = f_mat_def(V, M, mq, 25, 69, 2700, 0.02, 0.2, 0.05, 1.5, 0.6, 1, 0.86, 0.88, 0.91, 1.5, 0);\n    t28 = f_mat_def(V, M, mq, 26, 0.2, 920, 0.05, 0.3, 0.01, 1.5, 0.1, 4, 0.82, 0.92, 0.96, 1, 0.3);\n    t29 = f_mat_def(V, M, mq, 27, 207, 7850, 0.004, 0.1, 0.03, 1.2, 0.9, 1, 0.64, 0.68, 0.7, 3, 0);\n    t30 = f_mat_def(V, M, mq, 28, 207, 7850, 0.003, 0.1, 0.01, 1, 0.9, 1, 0.78, 0.12, 0.15, 2.5, 0);\n    t31 = f_mat_def(V, M, mq, 29, 200, 7850, 0.0015, 0.1, 0.03, 1, 1, 1, 0.62, 0.68, 0.62, 4, 0);\n    t32 = f_mat_def(V, M, mq, 30, 207, 7850, 0.0022, 0.1, 0.001, 1, 1, 1, 0.36, 0.38, 0.44, 8, 0);\n    t33 = trunc(peek(V, 103) + ((25 * peek(V, 104)) + peek(V, 246)) + 0.00001);\n    poke(M, 1, t33);\n    t34 = trunc(peek(V, 103) + ((26 * peek(V, 104)) + peek(V, 247)) + 0.00001);\n    poke(M, 1, t34);\n    t35 = trunc(peek(V, 103) + ((27 * peek(V, 104)) + peek(V, 247)) + 0.00001);\n    poke(M, 0.7, t35);\n    t36 = trunc(peek(V, 103) + ((28 * peek(V, 104)) + peek(V, 247)) + 0.00001);\n    poke(M, 0.3, t36);\n    t37 = trunc(peek(V, 103) + ((29 * peek(V, 104)) + peek(V, 247)) + 0.00001);\n    poke(M, 1, t37);\n    poke(V, 0, 249);\n    t38 = f_jz(V, M, mq, 2.4048, 0);\n    t39 = f_jz(V, M, mq, 3.8317, 1);\n    t40 = f_jz(V, M, mq, 5.1356, 2);\n    t41 = f_jz(V, M, mq, 5.5201, 0);\n    t42 = f_jz(V, M, mq, 6.3802, 3);\n    t43 = f_jz(V, M, mq, 7.0156, 1);\n    t44 = f_jz(V, M, mq, 7.5883, 4);\n    t45 = f_jz(V, M, mq, 8.4172, 2);\n    t46 = f_jz(V, M, mq, 8.6537, 0);\n    t47 = f_jz(V, M, mq, 8.7715, 5);\n    t48 = f_jz(V, M, mq, 9.761, 3);\n    t49 = f_jz(V, M, mq, 9.9361, 6);\n    t50 = f_jz(V, M, mq, 10.1735, 1);\n    t51 = f_jz(V, M, mq, 11.0647, 4);\n    t52 = f_jz(V, M, mq, 11.0864, 7);\n    t53 = f_jz(V, M, mq, 11.6198, 2);\n    t54 = f_jz(V, M, mq, 11.7915, 0);\n    t55 = f_jz(V, M, mq, 12.2251, 8);\n    t56 = f_jz(V, M, mq, 12.3386, 5);\n    t57 = f_jz(V, M, mq, 13.0152, 3);\n    t58 = f_jz(V, M, mq, 13.3237, 1);\n    t59 = f_jz(V, M, mq, 13.3543, 9);\n    t60 = f_jz(V, M, mq, 13.5893, 6);\n    t61 = f_jz(V, M, mq, 14.4755, 10);\n    t62 = trunc(peek(V, 111) + 0.00001);\n    poke(M, 4.73, t62);\n    t63 = trunc(peek(V, 111) + 1 + 0.00001);\n    poke(M, 7.8532, t63);\n    t64 = trunc(peek(V, 111) + 2 + 0.00001);\n    poke(M, 10.9956, t64);\n    t65 = trunc(peek(V, 111) + 3 + 0.00001);\n    poke(M, 14.1372, t65);\n    t66 = trunc(peek(V, 111) + 4 + 0.00001);\n    poke(M, 17.2788, t66);\n    t67 = trunc(peek(V, 111) + 5 + 0.00001);\n    poke(M, 20.4204, t67);\n    t68 = trunc(peek(V, 111) + 6 + 0.00001);\n    poke(M, 23.5619, t68);\n    t69 = trunc(peek(V, 111) + 7 + 0.00001);\n    poke(M, 26.7035, t69);\n    t70 = trunc(peek(V, 112) + 0.00001);\n    poke(M, 1.8751, t70);\n    t71 = trunc(peek(V, 112) + 1 + 0.00001);\n    poke(M, 4.6941, t71);\n    t72 = trunc(peek(V, 112) + 2 + 0.00001);\n    poke(M, 7.8548, t72);\n    t73 = trunc(peek(V, 112) + 3 + 0.00001);\n    poke(M, 10.9955, t73);\n    t74 = trunc(peek(V, 112) + 4 + 0.00001);\n    poke(M, 14.1372, t74);\n    t75 = trunc(peek(V, 112) + 5 + 0.00001);\n    poke(M, 17.2788, t75);\n    poke(V, 0, 249);\n    poke(V, 0, 249);\n    t76 = min(1048576, trunc(60));\n    for (t77 = 0; t77 < t76; t77 += 1) {\n      t78 = trunc(peek(V, 113) + peek(V, 249) + 0.00001);\n      poke(M, 0, t78);\n      t79 = (peek(V, 249) + 1);\n      poke(V, t79, 249);\n    }\n    poke(V, 0, 250);\n    poke(V, 1, 251);\n    t80 = min(1048576, trunc(8));\n    for (t81 = 0; t81 < t80; t81 += 1) {\n      poke(V, 1, 252);\n      t82 = min(1048576, trunc(8));\n      for (t83 = 0; t83 < t82; t83 += 1) {\n        t84 = ((peek(V, 251) * peek(V, 251)) + pow((peek(V, 252) / 0.73), 2));\n        poke(V, t84, 253);\n        t85 = min(peek(V, 250), 20);\n        poke(V, t85, 254);\n        t86 = peek(V, 254);\n        poke(V, t86, 255);\n        t87 = 0;\n        while (t87 < 1048576) {\n          if (!(abs((((abs((peek(V, 255) > 0 ? 1 : 0)) >= 0.00001) && (abs((peek(M, trunc(peek(V, 113) + ((peek(V, 255) - 1) * 3) + 0.00001)) > peek(V, 253) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n            break;\n          }\n          if ((abs((peek(V, 255) <= 19 ? 1 : 0)) >= 0.00001)) {\n            t88 = trunc(peek(V, 113) + (peek(V, 255) * 3) + 0.00001);\n            t89 = peek(M, trunc(peek(V, 113) + ((peek(V, 255) - 1) * 3) + 0.00001));\n            poke(M, t89, t88);\n            t90 = trunc(peek(V, 113) + ((peek(V, 255) * 3) + 1) + 0.00001);\n            t91 = peek(M, trunc(peek(V, 113) + (((peek(V, 255) - 1) * 3) + 1) + 0.00001));\n            poke(M, t91, t90);\n            t92 = trunc(peek(V, 113) + ((peek(V, 255) * 3) + 2) + 0.00001);\n            t93 = peek(M, trunc(peek(V, 113) + (((peek(V, 255) - 1) * 3) + 2) + 0.00001));\n            poke(M, t93, t92);\n          }\n          t94 = (peek(V, 255) - 1);\n          poke(V, t94, 255);\n          t87 += 1;\n        }\n        if ((abs((peek(V, 255) < 20 ? 1 : 0)) >= 0.00001)) {\n          t95 = trunc(peek(V, 113) + (peek(V, 255) * 3) + 0.00001);\n          t96 = peek(V, 253);\n          poke(M, t96, t95);\n          t97 = trunc(peek(V, 113) + ((peek(V, 255) * 3) + 1) + 0.00001);\n          t98 = peek(V, 251);\n          poke(M, t98, t97);\n          t99 = trunc(peek(V, 113) + ((peek(V, 255) * 3) + 2) + 0.00001);\n          t100 = peek(V, 252);\n          poke(M, t100, t99);\n        }\n        t101 = (peek(V, 250) + 1);\n        poke(V, t101, 250);\n        t102 = (peek(V, 252) + 1);\n        poke(V, t102, 252);\n      }\n      t103 = (peek(V, 251) + 1);\n      poke(V, t103, 251);\n    }\n    poke(V, (-0.9), 256);\n    poke(V, 0, 257);\n    poke(V, 0, 258);\n    poke(V, 5900, 259);\n    poke(V, 5950, 260);\n    t104 = (1 - (((2 * 3.141592653589793) * 10) / peek(V, 89)));\n    poke(V, t104, 261);\n    poke(V, 1, 262);\n    poke(V, 6400, 263);\n    poke(V, 6480, 264);\n    t105 = peek(V, 263);\n    t106 = min(trunc(100), 8388608);\n    for (t107 = 0; t107 < t106; t107 += 1) {\n      poke(M, 0, trunc(t105 + t107 + 0.00001));\n    }\n    t108 = f_trim_row(V, M, mq, 0, 0, (-10.1), (-19.1), (-14.5), (-12.6), (-20), (-2.5));\n    t109 = f_trim_row(V, M, mq, 0, 1, 1.1, (-10.4), (-2.7), (-2), (-11.3), (-4.3));\n    t110 = f_trim_row(V, M, mq, 0, 2, (-7.7), (-3.8), 8.5, 1.1, (-2.1), (-1.4));\n    t111 = f_trim_row(V, M, mq, 0, 3, (-5.2), (-1.7), 3.4, (-1.9), (-6.1), 11);\n    t112 = f_trim_row(V, M, mq, 0, 4, (-4), (-0.8), 12.5, 4.5, 2, 1.9);\n    t113 = f_trim_row(V, M, mq, 0, 5, (-6.2), (-3.7), 8.4, 2.2, (-2.1), (-0.2));\n    t114 = f_trim_row(V, M, mq, 1, 0, (-8.7), (-14.5), (-10.7), (-7.7), (-18), 0.6);\n    t115 = f_trim_row(V, M, mq, 1, 1, 2.6, (-5.6), 0, (-1.9), (-8.1), (-2.7));\n    t116 = f_trim_row(V, M, mq, 1, 2, 2, 5.1, 18.3, 11, 7.7, 8.9);\n    t117 = f_trim_row(V, M, mq, 1, 3, (-3.1), 3.7, 8.7, 4.1, (-0.7), 14.8);\n    t118 = f_trim_row(V, M, mq, 1, 4, 3.1, 6.5, 19.3, 11.8, 8.8, 9.6);\n    t119 = f_trim_row(V, M, mq, 1, 5, 14.3, 16.7, 20, 20, 19.5, 19.4);\n    poke(V, 0, 249);\n    t120 = min(1048576, trunc(13));\n    for (t121 = 0; t121 < t120; t121 += 1) {\n      t122 = trunc(peek(V, 264) + peek(V, 249) + 0.00001);\n      poke(M, 0, t122);\n      t123 = (peek(V, 249) + 1);\n      poke(V, t123, 249);\n    }\n    t124 = trunc(peek(V, 264) + 0.00001);\n    poke(M, 0, t124);\n    t125 = trunc(peek(V, 264) + 1 + 0.00001);\n    poke(M, 5.3, t125);\n    t126 = trunc(peek(V, 264) + 2 + 0.00001);\n    poke(M, 0.2, t126);\n    t127 = trunc(peek(V, 264) + 3 + 0.00001);\n    poke(M, 5, t127);\n    t128 = trunc(peek(V, 264) + 4 + 0.00001);\n    poke(M, 5.3, t128);\n    t129 = trunc(peek(V, 264) + 5 + 0.00001);\n    poke(M, 2, t129);\n    t130 = trunc(peek(V, 264) + 6 + 0.00001);\n    poke(M, 0.6, t130);\n    t131 = trunc(peek(V, 264) + 7 + 0.00001);\n    poke(M, 0, t131);\n    t132 = trunc(peek(V, 264) + 8 + 0.00001);\n    poke(M, (-0.1), t132);\n    t133 = trunc(peek(V, 264) + 9 + 0.00001);\n    poke(M, 0, t133);\n    t134 = trunc(peek(V, 264) + 10 + 0.00001);\n    poke(M, (-3.6), t134);\n    t135 = trunc(peek(V, 264) + 11 + 0.00001);\n    poke(M, (-2.5), t135);\n    t136 = trunc(peek(V, 264) + 12 + 0.00001);\n    poke(M, (-0.5), t136);\n    poke(V, 0.012, 266);\n    poke(V, 0.0003, 267);\n    poke(V, 12000, 268);\n    poke(V, 15, 269);\n    poke(V, 2700000, 270);\n    poke(V, 0.92, 271);\n    poke(V, 2, 272);\n    poke(V, 0.88, 273);\n    poke(V, 4000, 274);\n    poke(V, 0.6, 275);\n    poke(V, 2, 276);\n    poke(V, 3, 277);\n    poke(V, 1.5, 278);\n    poke(V, 6, 279);\n    poke(V, 0.8, 280);\n    poke(V, 0.015, 281);\n    poke(V, 25, 282);\n    poke(V, 0.12, 283);\n    poke(V, 0.06, 284);\n    poke(V, 0.04, 285);\n    poke(V, 0.6, 286);\n    poke(V, 0.25, 287);\n    poke(V, 0, 288);\n    poke(V, 1, 289);\n    poke(V, 0.2, 290);\n    poke(V, 2.5, 291);\n    poke(V, 0, 292);\n    poke(V, 0, 293);\n    poke(V, 3, 294);\n    poke(V, 3, 295);\n    poke(V, 0.7, 296);\n    poke(V, (-1), 297);\n    poke(V, 1, 298);\n    poke(V, 100, 299);\n    poke(V, 0.0045, 300);\n    poke(V, 124, 301);\n    poke(V, 113, 302);\n    poke(V, 148, 303);\n    poke(V, 1.5, 304);\n    poke(V, 0.5, 305);\n    poke(V, 1.333, 306);\n    poke(V, 0.3, 307);\n    poke(V, 16, 308);\n    poke(V, 7, 309);\n    poke(V, 6, 310);\n    poke(V, 5, 311);\n    t137 = (1 / peek(V, 89));\n    poke(V, t137, 312);\n    t138 = exp(((-1) / (0.05 * peek(V, 89))));\n    poke(V, t138, 313);\n    t139 = (900 / peek(V, 89));\n    poke(V, t139, 314);\n    t140 = exp(((-1) / (0.3 * peek(V, 89))));\n    poke(V, t140, 315);\n    poke(V, 0, 316);\n    t141 = (1 - exp(((-1) / (0.0005 * peek(V, 89)))));\n    poke(V, t141, 317);\n    t142 = exp(((-1) / (0.15 * peek(V, 89))));\n    poke(V, t142, 318);\n    poke(V, 0, 319);\n    poke(V, 1, 320);\n    poke(V, 1, 321);\n    poke(V, 1, 322);\n    poke(V, 0, 323);\n    poke(V, 0, 324);\n    poke(V, 0, 325);\n    poke(V, 0, 326);\n    poke(V, 0, 327);\n    poke(V, 0, 328);\n    poke(V, 0, 329);\n    poke(V, 0, 330);\n    poke(V, 0, 331);\n    poke(V, 0, 332);\n    poke(V, 0, 333);\n    poke(V, 0, 334);\n    poke(V, 0, 335);\n    poke(V, 1, 336);\n    t143 = peek(V, 121);\n    t144 = min(trunc(100), 8388608);\n    for (t145 = 0; t145 < t144; t145 += 1) {\n      poke(M, 0, trunc(t143 + t145 + 0.00001));\n    }\n    t146 = peek(V, 126);\n    t147 = min(trunc((8 * peek(V, 127))), 8388608);\n    for (t148 = 0; t148 < t147; t148 += 1) {\n      poke(M, 0, trunc(t146 + t148 + 0.00001));\n    }\n    t149 = peek(V, 260);\n    t150 = min(trunc(8), 8388608);\n    for (t151 = 0; t151 < t150; t151 += 1) {\n      poke(M, 0, trunc(t149 + t151 + 0.00001));\n    }\n    poke(V, 0, 337);\n    t152 = f_all_off(V, M, mq);\n    t153 = f_update_globals(V, M, mq);\n    poke(V, 690000, 413);\n    t154 = peek(V, 413);\n    poke(V, t154, 414);\n    t155 = (peek(V, 413) + 100);\n    poke(V, t155, 415);\n    t156 = (peek(V, 413) + 1200);\n    poke(V, t156, 416);\n    t157 = (peek(V, 413) + 2400);\n    poke(V, t157, 417);\n    t158 = (peek(V, 413) + 2420);\n    poke(V, t158, 418);\n    t159 = (peek(V, 413) + 2440);\n    poke(V, t159, 419);\n    poke(V, 700000, 420);\n    poke(V, 4000, 421);\n    poke(V, 725000, 422);\n    poke(V, 25000, 423);\n    poke(V, 14200, 424);\n    poke(V, 16, 425);\n    poke(V, 13100, 426);\n    poke(V, 20, 427);\n    poke(V, 19, 428);\n    t160 = f_pdef(V, M, mq, 0, 0, 0, 5, 12, 0, 12, 2, 0, 1, 2, 0, 0, 70, 100, 0, 100, 20, 50, 0);\n    t161 = f_pdef(V, M, mq, 1, 1, 3, 0, 7, 1, 7, 0, 1, 0, 0, 0, 4, 70, 100, 10, 100, 15, 60, 0);\n    t162 = f_pdef(V, M, mq, 2, 4, 5, 2, 8, 2, 8, 0, 1, 4, 2, 0, 1, 70, 100, 0, 100, 12, 60, 0);\n    t163 = f_pdef(V, M, mq, 3, 0, 1, 5, 5, 0, 5, 2, 0, 2, 3, 0, 2, 75, 100, 0, 100, 20, 50, 0);\n    t164 = f_pdef(V, M, mq, 4, 3, 4, 4, 6, 4, 6, 0, 1, 4, 2, 0, 1, 60, 100, 20, 100, 10, 50, 0);\n    t165 = f_pdef(V, M, mq, 5, 0, 1, 5, 17, 0, 17, 2, 0, 2, 2, 0, 0, 80, 200, 0, 100, 20, 50, 0);\n    t166 = f_pdef(V, M, mq, 6, 2, 4, 0, 13, 3, 13, 0, 3, 4, 1, 0, 4, 70, 100, 0, 100, 20, 40, 0);\n    t167 = f_pdef(V, M, mq, 7, 4, 5, 1, 9, 3, 9, 1, 2, 4, 0, 2, 0, 80, 100, 0, 100, 30, 60, 0);\n    t168 = f_pdef(V, M, mq, 8, 1, 5, 3, 19, 4, 19, 0, 1, 4, 0, 0, 1, 80, 150, 0, 150, 25, 50, 0);\n    t169 = f_pdef(V, M, mq, 9, 0, 1, 5, 0, 2, 0, 3, 1, 1, 2, 0, 0, 70, 100, 0, 100, 20, 40, 0);\n    t170 = f_pdef(V, M, mq, 10, 1, 3, 2, 7, 2, 7, 0, 1, 4, 2, 0, 4, 70, 100, 0, 100, 8, 50, 0);\n    t171 = f_pdef(V, M, mq, 11, 2, 2, 0, 4, 1, 10, 0, 1, 4, 1, 0, 1, 70, 100, 0, 100, 12, 50, 0);\n    t172 = f_pdef(V, M, mq, 12, 0, 0, 4, 18, 3, 18, 3, 1, 4, 2, 0, 4, 70, 100, 0, 100, 20, 50, 0);\n    t173 = f_pdef(V, M, mq, 13, 0, 1, 5, 16, 0, 16, 2, 0, 3, 3, 0, 0, 75, 100, 0, 100, 20, 50, 1);\n    t174 = f_pdef(V, M, mq, 14, 5, 2, 2, 3, 2, 3, 0, 3, 4, 2, 0, 4, 60, 100, 0, 100, 15, 50, 0);\n    t175 = f_pdef(V, M, mq, 15, 4, 2, 3, 2, 4, 2, 0, 1, 4, 2, 0, 1, 80, 100, 0, 200, 20, 50, 0);\n    t176 = f_pdef(V, M, mq, 16, 0, 1, 5, 20, 2, 20, 3, 1, 1, 2, 0, 0, 65, 100, 0, 100, 20, 40, 0);\n    t177 = f_pdef(V, M, mq, 17, 0, 1, 1, 26, 3, 24, 2, 1, 4, 2, 0, 0, 90, 100, 0, 100, 20, 50, 0);\n    t178 = f_pdef(V, M, mq, 18, 3, 4, 0, 0, 3, 27, 0, 2, 0, 0, 0, 3, 75, 100, 0, 100, 12, 50, 0);\n    poke(V, 0, 430);\n    poke(V, 2, 431);\n    poke(V, 60, 432);\n    poke(V, 1000000, 433);\n    poke(V, (-1), 434);\n    poke(V, (-1), 435);\n    poke(V, (-1), 436);\n    t179 = f_update_globals(V, M, mq);\n    poke(V, 1, 64);\n  }\n  // a moved slider runs @slider\n  moved = 0;\n  if (slider1 != peek(V, 65)) {\n    poke(V, slider1, 65);\n    poke(V, slider1, 0);\n    moved = 1;\n  }\n  if (slider2 != peek(V, 66)) {\n    poke(V, slider2, 66);\n    poke(V, slider2, 1);\n    moved = 1;\n  }\n  if (slider3 != peek(V, 67)) {\n    poke(V, slider3, 67);\n    poke(V, slider3, 2);\n    moved = 1;\n  }\n  if (slider4 != peek(V, 68)) {\n    poke(V, slider4, 68);\n    poke(V, slider4, 3);\n    moved = 1;\n  }\n  if (slider5 != peek(V, 69)) {\n    poke(V, slider5, 69);\n    poke(V, slider5, 4);\n    moved = 1;\n  }\n  if (slider6 != peek(V, 70)) {\n    poke(V, slider6, 70);\n    poke(V, slider6, 5);\n    moved = 1;\n  }\n  if (slider7 != peek(V, 71)) {\n    poke(V, slider7, 71);\n    poke(V, slider7, 6);\n    moved = 1;\n  }\n  if (slider8 != peek(V, 72)) {\n    poke(V, slider8, 72);\n    poke(V, slider8, 7);\n    moved = 1;\n  }\n  if (slider9 != peek(V, 73)) {\n    poke(V, slider9, 73);\n    poke(V, slider9, 8);\n    moved = 1;\n  }\n  if (slider10 != peek(V, 74)) {\n    poke(V, slider10, 74);\n    poke(V, slider10, 9);\n    moved = 1;\n  }\n  if (slider11 != peek(V, 75)) {\n    poke(V, slider11, 75);\n    poke(V, slider11, 10);\n    moved = 1;\n  }\n  if (slider12 != peek(V, 76)) {\n    poke(V, slider12, 76);\n    poke(V, slider12, 11);\n    moved = 1;\n  }\n  if (slider13 != peek(V, 77)) {\n    poke(V, slider13, 77);\n    poke(V, slider13, 12);\n    moved = 1;\n  }\n  if (slider14 != peek(V, 78)) {\n    poke(V, slider14, 78);\n    poke(V, slider14, 13);\n    moved = 1;\n  }\n  if (slider15 != peek(V, 79)) {\n    poke(V, slider15, 79);\n    poke(V, slider15, 14);\n    moved = 1;\n  }\n  if (slider16 != peek(V, 80)) {\n    poke(V, slider16, 80);\n    poke(V, slider16, 15);\n    moved = 1;\n  }\n  if (slider17 != peek(V, 81)) {\n    poke(V, slider17, 81);\n    poke(V, slider17, 16);\n    moved = 1;\n  }\n  if (slider18 != peek(V, 82)) {\n    poke(V, slider18, 82);\n    poke(V, slider18, 17);\n    moved = 1;\n  }\n  if (slider19 != peek(V, 83)) {\n    poke(V, slider19, 83);\n    poke(V, slider19, 18);\n    moved = 1;\n  }\n  if (slider20 != peek(V, 84)) {\n    poke(V, slider20, 84);\n    poke(V, slider20, 19);\n    moved = 1;\n  }\n  if (slider21 != peek(V, 85)) {\n    poke(V, slider21, 85);\n    poke(V, slider21, 20);\n    moved = 1;\n  }\n  if (slider22 != peek(V, 86)) {\n    poke(V, slider22, 86);\n    poke(V, slider22, 21);\n    moved = 1;\n  }\n  if (slider23 != peek(V, 87)) {\n    poke(V, slider23, 87);\n    poke(V, slider23, 22);\n    moved = 1;\n  }\n  if (moved != 0) {\n    t180 = f_update_globals(V, M, mq);\n  }\n  // @block, every 32 samples\n  if (peek(V, 437) <= 0) {\n    poke(V, 32, 437);\n    poke(V, tempo, 92);\n    poke(V, play_state, 438);\n    poke(V, beat_position, 439);\n    poke(V, beat_position * 60 / max(1, tempo), 440);\n    poke(V, ts_num, 93);\n    poke(V, ts_denom, 94);\n    poke(V, 0, 441);\n    t181 = 0;\n    while (t181 < 1048576) {\n      t182 = 0;\n      if (peek(V, 442) < peek(mq, 0)) {\n        t183 = 1 + 3 * eel_mod(peek(V, 442), 256);\n        t184 = peek(mq, t183);\n        t185 = peek(mq, t183 + 1);\n        t186 = peek(mq, t183 + 2);\n        poke(V, peek(V, 442) + 1, 442);\n        poke(V, 0, 443);\n        poke(V, t184, 444);\n        poke(V, t185, 445);\n        poke(V, t186, 446);\n        t182 = t184;\n      }\n      if (!(abs(t182) >= 0.00001)) {\n        break;\n      }\n      if ((abs((peek(V, 441) < peek(V, 123) ? 1 : 0)) >= 0.00001)) {\n        t187 = trunc(peek(V, 122) + (peek(V, 441) * 4) + 0.00001);\n        t188 = peek(V, 443);\n        poke(M, t188, t187);\n        t189 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 1) + 0.00001);\n        t190 = peek(V, 444);\n        poke(M, t190, t189);\n        t191 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 2) + 0.00001);\n        t192 = peek(V, 445);\n        poke(M, t192, t191);\n        t193 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 3) + 0.00001);\n        t194 = peek(V, 446);\n        poke(M, t194, t193);\n        t195 = (peek(V, 441) + 1);\n        poke(V, t195, 441);\n      }\n      t181 += 1;\n    }\n    if ((abs(peek(V, 447)) >= 0.00001)) {\n      if ((abs((peek(V, 441) < peek(V, 123) ? 1 : 0)) >= 0.00001)) {\n        t196 = trunc(peek(V, 122) + (peek(V, 441) * 4) + 0.00001);\n        poke(M, 0, t196);\n        t197 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 1) + 0.00001);\n        poke(M, 144, t197);\n        t198 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 2) + 0.00001);\n        t199 = peek(V, 432);\n        poke(M, t199, t198);\n        t200 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 3) + 0.00001);\n        poke(M, 100, t200);\n        t201 = (peek(V, 441) + 1);\n        poke(V, t201, 441);\n      }\n      poke(V, 0, 447);\n      t202 = (1.2 * peek(V, 89));\n      poke(V, t202, 448);\n      poke(V, 1, 449);\n    }\n    if ((abs(peek(V, 449)) >= 0.00001)) {\n      t203 = peek(V, 91);\n      t204 = (peek(V, 448) - t203);\n      poke(V, t204, 448);\n      if ((abs((peek(V, 448) <= 0 ? 1 : 0)) >= 0.00001)) {\n        if ((abs((peek(V, 441) < peek(V, 123) ? 1 : 0)) >= 0.00001)) {\n          t205 = trunc(peek(V, 122) + (peek(V, 441) * 4) + 0.00001);\n          poke(M, 0, t205);\n          t206 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 1) + 0.00001);\n          poke(M, 128, t206);\n          t207 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 2) + 0.00001);\n          t208 = peek(V, 432);\n          poke(M, t208, t207);\n          t209 = trunc(peek(V, 122) + ((peek(V, 441) * 4) + 3) + 0.00001);\n          poke(M, 0, t209);\n          t210 = (peek(V, 441) + 1);\n          poke(V, t210, 441);\n        }\n        poke(V, 0, 449);\n      }\n    }\n    if ((abs(peek(V, 450)) >= 0.00001)) {\n      t211 = f_update_globals(V, M, mq);\n      poke(V, 0, 450);\n    }\n    poke(V, 0, 451);\n    poke(V, 0, 452);\n    t212 = (peek(V, 321) * ((abs(peek(V, 323)) >= 0.00001) ? peek(V, 322) : 1));\n    poke(V, t212, 320);\n  }\n  poke(V, peek(V, 437) - 1, 437);\n  // @sample\n  poke(V, 0, 453);\n  poke(V, 0, 454);\n  t213 = 0;\n  while (t213 < 1048576) {\n    if (!(abs((((abs((peek(V, 451) < peek(V, 441) ? 1 : 0)) >= 0.00001) && (abs((peek(M, trunc(peek(V, 122) + (peek(V, 451) * 4) + 0.00001)) <= peek(V, 452) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      break;\n    }\n    t214 = eel_band(peek(M, trunc(peek(V, 122) + ((peek(V, 451) * 4) + 1) + 0.00001)), 240);\n    poke(V, t214, 455);\n    t215 = peek(M, trunc(peek(V, 122) + ((peek(V, 451) * 4) + 2) + 0.00001));\n    poke(V, t215, 456);\n    t216 = peek(M, trunc(peek(V, 122) + ((peek(V, 451) * 4) + 3) + 0.00001));\n    poke(V, t216, 457);\n    if ((abs((((abs((abs(peek(V, 455) - 144) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((peek(V, 457) > 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t217 = f_note_on(V, M, mq, peek(V, 456), peek(V, 457));\n    }\n    else {\n      if ((abs((((abs((abs(peek(V, 455) - 128) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((((abs((abs(peek(V, 455) - 144) < 0.00001 ? 1 : 0)) >= 0.00001) && (abs((abs(peek(V, 457) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t218 = f_note_off(V, M, mq, peek(V, 456));\n      }\n      else {\n        if ((abs((abs(peek(V, 455) - 224) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n          t219 = ((((peek(V, 457) * 128) + peek(V, 456)) - 8192) / 8192);\n          poke(V, t219, 326);\n        }\n        else {\n          if ((abs((abs(peek(V, 455) - 208) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n            t220 = (peek(V, 456) / 127);\n            poke(V, t220, 324);\n          }\n          else {\n            if ((abs((abs(peek(V, 455) - 176) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n              if ((abs((abs(peek(V, 456) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n                t221 = (peek(V, 457) / 127);\n                poke(V, t221, 325);\n              }\n              else {\n                if ((abs((abs(peek(V, 456) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n                  t222 = (peek(V, 457) / 127);\n                  poke(V, t222, 322);\n                  poke(V, 1, 323);\n                  t223 = (peek(V, 321) * peek(V, 322));\n                  poke(V, t223, 320);\n                }\n                else {\n                  if ((abs((abs(peek(V, 456) - 11) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n                    t224 = (peek(V, 457) / 127);\n                    poke(V, t224, 321);\n                    t225 = (peek(V, 321) * ((abs(peek(V, 323)) >= 0.00001) ? peek(V, 322) : 1));\n                    poke(V, t225, 320);\n                  }\n                  else {\n                    if ((abs((abs(peek(V, 456) - 64) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n                      t226 = (peek(V, 457) >= 64 ? 1 : 0);\n                      poke(V, t226, 328);\n                      if ((abs(((abs(peek(V, 328)) >= 0.00001) ? 0 : 1)) >= 0.00001)) {\n                        t227 = f_pedal_up(V, M, mq);\n                      }\n                    }\n                    else {\n                      if ((abs((abs(peek(V, 456) - 67) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n                        t228 = (peek(V, 457) >= 64 ? 1 : 0);\n                        poke(V, t228, 329);\n                      }\n                      else {\n                        if ((abs((((abs((abs(peek(V, 456) - 120) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 456) - 123) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n                          t229 = f_all_off(V, M, mq);\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    t230 = (peek(V, 451) + 1);\n    poke(V, t230, 451);\n    t213 += 1;\n  }\n  t231 = (peek(V, 452) + 1);\n  poke(V, t231, 452);\n  t232 = (peek(V, 334) - 1);\n  poke(V, t232, 334);\n  if ((abs((peek(V, 334) <= 0 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 16, 334);\n    t233 = (16 * peek(V, 312));\n    t234 = (peek(V, 333) + t233);\n    poke(V, t234, 333);\n    t235 = ((16 * peek(V, 312)) * 5.5);\n    t236 = (peek(V, 335) + t235);\n    poke(V, t236, 335);\n    if ((abs((peek(V, 335) >= 1 ? 1 : 0)) >= 0.00001)) {\n      t237 = (peek(V, 335) - 1);\n      poke(V, t237, 335);\n    }\n    t238 = ((abs((abs(peek(V, 351) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? ((-0.4) * peek(V, 325)) : ((abs((abs(peek(V, 351) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? (2 * peek(V, 325)) : ((abs((abs(peek(V, 351) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? ((0.3 * peek(V, 325)) * sin(((2 * 3.141592653589793) * peek(V, 335)))) : 0)));\n    poke(V, t238, 327);\n    t239 = ((abs((abs(peek(V, 351) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? (1 - ((0.3 * peek(V, 325)) * (0.5 + (0.5 * sin((((2 * 3.141592653589793) * peek(V, 335)) + 1.2)))))) : ((abs((abs(peek(V, 351) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? (1 - (0.3 * peek(V, 325))) : 1));\n    poke(V, t239, 336);\n    poke(V, 0, 588);\n    t240 = min(1048576, trunc(peek(V, 99)));\n    for (t241 = 0; t241 < t240; t241 += 1) {\n      t242 = (peek(V, 97) + (peek(V, 588) * peek(V, 98)));\n      poke(V, t242, 589);\n      if ((abs(peek(M, trunc(peek(V, 589) + peek(V, 131) + 0.00001))) >= 0.00001)) {\n        t243 = f_voice_control(V, M, mq, peek(V, 589));\n      }\n      t244 = (peek(V, 588) + 1);\n      poke(V, t244, 588);\n    }\n  }\n  poke(V, 0, 590);\n  poke(V, 0, 591);\n  poke(V, 0, 592);\n  poke(V, 0, 593);\n  poke(V, 0, 594);\n  poke(V, 0, 588);\n  t245 = min(1048576, trunc(peek(V, 99)));\n  for (t246 = 0; t246 < t245; t246 += 1) {\n    t247 = (peek(V, 97) + (peek(V, 588) * peek(V, 98)));\n    poke(V, t247, 589);\n    if ((abs(peek(M, trunc(peek(V, 589) + peek(V, 131) + 0.00001))) >= 0.00001)) {\n      t248 = f_voice_tick(V, M, mq, peek(V, 589));\n      t249 = (peek(V, 659) * peek(M, trunc(peek(V, 589) + peek(V, 175) + 0.00001)));\n      t250 = (peek(V, 590) + t249);\n      poke(V, t250, 590);\n      t251 = (peek(V, 659) * peek(M, trunc(peek(V, 589) + peek(V, 176) + 0.00001)));\n      t252 = (peek(V, 591) + t251);\n      poke(V, t252, 591);\n      t253 = (peek(V, 660) * peek(M, trunc(peek(V, 589) + peek(V, 175) + 0.00001)));\n      t254 = (peek(V, 592) + t253);\n      poke(V, t254, 592);\n      t255 = (peek(V, 660) * peek(M, trunc(peek(V, 589) + peek(V, 176) + 0.00001)));\n      t256 = (peek(V, 593) + t255);\n      poke(V, t256, 593);\n      t257 = (peek(V, 594) + 1);\n      poke(V, t257, 594);\n    }\n    t258 = (peek(V, 588) + 1);\n    poke(V, t258, 588);\n  }\n  if ((abs((((abs((abs(peek(V, 344) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 344) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t259 = (peek(V, 590) + (peek(V, 357) * (peek(V, 592) - peek(V, 590))));\n    poke(V, t259, 661);\n    t260 = (peek(V, 591) + (peek(V, 357) * (peek(V, 593) - peek(V, 591))));\n    poke(V, t260, 662);\n    t261 = (peek(V, 120) + 5);\n    t262 = (peek(V, 121) + 4);\n    t263 = f_bq(V, M, mq, peek(V, 120), peek(V, 121), peek(V, 661));\n    t264 = f_bq(V, M, mq, t261, t262, t263);\n    poke(V, t264, 661);\n    t265 = (peek(V, 120) + 5);\n    t266 = (peek(V, 121) + 12);\n    t267 = f_bq(V, M, mq, peek(V, 120), (peek(V, 121) + 8), peek(V, 662));\n    t268 = f_bq(V, M, mq, t265, t266, t267);\n    poke(V, t268, 662);\n  }\n  else {\n    t269 = (peek(V, 120) + 5);\n    t270 = (peek(V, 121) + 4);\n    t271 = f_bq(V, M, mq, peek(V, 120), peek(V, 121), peek(V, 590));\n    t272 = f_bq(V, M, mq, t269, t270, t271);\n    poke(V, t272, 661);\n    t273 = (peek(V, 120) + 5);\n    t274 = (peek(V, 121) + 12);\n    t275 = f_bq(V, M, mq, peek(V, 120), (peek(V, 121) + 8), peek(V, 591));\n    t276 = f_bq(V, M, mq, t273, t274, t275);\n    poke(V, t276, 662);\n    t277 = (0.5 * (peek(V, 661) + peek(V, 662)));\n    poke(V, t277, 664);\n    t278 = (peek(V, 664) - peek(V, 665));\n    poke(V, t278, 666);\n    t279 = peek(V, 667);\n    poke(V, t279, 665);\n    t280 = peek(V, 664);\n    poke(V, t280, 667);\n    poke(V, 0, 668);\n    poke(V, 0, 669);\n    t281 = peek(V, 114);\n    poke(V, t281, 670);\n    t282 = min(1048576, trunc(peek(V, 258)));\n    for (t283 = 0; t283 < t282; t283 += 1) {\n      t284 = (((peek(M, trunc(peek(V, 670) + 0.00001)) * peek(M, trunc(peek(V, 670) + 2 + 0.00001))) - (peek(M, trunc(peek(V, 670) + 1 + 0.00001)) * peek(M, trunc(peek(V, 670) + 3 + 0.00001)))) + (peek(M, trunc(peek(V, 670) + 4 + 0.00001)) * peek(V, 666)));\n      poke(V, t284, 671);\n      t285 = trunc(peek(V, 670) + 3 + 0.00001);\n      t286 = peek(M, trunc(peek(V, 670) + 2 + 0.00001));\n      poke(M, t286, t285);\n      t287 = trunc(peek(V, 670) + 2 + 0.00001);\n      t288 = peek(V, 671);\n      poke(M, t288, t287);\n      t289 = (peek(V, 671) * peek(M, trunc(peek(V, 670) + 5 + 0.00001)));\n      t290 = (peek(V, 668) + t289);\n      poke(V, t290, 668);\n      t291 = (peek(V, 671) * peek(M, trunc(peek(V, 670) + 6 + 0.00001)));\n      t292 = (peek(V, 669) + t291);\n      poke(V, t292, 669);\n      t293 = peek(V, 115);\n      t294 = (peek(V, 670) + t293);\n      poke(V, t294, 670);\n    }\n    t295 = (peek(V, 357) * ((3 * peek(V, 668)) - peek(V, 661)));\n    t296 = (peek(V, 661) + t295);\n    poke(V, t296, 661);\n    t297 = (peek(V, 357) * ((3 * peek(V, 669)) - peek(V, 662)));\n    t298 = (peek(V, 662) + t297);\n    poke(V, t298, 662);\n  }\n  t299 = (peek(V, 120) + 10);\n  poke(V, t299, 672);\n  t300 = (peek(V, 672) + 10);\n  t301 = (peek(V, 121) + 36);\n  t302 = (peek(V, 672) + 5);\n  t303 = (peek(V, 121) + 32);\n  t304 = f_bq(V, M, mq, peek(V, 672), (peek(V, 121) + 28), peek(V, 661));\n  t305 = f_bq(V, M, mq, t302, t303, t304);\n  t306 = f_bq(V, M, mq, t300, t301, t305);\n  poke(V, t306, 673);\n  t307 = (peek(V, 672) + 10);\n  t308 = (peek(V, 121) + 48);\n  t309 = (peek(V, 672) + 5);\n  t310 = (peek(V, 121) + 44);\n  t311 = f_bq(V, M, mq, peek(V, 672), (peek(V, 121) + 40), peek(V, 662));\n  t312 = f_bq(V, M, mq, t309, t310, t311);\n  t313 = f_bq(V, M, mq, t307, t308, t312);\n  poke(V, t313, 674);\n  if ((abs((abs(peek(V, 347) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t314 = f_tanh_(V, M, mq, (1.3 * peek(V, 673)));\n    t315 = (t314 / 1.3);\n    poke(V, t315, 673);\n    t316 = f_tanh_(V, M, mq, (1.3 * peek(V, 674)));\n    t317 = (t316 / 1.3);\n    poke(V, t317, 674);\n  }\n  else {\n    if ((abs((abs(peek(V, 347) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t318 = peek(V, 673);\n      poke(V, t318, 675);\n      t319 = peek(V, 674);\n      poke(V, t319, 676);\n      poke(V, 0, 677);\n      t320 = min(1048576, trunc(4));\n      for (t321 = 0; t321 < t320; t321 += 1) {\n        t322 = (peek(V, 126) + (peek(V, 677) * peek(V, 127)));\n        poke(V, t322, 678);\n        t323 = peek(M, trunc(peek(V, 260) + peek(V, 677) + 0.00001));\n        poke(V, t323, 679);\n        t324 = peek(M, trunc(peek(V, 678) + eel_mod(((peek(V, 679) - peek(M, trunc(peek(V, 259) + peek(V, 677) + 0.00001))) + peek(V, 127)), peek(V, 127)) + 0.00001));\n        poke(V, t324, 680);\n        t325 = (peek(V, 675) + (0.6 * peek(V, 680)));\n        poke(V, t325, 681);\n        t326 = trunc(peek(V, 678) + peek(V, 679) + 0.00001);\n        t327 = peek(V, 681);\n        poke(M, t327, t326);\n        t328 = (peek(V, 680) - (0.6 * peek(V, 681)));\n        poke(V, t328, 675);\n        t329 = trunc(peek(V, 260) + peek(V, 677) + 0.00001);\n        t330 = eel_mod((peek(V, 679) + 1), peek(V, 127));\n        poke(M, t330, t329);\n        t331 = (peek(V, 126) + ((peek(V, 677) + 4) * peek(V, 127)));\n        poke(V, t331, 678);\n        t332 = peek(M, trunc(peek(V, 260) + (peek(V, 677) + 4) + 0.00001));\n        poke(V, t332, 679);\n        t333 = peek(M, trunc(peek(V, 678) + eel_mod(((peek(V, 679) - peek(M, trunc(peek(V, 259) + (peek(V, 677) + 4) + 0.00001))) + peek(V, 127)), peek(V, 127)) + 0.00001));\n        poke(V, t333, 680);\n        t334 = (peek(V, 676) + (0.6 * peek(V, 680)));\n        poke(V, t334, 681);\n        t335 = trunc(peek(V, 678) + peek(V, 679) + 0.00001);\n        t336 = peek(V, 681);\n        poke(M, t336, t335);\n        t337 = (peek(V, 680) - (0.6 * peek(V, 681)));\n        poke(V, t337, 676);\n        t338 = trunc(peek(V, 260) + (peek(V, 677) + 4) + 0.00001);\n        t339 = eel_mod((peek(V, 679) + 1), peek(V, 127));\n        poke(M, t339, t338);\n        t340 = (peek(V, 677) + 1);\n        poke(V, t340, 677);\n      }\n      t341 = ((0.6 * peek(V, 673)) + (0.55 * peek(V, 675)));\n      poke(V, t341, 673);\n      t342 = ((0.6 * peek(V, 674)) + (0.55 * peek(V, 676)));\n      poke(V, t342, 674);\n    }\n    else {\n      if ((abs((abs(peek(V, 347) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t343 = (0.5 * (peek(V, 673) + peek(V, 674)));\n        poke(V, t343, 682);\n        t344 = (peek(V, 682) - peek(V, 683));\n        poke(V, t344, 684);\n        t345 = peek(V, 685);\n        poke(V, t345, 683);\n        t346 = peek(V, 682);\n        poke(V, t346, 685);\n        poke(V, 0, 686);\n        poke(V, 0, 687);\n        t347 = peek(V, 117);\n        poke(V, t347, 670);\n        t348 = min(1048576, trunc(peek(V, 118)));\n        for (t349 = 0; t349 < t348; t349 += 1) {\n          t350 = (((peek(M, trunc(peek(V, 670) + 0.00001)) * peek(M, trunc(peek(V, 670) + 2 + 0.00001))) - (peek(M, trunc(peek(V, 670) + 1 + 0.00001)) * peek(M, trunc(peek(V, 670) + 3 + 0.00001)))) + (peek(M, trunc(peek(V, 670) + 4 + 0.00001)) * peek(V, 684)));\n          poke(V, t350, 671);\n          t351 = trunc(peek(V, 670) + 3 + 0.00001);\n          t352 = peek(M, trunc(peek(V, 670) + 2 + 0.00001));\n          poke(M, t352, t351);\n          t353 = trunc(peek(V, 670) + 2 + 0.00001);\n          t354 = peek(V, 671);\n          poke(M, t354, t353);\n          t355 = (peek(V, 671) * peek(M, trunc(peek(V, 670) + 5 + 0.00001)));\n          t356 = (peek(V, 686) + t355);\n          poke(V, t356, 686);\n          t357 = (peek(V, 671) * peek(M, trunc(peek(V, 670) + 6 + 0.00001)));\n          t358 = (peek(V, 687) + t357);\n          poke(V, t358, 687);\n          t359 = (peek(V, 670) + 8);\n          poke(V, t359, 670);\n        }\n        t360 = (2 * peek(V, 686));\n        t361 = (peek(V, 673) + t360);\n        poke(V, t361, 673);\n        t362 = (2 * peek(V, 687));\n        t363 = (peek(V, 674) + t362);\n        poke(V, t363, 674);\n      }\n      else {\n        t364 = f_tanh_(V, M, mq, (2 * peek(V, 673)));\n        t365 = (t364 * 0.5);\n        poke(V, t365, 673);\n        t366 = f_tanh_(V, M, mq, (2 * peek(V, 674)));\n        t367 = (t366 * 0.5);\n        poke(V, t367, 674);\n      }\n    }\n  }\n  t368 = (((peek(V, 361) * peek(V, 336)) * peek(V, 262)) * peek(V, 289));\n  poke(V, t368, 688);\n  t369 = peek(V, 688);\n  t370 = (peek(V, 673) * t369);\n  poke(V, t370, 673);\n  t371 = peek(V, 688);\n  t372 = (peek(V, 674) * t371);\n  poke(V, t372, 674);\n  t373 = max(abs(peek(V, 673)), abs(peek(V, 674)));\n  poke(V, t373, 689);\n  t374 = ((abs((peek(V, 689) > peek(V, 319) ? 1 : 0)) >= 0.00001) ? peek(V, 689) : (peek(V, 319) * peek(V, 318)));\n  poke(V, t374, 319);\n  t375 = ((abs((peek(V, 319) > 0.7 ? 1 : 0)) >= 0.00001) ? (0.7 / peek(V, 319)) : 1);\n  poke(V, t375, 690);\n  t376 = peek(V, 690);\n  t377 = (peek(V, 673) * t376);\n  poke(V, t377, 673);\n  t378 = peek(V, 690);\n  t379 = (peek(V, 674) * t378);\n  poke(V, t379, 674);\n  t380 = abs(peek(V, 673));\n  poke(V, t380, 689);\n  if ((abs((peek(V, 689) > 0.9 ? 1 : 0)) >= 0.00001)) {\n    t381 = peek(V, 673);\n    t382 = (t381 > 0 ? 1 : (t381 < 0 ? -1 : 0));\n    t383 = f_tanh_(V, M, mq, ((peek(V, 689) - 0.9) * 10));\n    t384 = (t382 * (0.9 + (0.1 * t383)));\n    poke(V, t384, 673);\n  }\n  t385 = abs(peek(V, 674));\n  poke(V, t385, 689);\n  if ((abs((peek(V, 689) > 0.9 ? 1 : 0)) >= 0.00001)) {\n    t386 = peek(V, 674);\n    t387 = (t386 > 0 ? 1 : (t386 < 0 ? -1 : 0));\n    t388 = f_tanh_(V, M, mq, ((peek(V, 689) - 0.9) * 10));\n    t389 = (t387 * (0.9 + (0.1 * t388)));\n    poke(V, t389, 674);\n  }\n  t390 = peek(V, 673);\n  poke(V, t390, 453);\n  t391 = peek(V, 674);\n  poke(V, t391, 454);\n  t392 = max(abs(peek(V, 673)), (peek(V, 316) * peek(V, 315)));\n  poke(V, t392, 316);\n  t393 = trunc(peek(V, 124) + peek(V, 337) + 0.00001);\n  t394 = (0.5 * (peek(V, 673) + peek(V, 674)));\n  poke(M, t394, t393);\n  t395 = eel_band((peek(V, 337) + 1), (peek(V, 125) - 1));\n  poke(V, t395, 337);\n  keep = in1 * 0;   // gen~ keeps its left inlet for messages\nout1 = peek(V, 453);\nout2 = peek(V, 454);\n",
         "fontface": 0,
         "fontname": "<Monospaced>",
         "fontsize": 12.0
        }
       },
       {
        "box": {
         "id": "obj-3",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          20.0,
          520.0,
          40.0,
          22.0
         ],
         "text": "out 1"
        }
       },
       {
        "box": {
         "id": "obj-4",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          140.0,
          520.0,
          40.0,
          22.0
         ],
         "text": "out 2"
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "obj-1",
          0
         ],
         "destination": [
          "obj-2",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-2",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-2",
          1
         ],
         "destination": [
          "obj-4",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "obj-14",
     "maxclass": "newobj",
     "numinlets": 2,
     "numoutlets": 0,
     "patching_rect": [
      20.0,
      360.0,
      70.0,
      22.0
     ],
     "text": "plugout~"
    }
   },
   {
    "box": {
     "id": "obj-15",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      420.0,
      300.0,
      160.0,
      22.0
     ],
     "outlettype": [
      "",
      ""
     ],
     "text": "buffer~ ---mq @samps 1024"
    }
   },
   {
    "box": {
     "id": "obj-16",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      260.0,
      200.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "mqname ---mq"
    }
   },
   {
    "box": {
     "id": "obj-17",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      220.0,
      220.0,
      100.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "mq ---mq"
    }
   }
  ],
  "lines": [
   {
    "patchline": {
     "source": [
      "obj-1",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      0
     ],
     "destination": [
      "obj-4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      1
     ],
     "destination": [
      "obj-5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-5",
      0
     ],
     "destination": [
      "obj-6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-6",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      2
     ],
     "destination": [
      "obj-7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-8",
      0
     ],
     "destination": [
      "obj-9",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-9",
      0
     ],
     "destination": [
      "obj-10",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-9",
      1
     ],
     "destination": [
      "obj-10",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-10",
      0
     ],
     "destination": [
      "obj-11",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-11",
      0
     ],
     "destination": [
      "obj-12",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-12",
      0
     ],
     "destination": [
      "obj-3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-13",
      0
     ],
     "destination": [
      "obj-14",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-13",
      1
     ],
     "destination": [
      "obj-14",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      3
     ],
     "destination": [
      "obj-13",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-16",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-16",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-17",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-17",
      0
     ],
     "destination": [
      "obj-13",
      0
     ]
    }
   }
  ],
  "parameters": {
   "obj-5": [
    "state",
    "state",
    0
   ],
   "inherited_shortname": 1
  },
  "dependency_cache": [
   {
    "name": "InstrumentCreator.js",
    "bootpath": ".",
    "type": "TEXT",
    "implicit": 1
   }
  ],
  "autosave": 0,
  "devicewidth": 260.0,
  "description": "",
  "digest": "",
  "tags": "",
  "style": "",
  "latency": 0,
  "is_mpe": 0
 }
}
