
const formulario = document.querySelector("#calculadora");
const chart = document.querySelector("#myChart");
let myChart;

const DatosMoneda = async (moneda) => {
  try {
    const valores = await fetch(`https://mindicador.cl/api/${moneda}`);
    const totales = await valores.json();
    return totales.serie;
  } catch (error) {
    alert(error.message);
  }
};

const calcularmonedas = (valor, datos) => {
  const valorMoneda = datos[0].valor
  const total = valor / valorMoneda;
  return Math.round(total *100);
};

const mostrarTotal = (total) => {
  document.getElementById("total-valor").innerHTML = total;
};

const obtenerValores = (datos) => {
  return datos.map((item) => item.valor);
};

const obtenerFechas = (datos) => {
  return datos.map((item) => new Date(item.fecha).toLocaleDateString("en-US"));
};                                                                          

const romperGraficoAnterior = () => {
  if (myChart) {
    myChart.destroy();
  }
};

const calcularValorMoneda = async (valor, moneda) => {
  const datos = await DatosMoneda(moneda);
  return calcularmonedas(valor, datos);
};

const verGrafico = async (event) => {
  event.preventDefault();

  const valorInput = parseFloat(formulario.querySelector('input[name="valor"]').value);
  const monedaSelect = formulario.querySelector('select[name="dinero"]').value;

  try {
    const total = await calcularValorMoneda(valorInput, monedaSelect);
    mostrarTotal(total);

    const datos = await DatosMoneda(monedaSelect);
    const labels = obtenerFechas(datos);
    const values = obtenerValores(datos);

    const datasets = [
      {
        label: "Moneda",
        borderColor: "rgb(255, 99, 132)",
        data: values,
      },
    ];

    const config = {
      type: "line",
      data: { labels, datasets },
    };

    romperGraficoAnterior();

    chart.style.backgroundColor = "black";
    chart.style.borderRadius = "10px";

    myChart = new Chart(chart, config);
  } catch (error) {
    alert("Error al obtener los datos de la moneda.");
  }
};

formulario.addEventListener("submit", verGrafico);
