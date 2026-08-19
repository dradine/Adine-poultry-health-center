/* =========================================================
   ADINE POULTRY HEALTH CENTER
   PERFORMANCE COMPARISON ENGINE
   ========================================================= */


function compareFlockToStandard({

    actual,

    standard

}) {

    if (
        !actual ||
        !standard
    ) {

        return null;

    }


    const metrics = {};


    Object.keys(
        PERFORMANCE_METRICS
    )
    .forEach(
        metric => {

            const actualValue =
                actual[metric];


            const standardValue =
                standard[metric];


            metrics[metric] =
                comparePerformance(
                    actualValue,
                    standardValue
                );

        }
    );


    return {

        metrics,

        overall:
            calculateOverallPerformance(
                metrics
            )

    };

}


/* =========================================================
   OVERALL
   ========================================================= */

function calculateOverallPerformance(
    metrics
) {

    const available =
        Object.values(metrics)
            .filter(
                item =>
                    item &&
                    item.percentage !== null
            );


    if (!available.length) {

        return {

            score: null,

            status:
                "no-standard"

        };

    }


    let score = 0;


    available.forEach(
        item => {

            const p =
                Math.abs(
                    Number(
                        item.percentage
                    )
                );


            if (p <= 5) {

                score += 100;

            }

            else if (p <= 10) {

                score += 80;

            }

            else if (p <= 20) {

                score += 60;

            }

            else {

                score += 30;

            }

        }
    );


    score /=
        available.length;


    let status;


    if (score >= 90) {

        status =
            "excellent";

    }

    else if (score >= 75) {

        status =
            "good";

    }

    else if (score >= 60) {

        status =
            "warning";

    }

    else {

        status =
            "critical";

    }


    return {

        score,

        status

    };

}


/* =========================================================
   CHART DATA
   ========================================================= */

function buildComparisonChartData({

    actualRecords,

    standardRecords,

    metric

}) {

    const actual =
        (actualRecords || [])
            .map(
                item => ({
                    age: item.age,
                    value:
                        item[metric]
                })
            )
            .filter(
                item =>
                    item.value !== null &&
                    item.value !== undefined
            );


    const standard =
        (standardRecords || [])
            .map(
                item => ({
                    age: item.age,
                    value:
                        item[metric]
                })
            )
            .filter(
                item =>
                    item.value !== null &&
                    item.value !== undefined
            );


    const labels =
        [
            ...new Set(
                [
                    ...actual.map(
                        item =>
                            item.age
                    ),

                    ...standard.map(
                        item =>
                            item.age
                    )
                ]
            )
        ]
        .sort(
            (a, b) =>
                Number(a) -
                Number(b)
        );


    return {

        labels,

        actual:
            labels.map(
                age => {

                    const item =
                        actual.find(
                            x =>
                                Number(x.age) ===
                                Number(age)
                        );

                    return item
                        ? item.value
                        : null;

                }
            ),

        standard:
            labels.map(
                age => {

                    const item =
                        standard.find(
                            x =>
                                Number(x.age) ===
                                Number(age)
                        );

                    return item
                        ? item.value
                        : null;

                }
            )

    };

}
