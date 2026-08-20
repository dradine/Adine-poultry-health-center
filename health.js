/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE
   FINAL STABLE VERSION
   ========================================================= */

"use strict";


let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;


/* =========================================================
   LOCAL JALALI DATE ENGINE
   اگر jalali-date.js موجود باشد از آن استفاده می‌شود.
   در غیر این صورت همین موتور فعال می‌شود.
========================================================= */

(function installJalaliFallback() {

    if (
        window.jalaliDate &&
        typeof window.jalaliDate.jalaliToISO === "function"
    ) {
        return;
    }


    function toEnglishDigits(value) {

        return String(value ?? "")
            .replace(/[۰-۹]/g, d =>
                String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
            )
            .replace(/[٠-٩]/g, d =>
                String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
            );

    }


    function div(a, b) {

        return Math.floor(a / b);

    }


    function jalaliToGregorian(jy, jm, jd) {

        let gy;

        if (jy > 979) {

            gy = 1600;

            jy -= 979;

        } else {

            gy = 621;

        }


        let days =
            365 * jy +
            div(jy, 33) * 8 +
            div((jy % 33) + 3, 4) +
            78 +
            jd;


        if (jm < 7) {

            days += (jm - 1) * 31;

        } else {

            days += (jm - 7) * 30 + 186;

        }


        gy += 400 * div(days, 146097);

        days %= 146097;


        if (days > 36524) {

            gy += 100 * div(--days, 36524);

            days %= 36524;

            if (days >= 365) {
                days++;
            }

        }


        gy += 4 * div(days, 1461);

        days %= 1461;


        if (days > 365) {

            gy += div(days - 1, 365);

            days =
                (days - 1) % 365;

        }


        let gd = days + 1;

        const sal_a = [
            0,
            31,
            ((gy % 4 === 0 &&
              gy % 100 !== 0) ||
              gy % 400 === 0)
                ? 29
                : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];


        let gm = 0;


        while (
            gm < 13 &&
            gd > sal_a[gm]
        ) {

            gd -= sal_a[gm];
            gm++;

        }


        return [
            gy,
            gm,
            gd
        ];

    }


    function gregorianToJalali(gy, gm, gd) {

        const gdm = [
            0,
            31,
            59,
            90,
            120,
            151,
            181,
            212,
            243,
            273,
            304,
            334
        ];


        let jy;

        if (gy > 1600) {

            jy = 979;
            gy -= 1600;

        } else {

            jy = 0;
            gy -= 621;

        }


        const gy2 =
            gm > 2
                ? gy + 1
                : gy;


        let days =
            365 * gy +
            div(gy2 + 3, 4) -
            div(gy2 + 99, 100) +
            div(gy2 + 399, 400) -
            80 +
            gd +
            gdm[gm - 1];


        jy +=
            33 * div(days, 12053);

        days %= 12053;


        jy +=
            4 * div(days, 1461);

        days %= 1461;


        if (days > 365) {

            jy +=
                div(days - 1, 365);

            days =
                (days - 1) % 365;

        }


        let jm;
        let jd;


        if (days < 186) {

            jm =
                1 +
                div(days, 31);

            jd =
                1 +
                (days % 31);

        } else {

            jm =
                7 +
                div(days - 186, 30);

            jd =
                1 +
                ((days - 186) % 30);

        }


        return [
            jy,
            jm,
            jd
        ];

    }


    function formatNumber(n) {

        return String(n)
            .padStart(2, "0");

    }


    function normalizeJalali(text) {

        const value =
            toEnglishDigits(text)
                .replace(/[-.]/g, "/")
                .replace(/\s+/g, "");


        const parts =
            value.split("/");


        if (parts.length !== 3) {
            return null;
        }


        const y =
            parseInt(parts[0], 10);

        const m =
            parseInt(parts[1], 10);

        const d =
            parseInt(parts[2], 10);


        if (
            !Number.isFinite(y) ||
            !Number.isFinite(m) ||
            !Number.isFinite(d)
        ) {
            return null;
        }


        if (
            y < 1200 ||
            y > 1600 ||
            m < 1 ||
            m > 12 ||
            d < 1 ||
            d > 31
        ) {
            return null;
        }


        return {
            y,
            m,
            d
        };

    }


    function jalaliToISO(text) {

        const p =
            normalizeJalali(text);


        if (!p) {
            return null;
        }


        const [
            gy,
            gm,
            gd
        ] =
            jalaliToGregorian(
                p.y,
                p.m,
                p.d
            );


        return (
            gy +
            "-" +
            formatNumber(gm) +
            "-" +
            formatNumber(gd)
        );

    }


    function isoToJalali(iso) {

        const parts =
            String(iso)
                .substring(0, 10)
                .split("-");


        if (parts.length !== 3) {
            return "";
        }


        const gy =
            parseInt(parts[0], 10);

        const gm =
            parseInt(parts[1], 10);

        const gd =
            parseInt(parts[2], 10);


        if (
            !gy ||
            !gm ||
            !gd
        ) {
            return "";
        }


        const [
            jy,
            jm,
            jd
        ] =
            gregorianToJalali(
                gy,
                gm,
                gd
            );


        return [
            jy,
            formatNumber(jm),
            formatNumber(jd)
        ].join("/");

    }


    function todayJalali() {

        const now =
            new Date();


        return isoToJalali(
            now.toISOString()
        );

    }


    window.jalaliDate = {

        toEnglishDigits,

        jalaliToISO,

        isoToJalali,

        todayJalali,

        prepareDateFields() {

            document
                .querySelectorAll(
                    ".jalali-date-wrap input"
                )
                .forEach(input => {

                    input.inputMode =
                        "numeric";

                });

        }

    };

})();


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initHealth
);


async function initHealth() {

    try {

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            throw new Error(
                "Supabase Client بارگذاری نشده است."
            );

        }


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

        setupCalendar();

        setupForms();

        loadMedications();


        await loadCatalogs();


        setDefaultDates();

        calculateAge();


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Health initialization error:",
            error
        );


        showStatus(
            "خطا در بارگذاری بخش سلامت: " +
            safeErrorMessage(error),
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
            : null;


    if (
        !selection ||
        !selection.flockId
    ) {

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


    if (farmResult.error) {
        throw farmResult.error;
    }


    currentFarm =
        farmResult.data || null;


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


    if (houseResult.error) {
        throw houseResult.error;
    }


    currentHouse =
        houseResult.data || null;


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

}


/* =========================================================
   AGE
========================================================= */

function calculateAge() {

    if (
        !currentFlock ||
        !currentFlock.placement_date
    ) {
        return;
    }


    let age = null;


    if (
        typeof calculateAgeDays ===
        "function"
    ) {

        try {

            age =
                calculateAgeDays(
                    currentFlock.placement_date
                );

        }
        catch (error) {

            console.warn(
                "calculateAgeDays error:",
                error
            );

        }

    }


    if (
        age === null ||
        age === undefined
    ) {

        const placement =
            new Date(
                currentFlock.placement_date
            );


        if (
            !Number.isNaN(
                placement.getTime()
            )
        ) {

            const today =
                new Date();


            age =
                Math.floor(
                    (
                        today -
                        placement
                    ) /
                    86400000
                );

        }

    }


    if (
        age === null ||
        age === undefined ||
        !Number.isFinite(
            Number(age)
        )
    ) {
        return;
    }


    const field =
        document.getElementById(
            "antibodyAge"
        );


    if (
        field &&
        !field.value
    ) {

        field.value =
            Math.max(
                0,
                Math.floor(
                    Number(age)
                )
            );

    }

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
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    document
                        .querySelectorAll(
                            ".health-panel"
                        )
                        .forEach(panel =>
                            panel.classList.remove(
                                "active"
                            )
                        );


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
   FORMS
========================================================= */

function setupForms() {

    const forms = [

        [
            "vaccinationForm",
            saveVaccination
        ],

        [
            "antibodyForm",
            saveAntibody
        ],

        [
            "labForm",
            saveLab
        ],

        [
            "treatmentForm",
            saveTreatment
        ]

    ];


    forms.forEach(
        ([id, handler]) => {

            const form =
                document.getElementById(id);


            if (form) {

                form.addEventListener(
                    "submit",
                    handler
                );

            }

        }
    );

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
            "موتور تاریخ شمسی در دسترس نیست."
        );

    }


    const iso =
        window.jalaliDate
            .jalaliToISO(text);


    if (!iso) {

        throw new Error(
            "تاریخ معتبر نیست. مثال: ۱۴۰۵/۰۵/۳۰"
        );

    }


    return iso;

}


/* =========================================================
   CATALOGS
========================================================= */

async function loadCatalogs() {

    await Promise.allSettled([

        loadDiseases(),

        loadVaccines()

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
                        disease.name_fa ||
                        disease.name_en ||
                        disease.code;


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
   MEDICATION CATALOG
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
        name: "کولیستین",
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


    select.innerHTML =
        `<option value="">
            انتخاب دارو
        </option>`;


    LOCAL_MEDICATION_CATALOG
        .forEach(
            (medication, index) => {

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

            }
        );


    select.addEventListener(
        "change",
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

        }
    );

}


/* =========================================================
   VACCINATION
========================================================= */

async function saveVaccination(event) {

    event.preventDefault();


    const form =
        event.target;


    if (
        !currentUser ||
        !currentFlock
    ) {

        showStatus(
            "اطلاعات کاربر یا گله موجود نیست.",
            "error"
        );

        return;

    }


    setFormBusy(
        form,
        true
    );


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
            "";


        if (!vaccineName) {

            throw new Error(
                "واکسن را انتخاب کنید."
            );

        }


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
                selectedOption?.dataset?.manufacturer ||
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
                numericValue(
                    "vaccinationDose"
                ),

            dose_unit:
                value(
                    "vaccinationDoseUnit"
                ) || "dose",

            administered_by:
                value(
                    "vaccinationAdministeredBy"
                ),

            notes:
                value(
                    "vaccinationNotes"
                )

        };


        if (!payload.vaccine_date) {

            throw new Error(
                "تاریخ واکسیناسیون الزامی است."
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


        resetFormWithDates(
            form
        );


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
            safeErrorMessage(error),
            "error"
        );

    }
    finally {

        setFormBusy(
            form,
            false
        );

    }

}


/* =========================================================
   ANTIBODY
========================================================= */

async function saveAntibody(event) {

    event.preventDefault();


    const form =
        event.target;


    setFormBusy(
        form,
        true
    );


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


        if (!payload.disease_code) {

            throw new Error(
                "بیماری را انتخاب کنید."
            );

        }


        if (!payload.test_date) {

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


        resetFormWithDates(
            form
        );


        calculateAge();


        showStatus(
            "تیتر آنتی‌بادی با موفقیت ثبت شد.",
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
            safeErrorMessage(error),
            "error"
        );

    }
    finally {

        setFormBusy(
            form,
            false
        );

    }

}


/* =========================================================
   LAB
========================================================= */

async function saveLab(event) {

    event.preventDefault();


    const form =
        event.target;


    setFormBusy(
        form,
        true
    );


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


        if (!payload.test_date) {

            throw new Error(
                "تاریخ آزمایش الزامی است."
            );

        }


        if (!payload.test_type) {

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


        resetFormWithDates(
            form
        );


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
            safeErrorMessage(error),
            "error"
        );

    }
    finally {

        setFormBusy(
            form,
            false
        );

    }

}


/* =========================================================
   TREATMENT
   بخش حساس ثبت درمان
========================================================= */

async function saveTreatment(event) {

    event.preventDefault();


    const form =
        event.target;


    setFormBusy(
        form,
        true
    );


    try {

        if (
            !currentUser ||
            !currentFlock
        ) {

            throw new Error(
                "کاربر یا گله انتخاب‌شده مشخص نیست."
            );

        }


        const startDate =
            dateValue(
                "treatmentDate"
            );


        const endDate =
            dateValue(
                "treatmentEnd"
            );


        const medicationName =
            value(
                "treatmentMedicationName"
            );


        const activeIngredient =
            value(
                "treatmentActive"
            );


        const route =
            value(
                "treatmentRoute"
            );


        const indication =
            value(
                "treatmentDisease"
            );


        const dose =
            numericValue(
                "treatmentDose"
            );


        const withdrawal =
            withdrawalDays(
                "treatmentWithdrawal"
            );


        /* -------------------------
           VALIDATION
        ------------------------- */

        if (!startDate) {

            throw new Error(
                "تاریخ شروع درمان الزامی است."
            );

        }


        if (!medicationName) {

            throw new Error(
                "نام دارو الزامی است."
            );

        }


        if (
            endDate &&
            endDate < startDate
        ) {

            throw new Error(
                "تاریخ پایان درمان نمی‌تواند قبل از تاریخ شروع باشد."
            );

        }


        if (
            dose !== null &&
            dose < 0
        ) {

            throw new Error(
                "دوز دارو نمی‌تواند منفی باشد."
            );

        }


        if (
            withdrawal !== null &&
            withdrawal < 0
        ) {

            throw new Error(
                "دوره منع مصرف نمی‌تواند منفی باشد."
            );

        }


        /* -------------------------
           PAYLOAD
        ------------------------- */

        const payload = {

            flock_id:
                currentFlock.id,

            owner_id:
                currentUser.id,

            start_date:
                startDate,

            end_date:
                endDate,

            medicine_name:
                medicationName,

            active_ingredient:
                activeIngredient,

            dose:
                dose,

            /*
             * فعلاً مطابق Schema فعلی
             * مقدار null ارسال می‌شود.
             */
            dose_unit:
                null,

            route:
                route,

            indication:
                indication,

            withdrawal_days:
                withdrawal,

            veterinarian:
                null,

            notes:
                value(
                    "treatmentNotes"
                )

        };


        /* -------------------------
           INSERT
        ------------------------- */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("treatments")
                .insert(
                    payload
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Treatment insert error:",
                error,
                payload
            );

            throw error;

        }


        if (!data) {

            console.warn(
                "Treatment inserted but no returned row."
            );

        }


        /* -------------------------
           SUCCESS
        ------------------------- */

        resetFormWithDates(
            form
        );


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
            safeErrorMessage(error),
            "error"
        );

    }
    finally {

        setFormBusy(
            form,
            false
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


    if (!table || !currentUser || !currentFlock) {
        return;
    }


    table.innerHTML =
        `<tr>
            <td
                colspan="5"
                class="health-empty"
            >
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


    const errors = [

        vaccinationsResult.error,

        antibodiesResult.error,

        labsResult.error,

        treatmentsResult.error

    ].filter(Boolean);


    if (errors.length) {

        console.error(
            "History errors:",
            errors
        );


        table.innerHTML =
            `<tr>
                <td
                    colspan="5"
                    class="health-empty"
                >
                    خطا در دریافت سوابق
                </td>
            </tr>`;


        return;

    }


    const rows = [];


    /* =====================================================
       VACCINATIONS
    ===================================================== */

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
                    item.vaccine_name ||
                    "واکسن",

                details:
                    [

                        item.disease,

                        item.manufacturer,

                        item.batch_number
                            ? "بچ: " +
                              item.batch_number
                            : "",

                        item.dose !== null
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

                        item.notes

                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* =====================================================
       ANTIBODY
    ===================================================== */

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
                    item.disease_code ||
                    "آنتی‌بادی",

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
                            : "",

                        item.sample_count !== null
                            ? "نمونه: " +
                              item.sample_count
                            : ""

                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* =====================================================
       LAB
    ===================================================== */

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
                    item.test_type ||
                    "آزمایش",

                details:
                    [

                        item.disease_code,

                        item.sample_type,

                        item.result,

                        item.ct_value !== null
                            ? "Ct: " +
                              item.ct_value
                            : "",

                        item.sample_count !== null
                            ? "نمونه: " +
                              item.sample_count
                            : "",

                        item.positive_count !== null
                            ? "مثبت: " +
                              item.positive_count
                            : ""

                    ]
                        .filter(Boolean)
                        .join(" | ")

            });

        });


    /* =====================================================
       TREATMENTS
    ===================================================== */

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
                    item.medicine_name ||
                    "دارو",

                details:
                    [

                        item.active_ingredient,

                        item.dose !== null
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

                        item.indication,

                        item.end_date
                            ? "پایان: " +
                              displayHealthDate(
                                  item.end_date
                              )
                            : "",

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
                <td
                    colspan="5"
                    class="health-empty"
                >
                    هنوز سابقه‌ای برای این گله ثبت نشده است.
                </td>
            </tr>`;

        return;

    }


    /*
     * مرتب‌سازی با تاریخ ISO واقعی
     * نه تاریخ نمایش‌داده‌شده
     */

    rows.sort(
        (a, b) =>
            String(b.rawDate || "")
                .localeCompare(
                    String(a.rawDate || "")
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

                        <span
                            class="health-badge"
                        >
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
                            class="health-delete"
                            data-delete-id="${escapeAttribute(row.id)}"
                            data-delete-table="${escapeAttribute(row.table)}"
                        >
                            حذف
                        </button>

                    </td>

                </tr>

            `)
            .join("");


    table
        .querySelectorAll(
            "[data-delete-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteRecord(
                        button.dataset.deleteId,
                        button.dataset.deleteTable
                    );

                }
            );

        });

}


/* =========================================================
   DELETE
========================================================= */

async function deleteRecord(
    id,
    tableName
) {

    if (!id || !tableName) {
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


    if (
        !confirm(
            "آیا این رکورد حذف شود؟"
        )
    ) {
        return;
    }


    try {

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
                )
                .eq(
                    "flock_id",
                    currentFlock.id
                );


        if (error) {
            throw error;
        }


        showStatus(
            "رکورد با موفقیت حذف شد.",
            "success"
        );


        await loadHistory();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showStatus(
            "حذف انجام نشد: " +
            safeErrorMessage(error),
            "error"
        );

    }

}


/* =========================================================
   CALENDAR
========================================================= */

function setupCalendar() {

    document
        .querySelectorAll(
            "[data-calendar-for]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const inputId =
                        button.dataset.calendarFor;


                    const calendar =
                        document.querySelector(
                            `[data-calendar="${inputId}"]`
                        );


                    if (!calendar) {
                        return;
                    }


                    document
                        .querySelectorAll(
                            ".jalali-calendar.open"
                        )
                        .forEach(other => {

                            if (
                                other !== calendar
                            ) {

                                other.classList.remove(
                                    "open"
                                );

                            }

                        });


                    renderCalendar(
                        calendar,
                        inputId
                    );


                    calendar.classList.toggle(
                        "open"
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".jalali-date-wrap input"
        )
        .forEach(input => {

            input.addEventListener(
                "blur",
                () => {

                    const normalized =
                        normalizeDateText(
                            input.value
                        );


                    if (
                        normalized
                    ) {

                        input.value =
                            normalized;

                    }

                }
            );

        });


    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".jalali-date-wrap"
                )
            ) {

                document
                    .querySelectorAll(
                        ".jalali-calendar.open"
                    )
                    .forEach(calendar =>
                        calendar.classList.remove(
                            "open"
                        )
                    );

            }

        }
    );

}


/* =========================================================
   CALENDAR RENDER
========================================================= */

let calendarState = {};


function renderCalendar(
    calendar,
    inputId
) {

    const input =
        document.getElementById(
            inputId
        );


    const current =
        normalizeDateObject(
            input?.value
        );


    const today =
        normalizeDateObject(
            window.jalaliDate.todayJalali()
        );


    const year =
        current?.y ||
        today.y;


    const month =
        current?.m ||
        today.m;


    calendarState[inputId] = {

        year,

        month

    };


    drawCalendar(
        calendar,
        inputId
    );

}


function drawCalendar(
    calendar,
    inputId
) {

    const state =
        calendarState[inputId];


    if (!state) {
        return;
    }


    const year =
        state.year;


    const month =
        state.month;


    const firstISO =
        window.jalaliDate
            .jalaliToISO(
                `${year}/${String(month).padStart(2,"0")}/01`
            );


    const [
        gy,
        gm,
        gd
    ] =
        firstISO
            .split("-")
            .map(Number);


    const firstDate =
        new Date(
            Date.UTC(
                gy,
                gm - 1,
                gd
            )
        );


    /*
     * ایران: شنبه = اولین ستون
     * JS: یکشنبه = 0
     */

    const jsDay =
        firstDate.getUTCDay();


    const offset =
        (jsDay + 1) % 7;


    const daysInMonth =
        month <= 6
            ? 31
            : month <= 11
                ? 30
                : isJalaliLeapYear(year)
                    ? 30
                    : 29;


    const today =
        normalizeDateObject(
            window.jalaliDate.todayJalali()
        );


    let html = `

        <div class="jalali-calendar-header">

            <button
                type="button"
                data-cal-prev
            >
                ‹
            </button>

            <div class="jalali-calendar-title">
                ${year}/${String(month).padStart(2,"0")}
            </div>

            <button
                type="button"
                data-cal-next
            >
                ›
            </button>

        </div>

        <div class="jalali-calendar-weekdays">

            <div>ش</div>
            <div>ی</div>
            <div>د</div>
            <div>س</div>
            <div>چ</div>
            <div>پ</div>
            <div>ج</div>

        </div>

        <div class="jalali-calendar-days">
    `;


    for (
        let i = 0;
        i < offset;
        i++
    ) {

        html += `<span></span>`;

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const isToday =
            today &&
            today.y === year &&
            today.m === month &&
            today.d === day;


        html += `

            <button
                type="button"
                class="${isToday ? "today" : ""}"
                data-cal-day="${day}"
            >
                ${day}
            </button>

        `;

    }


    html += `
        </div>
    `;


    calendar.innerHTML =
        html;


    calendar
        .querySelector(
            "[data-cal-prev]"
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                changeCalendarMonth(
                    inputId,
                    -1
                );

            }
        );


    calendar
        .querySelector(
            "[data-cal-next]"
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                changeCalendarMonth(
                    inputId,
                    1
                );

            }
        );


    calendar
        .querySelectorAll(
            "[data-cal-day]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const day =
                        Number(
                            button.dataset.calDay
                        );


                    const input =
                        document.getElementById(
                            inputId
                        );


                    if (input) {

                        input.value =
                            `${toPersianDigits(year.toString())}/${toPersianDigits(String(month).padStart(2,"0"))}/${toPersianDigits(String(day).padStart(2,"0"))}`;

                    }


                    calendar.classList.remove(
                        "open"
                    );

                }
            );

        });

}


function changeCalendarMonth(
    inputId,
    delta
) {

    const state =
        calendarState[inputId];


    if (!state) {
        return;
    }


    state.month += delta;


    if (state.month > 12) {

        state.month = 1;
        state.year++;

    }


    if (state.month < 1) {

        state.month = 12;
        state.year--;

    }


    const calendar =
        document.querySelector(
            `[data-calendar="${inputId}"]`
        );


    if (calendar) {

        drawCalendar(
            calendar,
            inputId
        );

    }

}


/* =========================================================
   JALALI HELPERS
========================================================= */

function isJalaliLeapYear(year) {

    const next =
        window.jalaliDate.jalaliToISO(
            `${year + 1}/01/01`
        );


    const current =
        window.jalaliDate.jalaliToISO(
            `${year}/01/01`
        );


    if (!next || !current) {
        return false;
    }


    const difference =
        (
            new Date(next) -
            new Date(current)
        ) /
        86400000;


    return difference === 366;

}


function normalizeDateObject(value) {

    const text =
        normalizeDateText(
            value
        );


    if (!text) {
        return null;
    }


    const parts =
        window.jalaliDate
            .toEnglishDigits(text)
            .split("/");


    return {

        y:
            Number(parts[0]),

        m:
            Number(parts[1]),

        d:
            Number(parts[2])

    };

}


function normalizeDateText(value) {

    const text =
        String(value || "")
            .trim();


    if (!text) {
        return "";
    }


    const normalized =
        window.jalaliDate
            .toEnglishDigits(
                text
            )
            .replace(/[-.]/g, "/")
            .replace(/\s+/g, "");


    const parts =
        normalized.split("/");


    if (parts.length !== 3) {
        return "";
    }


    const y =
        Number(parts[0]);


    const m =
        Number(parts[1]);


    const d =
        Number(parts[2]);


    if (
        !Number.isInteger(y) ||
        !Number.isInteger(m) ||
        !Number.isInteger(d)
    ) {
        return "";
    }


    const maxDay =
        m <= 6
            ? 31
            : m <= 11
                ? 30
                : isJalaliLeapYear(y)
                    ? 30
                    : 29;


    if (
        y < 1200 ||
        y > 1600 ||
        m < 1 ||
        m > 12 ||
        d < 1 ||
        d > maxDay
    ) {
        return "";
    }


    return [
        y,
        String(m).padStart(2, "0"),
        String(d).padStart(2, "0")
    ].join("/");

}


function toPersianDigits(value) {

    return String(value)
        .replace(/\d/g, d =>
            "۰۱۲۳۴۵۶۷۸۹"[Number(d)]
        );

}


/* =========================================================
   NUMERIC
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


    const clean =
        normalized
            .replace(/\s/g, "")
            .replace(/,/g, ".")
            .replace(/٫/g, ".")
            .replace(/[^\d.+-]/g, "");


    const number =
        Number(
            clean
        );


    return Number.isFinite(number)
        ? number
        : null;

}


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


    const clean =
        normalized
            .replace(/[^\d-]/g, "");


    if (!clean) {
        return null;
    }


    const number =
        Number.parseInt(
            clean,
            10
        );


    return Number.isFinite(number)
        ? number
        : null;

}


function numberOrNull(id) {

    return numericValue(id);

}


/* =========================================================
   VALUE
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
   RESET
========================================================= */

function resetFormWithDates(form) {

    if (!form) {
        return;
    }


    form.reset();


    setTimeout(
        () => {

            setDefaultDates();

            calculateAge();

        },
        0
    );

}


/* =========================================================
   FORM BUSY
========================================================= */

function setFormBusy(
    form,
    busy
) {

    if (!form) {
        return;
    }


    const button =
        form.querySelector(
            'button[type="submit"]'
        );


    if (!button) {
        return;
    }


    if (busy) {

        button.disabled =
            true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "در حال ثبت...";

    }
    else {

        button.disabled =
            false;

        button.textContent =
            button.dataset.originalText ||
            "ثبت";

    }

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
        window.jalaliDate &&
        typeof window.jalaliDate.isoToJalali ===
        "function"
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

function escapeSafe(input) {

    const value =
        String(
            input ?? ""
        );


    if (
        typeof escapeHTML ===
        "function"
    ) {

        return escapeHTML(
            value
        );

    }


    return value
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


function escapeAttribute(value) {

    return escapeSafe(
        value
    );

}


/* =========================================================
   ERROR
========================================================= */

function safeErrorMessage(error) {

    if (!error) {
        return "خطای نامشخص";
    }


    if (
        typeof error === "string"
    ) {
        return error;
    }


    return (
        error.message ||
        error.details ||
        error.hint ||
        "خطای نامشخص"
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
        (
            type === "success"
                ? "success"
                : "error"
        );


    clearTimeout(
        showStatus.timer
    );


    showStatus.timer =
        setTimeout(
            () => {

                el.className =
                    "health-status";

            },
            6000
        );

}


/* =========================================================
   GLOBAL
========================================================= */

window.deleteRecord =
    deleteRecord;

window.saveVaccination =
    saveVaccination;

window.saveAntibody =
    saveAntibody;

window.saveLab =
    saveLab;

window.saveTreatment =
    saveTreatment;
