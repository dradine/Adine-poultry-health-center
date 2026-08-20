/* =========================================================
   ADINE POULTRY HEALTH CENTER
   INTERNAL JALALI DATE PICKER
   بدون jQuery / بدون Persian Datepicker
========================================================= */

(function(){

"use strict";

const DATE_IDS = [
    "vaccinationDate",
    "vaccinationExpiry",
    "antibodyDate",
    "labDate",
    "treatmentDate",
    "treatmentEnd"
];

const MONTHS = [
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

const WEEKDAYS = [
    "ش",
    "ی",
    "د",
    "س",
    "چ",
    "پ",
    "ج"
];

let activeInput = null;
let calendar = null;
let viewYear = null;
let viewMonth = null;

function pad(n){
    return String(n).padStart(2,"0");
}

function toEnglishDigits(value){

    return String(value || "")
        .replace(/[۰-۹]/g,function(d){
            return String(
                "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
            );
        })
        .replace(/[٠-٩]/g,function(d){
            return String(
                "٠١٢٣٤٥٦٧٨٩".indexOf(d)
            );
        });
}

/* =========================
   Gregorian -> Jalali
========================= */

function gregorianToJalali(gy,gm,gd){

    const gdm = [
        0,31,59,90,120,151,
        181,212,243,273,304,334
    ];

    let jy;

    if(gy > 1600){
        jy = 979;
        gy -= 1600;
    }else{
        jy = 0;
        gy -= 621;
    }

    const gy2 =
        gm > 2 ? gy + 1 : gy;

    let days =
        365 * gy +
        Math.floor((gy2 + 3) / 4) -
        Math.floor((gy2 + 99) / 100) +
        Math.floor((gy2 + 399) / 400) -
        80 +
        gd +
        gdm[gm - 1];

    jy +=
        33 * Math.floor(days / 12053);

    days %= 12053;

    jy +=
        4 * Math.floor(days / 1461);

    days %= 1461;

    if(days > 365){

        jy +=
            Math.floor((days - 1) / 365);

        days =
            (days - 1) % 365;
    }

    let jm;
    let jd;

    if(days < 186){

        jm =
            1 + Math.floor(days / 31);

        jd =
            1 + (days % 31);

    }else{

        jm =
            7 +
            Math.floor(
                (days - 186) / 30
            );

        jd =
            1 +
            ((days - 186) % 30);
    }

    return {
        jy,
        jm,
        jd
    };
}

/* =========================
   Jalali -> Gregorian
========================= */

function jalaliToGregorian(jy,jm,jd){

    jy = Number(jy);
    jm = Number(jm);
    jd = Number(jd);

    let gy;

    if(jy > 979){

        gy = 1600;
        jy -= 979;

    }else{

        gy = 621;
    }

    let days =
        365 * jy +
        Math.floor(jy / 33) * 8 +
        Math.floor(
            ((jy % 33) + 3) / 4
        );

    if(jm < 7){

        days +=
            (jm - 1) * 31;

    }else{

        days +=
            (jm - 7) * 30 +
            186;
    }

    days += jd - 1;

    gy +=
        400 *
        Math.floor(
            days / 146097
        );

    days %= 146097;

    if(days > 36524){

        gy +=
            100 *
            Math.floor(
                --days / 36524
            );

        days %= 36524;

        if(days >= 365){
            days++;
        }
    }

    gy +=
        4 *
        Math.floor(
            days / 1461
        );

    days %= 1461;

    if(days > 365){

        gy +=
            Math.floor(
                (days - 1) / 365
            );

        days =
            (days - 1) % 365;
    }

    let gd = days + 1;

    const monthDays = [
        31,28,31,30,31,30,
        31,31,30,31,30,31
    ];

    const leap =
        (
            gy % 4 === 0 &&
            gy % 100 !== 0
        ) ||
        gy % 400 === 0;

    if(leap){
        monthDays[1] = 29;
    }

    let gm = 1;

    while(
        gd >
        monthDays[gm - 1]
    ){

        gd -=
            monthDays[gm - 1];

        gm++;
    }

    return {
        gy,
        gm,
        gd
    };
}

/* =========================
   ISO -> Jalali
========================= */

function isoToJalali(iso){

    if(!iso){
        return "";
    }

    const parts =
        String(iso)
            .substring(0,10)
            .split("-");

    if(parts.length !== 3){
        return "";
    }

    const gy = Number(parts[0]);
    const gm = Number(parts[1]);
    const gd = Number(parts[2]);

    if(!gy || !gm || !gd){
        return "";
    }

    const j =
        gregorianToJalali(
            gy,
            gm,
            gd
        );

    return (
        j.jy +
        "/" +
        pad(j.jm) +
        "/" +
        pad(j.jd)
    );
}

/* =========================
   Jalali -> ISO
========================= */

function jalaliToISO(value){

    if(!value){
        return null;
    }

    let normalized =
        toEnglishDigits(value)
            .trim()
            .replaceAll("-","/")
            .replaceAll(".","/");

    const parts =
        normalized.split("/");

    if(parts.length !== 3){
        return null;
    }

    const jy = Number(parts[0]);
    const jm = Number(parts[1]);
    const jd = Number(parts[2]);

    if(
        !jy ||
        jm < 1 ||
        jm > 12 ||
        jd < 1
    ){
        return null;
    }

    const maxDay =
        jm <= 6
            ? 31
            : jm <= 11
                ? 30
                : 30;

    if(jd > maxDay){
        return null;
    }

    const g =
        jalaliToGregorian(
            jy,
            jm,
            jd
        );

    return (
        g.gy +
        "-" +
        pad(g.gm) +
        "-" +
        pad(g.gd)
    );
}

/* =========================
   امروز
========================= */

function todayJalali(){

    const now =
        new Date();

    return isoToJalali(
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate())
    );
}

/* =========================
   ساخت تقویم
========================= */

function createCalendar(){

    if(calendar){
        return calendar;
    }

    calendar =
        document.createElement("div");

    calendar.className =
        "adine-calendar";

    calendar.innerHTML = `

        <div class="adine-calendar-head">

            <button
                type="button"
                class="adine-cal-btn"
                id="adineCalPrev">
                ‹
            </button>

            <div
                class="adine-calendar-title"
                id="adineCalTitle">
            </div>

            <button
                type="button"
                class="adine-cal-btn"
                id="adineCalNext">
                ›
            </button>

        </div>

        <div class="adine-calendar-week">

            ${WEEKDAYS
                .map(d => `<div>${d}</div>`)
                .join("")}

        </div>

        <div
            class="adine-calendar-days"
            id="adineCalDays">
        </div>

        <div class="adine-calendar-footer">

            <button
                type="button"
                class="adine-today-btn"
                id="adineCalToday">
                امروز
            </button>

        </div>
    `;

    document.body.appendChild(calendar);

    document
        .getElementById("adineCalPrev")
        .addEventListener(
            "click",
            function(e){
                e.stopPropagation();

                viewMonth--;

                if(viewMonth < 1){
                    viewMonth = 12;
                    viewYear--;
                }

                renderCalendar();
            }
        );

    document
        .getElementById("adineCalNext")
        .addEventListener(
            "click",
            function(e){
                e.stopPropagation();

                viewMonth++;

                if(viewMonth > 12){
                    viewMonth = 1;
                    viewYear++;
                }

                renderCalendar();
            }
        );

    document
        .getElementById("adineCalToday")
        .addEventListener(
            "click",
            function(){

                const today =
                    todayJalali();

                if(activeInput){
                    activeInput.value =
                        today;
                }

                closeCalendar();
            }
        );

    return calendar;
}

/* =========================
   تعداد روز ماه
========================= */

function daysInJalaliMonth(year,month){

    if(month <= 6){
        return 31;
    }

    if(month <= 11){
        return 30;
    }

    /*
     * تشخیص اسفند
     */
    const g =
        jalaliToGregorian(
            year,
            12,
            30
        );

    const back =
        gregorianToJalali(
            g.gy,
            g.gm,
            g.gd
        );

    return (
        back.jy === year &&
        back.jm === 12 &&
        back.jd === 30
    )
    ? 30
    : 29;
}

/* =========================
   روز شروع هفته
========================= */

function firstDayOffset(year,month){

    const g =
        jalaliToGregorian(
            year,
            month,
            1
        );

    const date =
        new Date(
            g.gy,
            g.gm - 1,
            g.gd
        );

    /*
     * JS:
     * Sunday = 0
     *
     * تقویم شمسی:
     * Saturday = 0
     */

    return (
        date.getDay() + 1
    ) % 7;
}

/* =========================
   رندر
========================= */

function renderCalendar(){

    if(!calendar){
        return;
    }

    document
        .getElementById("adineCalTitle")
        .textContent =
            MONTHS[viewMonth - 1] +
            " " +
            viewYear;

    const container =
        document.getElementById(
            "adineCalDays"
        );

    container.innerHTML = "";

    const offset =
        firstDayOffset(
            viewYear,
            viewMonth
        );

    const total =
        daysInJalaliMonth(
            viewYear,
            viewMonth
        );

    for(
        let i = 0;
        i < offset;
        i++
    ){

        const empty =
            document.createElement("div");

        empty.className =
            "adine-day empty";

        container.appendChild(
            empty
        );
    }

    const today =
        todayJalali()
            .split("/");

    for(
        let day = 1;
        day <= total;
        day++
    ){

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "adine-day";

        button.textContent =
            day;

        if(
            Number(today[0]) === viewYear &&
            Number(today[1]) === viewMonth &&
            Number(today[2]) === day
        ){

            button.classList.add(
                "today"
            );
        }

        if(activeInput){

            const current =
                toEnglishDigits(
                    activeInput.value
                )
                .split("/");

            if(
                current.length === 3 &&
                Number(current[0]) === viewYear &&
                Number(current[1]) === viewMonth &&
                Number(current[2]) === day
            ){

                button.classList.add(
                    "selected"
                );
            }
        }

        button.addEventListener(
            "click",
            function(){

                if(activeInput){

                    activeInput.value =
                        viewYear +
                        "/" +
                        pad(viewMonth) +
                        "/" +
                        pad(day);
                }

                closeCalendar();
            }
        );

        container.appendChild(
            button
        );
    }
}

/* =========================
   باز کردن
========================= */

function openCalendar(input){

    activeInput =
        input;

    createCalendar();

    let initial =
        toEnglishDigits(
            input.value
        );

    const parts =
        initial.split("/");

    if(
        parts.length === 3 &&
        Number(parts[0]) &&
        Number(parts[1])
    ){

        viewYear =
            Number(parts[0]);

        viewMonth =
            Number(parts[1]);

    }else{

        const today =
            todayJalali()
                .split("/");

        viewYear =
            Number(today[0]);

        viewMonth =
            Number(today[1]);
    }

    renderCalendar();

    calendar.classList.add(
        "open"
    );

    positionCalendar(input);
}

/* =========================
   جایگذاری مناسب
========================= */

function positionCalendar(input){

    if(!calendar){
        return;
    }

    const rect =
        input.getBoundingClientRect();

    const width =
        Math.min(
            282,
            window.innerWidth - 20
        );

    let left =
        rect.right - width;

    if(left < 10){
        left = 10;
    }

    if(
        left + width >
        window.innerWidth - 10
    ){

        left =
            window.innerWidth -
            width -
            10;
    }

    let top =
        rect.bottom + 7;

    const calendarHeight =
        310;

    if(
        top + calendarHeight >
        window.innerHeight
    ){

        top =
            rect.top -
            calendarHeight -
            7;

        if(top < 10){
            top = 10;
        }
    }

    calendar.style.left =
        left + "px";

    calendar.style.top =
        top + "px";
}

/* =========================
   بستن
========================= */

function closeCalendar(){

    if(calendar){
        calendar.classList.remove(
            "open"
        );
    }

    activeInput =
        null;
}

/* =========================
   آماده‌سازی فیلدها
========================= */

function prepareDateFields(){

    DATE_IDS.forEach(
        function(id){

            const input =
                document.getElementById(id);

            if(!input){
                return;
            }

            input.type =
                "text";

            input.readOnly =
                true;

            input.autocomplete =
                "off";

            input.classList.add(
                "jalali-input"
            );

            input.onclick =
                function(e){

                    e.stopPropagation();

                    openCalendar(
                        input
                    );
                };
        }
    );
}

/* =========================
   کلیک بیرون
========================= */

document.addEventListener(
    "click",
    function(e){

        if(
            calendar &&
            calendar.classList.contains("open") &&
            !calendar.contains(e.target) &&
            !e.target.classList.contains("jalali-input")
        ){

            closeCalendar();
        }
    }
);

window.addEventListener(
    "resize",
    function(){

        if(
            calendar &&
            calendar.classList.contains("open") &&
            activeInput
        ){

            positionCalendar(
                activeInput
            );
        }
    }
);

window.addEventListener(
    "scroll",
    function(){

        if(
            calendar &&
            calendar.classList.contains("open") &&
            activeInput
        ){

            positionCalendar(
                activeInput
            );
        }
    },
    true
);

/* =========================
   خروجی
========================= */

window.jalaliDate = {

    isoToJalali,
    jalaliToISO,
    todayJalali,
    prepareDateFields,
    initDatePickers:
        prepareDateFields

};

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        prepareDateFields
    );

}else{

    prepareDateFields();
}

})();
