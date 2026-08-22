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

    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(text, type = "error") {

        message.textContent = String(text || "");

        message.className = "message " + type;

        message.classList.remove("hidden");
    }


    function hideMessage() {

        message.classList.add("hidden");

        message.textContent = "";
    }


    /* =====================================================
       URL MESSAGE
    ===================================================== */

    const params =
        new URLSearchParams(window.location.search);

    const urlMessage =
        params.get("message");

    if (urlMessage) {

        showMessage(
            urlMessage,
            "info"
        );
    }


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                const visible =
                    passwordInput.type === "text";

                passwordInput.type =
                    visible
                        ? "password"
                        : "text";

                togglePassword.textContent =
                    visible
                        ? "نمایش"
                        : "پنهان";

                togglePassword.setAttribute(
                    "aria-label",
                    visible
                        ? "نمایش رمز"
                        : "پنهان کردن رمز"
                );

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            /*
             * جلوگیری از ارسال دوباره فرم
             */
            if (button.disabled) {
                return;
            }

            hideMessage();


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            /* =================================================
               VALIDATION
            ================================================= */

            if (!email || !password) {

                showMessage(
                    "ایمیل و رمز عبور را وارد کنید.",
                    "error"
                );

                return;
            }


            /* =================================================
               LOADING
            ================================================= */

            button.disabled = true;

            button.setAttribute(
                "aria-busy",
                "true"
            );

            button.textContent =
                "در حال ورود…";


            try {

                /* =================================================
                   SUPABASE LOGIN
                ================================================= */

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });


                /* =================================================
                   SUPABASE ERROR
                ================================================= */

                if (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    const errorText =
                        String(error.message || "")
                            .toLowerCase();


                    if (
                        errorText.includes(
                            "email not confirmed"
                        )
                    ) {

                        showMessage(
                            "ایمیل شما هنوز تأیید نشده است.",
                            "error"
                        );

                    } else {

                        showMessage(
                            error.message ||
                            "ورود انجام نشد.",
                            "error"
                        );
                    }

                    return;
                }


                /* =================================================
                   USER CHECK
                ================================================= */

                if (!data?.user) {

                    showMessage(
                        "ورود انجام نشد؛ حساب کاربری پیدا نشد.",
                        "error"
                    );

                    return;
                }


                /* =================================================
                   GET USER PROFILE
                ================================================= */

                const profile =
                    await AdineAuth.getProfile(
                        data.user.id
                    );


                /* =================================================
                   PROFILE NOT FOUND
                ================================================= */

                if (!profile) {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "حساب شما در سامانه ثبت نشده است. لطفاً با مالک سامانه تماس بگیرید.",
                        "error"
                    );

                    return;
                }


                /* =================================================
                   ACCOUNT STATUS
                ================================================= */

                /*
                 * مهم:
                 * منطق اصلی AdineAuth دست‌نخورده باقی مانده است.
                 */

                if (!AdineAuth.isActiveProfile(profile)) {

                    const text =
                        AdineAuth.getAccessMessage(
                            profile
                        );

                    await supabaseClient.auth.signOut();

                    showMessage(
                        text,
                        "error"
                    );

                    return;
                }


                /* =================================================
                   UPDATE ACTIVITY
                ================================================= */

                try {

                    const {
                        error: activityError
                    } =
                        await supabaseClient.rpc(
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


                /* =================================================
                   REDIRECT
                ================================================= */

                if (
                    String(profile.role || "")
                        .toLowerCase() ===
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
                    "خطایی در ورود رخ داد. اتصال اینترنت و تنظیمات سامانه را بررسی کنید.",
                    "error"
                );


            } finally {

                button.disabled = false;

                button.removeAttribute(
                    "aria-busy"
                );

                button.textContent =
                    "ورود";
            }

        }
    );

});
