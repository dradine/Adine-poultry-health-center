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

/* ============================================================
   ADINE POULTRY HEALTH CENTER
   PROFESSIONAL ICON ENGINE
   Version 2.0
   No Emoji / No External Icon Library
============================================================ */

(function () {

    "use strict";


    const ICON = {

        home: `
        <svg viewBox="0 0 48 48">
            <path d="M5 23.5 24 7l19 16.5"/>
            <path d="M9 21v21h30V21"/>
            <path d="M18 42V29h12v13"/>
        </svg>`,

        farm: `
        <svg viewBox="0 0 48 48">
            <path d="M6 42h36"/>
            <path d="M9 42V21l15-11 15 11v21"/>
            <path d="M15 42V28h18v14"/>
            <path d="M18 21h12"/>
            <path d="M20 16h8"/>
        </svg>`,

        flock: `
        <svg viewBox="0 0 48 48">
            <circle cx="23" cy="21" r="9"/>
            <path d="M15 29c-6 2-9 6-9 12h31c0-6-4-10-10-12"/>
            <circle cx="27" cy="19" r="1.4"
                fill="currentColor"
                stroke="none"/>
            <path d="m32 21 8 2-8 2"/>
            <path d="M19 36v6M28 36v6"/>
            <path d="M13 30c-4-2-7 0-8 4"/>
        </svg>`,

        broiler: `
        <svg viewBox="0 0 48 48">
            <ellipse cx="23" cy="26" rx="14" ry="10"/>
            <circle cx="25" cy="18" r="7"/>
            <circle cx="28" cy="17" r="1.4"
                fill="currentColor"
                stroke="none"/>
            <path d="m31 18 8 2-8 2"/>
            <path d="M17 35v7M27 35v7"/>
            <path d="M15 14c-2-5 1-8 5-9"/>
        </svg>`,

        layer: `
        <svg viewBox="0 0 48 48">
            <ellipse cx="22" cy="25" rx="13" ry="10"/>
            <circle cx="24" cy="17" r="7"/>
            <circle cx="27" cy="16" r="1.4"
                fill="currentColor"
                stroke="none"/>
            <path d="m30 17 8 2-8 2"/>
            <path d="M16 34v8M26 34v8"/>
            <path d="M31 32c6 1 9 4 9 8"/>
            <path d="M34 31c-1-5 1-7 4-8"/>
        </svg>`,

        pullet: `
        <svg viewBox="0 0 48 48">
            <circle cx="23" cy="23" r="10"/>
            <path d="M15 31c-5 2-8 5-8 10h30c0-5-4-8-9-10"/>
            <circle cx="26" cy="21" r="1.4"
                fill="currentColor"
                stroke="none"/>
            <path d="m32 23 7 2-7 2"/>
            <path d="M19 34v7M28 34v7"/>
            <path d="M17 15c-1-4 1-7 4-8"/>
        </svg>`,

        breeder: `
        <svg viewBox="0 0 48 48">
            <circle cx="22" cy="20" r="9"/>
            <path d="M14 28c-6 3-8 7-8 13h32c0-6-4-10-10-13"/>
            <circle cx="26" cy="18" r="1.4"
                fill="currentColor"
                stroke="none"/>
            <path d="m31 20 8 2-8 2"/>
            <path d="M18 36v6M27 36v6"/>
            <path d="M33 31c5 0 8 3 9 7"/>
            <ellipse cx="38" cy="37" rx="5" ry="4"/>
        </svg>`,

        scale: `
        <svg viewBox="0 0 48 48">
            <path d="M24 7v29"/>
            <path d="M9 14h30"/>
            <path d="M9 14 5 25h12L13 14"/>
            <path d="M39 14l-4 11h8z"/>
            <path d="M15 40h18"/>
            <path d="M19 36h10"/>
        </svg>`,

        uniformity: `
        <svg viewBox="0 0 48 48">
            <circle cx="13" cy="23" r="7"/>
            <circle cx="24" cy="19" r="8"/>
            <circle cx="36" cy="23" r="7"/>
            <path d="M7 38c1-5 3-8 6-8s6 3 7 8"/>
            <path d="M15 39c1-6 4-10 9-10s8 4 9 10"/>
            <path d="M29 38c1-5 4-8 7-8s6 3 6 8"/>
        </svg>`,

        vaccine: `
        <svg viewBox="0 0 48 48">
            <path d="m29 7 12 12"/>
            <path d="m25 11 12 12"/>
            <path d="m21 15 12 12"/>
            <path d="M31 19 16 34"/>
            <path d="m16 34-5 8 8-5"/>
            <path d="m35 13 6-6"/>
            <path d="M8 42h13"/>
            <path d="M26 24 37 35"/>
        </svg>`,

        medicine: `
        <svg viewBox="0 0 48 48">
            <path d="M15 6h18v8H15z"/>
            <path d="M18 14h12v28H18z"/>
            <path d="M18 21h12"/>
            <path d="M24 25v11M18.5 30.5h11"/>
        </svg>`,

        water: `
        <svg viewBox="0 0 48 48">
            <path d="M24 6S10 21 10 31a14 14 0 0 0 28 0C38 21 24 6 24 6z"/>
            <path d="M17 31c1 4 4 7 9 7"/>
        </svg>`,

        feed: `
        <svg viewBox="0 0 48 48">
            <path d="M7 20h34v22H7z"/>
            <path d="M7 20 13 9h22l6 11"/>
            <path d="M13 27c3-5 7 5 11 0s7 5 11 0"/>
            <path d="M17 15h14"/>
        </svg>`,

        report: `
        <svg viewBox="0 0 48 48">
            <path d="M8 5h32v38H8z"/>
            <path d="M14 13h20M14 19h20"/>
            <path d="M14 37v-9M21 37V23M28 37v-6M35 37V19"/>
        </svg>`,

        archive: `
        <svg viewBox="0 0 48 48">
            <path d="M6 9h36v9H6z"/>
            <path d="M10 18h28v24H10z"/>
            <path d="M18 26h12M18 32h12"/>
            <path d="M19 5h10"/>
        </svg>`,

        health: `
        <svg viewBox="0 0 48 48">
            <path d="M24 41S7 31 7 19c0-6 4-10 10-10 3 0 6 2 7 5 1-3 4-5 7-5 6 0 10 4 10 10 0 12-17 22-17 22z"/>
            <path d="M13 24h7l3-7 3 13 3-6h6"/>
        </svg>`,

        mortality: `
        <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="17"/>
            <path d="M17 17l14 14M31 17 17 31"/>
        </svg>`,

        calendar: `
        <svg viewBox="0 0 48 48">
            <rect x="7" y="9" width="34" height="33" rx="5"/>
            <path d="M7 18h34"/>
            <path d="M15 5v8M33 5v8"/>
            <path d="M15 24h4M22 24h4M29 24h4"/>
            <path d="M15 31h4M22 31h4M29 31h4"/>
        </svg>`,

        analysis: `
        <svg viewBox="0 0 48 48">
            <path d="M7 41h34"/>
            <path d="m10 34 9-11 7 6 12-16"/>
            <circle cx="10" cy="34" r="2"/>
            <circle cx="19" cy="23" r="2"/>
            <circle cx="26" cy="29" r="2"/>
            <circle cx="38" cy="13" r="2"/>
        </svg>`,

        warning: `
        <svg viewBox="0 0 48 48">
            <path d="m24 6 20 36H4z"/>
            <path d="M24 17v11"/>
            <circle cx="24" cy="34" r="1.6"
                fill="currentColor"
                stroke="none"/>
        </svg>`,

        settings: `
        <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="6"/>
            <circle cx="24" cy="24" r="15"/>
            <path d="M24 5v7M24 36v7M5 24h7M36 24h7"/>
            <path d="m10 10 5 5M33 33l5 5M38 10l-5 5M15 33l-5 5"/>
        </svg>`,

        logout: `
        <svg viewBox="0 0 48 48">
            <path d="M20 6H8v36h12"/>
            <path d="m29 16 9 8-9 8"/>
            <path d="M17 24h21"/>
        </svg>`,

        check: `
        <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="17"/>
            <path d="m15 24 6 6 13-14"/>
        </svg>`,

        user: `
        <svg viewBox="0 0 48 48">
            <circle cx="24" cy="15" r="8"/>
            <path d="M9 42c1-9 7-14 15-14s14 5 15 14"/>
        </svg>`

    };


    const EMOJI_MAP = {

        "🏠": "home",
        "🏭": "farm",
        "🐔": "flock",
        "🐣": "pullet",
        "🥚": "layer",
        "⚖️": "scale",
        "⚖": "scale",
        "💉": "vaccine",
        "💊": "medicine",
        "💧": "water",
        "🌾": "feed",
        "📊": "report",
        "🗂️": "archive",
        "🗂": "archive",
        "📋": "archive",
        "🩺": "health",
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


    function make(
        name,
        className
    ) {

        if (!ICON[name]) {
            return "";
        }

        return `
            <span
                class="adi-svg-icon ${className || ""}"
                aria-hidden="true"
            >
                ${ICON[name]}
            </span>
        `;

    }


    function replaceEmoji(
        element
    ) {

        if (!element) {
            return;
        }


        let iconName = null;


        /*
         * Explicit data-icon
         */

        if (
            element.dataset &&
            element.dataset.icon &&
            ICON[element.dataset.icon]
        ) {

            iconName =
                element.dataset.icon;

        }


        /*
         * Search emoji
         */

        if (!iconName) {

            const text =
                element.textContent || "";


            for (
                const emoji in EMOJI_MAP
            ) {

                if (
                    text.indexOf(
                        emoji
                    ) !== -1
                ) {

                    iconName =
                        EMOJI_MAP[emoji];

                    break;

                }

            }

        }


        if (!iconName) {
            return;
        }


        /*
         * menu-icon
         */

        if (
            element.classList.contains(
                "menu-icon"
            )
        ) {

            element.innerHTML =
                make(
                    iconName,
                    "adi-menu-svg"
                );

            element.classList.add(
                "adi-icon-ready"
            );

            return;

        }


        /*
         * bottom navigation
         */

        if (
            element.closest(
                ".bottom-nav"
            )
        ) {

            const small =
                element.querySelector(
                    "small"
                );


            const label =
                small
                    ? small.outerHTML
                    : "";


            element.innerHTML =
                make(
                    iconName,
                    "adi-bottom-svg"
                ) +
                label;


            element.classList.add(
                "adi-icon-ready"
            );

            return;

        }


        /*
         * status icon
         */

        if (
            element.classList.contains(
                "status-icon"
            )
        ) {

            element.innerHTML =
                make(
                    iconName,
                    "adi-status-svg"
                );

            element.classList.add(
                "adi-icon-ready"
            );

            return;

        }

    }


    function scan() {

        document
            .querySelectorAll(
                ".menu-icon, .bottom-nav button, .bottom-nav a, .status-icon, [data-icon]"
            )
            .forEach(
                replaceEmoji
            );

    }


    window.AdiPoultryIcons = {

        make: make,

        scan: scan,

        ICON: ICON

    };


    function start() {

        scan();


        /*
         * برای صفحاتی که بعداً با JS
         * کارت جدید ایجاد می‌کنند.
         */

        const observer =
            new MutationObserver(
                function () {

                    scan();

                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    }

    else {

        start();

    }


})();
