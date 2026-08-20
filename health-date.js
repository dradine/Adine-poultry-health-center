/* =========================================================
   ADINE POULTRY HEALTH CENTER
   Persian / Jalali Date Adapter
   Display: Jalali
   Database: Gregorian ISO
   ========================================================= */

(function () {

    "use strict";


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


    const DATE_IDS = [

        "vaccinationDate",
        "vaccinationExpiry",

        "antibodyDate",

        "labDate",

        "treatmentDate",
        "treatmentEnd"

    ];


    /* =====================================================
       GREGORIAN → JALALI
    ===================================================== */

    function gregorianToJalali(gy, gm, gd) {

        let g_d_m = [
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

        let gy2 =
            gm > 2
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


        let jd;

        if (days < 186) {

            jd =
                1 +
                (days % 31);

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
       JALALI → GREGORIAN
    ===================================================== */

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
            Math.floor(
                jy / 33
            ) * 8 +
            Math.floor(
                ((jy % 33) + 3) / 4
            );


        if (jm < 7) {

            days +=
                (jm - 1) * 31;

        } else {

            days +=
                ((jm - 7) * 30) +
                186;

        }


        days +=
            jd - 1;


        gy +=
            400 *
            Math.floor(
                days / 146097
            );

        days %=
            146097;


        if (days > 36524) {

            gy +=
                100 *
                Math.floor(
                    --days / 36524
                );

            days %=
                36524;


            if (days >= 365) {

                days++;

            }

        }


        gy +=
            4 *
            Math.floor(
                days / 1461
            );

        days %=
            1461;


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
            (
                gy % 400 === 0
            );


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
       PAD
    ===================================================== */

    function pad(number) {

        return String(number)
            .padStart(2, "0");

    }



    /* =====================================================
       ISO → JALALI DISPLAY
    ===================================================== */

    function isoToJalali(iso) {

        if (!iso) {

            return "";

        }


        const parts =
            String(iso)
                .split("-");


        if (
            parts.length !== 3
        ) {

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


        return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;

    }



    /* =====================================================
       JALALI DISPLAY → ISO
    ===================================================== */

    function jalaliToISO(value) {

        if (!value) {

            return null;

        }


        const normalized =
            String(value)
                .trim()
                .replaceAll(
                    "-",
                    "/"
                )
                .replaceAll(
                    ".",
                    "/"
                );


        const parts =
            normalized
                .split("/");


        if (
            parts.length !== 3
        ) {

            return null;

        }


        const jy =
            Number(parts[0]);

        const jm =
            Number(parts[1]);

        const jd =
            Number(parts[2]);


        if (
            !jy ||
            !jm ||
            !jd ||
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


        return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`;

    }



    /* =====================================================
       TODAY JALALI
    ===================================================== */

    function todayJalali() {

        const now =
            new Date();


        return isoToJalali(
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
        );

    }



    /* =====================================================
       CREATE DATE FIELD
    ===================================================== */

    function prepareDateFields() {

        DATE_IDS.forEach(
            id => {

                const input =
                    document.getElementById(id);


                if (!input) {

                    return;

                }


                input.type =
                    "text";


                input.inputMode =
                    "numeric";


                input.placeholder =
                    "۱۴۰۵/۰۵/۲۹";


                input.autocomplete =
                    "off";


                input.dir =
                    "ltr";


                input.dataset
                    .jalaliDate = "true";


                input.addEventListener(
                    "input",
                    function () {

                        let v =
                            this.value
                                .replace(
                                    /[^0-9/]/g,
                                    ""
                                );


                        if (
                            v.length === 4 &&
                            !v.includes("/")
                        ) {

                            v += "/";

                        }


                        if (
                            v.length === 7 &&
                            v.split("/").length === 2
                        ) {

                            v += "/";

                        }


                        this.value =
                            v.slice(
                                0,
                                10
                            );

                    }
                );

            }
        );

    }



    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    window.jalaliDate = {

        isoToJalali,

        jalaliToISO,

        todayJalali,

        prepareDateFields,

        months: MONTHS

    };


    /* =====================================================
       INIT
    ===================================================== */

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
