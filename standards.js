/* =========================================================
   ADINE POULTRY HEALTH CENTER
   PROFESSIONAL POULTRY STANDARDS ENGINE
   VERSION 3.0
   Updated: 2026

   ---------------------------------------------------------
   RESPONSIBILITY
   ---------------------------------------------------------

   This file is the STANDARD ENGINE.

   It does NOT invent numerical standards.

   Numerical performance data are stored in:
       standard-data.js

   Genetic catalog:
       standard-data.js
       standard-data.js / POULTRY_CATALOG

   This file provides:

       - standard lookup
       - age interpolation
       - metric lookup
       - actual vs standard comparison
       - weekly comparison
       - FCR comparison
       - layer metrics
       - breeder metrics
       - broiler metrics
       - data validation
       - source validation
       - backward compatibility

   ---------------------------------------------------------
   DATA PRINCIPLE
   ---------------------------------------------------------

   Official breeder data only.

   Never:
       - guess a standard
       - mix broiler with breeder
       - mix layer strains
       - extrapolate outside documented age range
       - silently use another strain's standard
       - treat FCR as interchangeable between production types

========================================================= */

"use strict";


/* =========================================================
   DATABASE CONFIGURATION
========================================================= */

const STANDARD_ENGINE_CONFIG = {

    version:
        "3.0",

    country:
        "Iran",

    interpolation:
        "linear",

    allowExtrapolation:
        false,

    missingStandard:
        "null",

    numericDataPolicy:
        "official-breeder-documentation-only",

    comparisonTolerancePercent:
        5,

    fcrPrecision:
        3,

    weightPrecision:
        0,

    percentagePrecision:
        2

};


/* =========================================================
   STANDARD METRIC DEFINITIONS
========================================================= */

const STANDARD_METRICS = {


    /* =====================================================
       BROILER
    ===================================================== */

    broiler: {

        bodyWeight: {

            key:
                "bodyWeight",

            label:
                "وزن بدن",

            unit:
                "g",

            higherIsBetter:
                null

        },

        dailyGain: {

            key:
                "dailyGain",

            label:
                "افزایش وزن روزانه",

            unit:
                "g/day",

            higherIsBetter:
                null

        },

        dailyFeed: {

            key:
                "dailyFeed",

            label:
                "مصرف دان روزانه",

            unit:
                "g/bird/day",

            higherIsBetter:
                false

        },

        cumulativeFeed: {

            key:
                "cumulativeFeed",

            label:
                "مصرف تجمعی دان",

            unit:
                "g/bird",

            higherIsBetter:
                false

        },

        fcr: {

            key:
                "fcr",

            label:
                "ضریب تبدیل غذایی",

            unit:
                "kg/kg",

            higherIsBetter:
                false

        },

        mortality: {

            key:
                "mortality",

            label:
                "تلفات تجمعی",

            unit:
                "%",

            higherIsBetter:
                false

        },

        livability: {

            key:
                "livability",

            label:
                "زنده‌مانی",

            unit:
                "%",

            higherIsBetter:
                true

        },

        uniformity: {

            key:
                "uniformity",

            label:
                "یکنواختی",

            unit:
                "%",

            higherIsBetter:
                true

        }

    },


    /* =====================================================
       BREEDER
    ===================================================== */

    breeder: {

        bodyWeight: {

            key:
                "bodyWeight",

            label:
                "وزن بدن",

            unit:
                "g"

        },

        dailyFeed: {

            key:
                "dailyFeed",

            label:
                "مصرف دان روزانه",

            unit:
                "g/bird/day"

        },

        cumulativeFeed: {

            key:
                "cumulativeFeed",

            label:
                "مصرف تجمعی دان",

            unit:
                "g/bird"

        },

        uniformity: {

            key:
                "uniformity",

            label:
                "یکنواختی",

            unit:
                "%",

            higherIsBetter:
                true

        },

        mortality: {

            key:
                "mortality",

            label:
                "تلفات",

            unit:
                "%",

            higherIsBetter:
                false

        },

        livability: {

            key:
                "livability",

            label:
                "زنده‌مانی",

            unit:
                "%",

            higherIsBetter:
                true

        },

        eggProduction: {

            key:
                "eggProduction",

            label:
                "تولید تخم‌مرغ",

            unit:
                "%",

            higherIsBetter:
                true

        },

        cumulativeEggs: {

            key:
                "cumulativeEggs",

            label:
                "تخم‌مرغ تجمعی به ازای مرغ",

            unit:
                "egg/hen",

            higherIsBetter:
                true

        },

        hatchability: {

            key:
                "hatchability",

            label:
                "قابلیت جوجه‌درآوری",

            unit:
                "%",

            higherIsBetter:
                true

        },

        fertility: {

            key:
                "fertility",

            label:
                "باروری",

            unit:
                "%",

            higherIsBetter:
                true

        }

    },


    /* =====================================================
       LAYER
    ===================================================== */

    layer: {

        bodyWeight: {

            key:
                "bodyWeight",

            label:
                "وزن بدن",

            unit:
                "g"

        },

        dailyFeed: {

            key:
                "dailyFeed",

            label:
                "مصرف دان روزانه",

            unit:
                "g/bird/day"

        },

        cumulativeFeed: {

            key:
                "cumulativeFeed",

            label:
                "مصرف تجمعی دان",

            unit:
                "g/bird"

        },

        uniformity: {

            key:
                "uniformity",

            label:
                "یکنواختی",

            unit:
                "%",

            higherIsBetter:
                true

        },

        eggProduction: {

            key:
                "eggProduction",

            label:
                "تولید تخم‌مرغ",

            unit:
                "%",

            higherIsBetter:
                true

        },

        eggWeight: {

            key:
                "eggWeight",

            label:
                "وزن تخم‌مرغ",

            unit:
                "g"

        },

        eggMass: {

            key:
                "eggMass",

            label:
                "Egg Mass",

            unit:
                "g/hen/day",

            higherIsBetter:
                null

        },

        fcr: {

            key:
                "fcr",

            label:
                "ضریب تبدیل غذایی",

            unit:
                "kg feed/kg egg mass",

            higherIsBetter:
                false

        },

        mortality: {

            key:
                "mortality",

            label:
                "تلفات",

            unit:
                "%",

            higherIsBetter:
                false

        },

        livability: {

            key:
                "livability",

            label:
                "زنده‌مانی",

            unit:
                "%",

            higherIsBetter:
                true

        }

    },


    /* =====================================================
       PULLET
    ===================================================== */

    pullet: {

        bodyWeight: {

            key:
                "bodyWeight",

            label:
                "وزن بدن",

            unit:
                "g"

        },

        dailyGain: {

            key:
                "dailyGain",

            label:
                "افزایش وزن روزانه",

            unit:
                "g/day"

        },

        dailyFeed: {

            key:
                "dailyFeed",

            label:
                "مصرف دان روزانه",

            unit:
                "g/bird/day"

        },

        cumulativeFeed: {

            key:
                "cumulativeFeed",

            label:
                "مصرف تجمعی دان",

            unit:
                "g/bird"

        },

        uniformity: {

            key:
                "uniformity",

            label:
                "یکنواختی",

            unit:
                "%",

            higherIsBetter:
                true

        },

        mortality: {

            key:
                "mortality",

            label:
                "تلفات",

            unit:
                "%",

            higherIsBetter:
                false

        },

        livability: {

            key:
                "livability",

            label:
                "زنده‌مانی",

            unit:
                "%",

            higherIsBetter:
                true

        }

    }

};


/* =========================================================
   PRODUCTION TYPE NORMALIZATION
========================================================= */

function normalizeProductionType(
    type
) {

    const value =
        String(
            type || ""
        )
        .trim()
        .toLowerCase();

    const aliases = {

        broiler:
            "broiler",

        گوشتی:
            "broiler",

        meat:
            "broiler",

        breeder:
            "breeder",

        مادر:
            "breeder",

        parent:
            "breeder",

        parentstock:
            "breeder",

        layer:
            "layer",

        layers:
            "layer",

        تخمگذار:
            "layer",

        تخم‌گذار:
            "layer",

        pullet:
            "pullet",

        پولت:
            "pullet"

    };

    return (
        aliases[value] ||
        value ||
        null
    );

}


/* =========================================================
   NORMALIZE GENETIC NAME
========================================================= */

function normalizeStandardName(
    value
) {

    return String(
        value || ""
    )

        .trim()

        .toLowerCase()

        .replace(
            /[_\-]+/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        );

}


/* =========================================================
   ROUNDING
========================================================= */

function roundStandardValue(
    value,
    decimals = 2
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(
            number
        )
    ) {

        return null;

    }

    const factor =
        Math.pow(
            10,
            decimals
        );

    return (
        Math.round(
            number *
            factor
        ) /
        factor
    );

}


/* =========================================================
   STANDARD DATA SOURCE
========================================================= */

function getVerifiedStandardDatabase() {

    if (
        typeof VERIFIED_STANDARDS !==
        "undefined"
    ) {

        return VERIFIED_STANDARDS;

    }

    return {};

}


/* =========================================================
   GET RAW STANDARD
========================================================= */

function getRawStandard(
    type,
    geneticsId,
    strain
) {

    const normalizedType =
        normalizeProductionType(
            type
        );

    const database =
        getVerifiedStandardDatabase();

    if (
        !normalizedType ||
        !database[normalizedType]
    ) {

        return null;

    }


    const typeDatabase =
        database[
            normalizedType
        ];


    let geneticData =
        typeDatabase[
            geneticsId
        ];


    /*
     * Backward compatibility:
     * resolve genetics by strain name.
     */

    if (
        !geneticData
    ) {

        const target =
            normalizeStandardName(
                strain ||
                geneticsId
            );

        for (
            const geneticKey of
            Object.keys(
                typeDatabase
            )
        ) {

            const candidate =
                typeDatabase[
                    geneticKey
                ];

            if (
                candidate &&
                candidate[
                    strain
                ]
            ) {

                geneticData =
                    candidate;

                break;

            }


            if (
                candidate &&
                typeof candidate ===
                    "object"
            ) {

                const productKey =
                    Object.keys(
                        candidate
                    )
                    .find(
                        key =>
                            normalizeStandardName(
                                key
                            ) ===
                            target
                    );

                if (
                    productKey
                ) {

                    geneticData =
                        candidate;

                    break;

                }

            }

        }

    }


    if (
        !geneticData
    ) {

        return null;

    }


    const targetStrain =
        strain ||
        geneticsId;


    return (
        geneticData[
            targetStrain
        ] ||
        null
    );

}


/* =========================================================
   PUBLIC STANDARD LOOKUP
========================================================= */

function getStandard(
    type,
    geneticsId,
    strain
) {

    return getRawStandard(
        type,
        geneticsId,
        strain
    );

}


/* =========================================================
   GET STANDARD RECORDS
========================================================= */

function getStandardRecords(
    type,
    geneticsId,
    strain
) {

    const standard =
        getStandard(
            type,
            geneticsId,
            strain
        );

    if (
        !standard ||
        !Array.isArray(
            standard.records
        )
    ) {

        return [];

    }

    return standard.records
        .filter(
            record =>
                record &&
                Number.isFinite(
                    Number(
                        record.ageDays
                    )
                )
        )
        .map(
            record => ({
                ...record,

                ageDays:
                    Number(
                        record.ageDays
                    )
            })
        )
        .sort(
            (
                a,
                b
            ) =>
                a.ageDays -
                b.ageDays
        );

}


/* =========================================================
   GET STANDARD AGE RANGE
========================================================= */

function getStandardAgeRange(
    standard
) {

    if (
        !standard ||
        !Array.isArray(
            standard.records
        ) ||
        !standard.records.length
    ) {

        return null;

    }

    const records =
        standard.records
            .filter(
                item =>
                    Number.isFinite(
                        Number(
                            item.ageDays
                        )
                    )
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(a.ageDays) -
                    Number(b.ageDays)
            );

    if (
        !records.length
    ) {

        return null;

    }

    return {

        min:
            Number(
                records[0].ageDays
            ),

        max:
            Number(
                records[
                    records.length - 1
                ].ageDays
            )

    };

}


/* =========================================================
   GET STANDARD VALUE AT AGE
   ---------------------------------------------------------
   IMPORTANT:
   No extrapolation outside official data.
========================================================= */

function getStandardValueAtAge(
    standard,
    metric,
    ageDays
) {

    if (
        !standard ||
        !Array.isArray(
            standard.records
        )
    ) {

        return null;

    }


    const age =
        Number(
            ageDays
        );


    if (
        !Number.isFinite(
            age
        )
    ) {

        return null;

    }


    const records =
        standard.records

            .map(
                record => ({

                    age:
                        Number(
                            record.ageDays
                        ),

                    value:
                        Number(
                            record[
                                metric
                            ]
                        )

                })
            )

            .filter(
                item =>

                    Number.isFinite(
                        item.age
                    ) &&

                    Number.isFinite(
                        item.value
                    )
            )

            .sort(
                (
                    a,
                    b
                ) =>
                    a.age -
                    b.age
            );


    if (
        !records.length
    ) {

        return null;

    }


    /*
     * Never extrapolate.
     */

    if (
        age <
        records[0].age ||
        age >
        records[
            records.length - 1
        ].age
    ) {

        return null;

    }


    /*
     * Exact documented age.
     */

    const exact =
        records.find(
            item =>
                item.age ===
                age
        );


    if (
        exact
    ) {

        return exact.value;

    }


    /*
     * Linear interpolation.
     */

    for (
        let i = 1;
        i < records.length;
        i++
    ) {

        const previous =
            records[i - 1];

        const next =
            records[i];


        if (
            age >= previous.age &&
            age <= next.age
        ) {

            const distance =
                next.age -
                previous.age;


            if (
                distance <= 0
            ) {

                return previous.value;

            }


            const ratio =
                (
                    age -
                    previous.age
                ) /
                distance;


            return roundStandardValue(

                previous.value +

                (
                    next.value -
                    previous.value
                ) *
                ratio,

                3

            );

        }

    }


    return null;

}


/* =========================================================
   GET COMPLETE STANDARD AT AGE
========================================================= */

function getStandardAtAge(
    type,
    geneticsId,
    strain,
    ageDays
) {

    const standard =
        getStandard(
            type,
            geneticsId,
            strain
        );


    if (
        !standard
    ) {

        return null;

    }


    const result = {

        ageDays:
            Number(
                ageDays
            ),

        bodyWeight:
            getStandardValueAtAge(
                standard,
                "bodyWeight",
                ageDays
            ),

        dailyGain:
            getStandardValueAtAge(
                standard,
                "dailyGain",
                ageDays
            ),

        dailyFeed:
            getStandardValueAtAge(
                standard,
                "dailyFeed",
                ageDays
            ),

        cumulativeFeed:
            getStandardValueAtAge(
                standard,
                "cumulativeFeed",
                ageDays
            ),

        fcr:
            getStandardValueAtAge(
                standard,
                "fcr",
                ageDays
            ),

        mortality:
            getStandardValueAtAge(
                standard,
                "mortality",
                ageDays
            ),

        livability:
            getStandardValueAtAge(
                standard,
                "livability",
                ageDays
            ),

        uniformity:
            getStandardValueAtAge(
                standard,
                "uniformity",
                ageDays
            ),

        eggProduction:
            getStandardValueAtAge(
                standard,
                "eggProduction",
                ageDays
            ),

        eggWeight:
            getStandardValueAtAge(
                standard,
                "eggWeight",
                ageDays
            ),

        eggMass:
            getStandardValueAtAge(
                standard,
                "eggMass",
                ageDays
            ),

        cumulativeEggs:
            getStandardValueAtAge(
                standard,
                "cumulativeEggs",
                ageDays
            ),

        fertility:
            getStandardValueAtAge(
                standard,
                "fertility",
                ageDays
            ),

        hatchability:
            getStandardValueAtAge(
                standard,
                "hatchability",
                ageDays
            )

    };


    /*
     * Remove unavailable metrics.
     */

    Object.keys(
        result
    ).forEach(
        key => {

            if (
                key !==
                    "ageDays" &&

                result[key] ===
                    null
            ) {

                delete result[key];

            }

        }
    );


    return result;

}


/* =========================================================
   ACTUAL VALUE NORMALIZATION
========================================================= */

function toFiniteNumber(
    value
) {

    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number
        : null;

}


/* =========================================================
   COMPARE ACTUAL WITH STANDARD
========================================================= */

function compareStandardValue(
    actual,
    standard,
    metric,
    tolerancePercent =
        STANDARD_ENGINE_CONFIG
            .comparisonTolerancePercent
) {

    const actualValue =
        toFiniteNumber(
            actual
        );

    const standardValue =
        toFiniteNumber(
            standard
        );


    if (
        actualValue ===
            null ||

        standardValue ===
            null ||

        standardValue ===
            0
    ) {

        return {

            actual:
                actualValue,

            standard:
                standardValue,

            difference:
                null,

            percentage:
                null,

            status:
                "no-standard",

            metric

        };

    }


    const difference =
        actualValue -
        standardValue;


    const percentage =
        (
            difference /
            standardValue
        ) *
        100;


    /*
     * Generic comparison status.
     *
     * Direction is interpreted later according
     * to metric definition.
     */

    let status =
        "within-range";


    if (
        percentage >
        tolerancePercent
    ) {

        status =
            "above";

    }
    else if (
        percentage <
        -tolerancePercent
    ) {

        status =
            "below";

    }


    return {

        actual:
            roundStandardValue(
                actualValue,
                3
            ),

        standard:
            roundStandardValue(
                standardValue,
                3
            ),

        difference:
            roundStandardValue(
                difference,
                3
            ),

        percentage:
            roundStandardValue(
                percentage,
                2
            ),

        status,

        metric

    };

}


/* =========================================================
   METRIC DIRECTION
   ---------------------------------------------------------
   Important for FCR and mortality:
   lower is better.

   Weight:
   cannot automatically classify as good/bad because
   deviation from target can be either direction.
========================================================= */

function getMetricDefinition(
    type,
    metric
) {

    const normalizedType =
        normalizeProductionType(
            type
        );

    return (
        STANDARD_METRICS[
            normalizedType
        ]?.[
            metric
        ] ||
        null
    );

}


/* =========================================================
   INTERPRET PERFORMANCE
========================================================= */

function interpretStandardComparison(
    type,
    metric,
    comparison
) {

    if (
        !comparison ||
        comparison.status ===
            "no-standard"
    ) {

        return {

            status:
                "no-standard",

            label:
                "استاندارد موجود نیست"

        };

    }


    const definition =
        getMetricDefinition(
            type,
            metric
        );


    if (
        !definition
    ) {

        return {

            status:
                comparison.status,

            label:
                "قابل مقایسه"

        };

    }


    /*
     * FCR / mortality / feed:
     * below standard is generally favorable.
     */

    if (
        definition.higherIsBetter ===
        false
    ) {

        if (
            comparison.status ===
            "below"
        ) {

            return {

                status:
                    "better",

                label:
                    "بهتر از استاندارد"

            };

        }


        if (
            comparison.status ===
            "above"
        ) {

            return {

                status:
                    "worse",

                label:
                    "ضعیف‌تر از استاندارد"

            };

        }

    }


    /*
     * Livability / uniformity /
     * egg production:
     * above standard is favorable.
     */

    if (
        definition.higherIsBetter ===
        true
    ) {

        if (
            comparison.status ===
            "above"
        ) {

            return {

                status:
                    "better",

                label:
                    "بهتر از استاندارد"

            };

        }


        if (
            comparison.status ===
            "below"
        ) {

            return {

                status:
                    "worse",

                label:
                    "ضعیف‌تر از استاندارد"

            };

        }

    }


    return {

        status:
            "within-range",

        label:
            "در محدوده استاندارد"

    };

}


/* =========================================================
   BUILD METRIC COMPARISON
========================================================= */

function buildMetricComparison(
    type,
    metric,
    actual,
    standard
) {

    const comparison =
        compareStandardValue(
            actual,
            standard,
            metric
        );


    const interpretation =
        interpretStandardComparison(
            type,
            metric,
            comparison
        );


    return {

        ...comparison,

        ...interpretation

    };

}


/* =========================================================
   BUILD WEEKLY STANDARD COMPARISON
========================================================= */

function buildWeeklyStandardComparison(
    type,
    geneticsId,
    strain,
    ageDays,
    actualMetrics = {}
) {

    const standard =
        getStandardAtAge(
            type,
            geneticsId,
            strain,
            ageDays
        );


    if (
        !standard
    ) {

        return {

            available:
                false,

            ageDays:
                Number(ageDays),

            standard:
                null,

            comparisons:
                {},

            message:
                "برای این ژنتیک و سن، استاندارد عددی معتبر ثبت نشده است."

        };

    }


    const comparisons = {};


    Object.keys(
        actualMetrics
    )
    .forEach(
        metric => {

            const actual =
                actualMetrics[
                    metric
                ];

            const target =
                standard[
                    metric
                ];


            comparisons[
                metric
            ] =
                buildMetricComparison(
                    type,
                    metric,
                    actual,
                    target
                );

        }
    );


    return {

        available:
            true,

        ageDays:
            Number(ageDays),

        standard,

        comparisons

    };

}


/* =========================================================
   FCR CALCULATION
   ---------------------------------------------------------
   BROILER FCR

   FCR =
       feed consumed / live-weight gain

   For a flock:

       Feed kg
       ----------------
       Live weight gain kg

   Weight gain is based on flock live biomass.

   ---------------------------------------------------------

   IMPORTANT:

   Do NOT calculate FCR from only one bird's
   current weight.

   The correct weekly flock calculation requires:

       opening bird count
       closing bird count
       opening average weight
       closing average weight
       feed consumed during period

========================================================= */

function calculateBroilerFCR({
    feedKg,
    openingBirds,
    closingBirds,
    openingAverageWeightG,
    closingAverageWeightG
} = {}) {

    const feed =
        toFiniteNumber(
            feedKg
        );

    const openingCount =
        toFiniteNumber(
            openingBirds
        );

    const closingCount =
        toFiniteNumber(
            closingBirds
        );

    const openingWeight =
        toFiniteNumber(
            openingAverageWeightG
        );

    const closingWeight =
        toFiniteNumber(
            closingAverageWeightG
        );


    if (
        feed === null ||
        openingCount === null ||
        closingCount === null ||
        openingWeight === null ||
        closingWeight === null
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "اطلاعات کافی برای محاسبه FCR وجود ندارد."

        };

    }


    if (
        feed < 0 ||
        openingCount <= 0 ||
        closingCount <= 0 ||
        openingWeight < 0 ||
        closingWeight <= 0
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "مقادیر ورودی FCR معتبر نیستند."

        };

    }


    /*
     * Opening biomass.
     */

    const openingBiomassKg =
        (
            openingCount *
            openingWeightG
        ) /
        1000;


    /*
     * Closing biomass.
     */

    const closingBiomassKg =
        (
            closingCount *
            closingWeight
        ) /
        1000;


    const weightGainKg =
        closingBiomassKg -
        openingBiomassKg;


    if (
        weightGainKg <= 0
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "افزایش زیست‌توده مثبت نیست؛ FCR قابل محاسبه نیست.",

            openingBiomassKg,

            closingBiomassKg,

            weightGainKg

        };

    }


    const fcr =
        feed /
        weightGainKg;


    return {

        value:
            roundStandardValue(
                fcr,
                STANDARD_ENGINE_CONFIG
                    .fcrPrecision
            ),

        valid:
            Number.isFinite(
                fcr
            ),

        feedKg:
            roundStandardValue(
                feed,
                3
            ),

        openingBiomassKg:
            roundStandardValue(
                openingBiomassKg,
                3
            ),

        closingBiomassKg:
            roundStandardValue(
                closingBiomassKg,
                3
            ),

        weightGainKg:
            roundStandardValue(
                weightGainKg,
                3
            )

    };

}


/* =========================================================
   FCR USING FEED PER BIRD
   ---------------------------------------------------------
   Useful when only average feed/bird/day is available.

   This is a secondary calculation path.

   It must be labelled as estimated unless actual
   flock feed consumption is available.
========================================================= */

function calculateFCRFromFeedPerBird({
    feedPerBirdPerDayG,
    days,
    openingAverageWeightG,
    closingAverageWeightG
} = {}) {

    const feedPerBird =
        toFiniteNumber(
            feedPerBirdPerDayG
        );

    const numberOfDays =
        toFiniteNumber(
            days
        );

    const openingWeight =
        toFiniteNumber(
            openingAverageWeightG
        );

    const closingWeight =
        toFiniteNumber(
            closingAverageWeightG
        );


    if (
        feedPerBird === null ||
        numberOfDays === null ||
        openingWeight === null ||
        closingWeight === null
    ) {

        return {

            value:
                null,

            valid:
                false,

            estimated:
                true,

            reason:
                "اطلاعات کافی برای محاسبه FCR وجود ندارد."

        };

    }


    const feedConsumedG =
        feedPerBird *
        numberOfDays;


    const gainG =
        closingWeight -
        openingWeight;


    if (
        gainG <= 0
    ) {

        return {

            value:
                null,

            valid:
                false,

            estimated:
                true,

            reason:
                "افزایش وزن مثبت نیست."

        };

    }


    const fcr =
        feedConsumedG /
        gainG;


    return {

        value:
            roundStandardValue(
                fcr,
                STANDARD_ENGINE_CONFIG
                    .fcrPrecision
            ),

        valid:
            Number.isFinite(
                fcr
            ),

        estimated:
            true,

        feedConsumedG:
            roundStandardValue(
                feedConsumedG,
                2
            ),

        weightGainG:
            roundStandardValue(
                gainG,
                2
            )

    };

}


/* =========================================================
   LAYER FCR
   ---------------------------------------------------------
   Layer FCR is NOT the same as broiler FCR.

   FCR =
       kg feed
       -------------------------
       kg egg mass

   Egg mass:

       egg production fraction
       × average egg weight
========================================================= */

function calculateLayerFCR({
    feedKg,
    eggsProduced,
    averageEggWeightG
} = {}) {

    const feed =
        toFiniteNumber(
            feedKg
        );

    const eggs =
        toFiniteNumber(
            eggsProduced
        );

    const eggWeight =
        toFiniteNumber(
            averageEggWeightG
        );


    if (
        feed === null ||
        eggs === null ||
        eggWeight === null
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "اطلاعات کافی برای FCR تخمگذار وجود ندارد."

        };

    }


    if (
        feed < 0 ||
        eggs < 0 ||
        eggWeight <= 0
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "مقادیر FCR تخمگذار معتبر نیستند."

        };

    }


    /*
     * Egg mass in kg.
     */

    const eggMassKg =
        (
            eggs *
            eggWeight
        ) /
        1000;


    if (
        eggMassKg <= 0
    ) {

        return {

            value:
                null,

            valid:
                false,

            reason:
                "Egg Mass مثبت نیست."

        };

    }


    const fcr =
        feed /
        eggMassKg;


    return {

        value:
            roundStandardValue(
                fcr,
                STANDARD_ENGINE_CONFIG
                    .fcrPrecision
            ),

        valid:
            Number.isFinite(
                fcr
            ),

        feedKg:
            roundStandardValue(
                feed,
                3
            ),

        eggMassKg:
            roundStandardValue(
                eggMassKg,
                3
            )

    };

}


/* =========================================================
   BREEDER FEED / EGG MASS SUPPORT
========================================================= */

function calculateEggMass({
    eggProductionPercent,
    averageEggWeightG
} = {}) {

    const production =
        toFiniteNumber(
            eggProductionPercent
        );

    const eggWeight =
        toFiniteNumber(
            averageEggWeightG
        );


    if (
        production === null ||
        eggWeight === null
    ) {

        return null;

    }


    if (
        production < 0 ||
        production > 100 ||
        eggWeight <= 0
    ) {

        return null;

    }


    /*
     * Example:
     *
     * 90% production × 60g egg
     * = 54g egg mass / hen / day
     */

    return roundStandardValue(

        (
            production /
            100
        ) *
        eggWeight,

        2

    );

}


/* =========================================================
   WEEKLY FCR RESULT
========================================================= */

function buildFCRComparison(
    productionType,
    actualFCR,
    standardFCR
) {

    const type =
        normalizeProductionType(
            productionType
        );


    if (
        actualFCR === null ||
        actualFCR === undefined
    ) {

        return {

            available:
                false,

            actual:
                null,

            standard:
                toFiniteNumber(
                    standardFCR
                ),

            difference:
                null,

            percentage:
                null,

            status:
                "no-actual"

        };

    }


    if (
        standardFCR === null ||
        standardFCR === undefined
    ) {

        return {

            available:
                true,

            actual:
                roundStandardValue(
                    actualFCR,
                    3
                ),

            standard:
                null,

            difference:
                null,

            percentage:
                null,

            status:
                "no-standard"

        };

    }


    const comparison =
        buildMetricComparison(
            type,
            "fcr",
            actualFCR,
            standardFCR
        );


    return {

        available:
            true,

        ...comparison

    };

}


/* =========================================================
   STANDARD SOURCE VALIDATION
========================================================= */

function validateStandardSource(
    standard
) {

    const errors = [];


    if (
        !standard
    ) {

        return {

            valid:
                false,

            errors: [
                "Standard record is missing."
            ]

        };

    }


    if (
        !standard.sourceYear
    ) {

        errors.push(
            "sourceYear is missing."
        );

    }


    if (
        !standard.sourceStatus
    ) {

        errors.push(
            "sourceStatus is missing."
        );

    }


    if (
        !Array.isArray(
            standard.records
        )
    ) {

        errors.push(
            "records array is missing."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   VALIDATE STANDARD RECORDS
========================================================= */

function validateStandardRecords(
    standard
) {

    const errors = [];


    if (
        !standard
    ) {

        return {

            valid:
                false,

            errors: [
                "Standard does not exist."
            ]

        };

    }


    if (
        !Array.isArray(
            standard.records
        )
    ) {

        return {

            valid:
                false,

            errors: [
                "records must be an array."
            ]

        };

    }


    let previousAge =
        null;


    standard.records.forEach(
        (
            record,
            index
        ) => {

            const age =
                Number(
                    record.ageDays
                );


            if (
                !Number.isFinite(
                    age
                )
            ) {

                errors.push(
                    `Record ${index + 1}: invalid ageDays.`
                );

                return;

            }


            if (
                previousAge !==
                    null &&
                age <= previousAge
            ) {

                errors.push(
                    `Record ${index + 1}: ageDays must be strictly increasing.`
                );

            }


            previousAge =
                age;


            Object.keys(
                record
            )
            .forEach(
                key => {

                    if (
                        key ===
                        "ageDays"
                    ) {

                        return;

                    }


                    const value =
                        record[
                            key
                        ];


                    if (
                        value ===
                            null ||
                        value ===
                            undefined ||
                        value ===
                            ""
                    ) {

                        return;

                    }


                    if (
                        !Number.isFinite(
                            Number(
                                value
                            )
                        )
                    ) {

                        errors.push(
                            `Record ${index + 1}: ${key} is not numeric.`
                        );

                    }

                }
            );

        }
    );


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   FIND ALL AVAILABLE STANDARD PRODUCTS
========================================================= */

function listAvailableStandards(
    type
) {

    const normalizedType =
        normalizeProductionType(
            type
        );


    const database =
        getVerifiedStandardDatabase();


    const typeDatabase =
        database[
            normalizedType
        ];


    if (
        !typeDatabase
    ) {

        return [];

    }


    const result = [];


    Object.keys(
        typeDatabase
    )
    .forEach(
        geneticsId => {

            const genetics =
                typeDatabase[
                    geneticsId
                ];


            if (
                !genetics ||
                typeof genetics !==
                    "object"
            ) {

                return;

            }


            Object.keys(
                genetics
            )
            .forEach(
                strain => {

                    const standard =
                        genetics[
                            strain
                        ];


                    if (
                        !standard ||
                        !Array.isArray(
                            standard.records
                        )
                    ) {

                        return;

                    }


                    result.push({

                        type:
                            normalizedType,

                        geneticsId,

                        strain,

                        sourceYear:
                            standard.sourceYear ||
                            null,

                        sourceStatus:
                            standard.sourceStatus ||
                            null,

                        recordCount:
                            standard.records.length,

                        ageRange:
                            getStandardAgeRange(
                                standard
                            )

                    });

                }
            );

        }
    );


    return result;

}


/* =========================================================
   GET STANDARD FOR CURRENT FLOCK
   ---------------------------------------------------------
   Compatibility function used by weekly-engine.js.
========================================================= */

function getStandardForCurrentFlock(
    flock
) {

    if (
        !flock
    ) {

        return null;

    }


    const type =
        normalizeProductionType(

            flock.productionType ||

            flock.type ||

            flock.production_type

        );


    const geneticsId =
        flock.geneticsId ||

        flock.genetics ||

        flock.geneticId ||

        null;


    const strain =
        flock.strain ||

        flock.geneticStrain ||

        flock.geneticsName ||

        null;


    return getStandard(
        type,
        geneticsId,
        strain
    );

}


/* =========================================================
   BUILD REPORT STANDARD LINE
   ---------------------------------------------------------
   Used for charts.

   IMPORTANT:
   Missing standard = null.

   We never replace it with zero.
========================================================= */

function buildStandardSeries(
    type,
    geneticsId,
    strain,
    ages,
    metric = "bodyWeight"
) {

    const standard =
        getStandard(
            type,
            geneticsId,
            strain
        );


    if (
        !standard ||
        !Array.isArray(
            ages
        )
    ) {

        return [];

    }


    return ages.map(
        age => ({

            ageDays:
                Number(age),

            value:
                getStandardValueAtAge(
                    standard,
                    metric,
                    age
                )

        })
    );

}


/* =========================================================
   BUILD ACTUAL VS STANDARD SERIES
========================================================= */

function buildActualVsStandardSeries(
    type,
    geneticsId,
    strain,
    actualRecords,
    metric = "bodyWeight"
) {

    if (
        !Array.isArray(
            actualRecords
        )
    ) {

        return [];

    }


    const standard =
        getStandard(
            type,
            geneticsId,
            strain
        );


    return actualRecords.map(
        record => {

            const age =
                Number(
                    record.ageDays ??
                    record.age ??
                    record.days
                );


            const actual =
                toFiniteNumber(
                    record[
                        metric
                    ]
                );


            const standardValue =
                standard
                    ? getStandardValueAtAge(
                        standard,
                        metric,
                        age
                    )
                    : null;


            return {

                ageDays:
                    Number.isFinite(
                        age
                    )
                        ? age
                        : null,

                actual,

                standard:
                    standardValue,

                difference:
                    actual !== null &&
                    standardValue !== null
                        ? roundStandardValue(
                            actual -
                            standardValue,
                            3
                        )
                        : null,

                differencePercent:
                    actual !== null &&
                    standardValue !== null &&
                    standardValue !== 0
                        ? roundStandardValue(
                            (
                                (
                                    actual -
                                    standardValue
                                ) /
                                standardValue
                            ) *
                            100,
                            2
                        )
                        : null

            };

        }
    );

}


/* =========================================================
   DATABASE STATUS
========================================================= */

function getStandardsDatabaseStatus() {

    const result = {

        engineVersion:
            STANDARD_ENGINE_CONFIG
                .version,

        productionTypes:
            [],

        availableStandards:
            {},

        totalStandardPrograms:
            0

    };


    [
        "broiler",
        "breeder",
        "layer",
        "pullet"
    ]
    .forEach(
        type => {

            const items =
                listAvailableStandards(
                    type
                );


            result.productionTypes
                .push(type);


            result.availableStandards[
                type
            ] =
                items;


            result.totalStandardPrograms +=
                items.length;

        }
    );


    return result;

}


/* =========================================================
   BACKWARD COMPATIBILITY
========================================================= */

/*
 * Existing code in the project already uses:
 *
 *     getProduct()
 *     hasOfficialDocumentation()
 *     compareMetric()
 *     validateStandardRecord()
 *
 * Keep these functions available.
 */


/* ---------------------------------------------------------
   GET PRODUCT
--------------------------------------------------------- */

function getProduct(
    type,
    genetics,
    product
) {

    try {

        const normalizedType =
            normalizeProductionType(
                type
            );


        /*
         * First try the old POULTRY_STANDARDS
         * structure if it exists.
         */

        if (
            typeof POULTRY_STANDARDS !==
            "undefined"
        ) {

            const typeNode =
                POULTRY_STANDARDS[
                    normalizedType
                ];


            const commercial =
                typeNode
                    ?.categories
                    ?.commercial;


            const geneticNode =
                commercial
                    ?.genetics
                    ?.[genetics];


            return (
                geneticNode
                    ?.products
                    ?.[product]
                ||
                null
            );

        }


    }
    catch (
        error
    ) {

        console.warn(
            "getProduct:",
            error
        );

    }


    return null;

}


/* ---------------------------------------------------------
   OFFICIAL DOCUMENTATION CHECK
--------------------------------------------------------- */

function hasOfficialDocumentation(
    type,
    genetics,
    product
) {

    const productData =
        getProduct(
            type,
            genetics,
            product
        );


    return Boolean(
        productData &&
        productData
            .officialDocumentation ===
            true
    );

}


/* ---------------------------------------------------------
   GENERIC COMPARE METRIC
--------------------------------------------------------- */

function compareMetric(
    actual,
    standard
) {

    return compareStandardValue(
        null,
        actual,
        standard
    );

}


/* ---------------------------------------------------------
   VALIDATE STANDARD RECORD
--------------------------------------------------------- */

function validateStandardRecord(
    record
) {

    if (
        !record
    ) {

        return {

            valid:
                false,

            errors: [
                "Standard record is missing."
            ]

        };

    }


    const errors = [];


    if (
        !record.sourceYear &&
        !record.version
    ) {

        errors.push(
            "Standard source year/version is missing."
        );

    }


    if (
        !record.sourceStatus &&
        !record.source
    ) {

        errors.push(
            "Standard source information is missing."
        );

    }


    if (
        !Array.isArray(
            record.records
        )
    ) {

        errors.push(
            "Standard records array is missing."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   STANDARD DATABASE POLICY
========================================================= */

const STANDARD_DATABASE_POLICY = {

    numericValuesMayBeAddedOnlyIf: [

        "officialPerformanceObjective",

        "officialManagementGuide",

        "officialParentStockGuide",

        "officialRegionalGuide",

        "officialLayerGuide",

        "officialBreederGuide",

        "officialPulletGuide",

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


    neverExtrapolateOutsideDocumentedAge:
        true,


    preservePreviousVersions:
        true,


    preserveRegionalVersions:
        true,


    preserveHistoricalRecords:
        true,


    preserveSourceDocument:
        true,


    preserveSourceYear:
        true

};


/* =========================================================
   GLOBAL EXPORTS
========================================================= */

if (
    typeof window !==
    "undefined"
) {

    window.STANDARD_ENGINE_CONFIG =
        STANDARD_ENGINE_CONFIG;

    window.STANDARD_METRICS =
        STANDARD_METRICS;

    window.STANDARD_DATABASE_POLICY =
        STANDARD_DATABASE_POLICY;


    window.normalizeProductionType =
        normalizeProductionType;

    window.normalizeStandardName =
        normalizeStandardName;


    window.getStandard =
        getStandard;

    window.getRawStandard =
        getRawStandard;

    window.getStandardRecords =
        getStandardRecords;

    window.getStandardAgeRange =
        getStandardAgeRange;

    window.getStandardValueAtAge =
        getStandardValueAtAge;

    window.getStandardAtAge =
        getStandardAtAge;


    window.buildWeeklyStandardComparison =
        buildWeeklyStandardComparison;

    window.buildMetricComparison =
        buildMetricComparison;

    window.compareStandardValue =
        compareStandardValue;

    window.interpretStandardComparison =
        interpretStandardComparison;


    window.calculateBroilerFCR =
        calculateBroilerFCR;

    window.calculateFCRFromFeedPerBird =
        calculateFCRFromFeedPerBird;

    window.calculateLayerFCR =
        calculateLayerFCR;

    window.calculateEggMass =
        calculateEggMass;

    window.buildFCRComparison =
        buildFCRComparison;


    window.validateStandardSource =
        validateStandardSource;

    window.validateStandardRecords =
        validateStandardRecords;

    window.listAvailableStandards =
        listAvailableStandards;

    window.getStandardForCurrentFlock =
        getStandardForCurrentFlock;

    window.buildStandardSeries =
        buildStandardSeries;

    window.buildActualVsStandardSeries =
        buildActualVsStandardSeries;

    window.getStandardsDatabaseStatus =
        getStandardsDatabaseStatus;


    window.getProduct =
        getProduct;

    window.hasOfficialDocumentation =
        hasOfficialDocumentation;

    window.compareMetric =
        compareMetric;

    window.validateStandardRecord =
        validateStandardRecord;

}


/* =========================================================
   END OF STANDARDS ENGINE
========================================================= */
