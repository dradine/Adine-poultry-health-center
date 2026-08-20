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


    return {

        flock,

        records

    };

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
