/* =========================================================
   ADINE POULTRY HEALTH CENTER
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
   AUTH HELPERS
   ========================================================= */

async function getCurrentUser() {
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("Supabase user error:", error);
        return null;
    }

    return user;
}


/* =========================================================
   PROFILE
   ========================================================= */

async function getCurrentProfile() {

    const user = await getCurrentUser();

    if (!user) return null;

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Profile error:", error);
        return null;
    }

    return data;
}


/* =========================================================
   ACCESS CHECK
   ========================================================= */

async function checkUserAccess() {

    const user = await getCurrentUser();

    if (!user) {
        return {
            authenticated: false,
            allowed: false,
            user: null,
            profile: null
        };
    }

    const profile = await getCurrentProfile();

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

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return false;
    }

    window.location.href = "login.html";
    return true;
}
