/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY MONITORING
   STABLE VERSION
   Persian / Arabic / English Numbers
   Shamsi Date
   Supabase
   Editing Records
   Uniformity ±10 / ±15
========================================================= */

"use strict";


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
            await getWeeklyUserAccess();

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
                "حساب شما هنوز توسط مدیریت تأیید نشده است."
            );

            try {

                await supabaseClient
                    .auth
                    .signOut();

            } catch (error) {

                console.error(
                    "Sign out error:",
                    error
                );

            }

            location.href =
                "login.html";

            return;

        }

        currentUser =
            access.user;

        setToday();

        await loadCurrentFlock();

    } catch (error) {

        console.error(
            "Weekly initialization error:",
            error
        );

        alert(
            "خطا در راه‌اندازی ثبت هفتگی."
        );

    }

}


/* =========================================================
   AUTH
========================================================= */

async function getWeeklyUserAccess() {

    try {

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient is not defined."
            );

            return {
                authenticated: false,
                allowed: false,
                user: null
            };

        }

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getUser();

        if (
            error ||
            !data ||
            !data.user
        ) {

            return {
                authenticated: false,
                allowed: false,
                user: null
            };

        }

        const user =
            data.user;

        let profile = null;

        try {

            const profileResult =
                await supabaseClient
                    .from("profiles")
                    .select("*")
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();

            if (!profileResult.error) {

                profile =
                    profileResult.data;

            }

        } catch (profileError) {

            console.warn(
                "Profile check:",
                profileError
            );

        }

        /*
         * اگر جدول پروفایل وجود نداشت یا
         * پروفایل هنوز ساخته نشده بود،
         * رفتار قبلی حفظ می‌شود.
         */

        if (!profile) {

            return {
                authenticated: true,
                allowed: true,
                user
            };

        }

        const status =
            String(
                profile.status || ""
            )
            .trim()
            .toLowerCase();

        const accessStatus =
            String(
                profile.access_status || ""
            )
            .trim()
            .toLowerCase();

        const role =
            String(
                profile.role || ""
            )
            .trim()
            .toLowerCase();

        const blockedStatuses = [
            "blocked",
            "removed",
            "suspended",
            "rejected",
            "disabled"
        ];

        const allowed =
            !blockedStatuses.includes(status) &&
            (
                accessStatus === "approved" ||
                status === "active" ||
                (
                    role === "owner" &&
                    !blockedStatuses.includes(status)
                )
            );

        return {

            authenticated: true,

            allowed,

            user

        };

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return {

            authenticated: false,

            allowed: false,

            user: null

        };

    }

}


/* =========================================================
   NUMBER INPUTS
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
   NUMBER HANDLER
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
        String(value)
            .trim();

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
     * Arabic comma is treated as decimal separator.
     * Example:
     * ۱۲٫۵
     * 12،5
     */

    text =
        text.replaceAll(
            "،",
            "."
        );

    /*
     * Remove invalid characters
     */

    text =
        text.replace(
            /[^0-9.\-]/g,
            ""
        );

    /*
     * Keep only one decimal point
     */

    const firstDot =
        text.indexOf(".");

    if (
        firstDot !== -1
    ) {

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
     * Minus only at beginning
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
        typeof getCurrentSelection ===
        "function"

            ? getCurrentSelection()

            : readCurrentSelectionFallback();

    const container =
        document.getElementById(
            "currentFlock"
        );

    if (!container) {

        return;

    }

    if (!selection || !selection.flockId) {

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

    if (!currentUser) {

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

    if (
        error ||
        !data
    ) {

        console.error(
            "Flock loading error:",
            error
        );

        container.innerHTML = `

            <p>
                گله انتخاب‌شده پیدا نشد.
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

    currentFlock =
        data;

    container.innerHTML = `

        <div class="farm-summary">

            <strong>
                🐔
                ${escapeHTML(
                    data.flock_name ||
                    data.flockName ||
                    "-"
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
            ${escapeHTML(
                getProductionLabel(
                    data.production_type ||
                    data.productionType
                )
            )}

            <br>

            سویه:
            ${escapeHTML(
                data.genetics ||
                "-"
            )}

        </div>

    `;

    await loadHistory();

}


/* =========================================================
   CURRENT SELECTION FALLBACK
========================================================= */

function readCurrentSelectionFallback() {

    try {

        const key =
            "adine_poultry_current_selection";

        const raw =
            localStorage.getItem(
                key
            );

        if (!raw) {

            return {};

        }

        const parsed =
            JSON.parse(
                raw
            );

        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return {};

        }

        return parsed;

    } catch (error) {

        console.error(
            "Selection read error:",
            error
        );

        return {};

    }

}


/* =========================================================
   TODAY SHAMSI
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

    const jalali =
        gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );

    input.value =
        `${padNumber(jalali[0], 4)}/${padNumber(jalali[1], 2)}/${padNumber(jalali[2], 2)}`;

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
            ${convertDigitsToPersian(index)}
        </label>

        <input
            type="text"
            inputmode="decimal"
            class="bird-weight"
            placeholder="گرم"
            autocomplete="off"
        >

    `;

    container.appendChild(
        wrapper
    );

    const input =
        wrapper.querySelector(
            ".bird-weight"
        );

    if (input) {

        input.value =
            normalizeNumberString(
                value
            );

        prepareWeightInput(
            input
        );

    }

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
   CALCULATE
========================================================= */

function calculateWeekly() {

    const weights =
        getWeights();

    if (
        weights.length < 2
    ) {

        alert(
            "حداقل دو وزن برای محاسبه لازم است."
        );

        return;

    }

    const result =
        calculateWeightStatistics(
            weights
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

    const cleanWeights =
        (
            Array.isArray(weights)
                ? weights
                : []
        )

        .map(
            value => {

                if (
                    value === null ||
                    value === undefined
                ) {

                    return NaN;

                }

                const normalized =
                    normalizeNumberString(
                        value
                    );

                return Number(
                    normalized
                );

            }
        )

        .filter(
            value =>
                Number.isFinite(value) &&
                value > 0
        );

    const count =
        cleanWeights.length;

    if (
        count === 0
    ) {

        return {

            count: 0,

            mean: 0,

            sd: 0,

            cv: 0,

            uniformity10: 0,

            uniformity15: 0,

            min: 0,

            max: 0,

            lower10: 0,

            upper10: 0,

            lower15: 0,

            upper15: 0

        };

    }

    const sorted =
        [...cleanWeights]
            .sort(
                (a, b) =>
                    a - b
            );

    const mean =
        sorted.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        ) / count;

    /*
     * Population SD
     */

    const variance =
        sorted.reduce(
            (
                sum,
                value
            ) => {

                return (
                    sum +
                    Math.pow(
                        value - mean,
                        2
                    )
                );

            },
            0
        ) / count;

    const sd =
        Math.sqrt(
            variance
        );

    const cv =
        mean > 0
            ? (
                sd /
                mean
            ) * 100
            : 0;

    const lower10 =
        mean * 0.90;

    const upper10 =
        mean * 1.10;

    const lower15 =
        mean * 0.85;

    const upper15 =
        mean * 1.15;

    const uniform10Count =
        sorted.filter(
            weight =>
                weight >= lower10 &&
                weight <= upper10
        ).length;

    const uniform15Count =
        sorted.filter(
            weight =>
                weight >= lower15 &&
                weight <= upper15
        ).length;

    return {

        count,

        mean:
            Number(
                mean.toFixed(2)
            ),

        sd:
            Number(
                sd.toFixed(2)
            ),

        cv:
            Number(
                cv.toFixed(2)
            ),

        uniformity10:
            Number(
                (
                    (
                        uniform10Count /
                        count
                    ) *
                    100
                ).toFixed(2)
            ),

        uniformity15:
            Number(
                (
                    (
                        uniform15Count /
                        count
                    ) *
                    100
                ).toFixed(2)
            ),

        min:
            sorted[0],

        max:
            sorted[count - 1],

        lower10:
            Number(
                lower10.toFixed(2)
            ),

        upper10:
            Number(
                upper10.toFixed(2)
            ),

        lower15:
            Number(
                lower15.toFixed(2)
            ),

        upper15:
            Number(
                upper15.toFixed(2)
            )

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
                ${escapeHTML(title)}
            </div>

            <div class="metric-value">
                ${escapeHTML(value)}
            </div>

        </div>

    `;

}


/* =========================================================
   CHART
========================================================= */

function drawWeightChart(
    weights,
    result
) {

    if (
        typeof Chart ===
        "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

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

    setDateField(
        "evaluationDate",
        convertDatabaseDateToShamsi(
            record.evaluation_date
        )
    );

    setTextField(
        "weeklyNotes",
        record.notes
    );

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

        } catch (error) {

            console.error(
                "Saved weights JSON error:",
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

                const number =
                    Number(
                        normalizeNumberString(
                            weight
                        )
                    );

                if (
                    Number.isFinite(number) &&
                    number > 0
                ) {

                    addWeightInput(
                        number
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
   SET FIELD
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

    element.value =
        normalizeNumberString(
            value
        );

}


/* =========================================================
   DATE FIELD
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
   TEXT FIELD
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
   SHAMSI → GREGORIAN
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

    text =
        normalizeDateDigits(
            text
        );

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
        jy < 1200 ||
        jy > 1600
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

    const maxDay =
        jm <= 6
            ? 31
            : jm <= 11
                ? 30
                : isLeapJalaliYear(jy)
                    ? 30
                    : 29;

    if (
        jd < 1 ||
        jd > maxDay
    ) {

        throw new Error(
            "روز تاریخ شمسی صحیح نیست."
        );

    }

    const gregorian =
        jalaliToGregorian(
            jy,
            jm,
            jd
        );

    return (
        String(
            gregorian[0]
        ).padStart(
            4,
            "0"
        ) +
        "-" +
        String(
            gregorian[1]
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            gregorian[2]
        ).padStart(
            2,
            "0"
        )
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

    const text =
        String(date)
            .trim();

    if (
        text.includes("/")
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const parts =
        text
            .substring(
                0,
                10
            )
            .split("-");

    if (
        parts.length !== 3
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const gy =
        Number(parts[0]);

    const gm =
        Number(parts[1]);

    const gd =
        Number(parts[2]);

    if (
        !Number.isInteger(gy) ||
        !Number.isInteger(gm) ||
        !Number.isInteger(gd)
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const jalali =
        gregorianToJalali(
            gy,
            gm,
            gd
        );

    return convertDigitsToPersian(
        `${jalali[0]}/${padNumber(jalali[1], 2)}/${padNumber(jalali[2], 2)}`
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

    const originalEditingId =
        editingRecordId;

    try {

        if (!currentUser) {

            alert(
                "کاربر وارد نشده است."
            );

            return;

        }

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

        const weights =
            getWeights();

        if (
            weights.length < 2
        ) {

            alert(
                "برای ذخیره گزارش حداقل دو وزن وارد کنید."
            );

            return;

        }

        const stats =
            calculateWeightStatistics(
                weights
            );

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

        const evaluationDate =
            getGregorianDateForSupabase(
                getValue(
                    "evaluationDate"
                )
            );

        const notes =
            getValue(
                "weeklyNotes"
            );

        const editingRecord =
            originalEditingId

                ? weeklyRecords.find(
                    item =>
                        String(item.id) ===
                        String(originalEditingId)
                )

                : null;

        const recordId =
            editingRecord
                ? editingRecord.id
                : null;

        const payload = {

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

            live_birds:
                liveBirds,

            mortality_count:
                mortality,

            feed_total_kg:
                feedTotal,

            water_total_liter:
                waterTotal,

            feed_per_bird_g:
                feedPerBird,

            water_per_bird_ml:
                waterPerBird,

            notes:
                notes,

            weights:
                weights

        };

        console.log(
            "WEEKLY PAYLOAD:",
            payload
        );

        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "در حال ذخیره...";

        }

        let result;

        if (recordId) {

            /*
             * ویرایش رکورد موجود
             */

            result =
                await supabaseClient
                    .from(
                        "weekly_records"
                    )
                    .update(
                        payload
                    )
                    .eq(
                        "id",
                        recordId
                    )
                    .eq(
                        "owner_id",
                        currentUser.id
                    )
                    .select()
                    .single();

        } else {

            /*
             * ثبت رکورد جدید
             */

            result =
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

        }

        const {
            data,
            error
        } =
            result;

        if (error) {

            console.error(
                "Save weekly error:",
                error
            );

            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    originalEditingId
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
                originalEditingId
            );

        alert(
            wasEditing
                ? "گزارش هفتگی با موفقیت ویرایش شد."
                : "گزارش هفتگی با موفقیت ذخیره شد."
        );

        clearWeeklyForm();

        await loadHistory();

    } catch (error) {

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
                originalEditingId
                    ? "ذخیره تغییرات"
                    : "ذخیره گزارش هفتگی";

        }

    }

}


/* =========================================================
   LOAD HISTORY
========================================================= */

async function loadHistory() {

    if (
        !currentFlock ||
        !currentUser
    ) {

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
   HISTORY
========================================================= */

function renderHistory() {

    const container =
        document.getElementById(
            "weeklyHistory"
        );

    if (!container) {

        return;

    }

    if (
        !weeklyRecords.length
    ) {

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

    if (
        text.includes("/")
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const parts =
        text
            .substring(
                0,
                10
            )
            .split("-");

    if (
        parts.length !== 3
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const gy =
        Number(parts[0]);

    const gm =
        Number(parts[1]);

    const gd =
        Number(parts[2]);

    if (
        !Number.isInteger(gy) ||
        !Number.isInteger(gm) ||
        !Number.isInteger(gd)
    ) {

        return convertDigitsToPersian(
            text
        );

    }

    const jalali =
        gregorianToJalali(
            gy,
            gm,
            gd
        );

    return convertDigitsToPersian(
        `${jalali[0]}/${padNumber(jalali[1], 2)}/${padNumber(jalali[2], 2)}`
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

    const normalized =
        String(
            type ?? ""
        )
        .trim()
        .toLowerCase();

    return (
        labels[normalized] ||
        type ||
        "-"
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
   NORMALIZE DATE DIGITS
========================================================= */

function normalizeDateDigits(
    value
) {

    return String(
        value ?? ""
    )

    .replace(
        /[۰-۹]/g,
        digit =>
            String(
                digit.charCodeAt(0) -
                1776
            )
    )

    .replace(
        /[٠-٩]/g,
        digit =>
            String(
                digit.charCodeAt(0) -
                1632
            )
    );

}


/* =========================================================
   PAD
========================================================= */

function padNumber(
    value,
    length
) {

    return String(
        value
    ).padStart(
        length,
        "0"
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
   ESCAPE ATTRIBUTE
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


/* =========================================================
   JALALI → GREGORIAN
   Corrected and stable implementation
========================================================= */

function jalaliToGregorian(
    jy,
    jm,
    jd
) {

    jy =
        Number(jy);

    jm =
        Number(jm);

    jd =
        Number(jd);

    const breaks = [
        -61,
        9,
        38,
        199,
        426,
        686,
        756,
        818,
        1111,
        1181,
        1210,
        1635,
        2060,
        2097,
        2192,
        2262,
        2324,
        2394,
        2456,
        3178
    ];

    let gy;

    if (
        jy < breaks[0] ||
        jy >= breaks[breaks.length - 1]
    ) {

        /*
         * خارج محدوده معمول تقویم جلالی
         * با همان الگوریتم استاندارد ادامه می‌دهیم.
         */

    }

    let bl =
        breaks.length;

    let gy2 =
        jy + 621;

    let leapJ =
        -14;

    let jp =
        breaks[0];

    let jump = 0;

    for (
        let i = 1;
        i < bl;
        i++
    ) {

        const jm2 =
            breaks[i];

        jump =
            jm2 - jp;

        if (
            jy < jm2
        ) {

            break;

        }

        leapJ +=
            Math.floor(
                jump / 33
            ) * 8 +
            Math.floor(
                (
                    jump % 33
                ) / 4
            );

        jp =
            jm2;

    }

    let n =
        jy - jp;

    leapJ +=
        Math.floor(
            n / 33
        ) * 8 +
        Math.floor(
            (
                (
                    n % 33
                ) + 3
            ) / 4
        );

    if (
        jump % 33 === 4 &&
        jump - n === 4
    ) {

        leapJ++;

    }

    const leapG =
        Math.floor(
            gy2 / 4
        ) -
        Math.floor(
            (
                (
                    gy2 / 100
                ) + 1
            )
        ) +
        Math.floor(
            gy2 / 400
        );

    const march =
        20 +
        leapJ -
        leapG;

    if (
        jm <= 6
    ) {

        const days =
            (
                (
                    jm - 1
                ) * 31
            ) +
            (
                jd - 1
            );

        const date =
            new Date(
                gy2,
                2,
                march
            );

        date.setDate(
            date.getDate() +
            days
        );

        gy =
            date.getFullYear();

        return [
            gy,
            date.getMonth() + 1,
            date.getDate()
        ];

    }

    const days =
        186 +
        (
            (
                jm - 7
            ) * 30
        ) +
        (
            jd - 1
        );

    const date =
        new Date(
            gy2,
            2,
            march
        );

    date.setDate(
        date.getDate() +
        days
    );

    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ];

}


/* =========================================================
   GREGORIAN → JALALI
   Corrected and stable implementation
========================================================= */

function gregorianToJalali(
    gy,
    gm,
    gd
) {

    gy =
        Number(gy);

    gm =
        Number(gm);

    gd =
        Number(gd);

    const gDaysInMonth = [

        31,
        28,
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

    const jDaysInMonth = [

        31,
        31,
        31,
        31,
        31,
        31,
        30,
        30,
        30,
        30,
        30,
        29

    ];

    let gy2 =
        gy - 1600;

    let gm2 =
        gm - 1;

    let gd2 =
        gd - 1;

    let gDayNo =
        365 * gy2;

    gDayNo +=
        Math.floor(
            (
                gy2 + 3
            ) / 4
        );

    gDayNo -=
        Math.floor(
            (
                gy2 + 99
            ) / 100
        );

    gDayNo +=
        Math.floor(
            (
                gy2 + 399
            ) / 400
        );

    for (
        let i = 0;
        i < gm2;
        i++
    ) {

        gDayNo +=
            gDaysInMonth[i];

    }

    if (
        gm2 > 1 &&
        (
            gy % 4 === 0 &&
            (
                gy % 100 !== 0 ||
                gy % 400 === 0
            )
        )
    ) {

        gDayNo++;

    }

    gDayNo +=
        gd2;

    let jDayNo =
        gDayNo - 79;

    const jNp =
        Math.floor(
            jDayNo / 12053
        );

    jDayNo %=
        12053;

    let jy =
        979 +
        33 * jNp +
        4 *
        Math.floor(
            jDayNo / 1461
        );

    jDayNo %=
        1461;

    if (
        jDayNo >= 366
    ) {

        jy +=
            Math.floor(
                (
                    jDayNo - 1
                ) / 365
            );

        jDayNo =
            (
                jDayNo - 1
            ) % 365;

    }

    let jm;

    for (
        jm = 0;
        jm < 11 &&
        jDayNo >=
        jDaysInMonth[jm];
        jm++
    ) {

        jDayNo -=
            jDaysInMonth[jm];

    }

    const jd =
        jDayNo + 1;

    return [
        jy,
        jm + 1,
        jd
    ];

}


/* =========================================================
   JALALI LEAP YEAR
========================================================= */

function isLeapJalaliYear(
    jy
) {

    jy =
        Number(jy);

    if (
        !Number.isInteger(jy)
    ) {

        return false;

    }

    const current =
        jalaliToGregorian(
            jy,
            1,
            1
        );

    const next =
        jalaliToGregorian(
            jy + 1,
            1,
            1
        );

    const currentDate =
        new Date(
            current[0],
            current[1] - 1,
            current[2]
        );

    const nextDate =
        new Date(
            next[0],
            next[1] - 1,
            next[2]
        );

    const days =
        Math.round(
            (
                nextDate.getTime() -
                currentDate.getTime()
            ) /
            86400000
        );

    return days === 366;

}


/* =========================================================
   EXPOSE
========================================================= */

window.normalizeNumberString =
    normalizeNumberString;

window.addWeightInput =
    addWeightInput;

window.addTwentyWeights =
    addTwentyWeights;

window.clearWeights =
    clearWeights;

window.getWeights =
    getWeights;

window.calculateWeekly =
    calculateWeekly;

window.saveWeeklyRecord =
    saveWeeklyRecord;

window.editWeeklyRecord =
    editWeeklyRecord;

window.cancelEditWeeklyRecord =
    cancelEditWeeklyRecord;

window.getGregorianDateForSupabase =
    getGregorianDateForSupabase;

window.convertDatabaseDateToShamsi =
    convertDatabaseDateToShamsi;

window.formatDateDisplay =
    formatDateDisplay;

window.setToday =
    setToday;

window.calculateWeightStatistics =
    calculateWeightStatistics;

window.gregorianToJalali =
    gregorianToJalali;

window.jalaliToGregorian =
    jalaliToGregorian;

window.isLeapJalaliYear =
    isLeapJalaliYear;
