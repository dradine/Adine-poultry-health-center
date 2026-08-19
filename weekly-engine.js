/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY FLOCK ENGINE
   ========================================================= */


/* =========================================================
   CREATE WEEKLY RECORD
   ========================================================= */

function createWeeklyFlockRecord(
    data
) {

    const record = {

        id:
            data.id ||
            createId("week"),

        farmId:
            data.farmId,

        houseId:
            data.houseId,

        flockId:
            data.flockId,

        week:
            Number(
                data.week || 0
            ),

        ageDays:
            Number(
                data.ageDays || 0
            ),

        date:
            data.date ||
            todayISO(),

        birdCount:
            Number(
                data.birdCount || 0
            ),

        mortality:
            Number(
                data.mortality || 0
            ),

        culls:
            Number(
                data.culls || 0
            ),

        averageWeight:
            data.averageWeight !== ""
                ? Number(
                    data.averageWeight
                )
                : null,

        sd:
            data.sd !== ""
                ? Number(
                    data.sd
                )
                : null,

        cv:
            data.cv !== ""
                ? Number(
                    data.cv
                )
                : null,

        uniformity10:
            data.uniformity10 !== ""
                ? Number(
                    data.uniformity10
                )
                : null,

        uniformity15:
            data.uniformity15 !== ""
                ? Number(
                    data.uniformity15
                )
                : null,

        feed:
            Number(
                data.feed || 0
            ),

        water:
            Number(
                data.water || 0
            ),

        waterFeedRatio:
            null,

        feedPerBird:
            null,

        waterPerBird:
            null,

        weightGain:
            null,

        fcr:
            null,

        notes:
            data.notes ||
            "",

        createdAt:
            new Date().toISOString()

    };


    return record;

}


/* =========================================================
   CALCULATE WEEK
   ========================================================= */

function calculateWeeklyRecord(
    current,
    previous = null
) {

    const result =
        {
            ...current
        };


    const birds =
        Number(
            current.birdCount
        );


    const feed =
        Number(
            current.feed
        );


    const water =
        Number(
            current.water
        );


    result.feedPerBird =
        perBird(
            feed,
            birds
        );


    result.waterPerBird =
        perBird(
            water,
            birds
        );


    result.waterFeedRatio =
        waterFeedRatio(
            water,
            feed
        );


    result.mortalityPercent =
        calculateMortality(
            birds,
            current.mortality
        );


    result.livability =
        calculateLivability(
            birds,
            current.mortality
        );


    if (
        previous &&
        Number.isFinite(
            Number(
                previous.averageWeight
            )
        ) &&
        Number.isFinite(
            Number(
                current.averageWeight
            )
        )
    ) {

        result.weightGain =
            Number(
                current.averageWeight
            ) -
            Number(
                previous.averageWeight
            );

    }


    if (
        result.weightGain !== null &&
        result.feedPerBird !== null
    ) {

        result.fcr =
            calculateFCR(
                result.feedPerBird,
                result.weightGain
            );

    }


    return result;

}


/* =========================================================
   WEIGHT SAMPLE
   ========================================================= */

function calculateWeightSample(
    weights
) {

    const analysis =
        analyzeWeights(
            weights
        );


    if (!analysis) {

        return null;

    }


    return {

        count:
            analysis.count,

        average:
            roundNumber(
                analysis.average,
                1
            ),

        sd:
            roundNumber(
                analysis.sd,
                1
            ),

        cv:
            roundNumber(
                analysis.cv,
                2
            ),

        uniformity10:
            roundNumber(
                analysis.uniformity10,
                2
            ),

        uniformity15:
            roundNumber(
                analysis.uniformity15,
                2
            ),

        min:
            roundNumber(
                analysis.minimum,
                1
            ),

        max:
            roundNumber(
                analysis.maximum,
                1
            ),

        distribution10:
            analysis.distribution10,

        distribution15:
            analysis.distribution15

    };

}


/* =========================================================
   STANDARD FOR WEEK
   ========================================================= */

function getWeeklyStandard({

    type,

    genetics,

    strain,

    program,

    age

}) {

    return getStandardRecord({

        type,

        genetics,

        strain,

        program,

        age

    });

}


/* =========================================================
   COMPARE WEEK
   ========================================================= */

function compareWeeklyRecord({

    record,

    standard

}) {

    if (
        !record ||
        !standard
    ) {

        return null;

    }


    return compareFlockToStandard({

        actual: {

            bodyWeight:
                record.averageWeight,

            fcr:
                record.fcr,

            mortality:
                record.mortalityPercent,

            livability:
                record.livability,

            uniformity:
                record.uniformity10,

            cv:
                record.cv

        },

        standard

    });

}
