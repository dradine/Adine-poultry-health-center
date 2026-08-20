document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const button = document.getElementById("loginButton");
    const message = document.getElementById("message");
    const togglePassword = document.getElementById("togglePassword");


    function showMessage(text, type = "error") {

        message.textContent = text;

        message.className = "message " + type;

        message.classList.remove("hidden");
    }


    function hideMessage() {

        message.classList.add("hidden");

    }


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


    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "پنهان";

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "نمایش";

                }

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
                    "ایمیل و رمز عبور را وارد کنید."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
                "در حال ورود...";


            try {

                const {
                    data,
                    error
                } =
                await supabaseClient.auth
                    .signInWithPassword({
                        email: email,
                        password: password
                    });


                /*
                 * خطای واقعی Supabase
                 */

                if (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    console.error(
                        "LOGIN ERROR CODE:",
                        error.code
                    );

                    console.error(
                        "LOGIN ERROR MESSAGE:",
                        error.message
                    );


                    /*
                     * پیام‌های مشخص
                     */

                    if (
                        error.message &&
                        error.message
                            .toLowerCase()
                            .includes(
                                "email not confirmed"
                            )
                    ) {

                        showMessage(
                            "ایمیل شما هنوز تأیید نشده است."
                        );

                    } else {

                        showMessage(
                            error.message ||
                            "ورود انجام نشد."
                        );

                    }

                    return;
                }


                if (!data || !data.user) {

                    showMessage(
                        "ورود انجام نشد؛ حساب کاربری پیدا نشد."
                    );

                    return;
                }


                /*
                 * دریافت پروفایل
                 */

                const profile =
                    await AdineAuth
                        .getProfile(
                            data.user.id
                        );


                if (!profile) {

                    await supabaseClient
                        .auth
                        .signOut();

                    showMessage(
                        "حساب شما در سامانه ثبت نشده است. لطفاً با مالک سامانه تماس بگیرید."
                    );

                    return;
                }


                /*
                 * بررسی وضعیت حساب
                 */

                if (
                    profile.status !==
                    "active"
                ) {

                    let text =
                        "دسترسی شما به سامانه فعال نیست.";


                    if (
                        profile.status ===
                        "pending"
                    ) {

                        text =
                            "ایمیل شما تأیید شده است، اما حساب هنوز توسط مالک فعال نشده است.";

                    }


                    if (
                        profile.status ===
                        "suspended"
                    ) {

                        text =
                            "دسترسی حساب شما موقتاً غیرفعال شده است.";

                    }


                    if (
                        profile.status ===
                        "blocked"
                    ) {

                        text =
                            "حساب شما مسدود شده است.";

                    }


                    if (
                        profile.status ===
                        "removed"
                    ) {

                        text =
                            "دسترسی شما به سامانه لغو شده است.";

                    }


                    await supabaseClient
                        .auth
                        .signOut();


                    showMessage(text);

                    return;
                }


                /*
                 * ثبت آخرین فعالیت
                 */

                const {
                    error: activityError
                } =
                await supabaseClient
                    .rpc(
                        "update_my_activity"
                    );


                if (activityError) {

                    console.warn(
                        "ACTIVITY UPDATE ERROR:",
                        activityError
                    );

                }


                /*
                 * انتقال کاربر
                 */

                if (
                    profile.role ===
                    "owner"
                ) {

                    window.location.href =
                        "owner.html";

                } else {

                    window.location.href =
                        "Dashboard.html";

                }


            } catch (error) {

                console.error(
                    "LOGIN EXCEPTION:",
                    error
                );

                showMessage(
                    error.message ||
                    "خطایی در ورود رخ داد."
                );


            } finally {

                button.disabled = false;

                button.textContent =
                    "ورود";

            }

        }
    );

});
