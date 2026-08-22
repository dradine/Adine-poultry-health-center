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
       SUPABASE ERROR → PERSIAN MESSAGE
    ===================================================== */

    function getPersianLoginError(error) {

        const rawMessage =
            String(error?.message || "")
                .trim();

        const normalized =
            rawMessage
                .toLowerCase()
                .replace(/\s+/g, " ");


        /*
         * اطلاعات ورود اشتباه
         */
        if (
            normalized.includes("invalid login credentials") ||
            normalized.includes("invalid credentials") ||
            normalized.includes("invalid email or password") ||
            normalized.includes("email or password") ||
            normalized.includes("wrong password") ||
            normalized.includes("incorrect password")
        ) {

            return "ایمیل یا رمز عبور اشتباه است.";
        }


        /*
         * ایمیل تأیید نشده
         */
        if (
            normalized.includes("email not confirmed") ||
            normalized.includes("email_not_confirmed") ||
            normalized.includes("email confirmation")
        ) {

            return "ایمیل شما هنوز تأیید نشده است.";
        }


        /*
         * کاربر پیدا نشد
         */
        if (
            normalized.includes("user not found") ||
            normalized.includes("user_not_found")
        ) {

            return "حساب کاربری پیدا نشد.";
        }


        /*
         * محدودیت درخواست ورود
         */
        if (
            normalized.includes("too many requests") ||
            normalized.includes("rate limit") ||
            normalized.includes("rate_limit")
        ) {

            return "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه بعد دوباره تلاش کنید.";
        }


        /*
         * شبکه
         */
        if (
            normalized.includes("network") ||
            normalized.includes("failed to fetch") ||
            normalized.includes("fetch failed") ||
            normalized.includes("networkerror")
        ) {

            return "ارتباط با سامانه برقرار نشد. اتصال اینترنت را بررسی کنید.";
        }


        /*
         * سرویس احراز هویت
         */
        if (
            normalized.includes("service unavailable") ||
            normalized.includes("temporarily unavailable")
        ) {

            return "سرویس ورود موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.";
        }


        /*
         * اگر Supabase خطای دیگری داد،
         * متن انگلیسی آن را مستقیماً نمایش نمی‌دهیم.
         */
        return "ورود انجام نشد. ایمیل و رمز عبور خود را بررسی کنید.";
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
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isVisible =
                    passwordInput.type === "text";


                passwordInput.type =
                    isVisible
                        ? "password"
                        : "text";


                togglePassword.textContent =
                    isVisible
                        ? "نمایش"
                        : "پنهان";


                togglePassword.setAttribute(
                    "aria-label",
                    isVisible
                        ? "نمایش رمز"
                        : "پنهان کردن رمز"
                );

            }
        );

    }


    /* =====================================================
       LOGIN SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /*
             * جلوگیری از دوبار کلیک
             */
            if (button.disabled) {
                return;
            }


            hideMessage();


            /* =================================================
               VALUES
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

            if (!email && !password) {

                showMessage(
                    "ایمیل و رمز عبور را وارد کنید.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            if (!email) {

                showMessage(
                    "لطفاً ایمیل خود را وارد کنید.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            if (!password) {

                showMessage(
                    "لطفاً رمز عبور خود را وارد کنید.",
                    "error"
                );

                passwordInput.focus();

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
                   SUPABASE AUTH
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
                   LOGIN ERROR
                ================================================= */

                if (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );


                    /*
                     * مهم:
                     * هیچ متن خام انگلیسی Supabase
                     * مستقیماً به کاربر نشان داده نمی‌شود.
                     */
                    showMessage(
                        getPersianLoginError(error),
                        "error"
                    );

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
                   PROFILE
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

                if (!AdineAuth.isActiveProfile(profile)) {

                    const accessMessage =
                        AdineAuth.getAccessMessage(
                            profile
                        );


                    await supabaseClient.auth.signOut();


                    showMessage(
                        accessMessage ||
                        "دسترسی حساب شما به سامانه فعال نیست.",
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
                    "خطایی هنگام ورود رخ داد. اتصال اینترنت و تنظیمات سامانه را بررسی کنید.",
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
