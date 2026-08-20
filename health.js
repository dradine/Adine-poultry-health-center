/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE
   Compatible with current Supabase schema
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
            await supabaseClient.auth.getSession();

        if (
            error ||
            !data ||
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

        if (
            window.jalaliDate
        ) {

            window.jalaliDate
                .prepareDateFields();

        }

        setDefaultDates();

        await loadCatalogs();

        setupForms();

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


    const info = [

        currentFarm?.name,
        currentHouse?.name,
        currentFlock.flock_name,
        currentFlock.strain

    ]
        .filter(Boolean)
        .join(" | ");


    const flockInfo =
        document.getElementById(
            "flockInfo"
        );


    if (flockInfo) {

        flockInfo.textContent =
            info ||
            "گله انتخاب‌شده";

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
   DATES
========================================================= */

function setDefaultDates() {

    const today =
        window.jalaliDate
            ? window.jalaliDate.todayJalali()
            : "";


    [
        "vaccinationDate",
        "antibodyDate",
        "labDate",
        "treatmentDate"
    ]
        .forEach(id => {

            const el =
                document.getElementById(id);

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
   DATE VALUE
========================================================= */

function dateValue(id) {

    const el =
        document.getElementById(id);


    if (!el) {
        return null;
    }


    const text =
        String(
            el.value || ""
        ).trim();


    if (!text) {
        return null;
    }


    if (
        !window.jalaliDate ||
        typeof window.jalaliDate.jalaliToISO !==
        "function"
    ) {

        throw new Error(
            "موتور تاریخ شمسی بارگذاری نشده است."
        );

    }


    const iso =
        window.jalaliDate
            .jalaliToISO(text);


    if (!iso) {

        throw new Error(
            "تاریخ معتبر نیست. نمونه صحیح: ۱۴۰۵/۰۵/۲۹"
        );

    }


    return iso;

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


            select.innerHTML =
                `<option value="">
                    انتخاب کنید
                </option>`;


            (data || [])
                .forEach(disease => {

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
                "id,name,manufacturer,vaccine_type,route,target_codes,active"
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


    select.innerHTML =
        `<option value="">
            انتخاب واکسن
        </option>`;


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


            /*
             * اطلاعات کامل واکسن
             * برای ذخیره نام واکسن
             */

            option.dataset.name =
                vaccine.name || "";


            option.dataset.manufacturer =
                vaccine.manufacturer || "";


            select.appendChild(
                option
            );

        });

}


/* =========================================================
   MEDICATIONS
========================================================= */

/* =========================================================
   MEDICATION CATALOG
   مستقل از جدول medications
========================================================= */

const LOCAL_MEDICATION_CATALOG = [

    {
        name: "آموکسی‌سیلین",
        active: "Amoxicillin"
    },

    {
        name: "آمپی‌سیلین",
        active: "Ampicillin"
    },

    {
        name: "فلورفنیکل",
        active: "Florfenicol"
    },

    {
        name: "داکسی‌سایکلین",
        active: "Doxycycline"
    },

    {
        name: "اکسی‌تتراسایکلین",
        active: "Oxytetracycline"
    },

    {
        name: "کلرتتراسایکلین",
        active: "Chlortetracycline"
    },

    {
        name: "تیامولین",
        active: "Tiamulin"
    },

    {
        name: "تایلوزین",
        active: "Tylosin"
    },

    {
        name: "تایل‌والوزین",
        active: "Tylvalosin"
    },

    {
        name: "لینکومایسین",
        active: "Lincomycin"
    },

    {
        name: "اسپکتینومایسین",
        active: "Spectinomycin"
    },

    {
        name: "جنتامایسین",
        active: "Gentamicin"
    },

    {
        name: "سیپروفلوکساسین",
        active: "Ciprofloxacin"
    },

    {
        name: "تریمتوپریم + سولفامتوکسازول",
        active: "Trimethoprim + Sulfamethoxazole"
    },

    {
        name: "سولفادیازین",
        active: "Sulfadiazine"
    },

    {
        name: "سولفاکینوکزالین",
        active: "Sulfaquinoxaline"
    },

    {
        name: "نئومایسین",
        active: "Neomycin"
    },

    {
        name: "کولیسـتین",
        active: "Colistin"
    },

    {
        name: "آلبندازول",
        active: "Albendazole"
    },

    {
        name: "لوامیزول",
        active: "Levamisole"
    },

    {
        name: "تولترازوریل",
        active: "Toltrazuril"
    },

    {
        name: "دیکلازوریل",
        active: "Diclazuril"
    },

    {
        name: "نیستاتین",
        active: "Nystatin"
    },

    {
        name: "آمفوتریسین B",
        active: "Amphotericin B"
    }

];


function loadMedications() {

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


    LOCAL_MEDICATION_CATALOG
        .forEach((medication, index) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                "local-" + index;

            option.textContent =
                medication.name +
                " — " +
                medication.active;

            option.dataset.name =
                medication.name;

            option.dataset.active =
                medication.active;

            select.appendChild(
                option
            );

        });


    select.onchange =
        function () {

            const option =
                this.options[
                    this.selectedIndex
                ];

            if (!option) {
                return;
            }

            const nameInput =
                document.getElementById(
                    "treatmentMedicationName"
                );

            const activeInput =
                document.getElementById(
                    "treatmentActive"
                );


            if (nameInput) {

                nameInput.value =
                    option.dataset.name || "";

            }


            if (activeInput) {

                activeInput.value =
                    option.dataset.active || "";

            }

        };
}
/* =========================================================
   VACCINATION
   CURRENT SCHEMA:
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


        const selectedOption =
            vaccineSelect?.options[
                vaccineSelect.selectedIndex
            ];


        const vaccineName =
            selectedOption?.dataset?.name ||
            selectedOption?.textContent?.split(" — ")[0] ||
            "";


        const manufacturer =
            selectedOption?.dataset?.manufacturer ||
            "";


        const payload = {

            flock_id:
                currentFlock.id,

            owner_id:
                currentUser.id,

            vaccine_date:
                dateValue(
                    "vaccinationDate"
                ),

            vaccine_name:
                vaccineName,

            disease:
                value(
                    "vaccinationDisease"
                ),

            manufacturer:
                manufacturer || null,

            batch_number:
                value(
                    "vaccinationBatch"
                ),

            route:
                value(
                    "vaccinationRoute"
                ),

            dose:
                numericValue(
                    "vaccinationDose"
                ),

            dose_unit:
                "dose",

            administered_by:
                null,

            notes:
                value(
                    "vaccinationNotes"
                )

        };


        if (
            !payload.vaccine_date
        ) {

            throw new Error(
                "تاریخ واکسیناسیون الزامی است."
            );

        }


        if (
            !payload.vaccine_name
        ) {

            throw new Error(
                "واکسن را انتخاب کنید."
            );

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


        if (
            window.jalaliDate
        ) {

            window.jalaliDate
                .prepareDateFields();

        }


        setDefaultDates();

        calculateAge();


        showStatus(
            "واکسیناسیون با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Vaccination error:",
            error
        );


        showStatus(
            "ثبت واکسیناسیون انجام نشد: " +
            error.message,
            "error"
        );

    }

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
                dateValue(
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
            !payload.disease_code
        ) {

            throw new Error(
                "بیماری را انتخاب کنید."
            );

        }


        if (
            !payload.test_date
        ) {

            throw new Error(
                "تاریخ آزمایش الزامی است."
            );

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


        if (
            window.jalaliDate
        ) {

            window.jalaliDate
                .prepareDateFields();

        }


        setDefaultDates();

        calculateAge();


        showStatus(
            "تیتر آنتی‌بادی ثبت شد.",
            "success"
        );


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Antibody error:",
            error
        );


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
                dateValue(
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

            throw new Error(
                "تاریخ آزمایش الزامی است."
            );

        }


        if (
            !payload.test_type
        ) {

            throw new Error(
                "نوع آزمایش را انتخاب کنید."
            );

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


        if (
            window.jalaliDate
        ) {

            window.jalaliDate
                .prepareDateFields();

        }


        setDefaultDates();


        showStatus(
            "آزمایش با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Lab error:",
            error
        );


        showStatus(
            "ثبت آزمایش انجام نشد: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   TREATMENT
   CURRENT SCHEMA
========================================================= */

async function saveTreatment(event) {

    event.preventDefault();


    try {

        const medicationName =
            value(
                "treatmentMedicationName"
            );


        const payload = {

            flock_id:
                currentFlock.id,

            owner_id:
                currentUser.id,

            start_date:
                dateValue(
                    "treatmentDate"
                ),

            end_date:
                dateValue(
                    "treatmentEnd"
                ),

            medicine_name:
                medicationName,

            active_ingredient:
                value(
                    "treatmentActive"
                ),

            dose:
                numericValue(
                    "treatmentDose"
                ),

            dose_unit:
                null,

            route:
                value(
                    "treatmentRoute"
                ),

            indication:
                value(
                    "treatmentDisease"
                ),

            withdrawal_days:
                withdrawalDays(
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
            !payload.start_date
        ) {

            throw new Error(
                "تاریخ شروع درمان الزامی است."
            );

        }


        if (
            !payload.medicine_name
        ) {

            throw new Error(
                "نام دارو الزامی است."
            );

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


        if (
            window.jalaliDate
        ) {

            window.jalaliDate
                .prepareDateFields();

        }


        setDefaultDates();


        showStatus(
            "درمان با موفقیت ثبت شد.",
            "success"
        );


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Treatment error:",
            error
        );


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


    table.innerHTML =
        `<tr>
            <td colspan="5">
                در حال دریافت سوابق...
            </td>
        </tr>`;


    const [
        vaccinationsResult,
        antibodiesResult,
        labsResult,
        treatmentsResult
    ] =
        await Promise.all([

            supabaseClient
                .from("vaccinations")
                .select(
                    "id,vaccine_date,vaccine_name,disease,manufacturer,batch_number,route,dose,dose_unit,notes"
                )
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
                .select(
                    "id,start_date,end_date,medicine_name,active_ingredient,dose,dose_unit,route,indication,withdrawal_days,notes"
                )
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


        table.innerHTML =
            `<tr>
                <td colspan="5">
                    خطا در دریافت سوابق
                </td>
            </tr>`;


        return;

    }


    const rows = [];


    /* -------------------------
       VACCINATION
    ------------------------- */

    (vaccinationsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "vaccinations",

                date:
                    displayHealthDate(
                        item.vaccine_date
                    ),

                type:
                    "واکسیناسیون",

                item:
                    item.vaccine_name ||
                    "واکسن",

                details:
                    [
                        item.disease,
                        item.manufacturer,
                        item.dose !== null
                            ? "دوز: " +
                              item.dose
                            : "",
                        routeLabel(
                            item.route
                        ),
                        item.notes
                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* -------------------------
       ANTIBODY
    ------------------------- */

    (antibodiesResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "antibody_tests",

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
                        item.gmt !== null
                            ? "GMT: " +
                              item.gmt
                            : "",
                        item.cv_percent !== null
                            ? "CV: " +
                              item.cv_percent +
                              "%"
                            : ""
                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* -------------------------
       LAB
    ------------------------- */

    (labsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "lab_tests",

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
                        item.ct_value !== null
                            ? "Ct: " +
                              item.ct_value
                            : ""
                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* -------------------------
       TREATMENT
    ------------------------- */

    (treatmentsResult.data || [])
        .forEach(item => {

            rows.push({

                id:
                    item.id,

                table:
                    "treatments",

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
                        item.dose !== null
                            ? "دوز: " +
                              item.dose
                            : "",
                        routeLabel(
                            item.route
                        ),
                        item.indication,
                        item.withdrawal_days !== null
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

        table.innerHTML =
            `<tr>
                <td colspan="5">
                    هنوز سابقه‌ای برای این گله ثبت نشده است.
                </td>
            </tr>`;

        return;

    }


    rows.sort(
        (a, b) =>
            String(b.date)
                .localeCompare(
                    String(a.date)
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
                            onclick="deleteRecord('${row.id}','${row.table}')">

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


    const result =
        String(
            el.value || ""
        ).trim();


    return result || null;

}


/* =========================================================
   NUMERIC VALUE
========================================================= */

function numericValue(id) {

    const raw =
        value(id);


    if (!raw) {
        return null;
    }


    const normalized =
        window.jalaliDate
            ? window.jalaliDate.toEnglishDigits(raw)
            : raw;


    const number =
        parseFloat(
            normalized.replace(
                ",",
                "."
            )
        );


    return Number.isFinite(number)
        ? number
        : null;

}


/* =========================================================
   WITHDRAWAL DAYS
========================================================= */

function withdrawalDays(id) {

    const raw =
        value(id);


    if (!raw) {
        return null;
    }


    const normalized =
        window.jalaliDate
            ? window.jalaliDate.toEnglishDigits(raw)
            : raw;


    const number =
        parseInt(
            normalized,
            10
        );


    return Number.isFinite(number)
        ? number
        : null;

}


/* =========================================================
   NUMBER OR NULL
========================================================= */

function numberOrNull(id) {

    return numericValue(id);

}


/* =========================================================
   DISPLAY DATE
========================================================= */

function displayHealthDate(
    isoDate
) {

    if (!isoDate) {
        return "-";
    }


    if (
        window.jalaliDate
    ) {

        return window.jalaliDate
            .isoToJalali(
                isoDate
            );

    }


    return isoDate;

}


/* =========================================================
   ROUTE
========================================================= */

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


/* =========================================================
   STAGE
========================================================= */

function stageLabel(stage) {

    const map = {

        maternal:
            "تیتر مادری",

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


/* =========================================================
   ESCAPE
========================================================= */

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


/* =========================================================
   STATUS
========================================================= */

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


/* =========================================================
   GLOBAL
========================================================= */

window.deleteRecord =
    deleteRecord;
