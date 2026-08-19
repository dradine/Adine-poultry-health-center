/* =========================================================
   ADINE POULTRY HEALTH CENTER
   GENETICS SELECTOR UI
   ========================================================= */


/* =========================================================
   PRODUCTION TYPE
   ========================================================= */

function populateProductionTypes(
    select
) {

    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            نوع گله را انتخاب کنید
        </option>

        <option value="broiler">
            گوشتی
        </option>

        <option value="layer">
            تخم‌گذار
        </option>

        <option value="pullet">
            پولت
        </option>

        <option value="breeder">
            مرغ مادر
        </option>

    `;

}


/* =========================================================
   GENETICS
   ========================================================= */

function populateGenetics(
    select,
    type
) {

    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            انتخاب سویه / شرکت
        </option>

    `;


    let genetics = [];


    if (
        type === "broiler"
    ) {

        genetics =
            getBroilerGenetics();

    }

    else if (
        type === "layer"
    ) {

        genetics =
            getLayerGenetics();

    }

    else if (
        type === "pullet"
    ) {

        genetics =
            getLayerGenetics();

    }

    else if (
        type === "breeder"
    ) {

        genetics =
            getBroilerGenetics();

    }


    genetics.forEach(
        key => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                key;


            option.textContent =
                getGeneticsLabel(
                    key
                );


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   LABEL
   ========================================================= */

function getGeneticsLabel(
    key
) {

    const labels = {

        Ross:
            "Aviagen / Ross",

        Cobb:
            "Cobb",

        ArborAcres:
            "Arbor Acres",

        IndianRiver:
            "Indian River",

        Hubbard:
            "Hubbard",

        Arian:
            "آرین",

        HyLine:
            "Hy-Line",

        Hendrix:
            "Hendrix Genetics",

        Lohmann:
            "Lohmann",

        NOVOgen:
            "NOVOgen",

        HN:
            "H&N",

        TETRA:
            "TETRA"

    };


    return (
        labels[key] ||
        key
    );

}


/* =========================================================
   STRAIN
   ========================================================= */

function populateStrains(
    select,
    type,
    genetics
) {

    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            انتخاب نژاد / سویه
        </option>

    `;


    if (!type || !genetics) {

        return;

    }


    if (
        type === "pullet"
    ) {

        type = "layer";

    }


    if (
        type === "breeder"
    ) {

        type = "broiler";

    }


    const strains =
        getProducts(
            type,
            genetics
        );


    strains.forEach(
        strain => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                strain;


            option.textContent =
                strain;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   PROGRAM
   ========================================================= */

function populatePrograms(
    select,
    type,
    genetics,
    strain
) {

    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            انتخاب برنامه استاندارد
        </option>

    `;


    if (
        !type ||
        !genetics ||
        !strain
    ) {

        return;

    }


    if (
        type === "broiler"
    ) {

        const product =
            getProduct(
                "broiler",
                genetics,
                strain
            );


        if (
            product &&
            product.programs
        ) {

            Object.entries(
                product.programs
            )
            .forEach(
                ([key, program]) => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        key;


                    option.textContent =
                        program.label;


                    select.appendChild(
                        option
                    );

                }
            );

        }

    }


    else if (
        type === "breeder"
    ) {

        const options = [

            {
                value:
                    "parentStock",

                label:
                    "Parent Stock"
            }

        ];


        options.forEach(
            item => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    item.value;


                option.textContent =
                    item.label;


                select.appendChild(
                    option
                );

            }
        );

    }


    else {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            "commercial";


        option.textContent =
            "Commercial Standard";


        select.appendChild(
            option
        );

    }

}


/* =========================================================
   SELECTOR INIT
   ========================================================= */

function initGeneticsSelectors() {

    const type =
        document.getElementById(
            "productionType"
        );


    const genetics =
        document.getElementById(
            "genetics"
        );


    const strain =
        document.getElementById(
            "strain"
        );


    const program =
        document.getElementById(
            "standardProgram"
        );


    if (!type) {

        return;

    }


    populateProductionTypes(
        type
    );


    type.addEventListener(
        "change",
        () => {

            populateGenetics(
                genetics,
                type.value
            );


            if (strain) {

                strain.innerHTML = `

                    <option value="">
                        ابتدا سویه را انتخاب کنید
                    </option>

                `;

            }


            if (program) {

                program.innerHTML = `

                    <option value="">
                        ابتدا برنامه را انتخاب کنید
                    </option>

                `;

            }

        }
    );


    genetics?.addEventListener(
        "change",
        () => {

            populateStrains(
                strain,
                type.value,
                genetics.value
            );

        }
    );


    strain?.addEventListener(
        "change",
        () => {

            populatePrograms(
                program,
                type.value,
                genetics.value,
                strain.value
            );

            showGeneticInfo(
                type.value,
                genetics.value,
                strain.value
            );

        }
    );

}


/* =========================================================
   INFO PANEL
   ========================================================= */

function showGeneticInfo(
    type,
    genetics,
    strain
) {

    const box =
        document.getElementById(
            "geneticsInfo"
        );


    if (!box) {

        return;

    }


    if (
        !type ||
        !genetics ||
        !strain
    ) {

        box.innerHTML = "";

        return;

    }


    const productType =
        type === "pullet"
            ? "layer"
            : type === "breeder"
                ? "broiler"
                : type;


    const product =
        getProduct(
            productType,
            genetics,
            strain
        );


    if (!product) {

        box.innerHTML = "";

        return;

    }


    const official =
        product.officialDocumentation
            ? "مستندات رسمی موجود"
            : "نیازمند منبع محلی/ایرانی";


    const local =
        product.localIranianLine
            ? "لاین ایرانی"
            : "";


    box.innerHTML = `

        <div class="genetics-info-card">

            <strong>
                ${escapeHTML(strain)}
            </strong>

            <span>
                ${escapeHTML(
                    getGeneticsLabel(genetics)
                )}
            </span>

            <small>
                ${official}
            </small>

            ${
                local
                    ? `<small>${local}</small>`
                    : ""
            }

        </div>

    `;

}
