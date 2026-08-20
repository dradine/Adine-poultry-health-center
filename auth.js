(function () {

    "use strict";


    window.AdineAuth = {


        /* =====================================================
           GET USER
           ===================================================== */

        async getUser() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getUser();


            if (error) {

                console.error(
                    "getUser:",
                    error
                );

                return null;

            }


            return data?.user || null;

        },


        /* =====================================================
           GET SESSION
           ===================================================== */

        async getSession() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                console.error(
                    "getSession:",
                    error
                );

                return null;

            }


            return data?.session || null;

        },


        /* =====================================================
           GET PROFILE
           ===================================================== */

        async getProfile(
            userId = null
        ) {

            const user =
                userId
                    ? { id: userId }
                    : await this.getUser();


            if (!user) {

                return null;

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .select("*")
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "getProfile:",
                    error
                );

                return null;

            }


            return data;

        },


        /* =====================================================
           SIGN OUT
           ===================================================== */

        async signOut() {

            try {

                await supabaseClient
                    .auth
                    .signOut();

            }

            catch (error) {

                console.error(
                    "signOut:",
                    error
                );

            }


            window.location.href =
                "login.html";

        },


        /* =====================================================
           CHECK PROFILE ACCESS
           ===================================================== */

        isActiveProfile(profile) {

            if (!profile) {

                return false;

            }


            /*
             * سیستم فعلی ممکن است از یکی از
             * دو ساختار زیر استفاده کند:
             *
             * access_status = approved
             *
             * یا
             *
             * status = active
             *
             * هر دو را قبول می‌کنیم.
             */


            const approved =
                profile.access_status ===
                "approved";


            const active =
                profile.status ===
                "active";


            /*
             * مالک و مدیر سیستم نیز در صورت
             * فعال بودن نقش می‌توانند وارد شوند.
             */

            const owner =
                profile.role ===
                "owner";


            const admin =
                profile.role ===
                "admin";


            return (
                approved ||
                active ||
                (
                    owner &&
                    profile.status !== "blocked" &&
                    profile.status !== "removed" &&
                    profile.status !== "suspended"
                ) ||
                (
                    admin &&
                    profile.status === "active"
                )
            );

        },


        /* =====================================================
           ACCESS MESSAGE
           ===================================================== */

        getAccessMessage(profile) {

            if (!profile) {

                return "اطلاعات حساب شما پیدا نشد.";

            }


            const status =
                profile.status;


            const accessStatus =
                profile.access_status;


            if (
                status === "pending" ||
                accessStatus === "pending"
            ) {

                return (
                    "ثبت‌نام شما انجام شده و در انتظار تأیید مالک است."
                );

            }


            if (
                status === "suspended" ||
                accessStatus === "suspended"
            ) {

                return (
                    "دسترسی حساب شما موقتاً غیرفعال شده است."
                );

            }


            if (
                status === "blocked" ||
                accessStatus === "blocked"
            ) {

                return (
                    "حساب شما مسدود شده است."
                );

            }


            if (
                status === "removed" ||
                accessStatus === "removed"
            ) {

                return (
                    "دسترسی شما به سامانه لغو شده است."
                );

            }


            return (
                "دسترسی شما به سامانه فعال نیست."
            );

        },


        /* =====================================================
           REQUIRE AUTH
           ===================================================== */

        async requireAuth() {


            const {
                data: {
                    session
                }
            } =
                await supabaseClient
                    .auth
                    .getSession();


            /*
             * کاربر لاگین نکرده
             */

            if (!session) {

                window.location.href =
                    "login.html";


                return null;

            }


            const user =
                session.user;


            /*
             * دریافت پروفایل
             */

            const profile =
                await this.getProfile(
                    user.id
                );


            /*
             * پروفایل پیدا نشد
             */

            if (!profile) {

                await supabaseClient
                    .auth
                    .signOut();


                window.location.href =
                    "login.html?message=" +
                    encodeURIComponent(
                        "اطلاعات حساب شما پیدا نشد."
                    );


                return null;

            }


            /*
             * بررسی دسترسی
             */

            if (
                !this.isActiveProfile(
                    profile
                )
            ) {


                const message =
                    this.getAccessMessage(
                        profile
                    );


                await supabaseClient
                    .auth
                    .signOut();


                window.location.href =
                    "login.html?message=" +
                    encodeURIComponent(
                        message
                    );


                return null;

            }


            /*
             * ثبت آخرین فعالیت
             *
             * اگر RPC وجود داشته باشد
             * اجرا می‌شود.
             *
             * خطای این قسمت نباید
             * مانع ورود شود.
             */

            try {

                await supabaseClient
                    .rpc(
                        "update_my_activity"
                    );

            }

            catch (error) {

                console.warn(
                    "update_my_activity:",
                    error
                );

            }


            return {

                user,
                profile

            };

        },


        /* =====================================================
           REQUIRE OWNER
           ===================================================== */

        async requireOwner() {


            const auth =
                await this.requireAuth();


            if (!auth) {

                return null;

            }


            const profile =
                auth.profile;


            /*
             * مالک باید owner باشد.
             *
             * برای وضعیت دسترسی همان
             * منطق requireAuth استفاده می‌شود.
             */

            if (
                profile.role !==
                "owner"
            ) {

                window.location.href =
                    "Dashboard.html";


                return null;

            }


            return auth;

        }


    };

})();
