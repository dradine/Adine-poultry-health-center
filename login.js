document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const button =
        document.getElementById("loginButton");

    const message =
        document.getElementById("message");

    const togglePassword =
        document.getElementById("togglePassword");


    function showMessage(text, type = "error") {

        message.textContent = text;

        message.className =
            "message " + type;

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
        showMessage(urlMessage, "info");
    }


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
                        email,
                        password
                    });


                if (error) {

                    showMessage(
                        "ایمیل یا رمز عبور صحیح نیست."
                    );

                    return;
                }


                if (!data.user) {

                    showMessage(
                        "ورود انجام نشد."
                    );

                    return;
                }


                const profile =
                    await AdineAuth
                        .getProfile(data.user.id);


                if (!profile) {

                    await supabaseClient
                        .auth
                        .signOut();

                    showMessage(
                        "اطلاعات حساب شما پیدا نشد."
                    );

                    return;
                }


                if (profile.status !== "active") {

                    let text =
                        "دسترسی شما به سامانه فعال نیست.";


                    if (
                        profile.status ===
                        "pending"
                    ) {
                        text =
                            "ثبت‌نام شما با موفقیت انجام شد و اکنون در انتظار تأیید مالک است.";
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


                await supabaseClient
                    .rpc(
                        "update_my_activity"
                    );


                if (
                    profile.role ===
                    "owner"
                ) {

                    window.location.href =
                        "owner.html";

                } else {

                    window.location.href =
                        "dashboard.html";
                }

            } catch (error) {

                console.error(error);

                showMessage(
                    "خطایی در ورود رخ داد. دوباره تلاش کنید."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "ورود";
            }

        }
    );

});
