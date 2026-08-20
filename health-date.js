/* =========================================================
   ADINE POULTRY HEALTH CENTER
   JALALI DATE PICKER
   ========================================================= */

(function () {

    "use strict";


    const DATE_IDS = [
        "vaccinationDate",
        "vaccinationExpiry",
        "antibodyDate",
        "labDate",
        "treatmentDate",
        "treatmentEnd"
    ];


    function pad(n) {
        return String(n).padStart(2, "0");
    }


    /* =====================================================
       GREGORIAN -> JALALI
    ===================================================== */

    function gregorianToJalali(gy, gm, gd) {

        const gdm = [
            0, 31, 59, 90, 120, 151,
            181, 212, 243, 273, 304, 334
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
            gdm[gm - 1];

        jy +=
            33 * Math.floor(days / 12053);

        days %= 12053;

        jy +=
            4 * Math.floor(days / 1461);

        days %= 1461;

        if (days > 365) {

            jy +=
                Math.floor((days - 1) / 365);

            days =
                (days - 1) % 365;
        }

        let jm;

        if (days < 186) {

            jm =
                1 + Math.floor(days / 31);

        } else {

            jm =
                7 +
                Math.floor(
                    (days - 186) / 30
                );
        }

        let jd;

        if (days < 186) {

            jd =
                1 + (days % 31);

        } else {

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


    /* =====================================================
       JALALI -> GREGORIAN
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
            );

        if (jm < 7) {

            days +=
                (jm - 1) * 31;

        } else {

            days +=
                (jm - 7) * 30 +
                186;
        }

        days +=
            jd - 1;

        gy +=
            400 *
            Math.floor(
                days / 146097
            );

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
            Math.floor(
                days / 1461
            );

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

        const monthDays = [
            31, 28, 31, 30, 31, 30,
            31, 31, 30, 31, 30, 31
        ];

        const leap =
            (
                gy % 4 === 0 &&
                gy % 100 !== 0
            ) ||
            gy % 400 === 0;

        if (leap) {
            monthDays[1] = 29;
        }

        let gm = 1;

        while (
            gd >
            monthDays[gm - 1]
        ) {

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


    /* =====================================================
       ISO -> JALALI
    ===================================================== */

    function isoToJalali(iso) {

        if (!iso) return "";

        const parts =
            String(iso)
                .substring(0, 10)
                .split("-");

        if (parts.length !== 3) {
            return "";
        }

        const gy = Number(parts[0]);
        const gm = Number(parts[1]);
        const gd = Number(parts[2]);

        if (!gy || !gm || !gd) {
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


    /* =====================================================
       JALALI -> ISO
    ===================================================== */

    function jalaliToISO(value) {

        if (!value) return null;

        let normalized =
            String(value)
                .trim()
                .replaceAll("-", "/")
                .replaceAll(".", "/");

        normalized =
            normalized.replace(
                /[۰-۹]/g,
                d =>
                    String(
                        "۰۱۲۳۴۵۶۷۸۹"
                            .indexOf(d)
                    )
            );

        const parts =
            normalized.split("/");

        if (parts.length !== 3) {
            return null;
        }

        const jy = Number(parts[0]);
        const jm = Number(parts[1]);
        const jd = Number(parts[2]);

        if (
            !jy ||
            !jm ||
            !jd ||
            jm < 1 ||
            jm > 12 ||
            jd < 1
        ) {
            return null;
        }

        if (
            jm <= 6 &&
            jd > 31
        ) {
            return null;
        }

        if (
            jm >= 7 &&
            jd > 30
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
            g.gy +
            "-" +
            pad(g.gm) +
            "-" +
            pad(g.gd)
        );
    }


    /* =====================================================
       TODAY
    ===================================================== */

    function todayJalali() {

        const now =
            new Date();

        const iso =
            now.getFullYear() +
            "-" +
            pad(
                now.getMonth() + 1
            ) +
            "-" +
            pad(
                now.getDate()
            );

        return isoToJalali(iso);
    }


    /* =====================================================
       INIT PERSIAN DATEPICKER
    ===================================================== */

    function initDatePickers() {

        if (
            typeof jQuery === "undefined"
        ) {
            console.error(
                "jQuery not loaded"
            );
            return;
        }


        if (
            typeof jQuery.fn.persianDatepicker !==
            "function"
        ) {
            console.error(
                "Persian datepicker not loaded"
            );
            return;
        }


        DATE_IDS.forEach(id => {

            const input =
                document.getElementById(id);

            if (!input) {
                return;
            }


            input.type = "text";

            input.readOnly = true;

            input.inputMode =
                "none";

            input.autocomplete =
                "off";

            input.dir =
                "ltr";

            input.classList.add(
                "jalali-input"
            );


            jQuery(input)
                .persianDatepicker({

                    format:
                        "YYYY/MM/DD",

                    autoClose:
                        true,

                    initialValue:
                        false,

                    observer:
                        true,

                    calendarType:
                        "persian",

                    toolbox: {

                        calendarSwitch:
                            false

                    },

                    onSelect:
                        function (unix) {

                            if (!unix) {
                                return;
                            }

                            const date =
                                new persianDate(
                                    unix
                                );

                            input.value =
                                date.format(
                                    "YYYY/MM/DD"
                                );
                        }
                });


            /*
             * اگر کاربر روی کادر کلیک کرد
             * تقویم باز شود.
             */

            input.addEventListener(
                "click",
                function () {

                    try {

                        jQuery(input)
                            .persianDatepicker(
                                "show"
                            );

                    } catch (e) {

                        console.warn(e);
                    }
                }
            );

        });
    }


    /* =====================================================
       PREPARE
    ===================================================== */

    function prepareDateFields() {

        DATE_IDS.forEach(id => {

            const input =
                document.getElementById(id);

            if (!input) {
                return;
            }

            input.type =
                "text";

            input.readOnly =
                true;

            input.placeholder =
                "انتخاب تاریخ";

            input.autocomplete =
                "off";

            input.dir =
                "ltr";

            input.classList.add(
                "jalali-input"
            );
        });


        /*
         * کمی تأخیر برای اینکه
         * کتابخانه‌ها کاملاً لود شوند.
         */

        setTimeout(
            initDatePickers,
            100
        );
    }


    /* =====================================================
       EXPORT
    ===================================================== */

    window.jalaliDate = {

        isoToJalali,

        jalaliToISO,

        todayJalali,

        prepareDateFields,

        initDatePickers

    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            prepareDateFields
        );

    } else {

        prepareDateFields();

    }

})();
