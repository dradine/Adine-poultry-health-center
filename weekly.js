/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY MONITORING
   STABLE CALCULATION VERSION
   Persian / Arabic / English Numbers
   Shamsi Date
   Supabase
   Editing Records
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let currentUser = null;

let currentFlock = null;

let weeklyRecords = [];

let weightChart = null;

let editingRecordId = null;


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeWeekly
);


async function initializeWeekly() {

    try {

        prepareNumericInputs();

        const access =
            await checkUserAccess();


        if (!access.authenticated) {

            location.href =
                "login.html?message=" +
                encodeURIComponent(
                    "ابتدا وارد سامانه شوید."
                );

            return;

        }


        if (!access.allowed) {

            alert(
                "حساب شما هنوز تأیید نشده است."
            );

            await logoutUser();

            return;

        }


        currentUser =
            access.user;


        setToday();


        await loadCurrentFlock();

    }

    catch (error) {

        console.error(
            "Weekly initialization:",
            error
        );

        alert(
            "خطا در راه‌اندازی ثبت هفتگی."
        );

    }

}


/* =========================================================
   NUMERIC INPUTS
   ========================================================= */

function prepareNumericInputs() {

    const numericIds = [

        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird"

    ];


    numericIds.forEach(
        id => {

            const input =
                document.getElementById(id);


            if (!input) {

                return;

            }


            input.type =
                "text";


            input.inputMode =
                "decimal";


            input.setAttribute(
                "autocomplete",
                "off"
            );


            attachNumberInputHandler(
                input
            );

        }
    );


    document
        .querySelectorAll(
            ".bird-weight"
        )
        .forEach(
            input => {

                prepareWeightInput(
                    input
                );

            }
        );

}


/* =========================================================
   WEIGHT INPUT
   ========================================================= */

function prepareWeightInput(
    input
) {

    if (!input) {

        return;

    }


    input.type =
        "text";


    input.inputMode =
        "decimal";


    input.setAttribute(
        "autocomplete",
        "off"
    );


    attachNumberInputHandler(
        input
    );

}


/* =========================================================
   NUMBER INPUT HANDLER
   ========================================================= */

function attachNumberInputHandler(
    input
) {

    if (!input) {

        return;

    }


    if (
        input.dataset.numberPrepared ===
        "true"
    ) {

        return;

    }


    input.dataset.numberPrepared =
        "true";


    input.addEventListener(
        "input",
        function () {

            this.value =
                normalizeNumberString(
                    this.value
                );

        }
    );

}


/* =========================================================
   NORMALIZE NUMBER
   ========================================================= */

function normalizeNumberString(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    let text =
        String(value);


    /*
     * Persian digits
     */
    text =
        text.replace(
            /[۰-۹]/g,
            digit =>
                String(
                    digit.charCodeAt(0) -
                    1776
                )
        );


    /*
     * Arabic digits
     */
    text =
        text.replace(
            /[٠-٩]/g,
            digit =>
                String(
                    digit.charCodeAt(0) -
                    1632
                )
        );


    /*
     * Persian thousands separator
     */
    text =
        text.replaceAll(
            "٬",
            ""
        );


    /*
     * English thousands separator
     */
    text =
        text.replaceAll(
            ",",
            ""
        );


    /*
     * Persian decimal separator
     */
    text =
        text.replaceAll(
            "٫",
            "."
        );


    /*
     * Arabic comma as decimal separator
     *
     * فقط اگر داخل عدد استفاده شده باشد
     */
    text =
        text.replaceAll(
            "،",
            "."
        );


    /*
     * Remove everything except:
     * digits
     * decimal point
     * minus
     */
    text =
        text.replace(
            /[^0-9.\-]/g,
            ""
        );


    /*
     * Keep only first decimal point
     */
    const firstDot =
        text.indexOf(".");


    if (firstDot !== -1) {

        text =
            text.substring(
                0,
                firstDot + 1
            ) +
            text
                .substring(
                    firstDot + 1
                )
                .replace(
                    /\./g,
                    ""
                );

    }


    /*
     * Keep minus only at beginning
     */
    if (
        text.includes("-")
    ) {

        text =
            (
                text.startsWith("-")
                    ? "-"
                    : ""
            ) +
            text.replace(
                /-/g,
                ""
            );

    }


    return text;

}


/* =========================================================
   CURRENT FLOCK
   ========================================================= */

async function loadCurrentFlock() {

    const selection =
        getCurrentSelection();


    const container =
        document.getElementById(
            "currentFlock"
        );


    if (!container) {

        return;

    }


    if (!selection.flockId) {

        container.innerHTML = `

            <p>
                ابتدا یک گله انتخاب کنید.
            </p>

            <button
                class="btn btn-primary"
                type="button"
                onclick="location.href='flocks.html'"
            >
                انتخاب گله
            </button>

        `;

        return;

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
                    name
                ),
                houses (
                    name
                )
            `)
            .eq(
                "id",
                selection.flockId
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .maybeSingle();


    if (error || !data) {

        console.error(
            error
        );

        container.innerHTML = `

            <p>
                گله پیدا نشد.
            </p>

        `;

        return;

    }


    currentFlock =
        data;


    container.innerHTML = `

        <div class="farm-summary">

            <strong>
                🐔
                ${escapeHTML(
                    data.flock_name
                )}
            </strong>

            <br>

            فارم:
            ${escapeHTML(
                data.farms?.name || "-"
            )}

            <br>

            سالن:
            ${escapeHTML(
                data.houses?.name || "-"
            )}

            <br>

            نوع:
            ${getProductionLabel(
                data.production_type
            )}

            <br>

            سویه:
            ${escapeHTML(
                data.genetics || "-"
            )}

        </div>

    `;


    await loadHistory();

}


/* =========================================================
   TODAY - SHAMSI
   ========================================================= */

function setToday() {

    const input =
        document.getElementById(
            "evaluationDate"
        );


    if (!input) {

        return;

    }


    const today =
        new Date();


    const formatter =
        new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit"
            }
        );


    const parts =
        formatter.formatToParts(
            today
        );


    const year =
        parts.find(
            item =>
                item.type === "year"
        )?.value || "";


    const month =
        parts.find(
            item =>
                item.type === "month"
        )?.value || "";


    const day =
        parts.find(
            item =>
                item.type === "day"
        )?.value || "";


    input.value =
        `${year}/${month}/${day}`;

}


/* =========================================================
   ADD WEIGHT
   ========================================================= */

function addWeightInput(
    value = ""
) {

    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (!container) {

        return;

    }


    const index =
        container.children.length + 1;


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "weight-input";


    wrapper.innerHTML = `

        <label>
            ${index}
        </label>

        <input
            type="text"
            inputmode="decimal"
            class="bird-weight"
            placeholder="گرم"
            value="${escapeHTMLAttribute(
                normalizeNumberString(
                    value
                )
            )}"
        >

    `;


    container.appendChild(
        wrapper
    );


    const input =
        wrapper.querySelector(
            ".bird-weight"
        );


    prepareWeightInput(
        input
    );

}


/* =========================================================
   ADD 20 WEIGHTS
   ========================================================= */

function addTwentyWeights() {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        addWeightInput();

    }

}


/* =========================================================
   CLEAR WEIGHTS
   ========================================================= */

function clearWeights() {

    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (container) {

        container.innerHTML =
            "";

    }


    const resultsCard =
        document.getElementById(
            "resultsCard"
        );


    if (resultsCard) {

        resultsCard.style.display =
            "none";

    }


    if (weightChart) {

        weightChart.destroy();

        weightChart =
            null;

    }

}


/* =========================================================
   GET WEIGHTS
   ========================================================= */

function getWeights() {

    const inputs =
        document.querySelectorAll(
            ".bird-weight"
        );


    const weights = [];


    inputs.forEach(
        input => {

            const normalized =
                normalizeNumberString(
                    input.value
                );


            input.value =
                normalized;


            if (
                normalized === ""
            ) {

                return;

            }


            const value =
                Number(
                    normalized
                );


            if (
                Number.isFinite(value) &&
                value > 0
            ) {

                weights.push(
                    value
                );

            }

        }
    );


    return weights;

}


/* =========================================================
   CALCULATE WEEKLY
   ========================================================= */

function calculateWeekly() {

    const weights =
        getWeights();


    if (weights.length < 2) {

        alert(
            "حداقل دو وزن برای محاسبه لازم است."
        );

        return;

    }


    const result =
        calculateWeightStatistics(
            weights
        );


    console.log(
        "WEIGHTS:",
        weights
    );

    console.log(
        "STATISTICS:",
        result
    );


    renderResults(
        result
    );


    drawWeightChart(
        weights,
        result
    );


    const resultsCard =
        document.getElementById(
            "resultsCard"
        );


    if (resultsCard) {

        resultsCard.style.display =
            "block";

    }

}


/* =========================================================
   WEIGHT STATISTICS
   ========================================================= */

function calculateWeightStatistics(
    weights
) {

    /*
     * بسیار مهم:
     * اینجا فقط وزن‌ها وارد محاسبات می‌شوند.
     *
     * تاریخ، هفته، Supabase و اعداد نمایشی
     * هیچ دخالتی در محاسبات ندارند.
     */


    const validWeights =
        weights
            .map(
                value =>
                    Number(
                        normalizeNumberString(
                            value
                        )
                    )
            )
            .filter(
                value =>
                    Number.isFinite(value) &&
                    value > 0
            );


    const n =
        validWeights.length;


    if (n < 2) {

        return {

            count:
                n,

            mean:
                0,

            sd:
                0,

            cv:
                0,

            uniformity10:
                0,

            uniformity15:
                0,

            min:
                0,

            max:
                0,

            lower10:
                0,

            upper10:
                0,

            lower15:
                0,

            upper15:
                0

        };

    }


    /*
     * MEAN
     */
    const sum =
        validWeights.reduce(
            (
                total,
                weight
            ) =>
                total + weight,
            0
        );


    const mean =
        sum / n;


    /*
     * VARIANCE
     *
     * همان روش نسخه قبلی:
     * تقسیم بر n
     */
    const squaredDifferences =
        validWeights.map(
            weight =>
                Math.pow(
                    weight - mean,
                    2
                )
        );


    const variance =
        squaredDifferences.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        ) / n;


    /*
     * STANDARD DEVIATION
     */
    const sd =
        Math.sqrt(
            variance
        );


    /*
     * COEFFICIENT OF VARIATION
     *
     * CV = SD / Mean × 100
     */
    const cv =
        mean > 0
            ? (
                sd /
                mean
            ) * 100
            : 0;


    /*
     * ±10%
     */
    const lower10 =
        mean * 0.90;


    const upper10 =
        mean * 1.10;


    /*
     * ±15%
     */
    const lower15 =
        mean * 0.85;


    const upper15 =
        mean * 1.15;


    /*
     * UNIFORMITY ±10
     */
    const uniformCount10 =
        validWeights.filter(
            weight =>
                weight >= lower10 &&
                weight <= upper10
        ).length;


    const uniformity10 =
        (
            uniformCount10 /
            n
        ) * 100;


    /*
     * UNIFORMITY ±15
     */
    const uniformCount15 =
        validWeights.filter(
            weight =>
                weight >= lower15 &&
                weight <= upper15
        ).length;


    const uniformity15 =
        (
            uniformCount15 /
            n
        ) * 100;


    /*
     * MIN / MAX
     */
    const min =
        Math.min(
            ...validWeights
        );


    const max =
        Math.max(
            ...validWeights
        );


    return {

        count:
            n,

        mean:
            mean,

        sd:
            sd,

        cv:
            cv,

        uniformity10:
            uniformity10,

        uniformity15:
            uniformity15,

        min:
            min,

        max:
            max,

        lower10:
            lower10,

        upper10:
            upper10,

        lower15:
            lower15,

        upper15:
            upper15

    };

}


/* =========================================================
   RESULTS
   ========================================================= */

function renderResults(
    result
) {

    const container =
        document.getElementById(
            "results"
        );


    if (!container) {

        return;

    }


    /*
     * تعداد نمونه عمداً حذف شده است.
     */

    container.innerHTML = `

        ${metric(
            "میانگین وزن",
            formatNumber(
                result.mean,
                1
            ) +
            " گرم"
        )}

        ${metric(
            "SD",
            formatNumber(
                result.sd,
                1
            ) +
            " گرم"
        )}

        ${metric(
            "CV",
            formatNumber(
                result.cv,
                2
            ) +
            "%"
        )}

        ${metric(
            "یکنواختی ±10%",
            formatNumber(
                result.uniformity10,
                1
            ) +
            "%"
        )}

        ${metric(
            "یکنواختی ±15%",
            formatNumber(
                result.uniformity15,
                1
            ) +
            "%"
        )}

        ${metric(
            "حداقل وزن",
            formatNumber(
                result.min,
                1
            ) +
            " گرم"
        )}

        ${metric(
            "حداکثر وزن",
            formatNumber(
                result.max,
                1
            ) +
            " گرم"
        )}

    `;

}


/* =========================================================
   METRIC
   ========================================================= */

function metric(
    title,
    value
) {

    return `

        <div class="metric-card">

            <div class="metric-title">
                ${title}
            </div>

            <div class="metric-value">
                ${value}
            </div>

        </div>

    `;

}


/* =========================================================
   WEIGHT CHART
   ========================================================= */

function drawWeightChart(
    weights,
    result
) {

    if (
        typeof Chart ===
        "undefined"
    ) {

        return;

    }


    const canvas =
        document.getElementById(
            "weightChart"
        );


    if (!canvas) {

        return;

    }


    if (weightChart) {

        weightChart.destroy();

        weightChart =
            null;

    }


    const labels =
        weights.map(
            (
                _,
                index
            ) =>
                index + 1
        );


    weightChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                "وزن پرندگان",

                            data:
                                weights,

                            tension:
                                0.25

                        },

                        {

                            label:
                                "میانگین",

                            data:
                                weights.map(
                                    () =>
                                        result.mean
                                ),

                            borderDash:
                                [
                                    6,
                                    6
                                ],

                            pointRadius:
                                0

                        },

                        {

                            label:
                                "حد پایین ±10%",

                            data:
                                weights.map(
                                    () =>
                                        result.lower10
                                ),

                            borderDash:
                                [
                                    4,
                                    4
                                ],

                            pointRadius:
                                0

                        },

                        {

                            label:
                                "حد بالا ±10%",

                            data:
                                weights.map(
                                    () =>
                                        result.upper10
                                ),

                            borderDash:
                                [
                                    4,
                                    4
                                ],

                            pointRadius:
                                0

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false

                }

            }
        );

}


/* =========================================================
   EDIT RECORD
   ========================================================= */

function editWeeklyRecord(
    recordId
) {

    const record =
        weeklyRecords.find(
            item =>
                String(item.id) ===
                String(recordId)
        );


    if (!record) {

        alert(
            "رکورد موردنظر پیدا نشد."
        );

        return;

    }


    editingRecordId =
        record.id;


    /*
     * عددها
     */
    setField(
        "weekNumber",
        record.week_number
    );


    setField(
        "liveBirds",
        record.live_birds
    );


    setField(
        "mortalityWeek",
        record.mortality_count
    );


    setField(
        "feedTotal",
        record.feed_total_kg
    );


    setField(
        "waterTotal",
        record.water_total_liter
    );


    setField(
        "feedPerBird",
        record.feed_per_bird_g
    );


    setField(
        "waterPerBird",
        record.water_per_bird_ml
    );


    /*
     * تاریخ جداگانه
     *
     * بسیار مهم:
     * تاریخ نباید از normalizeNumberString عبور کند.
     */
    setDateField(
        "evaluationDate",
        convertDatabaseDateToShamsi(
            record.evaluation_date
        )
    );


    /*
     * متن
     */
    setTextField(
        "weeklyNotes",
        record.notes
    );


    /*
     * وزن‌ها
     */
    const weightsContainer =
        document.getElementById(
            "weightsContainer"
        );


    if (weightsContainer) {

        weightsContainer.innerHTML =
            "";

    }


    let savedWeights =
        record.weights;


    if (
        typeof savedWeights ===
        "string"
    ) {

        try {

            savedWeights =
                JSON.parse(
                    savedWeights
                );

        }

        catch (error) {

            console.error(
                "Weight JSON parse error:",
                error
            );

            savedWeights =
                [];

        }

    }


    if (
        Array.isArray(
            savedWeights
        )
    ) {

        savedWeights.forEach(
            weight => {

                if (
                    Number(weight) > 0
                ) {

                    addWeightInput(
                        weight
                    );

                }

            }
        );

    }


    if (
        !weightsContainer ||
        weightsContainer.children.length === 0
    ) {

        addWeightInput();

    }


    if (
        getWeights().length >= 2
    ) {

        calculateWeekly();

    }


    showEditMode();


    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );

}


/* =========================================================
   EDIT MODE
   ========================================================= */

function showEditMode() {

    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    if (saveButton) {

        saveButton.disabled =
            false;

        saveButton.textContent =
            "ذخیره تغییرات";

    }


    let editNotice =
        document.getElementById(
            "editModeNotice"
        );


    if (!editNotice) {

        editNotice =
            document.createElement(
                "div"
            );


        editNotice.id =
            "editModeNotice";


        editNotice.style.cssText = `
            margin-bottom:15px;
            padding:12px;
            border-radius:10px;
            background:#fff3cd;
            border:1px solid #ffe69c;
            color:#664d03;
            font-weight:600;
        `;


        editNotice.innerHTML = `

            ✏️ در حال ویرایش گزارش هفته

            <span
                id="editingWeekText"
            ></span>

            <button
                type="button"
                class="btn btn-secondary"
                style="margin-right:10px;"
                onclick="cancelEditWeeklyRecord()"
            >
                لغو ویرایش
            </button>

        `;


        const firstCard =
            document.querySelector(
                ".card"
            );


        if (firstCard) {

            firstCard.parentNode.insertBefore(
                editNotice,
                firstCard
            );

        }

    }


    const week =
        getValue(
            "weekNumber"
        );


    const weekText =
        document.getElementById(
            "editingWeekText"
        );


    if (weekText) {

        weekText.textContent =
            week
                ? ` — هفته ${convertDigitsToPersian(week)}`
                : "";

    }

}


/* =========================================================
   CANCEL EDIT
   ========================================================= */

function cancelEditWeeklyRecord() {

    clearWeeklyForm();

}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearWeeklyForm() {

    editingRecordId =
        null;


    setToday();


    const fields = [

        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird"

    ];


    fields.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    setTextField(
        "weeklyNotes",
        ""
    );


    const weightsContainer =
        document.getElementById(
            "weightsContainer"
        );


    if (weightsContainer) {

        weightsContainer.innerHTML =
            "";

    }


    const resultsCard =
        document.getElementById(
            "resultsCard"
        );


    if (resultsCard) {

        resultsCard.style.display =
            "none";

    }


    if (weightChart) {

        weightChart.destroy();

        weightChart =
            null;

    }


    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    if (saveButton) {

        saveButton.disabled =
            false;

        saveButton.textContent =
            "ذخیره گزارش هفتگی";

    }


    const notice =
        document.getElementById(
            "editModeNotice"
        );


    if (notice) {

        notice.remove();

    }

}


/* =========================================================
   SET NUMERIC FIELD
   ========================================================= */

function setField(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.value =
            "";

        return;

    }


    /*
     * فقط برای فیلد عددی
     */
    element.value =
        normalizeNumberString(
            value
        );

}


/* =========================================================
   SET DATE FIELD
   ========================================================= */

function setDateField(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value || "";

}


/* =========================================================
   SET TEXT FIELD
   ========================================================= */

function setTextField(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value === null ||
        value === undefined
            ? ""
            : String(value);

}


/* =========================================================
   GET GREGORIAN DATE FOR SUPABASE
   ========================================================= */

function getGregorianDateForSupabase(
    value
) {

    if (!value) {

        return null;

    }


    let text =
        String(value)
            .trim();


    /*
     * Convert Persian / Arabic digits
     */
    text =
        text.replace(
            /[۰-۹]/g,
            digit =>
                String(
                    digit.charCodeAt(0) -
                    1776
                )
        );


    text =
        text.replace(
            /[٠-٩]/g,
            digit =>
                String(
                    digit.charCodeAt(0) -
                    1632
                )
        );


    /*
     * فقط slash استاندارد
     */
    text =
        text.replace(
            /[-.]/g,
            "/"
        );


    const parts =
        text.split("/");


    if (
        parts.length !== 3
    ) {

        throw new Error(
            "فرمت تاریخ صحیح نیست. مثال: ۱۴۰۵/۰۵/۲۹"
        );

    }


    const jy =
        Number(parts[0]);


    const jm =
        Number(parts[1]);


    const jd =
        Number(parts[2]);


    if (
        !Number.isInteger(jy) ||
        !Number.isInteger(jm) ||
        !Number.isInteger(jd)
    ) {

        throw new Error(
            "تاریخ شمسی واردشده صحیح نیست."
        );

    }


    if (
        jy < 1300 ||
        jy > 1500
    ) {

        throw new Error(
            "سال تاریخ شمسی صحیح نیست."
        );

    }


    if (
        jm < 1 ||
        jm > 12
    ) {

        throw new Error(
            "ماه تاریخ شمسی صحیح نیست."
        );

    }


    if (
        jd < 1 ||
        jd > 31
    ) {

        throw new Error(
            "روز تاریخ شمسی صحیح نیست."
        );

    }


    if (
        typeof persianDate !==
        "function"
    ) {

        throw new Error(
            "کتابخانه تاریخ شمسی بارگذاری نشده است."
        );

    }


    /*
     * persian-date:
     * month is zero-based
     */
    const date =
        new persianDate()
            .year(jy)
            .month(jm - 1)
            .date(jd);


    return date
        .toCalendar(
            "gregorian"
        )
        .format(
            "YYYY-MM-DD"
        );

}


/* =========================================================
   SAVE WEEKLY RECORD
   ========================================================= */

async function saveWeeklyRecord() {

    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    try {

        if (!currentFlock) {

            alert(
                "ابتدا گله را انتخاب کنید."
            );

            return;

        }


        const week =
            getNumber(
                "weekNumber"
            );


        if (
            !week ||
            week < 1
        ) {

            alert(
                "شماره هفته را وارد کنید."
            );

            return;

        }


        /*
         * وزن‌ها
         */
        const weights =
            getWeights();


        if (weights.length < 2) {

            alert(
                "برای ذخیره گزارش حداقل دو وزن وارد کنید."
            );

            return;

        }


        /*
         * محاسبات
         */
        const stats =
            calculateWeightStatistics(
                weights
            );


        /*
         * سایر اعداد
         */
        const liveBirds =
            getNumber(
                "liveBirds"
            );


        const mortality =
            getNumber(
                "mortalityWeek"
            );


        const feedTotal =
            getNumber(
                "feedTotal"
            );


        const waterTotal =
            getNumber(
                "waterTotal"
            );


        const feedPerBird =
            getNumber(
                "feedPerBird"
            );


        const waterPerBird =
            getNumber(
                "waterPerBird"
            );


        /*
         * تاریخ شمسی → میلادی
         */
        const evaluationDate =
            getGregorianDateForSupabase(
                getValue(
                    "evaluationDate"
                )
            );


        /*
         * ویرایش
         */
        const editingRecord =
            editingRecordId
                ? weeklyRecords.find(
                    item =>
                        String(item.id) ===
                        String(editingRecordId)
                )
                : null;


        const recordId =
            editingRecord
                ? editingRecord.id
                : null;


        /*
         * متن یادداشت
         */
        const notes =
            getValue(
                "weeklyNotes"
            );


        /*
         * PAYLOAD
         */
        const payload = {

            ...(recordId
                ? {
                    id:
                        recordId
                }
                : {}),

            owner_id:
                currentUser.id,

            farm_id:
                currentFlock.farm_id,

            house_id:
                currentFlock.house_id,

            flock_id:
                currentFlock.id,

            week_number:
                week,

            evaluation_date:
                evaluationDate,


            /*
             * WEIGHT STATISTICS
             */
            sample_count:
                stats.count,

            average_weight_g:
                stats.mean,

            sd_weight_g:
                stats.sd,

            cv_percent:
                stats.cv,

            uniformity_10_percent:
                stats.uniformity10,

            uniformity_15_percent:
                stats.uniformity15,

            min_weight_g:
                stats.min,

            max_weight_g:
                stats.max,


            /*
             * FLOCK
             */
            live_birds:
                liveBirds,

            mortality_count:
                mortality,


            /*
             * FEED / WATER
             */
            feed_total_kg:
                feedTotal,

            water_total_liter:
                waterTotal,

            feed_per_bird_g:
                feedPerBird,

            water_per_bird_ml:
                waterPerBird,


            /*
             * NOTES
             */
            notes:
                notes,


            /*
             * RAW WEIGHTS
             */
            weights:
                weights

        };


        console.log(
            "WEEKLY PAYLOAD:",
            payload
        );


        /*
         * Disable save button
         */
        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "در حال ذخیره...";

        }


        /*
         * SAVE
         */
        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "weekly_records"
                )
                .upsert(
                    payload,
                    {
                        onConflict:
                            "flock_id,week_number"
                    }
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Save weekly error:",
                error
            );


            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    editingRecordId
                        ? "ذخیره تغییرات"
                        : "ذخیره گزارش هفتگی";

            }


            alert(
                "ذخیره گزارش انجام نشد:\n" +
                error.message
            );


            return;

        }


        console.log(
            "WEEKLY RECORD SAVED:",
            data
        );


        const wasEditing =
            Boolean(
                editingRecordId
            );


        if (wasEditing) {

            alert(
                "گزارش هفتگی با موفقیت ویرایش شد."
            );

        }

        else {

            alert(
                "گزارش هفتگی با موفقیت ذخیره شد."
            );

        }


        /*
         * Reset
         */
        clearWeeklyForm();


        await loadHistory();

    }

    catch (error) {

        console.error(
            "Weekly save error:",
            error
        );


        alert(
            "ذخیره گزارش انجام نشد:\n" +
            (
                error?.message ||
                "خطای نامشخص"
            )
        );


        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                editingRecordId
                    ? "ذخیره تغییرات"
                    : "ذخیره گزارش هفتگی";

        }

    }

}


/* =========================================================
   LOAD HISTORY
   ========================================================= */

async function loadHistory() {

    if (!currentFlock) {

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "weekly_records"
            )
            .select("*")
            .eq(
                "flock_id",
                currentFlock.id
            )
            .eq(
                "owner_id",
                currentUser.id
            )
            .order(
                "week_number",
                {
                    ascending:
                        true
                }
            );


    if (error) {

        console.error(
            "History error:",
            error
        );


        const history =
            document.getElementById(
                "weeklyHistory"
            );


        if (history) {

            history.innerHTML = `

                <p>
                    خطا در دریافت سوابق.
                </p>

            `;

        }


        return;

    }


    weeklyRecords =
        data || [];


    renderHistory();

}


/* =========================================================
   HISTORY UI
   ========================================================= */

function renderHistory() {

    const container =
        document.getElementById(
            "weeklyHistory"
        );


    if (!container) {

        return;

    }


    if (!weeklyRecords.length) {

        container.innerHTML = `

            <p>
                هنوز گزارش هفتگی ثبت نشده است.
            </p>

        `;

        return;

    }


    container.innerHTML = `

        <div
            style="
                overflow-x:auto;
            "
        >

            <table>

                <thead>

                    <tr>

                        <th>
                            هفته
                        </th>

                        <th>
                            تاریخ
                        </th>

                        <th>
                            میانگین
                        </th>

                        <th>
                            SD
                        </th>

                        <th>
                            CV
                        </th>

                        <th>
                            یکنواختی ±10
                        </th>

                        <th>
                            یکنواختی ±15
                        </th>

                        <th>
                            تلفات
                        </th>

                        <th>
                            دان
                        </th>

                        <th>
                            آب
                        </th>

                        <th>
                            عملیات
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        weeklyRecords
                            .map(
                                record => `

                                    <tr>

                                        <td>
                                            ${formatNumber(
                                                record.week_number,
                                                0
                                            )}
                                        </td>

                                        <td>
                                            ${formatDateDisplay(
                                                record.evaluation_date
                                            )}
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.average_weight_g,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.sd_weight_g,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.cv_percent,
                                                2
                                            )}%
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.uniformity_10_percent,
                                                1
                                            )}%
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.uniformity_15_percent,
                                                1
                                            )}%
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.mortality_count,
                                                0
                                            )}
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.feed_total_kg,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${formatNumber(
                                                record.water_total_liter,
                                                1
                                            )}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                class="btn btn-secondary"
                                                onclick="editWeeklyRecord('${escapeHTMLAttribute(record.id)}')"
                                            >
                                                ✏️ ویرایش
                                            </button>

                                        </td>

                                    </tr>

                                `
                            )
                            .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   DATE DISPLAY
   ========================================================= */

function formatDateDisplay(
    date
) {

    if (!date) {

        return "-";

    }


    const text =
        String(date);


    /*
     * اگر از قبل شمسی باشد
     */
    if (
        text.includes("/")
    ) {

        return convertDigitsToPersian(
            text
        );

    }


    const parts =
        text.split("-");


    if (
        parts.length !== 3
    ) {

        return convertDigitsToPersian(
            text
        );

    }


    try {

        if (
            typeof persianDate ===
            "function"
        ) {

            const gregorianDate =
                new persianDate(
                    `${parts[0]}-${parts[1]}-${parts[2]}`
                );


            const shamsi =
                gregorianDate
                    .toCalendar(
                        "persian"
                    )
                    .format(
                        "YYYY/MM/DD"
                    );


            return convertDigitsToPersian(
                shamsi
            );

        }

    }

    catch (error) {

        console.error(
            "Persian date display error:",
            error
        );

    }


    return convertDigitsToPersian(
        text
    );

}


/* =========================================================
   DATABASE DATE → SHAMSI
   ========================================================= */

function convertDatabaseDateToShamsi(
    date
) {

    if (!date) {

        return "";

    }


    const parts =
        String(date).split("-");


    if (
        parts.length !== 3
    ) {

        return String(date);

    }


    try {

        if (
            typeof persianDate ===
            "function"
        ) {

            const gregorian =
                new persianDate(
                    `${parts[0]}-${parts[1]}-${parts[2]}`
                );


            const shamsi =
                gregorian
                    .toCalendar(
                        "persian"
                    )
                    .format(
                        "YYYY/MM/DD"
                    );


            return convertDigitsToPersian(
                shamsi
            );

        }

    }

    catch (error) {

        console.error(
            "Date conversion error:",
            error
        );

    }


    return convertDigitsToPersian(
        date
    );

}


/* =========================================================
   DIGITS TO PERSIAN
   ========================================================= */

function convertDigitsToPersian(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /\d/g,
        digit =>
            "۰۱۲۳۴۵۶۷۸۹"[
                Number(digit)
            ]
    );

}


/* =========================================================
   GET VALUE
   ========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   GET NUMBER
   ========================================================= */

function getNumber(
    id
) {

    const value =
        getValue(id);


    if (!value) {

        return 0;

    }


    const normalized =
        normalizeNumberString(
            value
        );


    const number =
        Number(
            normalized
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;

}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(
    value,
    decimals = 1
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";

    }


    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "-";

    }


    return number.toLocaleString(
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
   PRODUCTION LABEL
   ========================================================= */

function getProductionLabel(
    type
) {

    const labels = {

        broiler:
            "گوشتی",

        layer:
            "تخم‌گذار",

        pullet:
            "پولت",

        breeder:
            "مرغ مادر"

    };


    return (
        labels[type] ||
        type ||
        "-"
    );

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
   ESCAPE HTML ATTRIBUTE
   ========================================================= */

function escapeHTMLAttribute(
    value
) {

    return String(
        value ?? ""
    )

    .replaceAll(
        "\\",
        "\\\\"
    )

    .replaceAll(
        "'",
        "\\'"
    )

    .replaceAll(
        "\n",
        "\\n"
    )

    .replaceAll(
        "\r",
        "\\r"
    );

}
