/* =========================================================
   ADINE POULTRY HEALTH CENTER
   GENETICS / CATALOG MASTER DATA
========================================================= */

const POULTRY_CATALOG = {

    broiler: {

        label: "گوشتی",

        genetics: [

            {
                id: "aviagen_ross",
                name: "Aviagen / Ross",
                strains: [
                    "Ross 308",
                    "Ross 308 FF",
                    "Ross 708",
                    "Ross 308 AP"
                ]
            },

            {
                id: "cobb",
                name: "Cobb",
                strains: [
                    "Cobb500",
                    "Cobb800"
                ]
            },

            {
                id: "aviagen_arbor",
                name: "Aviagen / Arbor Acres",
                strains: [
                    "Arbor Acres Plus",
                    "Arbor Acres Plus S"
                ]
            },

            {
                id: "aviagen_indian",
                name: "Aviagen / Indian River",
                strains: [
                    "Indian River",
                    "Indian River FF"
                ]
            },

            {
                id: "hubbard",
                name: "Hubbard",
                strains: [
                    "Efficiency Plus",
                    "Hubbard EDGE"
                ]
            },

            {
                id: "arian",
                name: "آرین ایران",
                strains: [
                    "Arian"
                ]
            }

        ]

    },


    layer: {

        label: "تخم‌گذار",

        genetics: [

            {
                id: "hyline",
                name: "Hy-Line",
                strains: [
                    "W-36",
                    "W-80",
                    "W-80 Plus",
                    "W-80 Pro",
                    "Brown"
                ]
            },

            {
                id: "hendrix",
                name: "Hendrix Genetics",
                strains: [
                    "ISA Brown",
                    "ISA White",
                    "Dekalb White",
                    "Dekalb Brown",
                    "Bovans White",
                    "Bovans Brown",
                    "Shaver White",
                    "Shaver Brown",
                    "Hisex White",
                    "Hisex Brown"
                ]
            },

            {
                id: "lohmann",
                name: "Lohmann",
                strains: [
                    "Lohmann Brown-Classic",
                    "Lohmann Brown-Lite",
                    "Lohmann Brown-Extra",
                    "Lohmann LSL-Classic",
                    "Lohmann LSL-Lite",
                    "Lohmann LSL-Extra",
                    "Lohmann Sandy",
                    "Lohmann Tradition"
                ]
            },

            {
                id: "novogen",
                name: "NOVOgen",
                strains: [
                    "NOVOgen Brown",
                    "NOVOgen White"
                ]
            },

            {
                id: "tetra",
                name: "TETRA",
                strains: [
                    "TETRA Brown"
                ]
            }

        ]

    },


    pullet: {

        label: "پولت",

        genetics: [

            {
                id: "hyline",
                name: "Hy-Line",
                strains: [
                    "W-36",
                    "W-80",
                    "Brown"
                ]
            },

            {
                id: "hendrix",
                name: "Hendrix Genetics",
                strains: [
                    "ISA Brown",
                    "ISA White",
                    "Dekalb White",
                    "Dekalb Brown",
                    "Hisex White",
                    "Hisex Brown"
                ]
            },

            {
                id: "lohmann",
                name: "Lohmann",
                strains: [
                    "Lohmann Brown-Classic",
                    "Lohmann LSL-Classic",
                    "Lohmann Brown-Lite",
                    "Lohmann LSL-Lite"
                ]
            }

        ]

    },


    breeder: {

        label: "مرغ مادر",

        genetics: [

            {
                id: "aviagen_ross",
                name: "Aviagen / Ross",
                strains: [
                    "Ross 308",
                    "Ross 308 FF",
                    "Ross 708",
                    "Ross 308 AP"
                ]
            },

            {
                id: "aviagen_arbor",
                name: "Aviagen / Arbor Acres",
                strains: [
                    "Arbor Acres Plus",
                    "Arbor Acres Plus S"
                ]
            },

            {
                id: "aviagen_indian",
                name: "Aviagen / Indian River",
                strains: [
                    "Indian River",
                    "Indian River FF"
                ]
            },

            {
                id: "cobb",
                name: "Cobb",
                strains: [
                    "Cobb500",
                    "Cobb800"
                ]
            }

        ]

    }

};


/* =========================================================
   PERFORMANCE METRICS
========================================================= */

const PERFORMANCE_METRICS = {

    ageDays: {
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

    dailyFeed: {
        label: "مصرف دان روزانه",
        unit: "g/bird/day"
    },

    cumulativeFeed: {
        label: "دان تجمعی",
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

    uniformity10: {
        label: "یکنواختی ±10%",
        unit: "%"
    },

    uniformity15: {
        label: "یکنواختی ±15%",
        unit: "%"
    },

    cv: {
        label: "CV",
        unit: "%"
    },

    dailyWater: {
        label: "مصرف آب روزانه",
        unit: "L/bird/day"
    },

    eggProduction: {
        label: "تولید تخم‌مرغ",
        unit: "%"
    },

    henDayProduction: {
        label: "Hen-Day",
        unit: "%"
    },

    eggWeight: {
        label: "وزن تخم‌مرغ",
        unit: "g"
    },

    eggMass: {
        label: "Egg Mass",
        unit: "g/hen/day"
    },

    cumulativeEggs: {
        label: "تخم تجمعی",
        unit: "egg/hen"
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

function standardRecord(
    ageDays,
    values = {}
) {

    return {

        ageDays:
            Number(ageDays),

        ...values

    };

}


/* =========================================================
   VERIFIED / IMPORTED STANDARD DATA
========================================================= */

const VERIFIED_STANDARDS = {

    broiler: {

        aviagen_ross: {

            "Ross 308": {

                sourceYear: 2022,

                sourceStatus:
                    "official-aviagen-reference",

                records: [

                    standardRecord(7, {
                        bodyWeight: 190
                    }),

                    standardRecord(14, {
                        bodyWeight: 490
                    }),

                    standardRecord(21, {
                        bodyWeight: 900
                    }),

                    standardRecord(28, {
                        bodyWeight: 1400
                    }),

                    standardRecord(35, {
                        bodyWeight: 1950
                    }),

                    standardRecord(42, {
                        bodyWeight: 2500
                    }),

                    standardRecord(49, {
                        bodyWeight: 3050
                    }),

                    standardRecord(56, {
                        bodyWeight: 3600
                    })

                ]

            }

        }

    }

};


/* =========================================================
   SOURCE INFORMATION
========================================================= */

const STANDARD_SOURCES = {

    aviagen:
        "Official Aviagen technical center",

    hyline:
        "Official Hy-Line technical resources",

    hendrix:
        "Official Hendrix Genetics technical resources",

    lohmann:
        "Official Lohmann Breeders technical resources",

    cobb:
        "Official Cobb technical resources"

};


/* =========================================================
   CATALOG HELPERS
========================================================= */

function getCatalog(
    type
) {

    return (
        POULTRY_CATALOG[type] ||
        null
    );

}


function getGenetics(
    type
) {

    return (
        POULTRY_CATALOG[type]
            ?.genetics ||
        []
    );

}


function getStrains(
    type,
    geneticsId
) {

    const genetics =
        getGenetics(type)
            .find(
                item =>
                    item.id ===
                    geneticsId
            );

    return (
        genetics?.strains ||
        []
    );

}


/* =========================================================
   STANDARD LOOKUP
========================================================= */

function getStandard(
    type,
    geneticsId,
    strain
) {

    let resolvedGeneticsId =
        geneticsId;

    let resolvedStrain =
        strain;

    const catalog =
        POULTRY_CATALOG?.[type];

    if (
        catalog &&
        Array.isArray(
            catalog.genetics
        )
    ) {

        const directGenetics =
            catalog.genetics.find(
                item =>
                    item.id ===
                    geneticsId
            );

        if (!directGenetics) {

            const normalized =
                String(
                    geneticsId ||
                    strain ||
                    ""
                )
                .trim()
                .toLowerCase();

            const match =
                catalog.genetics.find(
                    item =>
                        item.strains.some(
                            itemStrain =>
                                String(
                                    itemStrain
                                )
                                .trim()
                                .toLowerCase() ===
                                normalized
                        )
                );

            if (match) {

                resolvedGeneticsId =
                    match.id;

                resolvedStrain =
                    strain ||
                    geneticsId;

            }

        }

    }

    return (
        VERIFIED_STANDARDS
            [type]
            ?.[resolvedGeneticsId]
            ?.[resolvedStrain]
        ||
        null
    );

}


/* =========================================================
   STANDARD VALUE AT AGE
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
        ) ||
        !standard.records.length
    ) {

        return null;

    }

    const age =
        Number(ageDays);

    if (
        !Number.isFinite(age)
    ) {

        return null;

    }

    const points =
        standard.records

            .map(
                record => ({

                    age:
                        Number(
                            record.ageDays
                        ),

                    value:
                        Number(
                            record[metric]
                        )

                })
            )

            .filter(
                point =>
                    Number.isFinite(
                        point.age
                    ) &&
                    Number.isFinite(
                        point.value
                    )
            )

            .sort(
                (a, b) =>
                    a.age -
                    b.age
            );


    if (
        !points.length
    ) {

        return null;

    }


    /*
     * Never extrapolate outside
     * the documented age range.
     */

    if (
        age <
            points[0].age ||
        age >
            points[
                points.length - 1
            ].age
    ) {

        return null;

    }


    /*
     * Exact documented age.
     */

    const exact =
        points.find(
            point =>
                point.age ===
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

            const ratio =
                (
                    age -
                    previous.age
                ) /
                (
                    next.age -
                    previous.age
                );


            return Number(
                (
                    previous.value +
                    (
                        next.value -
                        previous.value
                    ) *
                    ratio
                )
                .toFixed(2)
            );

        }

    }


    return null;

}


/* =========================================================
   STANDARD AT AGE
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
            Number(ageDays),

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

        livability:
            getStandardValueAtAge(
                standard,
                "livability",
                ageDays
            ),

        mortality:
            getStandardValueAtAge(
                standard,
                "mortality",
                ageDays
            ),

        uniformity10:
            getStandardValueAtAge(
                standard,
                "uniformity10",
                ageDays
            ),

        uniformity15:
            getStandardValueAtAge(
                standard,
                "uniformity15",
                ageDays
            ),

        cv:
            getStandardValueAtAge(
                standard,
                "cv",
                ageDays
            ),

        dailyWater:
            getStandardValueAtAge(
                standard,
                "dailyWater",
                ageDays
            ),

        eggProduction:
            getStandardValueAtAge(
                standard,
                "eggProduction",
                ageDays
            ),

        henDayProduction:
            getStandardValueAtAge(
                standard,
                "henDayProduction",
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
     * Remove metrics for which
     * no official value exists.
     */

    Object.keys(
        result
    ).forEach(
        key => {

            if (
                key !== "ageDays" &&
                result[key] === null
            ) {

                delete result[key];

            }

        }
    );


    return result;

}


/* =========================================================
   STANDARD SERIES FOR CHARTS
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


    return ages.map(
        age => ({

            ageDays:
                Number(age),

            value:
                getStandardValueAtAge(
                    getStandard(
                        type,
                        geneticsId,
                        strain
                    ),
                    metric,
                    age
                )

        })
    );

}


/* =========================================================
   GET ALL AVAILABLE STANDARDS
========================================================= */

function listAvailableStandards(
    type
) {

    const typeStandards =
        VERIFIED_STANDARDS[
            type
        ];


    if (
        !typeStandards
    ) {

        return [];

    }


    const result = [];


    Object.keys(
        typeStandards
    )
    .forEach(
        geneticsId => {

            const genetics =
                typeStandards[
                    geneticsId
                ];


            Object.keys(
                genetics
            )
            .forEach(
                strain => {

                    const standard =
                        genetics[
                            strain
                        ];


                    result.push({

                        type,

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
                                : 0

                    });

                }
            );

        }
    );


    return result;

}


/* =========================================================
   DATABASE VALIDATION
========================================================= */

function validateStandardData() {

    const errors = [];


    Object.keys(
        VERIFIED_STANDARDS
    )
    .forEach(
        type => {

            const typeData =
                VERIFIED_STANDARDS[
                    type
                ];


            Object.keys(
                typeData
            )
            .forEach(
                geneticsId => {

                    const genetics =
                        typeData[
                            geneticsId
                        ];


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
                                !standard
                            ) {

                                errors.push(
                                    `${type}/${geneticsId}/${strain}: standard missing`
                                );

                                return;

                            }


                            if (
                                !standard.sourceYear
                            ) {

                                errors.push(
                                    `${type}/${geneticsId}/${strain}: sourceYear missing`
                                );

                            }


                            if (
                                !Array.isArray(
                                    standard.records
                                )
                            ) {

                                errors.push(
                                    `${type}/${geneticsId}/${strain}: records missing`
                                );

                                return;

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
                                            `${type}/${geneticsId}/${strain}: invalid age at record ${index + 1}`
                                        );

                                    }


                                    if (
                                        previousAge !== null &&
                                        age <= previousAge
                                    ) {

                                        errors.push(
                                            `${type}/${geneticsId}/${strain}: age order invalid`
                                        );

                                    }


                                    previousAge =
                                        age;

                                }
                            );

                        }
                    );

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
   GLOBAL EXPORT
========================================================= */

if (
    typeof window !==
    "undefined"
) {

    window.POULTRY_CATALOG =
        POULTRY_CATALOG;

    window.PERFORMANCE_METRICS =
        PERFORMANCE_METRICS;

    window.VERIFIED_STANDARDS =
        VERIFIED_STANDARDS;

    window.STANDARD_SOURCES =
        STANDARD_SOURCES;

    window.getCatalog =
        getCatalog;

    window.getGenetics =
        getGenetics;

    window.getStrains =
        getStrains;

    window.getStandard =
        getStandard;

    window.getStandardValueAtAge =
        getStandardValueAtAge;

    window.getStandardAtAge =
        getStandardAtAge;

    window.buildStandardSeries =
        buildStandardSeries;

    window.listAvailableStandards =
        listAvailableStandards;

    window.validateStandardData =
        validateStandardData;

}
