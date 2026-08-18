
(function () {

    "use strict";

    window.AdineAuth = {

        async getUser() {

            const {
                data,
                error
            } = await supabaseClient.auth.getUser();

            if (error) {
                return null;
            }

            return data?.user || null;
        },

        async getSession() {

            const {
                data,
                error
            } = await supabaseClient.auth.getSession();

            if (error) {
                return null;
            }

            return data?.session || null;
        },

        async getProfile(userId = null) {

            const user = userId
                ? { id: userId }
                : await this.getUser();

            if (!user) {
                return null;
            }

            const {
                data,
                error
            } = await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (error) {
                console.error(error);
                return null;
            }

            return data;
        },

        async signOut() {

            await supabaseClient.auth.signOut();

            window.location.href = "login.html";
        },

        async requireAuth() {

            const user = await this.getUser();

            if (!user) {
                window.location.href = "login.html";
                return null;
            }

            const profile = await this.getProfile(user.id);

            if (!profile) {

                await supabaseClient.auth.signOut();

                window.location.href =
                    "login.html?message=" +
                    encodeURIComponent(
                        "اطلاعات حساب شما پیدا نشد."
                    );

                return null;
            }

            if (profile.status !== "active") {

                let message =
                    "دسترسی شما به سامانه فعال نیست.";

                if (profile.status === "pending") {
                    message =
                        "ثبت‌نام شما انجام شده و در انتظار تأیید مالک است.";
                }

                if (profile.status === "suspended") {
                    message =
                        "دسترسی حساب شما موقتاً غیرفعال شده است.";
                }

                if (profile.status === "blocked") {
                    message =
                        "حساب شما مسدود شده است.";
                }

                if (profile.status === "removed") {
                    message =
                        "دسترسی شما به سامانه لغو شده است.";
                }

                await supabaseClient.auth.signOut();

                window.location.href =
                    "login.html?message=" +
                    encodeURIComponent(message);

                return null;
            }

            await supabaseClient
                .rpc("update_my_activity");

            return {
                user,
                profile
            };
        },

        async requireOwner() {

            const auth = await this.requireAuth();

            if (!auth) {
                return null;
            }

            if (
                auth.profile.role !== "owner" ||
                auth.profile.status !== "active"
            ) {

                window.location.href =
                    "dashboard.html";

                return null;
            }

            return auth;
        }

    };

})();
