/* =========================================================
   ADINE POULTRY HEALTH CENTER
   JALALI DATE ENGINE
   فقط موتور تاریخ شمسی
   ========================================================= */

(function () {

    "use strict";

    const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
    const ARABIC_DIGITS  = "٠١٢٣٤٥٦٧٨٩";

    function toEnglishDigits(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/[۰-۹]/g, d =>
                String(PERSIAN_DIGITS.indexOf(d))
            )
            .replace(/[٠-٩]/g, d =>
                String(ARABIC_DIGITS.indexOf(d))
            );
    }


    function toPersianDigits(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value).replace(/\d/g, d =>
            PERSIAN_DIGITS[Number(d)]
        );
    }


    /* =====================================================
       Gregorian → Jalali
    ===================================================== */

    function gregorianToJalali(gy, gm, gd) {

        const gdm = [
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
            gdm[gm - 1];

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
        let jd;

        if (days < 186) {

            jm =
                1 +
                Math.floor(days / 31);

            jd =
                1 +
                (days % 31);

        } else {

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
            year: jy,
            month: jm,
            day: jd
        };
    }


    /* =====================================================
       Jalali → Gregorian
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
                gy % 4 === 0 &&
                (
                    gy % 100 !== 0 ||
                    gy % 400 === 0
                )
            )
                ? 29
                : 28,
            31,30,31,30,
            31,31,30,31,30,31
        ];

        let gm = 1;

        while (
            gm <= 12 &&
            gd > sal_a[gm]
        ) {

            gd -= sal_a[gm];
            gm++;
        }

        return {
            year: gy,
            month: gm,
            day: gd
        };
    }


    /* =====================================================
       امروز شمسی
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

        return toPersianDigits(
            String(j.year).padStart(4, "0") +
            "/" +
            String(j.month).padStart(2, "0") +
            "/" +
            String(j.day).padStart(2, "0")
        );
    }


    /* =====================================================
       Jalali → ISO
       خروجی برای Supabase
       YYYY-MM-DD
    ===================================================== */

    function jalaliToISO(value) {

        if (!value) {
            return null;
        }

        let text =
            toEnglishDigits(value)
                .trim()
                .replace(/-/g, "/")
                .replace(/\./g, "/");

        const parts =
            text.split("/");

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
            jy < 1200 ||
            jy > 1600 ||
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
            String(g.year).padStart(4, "0") +
            "-" +
            String(g.month).padStart(2, "0") +
            "-" +
            String(g.day).padStart(2, "0")
        );
    }


    /* =====================================================
       ISO → Jalali
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
            return "";
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
            return "";
        }

        const j =
            gregorianToJalali(
                gy,
                gm,
                gd
            );

        return toPersianDigits(
            String(j.year).padStart(4, "0") +
            "/" +
            String(j.month).padStart(2, "0") +
            "/" +
            String(j.day).padStart(2, "0")
        );
    }


    /* =====================================================
       اعتبارسنجی
    ===================================================== */

    function isValidJalali(value) {

        return jalaliToISO(value) !== null;
    }


    /* =====================================================
       آماده‌سازی فیلدهای تاریخ
       بدون وابستگی به jQuery یا Persian Datepicker
    ===================================================== */

    function prepareDateFields() {

        const fields = [
            "vaccinationDate",
            "vaccinationExpiry",
            "antibodyDate",
            "labDate",
            "treatmentDate",
            "treatmentEnd"
        ];

        fields.forEach(id => {

            const input =
                document.getElementById(id);

            if (!input) {
                return;
            }

            input.setAttribute(
                "autocomplete",
                "off"
            );

            input.setAttribute(
                "inputmode",
                "numeric"
            );

            input.placeholder =
                "۱۴۰۵/۰۵/۲۹";

            /*
             * جلوگیری از ثبت HTML5
             * به صورت تاریخ میلادی
             */

            input.type = "text";


            /*
             * اگر قبلاً مقدار میلادی
             * داخل فیلد باشد تبدیل می‌کنیم
             */

            if (
                input.value &&
                /^\d{4}-\d{2}-\d{2}$/.test(
                    toEnglishDigits(input.value)
                )
            ) {

                input.value =
                    isoToJalali(
                        input.value
                    );
            }


            /*
             * جلوگیری از ورود کاراکتر غیرعددی
             * ولی / را آزاد می‌گذاریم
             */

            if (
                !input.dataset.jalaliBound
            ) {

                input.addEventListener(
                    "input",
                    function () {

                        let v =
                            toEnglishDigits(
                                this.value
                            );

                        v =
                            v.replace(
                                /[^0-9/]/g,
                                ""
                            );

                        /*
                         * حداکثر 10 کاراکتر
                         * YYYY/MM/DD
                         */

                        v =
                            v.substring(
                                0,
                                10
                            );

                        this.value =
                            toPersianDigits(v);
                    }
                );


                /*
                 * کلیک روی تاریخ:
                 * اگر خالی باشد تاریخ امروز
                 * را پیشنهاد می‌دهد.
                 */

                input.addEventListener(
                    "focus",
                    function () {

                        if (
                            !this.value
                        ) {

                            this.value =
                                todayJalali();
                        }
                    }
                );


                input.dataset.jalaliBound =
                    "true";
            }
        });
    }


    /* =====================================================
       اتصال به برنامه
    ===================================================== */

    window.jalaliDate = {

        todayJalali,

        jalaliToISO,

        isoToJalali,

        gregorianToJalali,

        jalaliToGregorian,

        isValidJalali,

        prepareDateFields,

        toPersianDigits,

        toEnglishDigits
    };


    /*
     * اجرای اولیه
     */

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
