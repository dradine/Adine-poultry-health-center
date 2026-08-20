/* =========================================================
   ADINE POULTRY HEALTH CENTER
   MOBILE JALALI DATEPICKER
   ========================================================= */

(function () {

    "use strict";

    const PD = "۰۱۲۳۴۵۶۷۸۹";

    function en(v) {
        return String(v ?? "")
            .replace(/[۰-۹]/g, d => PD.indexOf(d))
            .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
    }

    function fa(v) {
        return String(v ?? "")
            .replace(/\d/g, d => PD[d]);
    }

    /* =========================
       GREGORIAN -> JALALI
    ========================= */

    function gregorianToJalali(gy, gm, gd) {

        let jy;

        if (gy > 1600) {
            jy = 979;
            gy -= 1600;
        } else {
            jy = 0;
            gy -= 621;
        }

        const gdm = [
            0,31,59,90,120,151,
            181,212,243,273,304,334
        ];

        const gy2 = gm > 2 ? gy + 1 : gy;

        let days =
            365 * gy +
            Math.floor((gy2 + 3) / 4) -
            Math.floor((gy2 + 99) / 100) +
            Math.floor((gy2 + 399) / 400) -
            80 +
            gd +
            gdm[gm - 1];

        jy += 33 * Math.floor(days / 12053);
        days %= 12053;

        jy += 4 * Math.floor(days / 1461);
        days %= 1461;

        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }

        let jm, jd;

        if (days < 186) {
            jm = 1 + Math.floor(days / 31);
            jd = 1 + (days % 31);
        } else {
            jm = 7 + Math.floor((days - 186) / 30);
            jd = 1 + ((days - 186) % 30);
        }

        return {
            year: jy,
            month: jm,
            day: jd
        };
    }


    /* =========================
       JALALI -> GREGORIAN
    ========================= */

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
            Math.floor(jy / 33) * 8 +
            Math.floor(((jy % 33) + 3) / 4) +
            78 +
            jd +
            (
                jm < 7
                    ? (jm - 1) * 31
                    : ((jm - 7) * 30) + 186
            );

        gy += 400 * Math.floor(days / 146097);
        days %= 146097;

        if (days > 36524) {
            gy += 100 * Math.floor(--days / 36524);
            days %= 36524;

            if (days >= 365) {
                days++;
            }
        }

        gy += 4 * Math.floor(days / 1461);
        days %= 1461;

        if (days > 365) {
            gy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }

        let gd = days + 1;

        const leap =
            (
                gy % 4 === 0 &&
                (
                    gy % 100 !== 0 ||
                    gy % 400 === 0
                )
            );

        const months = [
            0,
            31,
            leap ? 29 : 28,
            31,30,31,30,
            31,31,30,31,30,31
        ];

        let gm = 1;

        while (
            gm <= 12 &&
            gd > months[gm]
        ) {
            gd -= months[gm];
            gm++;
        }

        return {
            year: gy,
            month: gm,
            day: gd
        };
    }


    /* =========================
       TODAY
    ========================= */

    function todayJalali() {

        const d = new Date();

        const j =
            gregorianToJalali(
                d.getFullYear(),
                d.getMonth() + 1,
                d.getDate()
            );

        return formatJalali(
            j.year,
            j.month,
            j.day
        );
    }


    function formatJalali(y, m, d) {

        return fa(
            String(y).padStart(4, "0") +
            "/" +
            String(m).padStart(2, "0") +
            "/" +
            String(d).padStart(2, "0")
        );
    }


    /* =========================
       JALALI -> ISO
    ========================= */

    function jalaliToISO(value) {

        if (!value) return null;

        const p =
            en(value)
                .trim()
                .replace(/-/g, "/")
                .split("/");

        if (p.length !== 3) {
            return null;
        }

        const y = Number(p[0]);
        const m = Number(p[1]);
        const d = Number(p[2]);

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

        const g =
            jalaliToGregorian(y, m, d);

        return (
            String(g.year).padStart(4, "0") +
            "-" +
            String(g.month).padStart(2, "0") +
            "-" +
            String(g.day).padStart(2, "0")
        );
    }


    /* =========================
       ISO -> JALALI
    ========================= */

    function isoToJalali(value) {

        if (!value) return "";

        const p =
            String(value)
                .substring(0, 10)
                .split("-");

        if (p.length !== 3) {
            return "";
        }

        const g =
            gregorianToJalali(
                Number(p[0]),
                Number(p[1]),
                Number(p[2])
            );

        return formatJalali(
            g.year,
            g.month,
            g.day
        );
    }


    /* =====================================================
       DATEPICKER
    ===================================================== */

    let activeInput = null;
    let picker = null;

    let selectedYear = 0;
    let selectedMonth = 0;
    let selectedDay = 0;


    const monthNames = [
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

    const weekNames = [
        "ش",
        "ی",
        "د",
        "س",
        "چ",
        "پ",
        "ج"
    ];


    function jalaliMonthDays(y, m) {

        if (m <= 6) return 31;

        if (m <= 11) return 30;

        /*
         * بررسی سال کبیسه از طریق تبدیل
         */
        const a =
            jalaliToGregorian(y, 12, 30);

        const b =
            jalaliToGregorian(y + 1, 1, 1);

        const dateA =
            new Date(
                a.year,
                a.month - 1,
                a.day
            );

        const dateB =
            new Date(
                b.year,
                b.month - 1,
                b.day
            );

        const diff =
            Math.round(
                (
                    dateB - dateA
                ) /
                86400000
            );

        return diff >= 2 ? 30 : 29;
    }


    function createPicker() {

        if (picker) return;

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
                ${weekNames
                    .map(x => `<span>${x}</span>`)
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

        document.body.appendChild(picker);

        picker.addEventListener(
            "click",
            function (e) {

                const btn =
                    e.target.closest("button");

                if (!btn) return;

                const action =
                    btn.dataset.action;

                if (action === "prev") {
                    changeMonth(-1);
                }

                if (action === "next") {
                    changeMonth(1);
                }

                if (action === "today") {

                    const t =
                        todayJalali()
                            .split("/")
                            .map(Number);

                    selectedYear = t[0];
                    selectedMonth = t[1];
                    selectedDay = t[2];

                    chooseDate(
                        selectedYear,
                        selectedMonth,
                        selectedDay
                    );
                }

                if (action === "close") {
                    closePicker();
                }
            }
        );

        document.addEventListener(
            "click",
            function (e) {

                if (
                    !picker.contains(e.target) &&
                    e.target !== activeInput
                ) {
                    closePicker();
                }
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
    }


    function openPicker(input) {

        createPicker();

        activeInput = input;

        let value =
            input.value;

        let p =
            value
                ? en(value)
                    .split("/")
                    .map(Number)
                : [];

        if (
            p.length === 3 &&
            p[0] >= 1200 &&
            p[1] >= 1 &&
            p[1] <= 12
        ) {

            selectedYear = p[0];
            selectedMonth = p[1];
            selectedDay = p[2];

        } else {

            const t =
                todayJalali()
                    .split("/")
                    .map(Number);

            selectedYear = t[0];
            selectedMonth = t[1];
            selectedDay = t[2];

        }

        renderPicker();

        picker.classList.add("show");

        positionPicker();
    }


    function closePicker() {

        if (!picker) return;

        picker.classList.remove("show");

        activeInput = null;
    }


    function positionPicker() {

        if (
            !picker ||
            !activeInput ||
            !picker.classList.contains("show")
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

        const pickerHeight =
            picker.offsetHeight || 350;

        if (
            top + pickerHeight >
            window.innerHeight
        ) {

            top =
                rect.top -
                pickerHeight -
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


    function changeMonth(delta) {

        selectedMonth += delta;

        if (selectedMonth > 12) {
            selectedMonth = 1;
            selectedYear++;
        }

        if (selectedMonth < 1) {
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
            selectedDay = max;
        }

        renderPicker();
        positionPicker();
    }


    function renderPicker() {

        if (!picker) return;

        document.getElementById(
            "ajpTitle"
        ).textContent =
            fa(selectedYear) +
            " " +
            monthNames[
                selectedMonth - 1
            ];


        const daysEl =
            document.getElementById(
                "ajpDays"
            );

        daysEl.innerHTML = "";


        /*
         * روز اول ماه شمسی را
         * به روز هفته تبدیل می‌کنیم
         */

        const g =
            jalaliToGregorian(
                selectedYear,
                selectedMonth,
                1
            );

        const date =
            new Date(
                g.year,
                g.month - 1,
                g.day
            );

        /*
         * JS:
         * Sunday=0
         * Saturday=6
         *
         * تقویم ما:
         * شنبه=0
         */

        const firstDay =
            (date.getDay() + 1) % 7;


        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("span");

            empty.className =
                "ajp-empty";

            daysEl.appendChild(empty);
        }


        const count =
            jalaliMonthDays(
                selectedYear,
                selectedMonth
            );


        for (
            let d = 1;
            d <= count;
            d++
        ) {

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "ajp-day";

            button.textContent =
                fa(d);

            if (
                d === selectedDay
            ) {

                button.classList.add(
                    "selected"
                );
            }

            button.addEventListener(
                "click",
                function () {

                    chooseDate(
                        selectedYear,
                        selectedMonth,
                        d
                    );

                }
            );

            daysEl.appendChild(button);
        }
    }


    function chooseDate(y, m, d) {

        if (!activeInput) return;

        activeInput.value =
            formatJalali(
                y,
                m,
                d
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
       INPUTS
    ===================================================== */

    function prepareDateFields() {

        const ids = [

            "vaccinationDate",
            "vaccinationExpiry",
            "antibodyDate",
            "labDate",
            "treatmentDate",
            "treatmentEnd"

        ];

        ids.forEach(id => {

            const input =
                document.getElementById(id);

            if (!input) return;

            input.type = "text";

            input.readOnly = true;

            input.inputMode = "none";

            input.autocomplete = "off";

            input.placeholder =
                "انتخاب تاریخ";


            if (
                !input.dataset.dateReady
            ) {

                input.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        openPicker(this);
                    }
                );

                input.addEventListener(
                    "focus",
                    function () {

                        openPicker(this);
                    }
                );

                input.dataset.dateReady =
                    "true";
            }
        });
    }


    /* =====================================================
       CSS
    ===================================================== */

    function injectCSS() {

        if (
            document.getElementById(
                "adine-jalali-picker-css"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "adine-jalali-picker-css";

        style.textContent = `

        #adine-jalali-picker {

            position: fixed;

            z-index: 999999;

            width: 292px;

            max-width:
                calc(100vw - 20px);

            background:
                #ffffff;

            border:
                1px solid #e1e7e4;

            border-radius:
                16px;

            box-shadow:
                0 12px 35px
                rgba(0,0,0,.20);

            padding:
                10px;

            direction:
                rtl;

            font-family:
                inherit;

            display:
                none;

            box-sizing:
                border-box;
        }


        #adine-jalali-picker.show {

            display:
                block;
        }


        .ajp-header {

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            margin-bottom:
                8px;
        }


        .ajp-header button {

            width:
                34px;

            height:
                34px;

            border:
                0;

            border-radius:
                9px;

            background:
                #eef3f1;

            color:
                #173f35;

            font-size:
                24px;

            line-height:
                1;

            cursor:
                pointer;
        }


        .ajp-title {

            font-size:
                14px;

            font-weight:
                700;

            color:
                #173f35;
        }


        .ajp-week {

            display:
                grid;

            grid-template-columns:
                repeat(7, 1fr);

            text-align:
                center;

            margin-bottom:
                3px;
        }


        .ajp-week span {

            font-size:
                11px;

            color:
                #7a8581;

            padding:
                3px 0;
        }


        .ajp-days {

            display:
                grid;

            grid-template-columns:
                repeat(7, 1fr);

            gap:
                3px;
        }


        .ajp-day,
        .ajp-empty {

            width:
                34px;

            height:
                34px;

            margin:
                auto;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border:
                0;

            border-radius:
                50%;

            background:
                transparent;

            font-family:
                inherit;

            font-size:
                12px;

            cursor:
                pointer;
        }


        .ajp-day:hover {

            background:
                #e8efec;
        }


        .ajp-day.selected {

            background:
                #173f35;

            color:
                #ffffff;

            font-weight:
                700;
        }


        .ajp-footer {

            display:
                flex;

            justify-content:
                space-between;

            margin-top:
                8px;

            border-top:
                1px solid #edf0ef;

            padding-top:
                8px;
        }


        .ajp-footer button {

            border:
                0;

            background:
                transparent;

            color:
                #173f35;

            font-family:
                inherit;

            font-size:
                12px;

            padding:
                5px 10px;

            cursor:
                pointer;
        }


        .jalali-input {

            cursor:
                pointer !important;

            background-color:
                #fff !important;

            min-height:
                44px !important;

            direction:
                rtl !important;

            text-align:
                right !important;
        }


        @media (max-width:480px) {

            #adine-jalali-picker {

                width:
                    285px;

                padding:
                    8px;

                border-radius:
                    14px;
            }

            .ajp-day,
            .ajp-empty {

                width:
                    32px;

                height:
                    32px;

                font-size:
                    12px;
            }

        }

        `;

        document.head.appendChild(style);
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.jalaliDate = {

        todayJalali,

        jalaliToISO,

        isoToJalali,

        gregorianToJalali,

        jalaliToGregorian,

        prepareDateFields,

        isValidJalali

    };


    function init() {

        injectCSS();

        prepareDateFields();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
