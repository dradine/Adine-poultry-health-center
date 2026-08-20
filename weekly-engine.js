/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY PERFORMANCE ENGINE
========================================================= */

"use strict";


/* =========================================================
   BUILD WEIGHT RECORD
========================================================= */

function buildWeeklyWeightRecord({

    flockId,

    farmId,

    houseId,

    ageDays,

    weights = [],

    feed = null,

    water = null,

    mortalityCount = 0,

    initialBirdCount = null,

    date = todayISO(),

    notes = ""

}) {

    const analysis =
        calculateWeightAnalysis(
            weights
        );


    const averageWeight =
        analysis.mean;


    const standard =
        getStandardForCurrentFlock(
            flockId
        );


    const standardWeight =
        standard
            ? getStandardValueAtAge(
                standard,
                "bodyWeight",
                ageDays
            )
            : null;


    const fcr =
        calculateWeeklyFCR(
            flockId,
            averageWeight,
            feed,
            ageDays
        );


    const mortality =
        calculateMortalityRate(
            mortalityCount,
            initialBirdCount
        );


    return {

        id:
            createId("weekly"),

        flockId,

        farmId,

        houseId,

        date,

        ageDays:
            Number(ageDays),

        sampleCount:
            analysis.count,

        averageWeight,

        sd:
            analysis.sd,

        cv:
            analysis.cv,

        uniformity10:
            analysis.uniformity10,

        uniformity15:
            analysis.uniformity15,

        minWeight:
            analysis.min,

        maxWeight:
            analysis.max,

        /* -----------------------------------------
           مصرف
           ----------------------------------------- */

        feed:
            feed === null ||
            feed === undefined ||
            feed === ""
                ? null
                : Number(feed),

        water:
            water === null ||
            water === undefined ||
            water === ""
                ? null
                : Number(water),

        fcr,

        /* -----------------------------------------
           تلفات
           ----------------------------------------- */

        mortality,

        livability:
            mortality === null
                ? null
                : calculateLivability(
                    mortality
                ),

        /* -----------------------------------------
           استاندارد
           ----------------------------------------- */

        standardWeight,

        weightDifference:
            standardWeight === null ||
            averageWeight === null
                ? null
                : averageWeight -
                  standardWeight,

        weightDifferencePercent:
            standardWeight === null ||
            averageWeight === null
                ? null
                : (
                    (
                        averageWeight -
                        standardWeight
                    ) /
                    standardWeight
                ) *
                100,

        notes:
            notes || ""

    };

}


/* =========================================================
   SAVE
========================================================= */

function saveWeeklyWeightRecord(
    data
) {

    const record =
        buildWeeklyWeightRecord(
            data
        );


    return saveWeeklyRecord(
        record
    );

}


/* =========================================================
   FCR
   Feed / Weight Gain
========================================================= */

function calculateWeeklyFCR(
    flockId,
    currentWeight,
    currentFeed,
    currentAgeDays = null
) {

    const feed =
        Number(
            currentFeed
        );


    const weight =
        Number(
            currentWeight
        );


    if (
        !Number.isFinite(feed) ||
        feed <= 0 ||
        !Number.isFinite(weight)
    ) {

        return null;

    }


    const records =
        getFlockWeeklyRecords(
            flockId
        );


    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        return null;

    }


    let previous = null;


    /* -----------------------------------------
       پیدا کردن رکورد سنی قبلی
       ----------------------------------------- */

    if (
        currentAgeDays !== null &&
        currentAgeDays !== undefined
    ) {

        previous =
            records
                .filter(
                    item =>

                        Number(
                            item.ageDays
                        ) <
                        Number(
                            currentAgeDays
                        ) &&

                        Number.isFinite(
                            Number(
                                item.averageWeight
                            )
                        )
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            b.ageDays
                        ) -
                        Number(
                            a.ageDays
                        )
                )[0] || null;

    }


    /* -----------------------------------------
       اگر سن موجود نبود،
       آخرین رکورد قبلی را بگیر
       ----------------------------------------- */

    if (!previous) {

        previous =
            records
                .filter(
                    item =>
                        Number.isFinite(
                            Number(
                                item.averageWeight
                            )
                        )
                )
                .at(-1) || null;

    }


    if (!previous) {

        return null;

    }


    const previousWeight =
        Number(
            previous.averageWeight
        );


    if (
        !Number.isFinite(
            previousWeight
        )
    ) {

        return null;

    }


    const gain =
        weight -
        previousWeight;


    if (
        gain <= 0
    ) {

        return null;

    }


    return feed / gain;

}


/* =========================================================
   STANDARD FOR FLOCK
========================================================= */

function getStandardForCurrentFlock(
    flockId
) {

    const flock =
        getFlocks()
            .find(
                item =>
                    item.id ===
                    flockId
            );


    if (!flock) {

        return null;

    }


    return getStandard(
        flock.productionType,
        flock.genetics,
        flock.strain
    );

}


/* =========================================================
   WEEKLY PERFORMANCE
========================================================= */

function getWeeklyPerformance(
    flockId
) {

    const records =
        getFlockWeeklyRecords(
            flockId
        );


    const standard =
        getStandardForCurrentFlock(
            flockId
        );


    return records.map(
        record => {

            const standardWeight =
                standard
                    ? getStandardValueAtAge(
                        standard,
                        "bodyWeight",
                        record.ageDays
                    )
                    : null;


            return {

                ...record,

                standardWeight,

                weightDifference:
                    standardWeight === null ||
                    record.averageWeight === null
                        ? null
                        : Number(
                            record.averageWeight
                        ) -
                          standardWeight,

                weightDifferencePercent:
                    standardWeight === null ||
                    record.averageWeight === null
                        ? null
                        : (
                            (
                                Number(
                                    record.averageWeight
                                ) -
                                standardWeight
                            ) /
                            standardWeight
                        ) *
                        100

            };

        }
    );

}


/* =========================================================
   LATEST
========================================================= */

function getLatestWeeklyPerformance(
    flockId
) {

    const records =
        getWeeklyPerformance(
            flockId
        );


    return records.length
        ? records.at(-1)
        : null;

}


/* =========================================================
   HEALTH INDEX
========================================================= */

function calculateFlockHealthIndex(
    record
) {

    if (!record) {

        return null;

    }


    let score = 100;


    /* -----------------------------------------
       CV
       ----------------------------------------- */

    if (
        Number.isFinite(
            Number(
                record.cv
            )
        )
    ) {

        if (
            Number(record.cv) >
            20
        ) {

            score -= 25;

        }

        else if (
            Number(record.cv) >
            15
        ) {

            score -= 15;

        }

        else if (
            Number(record.cv) >
            10
        ) {

            score -= 5;

        }

    }


    /* -----------------------------------------
       Uniformity
       ----------------------------------------- */

    if (
        Number.isFinite(
            Number(
                record.uniformity10
            )
        )
    ) {

        if (
            Number(
                record.uniformity10
            ) <
            70
        ) {

            score -= 25;

        }

        else if (
            Number(
                record.uniformity10
            ) <
            80
        ) {

            score -= 15;

        }

        else if (
            Number(
                record.uniformity10
            ) <
            85
        ) {

            score -= 5;

        }

    }


    /* -----------------------------------------
       Weight deviation
       ----------------------------------------- */

    if (
        Number.isFinite(
            Number(
                record.weightDifferencePercent
            )
        )
    ) {

        const deviation =
            Math.abs(
                Number(
                    record.weightDifferencePercent
                )
            );


        if (
            deviation >
            15
        ) {

            score -= 20;

        }

        else if (
            deviation >
            10
        ) {

            score -= 10;

        }

        else if (
            deviation >
            5
        ) {

            score -= 5;

        }

    }


    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );

}


/* =========================================================
   DUPLICATE AGE CHECK
========================================================= */

function hasWeeklyRecordAtAge(
    flockId,
    ageDays,
    excludeId = null
) {

    return getFlockWeeklyRecords(
        flockId
    )
    .some(
        record =>

            record.id !==
                excludeId &&

            Number(
                record.ageDays
            ) ===
            Number(ageDays)

    );

}
