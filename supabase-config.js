/* =========================================================
   ADINE POULTRY HEALTH CENTER
   SUPABASE CONFIGURATION
   ========================================================= */


const SUPABASE_URL =
    "https://vzcczkavlopznljnnehp.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_4jMgvqKI__-MsmMQtEiCig_M9WjhvN9";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );



/* =========================================================
   CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (error) {

        console.error(
            "Supabase user error:",
            error
        );

        return null;

    }


    return data.user || null;

}



/* =========================================================
   CURRENT PROFILE
   ========================================================= */

async function getCurrentProfile() {

    const user =
        await getCurrentUser();


    if (!user) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return null;

    }


    return data;

}



/* =========================================================
   ACCESS
   ========================================================= */

async function checkUserAccess() {

    const user =
        await getCurrentUser();


    /* -----------------------------------------
       Ú©Ø§Ø±Ø¨Ø± ÙØ§Ø±Ø¯ ÙØ´Ø¯Ù
       ----------------------------------------- */

    if (!user) {

        return {

            authenticated:
                false,

            allowed:
                false,

            user:
                null,

            profile:
                null

        };

    }


    /* -----------------------------------------
       Ø¯Ø±ÛØ§ÙØª Ù¾Ø±ÙÙØ§ÛÙ
       ----------------------------------------- */

    const profile =
        await getCurrentProfile();


    if (!profile) {

        return {

            authenticated:
                true,

            allowed:
                false,

            user,

            profile:
                null

        };

    }


    /* -----------------------------------------
       ÙØ¶Ø¹ÛØª Ø­Ø³Ø§Ø¨
       ----------------------------------------- */

    const status =
        String(
            profile.status ||
            ""
        )
        .trim()
        .toLowerCase();


    const accessStatus =
        String(
            profile.access_status ||
            ""
        )
        .trim()
        .toLowerCase();


    const role =
        String(
            profile.role ||
            ""
        )
        .trim()
        .toLowerCase();



    /* -----------------------------------------
       Ø­Ø³Ø§Ø¨âÙØ§Û ØªØ£ÛÛØ¯ Ø´Ø¯Ù
       ----------------------------------------- */

    const isApproved =
        accessStatus ===
        "approved";


    const isActive =
        status ===
        "active";


    const isOwner =
        role ===
        "owner";


    const isAdmin =
        role ===
        "admin";



    /* -----------------------------------------
       ÙØ¶Ø¹ÛØªâÙØ§Û ÙØ³Ø¯ÙØ¯Ú©ÙÙØ¯Ù
       ----------------------------------------- */

    const isBlocked =
        status ===
        "blocked";


    const isSuspended =
        status ===
        "suspended";


    const isRemoved =
        status ===
        "removed";


    const isDenied =
        accessStatus ===
        "blocked" ||
        accessStatus ===
        "suspended" ||
        accessStatus ===
        "removed";



    /* -----------------------------------------
       ØªØµÙÛÙ ÙÙØ§ÛÛ
       ----------------------------------------- */

    let allowed =
        false;


    /*
     * Ø§Ú¯Ø± Ø­Ø³Ø§Ø¨ ØµØ±Ø§Ø­ØªØ§Ù ÙØ³Ø¯ÙØ¯Ø
     * ÙØ¹ÙÙ ÛØ§ Ø­Ø°Ù Ø´Ø¯Ù Ø¨Ø§Ø´Ø¯Ø
     * Ø§Ø¬Ø§Ø²Ù ÙØ±ÙØ¯ ÙÙÛâØ¯ÙÛÙ.
     */

    if (
        isBlocked ||
        isSuspended ||
        isRemoved ||
        isDenied
    ) {

        allowed =
            false;

    }

    else if (
        isApproved ||
        isActive ||
        isOwner ||
        isAdmin
    ) {

        allowed =
            true;

    }



    /* -----------------------------------------
       ÙØªÛØ¬Ù
       ----------------------------------------- */

    return {

        authenticated:
            true,

        allowed,

        user,

        profile

    };

}



/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutUser() {

    const {
        error
    } =
        await supabaseClient
            .auth
            .signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return false;

    }


    window.location.href =
        "login.html";


    return true;

}
