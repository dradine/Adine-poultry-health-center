/* =========================================================
   ADINE POULTRY HEALTH CENTER
   PROFESSIONAL POULTRY GENETICS DATABASE
   VERSION 2.0
   Updated: 2026

   IMPORTANT:
   This file is the GENETIC / STANDARD STRUCTURE.

   Numeric performance objectives are NOT guessed.
   They will be entered only from the corresponding
   official breeder documentation.

   Status:
   active       = currently documented/marketed
   legacy       = historical/archived product
   regional     = availability may depend on region
   research     = research/reference population
   iran         = Iranian/local genetic line
========================================================= */

const POULTRY_STANDARDS = {

    meta: {

        databaseName:
            "Adine Poultry Genetics & Performance Database",

        version:
            "2.0",

        updated:
            "2026",

        countryFocus:
            "Iran",

        numericDataPolicy:
            "Official breeder documentation only",

        comparisonPolicy:
            "Never compare different genetic programs as if they were the same standard"

    },


    /* =====================================================
       1. BROILERS
    ===================================================== */

    broiler: {

        label:
            "ÃÂÃÂ±ÃÂº ÃÂ¯ÃÂÃÂ´ÃÂªÃÂ",

        categories: {

            commercial: {

                label:
                    "ÃÂ¯ÃÂÃÂ´ÃÂªÃÂ ÃÂªÃÂ¬ÃÂ§ÃÂ±ÃÂ",

                genetics: {

                    /* -----------------------------
                       AVIAGEN / ROSS
                    ----------------------------- */

                    Ross: {

                        company:
                            "Aviagen",

                        family:
                            "Ross",

                        status:
                            "active",

                        products: {

                            "Ross 308": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                fastFeathering:
                                    true,

                                slowFeathering:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Ross 308",

                                performancePrograms: [

                                    "Broiler Performance Objectives",

                                    "Broiler Handbook",

                                    "Parent Stock Performance Objectives",

                                    "Parent Stock Handbook"

                                ],

                                standards: {}

                            },


                            "Ross 308 FF": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                fastFeathering:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Ross 308 FF",

                                performancePrograms: [

                                    "Broiler Performance Objectives",

                                    "Parent Stock Performance Objectives - Fast Feathering"

                                ],

                                standards: {}

                            },


                            "Ross 708": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Ross 708",

                                performancePrograms: [

                                    "Broiler Performance Objectives",

                                    "Parent Stock Performance Objectives"

                                ],

                                standards: {}

                            },


                            "Ross 308 AP": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Ross 308 AP",

                                performancePrograms: [

                                    "Broiler Performance Objectives",

                                    "Parent Stock Performance Objectives"

                                ],

                                standards: {}

                            }

                        }

                    },


                    /* -----------------------------
                       COBB
                    ----------------------------- */

                    Cobb: {

                        company:
                            "Cobb Genetics",

                        family:
                            "Cobb",

                        status:
                            "active",

                        products: {

                            "Cobb500": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Cobb Genetics",

                                performancePrograms: [

                                    "Cobb500 Broiler Performance",

                                    "Cobb500 Breeder Performance"

                                ],

                                standards: {}

                            },


                            "Cobb800": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Cobb Genetics",

                                performancePrograms: [

                                    "Cobb800 Broiler",

                                    "Cobb800 Breeder"

                                ],

                                standards: {}

                            }

                        }

                    },


                    /* -----------------------------
                       ARBOR ACRES
                    ----------------------------- */

                    ArborAcres: {

                        company:
                            "Aviagen",

                        family:
                            "Arbor Acres",

                        status:
                            "active",

                        products: {

                            "Arbor Acres Plus": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Arbor Acres Plus",

                                standards: {}

                            },


                            "Arbor Acres Plus S": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Arbor Acres Plus S",

                                standards: {}

                            }

                        }

                    },


                    /* -----------------------------
                       INDIAN RIVER
                    ----------------------------- */

                    IndianRiver: {

                        company:
                            "Aviagen",

                        family:
                            "Indian River",

                        status:
                            "active",

                        products: {

                            "Indian River": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Aviagen Indian River",

                                performancePrograms: [

                                    "Indian River Broiler",

                                    "Indian River Parent Stock",

                                    "Indian River Parent Stock Fast Feathering"

                                ],

                                standards: {}

                            }

                        }

                    },


                    /* -----------------------------
                       HUBBARD
                    ----------------------------- */

                    Hubbard: {

                        company:
                            "Hubbard Breeders",

                        family:
                            "Hubbard",

                        status:
                            "active",

                        products: {

                            "Hubbard Efficiency Plus": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Hubbard Breeders",

                                performancePrograms: [

                                    "Efficiency Plus Broiler",

                                    "Efficiency Plus Breeder"

                                ],

                                standards: {}

                            },


                            "Hubbard EDGE": {

                                status:
                                    "active",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    true,

                                source:
                                    "Hubbard Breeders",

                                performancePrograms: [

                                    "EDGE Broiler",

                                    "EDGE Breeder"

                                ],

                                standards: {}

                            }

                        }

                    },


                    /* -----------------------------
                       IRANIAN ARIAN
                    ----------------------------- */

                    Arian: {

                        company:
                            "Iranian Poultry Genetics",

                        family:
                            "Arian",

                        status:
                            "iran",

                        products: {

                            "Arian": {

                                status:
                                    "iran",

                                commercialType:
                                    "broiler",

                                parentStock:
                                    true,

                                officialDocumentation:
                                    false,

                                localLine:
                                    true,

                                source:
                                    "Iranian Arian genetic line",

                                standards: {},

                                dataClassification:
                                    "Iranian/local reference required"

                            }

                        }

                    }

                }

            },


            /* =================================================
               SPECIAL / RESEARCH BROILER
            ================================================= */

            other: {

                label:
                    "ÃÂ³ÃÂ§ÃÂÃÂ± / ÃÂªÃÂ­ÃÂÃÂÃÂÃÂ§ÃÂªÃÂ",

                genetics: {}

            }

        }

    },


    /* =====================================================
       2. LAYERS
    ===================================================== */

    layer: {

        label:
            "ÃÂÃÂ±ÃÂº ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂ¯ÃÂ°ÃÂ§ÃÂ±",

        categories: {

            commercial: {

                label:
                    "ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂ¯ÃÂ°ÃÂ§ÃÂ± ÃÂªÃÂ¬ÃÂ§ÃÂ±ÃÂ",

                genetics: {


                    /* =================================================
                       HY-LINE
                    ================================================= */

                    HyLine: {

                        company:
                            "Hy-Line International",

                        family:
                            "Hy-Line",

                        status:
                            "active",

                        products: {

                            "W-36": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line W-36",

                                standards: {}

                            },


                            "W-80": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line W-80",

                                standards: {}

                            },


                            "W-80 Plus": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line W-80 Plus",

                                standards: {}

                            },


                            "W-80 Pro": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line W-80 Pro",

                                standards: {}

                            },


                            "Brown": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line Brown",

                                standards: {}

                            },


                            "Silver Brown": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                parentStock:
                                    true,

                                source:
                                    "Hy-Line Silver Brown",

                                standards: {}

                            },


                            "Sonia / Gray": {

                                status:
                                    "active",

                                officialDocumentation:
                                    true,

                                source:
                                    "Hy-Line Sonia / Gray",

                                standards: {}

                            },


                            "Pink": {

                                status:
                                    "active",

                                officialDocumentation:
                                    true,

                                source:
                                    "Hy-Line Pink",

                                standards: {}

                            }

                        }

                    },


                    /* =================================================
                       HENDRIX GENETICS
                    ================================================= */

                    Hendrix: {

                        company:
                            "Hendrix Genetics",

                        family:
                            "Hendrix Genetics Layer",

                        status:
                            "active",

                        products: {


                            /* ISA */

                            "ISA Brown": {

                                brand:
                                    "ISA",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "ISA Brown",

                                standards: {}

                            },


                            "ISA White": {

                                brand:
                                    "ISA",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "ISA White",

                                standards: {}

                            },


                            /* DEKALB */

                            "Dekalb White": {

                                brand:
                                    "Dekalb",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Dekalb White",

                                standards: {}

                            },


                            "Dekalb Brown": {

                                brand:
                                    "Dekalb",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Dekalb Brown",

                                standards: {}

                            },


                            /* BOVANS */

                            "Bovans White": {

                                brand:
                                    "Bovans",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Bovans White",

                                standards: {}

                            },


                            "Bovans Brown": {

                                brand:
                                    "Bovans",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Bovans Brown",

                                standards: {}

                            },


                            "Bovans Black": {

                                brand:
                                    "Bovans",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Bovans Black",

                                standards: {}

                            },


                            /* SHAVER */

                            "Shaver White": {

                                brand:
                                    "Shaver",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Shaver White",

                                standards: {}

                            },


                            "Shaver Brown": {

                                brand:
                                    "Shaver",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Shaver Brown",

                                standards: {}

                            },


                            "Shaver Black": {

                                brand:
                                    "Shaver",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Shaver Black",

                                standards: {}

                            },


                            /* BABCOCK */

                            "Babcock White": {

                                brand:
                                    "Babcock",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Babcock White",

                                standards: {}

                            },


                            "Babcock Brown": {

                                brand:
                                    "Babcock",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Babcock Brown",

                                standards: {}

                            },


                            /* HISEX */

                            "Hisex White": {

                                brand:
                                    "Hisex",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Hisex White",

                                standards: {}

                            },


                            "Hisex Brown": {

                                brand:
                                    "Hisex",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Hisex Brown",

                                standards: {}

                            },


                            /* WARREN */

                            "Warren White": {

                                brand:
                                    "Warren",

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Warren White",

                                standards: {}

                            },


                            "Warren Brown": {

                                brand:
                                    "Warren",

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Warren Brown",

                                standards: {}

                            }

                        }

                    },


                    /* =================================================
                       LOHMANN
                    ================================================= */

                    Lohmann: {

                        company:
                            "Lohmann Breeders",

                        family:
                            "Lohmann",

                        status:
                            "active",

                        products: {

                            "Lohmann Brown-Classic": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann Brown Classic",

                                standards: {}

                            },


                            "Lohmann Brown-Lite": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann Brown Lite",

                                standards: {}

                            },


                            "Lohmann Brown-Extra": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann Brown Extra",

                                standards: {}

                            },


                            "Lohmann LSL-Classic": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann LSL Classic",

                                standards: {}

                            },


                            "Lohmann LSL-Lite": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann LSL Lite",

                                standards: {}

                            },


                            "Lohmann LSL-Extra": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann LSL Extra",

                                standards: {}

                            },


                            "Lohmann Sandy": {

                                status:
                                    "active",

                                eggColor:
                                    "tinted",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann Sandy",

                                standards: {}

                            },


                            "Lohmann Tradition": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "Lohmann Tradition",

                                standards: {}

                            }

                        }

                    },


                    /* =================================================
                       NOVOGEN
                    ================================================= */

                    NOVOgen: {

                        company:
                            "NOVOgen",

                        family:
                            "NOVOgen",

                        status:
                            "active",

                        products: {

                            "NOVOgen Brown": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "NOVOgen Brown",

                                standards: {}

                            },


                            "NOVOgen White": {

                                status:
                                    "active",

                                eggColor:
                                    "white",

                                officialDocumentation:
                                    true,

                                source:
                                    "NOVOgen White",

                                standards: {}

                            }

                        }

                    },


                    /* =================================================
                       H&N
                    ================================================= */

                    HN: {

                        company:
                            "H&N International",

                        family:
                            "H&N",

                        status:
                            "active",

                        products: {

                            "Nick Chick": {

                                status:
                                    "active",

                                officialDocumentation:
                                    true,

                                source:
                                    "H&N Nick Chick",

                                standards: {}

                            }

                        }

                    },


                    /* =================================================
                       TETRA
                    ================================================= */

                    TETRA: {

                        company:
                            "BÃÂ¡bolna TETRA",

                        family:
                            "TETRA",

                        status:
                            "active",

                        products: {

                            "TETRA Brown": {

                                status:
                                    "active",

                                eggColor:
                                    "brown",

                                officialDocumentation:
                                    true,

                                source:
                                    "TETRA Brown",

                                standards: {}

                            }

                        }

                    }

                }

            }

        }

    },


    /* =====================================================
       3. PULLET
       ===================================================== */

    pullet: {

        label:
            "ÃÂ¾ÃÂÃÂÃÂª",

        description:
            "Pullet standards are selected according to the commercial layer genetic line.",

        inheritedFromLayerGenetics:
            true,

        availableGenetics: [

            "HyLine",
            "Hendrix",
            "Lohmann",
            "NOVOgen",
            "HN",
            "TETRA"

        ],

        rule:
            "Pullet standard must match the exact layer strain and production program."

    },


    /* =====================================================
       4. BROILER BREEDER
       ===================================================== */

    breeder: {

        label:
            "ÃÂÃÂ±ÃÂº ÃÂÃÂ§ÃÂ¯ÃÂ±",

        categories: {

            broilerBreeder: {

                label:
                    "ÃÂÃÂ±ÃÂº ÃÂÃÂ§ÃÂ¯ÃÂ± ÃÂ¯ÃÂÃÂ´ÃÂªÃÂ",

                genetics: {

                    Ross: {

                        products: [

                            "Ross 308 Parent Stock",

                            "Ross 308 FF Parent Stock",

                            "Ross 708 Parent Stock",

                            "Ross 308 AP Parent Stock"

                        ]

                    },


                    Cobb: {

                        products: [

                            "Cobb500 Parent Stock",

                            "Cobb800 Parent Stock",

                            "MX Male"

                        ]

                    },


                    ArborAcres: {

                        products: [

                            "Arbor Acres Plus Parent Stock",

                            "Arbor Acres Plus S Parent Stock"

                        ]

                    },


                    IndianRiver: {

                        products: [

                            "Indian River Parent Stock",

                            "Indian River Fast Feathering Parent Stock"

                        ]

                    },


                    Hubbard: {

                        products: [

                            "Hubbard Efficiency Plus Breeder",

                            "Hubbard EDGE Breeder",

                            "Hubbard JA57 Breeder",

                            "Hubbard JA57Ki Breeder"

                        ]

                    }

                }

            },


            layerBreeder: {

                label:
                    "ÃÂÃÂ±ÃÂº ÃÂÃÂ§ÃÂ¯ÃÂ± ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂ¯ÃÂ°ÃÂ§ÃÂ±",

                rule:
                    "Layer parent-stock standard must be selected from the corresponding layer breeder documentation.",

                genetics: {

                    HyLine: [

                        "W-36 Parent Stock",

                        "W-80 Parent Stock",

                        "W-80 Plus Parent Stock",

                        "W-80 Pro Parent Stock",

                        "Brown Parent Stock",

                        "Silver Brown Parent Stock"

                    ],


                    Hendrix: [

                        "ISA Parent Stock",

                        "Dekalb Parent Stock",

                        "Bovans Parent Stock",

                        "Shaver Parent Stock",

                        "Babcock Parent Stock",

                        "Hisex Parent Stock"

                    ],


                    Lohmann: [

                        "Lohmann Parent Stock"

                    ]

                }

            }

        }

    }

};


/* =========================================================
   STANDARD METRIC DEFINITIONS
========================================================= */

const STANDARD_METRICS = {

    /* -------- Broiler -------- */

    age:
        "ÃÂ³ÃÂ",

    bodyWeight:
        "ÃÂÃÂ²ÃÂ ÃÂ¨ÃÂ¯ÃÂ",

    dailyGain:
        "ÃÂ§ÃÂÃÂ²ÃÂ§ÃÂÃÂ´ ÃÂÃÂ²ÃÂ ÃÂ±ÃÂÃÂ²ÃÂ§ÃÂÃÂ",

    weeklyGain:
        "ÃÂ§ÃÂÃÂ²ÃÂ§ÃÂÃÂ´ ÃÂÃÂ²ÃÂ ÃÂÃÂÃÂªÃÂ¯ÃÂ",

    dailyFeed:
        "ÃÂÃÂµÃÂ±ÃÂ ÃÂ±ÃÂÃÂ²ÃÂ§ÃÂÃÂ ÃÂ¯ÃÂ§ÃÂ",

    weeklyFeed:
        "ÃÂÃÂµÃÂ±ÃÂ ÃÂÃÂÃÂªÃÂ¯ÃÂ ÃÂ¯ÃÂ§ÃÂ",

    cumulativeFeed:
        "ÃÂÃÂµÃÂ±ÃÂ ÃÂªÃÂ¬ÃÂÃÂ¹ÃÂ ÃÂ¯ÃÂ§ÃÂ",

    fcr:
        "ÃÂ¶ÃÂ±ÃÂÃÂ¨ ÃÂªÃÂ¨ÃÂ¯ÃÂÃÂ ÃÂºÃÂ°ÃÂ§ÃÂÃÂ",

    livability:
        "ÃÂ²ÃÂÃÂ¯ÃÂÃ¢ÂÂÃÂÃÂ§ÃÂÃÂ",

    mortality:
        "ÃÂªÃÂÃÂÃÂ§ÃÂª",

    uniformity:
        "ÃÂÃÂ©ÃÂÃÂÃÂ§ÃÂ®ÃÂªÃÂ",

    cv:
        "CV%",

    /* -------- Layer -------- */

    henDayProduction:
        "ÃÂªÃÂÃÂÃÂÃÂ¯ ÃÂ¨ÃÂ ÃÂ§ÃÂ²ÃÂ§ÃÂ ÃÂÃÂ±ÃÂº ÃÂ±ÃÂÃÂ²",

    henHousedProduction:
        "ÃÂªÃÂÃÂÃÂÃÂ¯ ÃÂ¨ÃÂ ÃÂ§ÃÂ²ÃÂ§ÃÂ ÃÂÃÂ±ÃÂº ÃÂ§ÃÂÃÂÃÂÃÂ",

    eggMass:
        "Egg Mass",

    eggWeight:
        "ÃÂÃÂ²ÃÂ ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂÃÂ±ÃÂº",

    feedPerEggMass:
        "ÃÂ¯ÃÂ§ÃÂ ÃÂ¨ÃÂ ÃÂ§ÃÂ²ÃÂ§ÃÂ Egg Mass",

    peakProduction:
        "ÃÂ¾ÃÂÃÂ© ÃÂªÃÂÃÂÃÂÃÂ¯",

    peakAge:
        "ÃÂ³ÃÂ ÃÂ¾ÃÂÃÂ©",

    cumulativeEggs:
        "ÃÂªÃÂ¹ÃÂ¯ÃÂ§ÃÂ¯ ÃÂªÃÂ®ÃÂ ÃÂªÃÂ¬ÃÂÃÂ¹ÃÂ",

    /* -------- Breeder -------- */

    fertility:
        "ÃÂÃÂ·ÃÂÃÂÃ¢ÂÂÃÂ¯ÃÂ§ÃÂ±ÃÂ",

    hatchability:
        "ÃÂÃÂ§ÃÂ¨ÃÂÃÂÃÂª ÃÂ¬ÃÂÃÂ¬ÃÂÃ¢ÂÂÃÂ¯ÃÂ±ÃÂ¢ÃÂÃÂ±ÃÂ",

    hatchOfFertileEggs:
        "ÃÂÃÂ§ÃÂ¨ÃÂÃÂÃÂª ÃÂ¬ÃÂÃÂ¬ÃÂÃ¢ÂÂÃÂ¯ÃÂ±ÃÂ¢ÃÂÃÂ±ÃÂ ÃÂ§ÃÂ² ÃÂªÃÂ®ÃÂ ÃÂÃÂ·ÃÂÃÂÃ¢ÂÂÃÂ¯ÃÂ§ÃÂ±",

    settableEggs:
        "ÃÂªÃÂ®ÃÂ ÃÂÃÂ§ÃÂ¨ÃÂ ÃÂ¬ÃÂÃÂ¬ÃÂÃ¢ÂÂÃÂ©ÃÂ´ÃÂ",

    maleFemaleRatio:
        "ÃÂÃÂ³ÃÂ¨ÃÂª ÃÂÃÂ± ÃÂ¨ÃÂ ÃÂÃÂ§ÃÂ¯ÃÂ"

};


/* =========================================================
   STANDARD SOURCE TYPES
========================================================= */

const STANDARD_SOURCE_TYPES = {

    officialPerformanceObjective:
        "Official Performance Objectives",

    officialManagementGuide:
        "Official Management Guide",

    officialNutritionGuide:
        "Official Nutrition Guide",

    officialParentStockGuide:
        "Official Parent Stock Guide",

    regionalOfficialGuide:
        "Official Regional Guide",

    researchReference:
        "Research Reference",

    iranianLocalReference:
        "Iranian Local Reference"

};


/* =========================================================
   HOUSING PROGRAMS
========================================================= */

const HOUSING_PROGRAMS = {

    conventional:
        "ÃÂ³ÃÂÃÂ³ÃÂªÃÂ ÃÂÃÂªÃÂ¹ÃÂ§ÃÂ±ÃÂ",

    alternative:
        "ÃÂ³ÃÂÃÂ³ÃÂªÃÂ ÃÂ¬ÃÂ§ÃÂÃÂ¯ÃÂ²ÃÂÃÂ",

    cage:
        "ÃÂÃÂÃÂ³",

    aviary:
        "ÃÂ¢ÃÂÃÂÃÂ§ÃÂ±ÃÂ",

    freeRange:
        "ÃÂ¢ÃÂ²ÃÂ§ÃÂ¯ / Free Range",

    floor:
        "ÃÂ¨ÃÂ³ÃÂªÃÂ±",

    climateSpecific:
        "ÃÂ¨ÃÂ±ÃÂÃÂ§ÃÂÃÂ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂ®ÃÂ§ÃÂµ"

};


/* =========================================================
   STANDARD VERSION OBJECT
========================================================= */

function createStandardRecord({

    version = null,

    publicationDate = null,

    sourceType =
        "officialPerformanceObjective",

    source = null,

    region = "international",

    housing = "all",

    sex = "mixed",

    notes = ""

} = {}) {

    return {

        version,

        publicationDate,

        sourceType,

        source,

        region,

        housing,

        sex,

        notes,

        data: {}

    };

}


/* =========================================================
   GENERIC ACCESS FUNCTIONS
========================================================= */


/*
  ÃÂÃÂÃÂ¹Ã¢ÂÂÃÂÃÂ§ÃÂ ÃÂ§ÃÂµÃÂÃÂ ÃÂ¨ÃÂ±ÃÂÃÂ§ÃÂÃÂ
*/

function getProductionTypes() {

    return [

        {
            id: "broiler",
            label: "ÃÂ¯ÃÂÃÂ´ÃÂªÃÂ"
        },

        {
            id: "layer",
            label: "ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂ¯ÃÂ°ÃÂ§ÃÂ±"
        },

        {
            id: "pullet",
            label: "ÃÂ¾ÃÂÃÂÃÂª"
        },

        {
            id: "breeder",
            label: "ÃÂÃÂ±ÃÂº ÃÂÃÂ§ÃÂ¯ÃÂ±"
        }

    ];

}


/*
  ÃÂ´ÃÂ±ÃÂ©ÃÂªÃ¢ÂÂÃÂÃÂ§ÃÂ ÃÂÃÂÃÂªÃÂÃÂ©ÃÂ ÃÂ¯ÃÂÃÂ´ÃÂªÃÂ
*/

function getBroilerGenetics() {

    return [

        "Ross",

        "Cobb",

        "ArborAcres",

        "IndianRiver",

        "Hubbard",

        "Arian"

    ];

}


/*
  ÃÂ¨ÃÂ±ÃÂÃÂ¯ÃÂÃÂ§ÃÂ ÃÂªÃÂ®ÃÂÃ¢ÂÂÃÂ¯ÃÂ°ÃÂ§ÃÂ±
*/

function getLayerGenetics() {

    return [

        "HyLine",

        "Hendrix",

        "Lohmann",

        "NOVOgen",

        "HN",

        "TETRA"

    ];

}


/*
  ÃÂÃÂ­ÃÂµÃÂÃÂÃÂ§ÃÂª ÃÂÃÂ© ÃÂÃÂÃÂªÃÂÃÂ©
*/

function getProducts(
    type,
    genetics
) {

    try {

        const source =
            POULTRY_STANDARDS
                [type]
                .categories
                .commercial
                .genetics
                [genetics];

        if (!source) {

            return [];

        }

        return Object.keys(
            source.products || {}
        );

    } catch (error) {

        return [];

    }

}


/*
  ÃÂ§ÃÂ·ÃÂÃÂ§ÃÂ¹ÃÂ§ÃÂª ÃÂÃÂ­ÃÂµÃÂÃÂ
*/

function getProduct(
    type,
    genetics,
    product
) {

    try {

        return POULTRY_STANDARDS
            [type]
            .categories
            .commercial
            .genetics
            [genetics]
            .products
            [product] || null;

    } catch (error) {

        return null;

    }

}


/*
  ÃÂªÃÂ´ÃÂ®ÃÂÃÂµ ÃÂ§ÃÂÃÂÃÂ©ÃÂ ÃÂÃÂ­ÃÂµÃÂÃÂ ÃÂ§ÃÂ³ÃÂªÃÂ§ÃÂÃÂ¯ÃÂ§ÃÂ±ÃÂ¯ ÃÂ±ÃÂ³ÃÂÃÂ ÃÂ¯ÃÂ§ÃÂ±ÃÂ¯
*/

function hasOfficialDocumentation(
    type,
    genetics,
    product
) {

    const item =
        getProduct(
            type,
            genetics,
            product
        );

    return Boolean(
        item &&
        item.officialDocumentation
    );

}


/*
  ÃÂÃÂÃÂ§ÃÂÃÂ³ÃÂ ÃÂ¯ÃÂ ÃÂÃÂÃÂ¯ÃÂ§ÃÂ±
*/

function compareMetric(
    actual,
    standard
) {

    if (
        actual === null ||
        actual === undefined ||
        standard === null ||
        standard === undefined
    ) {

        return {

            difference: null,

            percentage: null,

            status: "no-standard"

        };

    }


    const a =
        Number(actual);

    const s =
        Number(standard);


    if (
        !Number.isFinite(a) ||
        !Number.isFinite(s) ||
        s === 0
    ) {

        return {

            difference: null,

            percentage: null,

            status: "invalid"

        };

    }


    const difference =
        a - s;


    const percentage =
        difference / s * 100;


    return {

        difference,

        percentage,

        status:
            percentage > 5
                ? "above"

                : percentage < -5
                    ? "below"

                    : "within-range"

    };

}


/* =========================================================
   STANDARD DATA VALIDATION
========================================================= */

function validateStandardRecord(
    record
) {

    if (!record) {

        return {

            valid: false,

            errors: [
                "Standard record is missing."
            ]

        };

    }


    const errors = [];


    if (
        !record.version
    ) {

        errors.push(
            "Standard version is missing."
        );

    }


    if (
        !record.source
    ) {

        errors.push(
            "Source is missing."
        );

    }


    if (
        !record.sourceType
    ) {

        errors.push(
            "Source type is missing."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   DATABASE POLICY
========================================================= */

const STANDARD_DATABASE_POLICY = {

    numericValuesMayBeAddedOnlyIf:

        [

            "officialPerformanceObjective",

            "officialManagementGuide",

            "officialParentStockGuide",

            "officialRegionalGuide",

            "researchReference",

            "iranianLocalReference"

        ],


    neverGuessNumbers:
        true,


    neverMixParentStockWithBroiler:
        true,


    neverMixLayerStrains:
        true,


    neverMixHousingPrograms:
        true,


    preservePreviousVersions:
        true,


    preserveRegionalVersions:
        true,


    preserveHistoricalRecords:
        true

};


/* =========================================================
   WEEKLY PERFORMANCE / FCR ENGINE
========================================================= */

function calculateBroilerFCR({feedKg, openingBirds, closingBirds, openingAverageWeightG, closingAverageWeightG} = {}) {
    const feed=Number(feedKg), ob=Number(openingBirds), cb=Number(closingBirds), ow=Number(openingAverageWeightG), cw=Number(closingAverageWeightG);
    if (![feed,ob,cb,ow,cw].every(Number.isFinite) || feed<=0 || ob<=0 || cb<=0 || ow<0 || cw<=0) return null;
    const gainKg=(cb*c
