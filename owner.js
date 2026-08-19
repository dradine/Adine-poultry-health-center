document.addEventListener("DOMContentLoaded", async () => {

    const auth = await AdineAuth.requireOwner();

    if (!auth) {
        return;
    }


    const tbody = document.getElementById("usersTableBody");
    const message = document.getElementById("message");
    const logout = document.getElementById("logoutButton");


    if (!tbody) {
        console.error("usersTableBody not found.");
        return;
    }


    function showMessage(text, type = "success") {

        if (!message) {
            return;
        }

        message.textContent = text;

        message.className = "message " + type;

        message.classList.remove("hidden");
    }


    function statusText(status) {

        const map = {

            pending:
                "در انتظار تأیید",

            approved:
                "فعال",

            disabled:
                "موقتاً غیرفعال",

            blocked:
                "مسدود"

        };

        return map[status] || status || "نامشخص";
    }


    function statusClass(status) {

        return "status-badge status-" + (status || "unknown");
    }


    function formatDate(date) {

        if (!date) {
            return "—";
        }

        try {

            return new Date(date).toLocaleString(
                "fa-IR",
                {
                    dateStyle: "short",
                    timeStyle: "short"
                }
            );

        } catch (error) {

            console.error(error);

            return "—";
        }
    }


    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    function renderActionButtons(user) {

        if (user.role === "owner") {

            return `
                <strong>
                    مالک
                </strong>
            `;
        }


        let actions = "";


        /*
         * تأیید / فعال‌سازی
         */

        if (user.status !== "approved") {

            actions += `
                <button
                    type="button"
                    class="action-button action-active"
                    data-id="${user.id}"
                    data-status="approved"
                >
                    تأیید / فعال‌سازی
                </button>
            `;
        }


        /*
         * غیرفعال موقت
         */

        if (user.status !== "disabled") {

            actions += `
                <button
                    type="button"
                    class="action-button action-suspend"
                    data-id="${user.id}"
                    data-status="disabled"
                >
                    غیرفعال موقت
                </button>
            `;
        }


        /*
         * مسدود کردن
         */

        if (user.status !== "blocked") {

            actions += `
                <button
                    type="button"
                    class="action-button action-block"
                    data-id="${user.id}"
                    data-status="blocked"
                >
                    مسدود
                </button>
            `;
        }


        return actions;
    }


    async function loadUsers() {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    در حال بارگذاری کاربران...
                </td>
            </tr>
        `;


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .select(`
                        id,
                        email,
                        full_name,
                        role,
                        status,
                        created_at,
                        updated_at
                    `)
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "LOAD USERS ERROR:",
                    error
                );


                tbody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            <strong>
                                خطا در دریافت کاربران
                            </strong>
                            <br>
                            <small>
                                ${escapeHtml(
                                    error.message ||
                                    "خطای نامشخص"
                                )}
                            </small>
                        </td>
                    </tr>
                `;

                showMessage(
                    error.message ||
                    "خطا در دریافت کاربران.",
                    "error"
                );

                return;
            }


            if (!data || data.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            هنوز کاربری ثبت نشده است.
                        </td>
                    </tr>
                `;

                return;
            }


            tbody.innerHTML = "";


            data.forEach(user => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHtml(
                            user.full_name ||
                            "—"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            user.email ||
                            "—"
                        )}
                    </td>


                    <td>

                        <span
                            class="${statusClass(
                                user.status
                            )}"
                        >

                            ${statusText(
                                user.status
                            )}

                        </span>

                    </td>


                    <td>
                        ${formatDate(
                            user.created_at
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            user.updated_at
                        )}
                    </td>


                    <td>
                        <div class="user-actions">
                            ${renderActionButtons(
                                user
                            )}
                        </div>
                    </td>

                `;


                tbody.appendChild(row);

            });

        } catch (error) {

            console.error(
                "LOAD USERS EXCEPTION:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        خطا در دریافت کاربران.
                    </td>
                </tr>
            `;


            showMessage(
                "خطایی هنگام دریافت کاربران رخ داد.",
                "error"
            );
        }
    }


    /*
     * تغییر وضعیت کاربر
     */

    tbody.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "button[data-status]"
                );


            if (!button) {
                return;
            }


            const userId =
                button.dataset.id;


            const newStatus =
                button.dataset.status;


            if (!userId || !newStatus) {
                return;
            }


            let confirmation =
                "آیا مطمئن هستید؟";


            if (
                newStatus ===
                "approved"
            ) {

                confirmation =
                    "آیا این کاربر تأیید و فعال شود؟";
            }


            if (
                newStatus ===
                "disabled"
            ) {

                confirmation =
                    "آیا دسترسی این کاربر موقتاً غیرفعال شود؟";
            }


            if (
                newStatus ===
                "blocked"
            ) {

                confirmation =
                    "آیا این کاربر مسدود شود؟";
            }


            if (
                !window.confirm(
                    confirmation
                )
            ) {

                return;
            }


            button.disabled = true;


            const originalText =
                button.textContent;


            button.textContent =
                "در حال انجام...";


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .rpc(
                            "owner_set_user_status",
                            {
                                target_user_id:
                                    userId,

                                new_status:
                                    newStatus
                            }
                        );


                if (error) {

                    console.error(
                        "STATUS UPDATE ERROR:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "تغییر وضعیت انجام نشد.",
                        "error"
                    );


                    return;
                }


                showMessage(
                    "وضعیت کاربر با موفقیت تغییر کرد.",
                    "success"
                );


                await loadUsers();


            } catch (error) {

                console.error(
                    "STATUS UPDATE EXCEPTION:",
                    error
                );


                showMessage(
                    error.message ||
                    "خطایی هنگام تغییر وضعیت رخ داد.",
                    "error"
                );


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    originalText;
            }

        }
    );


    /*
     * خروج مالک
     */

    if (logout) {

        logout.addEventListener(
            "click",
            async () => {

                logout.disabled = true;

                try {

                    await AdineAuth.signOut();

                } catch (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );

                    logout.disabled = false;
                }

            }
        );
    }


    /*
     * دریافت اولیه کاربران
     */

    await loadUsers();


    /*
     * بروزرسانی خودکار هر 30 ثانیه
     */

    setInterval(
        loadUsers,
        30000
    );

});
