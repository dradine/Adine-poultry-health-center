/* =========================================================
   ADINE POULTRY HEALTH CENTER
   APP CORE
   ========================================================= */

const APP_CONFIG = {

    name:
        "مرکز تخصصی سلامت طیور آدینه",

    shortName:
        "آدینه",

    version:
        "1.0.0",

    storagePrefix:
        "adine_poultry_"

};


/* =========================================================
   SAFE ID
   ========================================================= */

function createId(prefix = "id") {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {

        return `${prefix}_${crypto.randomUUID()}`;

    }

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


/* =========================================================
   STORAGE
   ========================================================= */

function storageKey(name) {

    return APP_CONFIG.storagePrefix + name;

}


function readStorage(
    name,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(
                storageKey(name)
            );

        if (!value) {

            return fallback;

        }

        return JSON.parse(value);

    }

    catch (error) {

        console.error(
            "Storage read error:",
            error
        );

        return fallback;

    }

}


function writeStorage(
    name,
    value
) {

    try {

        localStorage.setItem(
            storageKey(name),
            JSON.stringify(value)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Storage write error:",
            error
        );

        return false;

    }

}


/* =========================================================
   FARMS
   ========================================================= */

function getFarms() {

    return readStorage(
        "farms",
        []
    );

}


function saveFarm(
    farm
) {

    const farms =
        getFarms();


    const item = {

        id:
            farm.id ||
            createId("farm"),

        name:
            String(
                farm.name || ""
            ).trim(),

        code:
            String(
                farm.code || ""
            ).trim(),

        location:
            String(
                farm.location || ""
            ).trim(),

        owner:
            String(
                farm.owner || ""
            ).trim(),

        manager:
            String(
                farm.manager || ""
            ).trim(),

        type:
            farm.type ||
            "",

        capacity:
            Number(
                farm.capacity || 0
            ),

        notes:
            farm.notes ||
            "",

        createdAt:
            farm.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const index =
        farms.findIndex(
            x =>
                x.id === item.id
        );


    if (index >= 0) {

        farms[index] =
            item;

    }

    else {

        farms.push(
            item
        );

    }


    writeStorage(
        "farms",
        farms
    );


    return item;

}


function deleteFarm(
    farmId
) {

    const farms =
        getFarms()
            .filter(
                farm =>
                    farm.id !== farmId
            );


    writeStorage(
        "farms",
        farms
    );


    return true;

}


/* =========================================================
   HOUSES
   ========================================================= */

function getHouses() {

    return readStorage(
        "houses",
        []
    );

}


function getFarmHouses(
    farmId
) {

    return getHouses()
        .filter(
            house =>
                house.farmId ===
                farmId
        );

}


function saveHouse(
    house
) {

    const houses =
        getHouses();


    const item = {

        id:
            house.id ||
            createId("house"),

        farmId:
            house.farmId,

        name:
            String(
                house.name || ""
            ).trim(),

        code:
            String(
                house.code || ""
            ).trim(),

        capacity:
            Number(
                house.capacity || 0
            ),

        length:
            Number(
                house.length || 0
            ),

        width:
            Number(
                house.width || 0
            ),

        ventilation:
            house.ventilation ||
            "",

        housingSystem:
            house.housingSystem ||
            "",

        notes:
            house.notes ||
            "",

        createdAt:
            house.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const index =
        houses.findIndex(
            x =>
                x.id === item.id
        );


    if (index >= 0) {

        houses[index] =
            item;

    }

    else {

        houses.push(
            item
        );

    }


    writeStorage(
        "houses",
        houses
    );


    return item;

}


/* =========================================================
   FLOCKS
   ========================================================= */

function getFlocks() {

    return readStorage(
        "flocks",
        []
    );

}


function getHouseFlocks(
    houseId
) {

    return getFlocks()
        .filter(
            flock =>
                flock.houseId ===
                houseId
        );

}


function saveFlock(
    flock
) {

    const flocks =
        getFlocks();


    const item = {

        id:
            flock.id ||
            createId("flock"),

        farmId:
            flock.farmId,

        houseId:
            flock.houseId,

        flockName:
            String(
                flock.flockName || ""
            ).trim(),

        flockCode:
            String(
                flock.flockCode || ""
            ).trim(),

        productionType:
            flock.productionType ||
            "",

        genetics:
            flock.genetics ||
            "",

        strain:
            flock.strain ||
            "",

        program:
            flock.program ||
            "",

        sex:
            flock.sex ||
            "mixed",

        birdCount:
            Number(
                flock.birdCount || 0
            ),

        placementDate:
            flock.placementDate ||
            "",

        startAgeDays:
            Number(
                flock.startAgeDays || 1
            ),

        status:
            flock.status ||
            "active",

        notes:
            flock.notes ||
            "",

        createdAt:
            flock.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const index =
        flocks.findIndex(
            x =>
                x.id === item.id
        );


    if (index >= 0) {

        flocks[index] =
            item;

    }

    else {

        flocks.push(
            item
        );

    }


    writeStorage(
        "flocks",
        flocks
    );


    return item;

}


/* =========================================================
   CURRENT SELECTION
   ========================================================= */

function getCurrentSelection() {

    return readStorage(
        "current_selection",
        {}
    );

}


function setCurrentSelection(
    selection
) {

    return writeStorage(
        "current_selection",
        {

            ...getCurrentSelection(),

            ...selection

        }
    );

}


function clearCurrentSelection() {

    localStorage.removeItem(
        storageKey(
            "current_selection"
        )
    );

}


/* =========================================================
   DATE
   ========================================================= */

function todayISO() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


/* =========================================================
   AGE
   ========================================================= */

function calculateAgeDays(
    placementDate,
    targetDate = todayISO()
) {

    if (
        !placementDate ||
        !targetDate
    ) {

        return null;

    }


    const start =
        new Date(
            placementDate +
            "T00:00:00"
        );


    const target =
        new Date(
            targetDate +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            start.getTime()
        ) ||
        Number.isNaN(
            target.getTime()
        )
    ) {

        return null;

    }


    return Math.max(
        0,
        Math.floor(
            (
                target.getTime() -
                start.getTime()
            )
            /
            86400000
        )
    );

}


function daysToWeeks(
    days
) {

    const d =
        Number(days);


    if (
        !Number.isFinite(d)
    ) {

        return null;

    }


    return d / 7;

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
