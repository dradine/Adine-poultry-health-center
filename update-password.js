document.addEventListener("DOMContentLoaded", async () => {

    const form =
        document.getElementById("updatePasswordForm");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const button =
        document.getElementById("updateButton");

    const message =
        document.getElementById("message");


    function showMessage(text, type = "error") {

        message.textContent = text;

        message.className =
            "message " + type;

        message.classList.remove("hidden");
    }


    let recoveryReady = false;


    // بررسی session اولیه
    const {
        data: {
            session
        }
    } =
    await supabaseClient.auth.getSession();


    if (session) {

        recoveryReady = true;

        showMessage(
            "لطفاً رمز عبور جدید خود را وارد کنید.",
            "info"
        );
    }


    // دریافت recovery event
    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                "AUTH EVENT:",
                event
            );


            if (
                event === "PASSWORD_RECOVERY"
            ) {

                recoveryReady = true;

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


            if (!recoveryReady) {

                showMessage(
                    "لینک بازیابی معتبر نیست یا منقضی شده است."
                );

                return;
            }


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

                    console.error(
                        "UPDATE PASSWORD ERROR:",
                        error
                    );

                    showMessage(
                        error.message
                    );

                    return;
                }


                showMessage(
                    "رمز عبور با موفقیت تغییر کرد.",
                    "success"
                );


                await supabaseClient.auth.signOut();


                setTimeout(
                    () => {

                        window.location.href =
                            "login.html";

                    },
                    2000
                );


            } catch(error) {

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
