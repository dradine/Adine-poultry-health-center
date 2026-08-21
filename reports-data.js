/* =========================================================
   ADINE POULTRY HEALTH CENTER
   REPORTS DATA - SUPABASE
   ========================================================= */

"use strict";


let reportsCurrentUser = null;


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeReportsData() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (error || !data?.user) {

        throw new Error(
            "کاربر وارد نشده است."
        );

    }


    reportsCurrentUser =
        data.user;


    return reportsCurrentUser;

}


/* =========================================================
   GET FLOCK
   ========================================================= */

async function getReportFlock(
    flockId
) {

    if (!flockId) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("flocks")
            .select(`
                *,
                farms (
                    id,
                    name
                ),
                houses (
                    id,
                    name
                )
            `)
            .eq(
                "id",
                flockId
            )
            .eq(
                "owner_id",
                reportsCurrentUser.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Report flock error:",
            error
        );

        throw error;

    }


    return data || null;

}


/* =========================================================
   GET WEEKLY RECORDS
   ========================================================= */

async function getReportWeeklyRecords(
    flockId
) {

    if (!flockId) {

        return [];

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("weekly_records")
            .select("*")
            .eq(
                "flock_id",
                flockId
            )
            .order(
                "week_number",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Weekly records error:",
            error
        );

        throw error;

    }


    return data || [];

}


/* =========================================================
   NORMALIZE WEEKLY RECORD
   ========================================================= */

function normalizeReportRecord(
    record
) {

    return {

        id:
            record.id,

        flockId:
            record.flock_id,

        weekNumber:
            Number(
                record.week_number ||
                0
            ),

        ageDays:
            Number(
                record.age_days ||
                (
                    Number(
                        record.week_number ||
                        0
                    ) * 7
                )
            ),

        evaluationDate:
            record.evaluation_date ||
            record.record_date ||
            null,

        liveBirds:
            record.live_birds === null ||
            record.live_birds === undefined
                ? null
                : Number(
                    record.live_birds
                ),

        mortality:
            record.mortality_count === null ||
            record.mortality_count === undefined
                ? null
                : Number(
                    record.mortality_count
                ),

        sampleCount:
            record.sample_count === null ||
            record.sample_count === undefined
                ? null
                : Number(
                    record.sample_count
                ),

        averageWeight:
            record.average_weight_g === null ||
            record.average_weight_g === undefined
                ? null
                : Number(
                    record.average_weight_g
                ),

        sd:
            record.sd_weight_g === null ||
            record.sd_weight_g === undefined
                ? null
                : Number(
                    record.sd_weight_g
                ),

        cv:
            record.cv_percent === null ||
            record.cv_percent === undefined
                ? null
                : Number(
                    record.cv_percent
                ),

        uniformity10:
            record.uniformity_10_percent === null ||
            record.uniformity_10_percent === undefined
                ? null
                : Number(
                    record.uniformity_10_percent
                ),

        uniformity15:
            record.uniformity_15_percent === null ||
            record.uniformity_15_percent === undefined
                ? null
                : Number(
                    record.uniformity_15_percent
                ),

        minWeight:
            record.min_weight_g === null ||
            record.min_weight_g === undefined
                ? null
                : Number(
                    record.min_weight_g
                ),

        maxWeight:
            record.max_weight_g === null ||
            record.max_weight_g === undefined
                ? null
                : Number(
                    record.max_weight_g
                ),

        feedTotalKg:
            record.feed_total_kg === null ||
            record.feed_total_kg === undefined
                ? null
                : Number(
                    record.feed_total_kg
                ),

        feedPerBirdG:
            record.feed_per_bird_g === null ||
            record.feed_per_bird_g === undefined
                ? null
                : Number(
                    record.feed_per_bird_g
                ),

        waterTotalLiter:
            record.water_total_liter === null ||
            record.water_total_liter === undefined
                ? null
                : Number(
                    record.water_total_liter
                ),

        waterPerBirdMl:
            record.water_per_bird_ml === null ||
            record.water_per_bird_ml === undefined
                ? null
                : Number(
                    record.water_per_bird_ml
                ),

        waterFeedRatio:
            record.water_feed_ratio === null ||
            record.water_feed_ratio === undefined
                ? null
                : Number(record.water_feed_ratio),

        productionMetrics:
            record.production_metrics && typeof record.production_metrics === "object"
                ? record.production_metrics
                : {},

        cumulativeFCR:
            record.cumulative_fcr === null ||
            record.cumulative_fcr === undefined
                ? null
                : Number(record.cumulative_fcr),

        fcr:
            null,

        standardWeight:
            null,

        weightDifference:
            null,

        weightDifferencePercent:
            null,

        notes:
            record.notes ||
            ""

    };

}


/* =========================================================
   GET COMPLETE REPORT DATA
   ========================================================= */

async function getCompleteReportData(
    flockId
) {

    const flock =
        await getReportFlock(
            flockId
        );


    if (!flock) {

        throw new Error(
            "گله موردنظر پیدا نشد."
        );

    }


    const rawRecords =
        await getReportWeeklyRecords(
            flockId
        );


    const records =
        rawRecords
            .map(
                normalizeReportRecord
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.weekNumber -
                    b.weekNumber
            );

    /*
     * Calculate standard weight and weekly FCR on the report
     * side so old database rows also receive the new metrics
     * without requiring a database migration.
     */
    const standard =
        typeof getStandard === "function"
            ? getStandard(
                flock.production_type,
                flock.genetics,
                flock.strain || flock.genetics
            )
            : null;

    let previous = null;

    records.forEach(
        record => {

            const weightMeta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "bodyWeight", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null, isFallback: false };

            record.standardWeight = weightMeta.value;
            record.standardWeightSourceType = weightMeta.sourceType;
            record.standardWeightSourceLabel = weightMeta.sourceLabel;
            record.standardWeightIsManagement =
                weightMeta.sourceType === "management-standard";

            if (
                record.standardWeight !== null &&
                record.averageWeight !== null
            ) {
                record.weightDifference =
                    record.averageWeight - record.standardWeight;

                record.weightDifferencePercent =
                    record.standardWeight !== 0
                        ? (record.weightDifference / record.standardWeight) * 100
                        : null;
            } else {
                record.weightDifference = null;
                record.weightDifferencePercent = null;
            }

            record.fcr =
                calculateReportFCR(
                    previous,
                    record,
                    flock.production_type
                );

            if (!Number.isFinite(Number(record.cumulativeFCR))) {
                record.cumulativeFCR =
                    calculateReportCumulativeFCR(
                        records,
                        record,
                        flock.production_type
                    );
            }

            const fcrMeta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "fcr", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null, isFallback: false };

            record.standardFCR = fcrMeta.value;
            record.standardFCRSourceType = fcrMeta.sourceType;
            record.standardFCRSourceLabel = fcrMeta.sourceLabel;
            record.standardFCRIsManagement =
                fcrMeta.sourceType === "management-standard";

            const feedMeta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "dailyFeed", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null };

            record.standardFeedPerBirdG = feedMeta.value;
            record.standardFeedSourceType = feedMeta.sourceType;

            const waterMeta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "dailyWater", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null };

            record.standardWaterPerBirdMl = waterMeta.value;
            record.standardWaterSourceType = waterMeta.sourceType;

            const cvMeta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "cv", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null };
            record.standardCV = cvMeta.value;
            record.standardCVSourceType = cvMeta.sourceType;

            const u10Meta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "uniformity10", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null };
            record.standardUniformity10 = u10Meta.value;
            record.standardUniformity10SourceType = u10Meta.sourceType;

            const u15Meta =
                typeof getStandardMeta === "function"
                    ? getStandardMeta(standard, "uniformity15", record.ageDays)
                    : { value: null, sourceType: null, sourceLabel: null };
            record.standardUniformity15 = u15Meta.value;
            record.standardUniformity15SourceType = u15Meta.sourceType;

            previous = record;
        }
    );


    return {

        flock,

        records,

        standard

    };

}


/* =========================================================
   LAST RECORD
   ========================================================= */

/* =========================================================
   FCR
========================================================= */

function calculateReportFCR(previous, current, productionType = "broiler") {
    const type = String(productionType || "").toLowerCase();
    if (!previous || !current) return null;
    if (type !== "broiler" && type !== "گوشتی") return null;

    const feed = Number(current.feedTotalKg);
    const ow = Number(previous.averageWeight);
    const cw = Number(current.averageWeight);
    const ob = Number(previous.liveBirds);
    const cb = Number(current.liveBirds);

    if (![feed, ow, cw, ob, cb].every(Number.isFinite) ||
        feed <= 0 || ow < 0 || cw <= 0 || ob <= 0 || cb <= 0) {
        return null;
    }

    if (typeof calculateBroilerFCR === "function") {
        return calculateBroilerFCR({
            feedKg: feed,
            openingBirds: ob,
            closingBirds: cb,
            openingAverageWeightG: ow,
            closingAverageWeightG: cw
        });
    }

    const gainKg = (cb * cw - ob * ow) / 1000;
    return gainKg > 0 ? Number((feed / gainKg).toFixed(3)) : null;
}


function calculateReportCumulativeFCR(records, current, productionType = "broiler") {
    const rows = (Array.isArray(records) ? records : [])
        .filter(r => Number(r.weekNumber) <= Number(current.weekNumber))
        .sort((a,b)=>Number(a.weekNumber)-Number(b.weekNumber));
    if (!rows.length) return null;
    const feed = rows.reduce((sum,r)=>sum+Number(r.feedTotalKg||0),0);
    if (!(feed>0)) return null;
    const type = String(productionType||"").toLowerCase();
    if (type==="layer" || type==="تخمگذار" || type==="تخم‌گذار" || type==="breeder" || type==="مادر") {
        const eggMass = rows.reduce((sum,r)=>sum+Number(r.productionMetrics?.egg_mass_kg||0),0);
        return eggMass>0 ? Number((feed/eggMass).toFixed(3)) : null;
    }
    const first=rows.find(r=>Number(r.averageWeight)>0 && Number(r.liveBirds)>0);
    const last=rows[rows.length-1];
    if(!first || !(Number(last.averageWeight)>0) || !(Number(last.liveBirds)>0)) return null;
    const gainKg=(Number(last.liveBirds)*Number(last.averageWeight)-Number(first.liveBirds)*Number(first.averageWeight))/1000;
    return gainKg>0 ? Number((feed/gainKg).toFixed(3)) : null;
}

/* =========================================================
   LAST RECORD
========================================================= */

function getLastReportRecord(
    records
) {

    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        return null;

    }


    return records[
        records.length - 1
    ];

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function reportNumber(
    value,
    decimals = 1
) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(
            Number(value)
        )
    ) {

        return "-";

    }


    return Number(
        value
    ).toLocaleString(
        "fa-IR",
        {
            minimumFractionDigits:
                decimals,

            maximumFractionDigits:
                decimals
        }
    );

}


/* =========================================================
   SAFE TEXT
   ========================================================= */

function reportText(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";

    }


    return String(
        value
    );

}
