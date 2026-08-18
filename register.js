
document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("registerForm");

    const fullNameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );

    const button =
        document.getElementById(
            "registerButton"
        );

    const message =
        document.getElementById(
            "message"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    function showMessage(
        text,
        type = "error"
    ) {

        message.textContent = text;

        message.className =
            "message " + type;

        message.classList.remove(
            "hidden"
        );
    }


    togglePassword.addEventListener(
        "click",
        () => {

            const visible =
                passwordInput.type ===
                "text";

            passwordInput.type =
                visible
                    ? "password"
                    : "text";

            togglePassword.textContent =
                visible
                    ? "نمایش"
                    : "پنهان";
        }
    );


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


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


            if (
                fullName.length < 2
            ) {

                showMessage(
                    "نام و نام خانوادگی را کامل وارد کنید."
                );

                return;
            }


            if (password.length < 8) {

                showMessage(
                    "رمز عبور باید حداقل ۸ کاراکتر باشد."
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "تکرار رمز عبور با رمز عبور یکسان نیست."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
                "در حال ثبت‌نام...";


            try {

                const {
                    data,
                    error
                } =
                await supabaseClient.auth
                    .signUp({

                        email,

                        password,

                        options: {

                            data: {
                                full_name:
                                    fullName
                            },

                            emailRedirectTo:
                                window.location.origin +
                                "/login.html"

                        }

                    });


                if (error) {

                    console.error(error);

                    showMessage(
                        error.message ||
                        "ثبت‌نام انجام نشد."
                    );

                    return;
                }


                if (!data.user) {

                    showMessage(
                        "ثبت‌نام انجام نشد."
                    );

                    return;
                }


                showMessage(
                    "ثبت‌نام با موفقیت انجام شد. ایمیل خود را تأیید کنید. پس از تأیید ایمیل، حساب شما باید توسط مالک فعال شود.",
                    "success"
                );


                form.reset();


            } catch (error) {

                console.error(error);

                showMessage(
                    "خطایی در ثبت‌نام رخ داد."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "ثبت‌نام";
            }

        }
    );

});
