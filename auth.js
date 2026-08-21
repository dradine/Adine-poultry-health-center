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
             * Ø³ÛØ³ØªÙ ÙØ¹ÙÛ ÙÙÚ©Ù Ø§Ø³Øª Ø§Ø² ÛÚ©Û Ø§Ø²
             * Ø¯Ù Ø³Ø§Ø®ØªØ§Ø± Ø²ÛØ± Ø§Ø³ØªÙØ§Ø¯Ù Ú©ÙØ¯:
             *
             * access_status = approved
             *
             * ÛØ§
             *
             * status = active
             *
             * ÙØ± Ø¯Ù Ø±Ø§ ÙØ¨ÙÙ ÙÛâÚ©ÙÛÙ.
             */


            const approved =
                profile.access_status ===
                "approved";


            const active =
                profile.status ===
                "active";


            /*
             * ÙØ§ÙÚ© Ù ÙØ¯ÛØ± Ø³ÛØ³ØªÙ ÙÛØ² Ø¯Ø± ØµÙØ±Øª
             * ÙØ¹Ø§Ù Ø¨ÙØ¯Ù ÙÙØ´ ÙÛâØªÙØ§ÙÙØ¯ ÙØ§Ø±Ø¯ Ø´ÙÙØ¯.
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

                return "Ø§Ø·ÙØ§Ø¹Ø§Øª Ø­Ø³Ø§Ø¨ Ø´ÙØ§ Ù¾ÛØ¯Ø§ ÙØ´Ø¯.";

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
                    "Ø«Ø¨ØªâÙØ§Ù Ø´ÙØ§ Ø§ÙØ¬Ø§Ù Ø´Ø¯Ù Ù Ø¯Ø± Ø§ÙØªØ¸Ø§Ø± ØªØ£ÛÛØ¯ ÙØ§ÙÚ© Ø§Ø³Øª."
                );

            }


            if (
                status === "suspended" ||
                accessStatus === "suspended"
            ) {

                return (
                    "Ø¯Ø³ØªØ±Ø³Û Ø­Ø³Ø§Ø¨ Ø´ÙØ§ ÙÙÙØªØ§Ù ØºÛØ±ÙØ¹Ø§Ù Ø´Ø¯Ù Ø§Ø³Øª."
                );

            }


            if (
                status === "blocked" ||
                accessStatus === "blocked"
            ) {

                return (
                    "Ø­Ø³Ø§Ø¨ Ø´ÙØ§ ÙØ³Ø¯ÙØ¯ Ø´Ø¯Ù Ø§Ø³Øª."
                );

            }


            if (
                status === "removed" ||
                accessStatus === "removed"
            ) {

                return (
                    "Ø¯Ø³ØªØ±Ø³Û Ø´ÙØ§ Ø¨Ù Ø³Ø§ÙØ§ÙÙ ÙØºÙ Ø´Ø¯Ù Ø§Ø³Øª."
                );

            }


            return (
                "Ø¯Ø³ØªØ±Ø³Û Ø´ÙØ§ Ø¨Ù Ø³Ø§ÙØ§ÙÙ ÙØ¹Ø§Ù ÙÛØ³Øª."
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
             * Ú©Ø§Ø±Ø¨Ø± ÙØ§Ú¯ÛÙ ÙÚ©Ø±Ø¯Ù
             */

            if (!session) {

                window.location.href =
                    "login.html";


                return null;

            }


            const user =
                session.user;


            /*
             * Ø¯Ø±ÛØ§ÙØª Ù¾Ø±ÙÙØ§ÛÙ
             */

            const profile =
                await this.getProfile(
                    user.id
                );


            /*
             * Ù¾Ø±ÙÙØ§ÛÙ Ù¾ÛØ¯Ø§ ÙØ´Ø¯
             */

            if (!profile) {

                await supabaseClient
                    .auth
                    .signOut();


                window.location.href =
                    "login.html?message=" +
                    encodeURIComponent(
                        "Ø§Ø·ÙØ§Ø¹Ø§Øª Ø­Ø³Ø§Ø¨ Ø´ÙØ§ Ù¾ÛØ¯Ø§ ÙØ´Ø¯."
                    );


                return null;

            }


            /*
             * Ø¨Ø±Ø±Ø³Û Ø¯Ø³ØªØ±Ø³Û
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
             * Ø«Ø¨Øª Ø¢Ø®Ø±ÛÙ ÙØ¹Ø§ÙÛØª
             *
             * Ø§Ú¯Ø± RPC ÙØ¬ÙØ¯ Ø¯Ø§Ø´ØªÙ Ø¨Ø§Ø´Ø¯
             * Ø§Ø¬Ø±Ø§ ÙÛâØ´ÙØ¯.
             *
             * Ø®Ø·Ø§Û Ø§ÛÙ ÙØ³ÙØª ÙØ¨Ø§ÛØ¯
             * ÙØ§ÙØ¹ ÙØ±ÙØ¯ Ø´ÙØ¯.
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
             * ÙØ§ÙÚ© Ø¨Ø§ÛØ¯ owner Ø¨Ø§Ø´Ø¯.
             *
             * Ø¨Ø±Ø§Û ÙØ¶Ø¹ÛØª Ø¯Ø³ØªØ±Ø³Û ÙÙØ§Ù
             * ÙÙØ·Ù requireAuth Ø§Ø³ØªÙØ§Ø¯Ù ÙÛâØ´ÙØ¯.
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
