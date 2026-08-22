/* =========================================================
   ADINE POULTRY HEALTH CENTER
   PROFESSIONAL SVG ICON SYSTEM
   بدون وابستگی به Emoji / Font / Library خارجی
   مناسب iPhone / PWA
========================================================= */

(function () {

    "use strict";


    const ICONS = {

        home: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M7 22.5 24 8l17 14.5"/>
                <path d="M11 20v20h26V20"/>
                <path d="M19 40V27h10v13"/>
            </svg>
        `,


        farm: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M6 40h36"/>
                <path d="M9 40V21l15-11 15 11v19"/>
                <path d="M15 40V28h18v12"/>
                <path d="M15 21h18"/>
                <path d="M20 16h8"/>
            </svg>
        `,


        flock: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="25" cy="21" r="9"/>
                <path d="M17 29c-6 2-9 6-9 11h27c0-5-4-9-10-11"/>
                <circle cx="28" cy="19" r="1.4" fill="currentColor" stroke="none"/>
                <path d="m34 21 6 2-6 2"/>
                <path d="M21 36v5M29 36v5"/>
                <path d="M13 31c-4-1-7 1-8 4"/>
                <path d="M11 28c-2-3-1-6 1-8"/>
            </svg>
        `,


        scale: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 8v28"/>
                <path d="M10 15h28"/>
                <path d="M7 15h10l-5 10H12z"/>
                <path d="M31 15h10l-5 10h-2z"/>
                <path d="M14 36h20"/>
                <path d="M18 40h12"/>
                <path d="M20 15a4 4 0 0 1 8 0"/>
            </svg>
        `,


        vaccine: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="m29 7 12 12"/>
                <path d="m26 10 12 12"/>
                <path d="m22 14 12 12"/>
                <path d="M31 18 17 32"/>
                <path d="m17 32-5 8 8-5"/>
                <path d="m35 13 5-5"/>
                <path d="M9 39h12"/>
                <path d="M25 21 36 32"/>
                <path d="M36 32c3 0 5 2 5 5"/>
            </svg>
        `,


        medicine: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M15 7h18v7H15z"/>
                <path d="M18 14h12v26H18z"/>
                <path d="M18 21h12"/>
                <path d="M24 25v10M19 30h10"/>
            </svg>
        `,


        water: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 7S11 21 11 30a13 13 0 0 0 26 0C37 21 24 7 24 7z"/>
                <path d="M18 30c1 4 4 6 8 6"/>
            </svg>
        `,


        feed: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M8 20h32v20H8z"/>
                <path d="M8 20 13 10h22l5 10"/>
                <path d="M15 26c4-4 7 4 11 0s7 4 11 0"/>
                <path d="M19 15h10"/>
            </svg>
        `,


        report: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M9 6h30v36H9z"/>
                <path d="M15 13h18"/>
                <path d="M15 19h18"/>
                <path d="M15 35v-8"/>
                <path d="M22 35V22"/>
                <path d="M29 35v-5"/>
                <path d="M36 35v-12"/>
            </svg>
        `,


        archive: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M7 10h34v8H7z"/>
                <path d="M10 18h28v22H10z"/>
                <path d="M18 25h12"/>
                <path d="M18 31h12"/>
                <path d="M19 6h10"/>
            </svg>
        `,


        health: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 40S8 31 8 19c0-6 4-10 9-10 3 0 6 2 7 5 1-3 4-5 7-5 5 0 9 4 9 10 0 12-16 21-16 21z"/>
                <path d="M16 24h5l2-5 3 10 2-5h5"/>
            </svg>
        `,


        mortality: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 8v32"/>
                <path d="m16 16 8-8 8 8"/>
                <path d="m16 32 8 8 8-8"/>
                <path d="M10 24h28"/>
            </svg>
        `,


        settings: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="6"/>
                <path d="M24 6v6M24 36v6M6 24h6M36 24h6"/>
                <path d="m11 11 4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/>
                <circle cx="24" cy="24" r="15"/>
            </svg>
        `,


        calendar: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <rect x="7" y="10" width="34" height="31" rx="4"/>
                <path d="M7 18h34"/>
                <path d="M15 6v8M33 6v8"/>
                <path d="M15 24h4M22 24h4M29 24h4"/>
                <path d="M15 31h4M22 31h4M29 31h4"/>
            </svg>
        `,


        chick: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="23" cy="25" r="11"/>
                <circle cx="27" cy="22" r="1.5" fill="currentColor" stroke="none"/>
                <path d="m33 25 7 2-7 2"/>
                <path d="M16 34c-5 2-7 5-7 9h27"/>
                <path d="M19 36v5M28 36v5"/>
                <path d="M17 17c-2-4 0-8 4-9"/>
            </svg>
        `,


        egg: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 6c-8 0-14 12-14 21 0 9 6 15 14 15s14-6 14-15C38 18 32 6 24 6z"/>
                <path d="M17 29c1 4 4 6 8 7"/>
            </svg>
        `,


        male: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="20" cy="28" r="10"/>
                <path d="M28 20 39 9"/>
                <path d="M30 9h9v9"/>
                <path d="M14 37v4M23 37v4"/>
            </svg>
        `,


        analysis: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M7 40h34"/>
                <path d="M10 35 19 25l7 6 12-17"/>
                <circle cx="10" cy="35" r="2"/>
                <circle cx="19" cy="25" r="2"/>
                <circle cx="26" cy="31" r="2"/>
                <circle cx="38" cy="14" r="2"/>
            </svg>
        `,


        warning: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="m24 7 19 34H5z"/>
                <path d="M24 18v10"/>
                <circle cx="24" cy="34" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
        `,


        logout: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M20 7H9v34h11"/>
                <path d="M28 16l9 8-9 8"/>
                <path d="M17 24h20"/>
            </svg>
        `,


        user: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="16" r="8"/>
                <path d="M9 41c1-9 7-14 15-14s14 5 15 14"/>
            </svg>
        `,


        close: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M10 10l28 28M38 10 10 38"/>
            </svg>
        `,


        check: `
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="17"/>
                <path d="m15 24 6 6 12-13"/>
            </svg>
        `

    };


    const MAP = {

        "🏠": "home",
        "🏭": "farm",
        "🐔": "flock",
        "🐣": "chick",
        "🥚": "egg",
        "⚖️": "scale",
        "⚖": "scale",
        "💉": "vaccine",
        "💊": "medicine",
        "💧": "water",
        "🌾": "feed",
        "📊": "report",
        "📋": "archive",
        "🩺": "health",
        "💀": "mortality",
        "⚙️": "settings",
        "⚙": "settings",
        "📅": "calendar",
        "📈": "analysis",
        "⚠️": "warning",
        "⚠": "warning",
        "🚪": "logout",
        "✓": "check",
        "✔": "check",
        "👤": "user"
    };


    function createIcon(
        name,
        className
    ) {

        if (!ICONS[name]) {
            return "";
        }

        return `
            <span
                class="adi-icon ${className || ""}"
                aria-hidden="true"
            >
                ${ICONS[name]}
            </span>
        `;

    }


    function replaceElement(
        element
    ) {

        if (!element) {
            return;
        }


        if (
            element.dataset &&
            element.dataset.icon &&
            ICONS[element.dataset.icon]
        ) {

            element.innerHTML =
                createIcon(
                    element.dataset.icon,
                    "adi-icon-menu"
                );

            return;

        }


        let text =
            element.textContent
                .trim();


        if (!text) {
            return;
        }


        let iconName =
            null;


        for (
            const emoji in MAP
        ) {

            if (
                text.includes(
                    emoji
                )
            ) {

                iconName =
                    MAP[emoji];

                break;

            }

        }


        if (!iconName) {
            return;
        }


        const icon =
            createIcon(
                iconName,
                "adi-icon-menu"
            );


        /*
         * فقط خود Emoji را حذف می‌کنیم.
         * متن فارسی، عنوان و عملکرد دکمه دست‌نخورده می‌ماند.
         */

        let replaced =
            false;


        for (
            const emoji in MAP
        ) {

            if (
                text.includes(
                    emoji
                )
            ) {

                text =
                    text.replace(
                        emoji,
                        ""
                    );

                replaced =
                    true;

                break;

            }

        }


        if (!replaced) {
            return;
        }


        const cleanText =
            text.trim();


        /*
         * برای menu-icon متن نداریم.
         */

        if (
            element.classList.contains(
                "menu-icon"
            )
        ) {

            element.innerHTML =
                icon;

            return;

        }


        /*
         * برای bottom navigation
         * آیکون بالای متن باقی می‌ماند.
         */

        element.innerHTML =
            icon +
            (
                cleanText
                    ? `<span class="adi-icon-label">${cleanText}</span>`
                    : ""
            );

    }


    function init() {

        document
            .querySelectorAll(
                ".menu-icon"
            )
            .forEach(
                replaceElement
            );


        document
            .querySelectorAll(
                ".bottom-nav button, .bottom-nav a"
            )
            .forEach(
                replaceElement
            );


        document
            .querySelectorAll(
                ".nav-item, .action-card, .quick-action, .health-action"
            )
            .forEach(
                replaceElement
            );


        document
            .querySelectorAll(
                "[data-icon]"
            )
            .forEach(
                replaceElement
            );


        /*
         * status-icon اگر ✓ داشت
         */

        document
            .querySelectorAll(
                ".status-icon"
            )
            .forEach(
                function (element) {

                    if (
                        element.textContent
                            .trim() === "✓"
                    ) {

                        element.innerHTML =
                            createIcon(
                                "check",
                                "adi-icon-status"
                            );

                    }

                }
            );

    }


    window.AdiIcons = {

        icons: ICONS,

        create:
            createIcon,

        refresh:
            init

    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }

})();
