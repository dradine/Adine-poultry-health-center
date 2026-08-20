"use strict";

/* =========================================================
   ADINEH POULTRY HEALTH CENTER
   STANDARD ENGINE
   =========================================================

   This file handles:
   - Standard lookup
   - Age interpolation
   - Actual vs standard comparison
   - FCR calculation
   - Weekly comparison
   - Standard validation

========================================================= */


/* =========================================================
   ENGINE CONFIG
========================================================= */

const STANDARD_ENGINE_CONFIG = {

    version: "3.0",

    allowExtrapolation: false,

    interpolation: "linear",

    tolerancePercent: 5,

    fcrDecimals: 3,

    weightDecimals: 0,

    percentageDecimals: 2

};


/* =========================================================
   PRODUCTION TYPE NORMALIZATION
========================================================= */

function normalizeProductionType(type) {

    const value =
        String(type || "")
            .trim()
            .toLowerCase();

    const aliases = {

        broiler: "broiler",
        meat: "broiler",
        گوشتی: "broiler",

        breeder: "breeder",
        parent: "breeder",
        parentstock: "breeder",
        مادر: "breeder",

        layer: "layer",
        layers: "layer",
        تخمگذار: "layer",
        "تخم‌گذار": "layer",

        pullet: "pullet",
        پولت: "pullet"

    };

    return aliases[value] || value || null;
}


/* =========================================================
   NUMBER HELPERS
========================================================= */

function toFiniteNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}


function roundValue(value, decimals = 2) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return null;
    }

    const factor =
        Math.pow(10, decimals);

    return (
        Math.round(number * factor) /
        factor
    );
}


/* =========================================================
   GET STANDARD
========================================================= */

function getStandard(
    type,
    geneticsId,
    strain
) {

    const normalizedType =
        normalizeProductionType(type);

    if (
        typeof VERIFIED_STANDARDS ===
        "undefined"
    ) {
        return null;
    }

    const typeData =
        VERIFIED_STANDARDS[
            normalizedType
        ];

    if (!typeData) {
        return null;
    }

    let geneticsData =
        typeData[geneticsId];

    /*
     * Try to resolve genetics by strain.
     */

    if (!geneticsData && strain) {

        const target =
            String(strain)
                .trim()
                .toLowerCase();

        const match =
            Object.keys(typeData)
                .find(id => {

                    const item =
                        typeData[id];

                    return Object.keys(item)
                        .some(name =>
                            String(name)
                                .trim()
                                .toLowerCase() ===
                            target
                        );

                });

        if (match) {
            geneticsData =
                typeData[match];
        }
    }

    if (!geneticsData) {
        return null;
    }

    if (strain) {

        return (
            geneticsData[strain] ||
            geneticsData[
                Object.keys(geneticsData)
                    .find(name =>
                        String(name)
                            .trim()
                            .toLowerCase() ===
                        String(strain)
                            .trim()
                            .toLowerCase()
                    )
            ] ||
            null
        );

    }

    /*
     * If only one strain exists,
     * return it.
     */

    const strains =
        Object.keys(geneticsData);

    if (strains.length === 1) {
        return geneticsData[strains[0]];
    }

    return null;
}


/* =========================================================
   GET RECORDS
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
        .filter(record =>
            Number.isFinite(
                Number(record.ageDays)
            )
        )
        .sort(
            (a, b) =>
                Number(a.ageDays) -
                Number(b.ageDays)
        );
}


/* =========================================================
   STANDARD AGE RANGE
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
            .filter(record =>
                Number.isFinite(
                    Number(record.ageDays)
                )
            )
            .sort(
                (a, b) =>
                    Number(a.ageDays) -
                    Number(b.ageDays)
            );

    if (!records.length) {
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
   VALUE AT AGE
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
        Number(ageDays);

    if (!Number.isFinite(age)) {
        return null;
    }

    const points =
        standard.records
            .map(record => ({

                age:
                    Number(
                        record.ageDays
                    ),

                value:
                    Number(
                        record[metric]
                    )

            }))
            .filter(point =>
                Number.isFinite(point.age) &&
                Number.isFinite(point.value)
            )
            .sort(
                (a, b) =>
                    a.age - b.age
            );

    if (!points.length) {
        return null;
    }

    /*
     * Never extrapolate.
     */

    if (
        age < points[0].age ||
        age > points[points.length - 1].age
    ) {
        return null;
    }

    /*
     * Exact point.
     */

    const exact =
        points.find(
            point =>
                point.age === age
        );

    if (exact) {
        return exact.value;
    }

    /*
     * Linear interpolation.
     */

    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        const previous =
            points[i - 1];

        const next =
            points[i];

        if (
            age >= previous.age &&
            age <= next.age
        ) {

            const denominator =
                next.age -
                previous.age;

            if (denominator <= 0) {
                return previous.value;
            }

            const ratio =
                (
                    age -
                    previous.age
                ) /
                denominator;

            return roundValue(
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
   COMPLETE STANDARD AT AGE
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

    if (!standard) {
        return null;
    }

    const metrics = {

        bodyWeight:
            "bodyWeight",

        dailyGain:
            "dailyGain",

        dailyFeed:
            "dailyFeed",

        cumulativeFeed:
            "cumulativeFeed",

        fcr:
            "fcr",

        mortality:
            "mortality",

        livability:
            "livability",

        uniformity10:
            "uniformity10",

        uniformity15:
            "uniformity15",

        cv:
            "cv",

        dailyWater:
            "dailyWater",

        eggProduction:
            "eggProduction",

        henDayProduction:
            "henDayProduction",

        eggWeight:
            "eggWeight",

        eggMass:
            "eggMass",

        cumulativeEggs:
            "cumulativeEggs",

        fertility:
            "fertility",

        hatchability:
            "hatchability"

    };

    const result = {

        ageDays:
            Number(ageDays)

    };

    Object.keys(metrics)
        .forEach(key => {

            const value =
                getStandardValueAtAge(
                    standard,
                    metrics[key],
                    ageDays
                );

            if (value !== null) {
                result[key] = value;
            }

        });

    return result;
}


/* =========================================================
   ACTUAL VS STANDARD
========================================================= */

function compareStandardValue(
    actual,
    standard,
    metric
) {

    const actualValue =
        toFiniteNumber(actual);

    const standardValue =
        toFiniteNumber(standard);

    if (
        actualValue === null ||
        standardValue === null
    ) {

        return {

            actual: actualValue,

            standard: standardValue,

            difference: null,

            differencePercent: null,

            status: "no-standard"

        };
    }

    const difference =
        actualValue -
        standardValue;

    const differencePercent =
        standardValue !== 0
            ? (
                difference /
                standardValue
            ) * 100
            : null;

    let status =
        "within-range";

    if (
        differencePercent !== null &&
        differencePercent >
            STANDARD_ENGINE_CONFIG
                .tolerancePercent
    ) {
        status = "above";
    }
    else if (
        differencePercent !== null &&
        differencePercent <
            -STANDARD_ENGINE_CONFIG
                .tolerancePercent
    ) {
        status = "below";
    }

    return {

        actual:
            roundValue(
                actualValue,
                3
            ),

        standard:
            roundValue(
                standardValue,
                3
            ),

        difference:
            roundValue(
                difference,
                3
            ),

        differencePercent:
            roundValue(
                differencePercent,
                2
            ),

        status,

        metric

    };
}


/* =========================================================
   METRIC DIRECTION
========================================================= */

const STANDARD_METRIC_DIRECTION = {

    bodyWeight: "target",

    dailyGain: "higher",

    dailyFeed: "lower",

    cumulativeFeed: "lower",

    fcr: "lower",

    mortality: "lower",

    livability: "higher",

    uniformity10: "higher",

    uniformity15: "higher",

    cv: "lower",

    dailyWater: "target",

    eggProduction: "higher",

    henDayProduction: "higher",

    eggWeight: "target",

    eggMass: "higher",

    cumulativeEggs: "higher",

    fertility: "higher",

    hatchability: "higher"

};


/* =========================================================
   INTERPRET COMPARISON
========================================================= */

function interpretComparison(
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

    const direction =
        STANDARD_METRIC_DIRECTION[
            metric
        ] || "target";

    if (
        comparison.status ===
        "within-range"
    ) {

        return {

            status:
                "within-range",

            label:
                "در محدوده استاندارد"

        };
    }

    if (direction === "higher") {

        if (
            comparison.status ===
            "above"
        ) {

            return {

                status: "better",

                label:
                    "بهتر از استاندارد"

            };

        }

        return {

            status: "worse",

            label:
                "پایین‌تر از استاندارد"

        };
    }

    if (direction === "lower") {

        if (
            comparison.status ===
            "below"
        ) {

            return {

                status: "better",

                label:
                    "بهتر از استاندارد"

            };

        }

        return {

            status: "worse",

            label:
                "بالاتر از استاندارد"

        };
    }

    return {

        status:
            comparison.status,

        label:
            comparison.status === "above"
                ? "بالاتر از هدف"
                : "پایین‌تر از هدف"

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
        interpretComparison(
            metric,
            comparison
        );

    return {

        ...comparison,

        ...interpretation

    };
}


/* =========================================================
   WEEKLY STANDARD COMPARISON
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

    if (!standard) {

        return {

            available: false,

            ageDays:
                Number(ageDays),

            standard: null,

            comparisons: {},

            message:
                "استاندارد معتبر برای این ژنتیک و سن موجود نیست."

        };
    }

    const comparisons = {};

    Object.keys(
        actualMetrics
    )
    .forEach(metric => {

        comparisons[metric] =
            buildMetricComparison(
                type,
                metric,
                actualMetrics[metric],
                standard[metric]
            );

    });

    return {

        available: true,

        ageDays:
            Number(ageDays),

        standard,

        comparisons

    };
}


/* =========================================================
   BROILER FCR
========================================================= */

function calculateBroilerFCR({
    feedKg,
    openingBirds,
    closingBirds,
    openingAverageWeightG,
    closingAverageWeightG
} = {}) {

    const feed =
        toFiniteNumber(feedKg);

    const openingBirdCount =
        toFiniteNumber(openingBirds);

    const closingBirdCount =
        toFiniteNumber(closingBirds);

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
        openingBirdCount === null ||
        closingBirdCount === null ||
        openingWeight === null ||
        closingWeight === null
    ) {

        return {

            valid: false,

            value: null,

            reason:
                "اطلاعات کافی برای محاسبه FCR وجود ندارد."

        };
    }

    if (
        feed < 0 ||
        openingBirdCount <= 0 ||
        closingBirdCount <= 0 ||
        openingWeight < 0 ||
        closingWeight <= 0
    ) {

        return {

            valid: false,

            value: null,

            reason:
                "مقادیر ورودی FCR معتبر نیستند."

        };
    }

    const openingBiomassKg =
        (
            openingBirdCount *
            openingWeight
        ) / 1000;

    const closingBiomassKg =
        (
            closingBirdCount *
            closingWeight
        ) / 1000;

    const gainKg =
        closingBiomassKg -
        openingBiomassKg;

    if (gainKg <= 0) {

        return {

            valid: false,

            value: null,

            openingBiomassKg,

            closingBiomassKg,

            gainKg,

            reason:
                "افزایش زیست‌توده مثبت نیست."

        };
    }

    const fcr =
        feed /
        gainKg;

    return {

        valid:
            Number.isFinite(fcr),

        value:
            roundValue(
                fcr,
                STANDARD_ENGINE_CONFIG
                    .fcrDecimals
            ),

        feedKg:
            roundValue(feed, 3),

        openingBiomassKg:
            roundValue(
                openingBiomassKg,
                3
            ),

        closingBiomassKg:
            roundValue(
                closingBiomassKg,
                3
            ),

        gainKg:
            roundValue(
                gainKg,
                3
            )

    };
}


/* =========================================================
   ESTIMATED FCR
========================================================= */

function calculateFCRFromFeedPerBird({
    feedPerBirdPerDayG,
    days,
    openingAverageWeightG,
    closingAverageWeightG
} = {}) {

    const feed =
        toFiniteNumber(
            feedPerBirdPerDayG
        );

    const numberOfDays =
        toFiniteNumber(days);

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
        numberOfDays === null ||
        openingWeight === null ||
        closingWeight === null
    ) {

        return {

            valid: false,

            estimated: true,

            value: null

        };
    }

    const feedConsumedG =
        feed *
        numberOfDays;

    const gainG =
        closingWeight -
        openingWeight;

    if (gainG <= 0) {

        return {

            valid: false,

            estimated: true,

            value: null

        };
    }

    return {

        valid: true,

        estimated: true,

        value:
            roundValue(
                feedConsumedG /
                gainG,
                STANDARD_ENGINE_CONFIG
                    .fcrDecimals
            ),

        feedConsumedG,

        gainG

    };
}


/* =========================================================
   LAYER FCR
========================================================= */

function calculateLayerFCR({
    feedKg,
    eggsProduced,
    averageEggWeightG
} = {}) {

    const feed =
        toFiniteNumber(feedKg);

    const eggs =
        toFiniteNumber(eggsProduced);

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

            valid: false,

            value: null

        };
    }

    if (
        feed < 0 ||
        eggs < 0 ||
        eggWeight <= 0
    ) {

        return {

            valid: false,

            value: null

        };
    }

    const eggMassKg =
        (
            eggs *
            eggWeight
        ) / 1000;

    if (eggMassKg <= 0) {

        return {

            valid: false,

            value: null

        };
    }

    const fcr =
        feed /
        eggMassKg;

    return {

        valid: true,

        value:
            roundValue(
                fcr,
                STANDARD_ENGINE_CONFIG
                    .fcrDecimals
            ),

        eggMassKg:
            roundValue(
                eggMassKg,
                3
            )

    };
}


/* =========================================================
   EGG MASS
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

    return roundValue(
        (
            production / 100
        ) *
        eggWeight,
        2
    );
}


/* =========================================================
   FCR COMPARISON
========================================================= */

function buildFCRComparison(
    productionType,
    actualFCR,
    standardFCR
) {

    if (
        actualFCR === null ||
        actualFCR === undefined
    ) {

        return {

            available: false,

            actual: null,

            standard:
                toFiniteNumber(
                    standardFCR
                ),

            difference: null,

            differencePercent: null,

            status: "no-actual"

        };
    }

    if (
        standardFCR === null ||
        standardFCR === undefined
    ) {

        return {

            available: true,

            actual:
                roundValue(
                    actualFCR,
                    3
                ),

            standard: null,

            difference: null,

            differencePercent: null,

            status: "no-standard"

        };
    }

    return {

        available: true,

        ...buildMetricComparison(
            productionType,
            "fcr",
            actualFCR,
            standardFCR
        )

    };
}


/* =========================================================
   ACTUAL VS STANDARD SERIES
========================================================= */

function buildActualVsStandardSeries(
    type,
    geneticsId,
    strain,
    actualRecords,
    metric
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
                    record[metric]
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
                    Number.isFinite(age)
                        ? age
                        : null,

                actual,

                standard:
                    standardValue,

                difference:
                    actual !== null &&
                    standardValue !== null
                        ? roundValue(
                            actual -
                            standardValue,
                            3
                        )
                        : null,

                differencePercent:
                    actual !== null &&
                    standardValue !== null &&
                    standardValue !== 0
                        ? roundValue(
                            (
                                (
                                    actual -
                                    standardValue
                                ) /
                                standardValue
                            ) * 100,
                            2
                        )
                        : null

            };

        }
    );
}


/* =========================================================
   STANDARD SERIES
========================================================= */

function buildStandardSeries(
    type,
    geneticsId,
    strain,
    ages,
    metric
) {

    if (
        !Array.isArray(ages)
    ) {
        return [];
    }

    const standard =
        getStandard(
            type,
            geneticsId,
            strain
        );

    if (!standard) {
        return [];
    }

    return ages.map(age => ({

        ageDays:
            Number(age),

        value:
            getStandardValueAtAge(
                standard,
                metric,
                age
            )

    }));
}


/* =========================================================
   STANDARD VALIDATION
========================================================= */

function validateStandardSource(
    standard
) {

    const errors = [];

    if (!standard) {

        return {

            valid: false,

            errors: [
                "Standard not found."
            ]

        };
    }

    if (!standard.sourceYear) {

        errors.push(
            "sourceYear is missing."
        );

    }

    if (!standard.sourceStatus) {

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
            "records is missing."
        );

    }

    return {

        valid:
            errors.length === 0,

        errors

    };
}


/* =========================================================
   STANDARD RECORD VALIDATION
========================================================= */

function validateStandardRecords(
    standard
) {

    const errors = [];

    if (!standard) {

        return {

            valid: false,

            errors: [
                "Standard missing."
            ]

        };
    }

    if (
        !Array.isArray(
            standard.records
        )
    ) {

        return {

            valid: false,

            errors: [
                "records must be array."
            ]

        };
    }

    let previousAge = null;

    standard.records.forEach(
        (record, index) => {

            const age =
                Number(
                    record.ageDays
                );

            if (
                !Number.isFinite(age)
            ) {

                errors.push(
                    `Record ${index + 1}: invalid ageDays`
                );

                return;

            }

            if (
                previousAge !== null &&
                age <= previousAge
            ) {

                errors.push(
                    `Record ${index + 1}: ageDays must increase`
                );

            }

            previousAge = age;

        }
    );

    return {

        valid:
            errors.length === 0,

        errors

    };
}


/* =========================================================
   AVAILABLE STANDARDS
========================================================= */

function listAvailableStandards(
    type
) {

    const normalizedType =
        normalizeProductionType(type);

    if (
        typeof VERIFIED_STANDARDS ===
        "undefined"
    ) {
        return [];
    }

    const typeData =
        VERIFIED_STANDARDS[
            normalizedType
        ];

    if (!typeData) {
        return [];
    }

    const result = [];

    Object.keys(typeData)
        .forEach(geneticsId => {

            const genetics =
                typeData[
                    geneticsId
                ];

            Object.keys(genetics)
                .forEach(strain => {

                    const standard =
                        genetics[
                            strain
                        ];

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
                            Array.isArray(
                                standard.records
                            )
                                ? standard.records.length
                                : 0,

                        ageRange:
                            getStandardAgeRange(
                                standard
                            )

                    });

                });

        });

    return result;
}


/* =========================================================
   GLOBAL EXPORTS
========================================================= */

if (
    typeof window !==
    "undefined"
) {

    window.STANDARD_ENGINE_CONFIG =
        STANDARD_ENGINE_CONFIG;

    window.STANDARD_METRIC_DIRECTION =
        STANDARD_METRIC_DIRECTION;

    window.normalizeProductionType =
        normalizeProductionType;

    window.getStandard =
        getStandard;

    window.getStandardRecords =
        getStandardRecords;

    window.getStandardAgeRange =
        getStandardAgeRange;

    window.getStandardValueAtAge =
        getStandardValueAtAge;

    window.getStandardAtAge =
        getStandardAtAge;

    window.compareStandardValue =
        compareStandardValue;

    window.interpretComparison =
        interpretComparison;

    window.buildMetricComparison =
        buildMetricComparison;

    window.buildWeeklyStandardComparison =
        buildWeeklyStandardComparison;

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

    window.buildActualVsStandardSeries =
        buildActualVsStandardSeries;

    window.buildStandardSeries =
        buildStandardSeries;

    window.validateStandardSource =
        validateStandardSource;

    window.validateStandardRecords =
        validateStandardRecords;

    window.listAvailableStandards =
        listAvailableStandards;

}
