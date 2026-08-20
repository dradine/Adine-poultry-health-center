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
            "ÙØ±Øº Ú¯ÙØ´ØªÛ",

        categories: {

            commercial: {

                label:
                    "Ú¯ÙØ´ØªÛ ØªØ¬Ø§Ø±Û",

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
                    "Ø³Ø§ÛØ± / ØªØ­ÙÛÙØ§ØªÛ",

                genetics: {}

            }

        }

    },


    /* =====================================================
       2. LAYERS
    ===================================================== */

    layer: {

        label:
            "ÙØ±Øº ØªØ®ÙâÚ¯Ø°Ø§Ø±",

        categories: {

            commercial: {

                label:
                    "ØªØ®ÙâÚ¯Ø°Ø§Ø± ØªØ¬Ø§Ø±Û",

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
                            "BÃ¡bolna TETRA",

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
            "Ù¾ÙÙØª",

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
            "ÙØ±Øº ÙØ§Ø¯Ø±",

        categories: {

            broilerBreeder: {

                label:
                    "ÙØ±Øº ÙØ§Ø¯Ø± Ú¯ÙØ´ØªÛ",

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
                    "ÙØ±Øº ÙØ§Ø¯Ø± ØªØ®ÙâÚ¯Ø°Ø§Ø±",

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
        "Ø³Ù",

    bodyWeight:
        "ÙØ²Ù Ø¨Ø¯Ù",

    dailyGain:
        "Ø§ÙØ²Ø§ÛØ´ ÙØ²Ù Ø±ÙØ²Ø§ÙÙ",

    weeklyGain:
        "Ø§ÙØ²Ø§ÛØ´ ÙØ²Ù ÙÙØªÚ¯Û",

    dailyFeed:
        "ÙØµØ±Ù Ø±ÙØ²Ø§ÙÙ Ø¯Ø§Ù",

    weeklyFeed:
        "ÙØµØ±Ù ÙÙØªÚ¯Û Ø¯Ø§Ù",

    cumulativeFeed:
        "ÙØµØ±Ù ØªØ¬ÙØ¹Û Ø¯Ø§Ù",

    fcr:
        "Ø¶Ø±ÛØ¨ ØªØ¨Ø¯ÛÙ ØºØ°Ø§ÛÛ",

    livability:
        "Ø²ÙØ¯ÙâÙØ§ÙÛ",

    mortality:
        "ØªÙÙØ§Øª",

    uniformity:
        "ÛÚ©ÙÙØ§Ø®ØªÛ",

    cv:
        "CV%",

    /* -------- Layer -------- */

    henDayProduction:
        "ØªÙÙÛØ¯ Ø¨Ù Ø§Ø²Ø§Û ÙØ±Øº Ø±ÙØ²",

    henHousedProduction:
        "ØªÙÙÛØ¯ Ø¨Ù Ø§Ø²Ø§Û ÙØ±Øº Ø§ÙÙÛÙ",

    eggMass:
        "Egg Mass",

    eggWeight:
        "ÙØ²Ù ØªØ®ÙâÙØ±Øº",

    feedPerEggMass:
        "Ø¯Ø§Ù Ø¨Ù Ø§Ø²Ø§Û Egg Mass",

    peakProduction:
        "Ù¾ÛÚ© ØªÙÙÛØ¯",

    peakAge:
        "Ø³Ù Ù¾ÛÚ©",

    cumulativeEggs:
        "ØªØ¹Ø¯Ø§Ø¯ ØªØ®Ù ØªØ¬ÙØ¹Û",

    /* -------- Breeder -------- */

    fertility:
        "ÙØ·ÙÙâØ¯Ø§Ø±Û",

    hatchability:
        "ÙØ§Ø¨ÙÛØª Ø¬ÙØ¬ÙâØ¯Ø±Ø¢ÙØ±Û",

    hatchOfFertileEggs:
        "ÙØ§Ø¨ÙÛØª Ø¬ÙØ¬ÙâØ¯Ø±Ø¢ÙØ±Û Ø§Ø² ØªØ®Ù ÙØ·ÙÙâØ¯Ø§Ø±",

    settableEggs:
        "ØªØ®Ù ÙØ§Ø¨Ù Ø¬ÙØ¬ÙâÚ©Ø´Û",

    maleFemaleRatio:
        "ÙØ³Ø¨Øª ÙØ± Ø¨Ù ÙØ§Ø¯Ù"

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
        "Ø³ÛØ³ØªÙ ÙØªØ¹Ø§Ø±Ù",

    alternative:
        "Ø³ÛØ³ØªÙ Ø¬Ø§ÛÚ¯Ø²ÛÙ",

    cage:
        "ÙÙØ³",

    aviary:
        "Ø¢ÙÛØ§Ø±Û",

    freeRange:
        "Ø¢Ø²Ø§Ø¯ / Free Range",

    floor:
        "Ø¨Ø³ØªØ±",

    climateSpecific:
        "Ø¨Ø±ÙØ§ÙÙ Ø§ÙÙÛÙ Ø®Ø§Øµ"

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
  ÙÙØ¹âÙØ§Û Ø§ØµÙÛ Ø¨Ø±ÙØ§ÙÙ
*/

function getProductionTypes() {

    return [

        {
            id: "broiler",
            label: "Ú¯ÙØ´ØªÛ"
        },

        {
            id: "layer",
            label: "ØªØ®ÙâÚ¯Ø°Ø§Ø±"
        },

        {
            id: "pullet",
            label: "Ù¾ÙÙØª"
        },

        {
            id: "breeder",
            label: "ÙØ±Øº ÙØ§Ø¯Ø±"
        }

    ];

}


/*
  Ø´Ø±Ú©ØªâÙØ§Û ÚÙØªÛÚ©Û Ú¯ÙØ´ØªÛ
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
  Ø¨Ø±ÙØ¯ÙØ§Û ØªØ®ÙâÚ¯Ø°Ø§Ø±
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
  ÙØ­ØµÙÙØ§Øª ÛÚ© ÚÙØªÛÚ©
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
  Ø§Ø·ÙØ§Ø¹Ø§Øª ÙØ­ØµÙÙ
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
  ØªØ´Ø®ÛØµ Ø§ÛÙÚ©Ù ÙØ­ØµÙÙ Ø§Ø³ØªØ§ÙØ¯Ø§Ø±Ø¯ Ø±Ø³ÙÛ Ø¯Ø§Ø±Ø¯
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
  ÙÙØ§ÛØ³Ù Ø¯Ù ÙÙØ¯Ø§Ø±
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
    const gainKg=(cb*cw-ob*ow)/1000;
    return gainKg>0 ? Number((feed/gainKg).toFixed(3)) : null;
}

function calculateLayerEggMass({eggsProduced, averageEggWeightG} = {}) {
    const eggs=Number(eggsProduced), w=Number(averageEggWeightG);
    if (!Number.isFinite(eggs)||!Number.isFinite(w)||eggs<0||w<=0) return null;
    return Number((eggs*w/1000).toFixed(3));
}

function calculateLayerFCR({feedKg, eggsProduced, averageEggWeightG} = {}) {
    const feed=Number(feedKg), mass=calculateLayerEggMass({eggsProduced,averageEggWeightG});
    return Number.isFinite(feed)&&feed>0&&Number.isFinite(mass)&&mass>0 ? Number((feed/mass).toFixed(3)) : null;
}

function compareStandardMetric(actual, standard, metric=null, tolerancePercent=5) {
    const a=Number(actual), s=Number(standard);
    if (!Number.isFinite(a)||!Number.isFinite(s)||s===0) return {actual:Number.isFinite(a)?a:null,standard:Number.isFinite(s)?s:null,difference:null,percentage:null,status:'no-standard',metric};
    const d=a-s, p=d/s*100;
    return {actual:Number(a.toFixed(3)),standard:Number(s.toFixed(3)),difference:Number(d.toFixed(3)),percentage:Number(p.toFixed(2)),status:Math.abs(p)<=tolerancePercent?'within-range':p>0?'above':'below',metric};
}

function getStandardAtAge(type, geneticsId, strain, ageDays) {
    const standard=getStandard(type,geneticsId,strain);
    if (!standard) return null;
    const out={ageDays:Number(ageDays)};
    const metricNames=typeof PERFORMANCE_METRICS!=='undefined'?Object.keys(PERFORMANCE_METRICS):[];
    metricNames.forEach(metric=>{ if(metric!=='ageDays') out[metric]=getStandardValueAtAge(standard,metric,ageDays); });
    return out;
}

function getStandardComparison(type, geneticsId, strain, ageDays, actual={}) {
    const target=getStandardAtAge(type,geneticsId,strain,ageDays);
    if (!target) return {available:false,target:null,comparisons:{}};
    const comparisons={};
    Object.keys(actual||{}).forEach(metric=>comparisons[metric]=compareStandardMetric(actual[metric],target[metric],metric));
    return {available:true,target,comparisons};
}

if (typeof window !== 'undefined') {
    window.calculateBroilerFCR=calculateBroilerFCR;
    window.calculateLayerEggMass=calculateLayerEggMass;
    window.calculateLayerFCR=calculateLayerFCR;
    window.compareStandardMetric=compareStandardMetric;
    window.getStandardAtAge=getStandardAtAge;
    window.getStandardComparison=getStandardComparison;
}
