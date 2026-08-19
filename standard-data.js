/* =========================================================
   ADINE POULTRY HEALTH CENTER
   STANDARD DATA ENGINE
   ========================================================= */

const STANDARD_DATA = {

    /* =====================================================
       BROILER
    ===================================================== */

    broiler: {

        Ross: {

            "Ross 308": {

                commercial: true,

                parentStock: true,

                sexOptions: [
                    "mixed",
                    "male",
                    "female"
                ],

                programs: {

                    broiler: {
                        label: "Ross 308 Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Ross 308 Parent Stock",
                        records: {}
                    }

                }

            },


            "Ross 308 FF": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Ross 308 FF Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Ross 308 FF Parent Stock",
                        records: {}
                    }

                }

            },


            "Ross 708": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Ross 708 Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Ross 708 Parent Stock",
                        records: {}
                    }

                }

            },


            "Ross 308 AP": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Ross 308 AP Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Ross 308 AP Parent Stock",
                        records: {}
                    }

                }

            }

        },


        Cobb: {

            "Cobb500": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Cobb500 Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Cobb500 Parent Stock",
                        records: {}
                    }

                }

            },


            "Cobb800": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Cobb800 Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Cobb800 Parent Stock",
                        records: {}
                    }

                }

            }

        },


        ArborAcres: {

            "Arbor Acres Plus": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Arbor Acres Plus Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Arbor Acres Plus Parent Stock",
                        records: {}
                    }

                }

            },


            "Arbor Acres Plus S": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Arbor Acres Plus S Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Arbor Acres Plus S Parent Stock",
                        records: {}
                    }

                }

            }

        },


        IndianRiver: {

            "Indian River": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Indian River Broiler",
                        records: {}
                    },

                    parentStock: {
                        label: "Indian River Parent Stock",
                        records: {}
                    }

                }

            }

        },


        Hubbard: {

            "Efficiency Plus": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Hubbard Efficiency Plus",
                        records: {}
                    },

                    parentStock: {
                        label: "Hubbard Efficiency Plus Breeder",
                        records: {}
                    }

                }

            },


            "EDGE": {

                commercial: true,

                parentStock: true,

                programs: {

                    broiler: {
                        label: "Hubbard EDGE",
                        records: {}
                    },

                    parentStock: {
                        label: "Hubbard EDGE Breeder",
                        records: {}
                    }

                }

            }

        },


        Arian: {

            "Arian": {

                commercial: true,

                parentStock: true,

                localIranianLine: true,

                programs: {

                    broiler: {

                        label:
                            "Arian Broiler",

                        records: {},

                        dataStatus:
                            "iranian-reference-required"

                    },

                    parentStock: {

                        label:
                            "Arian Parent Stock",

                        records: {},

                        dataStatus:
                            "iranian-reference-required"

                    }

                }

            }

        }

    },


    /* =====================================================
       LAYER
    ===================================================== */

    layer: {

        HyLine: {

            "W-36": {
                records: {}
            },

            "W-80": {
                records: {}
            },

            "W-80 Plus": {
                records: {}
            },

            "W-80 Pro": {
                records: {}
            },

            "Brown": {
                records: {}
            },

            "Silver Brown": {
                records: {}
            }

        },


        Hendrix: {

            "ISA Brown": {
                records: {}
            },

            "ISA White": {
                records: {}
            },

            "Dekalb White": {
                records: {}
            },

            "Dekalb Brown": {
                records: {}
            },

            "Bovans White": {
                records: {}
            },

            "Bovans Brown": {
                records: {}
            },

            "Shaver White": {
                records: {}
            },

            "Shaver Brown": {
                records: {}
            },

            "Shaver Black": {
                records: {}
            },

            "Babcock White": {
                records: {}
            },

            "Babcock Brown": {
                records: {}
            },

            "Hisex White": {
                records: {}
            },

            "Hisex Brown": {
                records: {}
            }

        },


        Lohmann: {

            "Lohmann Brown-Classic": {
                records: {}
            },

            "Lohmann Brown-Lite": {
                records: {}
            },

            "Lohmann Brown-Extra": {
                records: {}
            },

            "Lohmann LSL-Classic": {
                records: {}
            },

            "Lohmann LSL-Lite": {
                records: {}
            },

            "Lohmann LSL-Extra": {
                records: {}
            },

            "Lohmann Sandy": {
                records: {}
            },

            "Lohmann Tradition": {
                records: {}
            }

        },


        NOVOgen: {

            "NOVOgen Brown": {
                records: {}
            },

            "NOVOgen White": {
                records: {}
            }

        },


        HN: {

            "Nick Chick": {
                records: {}
            }

        },


        TETRA: {

            "TETRA Brown": {
                records: {}
            }

        }

    }

};


/* =========================================================
   METRIC DEFINITIONS
   ========================================================= */

const PERFORMANCE_METRICS = {

    age: {
        label: "سن",
        unit: "روز"
    },

    bodyWeight: {
        label: "وزن بدن",
        unit: "g"
    },

    dailyGain: {
        label: "افزایش وزن روزانه",
        unit: "g/day"
    },

    weeklyGain: {
        label: "افزایش وزن هفتگی",
        unit: "g/week"
    },

    dailyFeed: {
        label: "مصرف دان روزانه",
        unit: "g/bird/day"
    },

    weeklyFeed: {
        label: "مصرف دان هفتگی",
        unit: "g/bird/week"
    },

    cumulativeFeed: {
        label: "مصرف تجمعی دان",
        unit: "g/bird"
    },

    fcr: {
        label: "FCR",
        unit: ""
    },

    livability: {
        label: "زنده‌مانی",
        unit: "%"
    },

    mortality: {
        label: "تلفات",
        unit: "%"
    },

    uniformity: {
        label: "یکنواختی",
        unit: "%"
    },

    cv: {
        label: "CV",
        unit: "%"
    },

    eggProduction: {
        label: "درصد تولید",
        unit: "%"
    },

    henDayProduction: {
        label: "Hen-Day Production",
        unit: "%"
    },

    henHousedProduction: {
        label: "Hen-Housed Production",
        unit: "%"
    },

    eggMass: {
        label: "Egg Mass",
        unit: "g/hen/day"
    },

    eggWeight: {
        label: "وزن تخم‌مرغ",
        unit: "g"
    },

    cumulativeEggs: {
        label: "تعداد تخم تجمعی",
        unit: "egg/hen"
    },

    peakProduction: {
        label: "پیک تولید",
        unit: "%"
    },

    peakAge: {
        label: "سن پیک",
        unit: "week"
    },

    fertility: {
        label: "نطفه‌داری",
        unit: "%"
    },

    hatchability: {
        label: "جوجه‌درآوری",
        unit: "%"
    }

};


/* =========================================================
   STANDARD RECORD
   ========================================================= */

function createPerformanceRecord({

    age = null,

    bodyWeight = null,

    dailyGain = null,

    weeklyGain = null,

    dailyFeed = null,

    weeklyFeed = null,

    cumulativeFeed = null,

    fcr = null,

    livability = null,

    mortality = null,

    uniformity = null,

    cv = null,

    eggProduction = null,

    henDayProduction = null,

    henHousedProduction = null,

    eggMass = null,

    eggWeight = null,

    cumulativeEggs = null,

    peakProduction = null,

    peakAge = null,

    fertility = null,

    hatchability = null

} = {}) {

    return {

        age,

        bodyWeight,

        dailyGain,

        weeklyGain,

        dailyFeed,
        weeklyFeed,
        cumulativeFeed,

        fcr,

        livability,
        mortality,

        uniformity,
        cv,

        eggProduction,
        henDayProduction,
        henHousedProduction,

        eggMass,
        eggWeight,
        cumulativeEggs,

        peakProduction,
        peakAge,

        fertility,
        hatchability

    };

}


/* =========================================================
   ADD STANDARD
   ========================================================= */

function addStandardRecord({

    type,

    genetics,

    strain,

    program = null,

    record

}) {

    if (!record) {

        return false;

    }


    try {

        const target =
            program
                ? STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .programs
                    [program]
                    .records

                : STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .records;


        if (!target) {

            return false;

        }


        const key =
            String(record.age);


        target[key] =
            record;


        return true;

    } catch (error) {

        console.error(
            "Unable to add standard:",
            error
        );

        return false;

    }

}


/* =========================================================
   GET STANDARD
   ========================================================= */

function getStandardRecord({

    type,

    genetics,

    strain,

    program = null,

    age

}) {

    try {

        const target =
            program
                ? STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .programs
                    [program]
                    .records

                : STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .records;


        return (
            target[String(age)] ||
            null
        );

    } catch (error) {

        return null;

    }

}


/* =========================================================
   GET STANDARD SERIES
   ========================================================= */

function getStandardSeries({

    type,

    genetics,

    strain,

    program = null,

    metric

}) {

    try {

        const target =
            program
                ? STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .programs
                    [program]
                    .records

                : STANDARD_DATA
                    [type]
                    [genetics]
                    [strain]
                    .records;


        return Object.values(target)

            .filter(
                item =>
                    item &&
                    item.age !== null &&
                    item[metric] !== null &&
                    item[metric] !== undefined
            )

            .sort(
                (a, b) =>
                    Number(a.age) -
                    Number(b.age)
            );

    } catch (error) {

        return [];

    }

}


/* =========================================================
   GET STANDARD LABEL
   ========================================================= */

function getMetricLabel(
    metric
) {

    return (
        PERFORMANCE_METRICS[metric]?.label ||
        metric
    );

}


/* =========================================================
   COMPARE ACTUAL WITH STANDARD
   ========================================================= */

function comparePerformance(
    actual,
    standard
) {

    if (
        actual === null ||
        standard === null ||
        actual === undefined ||
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
        !Number.isFinite(s)
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
        s !== 0
            ? difference / s * 100
            : null;


    return {

        difference,

        percentage,

        status:

            percentage === null
                ? "invalid"

                : percentage > 5
                    ? "above"

                    : percentage < -5
                        ? "below"

                        : "within"

    };

}
