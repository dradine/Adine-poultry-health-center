document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const button = document.getElementById("registerButton");
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


    togglePassword.addEventListener("click", () => {

        const isHidden =
            passwordInput.type === "password";

        passwordInput.type =
            isHidden ? "text" : "password";

        togglePassword.textContent =
            isHidden ? "پنهان" : "نمایش";

    });


    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        hideMessage();


        const fullName =
            fullNameInput.value.trim();

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        if (fullName.length < 2) {

            showMessage(
                "نام و نام خانوادگی را کامل وارد کنید."
            );

            return;
        }


        if (!email) {

            showMessage(
                "ایمیل را وارد کنید."
            );

            return;
        }


        if (password.length < 8) {

            showMessage(
                "رمز عبور باید حداقل ۸ کاراکتر باشد."
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "تکرار رمز عبور با رمز عبور یکسان نیست."
            );

            return;
        }


        button.disabled = true;

        button.textContent =
            "در حال ثبت‌نام...";


        try {

            const redirectUrl =
                window.location.origin +
                "/Adine-poultry-health-center/login.html";


            const {
                data,
                error
            } = await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        full_name: fullName

                    },

                    emailRedirectTo:
                        redirectUrl

                }

            });


            if (error) {

                console.error(
                    "SIGNUP ERROR:",
                    error
                );

                showMessage(
                    error.message ||
                    "ثبت‌نام انجام نشد."
                );

                return;
            }


            if (!data || !data.user) {

                showMessage(
                    "ثبت‌نام انجام نشد."
                );

                return;
            }


            /*
             * حساب جدید به صورت خودکار
             * در profiles با وضعیت pending
             * ساخته می‌شود.
             *
             * کاربر ابتدا باید ایمیل خود را
             * تأیید کند و سپس مالک حساب را
             * فعال کند.
             */


            form.reset();


            showMessage(
                "ثبت‌نام با موفقیت انجام شد. لینک تأیید به ایمیل شما ارسال شد. پس از تأیید ایمیل، حساب شما باید توسط مالک فعال شود.",
                "success"
            );


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );

            showMessage(
                "خطایی در ثبت‌نام رخ داد. دوباره تلاش کنید."
            );

        } finally {

            button.disabled = false;

            button.textContent =
                "ثبت‌نام";

        }

    });

});
