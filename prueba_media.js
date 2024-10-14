// prueba_hipotesis_media.js

// Función para iniciar la sección de Prueba de Hipótesis sobre la Media
function iniciarPruebaHipotesisMedia() {
    // Obtener elementos de entrada
    const mu0Slider = document.getElementById('mu0');
    const sigmaSlider = document.getElementById('sigma');
    const xBarSlider = document.getElementById('xBar');
    const nSlider = document.getElementById('n');
    const alphaSlider = document.getElementById('alphaSlider');
    const tipoTestSelect = document.getElementById('tipoTest');

    // Obtener elementos para mostrar los valores actuales
    const mu0Value = document.getElementById('mu0Value');
    const sigmaValue = document.getElementById('sigmaValue');
    const xBarValue = document.getElementById('xBarValue');
    const nValue = document.getElementById('nValue');
    const alphaValue = document.getElementById('alphaValue');

    // Añadir eventos para actualizar cuando cambien los parámetros
    mu0Slider.addEventListener('input', function() {
        mu0Value.innerText = parseFloat(this.value).toFixed(1);
        actualizarPrueba();
    });

    sigmaSlider.addEventListener('input', function() {
        sigmaValue.innerText = parseFloat(this.value).toFixed(1);
        actualizarPrueba();
    });

    xBarSlider.addEventListener('input', function() {
        xBarValue.innerText = parseFloat(this.value).toFixed(1);
        actualizarPrueba();
    });

    nSlider.addEventListener('input', function() {
        nValue.innerText = parseInt(this.value);
        actualizarPrueba();
    });

    alphaSlider.addEventListener('input', function() {
        alphaValue.innerText = parseFloat(this.value).toFixed(2);
        actualizarPrueba();
    });

    tipoTestSelect.addEventListener('change', function() {
        actualizarPrueba();
    });

    // Realizar el análisis inicial
    actualizarPrueba();
}

// Función para actualizar la Prueba de Hipótesis
function actualizarPrueba() {
    // Obtener valores de los parámetros
    const mu0 = parseFloat(document.getElementById('mu0').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const xBar = parseFloat(document.getElementById('xBar').value);
    const n = parseInt(document.getElementById('n').value);
    const alpha = parseFloat(document.getElementById('alphaSlider').value);
    const tipoTest = document.getElementById('tipoTest').value;

    // Validaciones básicas
    if (isNaN(mu0) || isNaN(sigma) || isNaN(xBar) || isNaN(n) || n <= 0 || sigma <= 0) {
        alert('Por favor, ingresa valores válidos para todos los parámetros.');
        return;
    }

    // Calcular el error estándar
    const se = sigma / Math.sqrt(n);

    // Calcular el estadístico de prueba (z)
    const z = (xBar - mu0) / se;

    // Determinar los valores críticos según el tipo de prueba
    let zCriticalLower = null;
    let zCriticalUpper = null;

    if (tipoTest === 'two-tailed') {
        zCriticalLower = jStat.normal.inv(alpha / 2, 0, 1);
        zCriticalUpper = jStat.normal.inv(1 - alpha / 2, 0, 1);
    } else if (tipoTest === 'left-tailed') {
        zCriticalLower = jStat.normal.inv(alpha, 0, 1);
    } else if (tipoTest === 'right-tailed') {
        zCriticalUpper = jStat.normal.inv(1 - alpha, 0, 1);
    }

    // Calcular el p-valor según el tipo de prueba
    let pValue = 0;
    if (tipoTest === 'two-tailed') {
        pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
    } else if (tipoTest === 'left-tailed') {
        pValue = jStat.normal.cdf(z, 0, 1);
    } else if (tipoTest === 'right-tailed') {
        pValue = 1 - jStat.normal.cdf(z, 0, 1);
    }

    // Conclusión
    let conclusion = '';
    if (pValue < alpha) {
        conclusion = 'Se rechaza la hipótesis nula.';
    } else {
        conclusion = 'No se rechaza la hipótesis nula.';
    }

    // Mostrar resultados
    mostrarResultados(mu0, sigma, xBar, n, se, z, zCriticalLower, zCriticalUpper, pValue, alpha, tipoTest, conclusion);

    // Crear gráfico
    crearGrafico(z, zCriticalLower, zCriticalUpper, alpha, tipoTest);

    crearGraficoMediaMuestral(mu0,se,xBar);
}

// Función para mostrar los resultados en la página
function mostrarResultados(mu0, sigma, xBar, n, se, z, zCriticalLower, zCriticalUpper, pValue, alpha, tipoTest, conclusion) {
    const resultadosDiv = document.getElementById('resultadosPrueba');

    // Formatear los números a 4 decimales
    const seFormatted = se.toFixed(4);
    const zFormatted = z.toFixed(4);
    const pValueFormatted = pValue.toFixed(4);
    const alphaFormatted = alpha.toFixed(2);

    // Determinar los valores críticos formateados
    let zCritLowerFormatted = '-';
    let zCritUpperFormatted = '-';
    if (zCriticalLower !== null) {
        zCritLowerFormatted = zCriticalLower.toFixed(4);
    }
    if (zCriticalUpper !== null) {
        zCritUpperFormatted = zCriticalUpper.toFixed(4);
    }

    // Determinar el tipo de prueba en español
    let tipoTestEsp = '';
    if (tipoTest === 'two-tailed') {
        tipoTestEsp = 'Dos Colas';
    } else if (tipoTest === 'left-tailed') {
        tipoTestEsp = 'Una Cola Izquierda';
    } else if (tipoTest === 'right-tailed') {
        tipoTestEsp = 'Una Cola Derecha';
    }

    // Construir el HTML de resultados siguiendo el formato de "Potencia de una Prueba"
    resultadosDiv.innerHTML = `
        <div class="info-prueba-hipotesis">
            <h2>Resultados de la Prueba de Hipótesis</h2>
            <table class="tabla-resumen-prueba-hipotesis">
                <thead>
                    <tr>
                        <th>Parámetro</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Valor bajo Hipótesis Nula (μ₀)</td>
                        <td>${mu0}</td>
                    </tr>
                    <tr>
                        <td>Media Muestral (x̄)</td>
                        <td>${xBar}</td>
                    </tr>
                    <tr>
                        <td>Desviación Estándar Poblacional (σ)</td>
                        <td>${sigma}</td>
                    </tr>
                    <tr>
                        <td>Tamaño de Muestra (n)</td>
                        <td>${n}</td>
                    </tr>
                    <tr>
                        <td>Error Estándar (SE)</td>
                        <td>${seFormatted}</td>
                    </tr>
                    <tr>
                        <td>Estadístico de Prueba (z)</td>
                        <td>${zFormatted}</td>
                    </tr>
                    <tr>
                        <td>Valor Crítico Inferior (z₁)</td>
                        <td>${zCritLowerFormatted}</td>
                    </tr>
                    <tr>
                        <td>Valor Crítico Superior (z₂)</td>
                        <td>${zCritUpperFormatted}</td>
                    </tr>
                    <tr>
                        <td>p-Valor</td>
                        <td>${pValueFormatted}</td>
                    </tr>
                    <tr>
                        <td>Nivel de Significancia (α)</td>
                        <td>${alphaFormatted}</td>
                    </tr>
                    <tr>
                        <td>Tipo de Prueba</td>
                        <td>${tipoTestEsp}</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Conclusión:</strong> ${conclusion}</p>
        </div>
    `;
}

// Función para crear el gráfico de la distribución
function crearGrafico(z, zCriticalLower, zCriticalUpper, alpha, tipoTest) {
    const data = [];
    const layout = {
        title: 'Distribución del Estadístico de Prueba',
        xaxis: { title: 'Valor de z' },
        yaxis: { title: 'Densidad' },
        shapes: []
    };

    // Definir el rango para el gráfico
    const xMin = -4;
    const xMax = 4;
    const step = 0.01;
    const xValues = [];
    const yValues = [];

    for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
        yValues.push(jStat.normal.pdf(x, 0, 1));
    }

    // Crear la curva de la distribución normal estándar
    data.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Distribución Normal Estándar',
        line: { color: '#1f77b4' }
    });

    // Definir las áreas de significancia en rojo
    if (tipoTest === 'two-tailed') {
        // Área a la izquierda
        const errorTipoI1 = {
            x: xValues.filter(x => x <= zCriticalLower),
            y: yValues.slice(0, xValues.findIndex(x => x > zCriticalLower)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Error Tipo I Izquierda'
        };
        // Área a la derecha
        const errorTipoI2 = {
            x: xValues.filter(x => x >= zCriticalUpper),
            y: yValues.slice(xValues.findIndex(x => x >= zCriticalUpper)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Error Tipo I Derecha'
        };
        data.push(errorTipoI1, errorTipoI2);
    } else if (tipoTest === 'left-tailed') {
        // Área a la izquierda
        const errorTipoI = {
            x: xValues.filter(x => x <= zCriticalLower),
            y: yValues.slice(0, xValues.findIndex(x => x > zCriticalLower)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Error Tipo I'
        };
        data.push(errorTipoI);
    } else if (tipoTest === 'right-tailed') {
        // Área a la derecha
        const errorTipoI = {
            x: xValues.filter(x => x >= zCriticalUpper),
            y: yValues.slice(xValues.findIndex(x => x >= zCriticalUpper)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Error Tipo I'
        };
        data.push(errorTipoI);
    }

    // Definir las áreas del p-valor en verde
    if (tipoTest === 'two-tailed') {
        // Determinar cuál cola tiene el p-valor menor
        const cdfLower = jStat.normal.cdf(z, 0, 1);
        const cdfUpper = 1 - jStat.normal.cdf(z, 0, 1);
    //    if (cdfLower < cdfUpper) {
            // Área a la izquierda
            const pValueArea1 = {
                x: xValues.filter(x => x <= -z),
                y: yValues.slice(0, xValues.findIndex(x => x > -z)),
                fill: 'tozeroy',
                type: 'scatter',
                mode: 'none',
                fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
                name: 'p-Valor Izquierda'
            };
            data.push(pValueArea1);
  //      } else {
            // Área a la derecha
            const pValueArea2 = {
                x: xValues.filter(x => x >= z),
                y: yValues.slice(xValues.findIndex(x => x >= z)),
                fill: 'tozeroy',
                type: 'scatter',
                mode: 'none',
                fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
                name: 'p-Valor Derecha'
            };
            data.push(pValueArea2);
   //     }
    } else if (tipoTest === 'left-tailed') {
        // Área a la izquierda
        const pValueArea = {
            x: xValues.filter(x => x <= z),
            y: yValues.slice(0, xValues.findIndex(x => x > z)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
            name: 'p-Valor'
        };
        data.push(pValueArea);
    } else if (tipoTest === 'right-tailed') {
        // Área a la derecha
        const pValueArea = {
            x: xValues.filter(x => x >= z),
            y: yValues.slice(xValues.findIndex(x => x >= z)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
            name: 'p-Valor'
        };
        data.push(pValueArea);
    }

    // Añadir el estadístico observado
    data.push({
        x: [z],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Estadístico Observado',
        marker: { color: 'green', size: 10 }
    });

    // Plotear el gráfico
    Plotly.newPlot('graficaDistribucion', data, layout);

}


function crearGraficoMediaMuestral(mu0, se, xBar) {
    const data = [];
    const layout = {
        title: 'Distribución de la Media Muestral',
        xaxis: { title: 'Media Muestral (x̄)' },
        yaxis: { title: 'Densidad' }
    };

    // Definir el rango para el gráfico
    const xMin = mu0 - 4 * se;
    const xMax = mu0 + 4 * se;
    const step = (xMax - xMin) / 1000;
    const xValues = [];
    const yValues = [];

    for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
        yValues.push(jStat.normal.pdf(x, mu0, se));
    }

    // Crear la curva de la distribución de la media muestral
    data.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Distribución de la Media Muestral',
        line: { color: '#1f77b4' }
    });

    data.push({
        x: [xBar],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Media Muestral',
        marker: { color: 'green', size: 10 }
    });

    data.push({
        x: [mu0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Media Bajo H₀',
        marker: { color: 'red', size: 10 }
    });

    // Plotear el gráfico
    Plotly.newPlot('graficaMediaMuestral', data, layout);
}

// Iniciar la sección de Prueba de Hipótesis cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarPruebaHipotesisMedia);