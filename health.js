/* =========================================================
   ADINE POULTRY HEALTH CENTER
   JALALI DATE ENGINE
   نسخه پایدار برای بخش سلامت
   ========================================================= */

(function () {

    "use strict";

    /* -----------------------------------------------------
       تبدیل اعداد فارسی و عربی به انگلیسی
    ----------------------------------------------------- */

    function toEnglishDigits(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/[۰-۹]/g, function (d) {
                return String(
                    "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
                );
            })
            .replace(/[٠-٩]/g, function (d) {
                return String(
                    "٠١٢٣٤٥٦٧٨٩".indexOf(d)
                );
            });
    }


    /* -----------------------------------------------------
       تبدیل اعداد انگلیسی به فارسی
    ----------------------------------------------------- */

    function toPersianDigits(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/\d/g, function (d) {
                return "۰۱۲۳۴۵۶۷۸۹"[d];
            });
    }


    /* -----------------------------------------------------
       تبدیل تاریخ میلادی به جلالی
       الگوریتم مستقل و بدون وابستگی به کتابخانه
    ----------------------------------------------------- */

    function gregorianToJalali(gy, gm, gd) {

        const g_d_m = [
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
            (gm > 2)
                ? gy + 1
                : gy;

        let days =
            (365 * gy) +
            Math.floor(
                (gy2 + 3) / 4
            ) -
            Math.floor(
                (gy2 + 99) / 100
            ) +
            Math.floor(
                (gy2 + 399) / 400
            ) -
            80 +
            gd +
            g_d_m[gm - 1];

        jy +=
            33 *
            Math.floor(
                days / 12053
            );

        days %= 12053;

        jy +=
            4 *
            Math.floor(
                days / 1461
            );

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
                Math.floor(
                    days / 31
                );

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
            year: jy,
            month: jm,
            day: jd
        };
    }


    /* -----------------------------------------------------
       تبدیل جلالی به میلادی
    ----------------------------------------------------- */

    function jalaliToGregorian(jy, jm, jd) {

        jy =
            Number(jy);

        jm =
            Number(jm);

        jd =
            Number(jd);

        let gy;

        if (jy > 979) {

            gy = 1600;

            jy -= 979;

        } else {

            gy = 621;
        }

        let days =
            (365 * jy) +
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

        const sal_a = [
            0, 31,
            (
                (gy % 4 === 0 &&
                 gy % 100 !== 0) ||
                 gy % 400 === 0
            )
                ? 29
                : 28,
            31, 30, 31,
            30, 31, 31, 30,
            31, 30, 31
        ];

        let gm = 0;

        while (
            gm < 13 &&
            gd > sal_a[gm]
        ) {

            gd -=
                sal_a[gm];

            gm++;
        }

        return {
            year: gy,
            month: gm,
            day: gd
        };
    }


    /* -----------------------------------------------------
       JALALI → ISO
       خروجی: YYYY-MM-DD
    ----------------------------------------------------- */

    function jalaliToISO(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return null;
        }

        let raw =
            toEnglishDigits(
                String(value).trim()
            );

        if (!raw) {
            return null;
        }

        raw =
            raw.replace(
                /[-.]/g,
                "/"
            );

        const parts =
            raw.split("/");

        if (parts.length !== 3) {
            return null;
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

        return [
            String(g.year).padStart(4, "0"),
            String(g.month).padStart(2, "0"),
            String(g.day).padStart(2, "0")
        ].join("-");
    }


    /* -----------------------------------------------------
       ISO → JALALI
    ----------------------------------------------------- */

    function isoToJalali(value) {

        if (!value) {
            return "";
        }

        const raw =
            String(value)
                .substring(0, 10);

        const parts =
            raw.split("-");

        if (parts.length !== 3) {
            return raw;
        }

        const gy =
            Number(parts[0]);

        const gm =
            Number(parts[1]);

        const gd =
            Number(parts[2]);

        if (
            !gy ||
            !gm ||
            !gd
        ) {
            return raw;
        }

        const j =
            gregorianToJalali(
                gy,
                gm,
                gd
            );

        return [
            String(j.year),
            String(j.month).padStart(2, "0"),
            String(j.day).padStart(2, "0")
        ].join("/");
    }


    /* -----------------------------------------------------
       امروز به شمسی
    ----------------------------------------------------- */

    function todayJalali() {

        const now =
            new Date();

        const j =
            gregorianToJalali(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate()
            );

        return [
            String(j.year),
            String(j.month).padStart(2, "0"),
            String(j.day).padStart(2, "0")
        ].join("/");
    }


    /* -----------------------------------------------------
       اعتبارسنجی تاریخ
    ----------------------------------------------------- */

    function isValidJalaliDate(value) {

        return Boolean(
            jalaliToISO(value)
        );
    }


    /* -----------------------------------------------------
       اتصال تقویم بازشونده به فیلدها
       از Persian Datepicker موجود در HTML استفاده می‌کند
    ----------------------------------------------------- */

    function prepareDateFields() {

        if (
            typeof window.jQuery ===
            "undefined"
        ) {
            return;
        }

        if (
            typeof window.jQuery.fn.persianDatepicker !==
            "function"
        ) {
            return;
        }

        const $ =
            window.jQuery;

        const fields =
            document.querySelectorAll(
                ".jalali-input"
            );

        fields.forEach(
            function (field) {

                const $field =
                    $(field);

                /* جلوگیری از ساخت چند تقویم روی یک فیلد */

                try {
                    $field.persianDatepicker(
                        "destroy"
                    );
                } catch (e) {
                    /* مشکلی نیست */
                }

                $field.persianDatepicker({

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

                    navigator:
                        {
                            enabled:
                                true
                        },

                    toolbox:
                        {
                            enabled:
                                true,

                            calendarSwitch:
                                {
                                    enabled:
                                        false
                                },

                            todayButton:
                                {
                                    enabled:
                                        true,
                                    text:
                                        "امروز"
                                }
                        },

                    onSelect:
                        function (unix) {

                            if (!unix) {
                                return;
                            }

                            try {

                                const pd =
                                    new persianDate(
                                        unix
                                    );

                                const formatted =
                                    pd.format(
                                        "YYYY/MM/DD"
                                    );

                                field.value =
                                    toPersianDigits(
                                        formatted
                                    );

                            } catch (e) {

                                console.error(
                                    "Datepicker error:",
                                    e
                                );
                            }
                        }
                });

                /* کلیک روی کادر همیشه تقویم را باز کند */

                field.addEventListener(
                    "click",
                    function () {

                        try {

                            $field
                                .persianDatepicker(
                                    "show"
                                );

                        } catch (e) {
                            console.error(e);
                        }
                    }
                );

            }
        );
    }


    /* -----------------------------------------------------
       API عمومی
    ----------------------------------------------------- */

    window.jalaliDate = {

        toEnglishDigits:
            toEnglishDigits,

        toPersianDigits:
            toPersianDigits,

        jalaliToISO:
            jalaliToISO,

        isoToJalali:
            isoToJalali,

        todayJalali:
            todayJalali,

        isValidJalaliDate:
            isValidJalaliDate,

        prepareDateFields:
            prepareDateFields

    };


    /* -----------------------------------------------------
       وقتی کتابخانه‌ها آماده شدند
    ----------------------------------------------------- */

    function startDatepicker() {

        if (
            typeof window.jQuery ===
            "undefined"
        ) {
            setTimeout(
                startDatepicker,
                100
            );
            return;
        }

        if (
            typeof window.jQuery.fn.persianDatepicker !==
            "function"
        ) {
            setTimeout(
                startDatepicker,
                100
            );
            return;
        }

        prepareDateFields();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startDatepicker
        );

    } else {

        startDatepicker();
    }

})();
