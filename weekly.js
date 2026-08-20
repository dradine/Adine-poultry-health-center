/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY MONITORING - STABLE CALCULATION VERSION
   Persian / Arabic / English Numbers
   Shamsi Date
   Uniformity ±10 / ±15
   SD Sample
   CV
   Supabase
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
    weeklyInitialize
);


async function weeklyInitialize() {

    try {

        weeklyPrepareNumericInputs();

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


        weeklySetToday();

        await weeklyLoadCurrentFlock();

    }

    catch (error) {

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
   NUMBER NORMALIZATION
   ========================================================= */

function weeklyNormalizeNumber(value) {

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
                    digit.charCodeAt(0) - 1776
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
                    digit.charCodeAt(0) - 1632
                )
        );


    /*
     * Thousands separators
     */
    text =
        text.replace(
            /[٬,]/g,
            ""
        );


    /*
     * Persian / Arabic decimal separators
     */
    text =
        text.replace(
            /[٫،]/g,
            "."
        );


    /*
     * Remove spaces
     */
    text =
        text.replace(
            /\s+/g,
            ""
        );


    /*
     * Keep only digits, decimal point and minus
     */
    text =
        text.replace(
            /[^0-9.\-]/g,
            ""
        );


    /*
     * Keep only the first decimal point
     */
    const firstDot =
        text.indexOf(".");


    if (firstDot >= 0) {

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
    if (text.includes("-")) {

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
   NUMBER PREPARATION
   ========================================================= */

function weeklyPrepareNumericInputs() {

    const ids = [

        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird"

    ];


    ids.forEach(
        id => {

            const input =
                document.getElementById(id);

            if (!input) return;

            input.type = "text";
            input.inputMode = "decimal";
            input.autocomplete = "off";

            weeklyAttachNumberHandler(
                input
            );
        }
    );
}


function weeklyPrepareWeightInput(input) {

    if (!input) return;

    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";

    weeklyAttachNumberHandler(
        input
    );
}


function weeklyAttachNumberHandler(input) {

    if (!input) return;

    if (
        input.dataset.weeklyNumberReady ===
        "true"
    ) {

        return;
    }


    input.dataset.weeklyNumberReady =
        "true";


    input.addEventListener(
        "input",
        function () {

            this.value =
                weeklyNormalizeNumber(
                    this.value
                );
        }
    );
}


/* =========================================================
   CURRENT FLOCK
   ========================================================= */

async function weeklyLoadCurrentFlock() {

    const selection =
        getCurrentSelection();


    const container =
        document.getElementById(
            "currentFlock"
        );


    if (!container) return;


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
                farms(name),
                houses(name)
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
            "Current flock error:",
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
                ${weeklyEscapeHTML(
                    data.flock_name
                )}
            </strong>

            <br>

            فارم:
            ${weeklyEscapeHTML(
                data.farms?.name || "-"
            )}

            <br>

            سالن:
            ${weeklyEscapeHTML(
                data.houses?.name || "-"
            )}

            <br>

            نوع:
            ${getProductionLabel(
                data.production_type
            )}

            <br>

            سویه:
            ${weeklyEscapeHTML(
                data.genetics || "-"
            )}

        </div>

    `;


    await weeklyLoadHistory();
}


/* =========================================================
   DATE
   ========================================================= */

function weeklySetToday() {

    const input =
        document.getElementById(
            "evaluationDate"
        );


    if (!input) return;


    const today =
        new Date();


    const formatter =
        new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );


    const parts =
        formatter.formatToParts(
            today
        );


    const year =
        parts.find(
            p => p.type === "year"
        )?.value || "";


    const month =
        parts.find(
            p => p.type === "month"
        )?.value || "";


    const day =
        parts.find(
            p => p.type === "day"
        )?.value || "";


    input.value =
        `${year}/${month}/${day}`;
}


/* =========================================================
   WEIGHT INPUTS
   ========================================================= */

function addWeightInput(value = "") {

    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (!container) return;


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
            value="${weeklyEscapeAttribute(
                weeklyNormalizeNumber(
                    value
                )
            )}"
        >

    `;


    container.appendChild(
        wrapper
    );


    weeklyPrepareWeightInput(
        wrapper.querySelector(
            ".bird-weight"
        )
    );
}


function addTwentyWeights() {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        addWeightInput();
    }
}


function clearWeights() {

    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (container) {

        container.innerHTML = "";
    }


    const results =
        document.getElementById(
            "resultsCard"
        );


    if (results) {

        results.style.display =
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

function weeklyGetWeights() {

    const inputs =
        document.querySelectorAll(
            ".bird-weight"
        );


    const weights = [];


    inputs.forEach(
        input => {

            const normalized =
                weeklyNormalizeNumber(
                    input.value
                );


            input.value =
                normalized;


            if (!normalized) return;


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
   IMPORTANT:
   REAL WEIGHT STATISTICS
   ========================================================= */

function weeklyCalculateWeightStatistics(
    inputWeights
) {

    /*
     * Defensive copy
     */
    const weights =
        inputWeights
            .map(
                value =>
                    Number(
                        weeklyNormalizeNumber(
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
        weights.length;


    if (n < 2) {

        throw new Error(
            "حداقل دو وزن معتبر لازم است."
        );
    }


    /*
     * MEAN
     */
    const sum =
        weights.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        );


    const mean =
        sum / n;


    /*
     * SAMPLE STANDARD DEVIATION
     *
     * SD = sqrt(
     *   Σ(x-mean)^2 / (n-1)
     * )
     *
     * برای گزارش آماری نمونه گله
     */
    const squaredDifferences =
        weights.map(
            value =>
                Math.pow(
                    value - mean,
                    2
                )
        );


    const squaredSum =
        squaredDifferences.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        );


    const variance =
        squaredSum /
        (n - 1);


    const sd =
        Math.sqrt(
            variance
        );


    /*
     * CV
     */
    const cv =
        mean > 0
            ? (
                sd / mean
            ) * 100
            : 0;


    /*
     * =====================================================
     * UNIFORMITY ±10%
     * =====================================================
     */

    const lower10 =
        mean * 0.90;


    const upper10 =
        mean * 1.10;


    const count10 =
        weights.filter(
            weight =>
                weight >= lower10 &&
                weight <= upper10
        ).length;


    const uniformity10 =
        (
            count10 / n
        ) * 100;


    /*
     * =====================================================
     * UNIFORMITY ±15%
     * =====================================================
     */

    const lower15 =
        mean * 0.85;


    const upper15 =
        mean * 1.15;


    const count15 =
        weights.filter(
            weight =>
                weight >= lower15 &&
                weight <= upper15
        ).length;


    const uniformity15 =
        (
            count15 / n
        ) * 100;


    /*
     * =====================================================
     * RESULT
     * =====================================================
     */

    return {

        count: n,

        mean: mean,

        sd: sd,

        cv: cv,

        uniformity10:
            uniformity10,

        uniformity15:
            uniformity15,

        count10:
            count10,

        count15:
            count15,

        min:
            Math.min(
                ...weights
            ),

        max:
            Math.max(
                ...weights
            ),

        lower10:
            lower10,

        upper10:
            upper10,

        lower15:
            lower15,

        upper15:
            upper15,

        weights:
            weights
    };
}


/* =========================================================
   CALCULATE WEEKLY
   ========================================================= */

function calculateWeekly() {

    try {

        const weights =
            weeklyGetWeights();


        if (weights.length < 2) {

            alert(
                "حداقل دو وزن معتبر برای محاسبه لازم است."
            );

            return;
        }


        const result =
            weeklyCalculateWeightStatistics(
                weights
            );


        console.log(
            "WEEKLY CALCULATION:",
            {
                weights:
                    weights,

                count:
                    result.count,

                mean:
                    result.mean,

                sd:
                    result.sd,

                cv:
                    result.cv,

                uniformity10:
                    result.uniformity10,

                uniformity15:
                    result.uniformity15,

                count10:
                    result.count10,

                count15:
                    result.count15
            }
        );


        weeklyRenderResults(
            result
        );


        weeklyDrawWeightChart(
            weights,
            result
        );


        const card =
            document.getElementById(
                "resultsCard"
            );


        if (card) {

            card.style.display =
                "block";
        }

    }

    catch (error) {

        console.error(
            "Calculation error:",
            error
        );

        alert(
            error.message ||
            "خطا در محاسبه."
        );
    }
}


/* =========================================================
   RESULTS
   ========================================================= */

function weeklyRenderResults(result) {

    const container =
        document.getElementById(
            "results"
        );


    if (!container) return;


    container.innerHTML = `

        ${weeklyMetric(
            "تعداد نمونه",
            weeklyFormatNumber(
                result.count,
                0
            )
        )}

        ${weeklyMetric(
            "میانگین وزن",
            weeklyFormatNumber(
                result.mean,
                1
            ) + " گرم"
        )}

        ${weeklyMetric(
            "SD",
            weeklyFormatNumber(
                result.sd,
                1
            ) + " گرم"
        )}

        ${weeklyMetric(
            "CV",
            weeklyFormatNumber(
                result.cv,
                2
            ) + "%"
        )}

        ${weeklyMetric(
            "یکنواختی ±10%",
            weeklyFormatNumber(
                result.uniformity10,
                1
            ) + "%"
        )}

        ${weeklyMetric(
            "یکنواختی ±15%",
            weeklyFormatNumber(
                result.uniformity15,
                1
            ) + "%"
        )}

        ${weeklyMetric(
            "تعداد داخل ±10%",
            weeklyFormatNumber(
                result.count10,
                0
            ) +
            " از " +
            weeklyFormatNumber(
                result.count,
                0
            )
        )}

        ${weeklyMetric(
            "تعداد داخل ±15%",
            weeklyFormatNumber(
                result.count15,
                0
            ) +
            " از " +
            weeklyFormatNumber(
                result.count,
                0
            )
        )}

        ${weeklyMetric(
            "حداقل وزن",
            weeklyFormatNumber(
                result.min,
                1
            ) + " گرم"
        )}

        ${weeklyMetric(
            "حداکثر وزن",
            weeklyFormatNumber(
                result.max,
                1
            ) + " گرم"
        )}

    `;
}


function weeklyMetric(
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
   CHART
   ========================================================= */

function weeklyDrawWeightChart(
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


    if (!canvas) return;


    if (weightChart) {

        weightChart.destroy();
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

                type: "line",

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
                                [6, 6],

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
                                [4, 4],

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
                                [4, 4],

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


    weeklySetField(
        "weekNumber",
        record.week_number
    );


    weeklySetField(
        "evaluationDate",
        convertDatabaseDateToShamsi(
            record.evaluation_date
        )
    );


    weeklySetField(
        "liveBirds",
        record.live_birds
    );


    weeklySetField(
        "mortalityWeek",
        record.mortality_count
    );


    weeklySetField(
        "feedTotal",
        record.feed_total_kg
    );


    weeklySetField(
        "waterTotal",
        record.water_total_liter
    );


    weeklySetField(
        "feedPerBird",
        record.feed_per_bird_g
    );


    weeklySetField(
        "waterPerBird",
        record.water_per_bird_ml
    );


    weeklySetField(
        "weeklyNotes",
        record.notes
    );


    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (container) {

        container.innerHTML =
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

        catch {

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
            weight =>
                addWeightInput(
                    weight
                )
        );
    }


    if (
        !container ||
        !container.children.length
    ) {

        addWeightInput();
    }


    if (
        weeklyGetWeights().length >= 2
    ) {

        calculateWeekly();
    }


    weeklyShowEditMode();


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );
}


/* =========================================================
   EDIT MODE
   ========================================================= */

function weeklyShowEditMode() {

    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "ذخیره تغییرات";
    }


    let notice =
        document.getElementById(
            "editModeNotice"
        );


    if (!notice) {

        notice =
            document.createElement(
                "div"
            );


        notice.id =
            "editModeNotice";


        notice.style.cssText = `
            margin-bottom:15px;
            padding:12px;
            border-radius:10px;
            background:#fff3cd;
            border:1px solid #ffe69c;
            color:#664d03;
            font-weight:600;
        `;


        notice.innerHTML = `

            ✏️ در حال ویرایش گزارش هفته

            <span id="editingWeekText"></span>

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
                notice,
                firstCard
            );
        }
    }


    const week =
        weeklyGetValue(
            "weekNumber"
        );


    const weekText =
        document.getElementById(
            "editingWeekText"
        );


    if (weekText) {

        weekText.textContent =
            week
                ? ` — هفته ${week}`
                : "";
    }
}


function cancelEditWeeklyRecord() {

    weeklyClearForm();
}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function weeklyClearForm() {

    weeklySetToday();


    [
        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird",
        "weeklyNotes"
    ].forEach(
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


    const container =
        document.getElementById(
            "weightsContainer"
        );


    if (container) {

        container.innerHTML =
            "";
    }


    const results =
        document.getElementById(
            "resultsCard"
        );


    if (results) {

        results.style.display =
            "none";
    }


    if (weightChart) {

        weightChart.destroy();

        weightChart =
            null;
    }


    editingRecordId =
        null;


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

function weeklySetField(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) return;


    if (
        value === null ||
        value === undefined
    ) {

        element.value =
            "";

        return;
    }


    if (id === "evaluationDate") {

        element.value =
            String(value);

        return;
    }


    element.value =
        weeklyNormalizeNumber(
            value
        );
}


/* =========================================================
   SAVE DATE
   ========================================================= */

function getGregorianDateForSupabase(
    value
) {

    if (!value) return null;


    const text =
        weeklyNormalizeNumber(
            value
        );


    const parts =
        text.split("/");


    if (
        parts.length !== 3
    ) {

        throw new Error(
            "فرمت تاریخ صحیح نیست."
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
        !Number.isInteger(jd) ||
        jm < 1 ||
        jm > 12 ||
        jd < 1 ||
        jd > 31
    ) {

        throw new Error(
            "تاریخ شمسی واردشده صحیح نیست."
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


    const date =
        new persianDate()
            .year(jy)
            .month(jm - 1)
            .date(jd);


    return date
        .toCalendar("gregorian")
        .format(
            "YYYY-MM-DD"
        );
}


/* =========================================================
   SAVE WEEKLY RECORD
   ========================================================= */

async function saveWeeklyRecord() {

    try {

        if (!currentFlock) {

            alert(
                "ابتدا گله را انتخاب کنید."
            );

            return;
        }


        const week =
            weeklyGetNumber(
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
            weeklyGetWeights();


        if (weights.length < 2) {

            alert(
                "برای ذخیره گزارش حداقل دو وزن معتبر وارد کنید."
            );

            return;
        }


        const stats =
            weeklyCalculateWeightStatistics(
                weights
            );


        const evaluationDate =
            getGregorianDateForSupabase(
                weeklyGetValue(
                    "evaluationDate"
                )
            );


        const editingRecord =
            editingRecordId
                ? weeklyRecords.find(
                    item =>
                        String(item.id) ===
                        String(editingRecordId)
                )
                : null;


        const payload = {

            ...(editingRecord
                ? {
                    id:
                        editingRecord.id
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
                weeklyGetNumber(
                    "liveBirds"
                ),

            mortality_count:
                weeklyGetNumber(
                    "mortalityWeek"
                ),

            feed_total_kg:
                weeklyGetNumber(
                    "feedTotal"
                ),

            water_total_liter:
                weeklyGetNumber(
                    "waterTotal"
                ),

            feed_per_bird_g:
                weeklyGetNumber(
                    "feedPerBird"
                ),

            water_per_bird_ml:
                weeklyGetNumber(
                    "waterPerBird"
                ),

            notes:
                weeklyGetValue(
                    "weeklyNotes"
                ),

            weights:
                weights
        };


        console.log(
            "FINAL WEEKLY PAYLOAD:",
            payload
        );


        const saveButton =
            document.querySelector(
                'button[onclick="saveWeeklyRecord()"]'
            );


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "در حال ذخیره...";
        }


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
                "Supabase save error:",
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
            "Saved weekly record:",
            data
        );


        alert(
            editingRecordId
                ? "گزارش هفتگی با موفقیت ویرایش شد."
                : "گزارش هفتگی با موفقیت ذخیره شد."
        );


        weeklyClearForm();

        await weeklyLoadHistory();

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


        const saveButton =
            document.querySelector(
                'button[onclick="saveWeeklyRecord()"]'
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
   HISTORY
   ========================================================= */

async function weeklyLoadHistory() {

    if (!currentFlock) return;


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
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "History error:",
            error
        );


        const container =
            document.getElementById(
                "weeklyHistory"
            );


        if (container) {

            container.innerHTML =
                "<p>خطا در دریافت سوابق.</p>";
        }


        return;
    }


    weeklyRecords =
        data || [];


    weeklyRenderHistory();
}


/* =========================================================
   HISTORY UI
   ========================================================= */

function weeklyRenderHistory() {

    const container =
        document.getElementById(
            "weeklyHistory"
        );


    if (!container) return;


    if (!weeklyRecords.length) {

        container.innerHTML = `
            <p>
                هنوز گزارش هفتگی ثبت نشده است.
            </p>
        `;

        return;
    }


    container.innerHTML = `

        <div style="overflow-x:auto;">

            <table>

                <thead>

                    <tr>

                        <th>هفته</th>
                        <th>تاریخ</th>
                        <th>میانگین</th>
                        <th>SD</th>
                        <th>CV</th>
                        <th>یکنواختی ±10</th>
                        <th>یکنواختی ±15</th>
                        <th>تلفات</th>
                        <th>دان</th>
                        <th>آب</th>
                        <th>عملیات</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        weeklyRecords
                            .map(
                                record => `

                                    <tr>

                                        <td>
                                            ${weeklyFormatNumber(
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
                                            ${weeklyFormatNumber(
                                                record.average_weight_g,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.sd_weight_g,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.cv_percent,
                                                2
                                            )}%
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.uniformity_10_percent,
                                                1
                                            )}%
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.uniformity_15_percent,
                                                1
                                            )}%
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.mortality_count,
                                                0
                                            )}
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.feed_total_kg,
                                                1
                                            )}
                                        </td>

                                        <td>
                                            ${weeklyFormatNumber(
                                                record.water_total_liter,
                                                1
                                            )}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                class="btn btn-secondary"
                                                onclick="editWeeklyRecord('${weeklyEscapeAttribute(record.id)}')"
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

function formatDateDisplay(date) {

    if (!date) return "-";


    const text =
        String(date);


    if (text.includes("/")) {

        return weeklyToPersianDigits(
            text
        );
    }


    const parts =
        text.split("-");


    if (
        parts.length !== 3
    ) {

        return weeklyToPersianDigits(
            text
        );
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
                    .toCalendar("persian")
                    .format(
                        "YYYY/MM/DD"
                    );


            return weeklyToPersianDigits(
                shamsi
            );
        }

    }

    catch (error) {

        console.error(
            "Date display error:",
            error
        );
    }


    return weeklyToPersianDigits(
        text
    );
}


function convertDatabaseDateToShamsi(
    date
) {

    if (!date) return "";


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
                    .toCalendar("persian")
                    .format(
                        "YYYY/MM/DD"
                    );


            return weeklyToPersianDigits(
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


    return weeklyToPersianDigits(
        date
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function weeklyGetValue(id) {

    const element =
        document.getElementById(id);


    if (!element) return "";


    return String(
        element.value || ""
    ).trim();
}


function weeklyGetNumber(id) {

    const value =
        weeklyGetValue(id);


    if (!value) return 0;


    const normalized =
        weeklyNormalizeNumber(
            value
        );


    const number =
        Number(normalized);


    return Number.isFinite(number)
        ? number
        : 0;
}


function weeklyFormatNumber(
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
        !Number.isFinite(number)
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


function weeklyToPersianDigits(value) {

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


function weeklyEscapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function weeklyEscapeAttribute(value) {

    return String(
        value ?? ""
    )
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll("\n", "\\n")
        .replaceAll("\r", "\\r");
}
