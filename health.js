/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE
   نسخه سازگار با health_records
========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;

document.addEventListener(
    "DOMContentLoaded",
    initHealth
);

/* =========================================================
   INIT
========================================================= */

async function initHealth(){

    try{

        const {
            data,
            error
        } =
        await supabaseClient
            .auth
            .getSession();

        if(
            error ||
            !data ||
            !data.session
        ){

            location.href =
                "login.html?message=" +
                encodeURIComponent(
                    "ابتدا وارد سامانه شوید."
                );

            return;
        }

        currentUser =
            data.session.user;

        setupTabs();

        if(
            window.jalaliDate
        ){

            window.jalaliDate
                .prepareDateFields();
        }

        await loadSelection();

        setDefaultDates();

        loadCatalogs();

        await loadHistory();

    }
    catch(error){

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
   انتخاب گله
========================================================= */

async function loadSelection(){

    const selection =
        typeof getCurrentSelection ===
        "function"
            ? getCurrentSelection()
            : {};

    if(
        !selection ||
        !selection.flockId
    ){

        showStatus(
            "ابتدا یک گله را انتخاب کنید.",
            "error"
        );

        setTimeout(
            () => {
                location.href =
                    "flocks.html";
            },
            1200
        );

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

    if(error){
        throw error;
    }

    if(!flock){

        throw new Error(
            "گله انتخاب‌شده پیدا نشد."
        );
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

    if(
        !farmResult.error
    ){

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

    if(
        !houseResult.error
    ){

        currentHouse =
            houseResult.data;
    }

    const info = [

        currentFarm?.name,
        currentHouse?.name,
        currentFlock?.flock_name,
        currentFlock?.strain

    ]
    .filter(Boolean)
    .join(" | ");

    const infoEl =
        document.getElementById(
            "flockInfo"
        );

    if(infoEl){

        infoEl.textContent =
            info ||
            "گله انتخاب‌شده";
    }

    calculateAge();
}

/* =========================================================
   سن
========================================================= */

function calculateAge(){

    if(
        !currentFlock ||
        !currentFlock.placement_date
    ){
        return;
    }

    let age = null;

    if(
        typeof calculateAgeDays ===
        "function"
    ){

        age =
            calculateAgeDays(
                currentFlock.placement_date
            );
    }

    if(
        age === null ||
        age === undefined
    ){

        const start =
            new Date(
                currentFlock.placement_date
            );

        const now =
            new Date();

        age =
            Math.max(
                0,
                Math.floor(
                    (
                        now -
                        start
                    ) /
                    86400000
                )
            );
    }

    [
        "vaccinationAge",
        "antibodyAge"
    ]
    .forEach(
        id => {

            const el =
                document.getElementById(id);

            if(
                el &&
                !el.value
            ){

                el.value =
                    age;
            }
        }
    );
}

/* =========================================================
   TAB
========================================================= */

function setupTabs(){

    document
        .querySelectorAll(
            ".health-tab"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(){

                        const tab =
                            this.dataset.tab;

                        document
                            .querySelectorAll(
                                ".health-tab"
                            )
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );

                        document
                            .querySelectorAll(
                                ".health-panel"
                            )
                            .forEach(
                                panel =>
                                    panel.classList.remove(
                                        "active"
                                    )
                            );

                        this.classList.add(
                            "active"
                        );

                        const panel =
                            document.getElementById(
                                "panel-" +
                                tab
                            );

                        if(panel){

                            panel.classList.add(
                                "active"
                            );
                        }
                    }
                );
            }
        );
}

/* =========================================================
   تاریخ
========================================================= */

function setDefaultDates(){

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
    .forEach(
        id => {

            const el =
                document.getElementById(id);

            if(
                el &&
                !el.value
            ){

                el.value =
                    today;
            }
        }
    );
}

/* =========================================================
   کاتالوگ‌ها
   بدون وابستگی به Supabase
========================================================= */

const DISEASES = [

    {
        code:"ND",
        name:"نیوکاسل",
        category:"ویروسی"
    },

    {
        code:"AI_H9",
        name:"آنفلوانزای پرندگان H9",
        category:"ویروسی"
    },

    {
        code:"IB",
        name:"برونشیت عفونی IB",
        category:"ویروسی"
    },

    {
        code:"IBD",
        name:"گامبورو IBD",
        category:"ویروسی"
    },

    {
        code:"IBH",
        name:"IBH",
        category:"ویروسی"
    },

    {
        code:"ANGARA",
        name:"آنگارا / HHS",
        category:"ویروسی"
    },

    {
        code:"REO",
        name:"ریوویروس",
        category:"ویروسی"
    },

    {
        code:"SALMONELLA",
        name:"سالمونلا",
        category:"باکتریایی"
    },

    {
        code:"MG",
        name:"Mycoplasma gallisepticum (MG)",
        category:"باکتریایی"
    },

    {
        code:"MS",
        name:"Mycoplasma synoviae (MS)",
        category:"باکتریایی"
    },

    {
        code:"E_COLI",
        name:"اشرشیا کلی",
        category:"باکتریایی"
    },

    {
        code:"CLOSTRIDIUM",
        name:"کلستریدیوم",
        category:"باکتریایی"
    },

    {
        code:"ASPERGILLUS",
        name:"آسپرژیلوس / عفونت قارچی",
        category:"قارچی"
    },

    {
        code:"MYCOTOXIN",
        name:"مایکوتوکسیکوز",
        category:"قارچی"
    },

    {
        code:"COCCIDIOSIS",
        name:"کوکسیدیوز",
        category:"انگلی"
    },

    {
        code:"WORM",
        name:"آلودگی کرمی",
        category:"انگلی"
    },

    {
        code:"FLY_PARASITE",
        name:"انگل‌های خارجی",
        category:"انگلی"
    },

    {
        code:"GOUT",
        name:"نقرس",
        category:"متابولیک"
    },

    {
        code:"FLHS",
        name:"سندروم کبد چرب",
        category:"متابولیک"
    },

    {
        code:"RICKETS",
        name:"راشیتیسم / مشکلات استخوانی",
        category:"متابولیک"
    },

    {
        code:"HEAT_STRESS",
        name:"استرس گرمایی",
        category:"متابولیک"
    },

    {
        code:"DEHYDRATION",
        name:"کم‌آبی / اختلال آب و الکترولیت",
        category:"متابولیک"
    }

];

const VACCINES = [

    "نیوکاسل — زنده",
    "نیوکاسل — کشته",
    "برونشیت عفونی IB — زنده",
    "برونشیت عفونی IB — کشته",
    "گامبورو — زنده",
    "گامبورو — کشته",
    "آنفلوانزا H9 — کشته",
    "واکسن ترکیبی نیوکاسل + IB",
    "واکسن ترکیبی نیوکاسل + IB + IBD",
    "واکسن ترکیبی چندگانه",
    "واکسن آبله",
    "واکسن سالمونلا",
    "واکسن مایکوپلاسما",
    "سایر واکسن‌های مجاز"
];

const MEDICATIONS = [

    {
        name:"آموکسی‌سیلین",
        active:"Amoxicillin"
    },

    {
        name:"فلورفنیکل",
        active:"Florfenicol"
    },

    {
        name:"داکسی‌سایکلین",
        active:"Doxycycline"
    },

    {
        name:"تایلوزین",
        active:"Tylosin"
    },

    {
        name:"تیامولین",
        active:"Tiamulin"
    },

    {
        name:"تایلمایکوزین",
        active:"Tilmicosin"
    },

    {
        name:"کولیسـتین",
        active:"Colistin"
    },

    {
        name:"سولفادیمیدین",
        active:"Sulfadimidine"
    },

    {
        name:"آنتی‌کوکسیدیال",
        active:"Anticoccidial"
    },

    {
        name:"ویتامین و الکترولیت",
        active:"Vitamin / Electrolytes"
    },

    {
        name:"برونکودیلاتور",
        active:"Bronchodilator"
    },

    {
        name:"ضدقارچ / جاذب مایکوتوکسین",
        active:"Antifungal / Mycotoxin binder"
    }

];

/* =========================================================
   بارگذاری کاتالوگ
========================================================= */

function loadCatalogs(){

    fillDiseaseSelect(
        "vaccinationDisease"
    );

    fillDiseaseSelect(
        "antibodyDisease"
    );

    fillDiseaseSelect(
        "labDisease"
    );

    fillDiseaseSelect(
        "treatmentDisease"
    );

    fillVaccineSelect();

    fillMedicationSelect();
}

function fillDiseaseSelect(id){

    const select =
        document.getElementById(id);

    if(!select){
        return;
    }

    select.innerHTML =
        `<option value="">
            انتخاب کنید
        </option>`;

    const categories = {};

    DISEASES.forEach(
        disease => {

            if(
                !categories[
                    disease.category
                ]
            ){

                categories[
                    disease.category
                ] = [];
            }

            categories[
                disease.category
            ].push(disease);
        }
    );

    Object
        .keys(categories)
        .forEach(
            category => {

                const group =
                    document.createElement(
                        "optgroup"
                    );

                group.label =
                    category;

                categories[
                    category
                ].forEach(
                    disease => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            disease.code;

                        option.textContent =
                            disease.name;

                        group.appendChild(
                            option
                        );
                    }
                );

                select.appendChild(
                    group
                );
            }
        );
}

function fillVaccineSelect(){

    const select =
        document.getElementById(
            "vaccinationVaccine"
        );

    if(!select){
        return;
    }

    select.innerHTML =
        `<option value="">
            انتخاب واکسن
        </option>`;

    VACCINES.forEach(
        vaccine => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                vaccine;

            option.textContent =
                vaccine;

            select.appendChild(
                option
            );
        }
    );
}

function fillMedicationSelect(){

    const select =
        document.getElementById(
            "treatmentMedication"
        );

    if(!select){
        return;
    }

    select.innerHTML =
        `<option value="">
            انتخاب دارو
        </option>`;

    MEDICATIONS.forEach(
        (med,index) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                String(index);

            option.textContent =
                med.name;

            select.appendChild(
                option
            );
        }
    );

    select.addEventListener(
        "change",
        function(){

            const medication =
                MEDICATIONS[
                    Number(this.value)
                ];

            if(!medication){
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

            if(name){
                name.value =
                    medication.name;
            }

            if(active){
                active.value =
                    medication.active;
            }
        }
    );
}

/* =========================================================
   فرم واکسیناسیون
========================================================= */

document
    .getElementById(
        "vaccinationForm"
    )
    .addEventListener(
        "submit",
        saveVaccination
    );

async function saveVaccination(event){

    event.preventDefault();

    try{

        const vaccine =
            value(
                "vaccinationVaccine"
            );

        const disease =
            value(
                "vaccinationDisease"
            );

        const date =
            value(
                "vaccinationDate"
            );

        if(
            !vaccine ||
            !date
        ){

            showStatus(
                "واکسن و تاریخ واکسیناسیون الزامی است.",
                "error"
            );

            return;
        }

        const diseaseName =
            diseaseNameFromCode(
                disease
            );

        const vaccineName =
            vaccine;

        const notes = [

            diseaseName
                ? "هدف: " +
                  diseaseName
                : "",

            "دوز: " +
                (
                    value(
                        "vaccinationDose"
                    ) || "-"
                ),

            "روش: " +
                routeLabel(
                    value(
                        "vaccinationRoute"
                    )
                ),

            "سری ساخت: " +
                (
                    value(
                        "vaccinationBatch"
                    ) || "-"
                ),

            "تاریخ انقضا: " +
                (
                    value(
                        "vaccinationExpiry"
                    ) || "-"
                ),

            value(
                "vaccinationNotes"
            ) || ""

        ]
        .filter(Boolean)
        .join(" | ");

        const record = {

            owner_id:
                currentUser.id,

            farm_id:
                currentFlock.farm_id,

            house_id:
                currentFlock.house_id,

            flock_id:
                String(
                    currentFlock.id
                ),

            flock_name:
                currentFlock.flock_name,

            type:
                "vaccination",

            record_date:
                date,

            age_days:
                numberOrNull(
                    "vaccinationAge"
                ),

            disease:
                diseaseName,

            name:
                vaccineName,

            manufacturer:
                null,

            active_ingredient:
                null,

            reason:
                diseaseName,

            route:
                value(
                    "vaccinationRoute"
                ),

            dose:
                value(
                    "vaccinationDose"
                ),

            duration:
                null,

            notes:
                notes
        };

        const {
            error
        } =
        await supabaseClient
            .from("health_records")
            .insert(record);

        if(error){
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
    catch(error){

        console.error(error);

        showStatus(
            "ثبت واکسیناسیون انجام نشد: " +
            error.message,
            "error"
        );
    }
}

/* =========================================================
   آنتی‌بادی
========================================================= */

document
    .getElementById(
        "antibodyForm"
    )
    .addEventListener(
        "submit",
        saveAntibody
    );

async function saveAntibody(event){

    event.preventDefault();

    try{

        const disease =
            value(
                "antibodyDisease"
            );

        const date =
            value(
                "antibodyDate"
            );

        if(
            !disease ||
            !date
        ){

            showStatus(
                "بیماری و تاریخ آزمایش الزامی است.",
                "error"
            );

            return;
        }

        const diseaseName =
            diseaseNameFromCode(
                disease
            );

        const testType =
            value(
                "antibodyTestType"
            );

        const stage =
            stageLabel(
                value(
                    "antibodyStage"
                )
            );

        const details = [

            "نوع تیتر: " +
                stage,

            "روش: " +
                testType,

            "نمونه: " +
                (
                    value(
                        "antibodySamples"
                    ) || "-"
                ),

            "GMT: " +
                (
                    value(
                        "antibodyGMT"
                    ) || "-"
                ),

            "CV: " +
                (
                    value(
                        "antibodyCV"
                    )
                    ? value(
                        "antibodyCV"
                    ) + "%"
                    : "-"
                ),

            "حداقل: " +
                (
                    value(
                        "antibodyMin"
                    ) || "-"
                ),

            "حداکثر: " +
                (
                    value(
                        "antibodyMax"
                    ) || "-"
                ),

            "آزمایشگاه: " +
                (
                    value(
                        "antibodyLab"
                    ) || "-"
                ),

            value(
                "antibodyNotes"
            ) || ""

        ]
        .filter(Boolean)
        .join(" | ");

        const record = {

            owner_id:
                currentUser.id,

            farm_id:
                currentFlock.farm_id,

            house_id:
                currentFlock.house_id,

            flock_id:
                String(
                    currentFlock.id
                ),

            flock_name:
                currentFlock.flock_name,

            type:
                "antibody",

            record_date:
                date,

            age_days:
                numberOrNull(
                    "antibodyAge"
                ),

            disease:
                diseaseName,

            name:
                testType,

            manufacturer:
                null,

            active_ingredient:
                null,

            reason:
                stage,

            route:
                null,

            dose:
                null,

            duration:
                null,

            notes:
                details
        };

        const {
            error
        } =
        await supabaseClient
            .from("health_records")
            .insert(record);

        if(error){
            throw error;
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
    catch(error){

        console.error(error);

        showStatus(
            "ثبت تیتر انجام نشد: " +
            error.message,
            "error"
        );
    }
}

/* =========================================================
   آزمایش
========================================================= */

document
    .getElementById(
        "labForm"
    )
    .addEventListener(
        "submit",
        saveLab
    );

async function saveLab(event){

    event.preventDefault();

    try{

        const date =
            value(
                "labDate"
            );

        if(!date){

            showStatus(
                "تاریخ آزمایش الزامی است.",
                "error"
            );

            return;
        }

        const disease =
            value(
                "labDisease"
            );

        const diseaseName =
            diseaseNameFromCode(
                disease
            );

        const testType =
            value(
                "labType"
            );

        const details = [

            "نوع آزمایش: " +
                testType,

            "نمونه: " +
                (
                    value(
                        "labSampleType"
                    ) || "-"
                ),

            "تعداد نمونه: " +
                (
                    value(
                        "labSampleCount"
                    ) || "-"
                ),

            "تعداد مثبت: " +
                (
                    value(
                        "labPositiveCount"
                    ) || "-"
                ),

            "Ct: " +
                (
                    value(
                        "labCT"
                    ) || "-"
                ),

            "نتیجه: " +
                (
                    value(
                        "labResult"
                    ) || "-"
                ),

            "آزمایشگاه: " +
                (
                    value(
                        "labLaboratory"
                    ) || "-"
                ),

            "آنتی‌بیوگرام: " +
                (
                    value(
                        "labSensitivity"
                    ) || "-"
                ),

            value(
                "labNotes"
            ) || ""

        ]
        .filter(Boolean)
        .join(" | ");

        const record = {

            owner_id:
                currentUser.id,

            farm_id:
                currentFlock.farm_id,

            house_id:
                currentFlock.house_id,

            flock_id:
                String(
                    currentFlock.id
                ),

            flock_name:
                currentFlock.flock_name,

            type:
                "laboratory",

            record_date:
                date,

            age_days:
                calculateCurrentAge(),

            disease:
                diseaseName,

            name:
                testType,

            manufacturer:
                null,

            active_ingredient:
                null,

            reason:
                diseaseName,

            route:
                null,

            dose:
                value(
                    "labResult"
                ),

            duration:
                null,

            notes:
                details
        };

        const {
            error
        } =
        await supabaseClient
            .from("health_records")
            .insert(record);

        if(error){
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
    catch(error){

        console.error(error);

        showStatus(
            "ثبت آزمایش انجام نشد: " +
            error.message,
            "error"
        );
    }
}

/* =========================================================
   درمان
========================================================= */

document
    .getElementById(
        "treatmentForm"
    )
    .addEventListener(
        "submit",
        saveTreatment
    );

async function saveTreatment(event){

    event.preventDefault();

    try{

        const startDate =
            value(
                "treatmentDate"
            );

        let medication =
            value(
                "treatmentMedicationName"
            );

        if(!medication){

            showStatus(
                "نام دارو الزامی است.",
                "error"
            );

            return;
        }

        const disease =
            value(
                "treatmentDisease"
            );

        const diseaseName =
            diseaseNameFromCode(
                disease
            );

        const details = [

            "علت: " +
                (
                    diseaseName || "-"
                ),

            "ماده مؤثره: " +
                (
                    value(
                        "treatmentActive"
                    ) || "-"
                ),

            "دوز: " +
                (
                    value(
                        "treatmentDose"
                    ) || "-"
                ),

            "روش: " +
                routeLabel(
                    value(
                        "treatmentRoute"
                    )
                ),

            "مدت: " +
                (
                    value(
                        "treatmentDuration"
                    ) || "-"
                ),

            "منع مصرف: " +
                (
                    value(
                        "treatmentWithdrawal"
                    ) || "-"
                ),

            "نتیجه: " +
                (
                    treatmentResultLabel(
                        value(
                            "treatmentResult"
                        )
                    )
                ),

            "پایان: " +
                (
                    value(
                        "treatmentEnd"
                    ) || "-"
                ),

            value(
                "treatmentNotes"
            ) || ""

        ]
        .filter(Boolean)
        .join(" | ");

        const record = {

            owner_id:
                currentUser.id,

            farm_id:
                currentFlock.farm_id,

            house_id:
                currentFlock.house_id,

            flock_id:
                String(
                    currentFlock.id
                ),

            flock_name:
                currentFlock.flock_name,

            type:
                "treatment",

            record_date:
                startDate,

            end_date:
                value(
                    "treatmentEnd"
                ),

            age_days:
                calculateCurrentAge(),

            disease:
                diseaseName,

            name:
                medication,

            manufacturer:
                null,

            active_ingredient:
                value(
                    "treatmentActive"
                ),

            reason:
                diseaseName,

            route:
                value(
                    "treatmentRoute"
                ),

            dose:
                value(
                    "treatmentDose"
                ),

            duration:
                value(
                    "treatmentDuration"
                ),

            notes:
                details
        };

        const {
            error
        } =
        await supabaseClient
            .from("health_records")
            .insert(record);

        if(error){
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
    catch(error){

        console.error(error);

        showStatus(
            "ثبت درمان انجام نشد: " +
            error.message,
            "error"
        );
    }
}

/* =========================================================
   سوابق
========================================================= */

async function loadHistory(){

    const table =
        document.getElementById(
            "healthTable"
        );

    if(!table){
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="5">
                در حال دریافت سوابق...
            </td>
        </tr>
    `;

    if(
        !currentFlock ||
        !currentUser
    ){
        return;
    }

    const {
        data,
        error
    } =
    await supabaseClient
        .from("health_records")
        .select("*")
        .eq(
            "owner_id",
            currentUser.id
        )
        .eq(
            "flock_id",
            String(
                currentFlock.id
            )
        )
        .order(
            "record_date",
            {
                ascending:false
            }
        );

    if(error){

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    خطا در دریافت سوابق:
                    ${escapeSafe(error.message)}
                </td>
            </tr>
        `;

        return;
    }

    if(
        !data ||
        !data.length
    ){

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
        data
            .map(
                row => {

                    return `

                    <tr>

                        <td>
                            ${escapeSafe(
                                displayHealthDate(
                                    row.record_date
                                )
                            )}
                        </td>

                        <td>
                            <span class="badge">
                                ${escapeSafe(
                                    typeLabel(
                                        row.type
                                    )
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeSafe(
                                row.name ||
                                row.disease ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeSafe(
                                makeDetails(
                                    row
                                )
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn btn-danger"
                                onclick="deleteHealthRecord('${row.id}')">

                                حذف

                            </button>

                        </td>

                    </tr>
                    `;
                }
            )
            .join("");
}

/* =========================================================
   جزئیات سابقه
========================================================= */

function makeDetails(row){

    const parts = [];

    if(row.disease){
        parts.push(
            "بیماری: " +
            row.disease
        );
    }

    if(row.active_ingredient){
        parts.push(
            "ماده مؤثره: " +
            row.active_ingredient
        );
    }

    if(row.dose){
        parts.push(
            "دوز: " +
            row.dose
        );
    }

    if(row.route){
        parts.push(
            routeLabel(
                row.route
            )
        );
    }

    if(row.duration){
        parts.push(
            "مدت: " +
            row.duration
        );
    }

    if(row.notes){
        parts.push(
            row.notes
        );
    }

    return parts.length
        ? parts.join(" | ")
        : "-";
}

/* =========================================================
   حذف
========================================================= */

async function deleteHealthRecord(id){

    if(
        !confirm(
            "آیا این رکورد حذف شود؟"
        )
    ){
        return;
    }

    const {
        error
    } =
    await supabaseClient
        .from("health_records")
        .delete()
        .eq(
            "id",
            id
        )
        .eq(
            "owner_id",
            currentUser.id
        );

    if(error){

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

window.deleteHealthRecord =
    deleteHealthRecord;

/* =========================================================
   HELPERS
========================================================= */

function value(id){

    const el =
        document.getElementById(id);

    if(!el){
        return null;
    }

    const result =
        String(
            el.value || ""
        ).trim();

    if(!result){
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

    if(
        dateIds.includes(id)
    ){

        const iso =
            window.jalaliDate
                ? window.jalaliDate
                    .jalaliToISO(
                        result
                    )
                : null;

        if(!iso){

            throw new Error(
                "تاریخ واردشده معتبر نیست."
            );
        }

        return iso;
    }

    return result;
}

function numberOrNull(id){

    const result =
        value(id);

    if(result === null){
        return null;
    }

    const number =
        Number(result);

    return Number.isFinite(number)
        ? number
        : null;
}

function calculateCurrentAge(){

    if(
        !currentFlock ||
        !currentFlock.placement_date
    ){
        return null;
    }

    const start =
        new Date(
            currentFlock.placement_date
        );

    const now =
        new Date();

    return Math.max(
        0,
        Math.floor(
            (
                now -
                start
            ) /
            86400000
        )
    );
}

function displayHealthDate(date){

    if(!date){
        return "-";
    }

    if(
        window.jalaliDate
    ){

        return window.jalaliDate
            .isoToJalali(
                date
            );
    }

    return date;
}

function diseaseNameFromCode(code){

    const disease =
        DISEASES.find(
            item =>
                item.code === code
        );

    return disease
        ? disease.name
        : code || "";
}

function routeLabel(route){

    const map = {

        water:"آب آشامیدنی",
        spray:"اسپری",
        eye:"قطره چشمی",
        wing:"بال‌زدن",
        injection:"تزریقی",
        feed:"دان",
        oral:"خوراکی",
        other:"سایر"
    };

    return (
        map[route] ||
        route ||
        "-"
    );
}

function stageLabel(stage){

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
        "-"
    );
}

function treatmentResultLabel(result){

    const map = {

        improved:"بهبود",

        partial:"بهبود نسبی",

        failed:"عدم پاسخ"
    };

    return (
        map[result] ||
        "ثبت نشده"
    );
}

function typeLabel(type){

    const map = {

        vaccination:
            "واکسیناسیون",

        antibody:
            "تیتر آنتی‌بادی",

        laboratory:
            "آزمایش",

        treatment:
            "درمان"

    };

    return (
        map[type] ||
        type ||
        "سلامت"
    );
}

function escapeSafe(value){

    if(
        typeof escapeHTML ===
        "function"
    ){

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
){

    const el =
        document.getElementById(
            "healthStatus"
        );

    if(!el){
        return;
    }

    el.textContent =
        message;

    el.className =
        "health-status " +
        type;

    clearTimeout(
        showStatus.timer
    );

    showStatus.timer =
        setTimeout(
            function(){

                el.className =
                    "health-status";

            },
            5000
        );
}

window.showHealthStatus =
    showStatus;
