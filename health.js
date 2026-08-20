/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE
   Compatible with current Supabase schema
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;

const MEDICATION_CATALOG = [

    {
        name: "آموکسی‌سیلین",
        active: "Amoxicillin",
        route: "water",
        indication: "عفونت‌های باکتریایی حساس"
    },

    {
        name: "داکسی‌سایکلین",
        active: "Doxycycline",
        route: "water",
        indication: "عفونت‌های تنفسی"
    },

    {
        name: "اکسی‌تتراسایکلین",
        active: "Oxytetracycline",
        route: "water",
        indication: "عفونت‌های باکتریایی"
    },

    {
        name: "تیامولین",
        active: "Tiamulin",
        route: "water",
        indication: "مایکوپلاسما و بیماری تنفسی"
    },

    {
        name: "تایلوزین",
        active: "Tylosin",
        route: "water",
        indication: "مایکوپلاسما"
    },

    {
        name: "فلورفنیکل",
        active: "Florfenicol",
        route: "water",
        indication: "عفونت‌های باکتریایی حساس"
    },

    {
        name: "انروفلوکساسین",
        active: "Enrofloxacin",
        route: "water",
        indication: "عفونت‌های باکتریایی حساس"
    },

    {
        name: "سولفادیمتوکسین",
        active: "Sulfadimethoxine",
        route: "water",
        indication: "برخی عفونت‌های باکتریایی و کوکسیدیوز"
    },

    {
        name: "آمپرولیوم",
        active: "Amprolium",
        route: "water",
        indication: "کوکسیدیوز"
    },

    {
        name: "دیکلازوریل",
        active: "Diclazuril",
        route: "feed",
        indication: "کوکسیدیوز"
    },

    {
        name: "تولترازوریل",
        active: "Toltrazuril",
        route: "water",
        indication: "کوکسیدیوز"
    },

    {
        name: "نیستاتین",
        active: "Nystatin",
        route: "oral",
        indication: "کاندیدیاز"
    },

    {
        name: "ویتامین AD3E",
        active: "Vitamin A+D3+E",
        route: "water",
        indication: "حمایت تغذیه‌ای"
    },

    {
        name: "ویتامین‌های گروه B",
        active: "Vitamin B Complex",
        route: "water",
        indication: "حمایت تغذیه‌ای"
    },

    {
        name: "الکترولیت",
        active: "Electrolytes",
        route: "water",
        indication: "استرس و کم‌آبی"
    },

    {
        name: "پروبیوتیک",
        active: "Probiotic",
        route: "water",
        indication: "حمایت فلور روده"
    },

    {
        name: "جاذب مایکوتوکسین",
        active: "Mycotoxin Binder",
        route: "feed",
        indication: "ریسک مایکوتوکسین"
    }
];


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
        } = await supabaseClient
            .auth
            .getSession();

        if (
            error ||
            !data.session
        ) {

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

        setupForms();

        setupDatePickers();

        setDefaultDates();

        await loadCatalogs();

        await loadHistory();

    }

    catch (error) {

        console.error(
            "Health initialization:",
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
   FLOCK
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
    } = await supabaseClient
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


    const info = [

        currentFarm?.name,
        currentHouse?.name,
        currentFlock.flock_name,
        currentFlock.strain

    ]
    .filter(Boolean)
    .join(" | ");


    const infoEl =
        document.getElementById(
            "flockInfo"
        );

    if (infoEl) {
        infoEl.textContent =
            info || "گله انتخاب‌شده";
    }


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

    let age = null;

    if (
        typeof calculateAgeDays ===
        "function"
    ) {

        age =
            calculateAgeDays(
                currentFlock.placement_date
            );
    }

    if (
        age === null ||
        age === undefined
    ) {
        return;
    }

    [
        "vaccinationAge",
        "antibodyAge"
    ]
    .forEach(id => {

        const el =
            document.getElementById(id);

        if (
            el &&
            !el.value
        ) {

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
                function () {

                    const tab =
                        this.dataset.tab;

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

                    this.classList.add(
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
   FORMS
========================================================= */

function setupForms() {

    const vaccinationForm =
        document.getElementById(
            "vaccinationForm"
        );

    if (vaccinationForm) {

        vaccinationForm.addEventListener(
            "submit",
            saveVaccination
        );
    }


    const antibodyForm =
        document.getElementById(
            "antibodyForm"
        );

    if (antibodyForm) {

        antibodyForm.addEventListener(
            "submit",
            saveAntibody
        );
    }


    const labForm =
        document.getElementById(
            "labForm"
        );

    if (labForm) {

        labForm.addEventListener(
            "submit",
            saveLab
        );
    }


    const treatmentForm =
        document.getElementById(
            "treatmentForm"
        );

    if (treatmentForm) {

        treatmentForm.addEventListener(
            "submit",
            saveTreatment
        );
    }
}


/* =========================================================
   DATE PICKER
========================================================= */

function setupDatePickers() {

    if (
        window.jalaliDate &&
        typeof window.jalaliDate
            .prepareDateFields ===
        "function"
    ) {

        window.jalaliDate
            .prepareDateFields();
    }

    if (
        typeof window.jQuery !==
        "undefined" &&
        typeof window.jQuery.fn
            .persianDatepicker ===
        "function"
    ) {

        jQuery(".jalali-input")
            .each(function () {

                const el =
                    jQuery(this);

                if (
                    el.data(
                        "datepicker"
                    )
                ) {
                    return;
                }

                el.persianDatepicker({

                    format:
                        "YYYY/MM/DD",

                    autoClose:
                        true,

                    initialValue:
                        false,

                    observer:
                        true,

                    calendarType:
                        "persian",

                    toolbox: {

                        calendarSwitch:
                            false

                    },

                    navigator: {

                        enabled:
                            true

                    },

                    responsive:
                        true,

                    timePicker: {

                        enabled:
                            false

                    }
                });
            });
    }
}


function setDefaultDates() {

    const today =
        window.jalaliDate
            ? window.jalaliDate
                .todayJalali()
            : "";


    [
        "vaccinationDate",
        "antibodyDate",
        "labDate",
        "treatmentDate"
    ]
    .forEach(id => {

        const el =
            document.getElementById(
                id
            );

        if (
            el &&
            !el.value
        ) {

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


/* =========================================================
   DISEASES
========================================================= */

async function loadDiseases() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("diseases")
            .select(
                "code,name_fa,name_en,category,active"
            )
            .eq(
                "active",
                true
            )
            .order(
                "category"
            )
            .order(
                "name_fa"
            );

    if (error) {
        throw error;
    }


    [
        "vaccinationDisease",
        "antibodyDisease",
        "labDisease",
        "treatmentDisease"
    ]
    .forEach(id => {

        const select =
            document.getElementById(id);

        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                انتخاب کنید
            </option>
        `;


        let currentCategory =
            null;


        (data || [])
            .forEach(disease => {

                if (
                    disease.category !==
                    currentCategory
                ) {

                    currentCategory =
                        disease.category;

                    const group =
                        document.createElement(
                            "optgroup"
                        );

                    group.label =
                        categoryLabel(
                            currentCategory
                        );

                    select.appendChild(
                        group
                    );

                    disease._group =
                        group;
                }


                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    disease.code;

                option.textContent =
                    disease.name_fa;

                const groups =
                    select.querySelectorAll(
                        "optgroup"
                    );

                const last =
                    groups[
                        groups.length - 1
                    ];

                if (last) {
                    last.appendChild(
                        option
                    );
                }
            });
    });
}


/* =========================================================
   VACCINES
========================================================= */

async function loadVaccines() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("vaccines")
            .select(
                "id,name,manufacturer,vaccine_type,route,target_codes,notes,active"
            )
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

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            انتخاب واکسن
        </option>
    `;


    (data || [])
        .forEach(vaccine => {

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

            option.dataset.name =
                vaccine.name || "";

            option.dataset.route =
                vaccine.route || "";

            select.appendChild(
                option
            );
        });


    select.addEventListener(
        "change",
        function () {

            const selected =
                this.options[
                    this.selectedIndex
                ];

            if (!selected) {
                return;
            }


            const route =
                selected.dataset.route;


            const routeSelect =
                document.getElementById(
                    "vaccinationRoute"
                );


            if (
                route &&
                routeSelect
            ) {

                const values = [
                    "water",
                    "spray",
                    "eye",
                    "wing",
                    "injection"
                ];


                if (
                    values.includes(route)
                ) {

                    routeSelect.value =
                        route;
                }
            }
        }
    );
}


/* =========================================================
   MEDICATIONS
   ========================================================= */

async function loadMedications() {

    const select =
        document.getElementById(
            "treatmentMedication"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            انتخاب دارو
        </option>
    `;


    MEDICATION_CATALOG
        .forEach((medication, index) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                String(index);

            option.textContent =
                medication.name +
                (
                    medication.active
                        ? " — " +
                          medication.active
                        : ""
                );

            select.appendChild(
                option
            );
        });


    select.addEventListener(
        "change",
        function () {

            const index =
                Number(this.value);

            const selected =
                MEDICATION_CATALOG[index];

            if (!selected) {
                return;
            }


            const name =
                document.getElementById(
                    "treatmentMedicationName"
                );

            const active =
                document.getElementById(
                    "treatmentActive"
                );

            const route =
                document.getElementById(
                    "treatmentRoute"
                );


            if (name) {
                name.value =
                    selected.name;
            }

            if (active) {
                active.value =
                    selected.active;
            }

            if (
                route &&
                selected.route
            ) {
                route.value =
                    selected.route;
            }
        }
    );
}


/* =========================================================
   VACCINATION
   REAL DB:
   vaccine_date
   vaccine_name
   disease
========================================================= */

async function saveVaccination(event) {

    event.preventDefault();


    try {

        const vaccineSelect =
            document.getElementById(
                "vaccinationVaccine"
            );

        const vaccineOption =
            vaccineSelect
                ?.options[
                    vaccineSelect.selectedIndex
                ];


        const vaccineName =
            vaccineOption
                ?.dataset
                ?.name ||
            vaccineOption
                ?.textContent ||
            null;


        const payload = {

            flock_id:
                currentFlock.id,

            owner_id:
                currentUser.id,

            vaccine_date:
                value(
                    "vaccinationDate"
                ),

            vaccine_name:
                vaccineName,

            disease:
                value(
                    "vaccinationDisease"
                ),

            manufacturer:
                null,

            batch_number:
                value(
                    "vaccinationBatch"
                ),

            route:
                value(
                    "vaccinationRoute"
                ),

            dose:
                parseDose(
                    "vaccinationDose"
                ),

            dose_unit:
                "dose",

            administered_by:
                null,

            notes:
                buildVaccinationNotes()

        };


        if (
            !payload.vaccine_name ||
            !payload.vaccine_date
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
            throw error;
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

    catch (error) {

        console.error(error);

        showStatus(
            "ثبت واکسیناسیون انجام نشد: " +
            error.message,
            "error"
        );
    }
}


function buildVaccinationNotes() {

    const notes =
        value(
            "vaccinationNotes"
        );

    const expiry =
        value(
            "vaccinationExpiry"
        );


    return [

        expiry
            ? "تاریخ انقضا: " +
              displayHealthDate(expiry)
            : "",

        notes || ""

    ]
    .filter(Boolean)
    .join(" | ");
}


/* =========================================================
   ANTIBODY
========================================================= */

async function saveAntibody(event) {

    event.preventDefault();


    try {

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
            throw error;
        }


        event.target.reset();

        setDefaultDates();

        calculateAge();


        showStatus(
            "تیتر آنتی‌بادی با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }

    catch (error) {

        console.error(error);

        showStatus(
            "ثبت تیتر انجام نشد: " +
            error.message,
            "error"
        );
    }
}


/* =========================================================
   LAB
========================================================= */

async function saveLab(event) {

    event.preventDefault();


    try {

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
            throw error;
        }


        event.target.reset();

        setDefaultDates();


        showStatus(
            "آزمایش با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }

    catch (error) {

        console.error(error);

        showStatus(
            "ثبت آزمایش انجام نشد: " +
            error.message,
            "error"
        );
    }
}


/* =========================================================
   TREATMENT
   REAL DB:
   start_date
   end_date
   medicine_name
   active_ingredient
   dose numeric
   dose_unit
   route
   indication
   withdrawal_days
========================================================= */

async function saveTreatment(event) {

    event.preventDefault();


    try {

        const medicationName =
            value(
                "treatmentMedicationName"
            );


        const diseaseCode =
            value(
                "treatmentDisease"
            );


        const indication =
            [
                diseaseCode,
                value(
                    "treatmentNotes"
                )
            ]
            .filter(Boolean)
            .join(" | ");


        const payload = {

            flock_id:
                currentFlock.id,

            owner_id:
                currentUser.id,

            start_date:
                value(
                    "treatmentDate"
                ),

            end_date:
                value(
                    "treatmentEnd"
                ),

            medicine_name:
                medicationName,

            active_ingredient:
                value(
                    "treatmentActive"
                ),

            dose:
                parseNumericDose(
                    "treatmentDose"
                ),

            dose_unit:
                detectDoseUnit(
                    "treatmentDose"
                ),

            route:
                value(
                    "treatmentRoute"
                ),

            indication:
                indication,

            withdrawal_days:
                parseWithdrawalDays(
                    "treatmentWithdrawal"
                ),

            veterinarian:
                null,

            notes:
                value(
                    "treatmentNotes"
                )

        };


        if (
            !payload.start_date ||
            !payload.medicine_name
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
            throw error;
        }


        event.target.reset();

        setDefaultDates();


        showStatus(
            "درمان با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }

    catch (error) {

        console.error(error);

        showStatus(
            "ثبت درمان انجام نشد: " +
            error.message,
            "error"
        );
    }
}


/* =========================================================
   HISTORY
========================================================= */

async function loadHistory() {

    const table =
        document.getElementById(
            "healthTable"
        );

    if (!table) {
        return;
    }


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
                    vaccine_date,
                    vaccine_name,
                    disease,
                    dose,
                    dose_unit,
                    route,
                    batch_number,
                    notes
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
                    start_date,
                    end_date,
                    medicine_name,
                    active_ingredient,
                    dose,
                    dose_unit,
                    route,
                    indication,
                    withdrawal_days,
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


    const errors = [

        vaccinationsResult.error,
        antibodiesResult.error,
        labsResult.error,
        treatmentsResult.error

    ].filter(Boolean);


    if (errors.length) {

        console.error(errors);

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


    /* واکسن */

    (vaccinationsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "vaccinations",

                rawDate:
                    item.vaccine_date,

                date:
                    displayHealthDate(
                        item.vaccine_date
                    ),

                type:
                    "واکسیناسیون",

                item:
                    item.vaccine_name,

                details:
                    [
                        item.disease,
                        item.dose
                            ? "دوز: " +
                              item.dose +
                              (
                                  item.dose_unit
                                      ? " " +
                                        item.dose_unit
                                      : ""
                              )
                            : "",
                        routeLabel(
                            item.route
                        ),
                        item.batch_number
                            ? "سری ساخت: " +
                              item.batch_number
                            : "",
                        item.notes
                    ]
                    .filter(Boolean)
                    .join(" | ")
            });
        });


    /* تیتر */

    (antibodiesResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "antibody_tests",

                rawDate:
                    item.test_date,

                date:
                    displayHealthDate(
                        item.test_date
                    ),

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

                        item.gmt !== null &&
                        item.gmt !== undefined
                            ? "GMT: " +
                              item.gmt
                            : "",

                        item.cv_percent !== null &&
                        item.cv_percent !== undefined
                            ? "CV: " +
                              item.cv_percent +
                              "%"
                            : "",

                        item.sample_count
                            ? "نمونه: " +
                              item.sample_count
                            : ""
                    ]
                    .filter(Boolean)
                    .join(" | ")
            });
        });


    /* آزمایش */

    (labsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "lab_tests",

                rawDate:
                    item.test_date,

                date:
                    displayHealthDate(
                        item.test_date
                    ),

                type:
                    "آزمایش",

                item:
                    item.test_type,

                details:
                    [
                        item.disease_code,
                        item.sample_type,
                        item.result,

                        item.ct_value !== null &&
                        item.ct_value !== undefined
                            ? "Ct: " +
                              item.ct_value
                            : "",

                        item.positive_count !== null &&
                        item.positive_count !== undefined
                            ? "مثبت: " +
                              item.positive_count
                            : ""
                    ]
                    .filter(Boolean)
                    .join(" | ")
            });
        });


    /* درمان */

    (treatmentsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "treatments",

                rawDate:
                    item.start_date,

                date:
                    displayHealthDate(
                        item.start_date
                    ),

                type:
                    "درمان",

                item:
                    item.medicine_name,

                details:
                    [
                        item.active_ingredient,

                        item.dose !== null &&
                        item.dose !== undefined
                            ? "دوز: " +
                              item.dose +
                              (
                                  item.dose_unit
                                      ? " " +
                                        item.dose_unit
                                      : ""
                              )
                            : "",

                        routeLabel(
                            item.route
                        ),

                        item.withdrawal_days !== null &&
                        item.withdrawal_days !== undefined
                            ? "منع مصرف: " +
                              item.withdrawal_days +
                              " روز"
                            : "",

                        item.notes
                    ]
                    .filter(Boolean)
                    .join(" | ")
            });
        });


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


    rows.sort(
        (a,b) =>
            String(b.rawDate)
                .localeCompare(
                    String(a.rawDate)
                )
    );


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
                        ${escapeSafe(
                            row.details || "-"
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-danger"
                            onclick="
                                deleteRecord(
                                    '${row.id}',
                                    '${row.table}'
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
    tableName
) {

    if (
        !confirm(
            "آیا این رکورد حذف شود؟"
        )
    ) {
        return;
    }


    const allowedTables = [

        "vaccinations",
        "antibody_tests",
        "lab_tests",
        "treatments"

    ];


    if (
        !allowedTables.includes(
            tableName
        )
    ) {
        return;
    }


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

    if (!el) {
        return null;
    }


    let result =
        String(
            el.value || ""
        ).trim();


    if (!result) {
        return null;
    }


    const dateIds = [

        "vaccinationDate",
        "vaccinationExpiry",
        "antibodyDate",
        "labDate",
        "treatmentDate",
        "treatmentEnd"

    ];


    if (
        dateIds.includes(id)
    ) {

        const iso =
            window.jalaliDate
                ? window.jalaliDate
                    .jalaliToISO(
                        normalizeDigits(result)
                    )
                : null;


        if (!iso) {

            throw new Error(
                "تاریخ واردشده معتبر نیست. فرمت صحیح: ۱۴۰۵/۰۵/۲۹"
            );
        }


        return iso;
    }


    return result;
}


function normalizeDigits(text) {

    return String(text)
        .replace(
            /[۰-۹]/g,
            d =>
                String(
                    "۰۱۲۳۴۵۶۷۸۹"
                        .indexOf(d)
                )
        )
        .replace(
            /[٠-٩]/g,
            d =>
                String(
                    "٠١٢٣٤٥٦٧٨٩"
                        .indexOf(d)
                )
        );
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
        Number(
            normalizeDigits(v)
        );


    return Number.isFinite(number)
        ? number
        : null;
}


function parseNumericDose(id) {

    const raw =
        document.getElementById(id)
            ?.value || "";


    const normalized =
        normalizeDigits(
            raw
        );


    const match =
        normalized.match(
            /-?\d+(?:\.\d+)?/
        );


    if (!match) {
        return null;
    }


    const n =
        Number(
            match[0]
        );


    return Number.isFinite(n)
        ? n
        : null;
}


function parseDose(id) {

    return parseNumericDose(id);
}


function detectDoseUnit(id) {

    const raw =
        String(
            document.getElementById(id)
                ?.value || ""
        );


    const normalized =
        normalizeDigits(
            raw
        )
        .toLowerCase();


    if (
        normalized.includes("ml") ||
        normalized.includes("میلی")
    ) {
        return "ml";
    }

    if (
        normalized.includes("mg") ||
        normalized.includes("میلی‌گرم") ||
        normalized.includes("میلی گرم")
    ) {
        return "mg";
    }

    if (
        normalized.includes("g") ||
        normalized.includes("گرم")
    ) {
        return "g";
    }

    return "dose";
}


function parseWithdrawalDays(id) {

    const raw =
        document.getElementById(id)
            ?.value || "";


    const normalized =
        normalizeDigits(
            raw
        );


    const match =
        normalized.match(
            /\d+/
        );


    if (!match) {
        return null;
    }


    const n =
        Number(
            match[0]
        );


    return Number.isFinite(n)
        ? n
        : null;
}


function displayHealthDate(
    isoDate
) {

    if (!isoDate) {
        return "-";
    }


    if (
        window.jalaliDate &&
        typeof window.jalaliDate
            .isoToJalali ===
        "function"
    ) {

        return window.jalaliDate
            .isoToJalali(
                isoDate
            );
    }


    return isoDate;
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


    return (
        map[route] ||
        route ||
        ""
    );
}


function stageLabel(stage) {

    const map = {

        maternal:
            "تیتر مادری",

        pre_vaccination:
            "قبل از واکسیناسیون",

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


function categoryLabel(category) {

    const map = {

        viral:
            "ویروسی",

        bacterial:
            "باکتریایی",

        fungal:
            "قارچی",

        parasitic:
            "انگلی",

        metabolic:
            "متابولیک"

    };


    return (
        map[category] ||
        category
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


    if (!el) {
        return;
    }


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
