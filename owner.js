document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const auth =
            await AdineAuth
                .requireOwner();

        if (!auth) {
            return;
        }


        const tbody =
            document.getElementById(
                "usersTableBody"
            );

        const message =
            document.getElementById(
                "message"
            );

        const logout =
            document.getElementById(
                "logoutButton"
            );


        function showMessage(
            text,
            type = "success"
        ) {

            message.textContent =
                text;

            message.className =
                "message " + type;

            message.classList.remove(
                "hidden"
            );

        }


        function statusText(
            status
        ) {

            const map = {

                pending:
                    "در انتظار تأیید",

                active:
                    "فعال",

                suspended:
                    "موقتاً غیرفعال",

                blocked:
                    "مسدود",

                removed:
                    "اخراج‌شده"

            };

            return (
                map[status] ||
                status
            );
        }


        function statusClass(
            status
        ) {

            return (
                "status-badge status-" +
                status
            );
        }


        function formatDate(
            date
        ) {

            if (!date) {
                return "—";
            }

            return new Date(
                date
            ).toLocaleString(
                "fa-IR",
                {
                    dateStyle:
                        "short",
                    timeStyle:
                        "short"
                }
            );
        }


        async function loadUsers() {

            tbody.innerHTML =
                `<tr>
                    <td colspan="6">
                        در حال بارگذاری...
                    </td>
                </tr>`;


            const {
                data,
                error
            } =
            await supabaseClient
                .from("profiles")
                .select(
                    `
                    id,
                    email,
                    full_name,
                    role,
                    status,
                    created_at,
                    updated_at,
                    last_seen_at,
                    last_activity_at
                    `
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


            if (error) {

                console.error(error);

                tbody.innerHTML =
                    `<tr>
                        <td colspan="6">
                            خطا در دریافت کاربران
                        </td>
                    </tr>`;

                return;
            }


            if (!data.length) {

                tbody.innerHTML =
                    `<tr>
                        <td colspan="6">
                            هنوز کاربری ثبت نشده است.
                        </td>
                    </tr>`;

                return;
            }


            tbody.innerHTML = "";


            data.forEach(
                user => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    let actions =
                        "";


                    if (
                        user.role !==
                        "owner"
                    ) {

                        if (
                            user.status !==
                            "active"
                        ) {

                            actions +=
                                `<button
                                    class="action-button action-active"
                                    data-id="${user.id}"
                                    data-status="active"
                                >
                                    فعال‌سازی
                                </button>`;

                        }


                        if (
                            user.status !==
                            "suspended"
                        ) {

                            actions +=
                                `<button
                                    class="action-button action-suspend"
                                    data-id="${user.id}"
                                    data-status="suspended"
                                >
                                    غیرفعال موقت
                                </button>`;

                        }


                        if (
                            user.status !==
                            "blocked"
                        ) {

                            actions +=
                                `<button
                                    class="action-button action-block"
                                    data-id="${user.id}"
                                    data-status="blocked"
                                >
                                    مسدود
                                </button>`;

                        }


                        if (
                            user.status !==
                            "removed"
                        ) {

                            actions +=
                                `<button
                                    class="action-button action-block"
                                    data-id="${user.id}"
                                    data-status="removed"
                                >
                                    اخراج
                                </button>`;

                        }

                    } else {

                        actions =
                            `<strong>
                                مالک
                            </strong>`;
                    }


                    row.innerHTML = `

                        <td>
                            ${escapeHtml(
                                user.full_name ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                user.email
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
                                user.last_activity_at
                            )}
                        </td>

                        <td>
                            ${actions}
                        </td>

                    `;


                    tbody.appendChild(
                        row
                    );

                }
            );

        }


        function escapeHtml(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );

            div.textContent =
                value;

            return div.innerHTML;
        }


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


                let confirmation =
                    "آیا این تغییر انجام شود؟";


                if (
                    newStatus ===
                    "removed"
                ) {

                    confirmation =
                        "آیا مطمئن هستید که می‌خواهید دسترسی این کاربر را لغو کنید؟";

                }


                if (
                    !confirm(
                        confirmation
                    )
                ) {
                    return;
                }


                button.disabled =
                    true;


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
                            error
                        );

                        showMessage(
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
                        error
                    );

                    showMessage(
                        "خطایی رخ داد.",
                        "error"
                    );

                } finally {

                    button.disabled =
                        false;

                }

            }
        );


        logout.addEventListener(
            "click",
            async () => {

                await AdineAuth
                    .signOut();

            }
        );


        await loadUsers();


        setInterval(
            loadUsers,
            30000
        );

    }
);
