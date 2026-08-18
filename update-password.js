document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById(
            "updatePasswordForm"
        );

    const password =
        document.getElementById(
            "password"
        );

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );

    const button =
        document.getElementById(
            "updateButton"
        );

    const message =
        document.getElementById(
            "message"
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


    supabaseClient.auth.onAuthStateChange(
        async (event) => {

            if (
                event ===
                "PASSWORD_RECOVERY"
            ) {

                showMessage(
                    "لطفاً رمز عبور جدید خود را وارد کنید.",
                    "info"
                );
            }

        }
    );


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (
                password.value.length < 8
            ) {

                showMessage(
                    "رمز عبور باید حداقل ۸ کاراکتر باشد."
                );

                return;
            }


            if (
                password.value !==
                confirmPassword.value
            ) {

                showMessage(
                    "تکرار رمز عبور صحیح نیست."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
                "در حال ذخیره...";


            try {

                const {
                    error
                } =
                await supabaseClient.auth
                    .updateUser({
                        password:
                            password.value
                    });


                if (error) {

                    console.error(error);

                    showMessage(
                        "تغییر رمز عبور انجام نشد."
                    );

                    return;
                }


                showMessage(
                    "رمز عبور با موفقیت تغییر کرد.",
                    "success"
                );


                form.reset();


                setTimeout(
                    () => {

                        window.location.href =
                            "login.html";

                    },
                    1800
                );


            } catch (error) {

                console.error(error);

                showMessage(
                    "خطایی رخ داد."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "ذخیره رمز جدید";
            }

        }
    );

});
