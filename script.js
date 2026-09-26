const formulario =
    document.getElementById("credit-form");

const montoInput =
    document.getElementById("monto");

const tasaInput =
    document.getElementById("tasa");

const plazoInput =
    document.getElementById("plazo");

const tablaBody =
    document.querySelector("#tabla-amortizacion tbody");

const IVA = 0.16;


/* =========================
   FORMATO MONETARIO
========================= */

function dinero(valor) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2
    }).format(valor);
}


/* =========================
   SIMULACIÓN
========================= */

function procesarSimulacion(event) {

    event.preventDefault();

    const monto =
        Number.parseFloat(montoInput.value);

    const tasaAnual =
        Number.parseFloat(tasaInput.value);

    const plazo =
        Number.parseInt(plazoInput.value);


    /* Validaciones */

    if (
        !Number.isFinite(monto) ||
        !Number.isFinite(tasaAnual) ||
        !Number.isFinite(plazo) ||
        monto <= 0 ||
        tasaAnual < 0 ||
        plazo <= 0
    ) {

        alert(
            "Ingresa valores válidos para realizar la simulación."
        );

        return;
    }


    /* Capital mensual */

    const capitalMensual =
        monto / plazo;


    /* Tasa mensual */

    const tasaMensual =
        (tasaAnual / 100) / 12;


    let saldo =
        monto;

    let totalIntereses =
        0;

    let totalIVA =
        0;

    let totalPagado =
        0;


    tablaBody.innerHTML = "";


    /* =========================
       GENERAR TABLA
    ========================= */

    for (
        let periodo = 1;
        periodo <= plazo;
        periodo++
    ) {

        const saldoInicial =
            saldo;


        const interes =
            saldoInicial * tasaMensual;


        const iva =
            interes * IVA;


        const pagoTotal =
            capitalMensual +
            interes +
            iva;


        saldo =
            saldoInicial -
            capitalMensual;


        if (Math.abs(saldo) < 0.01) {
            saldo = 0;
        }


        totalIntereses += interes;

        totalIVA += iva;

        totalPagado += pagoTotal;


        /* Crear fila */

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>${periodo}</td>

            <td>${dinero(saldoInicial)}</td>

            <td>${dinero(capitalMensual)}</td>

            <td>${dinero(interes)}</td>

            <td>${dinero(iva)}</td>

            <td>
                <strong>
                    ${dinero(pagoTotal)}
                </strong>
            </td>

            <td>${dinero(saldo)}</td>

        `;


        tablaBody.appendChild(fila);
    }


    /* =========================
       RESUMEN
    ========================= */

    const primerInteres =
        monto * tasaMensual;

    const primerIVA =
        primerInteres * IVA;

    const primerPago =
        capitalMensual +
        primerInteres +
        primerIVA;


    document.getElementById(
        "res-monto"
    ).textContent =
        dinero(monto);


    document.getElementById(
        "res-primer-pago"
    ).textContent =
        dinero(primerPago);


    document.getElementById(
        "res-intereses"
    ).textContent =
        dinero(totalIntereses);


    document.getElementById(
        "res-total"
    ).textContent =
        dinero(totalPagado);
}


/* =========================
   CALCULAR
========================= */

formulario.addEventListener(
    "submit",
    procesarSimulacion
);


/* =========================
   BOTÓN LIMPIAR
========================= */

document
    .getElementById("btn-limpiar")
    .addEventListener("click", function () {

        /* Limpiar campos */

        montoInput.value = "";
        tasaInput.value = "";
        plazoInput.value = "48";


        /* Limpiar resultados */

        document.getElementById(
            "res-monto"
        ).textContent = "$0.00";


        document.getElementById(
            "res-primer-pago"
        ).textContent = "$0.00";


        document.getElementById(
            "res-intereses"
        ).textContent = "$0.00";


        document.getElementById(
            "res-total"
        ).textContent = "$0.00";


        /* Limpiar tabla */

        tablaBody.innerHTML = "";
    });


/* =========================
   CALCULAR AL CARGAR
========================= */

procesarSimulacion(
    new Event("submit")
);