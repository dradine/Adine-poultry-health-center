/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY MONITORING - SUPABASE VERSION
   WITH EDITING
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let weeklyRecords = [];

let weightChart = null;

/*
 * اگر null باشد یعنی ثبت جدید.
 * اگر مقدار داشته باشد یعنی در حال ویرایش همان رکورد هستیم.
 */
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
   CURRENT FLOCK
   ========================================================= */

async function loadCurrentFlock() {

    const selection =
        getCurrentSelection();


    const container =
        document.getElementById(
            "currentFlock"
        );


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
   DATE
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
   WEIGHTS
   ========================================================= */

function addWeightInput(
    value = ""
) {

    const container =
        document.getElementById(
            "weightsContainer"
        );


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
            type="number"
            min="0"
            step="0.1"
            inputmode="decimal"
            class="bird-weight"
            placeholder="گرم"
            value="${value}"
        >

    `;


    container.appendChild(
        wrapper
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

    document.getElementById(
        "weightsContainer"
    ).innerHTML = "";


    document.getElementById(
        "resultsCard"
    ).style.display =
        "none";

}


/* =========================================================
   GET WEIGHTS
   ========================================================= */

function getWeights() {

    const inputs =
        document.querySelectorAll(
            ".bird-weight"
        );


    return Array
        .from(inputs)
        .map(
            input =>
                Number(
                    input.value
                )
        )
        .filter(
            value =>
                Number.isFinite(value) &&
                value > 0
        );

}


/* =========================================================
   CALCULATE
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


    renderResults(
        result
    );


    drawWeightChart(
        weights,
        result
    );


    document.getElementById(
        "resultsCard"
    ).style.display =
        "block";

}


/* =========================================================
   STATISTICS
   ========================================================= */

function calculateWeightStatistics(
    weights
) {

    const n =
        weights.length;


    const mean =
        weights.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        ) / n;


    const squared =
        weights.map(
            value =>
                Math.pow(
                    value - mean,
                    2
                )
        );


    const variance =
        squared.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        ) / n;


    const sd =
        Math.sqrt(
            variance
        );


    const cv =
        mean > 0
            ? (
                sd / mean
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


    const uniformity10 =
        (
            weights.filter(
                weight =>
                    weight >= lower10 &&
                    weight <= upper10
            ).length / n
        ) * 100;


    const uniformity15 =
        (
            weights.filter(
                weight =>
                    weight >= lower15 &&
                    weight <= upper15
            ).length / n
        ) * 100;


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


    container.innerHTML = `

        ${metric(
            "تعداد نمونه",
            formatNumber(
                result.count,
                0
            )
        )}

        ${metric(
            "میانگین وزن",
            formatNumber(
                result.mean,
                1
            ) + " گرم"
        )}

        ${metric(
            "SD",
            formatNumber(
                result.sd,
                1
            ) + " گرم"
        )}

        ${metric(
            "CV",
            formatNumber(
                result.cv,
                2
            ) + "%"
        )}

        ${metric(
            "یکنواختی ±10%",
            formatNumber(
                result.uniformity10,
                1
            ) + "%"
        )}

        ${metric(
            "یکنواختی ±15%",
            formatNumber(
                result.uniformity15,
                1
            ) + "%"
        )}

        ${metric(
            "حداقل وزن",
            formatNumber(
                result.min,
                1
            ) + " گرم"
        )}

        ${metric(
            "حداکثر وزن",
            formatNumber(
                result.max,
                1
            ) + " گرم"
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
   START EDIT
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
     * اطلاعات اصلی
     */

    setField(
        "weekNumber",
        record.week_number
    );


    setField(
        "evaluationDate",
        record.evaluation_date
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


    setField(
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


    weightsContainer.innerHTML =
        "";


    let savedWeights =
        record.weights;


    /*
     * اگر Supabase وزن‌ها را
     * به صورت JSON string برگرداند
     */
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

        catch (
            error
        ) {

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
        ) &&
        savedWeights.length
    ) {

        savedWeights.forEach(
            weight =>
                addWeightInput(
                    weight
                )
        );

    }


    /*
     * اگر وزن خام موجود نبود،
     * حداقل یک ورودی ایجاد شود.
     */

    if (
        !weightsContainer.children.length
    ) {

        addWeightInput();

    }


    /*
     * محاسبه مجدد
     */

    if (
        getWeights().length >= 2
    ) {

        calculateWeekly();

    }


    /*
     * عنوان حالت ویرایش
     */

    showEditMode();


    /*
     * برگشت به بالای فرم
     */

    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================================
   EDIT MODE UI
   ========================================================= */

function showEditMode() {

    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    if (saveButton) {

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
                ? ` — هفته ${week}`
                : "";

    }

}


/* =========================================================
   CANCEL EDIT
   ========================================================= */

function cancelEditWeeklyRecord() {

    editingRecordId =
        null;


    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );


    if (saveButton) {

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


    clearWeeklyForm();

}


/* =========================================================
   CLEAR FORM AFTER SAVE / CANCEL
   ========================================================= */

function clearWeeklyForm() {

    setToday();


    const fields = [

        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird",
        "weeklyNotes"

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


    document.getElementById(
        "weightsContainer"
    ).innerHTML =
        "";


    document.getElementById(
        "resultsCard"
    ).style.display =
        "none";


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
        value === undefined
    ) {

        element.value =
            "";

        return;

    }


    element.value =
        value;

}


/* =========================================================
   SAVE TO SUPABASE
   ========================================================= */

async function saveWeeklyRecord() {

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


    if (weights.length < 2) {

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


    /*
     * اگر در حالت ویرایش هستیم،
     * رکورد قبلی را پیدا می‌کنیم.
     */

    const editingRecord =
        editingRecordId
            ? weeklyRecords.find(
                item =>
                    String(item.id) ===
                    String(editingRecordId)
              )
            : null;


    /*
     * برای حفظ همان ID
     */

    const recordId =
        editingRecord
            ? editingRecord.id
            : null;


    const payload = {

        /*
         * در حالت ویرایش ID همان رکورد
         * حفظ می‌شود.
         */

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
            getValue(
                "evaluationDate"
            ) || null,


        /* =========================
           WEIGHT STATISTICS
           ========================= */

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


        /* =========================
           FLOCK
           ========================= */

        live_birds:
            liveBirds,

        mortality_count:
            mortality,


        /* =========================
           FEED / WATER
           ========================= */

        feed_total_kg:
            feedTotal,

        water_total_liter:
            waterTotal,

        feed_per_bird_g:
            feedPerBird,

        water_per_bird_ml:
            waterPerBird,


        /* =========================
           NOTES
           ========================= */

        notes:
            getValue(
                "weeklyNotes"
            ),


        /* =========================
           RAW WEIGHTS
           ========================= */

        weights:
            weights

    };


    console.log(
        "WEEKLY SUPABASE PAYLOAD:",
        payload
    );


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


    if (editingRecordId) {

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
     * فرم را به حالت عادی برمی‌گردانیم.
     */

    clearWeeklyForm();


    /*
     * سوابق را دوباره از Supabase می‌خوانیم.
     */

    await loadHistory();

}


/* =========================================================
   HISTORY FROM SUPABASE
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

        document.getElementById(
            "weeklyHistory"
        ).innerHTML = `
            خطا در دریافت سوابق.
        `;

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


    const parts =
        String(date).split("-");


    if (
        parts.length !== 3
    ) {

        return String(date);

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
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
                .replaceAll(
                    ",",
                    ""
                )
                .replaceAll(
                    "٬",
                    ""
                )
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;

}


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
