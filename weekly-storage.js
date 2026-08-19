/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY DATA STORAGE
========================================================= */

const WEEKLY_STORAGE_NAME =
    "weekly_records";


/* =========================================================
   GET ALL
========================================================= */

function getWeeklyRecords() {

    return readStorage(
        WEEKLY_STORAGE_NAME,
        []
    );

}


/* =========================================================
   SAVE
========================================================= */

function saveWeeklyRecord(
    record
) {

    const records =
        getWeeklyRecords();


    const item = {

        ...record,

        id:
            record.id ||
            createId("weekly"),

        createdAt:
            record.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const index =
        records.findIndex(
            x =>
                x.id ===
                item.id
        );


    if (index >= 0) {

        records[index] =
            item;

    }

    else {

        records.push(
            item
        );

    }


    writeStorage(
        WEEKLY_STORAGE_NAME,
        records
    );


    return item;

}


/* =========================================================
   DELETE
========================================================= */

function deleteWeeklyRecord(
    id
) {

    const records =
        getWeeklyRecords()
            .filter(
                item =>
                    item.id !==
                    id
            );


    writeStorage(
        WEEKLY_STORAGE_NAME,
        records
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
                item.id ===
                id
        ) || null;

}


/* =========================================================
   FARM
========================================================= */

function getFarmWeeklyRecords(
    farmId
) {

    return getWeeklyRecords()
        .filter(
            item =>
                item.farmId ===
                farmId
        )
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    a.ageDays || 0
                ) -
                Number(
                    b.ageDays || 0
                )
        );

}


/* =========================================================
   FLOCK
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
            (
                a,
                b
            ) =>
                Number(
                    a.ageDays || 0
                ) -
                Number(
                    b.ageDays || 0
                )
        );

}


/* =========================================================
   AGE RECORD
========================================================= */

function getFlockRecordByAge(
    flockId,
    ageDays
) {

    return getFlockWeeklyRecords(
        flockId
    )
    .find(
        item =>
            Number(
                item.ageDays
            ) ===
            Number(ageDays)
    ) || null;

}
