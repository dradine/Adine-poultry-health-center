

/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HOUSES + FLOCKS
   SUPABASE
========================================================= */

let currentUser = null;
let selectedFarm = null;
let houses = [];
let flocks = [];

let jalaliPicker = null;
let jalaliPickerYear = null;
let jalaliPickerMonth = null;


/* =========================================================
   NUMBER NORMALIZATION
========================================================= */

function normalizeNumbers(value) {

    return String(value ?? "")
        .replace(/[۰-۹]/g, function(char) {

            return String(
                char.charCodeAt(0) - 1776
            );

        })
        .replace(/[٠-٩]/g, function(char) {

            return String(
                char.charCodeAt(0) - 1632
            );

        })
        .replace(/[٬،]/g, ",")
        .replace(/,/g, "")
        .trim();

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeFlocks
);


async function initializeFlocks() {

    /*
     * اول UI را آماده می‌کنیم.
     * این ترتیب مهم است؛ خطای دریافت فارم نباید
     * مانع اجرای تقویم شمسی شود.
     */

    try {
        setupHouseForm();
    } catch (error) {
        console.error(
            "House form initialization error:",
            error
        );
    }


    try {
        setupFlockForm();
    } catch (error) {
        console.error(
            "Flock form initialization error:",
            error
        );
    }


    try {
        setupGenetics();
    } catch (error) {
        console.error(
            "Genetics initialization error:",
            error
        );
    }


    try {
        setupJalaliDate();
    } catch (error) {
        console.error(
            "Jalali calendar initialization error:",
            error
        );
    }


    /*
     * سپس احراز هویت و اطلاعات فارم.
     */

    try {

        const access =
            await checkUserAccess();


        if (!access || !access.authenticated) {

            window.location.href =
                "login.html?message=" +
                encodeURIComponent(
                    "ابتدا وارد سامانه شوید."
                );

            return;

        }


        if (!access.allowed) {

            alert(
                "حساب شما هنوز توسط مدیریت تأیید نشده است."
            );

            await logoutUser();

            return;

        }


        currentUser =
            access.user;


        await loadSelectedFarm();


    } catch (error) {

        console.error(
            "Flocks initialization error:",
            error
        );


        const selectedFarmElement =
            document.getElementById(
                "selectedFarm"
            );


        if (selectedFarmElement) {

            selectedFarmElement.innerHTML = `

                <div class="info-box">

                    خطا در دریافت اطلاعات فارم.

                    <br><br>

                    ${escapeHTML(
                        error.message ||
                        "خطای نامشخص"
                    )}

                    <br><br>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick="location.reload()"
                    >
                        تلاش مجدد
                    </button>

                </div>

            `;

        }

    }

}


/* =========================================================
   SELECTED FARM
========================================================= */

async function loadSelectedFarm() {

    let selection =
        getCurrentSelection();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlFarmId =
        params.get("farm") ||
        params.get("farm_id");


    if (
        !selection.farmId &&
        urlFarmId
    ) {

        setCurrentSelection({

            farmId:
                urlFarmId,

            houseId:
                null,

            flockId:
                null

        });


        selection =
            getCurrentSelection();

    }


    /*
     * اگر فارم انتخاب نشده، لیست فارم‌ها را نشان بده.
     */

    if (!selection.farmId) {

        await renderFarmChooser();

        disableForms();

        return;

    }


    if (
        typeof supabaseClient ===
        "undefined" ||
        !supabaseClient
    ) {

        throw new Error(
            "اتصال Supabase برقرار نیست."
        );

    }


    /*
     * خواندن فارم.
     * owner_id حفظ شده چون ساختار فعلی پروژه
     * بر اساس مالکیت داده‌ها طراحی شده است.
     */

    const {
        data,
        error
    } =
        await supabaseClient

            .from("farms")

            .select("*")

            .eq(
                "id",
                selection.farmId
            )

            .eq(
                "owner_id",
                currentUser.id
            )

            .maybeSingle();


    if (error) {

        console.error(
            "Farm loading error:",
            error
        );


        selectedFarm =
            null;


        setCurrentSelection({

            farmId:
                null,

            houseId:
                null,

            flockId:
                null

        });


        await renderFarmChooser();

        disableForms();

        return;

    }


    if (!data) {

        selectedFarm =
            null;


        setCurrentSelection({

            farmId:
                null,

            houseId:
                null,

            flockId:
                null

        });


        await renderFarmChooser();

        disableForms();

        return;

    }


    selectedFarm =
        data;


    const selectedFarmElement =
        document.getElementById(
            "selectedFarm"
        );


    if (selectedFarmElement) {

        selectedFarmElement.innerHTML = `

            <div class="farm-summary">

                <strong>
                    🏭
                    ${escapeHTML(
                        data.name ||
                        "بدون نام"
                    )}
                </strong>

                <br>

                کد:
                ${escapeHTML(
                    data.farm_code ||
                    "-"
                )}

                <br>

                ظرفیت:
                ${
                    data.capacity !== null &&
                    data.capacity !== undefined

                        ? Number(
                            data.capacity
                        ).toLocaleString(
                            "fa-IR"
                        )

                        : "-"
                }

            </div>

        `;

    }


    await loadHouses();

    await loadFlocks();

    enableForms();

}


/* =========================================================
   FARM CHOOSER
========================================================= */

async function renderFarmChooser() {

    const container =
        document.getElementById(
            "selectedFarm"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="info-box">

            در حال دریافت فهرست فارم‌ها...

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("farms")

                .select(
                    "id,name,farm_code,capacity,created_at"
                )

                .eq(
                    "owner_id",
                    currentUser.id
                )

                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        const farms =
            data || [];


        if (!farms.length) {

            container.innerHTML = `

                <div class="info-box">

                    هنوز فارمی برای این حساب ثبت نشده است.

                    <br><br>

                    <button
                        class="btn btn-primary"
                        type="button"
                        onclick="location.href='Farms.html'"
                    >
                        ثبت / انتخاب فارم
                    </button>

                </div>

            `;

            return;

        }


        container.innerHTML = `

            <div class="form-group">

                <label for="directFarmSelect">
                    انتخاب فارم
                </label>

                <select
                    id="directFarmSelect"
                >

                    <option value="">
                        انتخاب فارم
                    </option>

                </select>

            </div>

        `;


        const select =
            document.getElementById(
                "directFarmSelect"
            );


        farms.forEach(
            farm => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    farm.id;


                option.textContent =
                    (
                        farm.name ||
                        "بدون نام"
                    ) +
                    (
                        farm.farm_code
                            ? " — " +
                              farm.farm_code
                            : ""
                    );


                select.appendChild(
                    option
                );

            }
        );


        select.addEventListener(
            "change",
            async function () {

                if (!this.value) {

                    return;

                }


                setCurrentSelection({

                    farmId:
                        this.value,

                    houseId:
                        null,

                    flockId:
                        null

                });


                await loadSelectedFarm();

            }
        );

    }

    catch (error) {

        console.error(
            "Farm chooser error:",
            error
        );


        container.innerHTML = `

            <div class="info-box">

                دریافت فهرست فارم‌ها انجام نشد.

                <br><br>

                ${escapeHTML(
                    error.message ||
                    "خطای نامشخص"
                )}

                <br><br>

                <button
                    class="btn btn-secondary"
                    type="button"
                    onclick="location.reload()"
                >
                    تلاش مجدد
                </button>

            </div>

        `;

    }

}


/* =========================================================
   ENABLE / DISABLE
========================================================= */

function enableForms() {

    [
        "houseForm",
        "flockForm"
    ]
    .forEach(
        id => {

            const form =
                document.getElementById(
                    id
                );


            if (!form) {

                return;

            }


            Array
                .from(
                    form.elements
                )
                .forEach(
                    element => {

                        element.disabled =
                            false;

                    }
                );

        }
    );

}


function disableForms() {

    [
        "houseForm",
        "flockForm"
    ]
    .forEach(
        id => {

            const form =
                document.getElementById(
                    id
                );


            if (!form) {

                return;

            }


            Array
                .from(
                    form.elements
                )
                .forEach(
                    element => {

                        element.disabled =
                            true;

                    }
                );

        }
    );

}


/* =========================================================
   HOUSES
========================================================= */

async function loadHouses() {

    if (
        !selectedFarm ||
        !selectedFarm.id
    ) {

        houses = [];

        renderHouses();

        updateHouseSelect();

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient

            .from("houses")

            .select("*")

            .eq(
                "farm_id",
                selectedFarm.id
            )

            .eq(
                "owner_id",
                currentUser.id
            )

            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Houses loading error:",
            error
        );


        houses = [];


        const container =
            document.getElementById(
                "housesList"
            );


        if (container) {

            container.innerHTML = `

                <div class="info-box">

                    خطا در دریافت سالن‌ها.

                    <br><br>

                    ${escapeHTML(
                        error.message ||
                        "خطای نامشخص"
                    )}

                </div>

            `;

        }


        updateHouseSelect();

        return;

    }


    houses =
        data || [];


    renderHouses();

    updateHouseSelect();

}


/* =========================================================
   HOUSE FORM
========================================================= */

function setupHouseForm() {

    const form =
        document.getElementById(
            "houseForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        saveHouse
    );

}


/* =========================================================
   SAVE HOUSE
========================================================= */

async function saveHouse(
    event
) {

    event.preventDefault();


    if (!selectedFarm) {

        alert(
            "ابتدا یک فارم انتخاب کنید."
        );

        return;

    }


    const name =
        getValue("houseName");


    if (!name) {

        alert(
            "نام سالن را وارد کنید."
        );

        return;

    }


    const payload = {

        farm_id:
            selectedFarm.id,

        owner_id:
            currentUser.id,

        name,

        house_code:
            getValue("houseCode"),

        capacity:
            getNumber("houseCapacity"),

        length_m:
            getNumber("houseLength"),

        width_m:
            getNumber("houseWidth"),

        ventilation_type:
            getValue("houseVentilation"),

        housing_system:
            getValue("houseSystem"),

        notes:
            getValue("houseNotes"),

        is_active:
            true

    };


    const button =
        event.target.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "در حال ذخیره...";

    }


    try {

        const {
            error
        } =
            await supabaseClient

                .from("houses")

                .insert(
                    payload
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "ذخیره سالن انجام نشد:\n" +
                error.message
            );

            return;

        }


        event.target.reset();


        await loadHouses();


        alert(
            "سالن با موفقیت ثبت شد."
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "ذخیره سالن";

        }

    }

}


/* =========================================================
   HOUSE RENDER
========================================================= */

function renderHouses() {

    const container =
        document.getElementById(
            "housesList"
        );


    if (!container) {

        return;

    }


    if (!houses.length) {

        container.innerHTML = `

            <div class="info-box">

                هنوز سالنی برای این فارم ثبت نشده است.

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            سالن
                        </th>

                        <th>
                            کد
                        </th>

                        <th>
                            ظرفیت
                        </th>

                        <th>
                            سیستم
                        </th>

                        <th>
                            عملیات
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        houses
                            .map(
                                house => `

                                    <tr>

                                        <td>
                                            ${escapeHTML(
                                                house.name ||
                                                "-"
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                house.house_code ||
                                                "-"
                                            )}
                                        </td>

                                        <td>
                                            ${
                                                house.capacity !== null &&
                                                house.capacity !== undefined
                                                    ? Number(
                                                        house.capacity
                                                    ).toLocaleString(
                                                        "fa-IR"
                                                    )
                                                    : "-"
                                            }
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                house.housing_system ||
                                                "-"
                                            )}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                class="btn btn-secondary"
                                                onclick="selectHouse('${house.id}')"
                                            >
                                                انتخاب
                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-danger"
                                                onclick="deleteHouse('${house.id}')"
                                            >
                                                حذف
                                            </button>

                                        </td>

                                    </tr>

                                `
                            )
                            .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   HOUSE SELECT
========================================================= */

function updateHouseSelect() {

    const select =
        document.getElementById(
            "flockHouse"
        );


    if (!select) {

        return;

    }


    const selectedId =
        getCurrentSelection().houseId;


    select.innerHTML = `

        <option value="">
            انتخاب سالن
        </option>

    `;


    houses.forEach(
        house => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                house.id;


            option.textContent =
                house.name ||
                "بدون نام";


            if (
                selectedId &&
                selectedId === house.id
            ) {

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   SELECT HOUSE
========================================================= */

function selectHouse(
    houseId
) {

    const house =
        houses.find(
            item =>
                item.id ===
                houseId
        );


    if (!house) {

        return;

    }


    setCurrentSelection({

        farmId:
            selectedFarm.id,

        houseId:
            house.id

    });


    const select =
        document.getElementById(
            "flockHouse"
        );


    if (select) {

        select.value =
            house.id;

    }


    document
        .getElementById(
            "flockForm"
        )
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================================================
   DELETE HOUSE
========================================================= */

async function deleteHouse(
    houseId
) {

    const house =
        houses.find(
            item =>
                item.id ===
                houseId
        );


    if (!house) {

        return;

    }


    const confirmed =
        confirm(
            "حذف سالن «" +
            (
                house.name ||
                ""
            ) +
            "»؟\n\nاین عملیات قابل بازگشت نیست."
        );


    if (!confirmed) {

        return;

    }


    const secondConfirm =
        prompt(
            "برای تأیید حذف، کلمه «حذف» را وارد کنید."
        );


    if (
        secondConfirm !==
        "حذف"
    ) {

        return;

    }


    const {
        error
    } =
        await supabaseClient

            .from("houses")

            .delete()

            .eq(
                "id",
                houseId
            )

            .eq(
                "farm_id",
                selectedFarm.id
            );


    if (error) {

        alert(
            "حذف سالن انجام نشد:\n" +
            error.message
        );

        return;

    }


    const selection =
        getCurrentSelection();


    if (
        selection.houseId ===
        houseId
    ) {

        setCurrentSelection({

            houseId:
                null

        });

    }


    await loadHouses();

}


/* =========================================================
   GENETICS
========================================================= */

function setupGenetics() {

    const production =
        document.getElementById(
            "productionType"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const strain =
        document.getElementById(
            "flockStrain"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    if (
        !production ||
        !genetics ||
        !strain ||
        !program
    ) {

        return;

    }


    production.addEventListener(
        "change",
        updateGenetics
    );


    genetics.addEventListener(
        "change",
        updatePrograms
    );


    updateGenetics();

}


/* =========================================================
   UPDATE GENETICS
========================================================= */

function updateGenetics() {

    const type =
        getValue(
            "productionType"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const strain =
        document.getElementById(
            "flockStrain"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    if (
        !genetics ||
        !strain ||
        !program
    ) {

        return;

    }


    genetics.innerHTML =
        `
            <option value="">
                انتخاب شرکت / ژنتیک
            </option>
        `;


    strain.innerHTML =
        `
            <option value="">
                انتخاب سویه / خط ژنتیکی
            </option>
        `;


    program.innerHTML =
        `
            <option value="">
                انتخاب خودکار
            </option>
        `;


    const catalog =
        typeof getGenetics ===
        "function"

            ? getGenetics(type)

            : (
                window.POULTRY_CATALOG?.[
                    type
                ]?.genetics ||
                []
            );


    (
        catalog ||
        []
    ).forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.name;


            genetics.appendChild(
                option
            );

        }
    );


    genetics.disabled =
        !(
            catalog &&
            catalog.length
        );


    strain.disabled =
        true;


    program.disabled =
        true;

}


/* =========================================================
   UPDATE PROGRAMS
========================================================= */

function updatePrograms() {

    const type =
        getValue(
            "productionType"
        );


    const geneticsId =
        getValue(
            "genetics"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const strain =
        document.getElementById(
            "flockStrain"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    if (
        !genetics ||
        !strain ||
        !program
    ) {

        return;

    }


    strain.innerHTML =
        `
            <option value="">
                انتخاب سویه / خط ژنتیکی
            </option>
        `;


    program.innerHTML =
        `
            <option value="">
                انتخاب خودکار
            </option>
        `;


    if (!geneticsId) {

        strain.disabled =
            true;

        program.disabled =
            true;

        return;

    }


    const strains =
        typeof getStrains ===
        "function"

            ? getStrains(
                type,
                geneticsId
            )

            : (
                window.POULTRY_CATALOG?.[
                    type
                ]?.genetics ||
                []
            )
            .find(
                g =>
                    g.id ===
                    geneticsId
            )
            ?.strains ||
            [];


    (
        strains ||
        []
    ).forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item;


            option.textContent =
                item;


            strain.appendChild(
                option
            );

        }
    );


    strain.disabled =
        !(
            strains &&
            strains.length
        );


    program.disabled =
        false;


    const first =
        strain.options.length >
        1
            ? strain.options[1]
            : null;


    if (
        first &&
        strains.length === 1
    ) {

        strain.value =
            first.value;

    }


    updateStrainProgram();


    strain.onchange =
        updateStrainProgram;

}


/* =========================================================
   UPDATE STRAIN PROGRAM
========================================================= */

function updateStrainProgram() {

    const type =
        getValue(
            "productionType"
        );


    const geneticsId =
        getValue(
            "genetics"
        );


    const strainValue =
        getValue(
            "flockStrain"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const program =
        document.getElementById(
            "flockProgram"
        );


    if (!program) {

        return;

    }


    program.innerHTML =
        `
            <option value="">
                انتخاب استاندارد / برنامه
            </option>
        `;


    if (!geneticsId) {

        program.disabled =
            true;

        return;

    }


    const company =
        genetics
            ?.selectedOptions
            ?.[0]
            ?.textContent ||
        geneticsId;


    const option =
        document.createElement(
            "option"
        );


    option.value =
        `${type}_${geneticsId}_${strainValue || "default"}`;


    option.textContent =
        `استاندارد ${company}` +
        (
            strainValue
                ? " — " +
                  strainValue
                : ""
        );


    program.appendChild(
        option
    );


    program.disabled =
        false;

}


/* =========================================================
   FLOCKS
========================================================= */

async function loadFlocks() {

    if (
        !selectedFarm ||
        !selectedFarm.id
    ) {

        flocks = [];

        renderFlocks();

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient

            .from("flocks")

            .select("*")

            .eq(
                "farm_id",
                selectedFarm.id
            )

            .eq(
                "owner_id",
                currentUser.id
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Flocks loading error:",
            error
        );


        flocks = [];


        const container =
            document.getElementById(
                "flocksList"
            );


        if (container) {

            container.innerHTML = `

                <div class="info-box">

                    خطا در دریافت گله‌ها.

                    <br><br>

                    ${escapeHTML(
                        error.message ||
                        "خطای نامشخص"
                    )}

                </div>

            `;

        }


        return;

    }


    flocks =
        data || [];


    renderFlocks();

}


/* =========================================================
   FLOCK FORM
========================================================= */

function setupFlockForm() {

    const form =
        document.getElementById(
            "flockForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        saveFlock
    );


    const houseSelect =
        document.getElementById(
            "flockHouse"
        );


    if (houseSelect) {

        houseSelect.addEventListener(
            "change",
            function () {

                setCurrentSelection({

                    houseId:
                        this.value ||
                        null

                });

            }
        );

    }

}


/* =========================================================
   SAVE FLOCK
========================================================= */

async function saveFlock(
    event
) {

    event.preventDefault();


    if (!selectedFarm) {

        alert(
            "ابتدا یک فارم انتخاب کنید."
        );

        return;

    }


    const houseId =
        getValue(
            "flockHouse"
        );


    if (!houseId) {

        alert(
            "سالن را انتخاب کنید."
        );

        return;

    }


    const name =
        getValue(
            "flockName"
        );


    const productionType =
        getValue(
            "productionType"
        );


    if (
        !name ||
        !productionType
    ) {

        alert(
            "نام گله و نوع پرورش الزامی است."
        );

        return;

    }


    const jalaliDate =
        getValue(
            "placementDate"
        );


    let gregorianDate =
        null;


    if (jalaliDate) {

        gregorianDate =
            jalaliToGregorianISO(
                jalaliDate
            );


        if (!gregorianDate) {

            alert(
                "تاریخ ورود گله را به صورت ۱۴۰۵/۰۵/۲۹ وارد کنید."
            );

            return;

        }

    }


    const payload = {

        farm_id:
            selectedFarm.id,

        house_id:
            houseId,

        owner_id:
            currentUser.id,

        flock_name:
            name,

        production_type:
            productionType,

        genetics:
            getValue(
                "genetics"
            ),

        strain:
            getValue(
                "flockStrain"
            ) ||
            getValue(
                "genetics"
            ),

        program:
            getValue(
                "flockProgram"
            ),

        sex:
            getValue(
                "flockSex"
            ) ||
            "mixed",

        initial_bird_count:
            getNumber(
                "birdCount"
            ),

        current_bird_count:
            getNumber(
                "birdCount"
            ),

        placement_date:
            gregorianDate,

        start_age_days:
            getNumber(
                "startAgeDays"
            ),

        status:
            "active",

        notes:
            getValue(
                "flockNotes"
            )

    };


    const button =
        event.target.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "در حال ذخیره...";

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("flocks")

                .insert(
                    payload
                )

                .select()
                .single();


        if (error) {

            console.error(
                "Save flock error:",
                error
            );


            alert(
                "ذخیره گله انجام نشد:\n" +
                error.message
            );

            return;

        }


        setCurrentSelection({

            farmId:
                selectedFarm.id,

            houseId:
                houseId,

            flockId:
                data.id

        });


        event.target.reset();


        const startAge =
            document.getElementById(
                "startAgeDays"
            );


        if (startAge) {

            startAge.value =
                "۱";

        }


        updateGenetics();


        await loadFlocks();


        alert(
            "گله با موفقیت ثبت شد."
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "ذخیره گله";

        }

    }

}


/* =========================================================
   BASIC HELPERS
========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return normalizeNumbers(
        element.value
    );

}


function getNumber(
    id
) {

    const value =
        getValue(id);


    if (!value) {

        return null;

    }


    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : null;

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   JALALI
========================================================= */

function toPersianDigits(
    value
) {

    return String(value)
        .replace(
            /\d/g,
            function(char) {

                return (
                    "۰۱۲۳۴۵۶۷۸۹"
                )[Number(char)];

            }
        );

}


/* =========================================================
   JALALI INPUT
========================================================= */

function setupJalaliDate() {

    const input =
        document.getElementById(
            "placementDate"
        );


    if (!input) {

        return;

    }


    input.removeAttribute(
        "disabled"
    );


    input.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openJalaliPicker();

        }
    );


    input.addEventListener(
        "focus",
        function() {

            openJalaliPicker();

        }
    );


    createJalaliPicker();

}


/* =========================================================
   CREATE CALENDAR
========================================================= */

function createJalaliPicker() {

    const old =
        document.getElementById(
            "jalaliDatePicker"
        );


    if (old) {

        jalaliPicker =
            old;

        return;

    }


    const picker =
        document.createElement(
            "div"
        );


    picker.id =
        "jalaliDatePicker";


    picker.style.cssText = `

        position:fixed;
        z-index:999999;
        background:#ffffff;
        border:1px solid #d9d9d9;
        border-radius:14px;
        box-shadow:0 10px 35px rgba(0,0,0,.18);
        padding:12px;
        width:min(330px,calc(100vw - 24px));
        display:none;
        direction:rtl;
        font-family:inherit;

    `;


    document.body.appendChild(
        picker
    );


    jalaliPicker =
        picker;


    document.addEventListener(
        "click",
        function(event) {

            const input =
                document.getElementById(
                    "placementDate"
                );


            if (
                !jalaliPicker ||
                jalaliPicker.style.display ===
                "none"
            ) {

                return;

            }


            if (
                jalaliPicker.contains(
                    event.target
                ) ||
                event.target ===
                input
            ) {

                return;

            }


            closeJalaliPicker();

        }
    );

}


/* =========================================================
   OPEN CALENDAR
========================================================= */

function openJalaliPicker() {

    const input =
        document.getElementById(
            "placementDate"
        );


    if (!input) {

        return;

    }


    if (!jalaliPicker) {

        createJalaliPicker();

    }


    const value =
        normalizeNumbers(
            input.value
        );


    const parts =
        value.split("/");


    if (
        parts.length === 3 &&
        Number(parts[0]) >= 1200 &&
        Number(parts[1]) >= 1 &&
        Number(parts[1]) <= 12
    ) {

        jalaliPickerYear =
            Number(parts[0]);

        jalaliPickerMonth =
            Number(parts[1]);

    }


    if (
        !jalaliPickerYear ||
        !jalaliPickerMonth
    ) {

        const now =
            new Date();


        const today =
            gregorianToJalali(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate()
            );


        jalaliPickerYear =
            today.jy;

        jalaliPickerMonth =
            today.jm;

    }


    renderJalaliPicker();


    const rect =
        input.getBoundingClientRect();


    const pickerWidth =
        Math.min(
            330,
            window.innerWidth - 24
        );


    let left =
        rect.left;


    if (
        left + pickerWidth >
        window.innerWidth - 12
    ) {

        left =
            window.innerWidth -
            pickerWidth -
            12;

    }


    if (left < 12) {

        left =
            12;

    }


    let top =
        rect.bottom + 8;


    const estimatedHeight =
        360;


    if (
        top + estimatedHeight >
        window.innerHeight
    ) {

        top =
            rect.top -
            estimatedHeight -
            8;

    }


    if (top < 12) {

        top =
            12;

    }


    jalaliPicker.style.left =
        left + "px";


    jalaliPicker.style.top =
        top + "px";


    jalaliPicker.style.display =
        "block";

}


/* =========================================================
   CLOSE CALENDAR
========================================================= */

function closeJalaliPicker() {

    if (jalaliPicker) {

        jalaliPicker.style.display =
            "none";

    }

}


/* =========================================================
   RENDER CALENDAR
========================================================= */

function renderJalaliPicker() {

    if (!jalaliPicker) {

        return;

    }


    const monthNames = [

        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"

    ];


    const daysInMonth =
        jalaliPickerMonth <= 6

            ? 31

            : jalaliPickerMonth <= 11

                ? 30

                : isJalaliLeapYear(
                    jalaliPickerYear
                )

                    ? 30
                    : 29;


    const firstGregorian =
        jalaliToGregorian(
            jalaliPickerYear,
            jalaliPickerMonth,
            1
        );


    const firstDate =
        new Date(
            firstGregorian.gy,
            firstGregorian.gm - 1,
            firstGregorian.gd
        );


    const startDay =
        firstDate.getDay();


    const offset =
        (
            startDay +
            1
        ) % 7;


    let html = `

        <div
            style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:8px;
                margin-bottom:10px;
            "
        >

            <button
                type="button"
                data-jalali-prev
                style="
                    border:0;
                    background:#f2f2f2;
                    border-radius:8px;
                    padding:7px 12px;
                    font-size:18px;
                    cursor:pointer;
                "
            >
                ›
            </button>

            <strong>
                ${monthNames[
                    jalaliPickerMonth - 1
                ]}
                ${toPersianDigits(
                    jalaliPickerYear
                )}
            </strong>

            <button
                type="button"
                data-jalali-next
                style="
                    border:0;
                    background:#f2f2f2;
                    border-radius:8px;
                    padding:7px 12px;
                    font-size:18px;
                    cursor:pointer;
                "
            >
                ‹
            </button>

        </div>


        <div
            style="
                display:grid;
                grid-template-columns:repeat(7,1fr);
                gap:4px;
                text-align:center;
                margin-bottom:5px;
                font-size:12px;
                font-weight:bold;
            "
        >

            <div>ش</div>
            <div>ی</div>
            <div>د</div>
            <div>س</div>
            <div>چ</div>
            <div>پ</div>
            <div>ج</div>

        </div>


        <div
            style="
                display:grid;
                grid-template-columns:repeat(7,1fr);
                gap:4px;
            "
        `;


    for (
        let i = 0;
        i < offset;
        i++
    ) {

        html +=
            "<div></div>";

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        html += `

            <button
                type="button"
                data-jalali-day="${day}"
                style="
                    border:0;
                    background:#f7f7f7;
                    border-radius:8px;
                    padding:8px 2px;
                    cursor:pointer;
                    font-size:13px;
                "
            >
                ${toPersianDigits(day)}
            </button>

        `;

    }


    html += `

        </div>


        <div
            style="
                display:flex;
                justify-content:space-between;
                gap:8px;
                margin-top:10px;
            "
        >

            <button
                type="button"
                data-jalali-today
                style="
                    flex:1;
                    border:0;
                    background:#173f35;
                    color:white;
                    border-radius:8px;
                    padding:8px;
                    cursor:pointer;
                    font-family:inherit;
                "
            >
                امروز
            </button>

            <button
                type="button"
                data-jalali-close
                style="
                    flex:1;
                    border:0;
                    background:#eeeeee;
                    border-radius:8px;
                    padding:8px;
                    cursor:pointer;
                    font-family:inherit;
                "
            >
                بستن
            </button>

        </div>

    `;


    jalaliPicker.innerHTML =
        html;


    jalaliPicker
        .querySelector(
            "[data-jalali-prev]"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                jalaliPickerMonth--;

                if (
                    jalaliPickerMonth < 1
                ) {

                    jalaliPickerMonth =
                        12;

                    jalaliPickerYear--;

                }

                renderJalaliPicker();

            }
        );


    jalaliPicker
        .querySelector(
            "[data-jalali-next]"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                jalaliPickerMonth++;

                if (
                    jalaliPickerMonth > 12
                ) {

                    jalaliPickerMonth =
                        1;

                    jalaliPickerYear++;

                }

                renderJalaliPicker();

            }
        );


    jalaliPicker
        .querySelectorAll(
            "[data-jalali-day]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        const day =
                            Number(
                                button.dataset.jalaliDay
                            );


                        const value =
                            String(
                                jalaliPickerYear
                            ).padStart(
                                4,
                                "0"
                            ) +
                            "/" +
                            String(
                                jalaliPickerMonth
                            ).padStart(
                                2,
                                "0"
                            ) +
                            "/" +
                            String(
                                day
                            ).padStart(
                                2,
                                "0"
                            );


                        const input =
                            document.getElementById(
                                "placementDate"
                            );


                        if (input) {

                            input.value =
                                toPersianDigits(
                                    value
                                );

                        }


                        closeJalaliPicker();

                    }
                );

            }
        );


    jalaliPicker
        .querySelector(
            "[data-jalali-today]"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                const now =
                    new Date();


                const today =
                    gregorianToJalali(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate()
                    );


                jalaliPickerYear =
                    today.jy;


                jalaliPickerMonth =
                    today.jm;


                const input =
                    document.getElementById(
                        "placementDate"
                    );


                if (input) {

                    input.value =
                        toPersianDigits(

                            String(
                                today.jy
                            ).padStart(
                                4,
                                "0"
                            ) +

                            "/" +

                            String(
                                today.jm
                            ).padStart(
                                2,
                                "0"
                            ) +

                            "/" +

                            String(
                                today.jd
                            ).padStart(
                                2,
                                "0"
                            )

                        );

                }


                closeJalaliPicker();

            }
        );


    jalaliPicker
        .querySelector(
            "[data-jalali-close]"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                closeJalaliPicker();

            }
        );

}


/* =========================================================
   JALALI CONVERSION
========================================================= */

function jalaliToGregorianISO(
    value
) {

    const normalized =
        normalizeNumbers(
            value
        );


    const parts =
        normalized.split("/");


    if (
        parts.length !== 3
    ) {

        return null;

    }


    const jy =
        Number(parts[0]);


    const jm =
        Number(parts[1]);


    const jd =
        Number(parts[2]);


    if (
        !Number.isInteger(jy) ||
        !Number.isInteger(jm) ||
        !Number.isInteger(jd)
    ) {

        return null;

    }


    if (
        jy < 1200 ||
        jy > 1600 ||
        jm < 1 ||
        jm > 12 ||
        jd < 1 ||
        jd >
        (
            jm <= 6
                ? 31
                : jm <= 11
                    ? 30
                    : 30
        )
    ) {

        return null;

    }


    const g =
        jalaliToGregorian(
            jy,
            jm,
            jd
        );


    if (!g) {

        return null;

    }


    return (

        String(g.gy)
            .padStart(4, "0") +

        "-" +

        String(g.gm)
            .padStart(2, "0") +

        "-" +

        String(g.gd)
            .padStart(2, "0")

    );

}


/* =========================================================
   JALALI → GREGORIAN
========================================================= */

function jalaliToGregorian(
    jy,
    jm,
    jd
) {

    jy =
        Number(jy);


    jm =
        Number(jm);


    jd =
        Number(jd);


    let gy;


    if (
        jy > 979
    ) {

        gy =
            1600;

        jy -=
            979;

    }

    else {

        gy =
            621;

    }


    let days =
        365 * jy;


    days +=
        Math.floor(
            jy / 33
        ) * 8;


    days +=
        Math.floor(
            (
                jy % 33 +
                3
            ) / 4
        );


    days +=
        78;


    days +=
        jd;


    if (
        jm < 7
    ) {

        days +=
            (
                jm - 1
            ) * 31;

    }

    else {

        days +=
            (
                jm - 7
            ) * 30 +
            186;

    }


    gy +=
        4 *
        Math.floor(
            days / 1461
        );


    days %=
        1461;


    if (
        days > 365
    ) {

        gy +=
            Math.floor(
                (
                    days - 1
                ) / 365
            );


        days =
            (
                days - 1
            ) % 365;

    }


    let gd =
        days;


    const monthDays = [

        31,
        (
            (
                gy % 4 === 0 &&
                gy % 100 !== 0
            ) ||
            gy % 400 === 0
        )
            ? 29
            : 28,

        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31

    ];


    let gm =
        0;


    while (
        gm < 12 &&
        gd >
        monthDays[gm]
    ) {

        gd -=
            monthDays[gm];

        gm++;

    }


    return {

        gy,

        gm:
            gm + 1,

        gd

    };

}


/* =========================================================
   GREGORIAN → JALALI
========================================================= */

function gregorianToJalali(
    gy,
    gm,
    gd
) {

    const g_d_m = [

        0,
        31,
        59,
        90,
        120,
        151,
        181,
        212,
        243,
        273,
        304,
        334

    ];


    let gy2 =
        gm > 2
            ? gy + 1
            : gy;


    let days =
        355666 +
        (
            365 * gy
        ) +
        Math.floor(
            (
                gy2 + 3
            ) / 4
        ) -
        Math.floor(
            (
                gy2 + 99
            ) / 100
        ) +
        Math.floor(
            (
                gy2 + 399
            ) / 400
        ) +
        gd +
        g_d_m[
            gm - 1
        ];


    let jy =
        -1595 +
        (
            33 *
            Math.floor(
                days / 12053
            )
        );


    days %=
        12053;


    jy +=
        4 *
        Math.floor(
            days / 1461
        );


    days %=
        1461;


    if (
        days > 365
    ) {

        jy +=
            Math.floor(
                (
                    days - 1
                ) / 365
            );


        days =
            (
                days - 1
            ) % 365;

    }


    const jm =
        days < 186
            ? 1 +
              Math.floor(
                  days / 31
              )
            : 7 +
              Math.floor(
                  (
                      days - 186
                  ) / 30
              );


    const jd =
        1 +
        (
            days <
            186
                ? days % 31
                : (
                    days - 186
                ) % 30
        );


    return {

        jy,

        jm,

        jd

    };

}


/* =========================================================
   LEAP YEAR
========================================================= */

function isJalaliLeapYear(
    year
) {

    const mod =
        year % 33;


    return [

        1,
        5,
        9,
        13,
        17,
        22,
        26,
        30

    ].includes(
        mod
    );

}
