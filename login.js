document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const button = document.getElementById("loginButton");
    const message = document.getElementById("message");
    const togglePassword = document.getElementById("togglePassword");

    if (!form || !emailInput || !passwordInput || !button || !message) {
        console.error("Login UI initialization failed.");
        return;
    }

    function showMessage(text, type = "error") {
        message.textContent = text;
        message.className = "message " + type;
        message.classList.remove("hidden");
    }

    function hideMessage() {
        message.classList.add("hidden");
        message.textContent = "";
    }

    const params =
        new URLSearchParams(window.location.search);

    const urlMessage =
        params.get("message");

    if (urlMessage) {
        showMessage(urlMessage, "info");
    }

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                const visible =
                    passwordInput.type === "text";

                passwordInput.type =
                    visible ? "password" : "text";

                togglePassword.textContent =
                    visible ? "ÙÙØ§ÛØ´" : "Ù¾ÙÙØ§Ù";

                togglePassword.setAttribute(
                    "aria-label",
                    visible ? "ÙÙØ§ÛØ´ Ø±ÙØ²" : "Ù¾ÙÙØ§Ù Ú©Ø±Ø¯Ù Ø±ÙØ²"
                );

            }
        );

    }

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideMessage();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;

            if (!email || !password) {

                showMessage(
                    "Ø§ÛÙÛÙ Ù Ø±ÙØ² Ø¹Ø¨ÙØ± Ø±Ø§ ÙØ§Ø±Ø¯ Ú©ÙÛØ¯."
                );

                return;

            }

            button.disabled = true;
            button.textContent = "Ø¯Ø± Ø­Ø§Ù ÙØ±ÙØ¯â¦";

            try {

                const {
                    data,
                    error
                } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {

                    console.error("LOGIN ERROR:", error);

                    const errorText =
                        String(error.message || "")
                            .toLowerCase();

                    if (
                        errorText.includes("email not confirmed")
                    ) {

                        showMessage(
                            "Ø§ÛÙÛÙ Ø´ÙØ§ ÙÙÙØ² ØªØ£ÛÛØ¯ ÙØ´Ø¯Ù Ø§Ø³Øª."
                        );

                    } else {

                        showMessage(
                            error.message ||
                            "ÙØ±ÙØ¯ Ø§ÙØ¬Ø§Ù ÙØ´Ø¯."
                        );

                    }

                    return;

                }

                if (!data?.user) {

                    showMessage(
                        "ÙØ±ÙØ¯ Ø§ÙØ¬Ø§Ù ÙØ´Ø¯Ø Ø­Ø³Ø§Ø¨ Ú©Ø§Ø±Ø¨Ø±Û Ù¾ÛØ¯Ø§ ÙØ´Ø¯."
                    );

                    return;

                }

                const profile =
                    await AdineAuth.getProfile(
                        data.user.id
                    );

                if (!profile) {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "Ø­Ø³Ø§Ø¨ Ø´ÙØ§ Ø¯Ø± Ø³Ø§ÙØ§ÙÙ Ø«Ø¨Øª ÙØ´Ø¯Ù Ø§Ø³Øª. ÙØ·ÙØ§Ù Ø¨Ø§ ÙØ§ÙÚ© Ø³Ø§ÙØ§ÙÙ ØªÙØ§Ø³ Ø¨Ú¯ÛØ±ÛØ¯."
                    );

                    return;

                }

                /*
                 * ÙÙÙ:
                 * ÙØ¨ÙØ§Ù login.js ÙÙØ· status === active Ø±Ø§ ÙØ¨ÙÙ ÙÛâÚ©Ø±Ø¯Ø
                 * Ø¯Ø± Ø­Ø§ÙÛ Ú©Ù Dashboard Ù auth.js access_status=approved
                 * Ø±Ø§ ÙÙ ÙØ¨ÙÙ ÙÛâÚ©Ø±Ø¯ÙØ¯. Ø§ÛÙ Ø§Ø®ØªÙØ§Ù Ø¨Ø§Ø¹Ø« ÙØ±ÙØ¯/Ø®Ø±ÙØ¬
                 * ÙØ§ÙÙØ¸Ù ÙÛâØ´Ø¯.
                 */
                if (!AdineAuth.isActiveProfile(profile)) {

                    const text =
                        AdineAuth.getAccessMessage(profile);

                    await supabaseClient.auth.signOut();

                    showMessage(text);

                    return;

                }

                try {

                    const {
                        error: activityError
                    } = await supabaseClient.rpc(
                        "update_my_activity"
                    );

                    if (activityError) {
                        console.warn(
                            "ACTIVITY UPDATE ERROR:",
                            activityError
                        );
                    }

                } catch (activityException) {

                    console.warn(
                        "ACTIVITY UPDATE EXCEPTION:",
                        activityException
                    );

                }

                if (
                    String(profile.role || "").toLowerCase() ===
                    "owner"
                ) {

                    window.location.replace(
                        "owner.html"
                    );

                } else {

                    window.location.replace(
                        "Dashboard.html"
                    );

                }

            } catch (error) {

                console.error(
                    "LOGIN EXCEPTION:",
                    error
                );

                showMessage(
                    error.message ||
                    "Ø®Ø·Ø§ÛÛ Ø¯Ø± ÙØ±ÙØ¯ Ø±Ø® Ø¯Ø§Ø¯. Ø§ØªØµØ§Ù Ø§ÛÙØªØ±ÙØª Ù ØªÙØ¸ÛÙØ§Øª Ø³Ø§ÙØ§ÙÙ Ø±Ø§ Ø¨Ø±Ø±Ø³Û Ú©ÙÛØ¯."
                );

            } finally {

                button.disabled = false;
                button.textContent = "ÙØ±ÙØ¯";

            }

        }
    );

});
