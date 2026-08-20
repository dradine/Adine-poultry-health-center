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
   PROFESSIONAL STANDARD RESOLUTION ENGINE
   ---------------------------------------------------------
   Policy:
   1) Use official breeder performance data whenever available.
   2) If a metric is not officially documented, use a clearly
      labelled MANAGEMENT standard. Never fabricate a genetic
      value and never silently borrow another strain's curve.
   3) Standards are metric-level, so one chart can legitimately
      use an official weight target and a management target for CV.
   4) No extrapolation outside a documented curve unless the
      management profile explicitly covers that age range.
========================================================= */

const PERFORMANCE_METRICS = {
    ageDays: { label: "سن", unit: "روز", direction: "neutral" },
    bodyWeight: { label: "وزن بدن", unit: "g", direction: "higher" },
    dailyGain: { label: "افزایش وزن روزانه", unit: "g/day", direction: "higher" },
    dailyFeed: { label: "مصرف دان روزانه", unit: "g/bird/day", direction: "lower" },
    cumulativeFeed: { label: "دان تجمعی", unit: "g/bird", direction: "lower" },
    fcr: { label: "FCR", unit: "kg/kg", direction: "lower" },
    livability: { label: "زنده‌مانی", unit: "%", direction: "higher" },
    mortality: { label: "تلفات", unit: "%", direction: "lower" },
    uniformity10: { label: "یکنواختی ±10%", unit: "%", direction: "higher" },
    uniformity15: { label: "یکنواختی ±15%", unit: "%", direction: "higher" },
    cv: { label: "CV", unit: "%", direction: "lower" },
    dailyWater: { label: "مصرف آب روزانه", unit: "mL/bird/day", direction: "lower" },
    eggProduction: { label: "تولید تخم‌مرغ", unit: "%", direction: "higher" },
    henDayProduction: { label: "Hen-Day", unit: "%", direction: "higher" },
    eggWeight: { label: "وزن تخم‌مرغ", unit: "g", direction: "higher" },
    eggMass: { label: "Egg Mass", unit: "g/hen/day", direction: "higher" },
    cumulativeEggs: { label: "تخم تجمعی", unit: "egg/hen", direction: "higher" },
    fertility: { label: "نطفه‌داری", unit: "%", direction: "higher" },
    hatchability: { label: "جوجه‌درآوری", unit: "%", direction: "higher" }
};

function standardRecord(ageDays, values = {}) {
    return { ageDays: Number(ageDays), ...values };
}

/* Official values intentionally limited to values we can trace to breeder documents. */
const VERIFIED_STANDARDS = {
    broiler: {
        aviagen_ross: {
            "Ross 308": {
                sourceYear: 2022,
                sourceType: "official-performance-objective",
                sourceLabel: "Aviagen Ross 308 Broiler Performance Objectives 2022 (As-Hatched)",
                sourceUrl: "https://aviagen.com/na/brands/ross/products/ross-308",
                notes: "As-hatched performance; official breeder objective. Weight, daily intake, cumulative intake and cumulative FCR are used where documented.",
                records: [
                    standardRecord(1,  { bodyWeight: 62,  dailyFeed: 12, cumulativeFeed: 12,  fcr: 0.196 }),
                    standardRecord(7,  { bodyWeight: 213, dailyFeed: 35, cumulativeFeed: 166, fcr: 0.780 }),
                    standardRecord(14, { bodyWeight: 533, dailyFeed: 67, cumulativeFeed: 535, fcr: 1.005 }),
                    standardRecord(21, { bodyWeight: 978, dailyFeed: 99, cumulativeFeed: 1117, fcr: 1.142 }),
                    standardRecord(28, { bodyWeight: 1536, dailyFeed: 145, cumulativeFeed: 2051, fcr: 1.269 }),
                    standardRecord(35, { bodyWeight: 2296, dailyFeed: 180, cumulativeFeed: 3211, fcr: 1.399 }),
                    standardRecord(42, { bodyWeight: 2998, dailyFeed: 207, cumulativeFeed: 4586, fcr: 1.531 }),
                    standardRecord(49, { bodyWeight: 3681, dailyFeed: 225, cumulativeFeed: 6115, fcr: 1.663 }),
                    standardRecord(56, { bodyWeight: 4318, dailyFeed: 234, cumulativeFeed: 7733, fcr: 1.793 })
                ]
            }
        }
    },
    layer: {
        hyline: {
            "W-80": {
                sourceYear: 2026,
                sourceType: "official-performance-standard",
                sourceLabel: "Hy-Line W-80 Commercial Layers Performance Standards 2026 (مرکز بازه‌های رسمی وزن)",
                sourceUrl: "https://www.hyline.com/filesimages/Hy-Line-Products/Hy-Line-Product-PDFs/W-80/80%20STD%20ENG.pdf",
                records: [
                    standardRecord(119, { bodyWeight: 1240 }),
                    standardRecord(182, { bodyWeight: 1532.5 }),
                    standardRecord(224, { bodyWeight: 1615 }),
                    standardRecord(490, { bodyWeight: 1683 }),
                    standardRecord(700, { bodyWeight: 1714.5 })
                ]
            }
        }
    },
    pullet: {
        hyline: {
            "W-80": {
                sourceYear: 2026,
                sourceType: "official-performance-standard",
                sourceLabel: "Hy-Line W-80 Commercial Layers Performance Standards 2026 (مرکز بازه‌های رسمی وزن)",
                sourceUrl: "https://www.hyline.com/filesimages/Hy-Line-Products/Hy-Line-Product-PDFs/W-80/80%20STD%20ENG.pdf",
                records: [
                    standardRecord(119, { bodyWeight: 1240 })
                ]
            }
        }
    }
};

/*
   MANAGEMENT TARGETS
   These are deliberately labelled as management standards.
   They are operational targets for monitoring, not genetic claims.
   The clinic can revise them by version without altering historical records.
*/
const MANAGEMENT_STANDARD_VERSION = "2026.1";

const MANAGEMENT_STANDARDS = {
    broiler: {
        sourceLabel: "استاندارد مدیریتی گوشتی — مرکز تخصصی سلامت طیور آدینه",
        sourceType: "management-standard",
        version: MANAGEMENT_STANDARD_VERSION,
        waterFeedRatioBase: 2.0,
        notes: "آب به‌عنوان هدف مدیریتی پایه بر مبنای حدود 2 برابر دان روزانه تنظیم شده و باید با دما، رطوبت، کیفیت آب، الکترولیت و شرایط فارم تفسیر شود.",
        records: [
            standardRecord(1,  { bodyWeight: 42, dailyFeed: 13, dailyWater: 26, fcr: 0.23, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(7,  { bodyWeight: 190, dailyFeed: 35, dailyWater: 70, fcr: 0.90, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(14, { bodyWeight: 490, dailyFeed: 70, dailyWater: 140, fcr: 1.05, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(21, { bodyWeight: 900, dailyFeed: 105, dailyWater: 210, fcr: 1.20, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(28, { bodyWeight: 1400, dailyFeed: 145, dailyWater: 290, fcr: 1.35, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(35, { bodyWeight: 1950, dailyFeed: 175, dailyWater: 350, fcr: 1.45, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(42, { bodyWeight: 2500, dailyFeed: 195, dailyWater: 390, fcr: 1.55, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(49, { bodyWeight: 3050, dailyFeed: 210, dailyWater: 420, fcr: 1.65, cv: 10, uniformity10: 68, uniformity15: 86 }),
            standardRecord(56, { bodyWeight: 3600, dailyFeed: 220, dailyWater: 440, fcr: 1.75, cv: 10, uniformity10: 68, uniformity15: 86 })
        ]
    },
    layer: {
        sourceLabel: "استاندارد مدیریتی تخم‌گذار — مرکز تخصصی سلامت طیور آدینه",
        sourceType: "management-standard",
        version: MANAGEMENT_STANDARD_VERSION,
        waterFeedRatioBase: 2.0,
        notes: "آب به‌عنوان هدف مدیریتی پایه بر مبنای حدود 2 برابر دان روزانه تنظیم شده و باید با دما، رطوبت، کیفیت آب، الکترولیت و شرایط فارم تفسیر شود.",
        records: [
            standardRecord(119, { bodyWeight: 1240, dailyFeed: 85, dailyWater: 170, fcr: 1.95, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(140, { bodyWeight: 1450, dailyFeed: 95, dailyWater: 190, fcr: 1.90, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(168, { bodyWeight: 1550, dailyFeed: 102, dailyWater: 205, fcr: 1.90, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(182, { bodyWeight: 1600, dailyFeed: 105, dailyWater: 210, fcr: 1.90, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(224, { bodyWeight: 1650, dailyFeed: 108, dailyWater: 216, fcr: 1.95, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(280, { bodyWeight: 1700, dailyFeed: 110, dailyWater: 220, fcr: 1.95, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(350, { bodyWeight: 1750, dailyFeed: 112, dailyWater: 224, fcr: 2.00, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(420, { bodyWeight: 1800, dailyFeed: 113, dailyWater: 226, fcr: 2.00, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(490, { bodyWeight: 1850, dailyFeed: 114, dailyWater: 228, fcr: 2.00, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(700, { bodyWeight: 1900, dailyFeed: 115, dailyWater: 230, fcr: 2.05, cv: 8, uniformity10: 80, uniformity15: 90 })
        ]
    },
    pullet: {
        sourceLabel: "استاندارد مدیریتی پولت — مرکز تخصصی سلامت طیور آدینه",
        sourceType: "management-standard",
        version: MANAGEMENT_STANDARD_VERSION,
        waterFeedRatioBase: 2.0,
        notes: "آب به‌عنوان هدف مدیریتی پایه بر مبنای حدود 2 برابر دان روزانه تنظیم شده و باید با دما، رطوبت، کیفیت آب، الکترولیت و شرایط فارم تفسیر شود.",
        records: [
            standardRecord(1, { bodyWeight: 42, dailyFeed: 12, dailyWater: 24, fcr: 1.70, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(28, { bodyWeight: 270, dailyFeed: 28, dailyWater: 56, fcr: 1.80, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(56, { bodyWeight: 590, dailyFeed: 48, dailyWater: 96, fcr: 1.90, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(84, { bodyWeight: 910, dailyFeed: 62, dailyWater: 124, fcr: 2.00, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(112, { bodyWeight: 1160, dailyFeed: 72, dailyWater: 144, fcr: 2.10, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(119, { bodyWeight: 1240, dailyFeed: 78, dailyWater: 156, fcr: 2.15, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(126, { bodyWeight: 1320, dailyFeed: 82, dailyWater: 164, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 })
        ]
    },
    breeder: {
        sourceLabel: "استاندارد مدیریتی مرغ مادر — مرکز تخصصی سلامت طیور آدینه",
        sourceType: "management-standard",
        version: MANAGEMENT_STANDARD_VERSION,
        waterFeedRatioBase: 2.0,
        notes: "آب به‌عنوان هدف مدیریتی پایه بر مبنای حدود 2 برابر دان روزانه تنظیم شده و باید با دما، رطوبت، کیفیت آب، الکترولیت و شرایط فارم تفسیر شود.",
        records: [
            standardRecord(1, { bodyWeight: 42, dailyFeed: 13, dailyWater: 26, fcr: 1.70, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(28, { bodyWeight: 380, dailyFeed: 40, dailyWater: 80, fcr: 1.80, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(56, { bodyWeight: 780, dailyFeed: 62, dailyWater: 124, fcr: 1.90, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(84, { bodyWeight: 1180, dailyFeed: 78, dailyWater: 156, fcr: 2.00, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(112, { bodyWeight: 1580, dailyFeed: 92, dailyWater: 184, fcr: 2.10, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(140, { bodyWeight: 1850, dailyFeed: 105, dailyWater: 210, fcr: 2.15, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(168, { bodyWeight: 2050, dailyFeed: 110, dailyWater: 220, fcr: 2.15, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(182, { bodyWeight: 2150, dailyFeed: 112, dailyWater: 224, fcr: 2.15, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(224, { bodyWeight: 2450, dailyFeed: 115, dailyWater: 230, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(280, { bodyWeight: 2850, dailyFeed: 118, dailyWater: 236, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(350, { bodyWeight: 3200, dailyFeed: 120, dailyWater: 240, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(420, { bodyWeight: 3400, dailyFeed: 122, dailyWater: 244, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(490, { bodyWeight: 3500, dailyFeed: 123, dailyWater: 246, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 }),
            standardRecord(560, { bodyWeight: 3550, dailyFeed: 124, dailyWater: 248, fcr: 2.20, cv: 8, uniformity10: 80, uniformity15: 90 })
        ]
    }
};

const STANDARD_SOURCES = {
    aviagen: "Official Aviagen technical resources",
    hyline: "Official Hy-Line technical resources",
    cobb: "Official Cobb technical resources",
    lohmann: "Official Lohmann Breeders technical resources",
    management: "استاندارد مدیریتی مرکز تخصصی سلامت طیور آدینه"
};

function normalizeStandardKey(value) {
    return String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function getCatalog(type) { return POULTRY_CATALOG[type] || null; }
function getGenetics(type) { return POULTRY_CATALOG[type]?.genetics || []; }
function getStrains(type, geneticsId) {
    return getGenetics(type).find(item => item.id === geneticsId)?.strains || [];
}

function resolveGeneticsAndStrain(type, geneticsId, strain) {
    const catalog = getCatalog(type);
    const rawGenetics = String(geneticsId || "").trim();
    const rawStrain = String(strain || "").trim();
    if (!catalog) return { geneticsId: rawGenetics, strain: rawStrain };
    const direct = catalog.genetics.find(g => g.id === rawGenetics);
    if (direct) return { geneticsId: rawGenetics, strain: rawStrain || direct.strains[0] || "" };
    const wanted = normalizeStandardKey(rawStrain || rawGenetics);
    const found = catalog.genetics.find(g => g.strains.some(s => normalizeStandardKey(s) === wanted));
    return found ? { geneticsId: found.id, strain: rawStrain || found.strains[0] || "" } : { geneticsId: rawGenetics, strain: rawStrain };
}

function getOfficialStandard(type, geneticsId, strain) {
    const r = resolveGeneticsAndStrain(type, geneticsId, strain);
    return VERIFIED_STANDARDS[type]?.[r.geneticsId]?.[r.strain] || null;
}

function getManagementStandard(type) {
    return MANAGEMENT_STANDARDS[type] || MANAGEMENT_STANDARDS.broiler;
}

function getStandard(type, geneticsId, strain) {
    const official = getOfficialStandard(type, geneticsId, strain);
    const management = getManagementStandard(type);
    return {
        type,
        geneticsId: resolveGeneticsAndStrain(type, geneticsId, strain).geneticsId,
        strain: resolveGeneticsAndStrain(type, geneticsId, strain).strain,
        official,
        management,
        sourceType: official ? "mixed-official-management" : "management-standard",
        sourceLabel: official ? "استاندارد ژنتیکی رسمی + استاندارد مدیریتی برای شاخص‌های فاقد مرجع رسمی" : management.sourceLabel,
        sourceYear: official?.sourceYear || null,
        version: official?.sourceYear || management.version
    };
}

function interpolate(points, age) {
    const valid = points.map(p => ({ age: Number(p.ageDays), value: Number(p.value) })).filter(p => Number.isFinite(p.age) && Number.isFinite(p.value)).sort((a,b) => a.age-b.age);
    if (!valid.length || !Number.isFinite(age)) return null;
    if (age < valid[0].age || age > valid[valid.length - 1].age) return null;
    const exact = valid.find(p => p.age === age);
    if (exact) return exact.value;
    for (let i=1; i<valid.length; i++) {
        const a=valid[i-1], b=valid[i];
        if (age >= a.age && age <= b.age) {
            const t=(age-a.age)/(b.age-a.age);
            return a.value + (b.value-a.value)*t;
        }
    }
    return null;
}

function getStandardMetricAtAge(standard, metric, ageDays) {
    if (!standard) return { value: null, sourceType: null, sourceLabel: null, isFallback: false };
    const age = Number(ageDays);
    const officialPoints = standard.official?.records || [];
    const managementPoints = standard.management?.records || [];
    const official = interpolate(officialPoints.map(r => ({ ageDays:r.ageDays, value:r[metric] })), age);
    if (official !== null) {
        return { value: official, sourceType: standard.official.sourceType, sourceLabel: standard.official.sourceLabel, isFallback: false };
    }
    const management = interpolate(managementPoints.map(r => ({ ageDays:r.ageDays, value:r[metric] })), age);
    if (management !== null) {
        return { value: management, sourceType: standard.management.sourceType, sourceLabel: standard.management.sourceLabel, isFallback: Boolean(standard.official) };
    }
    return { value: null, sourceType: null, sourceLabel: null, isFallback: false };
}

function getStandardValueAtAge(standard, metric, ageDays) {
    return getStandardMetricAtAge(standard, metric, ageDays).value;
}

function getStandardLabelAtAge(standard, metric, ageDays) {
    const result = getStandardMetricAtAge(standard, metric, ageDays);
    if (!result.value && result.value !== 0) return "بدون استاندارد";
    return result.sourceType === "management-standard" ? "استاندارد مدیریتی" : "استاندارد ژنتیکی رسمی";
}

function getStandardMeta(standard, metric, ageDays) {
    return getStandardMetricAtAge(standard, metric, ageDays);
}

if (typeof window !== "undefined") {
    window.PERFORMANCE_METRICS = PERFORMANCE_METRICS;
    window.VERIFIED_STANDARDS = VERIFIED_STANDARDS;
    window.MANAGEMENT_STANDARDS = MANAGEMENT_STANDARDS;
    window.getOfficialStandard = getOfficialStandard;
    window.getManagementStandard = getManagementStandard;
    window.getStandard = getStandard;
    window.getStandardValueAtAge = getStandardValueAtAge;
    window.getStandardMetricAtAge = getStandardMetricAtAge;
    window.getStandardLabelAtAge = getStandardLabelAtAge;
    window.getStandardMeta = getStandardMeta;
}
