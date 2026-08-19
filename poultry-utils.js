/* =========================================================
   ADINE POULTRY HEALTH CENTER
   POULTRY CALCULATION ENGINE
   ========================================================= */


/* =========================================================
   BASIC
   ========================================================= */

function roundNumber(
    value,
    decimals = 2
) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
    ) {

        return null;

    }


    const factor =
        Math.pow(
            10,
            decimals
        );


    return Math.round(
        Number(value) * factor
    ) / factor;

}


/* =========================================================
   AVERAGE
   ========================================================= */

function calculateAverage(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (!numbers.length) {

        return null;

    }


    return (
        numbers.reduce(
            (sum, value) =>
                sum + value,
            0
        )
        /
        numbers.length
    );

}


/* =========================================================
   SD
   ========================================================= */

function calculateSD(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (
        numbers.length < 2
    ) {

        return null;

    }


    const mean =
        calculateAverage(
            numbers
        );


    const variance =
        numbers.reduce(
            (sum, value) =>
                sum +
                Math.pow(
                    value - mean,
                    2
                ),
            0
        )
        /
        numbers.length;


    return Math.sqrt(
        variance
    );

}


/* =========================================================
   CV
   ========================================================= */

function calculateCV(
    values
) {

    const mean =
        calculateAverage(
            values
        );


    const sd =
        calculateSD(
            values
        );


    if (
        mean === null ||
        sd === null ||
        mean === 0
    ) {

        return null;

    }


    return (
        sd /
        mean *
        100
    );

}


/* =========================================================
   UNIFORMITY
   ========================================================= */

function calculateUniformity(
    values,
    percentage = 10
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (!numbers.length) {

        return null;

    }


    const mean =
        calculateAverage(
            numbers
        );


    const lower =
        mean *
        (1 - percentage / 100);


    const upper =
        mean *
        (1 + percentage / 100);


    const within =
        numbers.filter(
            value =>
                value >= lower &&
                value <= upper
        );


    return (
        within.length /
        numbers.length *
        100
    );

}


/* =========================================================
   WEIGHT DISTRIBUTION
   ========================================================= */

function calculateWeightDistribution(
    values,
    percentage = 10
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (!numbers.length) {

        return null;

    }


    const mean =
        calculateAverage(
            numbers
        );


    const lower =
        mean *
        (1 - percentage / 100);


    const upper =
        mean *
        (1 + percentage / 100);


    let below = 0;

    let within = 0;

    let above = 0;


    numbers.forEach(
        value => {

            if (
                value < lower
            ) {

                below++;

            }

            else if (
                value > upper
            ) {

                above++;

            }

            else {

                within++;

            }

        }
    );


    return {

        below,

        within,

        above,

        total:
            numbers.length,

        belowPercent:
            below /
            numbers.length *
            100,

        withinPercent:
            within /
            numbers.length *
            100,

        abovePercent:
            above /
            numbers.length *
            100

    };

}


/* =========================================================
   MIN
   ========================================================= */

function calculateMinimum(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    return numbers.length
        ? Math.min(...numbers)
        : null;

}


/* =========================================================
   MAX
   ========================================================= */

function calculateMaximum(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    return numbers.length
        ? Math.max(...numbers)
        : null;

}


/* =========================================================
   FCR
   ========================================================= */

function calculateFCR(
    feed,
    weightGain
) {

    const f =
        Number(feed);

    const g =
        Number(weightGain);


    if (
        !Number.isFinite(f) ||
        !Number.isFinite(g) ||
        g <= 0
    ) {

        return null;

    }


    return f / g;

}


/* =========================================================
   MORTALITY
   ========================================================= */

function calculateMortality(
    initialBirds,
    mortalityCount
) {

    const initial =
        Number(initialBirds);

    const dead =
        Number(mortalityCount);


    if (
        !Number.isFinite(initial) ||
        !Number.isFinite(dead) ||
        initial <= 0
    ) {

        return null;

    }


    return (
        dead /
        initial *
        100
    );

}


/* =========================================================
   LIVABILITY
   ========================================================= */

function calculateLivability(
    initialBirds,
    mortalityCount
) {

    const mortality =
        calculateMortality(
            initialBirds,
            mortalityCount
        );


    if (
        mortality === null
    ) {

        return null;

    }


    return 100 -
        mortality;

}


/* =========================================================
   WATER / FEED PER BIRD
   ========================================================= */

function perBird(
    total,
    birds
) {

    const t =
        Number(total);

    const b =
        Number(birds);


    if (
        !Number.isFinite(t) ||
        !Number.isFinite(b) ||
        b <= 0
    ) {

        return null;

    }


    return t / b;

}


/* =========================================================
   WATER / FEED RATIO
   ========================================================= */

function waterFeedRatio(
    water,
    feed
) {

    const w =
        Number(water);

    const f =
        Number(feed);


    if (
        !Number.isFinite(w) ||
        !Number.isFinite(f) ||
        f <= 0
    ) {

        return null;

    }


    return w / f;

}


/* =========================================================
   COMPLETE WEIGHT ANALYSIS
   ========================================================= */

function analyzeWeights(
    values
) {

    const numbers =
        values
            .map(Number)
            .filter(
                Number.isFinite
            );


    if (!numbers.length) {

        return null;

    }


    const average =
        calculateAverage(
            numbers
        );


    const sd =
        calculateSD(
            numbers
        );


    const cv =
        calculateCV(
            numbers
        );


    const uniformity10 =
        calculateUniformity(
            numbers,
            10
        );


    const uniformity15 =
        calculateUniformity(
            numbers,
            15
        );


    return {

        count:
            numbers.length,

        average,

        sd,

        cv,

        uniformity10,

        uniformity15,

        minimum:
            calculateMinimum(
                numbers
            ),

        maximum:
            calculateMaximum(
                numbers
            ),

        distribution10:
            calculateWeightDistribution(
                numbers,
                10
            ),

        distribution15:
            calculateWeightDistribution(
                numbers,
                15
            )

    };

}


/* =========================================================
   WEEKLY PERFORMANCE
   ========================================================= */

function calculateWeeklyPerformance({

    birds,

    previousWeight,

    currentWeight,

    feed,

    water,

    mortality

}) {

    const result = {};


    result.birds =
        Number(birds) || null;


    result.weightGain =
        Number.isFinite(
            Number(previousWeight)
        ) &&
        Number.isFinite(
            Number(currentWeight)
        )
            ? Number(currentWeight) -
              Number(previousWeight)

            : null;


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
            mortality
        );


    result.livability =
        calculateLivability(
            birds,
            mortality
        );


    result.fcr =
        calculateFCR(
            result.feedPerBird,
            result.weightGain
        );


    return result;

}
