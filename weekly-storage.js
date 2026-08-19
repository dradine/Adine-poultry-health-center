/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY LOCAL DATA STORAGE
   ========================================================= */

const WEEKLY_STORAGE_KEY =
    "adine_poultry_weekly_records";


function getWeeklyRecords() {

    try {

        const raw =
            localStorage.getItem(
                WEEKLY_STORAGE_KEY
            );


        if (!raw) {

            return [];

        }


        const data =
            JSON.parse(raw);


        return Array.isArray(data)
            ? data
            : [];

    }

    catch (error) {

        console.error(
            "Weekly storage read error:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE
   ========================================================= */

function saveWeeklyRecord(
    record
) {

    const records =
        getWeeklyRecords();


    const newRecord = {

        ...record,

        id:
            record.id ||
            crypto.randomUUID(),

        createdAt:
            record.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const index =
        records.findIndex(
            item =>
                item.id ===
                newRecord.id
        );


    if (index >= 0) {

        records[index] =
            newRecord;

    }

    else {

        records.push(
            newRecord
        );

    }


    localStorage.setItem(

        WEEKLY_STORAGE_KEY,

        JSON.stringify(
            records
        )

    );


    return newRecord;

}


/* =========================================================
   DELETE
   ========================================================= */

function deleteWeeklyRecord(
    id
) {

    const records =
        getWeeklyRecords();


    const filtered =
        records.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(

        WEEKLY_STORAGE_KEY,

        JSON.stringify(
            filtered
        )

    );


    return true;

}


/* =========================================================
   FIND
   ========================================================= */

function getWeeklyRecord(
    id
) {

    return getWeeklyRecords()
        .find(
            item =>
                item.id === id
        ) || null;

}


/* =========================================================
   FARM RECORDS
   ========================================================= */

function getFarmWeeklyRecords(
    farmId
) {

    return getWeeklyRecords()
        .filter(
            item =>
                item.farmId ===
                farmId
        );

}


/* =========================================================
   FLOCK RECORDS
   ========================================================= */

function getFlockWeeklyRecords(
    flockId
) {

    return getWeeklyRecords()
        .filter(
            item =>
                item.flockId ===
                flockId
        )
        .sort(
            (a, b) =>
                Number(a.ageDays || 0) -
                Number(b.ageDays || 0)
        );

}
