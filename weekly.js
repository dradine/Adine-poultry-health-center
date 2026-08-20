/* =========================================================
   ADINE POULTRY HEALTH CENTER
   WEEKLY MONITORING
   FINAL STABLE VERSION
   Persian / Arabic / English Numbers
   Shamsi Calendar
   Supabase
   Uniformity ±10% / ±15%
   Editing Records
   ========================================================= */

"use strict";

let currentUser = null;
let currentFlock = null;
let weeklyRecords = [];
let weightChart = null;
let editingRecordId = null;


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeWeekly();
});


async function initializeWeekly() {
    try {

        prepareAllInputs();
        initializeCalendar();

        if (typeof checkUserAccess !== "function") {
            throw new Error("تابع checkUserAccess پیدا نشد.");
        }

        const access = await checkUserAccess();

        if (!access || !access.authenticated) {
            location.href =
                "login.html?message=" +
                encodeURIComponent("ابتدا وارد سامانه شوید.");
            return;
        }

        if (!access.allowed) {

            alert("حساب شما هنوز تأیید نشده است.");

            if (typeof logoutUser === "function") {
                await logoutUser();
            }

            return;
        }

        currentUser = access.user;

        setToday();

        await loadCurrentFlock();

    } catch (error) {

        console.error("WEEKLY INIT ERROR:", error);

        alert(
            "خطا در راه‌اندازی ثبت هفتگی:\n" +
            (error?.message || "خطای نامشخص")
        );
    }
}


/* =========================================================
   INPUT PREPARATION
   ========================================================= */

function prepareAllInputs() {

    const numericIds = [
        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird"
    ];

    numericIds.forEach(function (id) {

        const input = document.getElementById(id);

        if (input) {
            prepareNumericInput(input);
        }
    });

    document
        .querySelectorAll(".bird-weight")
        .forEach(function (input) {
            prepareNumericInput(input);
        });
}


function prepareNumericInput(input) {

    if (!input) return;

    /*
     * مهم:
     * type=number باعث می‌شود بعضی مرورگرهای iPhone
     * اعداد فارسی/عربی را قبول نکنند.
     */
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";

    /*
     * اعداد فارسی و عربی اجازه ورود دارند.
     * هنگام تایپ آنها را به انگلیسی تبدیل نمی‌کنیم.
     * فقط هنگام محاسبه/ذخیره normalize می‌شوند.
     */

    if (input.dataset.weeklyPrepared === "true") {
        return;
    }

    input.dataset.weeklyPrepared = "true";

    input.addEventListener("blur", function () {

        if (this.id === "evaluationDate") {
            return;
        }

        const value = this.value.trim();

        if (!value) return;

        /*
         * عدد فارسی همچنان قابل ورود است.
         * فقط جداکننده‌های اضافی حذف می‌شوند.
         */
        this.value = normalizeInputForDisplay(value);
    });
}


function normalizeInputForDisplay(value) {

    if (value === null || value === undefined) {
        return "";
    }

    let text = String(value);

    text = text.replaceAll("٬", "");
    text = text.replaceAll(",", "");

    return text;
}


/* =========================================================
   NUMBER NORMALIZATION
   ========================================================= */

function normalizeNumberString(value) {

    if (value === null || value === undefined) {
        return "";
    }

    let text = String(value).trim();

    /* Persian digits */
    text = text.replace(
        /[۰-۹]/g,
        function (digit) {
            return String(
                digit.charCodeAt(0) - 1776
            );
        }
    );

    /* Arabic digits */
    text = text.replace(
        /[٠-٩]/g,
        function (digit) {
            return String(
                digit.charCodeAt(0) - 1632
            );
        }
    );

    /* Persian thousands separator */
    text = text.replaceAll("٬", "");

    /* English comma */
    text = text.replaceAll(",", "");

    /* Persian decimal separator */
    text = text.replaceAll("٫", ".");

    /* Arabic comma */
    text = text.replaceAll("،", ".");

    /* Keep valid numeric characters */
    text = text.replace(/[^0-9.\-]/g, "");

    /* Only first decimal point */
    const firstDot = text.indexOf(".");

    if (firstDot !== -1) {

        text =
            text.substring(0, firstDot + 1) +
            text
                .substring(firstDot + 1)
                .replace(/\./g, "");
    }

    /* Minus only at beginning */
    if (text.includes("-")) {

        text =
            (text.startsWith("-") ? "-" : "") +
            text.replace(/-/g, "");
    }

    return text;
}


function getValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return String(
        element.value || ""
    ).trim();
}


function getNumber(id) {

    const value = getValue(id);

    if (!value) {
        return 0;
    }

    const normalized =
        normalizeNumberString(value);

    const number = Number(normalized);

    return Number.isFinite(number)
        ? number
        : 0;
}


/* =========================================================
   SHAMSI DATE
   ========================================================= */

function gregorianToJalali(gy, gm, gd) {

    const gDaysInMonth = [
        31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    const jDaysInMonth = [
        31, 31, 31, 31, 31, 31,
        30, 30, 30, 30, 30, 29
    ];

    let gy2 = gy - 1600;
    let gm2 = gm - 1;
    let gd2 = gd - 1;

    let gDayNo =
        365 * gy2 +
        Math.floor((gy2 + 3) / 4) -
        Math.floor((gy2 + 99) / 100) +
        Math.floor((gy2 + 399) / 400);

    for (let i = 0; i < gm2; i++) {
        gDayNo += gDaysInMonth[i];
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

    gDayNo += gd2;

    let jDayNo = gDayNo - 79;

    const jNp =
        Math.floor(jDayNo / 12053);

    jDayNo %= 12053;

    let jy =
        979 +
        33 * jNp +
        4 * Math.floor(jDayNo / 1461);

    jDayNo %= 1461;

    if (jDayNo >= 366) {

        jy +=
            Math.floor(
                (jDayNo - 1) / 365
            );

        jDayNo =
            (jDayNo - 1) % 365;
    }

    let jm = 0;

    while (
        jm < 11 &&
        jDayNo >= jDaysInMonth[jm]
    ) {
        jDayNo -= jDaysInMonth[jm];
        jm++;
    }

    const jd = jDayNo + 1;

    return {
        year: jy,
        month: jm + 1,
        day: jd
    };
}


function jalaliToGregorian(jy, jm, jd) {

    const jDaysInMonth = [
        31, 31, 31, 31, 31, 31,
        30, 30, 30, 30, 30, 29
    ];

    const gDaysInMonth = [
        31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    let jy2 = jy - 979;

    let jDayNo =
        365 * jy2 +
        Math.floor(jy2 / 33) * 8 +
        Math.floor(
            (jy2 % 33 + 3) / 4
        );

    for (let i = 0; i < jm - 1; i++) {
        jDayNo += jDaysInMonth[i];
    }

    jDayNo += jd - 1;

    let gDayNo = jDayNo + 79;

    let gy =
        1600 +
        400 *
        Math.floor(gDayNo / 146097);

    gDayNo %= 146097;

    let leap = true;

    if (gDayNo >= 36525) {

        gDayNo--;

        gy +=
            100 *
            Math.floor(
                gDayNo / 36524
            );

        gDayNo %= 36524;

        if (gDayNo >= 365) {
            gDayNo++;
        } else {
            leap = false;
        }
    }

    gy +=
        4 *
        Math.floor(
            gDayNo / 1461
        );

    gDayNo %= 1461;

    if (gDayNo >= 366) {

        leap = false;

        gDayNo--;

        gy +=
            Math.floor(
                gDayNo / 365
            );

        gDayNo %= 365;
    }

    let gm = 0;

    while (
        gDayNo >=
        gDaysInMonth[gm] +
        (
            gm === 1 && leap
                ? 1
                : 0
        )
    ) {

        gDayNo -=
            gDaysInMonth[gm] +
            (
                gm === 1 && leap
                    ? 1
                    : 0
            );

        gm++;
    }

    const gd = gDayNo + 1;

    return {
        year: gy,
        month: gm + 1,
        day: gd
    };
}


function formatJalaliDate(date) {

    return (
        date.year +
        "/" +
        String(date.month).padStart(2, "0") +
        "/" +
        String(date.day).padStart(2, "0")
    );
}


function setToday() {

    const input =
        document.getElementById(
            "evaluationDate"
        );

    if (!input) return;

    const today = new Date();

    const jalali =
        gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );

    input.value =
        convertDigitsToPersian(
            formatJalaliDate(jalali)
        );

    input.dataset.iso =
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            today.getDate()
        ).padStart(2, "0");
}


/* =========================================================
   DATE INPUT → DATABASE
   ========================================================= */

function getGregorianDateForSupabase(value) {

    if (!value) {
        return null;
    }

    let text =
        normalizeDateDigits(
            value
        );

    text =
        text.replace(
            /[-.]/g,
            "/"
        );

    const parts =
        text.split("/");

    if (parts.length !== 3) {
        throw new Error(
            "فرمت تاریخ صحیح نیست."
        );
    }

    const jy = Number(parts[0]);
    const jm = Number(parts[1]);
    const jd = Number(parts[2]);

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
        jy > 1500 ||
        jm < 1 ||
        jm > 12 ||
        jd < 1 ||
        jd > 31
    ) {
        throw new Error(
            "تاریخ شمسی واردشده معتبر نیست."
        );
    }

    const gregorian =
        jalaliToGregorian(
            jy,
            jm,
            jd
        );

    return (
        gregorian.year +
        "-" +
        String(
            gregorian.month
        ).padStart(2, "0") +
        "-" +
        String(
            gregorian.day
        ).padStart(2, "0")
    );
}


function normalizeDateDigits(value) {

    let text = String(value);

    text = text.replace(
        /[۰-۹]/g,
        function (d) {
            return String(
                d.charCodeAt(0) - 1776
            );
        }
    );

    text = text.replace(
        /[٠-٩]/g,
        function (d) {
            return String(
                d.charCodeAt(0) - 1632
            );
        }
    );

    return text;
}


function convertDatabaseDateToShamsi(date) {

    if (!date) {
        return "";
    }

    const parts =
        String(date).split("-");

    if (parts.length !== 3) {
        return String(date);
    }

    const jalali =
        gregorianToJalali(
            Number(parts[0]),
            Number(parts[1]),
            Number(parts[2])
        );

    return convertDigitsToPersian(
        formatJalaliDate(jalali)
    );
}


function formatDateDisplay(date) {

    return convertDatabaseDateToShamsi(
        date
    );
}


/* =========================================================
   CALENDAR
   ========================================================= */

let calendarYear = 1405;
let calendarMonth = 1;


function initializeCalendar() {

    const wrapper =
        document.getElementById(
            "jalaliDateWrapper"
        );

    const button =
        document.getElementById(
            "jalaliCalendarButton"
        );

    const calendar =
        document.getElementById(
            "jalaliCalendar"
        );

    const prev =
        document.getElementById(
            "jalaliPrevButton"
        );

    const next =
        document.getElementById(
            "jalaliNextButton"
        );

    const today =
        document.getElementById(
            "jalaliTodayButton"
        );

    const input =
        document.getElementById(
            "evaluationDate"
        );

    if (
        !wrapper ||
        !button ||
        !calendar ||
        !prev ||
        !next ||
        !today ||
        !input
    ) {
        return;
    }

    button.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        openJalaliCalendar();
    };

    input.onclick = function (event) {

        event.preventDefault();

        openJalaliCalendar();
    };

    prev.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        changeCalendarMonth(-1);
    };

    next.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        changeCalendarMonth(1);
    };

    today.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        setToday();

        syncCalendarToInput();

        renderJalaliCalendar();

        closeJalaliCalendar();
    };

    document.addEventListener(
        "click",
        function (event) {

            if (
                !wrapper.contains(
                    event.target
                )
            ) {
                closeJalaliCalendar();
            }
        }
    );

    syncCalendarToInput();
    renderJalaliCalendar();
}


function openJalaliCalendar() {

    const calendar =
        document.getElementById(
            "jalaliCalendar"
        );

    if (!calendar) return;

    syncCalendarToInput();

    renderJalaliCalendar();

    calendar.style.display =
        "block";
}


function closeJalaliCalendar() {

    const calendar =
        document.getElementById(
            "jalaliCalendar"
        );

    if (!calendar) return;

    calendar.style.display =
        "none";
}


function syncCalendarToInput() {

    const input =
        document.getElementById(
            "evaluationDate"
        );

    if (!input) return;

    let value =
        normalizeDateDigits(
            input.value
        );

    const parts =
        value.split("/");

    if (
        parts.length === 3 &&
        Number(parts[0]) >= 1300 &&
        Number(parts[1]) >= 1 &&
        Number(parts[1]) <= 12
    ) {

        calendarYear =
            Number(parts[0]);

        calendarMonth =
            Number(parts[1]);

        return;
    }

    const today = new Date();

    const jalali =
        gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );

    calendarYear =
        jalali.year;

    calendarMonth =
        jalali.month;
}


function changeCalendarMonth(delta) {

    calendarMonth += delta;

    if (calendarMonth < 1) {
        calendarMonth = 12;
        calendarYear--;
    }

    if (calendarMonth > 12) {
        calendarMonth = 1;
        calendarYear++;
    }

    renderJalaliCalendar();
}


function isJalaliLeapYear(year) {

    const g =
        jalaliToGregorian(
            year,
            1,
            1
        );

    const next =
        jalaliToGregorian(
            year + 1,
            1,
            1
        );

    const days =
        (
            new Date(
                next.year,
                next.month - 1,
                next.day
            ).getTime() -
            new Date(
                g.year,
                g.month - 1,
                g.day
            ).getTime()
        ) /
        86400000;

    return days === 366;
}


function getJalaliMonthDays(
    year,
    month
) {

    if (month <= 6) {
        return 31;
    }

    if (month <= 11) {
        return 30;
    }

    return isJalaliLeapYear(year)
        ? 30
        : 29;
}


function getWeekDayOfJalaliMonth(
    year,
    month
) {

    const g =
        jalaliToGregorian(
            year,
            month,
            1
        );

    const date =
        new Date(
            g.year,
            g.month - 1,
            g.day
        );

    /*
     * JavaScript:
     * Sunday = 0
     *
     * Persian calendar:
     * Saturday = 0
     */
    return (
        date.getDay() + 1
    ) % 7;
}


function renderJalaliCalendar() {

    const title =
        document.getElementById(
            "jalaliMonthTitle"
        );

    const daysContainer =
        document.getElementById(
            "jalaliDays"
        );

    if (
        !title ||
        !daysContainer
    ) {
        return;
    }

    const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"
    ];

    title.textContent =
        months[calendarMonth - 1] +
        " " +
        convertDigitsToPersian(
            calendarYear
        );

    daysContainer.innerHTML = "";

    const firstDay =
        getWeekDayOfJalaliMonth(
            calendarYear,
            calendarMonth
        );

    const daysInMonth =
        getJalaliMonthDays(
            calendarYear,
            calendarMonth
        );

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        daysContainer.appendChild(
            empty
        );
    }

    const input =
        document.getElementById(
            "evaluationDate"
        );

    const selected =
        input
            ? normalizeDateDigits(
                input.value
            ).split("/")
            : [];

    const today =
        new Date();

    const todayJalali =
        gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";
        button.className = "jalali-day";

        if (
            todayJalali.year === calendarYear &&
            todayJalali.month === calendarMonth &&
            todayJalali.day === day
        ) {
            button.classList.add("today");
        }

        if (
            selected.length === 3 &&
            Number(selected[0]) === calendarYear &&
            Number(selected[1]) === calendarMonth &&
            Number(selected[2]) === day
        ) {
            button.classList.add("selected");
        }

        button.textContent =
            convertDigitsToPersian(
                day
            );

        button.onclick =
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                selectJalaliDate(
                    calendarYear,
                    calendarMonth,
                    day
                );
            };

        daysContainer.appendChild(
            button
        );
    }
}


function selectJalaliDate(
    year,
    month,
    day
) {

    const input =
        document.getElementById(
            "evaluationDate"
        );

    if (!input) return;

    const value =
        year +
        "/" +
        String(month).padStart(2, "0") +
        "/" +
        String(day).padStart(2, "0");

    input.value =
        convertDigitsToPersian(
            value
        );

    renderJalaliCalendar();

    closeJalaliCalendar();
}


/* =========================================================
   FLOCK
   ========================================================= */

async function loadCurrentFlock() {

    const container =
        document.getElementById(
            "currentFlock"
        );

    if (!container) return;

    if (
        typeof getCurrentSelection !==
        "function"
    ) {

        container.innerHTML =
            "<p>انتخاب گله در دسترس نیست.</p>";

        return;
    }

    const selection =
        getCurrentSelection();

    if (
        !selection ||
        !selection.flockId
    ) {

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

    if (
        !window.supabaseClient
    ) {

        throw new Error(
            "Supabase Client پیدا نشد."
        );
    }

    const result =
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
        result.error ||
        !result.data
    ) {

        console.error(
            result.error
        );

        container.innerHTML =
            "<p>گله پیدا نشد.</p>";

        return;
    }

    currentFlock =
        result.data;

    container.innerHTML = `

        <div class="farm-summary">

            <strong>
                🐔
                ${escapeHTML(
                    currentFlock.flock_name
                )}
            </strong>

            <br>

            فارم:
            ${escapeHTML(
                currentFlock.farms?.name || "-"
            )}

            <br>

            سالن:
            ${escapeHTML(
                currentFlock.houses?.name || "-"
            )}

            <br>

            نوع:
            ${escapeHTML(
                getProductionLabel(
                    currentFlock.production_type
                )
            )}

            <br>

            سویه:
            ${escapeHTML(
                currentFlock.genetics ||
                currentFlock.strain ||
                "-"
            )}

        </div>
    `;

    await loadHistory();
}


/* =========================================================
   WEIGHTS
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
            value === ""
                ? ""
                : String(value);

        prepareNumericInput(input);
        input.focus();
    }
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

        weightChart = null;
    }
}


function getWeights() {

    const inputs =
        document.querySelectorAll(
            ".bird-weight"
        );

    const weights = [];

    inputs.forEach(function (input) {

        const normalized =
            normalizeNumberString(
                input.value
            );

        if (!normalized) {
            return;
        }

        const value =
            Number(normalized);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {
            weights.push(value);
        }
    });

    return weights;
}


/* =========================================================
   CALCULATION
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

    renderResults(result);

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


function calculateWeightStatistics(
    weights
) {

    const validWeights =
        (Array.isArray(weights)
            ? weights
            : []
        )
        .map(function (value) {

            return Number(
                normalizeNumberString(
                    value
                )
            );
        })
        .filter(function (value) {

            return (
                Number.isFinite(value) &&
                value > 0
            );
        });

    const n =
        validWeights.length;

    if (n < 2) {

        return {
            count: n,
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

    const sum =
        validWeights.reduce(
            function (total, value) {
                return total + value;
            },
            0
        );

    const mean =
        sum / n;

    const variance =
        validWeights.reduce(
            function (total, value) {

                return (
                    total +
                    Math.pow(
                        value - mean,
                        2
                    )
                );

            },
            0
        ) / n;

    const sd =
        Math.sqrt(variance);

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

    const uniformCount10 =
        validWeights.filter(
            function (weight) {

                return (
                    weight >= lower10 &&
                    weight <= upper10
                );
            }
        ).length;

    const uniformCount15 =
        validWeights.filter(
            function (weight) {

                return (
                    weight >= lower15 &&
                    weight <= upper15
                );
            }
        ).length;

    return {

        count: n,

        mean: mean,

        sd: sd,

        cv: cv,

        uniformity10:
            (
                uniformCount10 / n
            ) * 100,

        uniformity15:
            (
                uniformCount15 / n
            ) * 100,

        min:
            Math.min(
                ...validWeights
            ),

        max:
            Math.max(
                ...validWeights
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

function renderResults(result) {

    const container =
        document.getElementById(
            "results"
        );

    if (!container) return;

    container.innerHTML = `

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
        return;
    }

    const canvas =
        document.getElementById(
            "weightChart"
        );

    if (!canvas) return;

    if (weightChart) {

        weightChart.destroy();

        weightChart = null;
    }

    const labels =
        weights.map(
            function (_, index) {
                return convertDigitsToPersian(
                    index + 1
                );
            }
        );

    weightChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

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
                                    function () {
                                        return result.mean;
                                    }
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
                                    function () {
                                        return result.lower10;
                                    }
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
                                    function () {
                                        return result.upper10;
                                    }
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
   SAVE
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

        let evaluationDate =
            getValue(
                "evaluationDate"
            );

        if (!evaluationDate) {
            setToday();
            evaluationDate =
                getValue(
                    "evaluationDate"
                );
        }

        const evaluationDateGregorian =
            getGregorianDateForSupabase(
                evaluationDate
            );

        const editingRecord =
            editingRecordId
                ? weeklyRecords.find(
                    function (item) {
                        return String(item.id) ===
                            String(editingRecordId);
                    }
                )
                : null;

        const payload = {

            ...(editingRecordId
                ? {
                    id:
                        editingRecordId
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
                evaluationDateGregorian,

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
                getNumber(
                    "liveBirds"
                ),

            mortality_count:
                getNumber(
                    "mortalityWeek"
                ),

            feed_total_kg:
                getNumber(
                    "feedTotal"
                ),

            water_total_liter:
                getNumber(
                    "waterTotal"
                ),

            feed_per_bird_g:
                getNumber(
                    "feedPerBird"
                ),

            water_per_bird_ml:
                getNumber(
                    "waterPerBird"
                ),

            notes:
                getValue(
                    "weeklyNotes"
                ),

            weights:
                weights
        };

        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                "در حال ذخیره...";
        }

        const result =
            await supabaseClient
                .from("weekly_records")
                .upsert(
                    payload,
                    {
                        onConflict:
                            "flock_id,week_number"
                    }
                )
                .select()
                .single();

        if (result.error) {

            console.error(
                "SAVE ERROR:",
                result.error
            );

            throw result.error;
        }

        const wasEditing =
            Boolean(
                editingRecordId
            );

        clearWeeklyForm();

        await loadHistory();

        alert(
            wasEditing
                ? "گزارش هفتگی با موفقیت ویرایش شد."
                : "گزارش هفتگی با موفقیت ذخیره شد."
        );

    } catch (error) {

        console.error(
            "WEEKLY SAVE ERROR:",
            error
        );

        alert(
            "ذخیره گزارش انجام نشد:\n" +
            (
                error?.message ||
                "خطای نامشخص"
            )
        );

    } finally {

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

async function loadHistory() {

    if (!currentFlock) {
        return;
    }

    const history =
        document.getElementById(
            "weeklyHistory"
        );

    try {

        const result =
            await supabaseClient
                .from("weekly_records")
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

        if (result.error) {
            throw result.error;
        }

        weeklyRecords =
            result.data || [];

        renderHistory();

    } catch (error) {

        console.error(
            "HISTORY ERROR:",
            error
        );

        if (history) {

            history.innerHTML =
                "<p>خطا در دریافت سوابق.</p>";
        }
    }
}


function renderHistory() {

    const container =
        document.getElementById(
            "weeklyHistory"
        );

    if (!container) return;

    if (!weeklyRecords.length) {

        container.innerHTML =
            "<p>هنوز گزارش هفتگی ثبت نشده است.</p>";

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

                    ${weeklyRecords.map(
                        function (record) {

                            return `

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
                                            onclick="editWeeklyRecord('${escapeJSAttribute(record.id)}')"
                                        >
                                            ✏️ ویرایش
                                        </button>

                                    </td>

                                </tr>
                            `;
                        }
                    ).join("")}

                </tbody>

            </table>

        </div>
    `;
}


/* =========================================================
   EDIT
   ========================================================= */

function editWeeklyRecord(
    recordId
) {

    const record =
        weeklyRecords.find(
            function (item) {
                return String(item.id) ===
                    String(recordId);
            }
        );

    if (!record) {

        alert(
            "رکورد موردنظر پیدا نشد."
        );

        return;
    }

    editingRecordId =
        record.id;

    setNumericField(
        "weekNumber",
        record.week_number
    );

    setNumericField(
        "liveBirds",
        record.live_birds
    );

    setNumericField(
        "mortalityWeek",
        record.mortality_count
    );

    setNumericField(
        "feedTotal",
        record.feed_total_kg
    );

    setNumericField(
        "waterTotal",
        record.water_total_liter
    );

    setNumericField(
        "feedPerBird",
        record.feed_per_bird_g
    );

    setNumericField(
        "waterPerBird",
        record.water_per_bird_ml
    );

    setTextField(
        "evaluationDate",
        convertDatabaseDateToShamsi(
            record.evaluation_date
        )
    );

    setTextField(
        "weeklyNotes",
        record.notes
    );

    const container =
        document.getElementById(
            "weightsContainer"
        );

    if (container) {
        container.innerHTML = "";
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
        } catch {
            savedWeights = [];
        }
    }

    if (
        Array.isArray(savedWeights)
    ) {

        savedWeights.forEach(
            function (weight) {

                if (
                    Number(
                        normalizeNumberString(
                            weight
                        )
                    ) > 0
                ) {
                    addWeightInput(
                        weight
                    );
                }
            }
        );
    }

    if (
        !container ||
        container.children.length === 0
    ) {
        addWeightInput();
    }

    if (
        getWeights().length >= 2
    ) {
        calculateWeekly();
    }

    showEditMode();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showEditMode() {

    const saveButton =
        document.querySelector(
            'button[onclick="saveWeeklyRecord()"]'
        );

    if (saveButton) {

        saveButton.disabled = false;

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
                ? " — هفته " +
                  convertDigitsToPersian(
                      normalizeNumberString(
                          week
                      )
                  )
                : "";
    }
}


function cancelEditWeeklyRecord() {

    clearWeeklyForm();
}


function clearWeeklyForm() {

    editingRecordId =
        null;

    setToday();

    [
        "weekNumber",
        "liveBirds",
        "mortalityWeek",
        "feedTotal",
        "waterTotal",
        "feedPerBird",
        "waterPerBird"
    ].forEach(
        function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }
        }
    );

    setTextField(
        "weeklyNotes",
        ""
    );

    const container =
        document.getElementById(
            "weightsContainer"
        );

    if (container) {
        container.innerHTML = "";
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

        weightChart = null;
    }

    const notice =
        document.getElementById(
            "editModeNotice"
        );

    if (notice) {
        notice.remove();
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
}


/* =========================================================
   FIELD HELPERS
   ========================================================= */

function setNumericField(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.value = "";

        return;
    }

    element.value =
        convertDigitsToPersian(
            String(value)
        );
}


function setTextField(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.value =
        value === null ||
        value === undefined
            ? ""
            : String(value);
}


/* =========================================================
   FORMAT
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


function convertDigitsToPersian(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /\d/g,
        function (digit) {

            return "۰۱۲۳۴۵۶۷۸۹"[
                Number(digit)
            ];
        }
    );
}


/* =========================================================
   PRODUCTION
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
   HTML SAFETY
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


function escapeJSAttribute(
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
   GLOBAL EXPORTS
   مهم برای onclick های داخل HTML
   ========================================================= */

window.initializeWeekly =
    initializeWeekly;

window.addWeightInput =
    addWeightInput;

window.addTwentyWeights =
    addTwentyWeights;

window.clearWeights =
    clearWeights;

window.calculateWeekly =
    calculateWeekly;

window.saveWeeklyRecord =
    saveWeeklyRecord;

window.editWeeklyRecord =
    editWeeklyRecord;

window.cancelEditWeeklyRecord =
    cancelEditWeeklyRecord;

window.openJalaliCalendar =
    openJalaliCalendar;

window.closeJalaliCalendar =
    closeJalaliCalendar;

window.setToday =
    setToday;

window.getWeights =
    getWeights;

window.calculateWeightStatistics =
    calculateWeightStatistics;
