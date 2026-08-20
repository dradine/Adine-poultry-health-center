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
=========================================================

   IMPORTANT:
   Numeric values must come from the applicable breeder
   catalogue. Missing values remain null.

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


function getStandard(
    type,
    geneticsId,
    strain
) {

    /*
     * The flock form stores the selected strain name in both
     * `genetics` and `strain`. Resolve that name back to the
     * catalog genetics id when necessary.
     */
    let resolvedGeneticsId =
        geneticsId;

    let resolvedStrain =
        strain;

    const catalog =
        POULTRY_CATALOG?.[type];

    if (
        catalog &&
        Array.isArray(catalog.genetics)
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

    const standard =
        VERIFIED_STANDARDS
            [type]
            ?.[resolvedGeneticsId]
            ?.[resolvedStrain]
        ||
        null;

    return standard;

}


/* =========================================================
   STANDARD VALUE AT AGE
   Linear interpolation between documented ages.
   No extrapolation beyond the documented range.
========================================================= */

function getStandardValueAtAge(
    standard,
    metric,
    ageDays
) {

    if (
        !standard ||
        !Array.isArray(standard.records) ||
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

    if (age < points[0].age || age > points[points.length - 1].age) {
        return null;
    }

    const exact =
        points.find(
            point =>
                point.age === age
        );

    if (exact) {
        return exact.value;
    }

    for (let i = 1; i < points.length; i++) {

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
                ).toFixed(2)
            );

        }

    }

    return null;

}
