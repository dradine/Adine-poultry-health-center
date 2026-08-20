/* =========================================================
   ADINE POULTRY HEALTH CENTER
   JALALI MOBILE DATE PICKER
   مستقل - بدون jQuery
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       DIGITS
    ===================================================== */

    const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
    const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

    function toEnglish(value) {

        return String(value ?? "")
            .replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d))
            .replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d));

    }

    function toPersian(value) {

        return String(value ?? "")
            .replace(/\d/g, d => FA_DIGITS[d]);

    }


    /* =====================================================
       JALALI CONVERSION ENGINE
    ===================================================== */

    function div(a, b) {

        return Math.floor(a / b);

    }


    function jalaliToGregorian(jy, jm, jd) {

        jy = Number(jy);
        jm = Number(jm);
        jd = Number(jd);

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
            jd +
            (
                jm < 7
                    ? (jm - 1) * 31
                    : ((jm - 7) * 30) + 186
            );

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

        const gd =
            days + 1;

        const leap =
            (
                gy % 4 === 0 &&
                (
                    gy % 100 !== 0 ||
                    gy % 400 === 0
                )
            );

        const monthDays = [

            31,
            leap ? 29 : 28,
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

        let remaining = gd;
        let gm = 1;

        while (
            gm <= 12 &&
            remaining > monthDays[gm - 1]
        ) {

            remaining -=
                monthDays[gm - 1];

            gm++;

        }

        return {

            year: gy,
            month: gm,
            day: remaining

        };

    }


    function gregorianToJalali(gy, gm, gd) {

        let jy;

        if (gy > 1600) {

            jy = 979;
            gy -= 1600;

        } else {

            jy = 0;
            gy -= 621;

        }

        const gDayNo = [

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

            gDayNo[gm - 1];

        jy +=
            33 *
            div(days, 12053);

        days %= 12053;

        jy +=
            4 *
            div(days, 1461);

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

        return {

            year: jy,
            month: jm,
            day: jd

        };

    }


    function formatJalali(y, m, d) {

        return toPersian(

            String(y).padStart(4, "0") +
            "/" +
            String(m).padStart(2, "0") +
            "/" +
            String(d).padStart(2, "0")

        );

    }


    function todayJalali() {

        const now =
            new Date();

        const j =
            gregorianToJalali(

                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate()

            );

        return formatJalali(
            j.year,
            j.month,
            j.day
        );

    }


    function jalaliToISO(value) {

        if (!value) {
            return null;
        }

        const parts =

            toEnglish(value)
                .trim()
                .replace(/-/g, "/")
                .split("/");

        if (parts.length !== 3) {
            return null;
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
            !Number.isInteger(d) ||
            y < 1200 ||
            y > 1600 ||
            m < 1 ||
            m > 12 ||
            d < 1 ||
            d > 31
        ) {

            return null;

        }

        const max =
            jalaliMonthDays(
                y,
                m
            );

        if (d > max) {
            return null;
        }

        const g =
            jalaliToGregorian(
                y,
                m,
                d
            );

        return (

            String(g.year).padStart(4, "0") +
            "-" +
            String(g.month).padStart(2, "0") +
            "-" +
            String(g.day).padStart(2, "0")

        );

    }


    function isoToJalali(value) {

        if (!value) {
            return "";
        }

        const parts =

            String(value)
                .substring(0, 10)
                .split("-");

        if (parts.length !== 3) {
            return "";
        }

        const g =
            gregorianToJalali(

                Number(parts[0]),
                Number(parts[1]),
                Number(parts[2])

            );

        return formatJalali(

            g.year,
            g.month,
            g.day

        );

    }


    function jalaliMonthDays(year, month) {

        if (month <= 6) {
            return 31;
        }

        if (month <= 11) {
            return 30;
        }

        const a =
            jalaliToGregorian(
                year,
                12,
                30
            );

        const b =
            jalaliToGregorian(
                year + 1,
                1,
                1
            );

        const dateA =
            Date.UTC(
                a.year,
                a.month - 1,
                a.day
            );

        const dateB =
            Date.UTC(
                b.year,
                b.month - 1,
                b.day
            );

        const diff =
            Math.round(
                (dateB - dateA) /
                86400000
            );

        return diff >= 2
            ? 30
            : 29;

    }


    /* =====================================================
       DATE PICKER
    ===================================================== */

    let picker = null;
    let activeInput = null;

    let selectedYear = 0;
    let selectedMonth = 0;
    let selectedDay = 0;


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


    const weekdays = [

        "ش",
        "ی",
        "د",
        "س",
        "چ",
        "پ",
        "ج"

    ];


    /* =====================================================
       PICKER CSS
    ===================================================== */

    function installStyles() {

        if (
            document.getElementById(
                "adine-jalali-picker-style"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "adine-jalali-picker-style";

        style.textContent = `

            #adine-jalali-picker {

                position: fixed;

                z-index: 999999;

                width: 292px;

                max-width:
                    calc(100vw - 20px);

                background: #ffffff;

                border-radius: 16px;

                box-shadow:
                    0 14px 40px
                    rgba(0,0,0,.22);

                border:
                    1px solid #dfe6e2;

                padding: 10px;

                direction: rtl;

                font-family:
                    Tahoma,
                    Arial,
                    sans-serif;

                display: none;

                box-sizing: border-box;

            }


            #adine-jalali-picker.show {

                display: block;

            }


            #adine-jalali-picker
            .ajp-header {

                display: flex;

                align-items: center;

                justify-content:
                    space-between;

                margin-bottom: 8px;

            }


            #adine-jalali-picker
            .ajp-header button {

                width: 36px;

                height: 36px;

                border: 0;

                border-radius: 10px;

                background: #eef3f0;

                color: #173f35;

                font-size: 22px;

                cursor: pointer;

            }


            #adine-jalali-picker
            .ajp-title {

                font-size: 15px;

                font-weight: 700;

                color: #173f35;

            }


            #adine-jalali-picker
            .ajp-week {

                display: grid;

                grid-template-columns:
                    repeat(7, 1fr);

                text-align: center;

                margin-bottom: 4px;

            }


            #adine-jalali-picker
            .ajp-week span {

                font-size: 11px;

                color: #7a8580;

                padding: 4px 0;

            }


            #adine-jalali-picker
            .ajp-days {

                display: grid;

                grid-template-columns:
                    repeat(7, 1fr);

                gap: 3px;

            }


            #adine-jalali-picker
            .ajp-day {

                height: 32px;

                display: flex;

                align-items: center;

                justify-content: center;

                border: 0;

                background: transparent;

                border-radius: 50%;

                font-size: 13px;

                cursor: pointer;

                color: #26332e;

                font-family: inherit;

            }


            #adine-jalali-picker
            .ajp-day:hover {

                background: #e9f1ed;

            }


            #adine-jalali-picker
            .ajp-day.selected {

                background: #173f35;

                color: white;

                font-weight: bold;

            }


            #adine-jalali-picker
            .ajp-footer {

                display: flex;

                justify-content:
                    space-between;

                margin-top: 9px;

                padding-top: 8px;

                border-top:
                    1px solid #edf0ee;

            }


            #adine-jalali-picker
            .ajp-footer button {

                border: 0;

                background: transparent;

                color: #173f35;

                font-family: inherit;

                font-size: 12px;

                padding: 6px 10px;

                cursor: pointer;

            }


            .jalali-input {

                cursor: pointer !important;

                background-color:
                    #fff !important;

            }

        `;

        document.head.appendChild(style);

    }


    /* =====================================================
       CREATE
    ===================================================== */

    function createPicker() {

        if (picker) {
            return;
        }

        picker =
            document.createElement("div");

        picker.id =
            "adine-jalali-picker";

        picker.innerHTML = `

            <div class="ajp-header">

                <button
                    type="button"
                    data-action="prev">
                    ‹
                </button>

                <div
                    class="ajp-title"
                    id="ajpTitle">
                </div>

                <button
                    type="button"
                    data-action="next">
                    ›
                </button>

            </div>


            <div class="ajp-week">

                ${weekdays
                    .map(
                        d =>
                            `<span>${d}</span>`
                    )
                    .join("")}

            </div>


            <div
                class="ajp-days"
                id="ajpDays">
            </div>


            <div class="ajp-footer">

                <button
                    type="button"
                    data-action="today">

                    امروز

                </button>

                <button
                    type="button"
                    data-action="close">

                    بستن

                </button>

            </div>

        `;

        document.body.appendChild(
            picker
        );


        picker.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
                    );

                if (!button) {
                    return;
                }

                const action =
                    button.dataset.action;


                if (
                    action === "prev"
                ) {

                    changeMonth(-1);

                    return;

                }


                if (
                    action === "next"
                ) {

                    changeMonth(1);

                    return;

                }


                if (
                    action === "today"
                ) {

                    const t =
                        toEnglish(
                            todayJalali()
                        )
                        .split("/")
                        .map(Number);

                    chooseDate(
                        t[0],
                        t[1],
                        t[2]
                    );

                    return;

                }


                if (
                    action === "close"
                ) {

                    closePicker();

                }

            }
        );

    }


    /* =====================================================
       OPEN
    ===================================================== */

    function openPicker(input) {

        if (!input) {
            return;
        }

        installStyles();

        createPicker();

        activeInput =
            input;


        const parsed =
            toEnglish(
                input.value || ""
            )
            .replace(/-/g, "/")
            .split("/")
            .map(Number);


        if (
            parsed.length === 3 &&
            parsed[0] >= 1200 &&
            parsed[1] >= 1 &&
            parsed[1] <= 12 &&
            parsed[2] >= 1
        ) {

            selectedYear =
                parsed[0];

            selectedMonth =
                parsed[1];

            selectedDay =
                parsed[2];

        } else {

            const t =
                toEnglish(
                    todayJalali()
                )
                .split("/")
                .map(Number);

            selectedYear =
                t[0];

            selectedMonth =
                t[1];

            selectedDay =
                t[2];

        }


        renderPicker();

        picker.classList.add(
            "show"
        );

        positionPicker();

    }


    /* =====================================================
       CLOSE
    ===================================================== */

    function closePicker() {

        if (!picker) {
            return;
        }

        picker.classList.remove(
            "show"
        );

        activeInput = null;

    }


    /* =====================================================
       POSITION
    ===================================================== */

    function positionPicker() {

        if (
            !picker ||
            !activeInput ||
            !picker.classList.contains(
                "show"
            )
        ) {

            return;

        }


        const rect =
            activeInput.getBoundingClientRect();


        const width =
            Math.min(
                292,
                window.innerWidth - 20
            );


        picker.style.width =
            width + "px";


        let left =
            rect.left +
            rect.width / 2 -
            width / 2;


        left =
            Math.max(
                10,
                Math.min(
                    left,
                    window.innerWidth -
                    width -
                    10
                )
            );


        let top =
            rect.bottom + 8;


        const height =
            picker.offsetHeight || 330;


        if (
            top + height >
            window.innerHeight - 10
        ) {

            top =
                rect.top -
                height -
                8;

        }


        if (top < 10) {
            top = 10;
        }


        picker.style.left =
            left + "px";

        picker.style.top =
            top + "px";

    }


    /* =====================================================
       CHANGE MONTH
    ===================================================== */

    function changeMonth(delta) {

        selectedMonth +=
            delta;


        if (
            selectedMonth > 12
        ) {

            selectedMonth = 1;

            selectedYear++;

        }


        if (
            selectedMonth < 1
        ) {

            selectedMonth = 12;

            selectedYear--;

        }


        const max =
            jalaliMonthDays(
                selectedYear,
                selectedMonth
            );


        if (
            selectedDay > max
        ) {

            selectedDay =
                max;

        }


        renderPicker();

        positionPicker();

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function renderPicker() {

        if (!picker) {
            return;
        }


        const title =
            document.getElementById(
                "ajpTitle"
            );


        title.textContent =
            toPersian(
                selectedYear
            ) +
            " " +
            months[
                selectedMonth - 1
            ];


        const days =
            document.getElementById(
                "ajpDays"
            );


        days.innerHTML =
            "";


        const first =
            jalaliToGregorian(
                selectedYear,
                selectedMonth,
                1
            );


        const firstDate =
            new Date(
                first.year,
                first.month - 1,
                first.day
            );


        /*
         * JavaScript:
         * Sunday = 0
         *
         * تقویم ما:
         * شنبه = 0
         */

        let offset =
            (
                firstDate.getDay() + 1
            ) % 7;


        for (
            let i = 0;
            i < offset;
            i++
        ) {

            const empty =
                document.createElement(
                    "span"
                );

            days.appendChild(
                empty
            );

        }


        const max =
            jalaliMonthDays(
                selectedYear,
                selectedMonth
            );


        for (
            let day = 1;
            day <= max;
            day++
        ) {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "ajp-day";


            if (
                selectedDay === day
            ) {

                button.classList.add(
                    "selected"
                );

            }


            button.textContent =
                toPersian(day);


            button.addEventListener(
                "click",
                function () {

                    chooseDate(
                        selectedYear,
                        selectedMonth,
                        day
                    );

                }
            );


            days.appendChild(
                button
            );

        }

    }


    /* =====================================================
       CHOOSE DATE
    ===================================================== */

    function chooseDate(
        year,
        month,
        day
    ) {

        if (!activeInput) {
            return;
        }


        activeInput.value =
            formatJalali(
                year,
                month,
                day
            );


        /*
         * برای eventهای فرم
         */

        activeInput.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        activeInput.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );


        closePicker();

    }


    /* =====================================================
       BIND INPUTS
    ===================================================== */

    function bindInputs() {

        installStyles();

        const inputs =
            document.querySelectorAll(
                ".jalali-input"
            );


        inputs.forEach(
            input => {

                if (
                    input.dataset
                        .jalaliBound ===
                    "true"
                ) {

                    return;

                }


                input.dataset
                    .jalaliBound =
                    "true";


                input.setAttribute(
                    "readonly",
                    "readonly"
                );


                input.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        openPicker(
                            this
                        );

                    }
                );


                input.addEventListener(
                    "focus",
                    function () {

                        openPicker(
                            this
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       CLOSE OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !picker ||
                !picker.classList.contains(
                    "show"
                )
            ) {

                return;

            }


            if (
                picker.contains(
                    event.target
                )
            ) {

                return;

            }


            if (
                activeInput &&
                event.target ===
                activeInput
            ) {

                return;

            }


            closePicker();

        }
    );


    window.addEventListener(
        "resize",
        positionPicker
    );


    window.addEventListener(
        "scroll",
        positionPicker,
        true
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.jalaliDate = {

        todayJalali,

        jalaliToISO,

        isoToJalali,

        jalaliToGregorian,

        gregorianToJalali,

        prepareDateFields:
            bindInputs

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        installStyles();

        bindInputs();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


})();
