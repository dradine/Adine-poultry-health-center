/* =========================================================
   ADINE POULTRY HEALTH CENTER
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://vzcczkavlopznljnnehp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_SUPABASE_PUBLISHABLE_KEY";


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
        await supabaseClient.auth.getUser();


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
            .eq("id", user.id)
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


    if (!user) {

        return {

            authenticated: false,

            allowed: false,

            user: null,

            profile: null

        };

    }


    const profile =
        await getCurrentProfile();


    if (!profile) {

        return {

            authenticated: true,

            allowed: false,

            user,

            profile: null

        };

    }


    const allowed =
        profile.access_status === "approved" ||
        profile.role === "owner" ||
        profile.role === "admin";


    return {

        authenticated: true,

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
        await supabaseClient.auth.signOut();


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
