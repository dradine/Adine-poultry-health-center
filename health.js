/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE
   Supabase
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initHealth
);


async function initHealth() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error || !data.session) {

            location.href =
                "login.html?message=" +
                encodeURIComponent(
                    "ابتدا وارد سامانه شوید."
                );

            return;

        }


        currentUser =
            data.session.user;


        await loadSelection();

        setupTabs();

        setDefaultDates();

        await loadCatalogs();

        await loadHistory();

    }

    catch (error) {

        console.error(
            "Health initialization error:",
            error
        );

        showStatus(
            "خطا در بارگذاری بخش سلامت: " +
            error.message,
            "error"
        );

    }

}



/* =========================================================
   SELECTION
========================================================= */

async function loadSelection() {

    const selection =
        typeof getCurrentSelection === "function"
            ? getCurrentSelection()
            : {};


    if (!selection.flockId) {

        alert(
            "ابتدا یک گله را انتخاب کنید."
        );

        location.href =
            "flocks.html";

        return;

    }


    const {
        data: flock,
        error
    } =
        await supabaseClient
            .from("flocks")
            .select("*")
            .eq(
                "id",
                selection.flockId
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .maybeSingle();


    if (error) {

        throw error;

    }


    if (!flock) {

        alert(
            "گله انتخاب‌شده پیدا نشد."
        );

        location.href =
            "flocks.html";

        return;

    }


    currentFlock =
        flock;


    const farmResult =
        await supabaseClient
            .from("farms")
            .select("*")
            .eq(
                "id",
                flock.farm_id
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .maybeSingle();


    if (!farmResult.error) {

        currentFarm =
            farmResult.data;

    }


    const houseResult =
        await supabaseClient
            .from("houses")
            .select("*")
            .eq(
                "id",
                flock.house_id
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .maybeSingle();


    if (!houseResult.error) {

        currentHouse =
            houseResult.data;

    }


    const info =
        [

            currentFarm?.name,

            currentHouse?.name,

            currentFlock.flock_name,

            currentFlock.strain

        ]
        .filter(Boolean)
        .join(" | ");


    document.getElementById(
        "flockInfo"
    ).textContent =
        info || "گله انتخاب‌شده";


    calculateAge();

}



/* =========================================================
   AGE
========================================================= */

function calculateAge() {

    if (
        !currentFlock?.placement_date
    ) {

        return;

    }


    const age =
        typeof calculateAgeDays === "function"

            ? calculateAgeDays(
                currentFlock.placement_date
            )

            : null;


    if (age === null) {

        return;

    }


    const fields = [

        "vaccinationAge",

        "antibodyAge"

    ];


    fields.forEach(id => {

        const el =
            document.getElementById(id);

        if (el && !el.value) {

            el.value =
                age;

        }

    });

}



/* =========================================================
   TABS
========================================================= */

function setupTabs() {

    document
        .querySelectorAll(
            ".health-tab"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const tab =
                        button.dataset.tab;


                    document
                        .querySelectorAll(
                            ".health-tab"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    document
                        .querySelectorAll(
                            ".health-panel"
                        )
                        .forEach(panel => {

                            panel.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    const panel =
                        document.getElementById(
                            "panel-" + tab
                        );


                    if (panel) {

                        panel.classList.add(
                            "active"
                        );

                    }

                }
            );

        });

}



/* =========================================================
   DATES
========================================================= */

function setDefaultDates() {

    const today =
        typeof todayISO === "function"

            ? todayISO()

            : new Date()
                .toISOString()
                .slice(0, 10);


    [

        "vaccinationDate",

        "antibodyDate",

        "labDate",

        "treatmentDate"

    ]
    .forEach(id => {

        const el =
            document.getElementById(id);

        if (el) {

            el.value =
                today;

        }

    });

}



/* =========================================================
   CATALOGS
========================================================= */

async function loadCatalogs() {

    await Promise.all([

        loadDiseases(),

        loadVaccines(),

        loadMedications()

    ]);

}


async function loadDiseases() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("diseases")
            .select("*")
            .eq(
                "active",
                true
            )
            .order(
                "category"
            );


    if (error) {

        throw error;

    }


    const selects = [

        "vaccinationDisease",

        "antibodyDisease",

        "labDisease",

        "treatmentDisease"

    ];


    selects.forEach(id => {

        const select =
            document.getElementById(id);


        if (!select) return;


        select.innerHTML = `

            <option value="">
                انتخاب کنید
            </option>

        `;


        (data || []).forEach(
            disease => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    disease.code;


                option.textContent =
                    disease.name_fa;


                select.appendChild(
                    option
                );

            }
        );

    });

}



async function loadVaccines() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("vaccines")
            .select("*")
            .eq(
                "active",
                true
            )
            .order(
                "name"
            );


    if (error) {

        throw error;

    }


    const select =
        document.getElementById(
            "vaccinationVaccine"
        );


    select.innerHTML = `

        <option value="">
            انتخاب واکسن
        </option>

    `;


    (data || []).forEach(
        vaccine => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                vaccine.id;


            option.textContent =
                vaccine.manufacturer

                    ? `${vaccine.name} — ${vaccine.manufacturer}`

                    : vaccine.name;


            select.appendChild(
                option
            );

        }
    );

}



async function loadMedications() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("medications")
            .select("*")
            .eq(
                "active",
                true
            )
            .order(
                "name"
            );


    if (error) {

        throw error;

    }


    const select =
        document.getElementById(
            "treatmentMedication"
        );


    select.innerHTML = `

        <option value="">
            انتخاب دارو
        </option>

    `;


    (data || []).forEach(
        medication => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                medication.id;


            option.textContent =
                medication.active_ingredient

                    ? `${medication.name} — ${medication.active_ingredient}`

                    : medication.name;


            select.appendChild(
                option
            );

        }
    );


    select.addEventListener(
        "change",
        event => {

            const selected =
                (data || [])
                    .find(
                        item =>
                            item.id ===
                            event.target.value
                    );


            if (!selected) return;


            document.getElementById(
                "treatmentMedicationName"
            ).value =
                selected.name || "";


            document.getElementById(
                "treatmentActive"
            ).value =
                selected.active_ingredient || "";

        }
    );

}



/* =========================================================
   VACCINATION
========================================================= */

document
    .getElementById(
        "vaccinationForm"
    )
    .addEventListener(
        "submit",
        saveVaccination
    );


async function saveVaccination(event) {

    event.preventDefault();


    const payload = {

        owner_id:
            currentUser.id,

        farm_id:
            currentFlock.farm_id,

        house_id:
            currentFlock.house_id,

        flock_id:
            currentFlock.id,

        vaccine_id:
            value(
                "vaccinationVaccine"
            ),

        vaccination_date:
            value(
                "vaccinationDate"
            ),

        flock_age_days:
            numberOrNull(
                "vaccinationAge"
            ),

        dose:
            value(
                "vaccinationDose"
            ),

        route:
            value(
                "vaccinationRoute"
            ),

        batch_number:
            value(
                "vaccinationBatch"
            ),

        expiry_date:
            value(
                "vaccinationExpiry"
            ),

        notes:
            value(
                "vaccinationNotes"
            )

    };


    if (
        !payload.vaccine_id ||
        !payload.vaccination_date
    ) {

        showStatus(
            "واکسن و تاریخ واکسیناسیون الزامی است.",
            "error"
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("vaccinations")
            .insert(
                payload
            );


    if (error) {

        console.error(error);

        showStatus(
            "ثبت واکسیناسیون انجام نشد: " +
            error.message,
            "error"
        );

        return;

    }


    event.target.reset();

    setDefaultDates();

    calculateAge();


    showStatus(
        "واکسیناسیون با موفقیت ثبت شد.",
        "success"
    );


    await loadHistory();

}



/* =========================================================
   ANTIBODY
========================================================= */

document
    .getElementById(
        "antibodyForm"
    )
    .addEventListener(
        "submit",
        saveAntibody
    );


async function saveAntibody(event) {

    event.preventDefault();


    const payload = {

        owner_id:
            currentUser.id,

        farm_id:
            currentFlock.farm_id,

        house_id:
            currentFlock.house_id,

        flock_id:
            currentFlock.id,

        disease_code:
            value(
                "antibodyDisease"
            ),

        test_type:
            value(
                "antibodyTestType"
            ) || "ELISA",

        antibody_stage:
            value(
                "antibodyStage"
            ),

        test_date:
            value(
                "antibodyDate"
            ),

        flock_age_days:
            numberOrNull(
                "antibodyAge"
            ),

        sample_count:
            numberOrNull(
                "antibodySamples"
            ),

        mean_value:
            null,

        gmt:
            numberOrNull(
                "antibodyGMT"
            ),

        cv_percent:
            numberOrNull(
                "antibodyCV"
            ),

        min_value:
            numberOrNull(
                "antibodyMin"
            ),

        max_value:
            numberOrNull(
                "antibodyMax"
            ),

        lab_name:
            value(
                "antibodyLab"
            ),

        notes:
            value(
                "antibodyNotes"
            )

    };


    if (
        !payload.disease_code ||
        !payload.test_date
    ) {

        showStatus(
            "بیماری و تاریخ آزمایش الزامی است.",
            "error"
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("antibody_tests")
            .insert(
                payload
            );


    if (error) {

        showStatus(
            "ثبت تیتر انجام نشد: " +
            error.message,
            "error"
        );

        return;

    }


    event.target.reset();

    setDefaultDates();

    calculateAge();


    showStatus(
        "تیتر آنتی‌بادی ثبت شد.",
        "success"
    );


    await loadHistory();

}



/* =========================================================
   LAB
========================================================= */

document
    .getElementById(
        "labForm"
    )
    .addEventListener(
        "submit",
        saveLab
    );


async function saveLab(event) {

    event.preventDefault();


    const payload = {

        owner_id:
            currentUser.id,

        farm_id:
            currentFlock.farm_id,

        house_id:
            currentFlock.house_id,

        flock_id:
            currentFlock.id,

        test_date:
            value(
                "labDate"
            ),

        test_type:
            value(
                "labType"
            ),

        disease_code:
            value(
                "labDisease"
            ),

        sample_type:
            value(
                "labSampleType"
            ),

        sample_count:
            numberOrNull(
                "labSampleCount"
            ),

        positive_count:
            numberOrNull(
                "labPositiveCount"
            ),

        result:
            value(
                "labResult"
            ),

        ct_value:
            numberOrNull(
                "labCT"
            ),

        antibiotic_sensitivity:
            value(
                "labSensitivity"
            ),

        laboratory:
            value(
                "labLaboratory"
            ),

        notes:
            value(
                "labNotes"
            )

    };


    if (
        !payload.test_date
    ) {

        showStatus(
            "تاریخ آزمایش الزامی است.",
            "error"
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("lab_tests")
            .insert(
                payload
            );


    if (error) {

        showStatus(
            "ثبت آزمایش انجام نشد: " +
            error.message,
            "error"
        );

        return;

    }


    event.target.reset();

    setDefaultDates();


    showStatus(
        "آزمایش ثبت شد.",
        "success"
    );


    await loadHistory();

}



/* =========================================================
   TREATMENT
========================================================= */

document
    .getElementById(
        "treatmentForm"
    )
    .addEventListener(
        "submit",
        saveTreatment
    );


async function saveTreatment(event) {

    event.preventDefault();


    const medicationId =
        value(
            "treatmentMedication"
        );


    const payload = {

        owner_id:
            currentUser.id,

        farm_id:
            currentFlock.farm_id,

        house_id:
            currentFlock.house_id,

        flock_id:
            currentFlock.id,

        treatment_date:
            value(
                "treatmentDate"
            ),

        end_date:
            value(
                "treatmentEnd"
            ),

        disease_code:
            value(
                "treatmentDisease"
            ),

        medication_id:
            medicationId || null,

        medication_name:
            value(
                "treatmentMedicationName"
            ),

        active_ingredient:
            value(
                "treatmentActive"
            ),

        dose:
            value(
                "treatmentDose"
            ),

        route:
            value(
                "treatmentRoute"
            ),

        duration:
            value(
                "treatmentDuration"
            ),

        withdrawal_period:
            value(
                "treatmentWithdrawal"
            ),

        result:
            value(
                "treatmentResult"
            ),

        notes:
            value(
                "treatmentNotes"
            )

    };


    if (
        !payload.treatment_date ||
        !payload.medication_name
    ) {

        showStatus(
            "تاریخ شروع و نام دارو الزامی است.",
            "error"
        );

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("treatments")
            .insert(
                payload
            );


    if (error) {

        showStatus(
            "ثبت درمان انجام نشد: " +
            error.message,
            "error"
        );

        return;

    }


    event.target.reset();

    setDefaultDates();


    showStatus(
        "درمان با موفقیت ثبت شد.",
        "success"
    );


    await loadHistory();

}



/* =========================================================
   HISTORY
========================================================= */

async function loadHistory() {

    const table =
        document.getElementById(
            "healthTable"
        );


    table.innerHTML = `

        <tr>
            <td colspan="5">
                در حال دریافت سوابق...
            </td>
        </tr>

    `;


    const [

        vaccinationsResult,

        antibodiesResult,

        labsResult,

        treatmentsResult

    ] =
        await Promise.all([


            supabaseClient
                .from("vaccinations")
                .select(`
                    id,
                    vaccination_date,
                    dose,
                    route,
                    notes,
                    vaccine_id,
                    vaccines (
                        name
                    )
                `)
                .eq(
                    "owner_id",
                    currentUser.id
                )
                .eq(
                    "flock_id",
                    currentFlock.id
                ),


            supabaseClient
                .from("antibody_tests")
                .select("*")
                .eq(
                    "owner_id",
                    currentUser.id
                )
                .eq(
                    "flock_id",
                    currentFlock.id
                ),


            supabaseClient
                .from("lab_tests")
                .select("*")
                .eq(
                    "owner_id",
                    currentUser.id
                )
                .eq(
                    "flock_id",
                    currentFlock.id
                ),


            supabaseClient
                .from("treatments")
                .select(`
                    id,
                    treatment_date,
                    medication_name,
                    dose,
                    route,
                    result,
                    notes
                `)
                .eq(
                    "owner_id",
                    currentUser.id
                )
                .eq(
                    "flock_id",
                    currentFlock.id
                )

    ]);


    if (
        vaccinationsResult.error ||
        antibodiesResult.error ||
        labsResult.error ||
        treatmentsResult.error
    ) {

        console.error(

            vaccinationsResult.error,

            antibodiesResult.error,

            labsResult.error,

            treatmentsResult.error

        );


        table.innerHTML = `

            <tr>
                <td colspan="5">
                    خطا در دریافت سوابق
                </td>
            </tr>

        `;

        return;

    }


    const rows = [];


    (vaccinationsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                date:
                    item.vaccination_date,

                type:
                    "واکسیناسیون",

                item:
                    item.vaccines?.name ||
                    "واکسن",

                details:
                    [

                        item.dose,

                        routeLabel(
                            item.route
                        ),

                        item.notes

                    ]
                    .filter(Boolean)
                    .join(" | ")

            });

        });


    (antibodiesResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                date:
                    item.test_date,

                type:
                    "تیتر آنتی‌بادی",

                item:
                    item.disease_code,

                details:
                    [

                        stageLabel(
                            item.antibody_stage
                        ),

                        item.test_type,

                        item.gmt
                            ? "GMT: " + item.gmt
                            : "",

                        item.cv_percent
                            ? "CV: " +
                              item.cv_percent +
                              "%"
                            : ""

                    ]
                    .filter(Boolean)
                    .join(" | ")

            });

        });


    (labsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                date:
                    item.test_date,

                type:
                    "آزمایش",

                item:
                    item.test_type,

                details:
                    [

                        item.disease_code,

                        item.result,

                        item.ct_value !== null
                            ? "Ct: " +
                              item.ct_value
                            : ""

                    ]
                    .filter(Boolean)
                    .join(" | ")

            });

        });


    (treatmentsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                date:
                    item.treatment_date,

                type:
                    "درمان",

                item:
                    item.medication_name,

                details:
                    [

                        item.dose,

                        routeLabel(
                            item.route
                        ),

                        item.result,

                        item.notes

                    ]
                    .filter(Boolean)
                    .join(" | ")

            });

        });


    rows.sort(
        (a, b) =>
            String(b.date)
                .localeCompare(
                    String(a.date)
                )
    );


    if (!rows.length) {

        table.innerHTML = `

            <tr>

                <td colspan="5">

                    هنوز سابقه‌ای برای این گله ثبت نشده است.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        rows
            .map(row => `

                <tr>

                    <td>
                        ${escapeSafe(row.date)}
                    </td>

                    <td>
                        <span class="badge">
                            ${escapeSafe(row.type)}
                        </span>
                    </td>

                    <td>
                        ${escapeSafe(row.item)}
                    </td>

                    <td>
                        ${escapeSafe(row.details || "-")}
                    </td>

                    <td>
                        <button
                            class="btn btn-danger"
                            onclick="
                                deleteRecord(
                                    '${row.id}',
                                    '${row.type}'
                                )
                            ">

                            حذف

                        </button>
                    </td>

                </tr>

            `)
            .join("");

}



/* =========================================================
   DELETE
========================================================= */

async function deleteRecord(
    id,
    type
) {

    if (
        !confirm(
            "آیا این رکورد حذف شود؟"
        )
    ) {

        return;

    }


    let tableName = null;


    if (
        type === "واکسیناسیون"
    ) {

        tableName =
            "vaccinations";

    }

    else if (
        type === "تیتر آنتی‌بادی"
    ) {

        tableName =
            "antibody_tests";

    }

    else if (
        type === "آزمایش"
    ) {

        tableName =
            "lab_tests";

    }

    else if (
        type === "درمان"
    ) {

        tableName =
            "treatments";

    }


    if (!tableName) return;


    const {
        error
    } =
        await supabaseClient
            .from(tableName)
            .delete()
            .eq(
                "id",
                id
            )
            .eq(
                "owner_id",
                currentUser.id
            );


    if (error) {

        showStatus(
            "حذف انجام نشد: " +
            error.message,
            "error"
        );

        return;

    }


    showStatus(
        "رکورد حذف شد.",
        "success"
    );


    await loadHistory();

}



/* =========================================================
   HELPERS
========================================================= */

function value(id) {

    const el =
        document.getElementById(id);


    if (!el) return null;


    const result =
        String(
            el.value || ""
        ).trim();


    return result || null;

}


function numberOrNull(id) {

    const v =
        value(id);


    if (
        v === null
    ) {

        return null;

    }


    const number =
        Number(v);


    return Number.isFinite(number)
        ? number
        : null;

}


function routeLabel(route) {

    const map = {

        water:
            "آب آشامیدنی",

        spray:
            "اسپری",

        eye:
            "قطره چشمی",

        wing:
            "بال‌زدن",

        injection:
            "تزریقی",

        feed:
            "دان",

        oral:
            "خوراکی",

        other:
            "سایر"

    };


    return map[route] || route || "";

}


function stageLabel(stage) {

    const map = {

        maternal:
            "مادری",

        pre_vaccination:
            "قبل واکسیناسیون",

        post_vaccination:
            "پس از واکسیناسیون",

        routine:
            "پایش روتین"

    };


    return (
        map[stage] ||
        stage ||
        ""
    );

}


function escapeSafe(value) {

    if (
        typeof escapeHTML ===
        "function"
    ) {

        return escapeHTML(
            value
        );

    }


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


function showStatus(
    message,
    type
) {

    const el =
        document.getElementById(
            "healthStatus"
        );


    el.textContent =
        message;


    el.className =
        "health-status " +
        type;


    setTimeout(
        () => {

            el.className =
                "health-status";

        },
        5000
    );

}


window.deleteRecord =
    deleteRecord;
