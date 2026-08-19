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


    // فقط برای اطلاع کاربر
    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "AUTH EVENT:",
                event,
                session
            );


            if (
                event === "PASSWORD_RECOVERY" ||
                event === "SIGNED_IN"
            ) {

                showMessage(
                    "لطفاً رمز عبور جدید را وارد کنید.",
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
                    data,
                    error
                } =
                await supabaseClient.auth
                    .updateUser({
                        password:
                            password.value
                    });


                console.log(
                    "UPDATE RESULT:",
                    data,
                    error
                );


                if (error) {

                    console.error(
                        "PASSWORD UPDATE ERROR:",
                        error
                    );

                    showMessage(
                        error.message ||
                        "تغییر رمز عبور انجام نشد."
                    );

                    return;
                }


                showMessage(
                    "رمز عبور با موفقیت تغییر کرد.",
                    "success"
                );


                setTimeout(
                    async () => {

                        await supabaseClient.auth.signOut();

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
