/* =========================================================
   ADINE POULTRY HEALTH CENTER
   STANDARDS COMPATIBILITY LAYER

   The authoritative numeric standard engine is standard-data.js.
   This file intentionally contains no duplicate catalog or curves.
========================================================= */
"use strict";

if (typeof window !== "undefined") {
    window.ADINE_STANDARDS_ENGINE_VERSION = "3.0-2026";

    if (typeof window.getStandard !== "function" && typeof getStandard === "function") {
        window.getStandard = getStandard;
    }

    if (typeof window.getStandardMeta !== "function" && typeof getStandardMeta === "function") {
        window.getStandardMeta = getStandardMeta;
    }

    if (typeof window.getStandardValueAtAge !== "function" && typeof getStandardValueAtAge === "function") {
        window.getStandardValueAtAge = getStandardValueAtAge;
    }
}
