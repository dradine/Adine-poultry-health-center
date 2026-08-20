/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HOUSES + FLOCKS
   SUPABASE
   ========================================================= */

let currentUser = null;
let selectedFarm = null;
let houses = [];
let flocks = [];


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeFlocks
);


async function initializeFlocks() {

    const access =
        await checkUserAccess();


    if (!access.authenticated) {

        window.location.href =
            "login.html?message=" +
            encodeURIComponent(
                "ابتدا وارد سامانه شوید."
            );

        return;

    }


    if (!access.allowed) {

        alert(
            "حساب شما هنوز توسط مدیریت تأیید نشده است."
        );

        await logoutUser();

        return;

    }


    currentUser =
        access.user;


    await loadSelectedFarm();


    setupHouseForm();

    setupFlockForm();

    setupGenetics();

}


/* =========================================================
   SELECTED FARM
   ========================================================= */

async function loadSelectedFarm() {

    const selection =
        getCurrentSelection();


    if (!selection.farmId) {

        document.getElementById(
            "selectedFarm"
        ).innerHTML = `

            <p>
                هنوز فارمی انتخاب نشده است.
            </p>

            <button
                class="btn btn-primary"
                type="button"
                onclick="location.href='Farms.html'"
            >
                انتخاب فارم
            </button>

        `;

        disableForms();

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("farms")
            .select("*")
            .eq(
                "id",
                selection.farmId
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .maybeSingle();


    if (error || !data) {

        console.error(
            "Farm loading error:",
            error
        );

        document.getElementById(
            "selectedFarm"
        ).innerHTML = `
            <p>
                فارم انتخاب‌شده پیدا نشد.
            </p>
        `;

        disableForms();

        return;

    }


    selectedFarm =
        data;


    document.getElementById(
        "selectedFarm"
    ).innerHTML = `

        <div class="farm-summary">

            <strong>
                🏭 ${escapeHTML(data.name)}
            </strong>

            <br>

            کد:
            ${escapeHTML(
                data.farm_code || "-"
            )}

            <br>

            ظرفیت:
            ${
                data.capacity
                    ? Number(
                        data.capacity
                      ).toLocaleString("fa-IR")
                    : "-"
            }

        </div>

    `;


    await loadHouses();

    await loadFlocks();

}


/* =========================================================
   HOUSES
   ========================================================= */

async function loadHouses() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("houses")
            .select("*")
            .eq(
                "farm_id",
                selectedFarm.id
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Houses loading error:",
            error
        );

        return;

    }


    houses =
        data || [];


    renderHouses();

    updateHouseSelect();

}


/* =========================================================
   HOUSE FORM
   ========================================================= */

function setupHouseForm() {

    const form =
        document.getElementById(
            "houseForm"
        );


    form.addEventListener(
        "submit",
        saveHouse
    );

}


async function saveHouse(
    event
) {

    event.preventDefault();


    if (!selectedFarm) {

        alert(
            "ابتدا یک فارم انتخاب کنید."
        );

        return;

    }


    const name =
        getValue("houseName");


    if (!name) {

        alert(
            "نام سالن را وارد کنید."
        );

        return;

    }


    const payload = {

        farm_id:
            selectedFarm.id,

        owner_id:
            currentUser.id,

        name,

        house_code:
            getValue("houseCode"),

        capacity:
            getNumber("houseCapacity"),

        length_m:
            getNumber("houseLength"),

        width_m:
            getNumber("houseWidth"),

        ventilation_type:
            getValue("houseVentilation"),

        housing_system:
            getValue("houseSystem"),

        notes:
            getValue("houseNotes"),

        is_active:
            true

    };


    const button =
        event.target.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "در حال ذخیره...";

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("houses")
                .insert(payload);


        if (error) {

            console.error(
                error
            );

            alert(
                "ذخیره سالن انجام نشد:\n" +
                error.message
            );

            return;

        }


        event.target.reset();


        await loadHouses();


        alert(
            "سالن با موفقیت ثبت شد."
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "ذخیره سالن";

        }

    }

}


/* =========================================================
   RENDER HOUSES
   ========================================================= */

function renderHouses() {

    const container =
        document.getElementById(
            "housesList"
        );


    if (!houses.length) {

        container.innerHTML = `
            <p>
                هنوز سالنی ثبت نشده است.
            </p>
        `;

        return;

    }


    container.innerHTML =

        houses
            .map(
                house => `

                    <div class="card">

                        <h3>
                            🏠
                            ${escapeHTML(
                                house.name
                            )}
                        </h3>

                        <p>
                            کد:
                            ${escapeHTML(
                                house.house_code || "-"
                            )}
                        </p>

                        <p>
                            ظرفیت:
                            ${
                                house.capacity
                                    ? Number(
                                        house.capacity
                                      ).toLocaleString("fa-IR")
                                    : "-"
                            }
                        </p>

                        <p>
                            تهویه:
                            ${escapeHTML(
                                house.ventilation_type || "-"
                            )}
                        </p>

                        <div class="button-row">

                            <button
                                class="btn btn-primary"
                                type="button"
                                onclick="
                                    selectHouse(
                                        '${house.id}'
                                    )
                                "
                            >
                                انتخاب سالن
                            </button>

                            <button
                                class="btn btn-danger"
                                type="button"
                                onclick="
                                    deleteHouse(
                                        '${house.id}'
                                    )
                                "
                            >
                                حذف
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   HOUSE SELECT
   ========================================================= */

function updateHouseSelect() {

    const select =
        document.getElementById(
            "flockHouse"
        );


    select.innerHTML = `

        <option value="">
            انتخاب سالن
        </option>

    `;


    houses.forEach(
        house => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                house.id;


            option.textContent =
                house.name;


            select.appendChild(
                option
            );

        }
    );


    const selection =
        getCurrentSelection();


    if (selection.houseId) {

        select.value =
            selection.houseId;

    }

}


function selectHouse(
    houseId
) {

    setCurrentSelection({

        farmId:
            selectedFarm.id,

        houseId,

        flockId:
            null

    });


    const select =
        document.getElementById(
            "flockHouse"
        );


    select.value =
        houseId;


    document.getElementById(
        "flockForm"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   DELETE HOUSE
   ========================================================= */

async function deleteHouse(
    houseId
) {

    const confirmed =
        confirm(
            "آیا از حذف این سالن مطمئن هستید؟"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("houses")
            .delete()
            .eq(
                "id",
                houseId
            )
            .eq(
                "owner_id",
                currentUser.id
            );


    if (error) {

        alert(
            "حذف سالن انجام نشد:\n" +
            error.message
        );

        return;

    }


    await loadHouses();


    alert(
        "سالن حذف شد."
    );

}


/* =========================================================
   GENETICS
   ========================================================= */

function setupGenetics() {

    const production =
        document.getElementById(
            "productionType"
        );


    production.addEventListener(
        "change",
        updateGenetics
    );


    updateGenetics();

}


function updateGenetics() {

    const type =
        getValue(
            "productionType"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    genetics.innerHTML = "";
    program.innerHTML = "";


    const groups = {

        broiler: [

            ["ross308", "Ross 308"],
            ["cobb500", "Cobb 500"],
            ["indianriver", "Indian River"],
            ["arbor_acres", "Arbor Acres"],
            ["arian", "آرین"]

        ],

        layer: [

            ["hyline", "Hy-Line"],
            ["lohmann", "Lohmann"],
            ["isa", "ISA"],
            ["novogen", "Novogen"],
            ["bovans", "Bovans"]

        ],

        pullet: [

            ["hyline", "Hy-Line"],
            ["lohmann", "Lohmann"],
            ["isa", "ISA"],
            ["novogen", "Novogen"],
            ["bovans", "Bovans"]

        ],

        breeder: [

            ["ross_breeder", "Ross Parent Stock"],
            ["cobb_breeder", "Cobb Parent Stock"],
            ["arbor_breeder", "Arbor Acres Parent Stock"]

        ]

    };


    const items =
        groups[type] || [];


    if (!items.length) {

        genetics.innerHTML = `

            <option value="">
                ابتدا نوع پرورش را انتخاب کنید
            </option>

        `;

        program.innerHTML = `

            <option value="">
                ابتدا نژاد / سویه را انتخاب کنید
            </option>

        `;

        return;

    }


    genetics.innerHTML = `

        <option value="">
            انتخاب سویه
        </option>

    `;


    items.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item[0];


            option.textContent =
                item[1];


            genetics.appendChild(
                option
            );

        }
    );


    genetics.onchange =
        updatePrograms;


}


function updatePrograms() {

    const type =
        getValue(
            "productionType"
        );


    const strain =
        getValue(
            "genetics"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    program.innerHTML = "";


    if (!strain) {

        program.innerHTML = `

            <option value="">
                انتخاب سویه
            </option>

        `;

        return;

    }


    const label =
        document
            .getElementById(
                "genetics"
            )
            .selectedOptions[0]
            ?.textContent || "";


    const option =
        document.createElement(
            "option"
        );


    option.value =
        `${type}_${strain}`;


    option.textContent =
        `استاندارد ${label}`;


    program.appendChild(
        option
    );

}


/* =========================================================
   FLOCKS
   ========================================================= */

async function loadFlocks() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("flocks")
            .select("*")
            .eq(
                "farm_id",
                selectedFarm.id
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Flocks loading error:",
            error
        );

        return;

    }


    flocks =
        data || [];


    renderFlocks();

}


/* =========================================================
   FLOCK FORM
   ========================================================= */

function setupFlockForm() {

    document
        .getElementById("flockForm")
        .addEventListener(
            "submit",
            saveFlock
        );

}


async function saveFlock(
    event
) {

    event.preventDefault();


    if (!selectedFarm) {

        alert(
            "ابتدا فارم را انتخاب کنید."
        );

        return;

    }


    const houseId =
        getValue(
            "flockHouse"
        );


    if (!houseId) {

        alert(
            "سالن را انتخاب کنید."
        );

        return;

    }


    const name =
        getValue(
            "flockName"
        );


    const productionType =
        getValue(
            "productionType"
        );


    if (!name || !productionType) {

        alert(
            "نام گله و نوع پرورش الزامی است."
        );

        return;

    }


    const payload = {

        farm_id:
            selectedFarm.id,

        house_id:
            houseId,

        owner_id:
            currentUser.id,

        flock_name:
            name,

        production_type:
            productionType,

        genetics:
            getValue("genetics"),

        strain:
            getValue("genetics"),

        program:
            getValue("flockProgram"),

        sex:
            getValue("flockSex") ||
            "mixed",

        initial_bird_count:
            getNumber("birdCount"),

        current_bird_count:
            getNumber("birdCount"),

        placement_date:
            getValue("placementDate") ||
            null,

        start_age_days:
            getNumber("startAgeDays"),

        status:
            "active",

        notes:
            getValue("flockNotes")

    };


    const button =
        event.target.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "در حال ذخیره...";

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("flocks")
                .insert(payload)
                .select()
                .single();


        if (error) {

            console.error(
                "Save flock error:",
                error
            );

            alert(
                "ذخیره گله انجام نشد:\n" +
                error.message
            );

            return;

        }


        setCurrentSelection({

            farmId:
                selectedFarm.id,

            houseId:
                houseId,

            flockId:
                data.id

        });


        event.target.reset();


        document.getElementById(
            "startAgeDays"
        ).value = 1;


        updateGenetics();


        await loadFlocks();


        alert(
            "گله با موفقیت ثبت شد."
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "ذخیره گله";

        }

    }

}


/* =========================================================
   RENDER FLOCKS
   ========================================================= */

function renderFlocks() {

    const container =
        document.getElementById(
            "flocksList"
        );


    if (!flocks.length) {

        container.innerHTML = `
            <p>
                هنوز گله‌ای ثبت نشده است.
            </p>
        `;

        return;

    }


    container.innerHTML =

        flocks
            .map(
                flock => `

                    <div class="card">

                        <h3>
                            🐔
                            ${escapeHTML(
                                flock.flock_name
                            )}
                        </h3>

                        <p>
                            نوع:
                            ${getProductionLabel(
                                flock.production_type
                            )}
                        </p>

                        <p>
                            سویه:
                            ${escapeHTML(
                                flock.genetics || "-"
                            )}
                        </p>

                        <p>
                            تعداد:
                            ${
                                flock.initial_bird_count
                                    ? Number(
                                        flock.initial_bird_count
                                      ).toLocaleString("fa-IR")
                                    : "-"
                            }
                        </p>

                        <p>
                            تاریخ ورود:
                            ${escapeHTML(
                                flock.placement_date || "-"
                            )}
                        </p>

                        <div class="button-row">

                            <button
                                class="btn btn-primary"
                                type="button"
                                onclick="
                                    selectFlock(
                                        '${flock.id}'
                                    )
                                "
                            >
                                انتخاب گله
                            </button>

                            <button
                                class="btn btn-danger"
                                type="button"
                                onclick="
                                    deleteFlock(
                                        '${flock.id}'
                                    )
                                "
                            >
                                حذف
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   SELECT FLOCK
   ========================================================= */

function selectFlock(
    flockId
) {

    const flock =
        flocks.find(
            item =>
                item.id === flockId
        );


    if (!flock) {

        return;

    }


    setCurrentSelection({

        farmId:
            flock.farm_id,

        houseId:
            flock.house_id,

        flockId:
            flock.id

    });


    window.location.href =
        "weekly.html";

}


/* =========================================================
   DELETE FLOCK
   ========================================================= */

async function deleteFlock(
    flockId
) {

    const confirmed =
        confirm(
            "آیا از حذف این گله مطمئن هستید؟"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("flocks")
            .delete()
            .eq(
                "id",
                flockId
            )
            .eq(
                "owner_id",
                currentUser.id
            );


    if (error) {

        alert(
            "حذف گله انجام نشد:\n" +
            error.message
        );

        return;

    }


    const selection =
        getCurrentSelection();


    if (
        selection.flockId ===
        flockId
    ) {

        setCurrentSelection({

            flockId: null

        });

    }


    await loadFlocks();


    alert(
        "گله حذف شد."
    );

}


/* =========================================================
   DISABLE
   ========================================================= */

function disableForms() {

    [
        "houseForm",
        "flockForm"
    ]
    .forEach(
        id => {

            const form =
                document.getElementById(
                    id
                );


            if (!form) {

                return;

            }


            Array
                .from(
                    form.elements
                )
                .forEach(
                    element => {

                        element.disabled =
                            true;

                    }
                );

        }
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? String(
            element.value || ""
          ).trim()
        : "";

}


function getNumber(
    id
) {

    const value =
        getValue(id);


    if (!value) {

        return 0;

    }


    const number =
        Number(
            value
                .replaceAll(",", "")
                .replaceAll("٬", "")
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


function getProductionLabel(
    type
) {

    const labels = {

        broiler: "گوشتی",

        layer: "تخم‌گذار",

        pullet: "پولت",

        breeder: "مرغ مادر"

    };


    return labels[type] || type || "-";

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );

}
