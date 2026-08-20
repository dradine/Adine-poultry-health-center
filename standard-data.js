/* =========================================================
   ADINE POULTRY HEALTH CENTER
   GENETICS MASTER CATALOG
   VERSION 3.0
   Updated: 2026

   IMPORTANT
   ---------------------------------------------------------
   This file contains ONLY genetic catalog / selectable
   strains.

   Numerical performance objectives MUST NOT be stored here.

   Numerical standards are maintained separately in:
       standards.js

   Data policy:
       Official breeder documentation only.

   Production types:
       broiler  = گوشتی
       breeder  = مرغ مادر
       layer    = تخمگذار
       pullet   = پولت

   ========================================================= */

"use strict";


/* =========================================================
   MASTER POULTRY CATALOG
   ========================================================= */

const POULTRY_CATALOG = {


    /* =====================================================
       BROILERS
       مرغ گوشتی
       ===================================================== */

    broiler: {

        id: "broiler",

        label: "گوشتی",

        description:
            "Commercial broiler genetic programs",

        genetics: [


            /* =================================================
               AVIAGEN / ROSS
               ================================================= */

            {

                id: "aviagen_ross",

                company: "Aviagen",

                family: "Ross",

                name: "Aviagen / Ross",

                official: true,

                strains: [

                    "Ross 308",

                    "Ross 308 FF",

                    "Ross 308 AP",

                    "Ross 708"

                ]

            },


            /* =================================================
               AVIAGEN / ARBOR ACRES
               ================================================= */

            {

                id: "aviagen_arbor_acres",

                company: "Aviagen",

                family: "Arbor Acres",

                name: "Aviagen / Arbor Acres",

                official: true,

                strains: [

                    "Arbor Acres Plus",

                    "Arbor Acres Plus S"

                ]

            },


            /* =================================================
               AVIAGEN / INDIAN RIVER
               ================================================= */

            {

                id: "aviagen_indian_river",

                company: "Aviagen",

                family: "Indian River",

                name: "Aviagen / Indian River",

                official: true,

                strains: [

                    "Indian River",

                    "Indian River FF"

                ]

            },


            /* =================================================
               COBB
               ================================================= */

            {

                id: "cobb",

                company: "Cobb",

                family: "Cobb",

                name: "Cobb",

                official: true,

                strains: [

                    "Cobb500"

                ]

            },


            /* =================================================
               HUBBARD
               ================================================= */

            {

                id: "hubbard",

                company: "Hubbard",

                family: "Hubbard",

                name: "Hubbard",

                official: true,

                strains: [

                    "Efficiency Plus",

                    "Hubbard EDGE",

                    "Hubbard JA57",

                    "Hubbard JA57Ki",

                    "Hubbard REDBRO",

                    "Hubbard REDBRO MINI"

                ]

            },


            /* =================================================
               IRANIAN / LOCAL
               ================================================= */

            {

                id: "iranian_lines",

                company: "Iran",

                family: "Local / Iranian",

                name: "لاین‌های ایرانی",

                official: false,

                regional: true,

                note:
                    "Numerical standards must be entered only when an official breeder document is available.",

                strains: [

                    "Arian"

                ]

            }

        ]

    },


    /* =====================================================
       BREEDERS / PARENT STOCK
       مرغ مادر
       ===================================================== */

    breeder: {

        id: "breeder",

        label: "مرغ مادر",

        description:
            "Broiler breeder / parent stock genetic programs",

        genetics: [


            /* =================================================
               ROSS
               ================================================= */

            {

                id: "aviagen_ross",

                company: "Aviagen",

                family: "Ross",

                name: "Aviagen / Ross",

                official: true,

                strains: [

                    "Ross 308",

                    "Ross 308 FF",

                    "Ross 308 AP",

                    "Ross 708"

                ]

            },


            /* =================================================
               ARBOR ACRES
               ================================================= */

            {

                id: "aviagen_arbor_acres",

                company: "Aviagen",

                family: "Arbor Acres",

                name: "Aviagen / Arbor Acres",

                official: true,

                strains: [

                    "Arbor Acres Plus",

                    "Arbor Acres Plus S"

                ]

            },


            /* =================================================
               INDIAN RIVER
               ================================================= */

            {

                id: "aviagen_indian_river",

                company: "Aviagen",

                family: "Indian River",

                name: "Aviagen / Indian River",

                official: true,

                strains: [

                    "Indian River",

                    "Indian River FF"

                ]

            },


            /* =================================================
               COBB
               ================================================= */

            {

                id: "cobb",

                company: "Cobb",

                family: "Cobb",

                name: "Cobb",

                official: true,

                strains: [

                    "Cobb500",

                    "Cobb500 FF",

                    "Cobb500 SF"

                ]

            },


            /* =================================================
               HUBBARD
               ================================================= */

            {

                id: "hubbard",

                company: "Hubbard",

                family: "Hubbard",

                name: "Hubbard",

                official: true,

                strains: [

                    "Efficiency Plus",

                    "Hubbard EDGE",

                    "Hubbard JA57",

                    "Hubbard JA57Ki",

                    "Hubbard REDBRO",

                    "Hubbard REDBRO MINI"

                ]

            },


            /* =================================================
               LOHMANN
               ================================================= */

            {

                id: "lohmann",

                company: "Lohmann Breeders",

                family: "Lohmann",

                name: "Lohmann",

                official: true,

                strains: [

                    "Lohmann Brown-Classic",

                    "Lohmann LSL-Classic"

                ]

            }

        ]

    },


    /* =====================================================
       LAYERS
       تخمگذار
       ===================================================== */

    layer: {

        id: "layer",

        label: "تخم‌گذار",

        description:
            "Commercial layer genetic programs",

        genetics: [


            /* =================================================
               HY-LINE
               ================================================= */

            {

                id: "hyline",

                company: "Hy-Line",

                family: "Hy-Line",

                name: "Hy-Line",

                official: true,

                strains: [

                    "W-36",

                    "W-80",

                    "Brown",

                    "Brown Max"

                ]

            },


            /* =================================================
               HENDRIX GENETICS
               ================================================= */

            {

                id: "hendrix",

                company: "Hendrix Genetics",

                family: "Hendrix",

                name: "Hendrix Genetics",

                official: true,

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

                    "Hisex Brown",

                    "Babcock White",

                    "Babcock B-400"

                ]

            },


            /* =================================================
               LOHMANN
               ================================================= */

            {

                id: "lohmann",

                company: "Lohmann Breeders",

                family: "Lohmann",

                name: "Lohmann",

                official: true,

                strains: [

                    "Lohmann Brown-Classic",

                    "Lohmann Brown-Lite",

                    "Lohmann Brown-Extra",

                    "Lohmann LSL-Classic",

                    "Lohmann LSL-Lite",

                    "Lohmann LSL-Extra",

                    "Lohmann LSL-Ultra Lite",

                    "Lohmann Sandy",

                    "Lohmann Silver",

                    "Lohmann Tradition"

                ]

            },


            /* =================================================
               NOVOGEN
               ================================================= */

            {

                id: "novogen",

                company: "NOVOgen",

                family: "NOVOgen",

                name: "NOVOgen",

                official: true,

                strains: [

                    "NOVOgen Brown",

                    "NOVOgen White",

                    "NOVOgen Color"

                ]

            },


            /* =================================================
               TETRA
               ================================================= */

            {

                id: "tetra",

                company: "TETRA",

                family: "TETRA",

                name: "TETRA",

                official: true,

                strains: [

                    "TETRA Brown"

                ]

            }

        ]

    },


    /* =====================================================
       PULLETS
       پولت
       ===================================================== */

    pullet: {

        id: "pullet",

        label: "پولت",

        description:
            "Rearing / growing phase of layer genetics",

        genetics: [


            /* =================================================
               HY-LINE
               ================================================= */

            {

                id: "hyline",

                company: "Hy-Line",

                family: "Hy-Line",

                name: "Hy-Line",

                official: true,

                strains: [

                    "W-36",

                    "W-80",

                    "Brown",

                    "Brown Max"

                ]

            },


            /* =================================================
               HENDRIX
               ================================================= */

            {

                id: "hendrix",

                company: "Hendrix Genetics",

                family: "Hendrix",

                name: "Hendrix Genetics",

                official: true,

                strains: [

                    "ISA Brown",

                    "ISA White",

                    "Dekalb White",

                    "Dekalb Brown",

                    "Bovans White",

                    "Bovans Brown",

                    "Hisex White",

                    "Hisex Brown",

                    "Babcock White"

                ]

            },


            /* =================================================
               LOHMANN
               ================================================= */

            {

                id: "lohmann",

                company: "Lohmann Breeders",

                family: "Lohmann",

                name: "Lohmann",

                official: true,

                strains: [

                    "Lohmann Brown-Classic",

                    "Lohmann Brown-Lite",

                    "Lohmann LSL-Classic",

                    "Lohmann LSL-Lite"

                ]

            },


            /* =================================================
               NOVOGEN
               ================================================= */

            {

                id: "novogen",

                company: "NOVOgen",

                family: "NOVOgen",

                name: "NOVOgen",

                official: true,

                strains: [

                    "NOVOgen Brown",

                    "NOVOgen White",

                    "NOVOgen Color"

                ]

            }

        ]

    }

};


/* =========================================================
   HELPERS
   ========================================================= */


/**
 * Return complete catalog for a production type.
 *
 * @param {string} productionType
 * @returns {object|null}
 */
function getPoultryCatalog(
    productionType
) {

    if (
        !productionType ||
        !POULTRY_CATALOG[
            productionType
        ]
    ) {

        return null;

    }

    return POULTRY_CATALOG[
        productionType
    ];

}


/**
 * Return all genetic companies for
 * a production type.
 *
 * @param {string} productionType
 * @returns {Array}
 */
function getPoultryGenetics(
    productionType
) {

    const catalog =
        getPoultryCatalog(
            productionType
        );

    if (
        !catalog ||
        !Array.isArray(
            catalog.genetics
        )
    ) {

        return [];

    }

    return catalog.genetics;

}


/**
 * Return all strains for a production type.
 *
 * @param {string} productionType
 * @returns {Array}
 */
function getPoultryStrains(
    productionType
) {

    const genetics =
        getPoultryGenetics(
            productionType
        );

    const strains = [];

    genetics.forEach(
        genetic => {

            if (
                !Array.isArray(
                    genetic.strains
                )
            ) {

                return;

            }

            genetic.strains.forEach(
                strain => {

                    strains.push({

                        id:
                            `${genetic.id}__${normalizeGeneticId(strain)}`,

                        companyId:
                            genetic.id,

                        company:
                            genetic.name,

                        strain,

                        official:
                            genetic.official === true,

                        regional:
                            genetic.regional === true

                    });

                }
            );

        }
    );

    return strains;

}


/**
 * Find genetic company by id.
 *
 * @param {string} productionType
 * @param {string} geneticId
 * @returns {object|null}
 */
function getPoultryGenetic(
    productionType,
    geneticId
) {

    const genetics =
        getPoultryGenetics(
            productionType
        );

    return (
        genetics.find(
            item =>
                item.id ===
                geneticId
        ) ||
        null
    );

}


/**
 * Find a strain inside a production type.
 *
 * @param {string} productionType
 * @param {string} strainName
 * @returns {object|null}
 */
function findPoultryStrain(
    productionType,
    strainName
) {

    if (
        !strainName
    ) {

        return null;

    }

    const genetics =
        getPoultryGenetics(
            productionType
        );

    const normalized =
        normalizeGeneticName(
            strainName
        );

    for (
        const genetic of genetics
    ) {

        if (
            !Array.isArray(
                genetic.strains
            )
        ) {

            continue;

        }

        const match =
            genetic.strains.find(
                strain =>
                    normalizeGeneticName(
                        strain
                    ) === normalized
            );

        if (match) {

            return {

                companyId:
                    genetic.id,

                company:
                    genetic.name,

                family:
                    genetic.family,

                strain:
                    match,

                official:
                    genetic.official === true,

                regional:
                    genetic.regional === true

            };

        }

    }

    return null;

}


/**
 * Normalize genetic names for
 * reliable matching.
 */
function normalizeGeneticName(
    value
) {

    return String(
        value || ""
    )

        .trim()

        .toLowerCase()

        .replace(
            /[_-]+/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        );

}


/**
 * Create safe ID from genetic name.
 */
function normalizeGeneticId(
    value
) {

    return normalizeGeneticName(
        value
    )

        .replace(
            /[^a-z0-9\u0600-\u06ff]+/gi,
            "_"
        )

        .replace(
            /^_+|_+$/g,
            ""
        );

}


/* =========================================================
   BACKWARD COMPATIBILITY
   ---------------------------------------------------------
   Existing pages may use the old catalog structure.
   These aliases prevent the genetics UI from breaking.
   ========================================================= */

if (
    typeof window !==
    "undefined"
) {

    window.POULTRY_CATALOG =
        POULTRY_CATALOG;

    window.getPoultryCatalog =
        getPoultryCatalog;

    window.getPoultryGenetics =
        getPoultryGenetics;

    window.getPoultryStrains =
        getPoultryStrains;

    window.getPoultryGenetic =
        getPoultryGenetic;

    window.findPoultryStrain =
        findPoultryStrain;

}


/* =========================================================
   END OF FILE
   ========================================================= */
