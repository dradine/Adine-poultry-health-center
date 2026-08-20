/* =========================================================
   ADINE POULTRY HEALTH CENTER
   JALALI DATE ENGINE + MOBILE DATE PICKER
   بدون وابستگی به jQuery
========================================================= */

(function () {

    "use strict";

    const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
    const ARABIC_DIGITS  = "٠١٢٣٤٥٦٧٨٩";


    /* =====================================================
       DIGITS
    ===================================================== */

    function toEnglishDigits(value) {

        return String(value || "")
            .replace(/[۰-۹]/g, d =>
                String(PERSIAN_DIGITS.indexOf(d))
            )
            .replace(/[٠-٩]/g, d =>
                String(ARABIC_DIGITS.indexOf(d))
            );
    }


    function toPersianDigits(value) {

        return String(value || "")
            .replace(/\d/g, d =>
                PERSIAN_DIGITS[Number(d)]
            );
    }


    function pad(number) {

        return String(number).padStart(2, "0");

    }


    /* =====================================================
       GREGORIAN → JALALI
    ===================================================== */

    function gregorianToJalali(gy, gm, gd) {

        const g_d_m = [
            0,31,59,90,120,151,
            181,212,243,273,304,334
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
            Math.floor((gy2 + 3) / 4) -
            Math.floor((gy2 + 99) / 100) +
            Math.floor((gy2 + 399) / 400) -
            80 +
            gd +
            g_d_m[gm - 1];

        jy +=
            33 *
            Math.floor(days / 12053);

        days %= 12053;

        jy +=
            4 *
            Math.floor(days / 1461);

        days %= 1461;

        if (days > 365) {

            jy +=
                Math.floor(
                    (days - 1) / 365
                );

            days =
                (days - 1) % 365;
        }

        let jm;

        if (days < 186) {

            jm =
                1 +
                Math.floor(days / 31);

        } else {

            jm =
                7 +
                Math.floor(
                    (days - 186) / 30
                );
        }

        const jd =
            1 +
            (
                days < 186
                    ? days % 31
                    : (days - 186) % 30
            );

        return {
            jy,
            jm,
            jd
        };
    }


    /* =====================================================
       JALALI → GREGORIAN
    ===================================================== */

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
            Math.floor(
                ((jy % 33) + 3) / 4
            ) +
            78 +
            jd +
            (
                jm < 7
                    ? (jm - 1) * 31
                    : ((jm - 7) * 30) + 186
            );

        gy +=
            400 *
            Math.floor(days / 146097);

        days %= 146097;

        if (days > 36524) {

            gy +=
                100 *
                Math.floor(
                    --days / 36524
                );

            days %= 36524;

            if (days >= 365) {
                days++;
            }
        }

        gy +=
            4 *
            Math.floor(days / 1461);

        days %= 1461;

        if (days > 365) {

            gy +=
                Math.floor(
                    (days - 1) / 365
                );

            days =
                (days - 1) % 365;
        }

        let gd =
            days + 1;

        const sal_a = [
            0,
            31,
            (
                (gy % 4 === 0 &&
                 gy % 100 !== 0) ||
                 gy % 400 === 0
            )
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
            gd >
            sal_a[gm]
        ) {

            gd -= sal_a[gm];
            gm++;
        }

        return {
            gy,
            gm,
            gd
        };
    }


    /* =====================================================
       JALALI → ISO
    ===================================================== */

    function jalaliToISO(value) {

        if (!value) {
            return null;
        }

        const text =
            toEnglishDigits(value)
                .trim()
                .replace(/-/g, "/")
                .replace(/\./g, "/");

        const parts =
            text.split("/");

        if (parts.length !== 3) {
            return null;
        }

        const jy = Number(parts[0]);
        const jm = Number(parts[1]);
        const jd = Number(parts[2]);

        if (
            !Number.isInteger(jy) ||
            !Number.isInteger(jm) ||
            !Number.isInteger(jd)
        ) {
            return null;
        }

        if (
            jy < 1300 ||
            jy > 1500 ||
            jm < 1 ||
            jm > 12 ||
            jd < 1 ||
            jd > 31
        ) {
            return null;
        }

        const g =
            jalaliToGregorian(
                jy,
                jm,
                jd
            );

        return (
            String(g.gy).padStart(4, "0") +
            "-" +
            pad(g.gm) +
            "-" +
            pad(g.gd)
        );
    }


    /* =====================================================
       ISO → JALALI
    ===================================================== */

    function isoToJalali(value) {

        if (!value) {
            return "";
        }

        const text =
            String(value).substring(0, 10);

        const parts =
            text.split("-");

        if (parts.length !== 3) {
            return value;
        }

        const gy = Number(parts[0]);
        const gm = Number(parts[1]);
        const gd = Number(parts[2]);

        if (
            !gy ||
            !gm ||
            !gd
        ) {
            return value;
        }

        const j =
            gregorianToJalali(
                gy,
                gm,
                gd
            );

        return (
            toPersianDigits(j.jy) +
            "/" +
            toPersianDigits(
                pad(j.jm)
            ) +
            "/" +
            toPersianDigits(
                pad(j.jd)
            )
        );
    }


    /* =====================================================
       TODAY
    ===================================================== */

    function todayJalali() {

        const now =
            new Date();

        const j =
            gregorianToJalali(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate()
            );

        return (
            toPersianDigits(j.jy) +
            "/" +
            toPersianDigits(
                pad(j.jm)
            ) +
            "/" +
            toPersianDigits(
                pad(j.jd)
            )
        );
    }


    /* =====================================================
       VALIDATE
    ===================================================== */

    function isValidJalali(value) {

        if (!value) {
            return false;
        }

        const text =
            toEnglishDigits(value)
                .trim()
                .replace(/-/g, "/")
                .replace(/\./g, "/");

        const parts =
            text.split("/");

        if (parts.length !== 3) {
            return false;
        }

        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {
            return false;
        }

        if (
            year < 1300 ||
            year > 1500 ||
            month < 1 ||
            month > 12
        ) {
            return false;
        }

        return (
            day >= 1 &&
            day <=
            daysInMonth(
                year,
                month
            )
        );
    }


    /* =====================================================
       DAYS IN MONTH
    ===================================================== */

    function daysInMonth(year, month) {

        if (month <= 6) {
            return 31;
        }

        if (month <= 11) {
            return 30;
        }

        const next =
            jalaliToGregorian(
                year + 1,
                1,
                1
            );

        const current =
            jalaliToGregorian(
                year,
                1,
                1
            );

        const diff =
            Math.round(
                (
                    new Date(
                        next.gy,
                        next.gm - 1,
                        next.gd
                    ) -
                    new Date(
                        current.gy,
                        current.gm - 1,
                        current.gd
                    )
                ) /
                86400000
            );

        return diff === 366 ? 30 : 29;
    }


    /* =====================================================
       PICKER CSS
    ===================================================== */

    function injectPickerStyle() {

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

        .adine-jalali-picker {

            position:absolute;
            z-index:999999;

            width:280px;
            max-width:calc(100vw - 24px);

            box-sizing:border-box;

            background:#fff;

            border-radius:14px;

            padding:8px;

            box-shadow:
                0 10px 28px rgba(0,0,0,.18);

            border:1px solid #e2e8e5;

            font-family:inherit;

            direction:rtl;
        }

        .adine-jalali-header {

            display:flex;
            align-items:center;
            justify-content:space-between;

            margin-bottom:6px;
        }

        .adine-jalali-title {

            font-weight:700;
            color:#173f35;
            font-size:13px;
        }

        .adine-jalali-nav {

            border:0;
            background:#eef2f0;

            width:30px;
            height:30px;

            border-radius:8px;

            cursor:pointer;

            font-size:17px;

            padding:0;
        }

        .adine-jalali-week {

            display:grid;
            grid-template-columns:
                repeat(7,1fr);

            text-align:center;

            font-size:10px;
            color:#69736f;

            margin-bottom:2px;
        }

        .adine-jalali-days {

            display:grid;
            grid-template-columns:
                repeat(7,1fr);

            gap:1px;
        }

        .adine-jalali-day {

            height:32px;

            border:0;
            background:transparent;

            border-radius:8px;

            cursor:pointer;

            font-family:inherit;

            font-size:12px;

            padding:0;
        }

        .adine-jalali-day:hover {

            background:#eef2f0;
        }

        .adine-jalali-day.today {

            background:#173f35;
            color:#fff;
        }

        .adine-jalali-day.selected {

            outline:2px solid #173f35;
        }

        .adine-jalali-footer {

            display:flex;
            justify-content:center;

            margin-top:6px;
        }

        .adine-jalali-today {

            border:0;

            background:#173f35;
            color:#fff;

            padding:6px 13px;

            border-radius:8px;

            cursor:pointer;

            font-family:inherit;

            font-size:11px;
        }

        @media (max-width:480px) {

            .adine-jalali-picker {

                width:270px;
                max-width:calc(100vw - 16px);

                padding:7px;

                border-radius:13px;
            }

            .adine-jalali-day {

                height:30px;

                font-size:12px;
            }

            .adine-jalali-nav {

                width:29px;
                height:29px;
            }

        }

        `;

        document.head.appendChild(style);
    }


    /* =====================================================
       PICKER
    ===================================================== */

    let picker = null;

    let pickerYear = null;

    let pickerMonth = null;

    let activeInput = null;


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


    function createPicker() {

        if (picker) {
            return picker;
        }

        picker =
            document.createElement(
                "div"
            );

        picker.className =
            "adine-jalali-picker";

        picker.style.display =
            "none";

        document.body.appendChild(
            picker
        );

        return picker;
    }


    function positionPicker() {

        if (!activeInput || !picker) {
            return;
        }

        const rect =
            activeInput.getBoundingClientRect();

        const pickerWidth =
            Math.min(
                280,
                window.innerWidth - 16
            );

        let left =
            window.scrollX +
            rect.right -
            pickerWidth;

        const minLeft =
            window.scrollX + 8;

        const maxLeft =
            window.scrollX +
            window.innerWidth -
            pickerWidth -
            8;

        left =
            Math.max(
                minLeft,
                Math.min(
                    left,
                    maxLeft
                )
            );

        let top =
            window.scrollY +
            rect.bottom +
            5;

        const viewportBottom =
            window.scrollY +
            window.innerHeight;

        if (
            top + picker.offsetHeight >
            viewportBottom - 8
        ) {

            const above =
                window.scrollY +
                rect.top -
                picker.offsetHeight -
                5;

            if (above >= window.scrollY + 8) {
                top = above;
            }
        }

        picker.style.top =
            top + "px";

        picker.style.left =
            left + "px";
    }


    function renderPicker() {

        if (!picker) {
            return;
        }

        const days =
            daysInMonth(
                pickerYear,
                pickerMonth
            );

        const first =
            jalaliToGregorian(
                pickerYear,
                pickerMonth,
                1
            );

        const firstDate =
            new Date(
                first.gy,
                first.gm - 1,
                first.gd
            );

        const sundayIndex =
            firstDate.getDay();

        const offset =
            (sundayIndex + 1) % 7;

        const current =
            activeInput?.value
                ? toEnglishDigits(
                    activeInput.value
                )
                : "";

        const currentParts =
            current.split("/");

        const selectedDay =
            Number(currentParts[2]);

        const todayText =
            toEnglishDigits(
                todayJalali()
            );

        const todayParts =
            todayText.split("/");

        const todayYear =
            Number(todayParts[0]);

        const todayMonth =
            Number(todayParts[1]);

        const todayDay =
            Number(todayParts[2]);


        let html = `

        <div class="adine-jalali-header">

            <button
                type="button"
                class="adine-jalali-nav"
                data-prev>
                ‹
            </button>

            <div class="adine-jalali-title">

                ${monthNames[pickerMonth - 1]}
                ${toPersianDigits(pickerYear)}

            </div>

            <button
                type="button"
                class="adine-jalali-nav"
                data-next>
                ›
            </button>

        </div>

        <div class="adine-jalali-week">

            ${weekNames
                .map(day =>
                    `<span>${day}</span>`
                )
                .join("")}

        </div>

        <div class="adine-jalali-days">
        `;


        for (
            let i = 0;
            i < offset;
            i++
        ) {

            html +=
                `<span></span>`;
        }


        for (
            let day = 1;
            day <= days;
            day++
        ) {

            const isToday =
                pickerYear === todayYear &&
                pickerMonth === todayMonth &&
                day === todayDay;

            const isSelected =
                pickerYear ===
                    Number(currentParts[0]) &&
                pickerMonth ===
                    Number(currentParts[1]) &&
                day === selectedDay;

            html += `

                <button
                    type="button"
                    class="adine-jalali-day
                    ${isToday ? "today" : ""}
                    ${isSelected ? "selected" : ""}"
                    data-day="${day}">

                    ${toPersianDigits(day)}

                </button>
            `;
        }


        html += `

        </div>

        <div class="adine-jalali-footer">

            <button
                type="button"
                class="adine-jalali-today"
                data-today>

                امروز

            </button>

        </div>
        `;


        picker.innerHTML =
            html;


        picker
            .querySelector(
                "[data-prev]"
            )
            .onclick = function () {

                pickerMonth--;

                if (pickerMonth < 1) {

                    pickerMonth = 12;
                    pickerYear--;
                }

                renderPicker();
            };


        picker
            .querySelector(
                "[data-next]"
            )
            .onclick = function () {

                pickerMonth++;

                if (pickerMonth > 12) {

                    pickerMonth = 1;
                    pickerYear++;
                }

                renderPicker();
            };


        picker
            .querySelectorAll(
                "[data-day]"
            )
            .forEach(button => {

                button.onclick = function () {

                    const day =
                        Number(
                            this.dataset.day
                        );

                    if (!activeInput) {
                        return;
                    }

                    activeInput.value =
                        toPersianDigits(
                            pickerYear
                        ) +
                        "/" +
                        toPersianDigits(
                            pad(pickerMonth)
                        ) +
                        "/" +
                        toPersianDigits(
                            pad(day)
                        );

                    activeInput.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles:true
                            }
                        )
                    );

                    closePicker();
                };
            });


        picker
            .querySelector(
                "[data-today]"
            )
            .onclick = function () {

                if (!activeInput) {
                    return;
                }

                activeInput.value =
                    todayJalali();

                activeInput.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles:true
                        }
                    )
                );

                closePicker();
            };


        positionPicker();
    }


    function openPicker(input) {

        injectPickerStyle();

        createPicker();

        activeInput =
            input;

        let initial =
            toEnglishDigits(
                input.value
            );

        let parts =
            initial.split("/");

        if (
            parts.length === 3 &&
            Number(parts[0]) >= 1300
        ) {

            pickerYear =
                Number(parts[0]);

            pickerMonth =
                Number(parts[1]);

        } else {

            const today =
                toEnglishDigits(
                    todayJalali()
                )
                .split("/");

            pickerYear =
                Number(today[0]);

            pickerMonth =
                Number(today[1]);
        }

        picker.style.display =
            "block";

        renderPicker();

        requestAnimationFrame(
            positionPicker
        );
    }


    function closePicker() {

        if (picker) {

            picker.style.display =
                "none";
        }

        activeInput =
            null;
    }


    /* =====================================================
       PREPARE DATE FIELDS
    ===================================================== */

    function prepareDateFields() {

        document
            .querySelectorAll(
                ".jalali-input"
            )
            .forEach(input => {

                input.setAttribute(
                    "inputmode",
                    "numeric"
                );

                input.setAttribute(
                    "autocomplete",
                    "off"
                );

                input.setAttribute(
                    "placeholder",
                    "۱۴۰۵/۰۵/۲۹"
                );

                input.readOnly = true;

                input.style.cursor =
                    "pointer";

                input.onclick =
                    function (event) {

                        event.preventDefault();

                        openPicker(this);

                    };


                input.onfocus =
                    function () {

                        openPicker(this);

                    };


                /*
                 * عمداً ورودی دستی را غیرفعال نکردیم
                 * تا ساختار قبلی برنامه حفظ شود.
                 */

            });
    }


    /* =====================================================
       GLOBAL EVENTS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !picker ||
                picker.style.display === "none"
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".adine-jalali-picker"
                ) ||
                event.target.closest(
                    ".jalali-input"
                )
            ) {
                return;
            }

            closePicker();
        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                picker &&
                picker.style.display !== "none"
            ) {

                positionPicker();
            }

        }
    );


    window.addEventListener(
        "scroll",
        function () {

            if (
                picker &&
                picker.style.display !== "none"
            ) {

                positionPicker();
            }

        },
        true
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.jalaliDate = {

        jalaliToISO,
        isoToJalali,
        todayJalali,
        isValidJalali,
        prepareDateFields,
        toEnglishDigits

    };

})();
