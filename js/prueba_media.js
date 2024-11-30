// prueba_media.js

// Función para iniciar la sección de Prueba de Hipótesis sobre la Media
function iniciarPruebaHipotesisMedia() {
    // Obtener elementos de entrada
    const mu0Input = document.getElementById('mu0Input');
    const mu0Slider = document.getElementById('mu0Slider');
    const sigmaInput = document.getElementById('sigmaInput');
    const sigmaSlider = document.getElementById('sigmaSlider');
    
    const xBarInput = document.getElementById('xBarInput');
    const xBarSlider = document.getElementById('xBarSlider');
    const nInput = document.getElementById('nInput');
    const nSlider = document.getElementById('nSlider');
    const alphaInput = document.getElementById('alphaInput');
    const alphaSlider = document.getElementById('alphaSlider');
    const tipoTestSelect = document.getElementById('tipoTest');

    // Obtener elementos para mostrar los valores actuales
    const mu0Value = document.getElementById('mu0Value');
    const sigmaValue = document.getElementById('sigmaValue');
    const xBarValue = document.getElementById('xBarValue');
    const nValue = document.getElementById('nValue');
    const alphaValue = document.getElementById('alphaValue');

    // Establecer valores iniciales y límites
    mu0Slider.min = "0";
    mu0Slider.max = "100";
    mu0Input.min = "0";
    mu0Input.max = "100";
    sigmaSlider.min = "1";
    sigmaSlider.max = "100";
    sigmaInput.min = "1";
    sigmaInput.max = "100";
    xBarSlider.min = "0";
    xBarSlider.max = "100";
    xBarInput.min = "0";
    xBarInput.max = "100";
    nSlider.min = "10";
    nSlider.max = "100";
    nInput.min = "10";
    nInput.max = "100";
    alphaSlider.min = "0.01";
    alphaSlider.max = "0.5";
    alphaInput.min = "0.01";
    alphaInput.max = "0.5";

    
    // Sincronizar los valores iniciales
    mu0Input.value = mu0Slider.value;
    mu0Value.innerText = parseFloat(mu0Slider.value).toFixed(1);

    sigmaInput.value = sigmaSlider.value;
    sigmaValue.innerText = parseFloat(sigmaSlider.value).toFixed(1);

    xBarInput.value = xBarSlider.value;
    xBarValue.innerText = parseFloat(xBarSlider.value).toFixed(1);

    nInput.value = nSlider.value;
    nValue.innerText = parseFloat(nSlider.value).toFixed(1);

    alphaInput.value = alphaSlider.value;
    alphaValue.innerText = parseFloat(alphaSlider.value).toFixed(2);

    // Añadir eventos para actualizar cuando cambien los parámetros

    //-------------------------------------------------------------------------------------------------//
    // MEDIA POBLACIONA (H0)
    //-------------------------------------------------------------------------------------------------//

    // Evento para actualizar el slider cuando cambia el input numérico
    mu0Input.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(mu0Slider.min)) {
                mu0Slider.min = value;
            }
            if (value > parseFloat(mu0Slider.max)) {
                mu0Slider.max = value;
            }

            mu0Slider.value = value;
            mu0Value.innerText = value.toFixed(1);
            actualizarPrueba();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    mu0Slider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        mu0Input.value = value;
        mu0Value.innerText = value.toFixed(1);
        actualizarPrueba();
    });

    //-------------------------------------------------------------------------------------------------//
    // SIGMA - DESVIACIÓN ESTÁNDARD
    //-------------------------------------------------------------------------------------------------//

    // Evento para actualizar el slider cuando cambia el input numérico
    sigmaInput.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(sigmaSlider.min)) {
                sigmaSlider.min = value;
            }
            if (value > parseFloat(sigmaSlider.max)) {
                sigmaSlider.max = value;
            }

            sigmaSlider.value = value;
            sigmaValue.innerText = value.toFixed(1);
            actualizarPrueba();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    sigmaSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        sigmaInput.value = value;
        sigmaValue.innerText = value.toFixed(1);
        actualizarPrueba();
    });

    //-------------------------------------------------------------------------------------------------//
    // MEDIA MUESTRAL - xBarSlider
    //-------------------------------------------------------------------------------------------------//


    // Evento para actualizar el slider cuando cambia el input numérico
    xBarInput.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(xBarSlider.min)) {
                xBarSlider.min = value;
            }
            if (value > parseFloat(xBarSlider.max)) {
                xBarSlider.max = value;
            }

            xBarSlider.value = value;
            xBarValue.innerText = value.toFixed(1);
            actualizarPrueba();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    xBarSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        xBarInput.value = value;
        xBarValue.innerText = value.toFixed(1);
        actualizarPrueba();
    });


    //-------------------------------------------------------------------------------------------------//
    // TAMAÑO DE LA MUESTRA - nSlider
    //-------------------------------------------------------------------------------------------------//

    // Evento para actualizar el slider cuando cambia el input numérico
    nInput.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(nSlider.min)) {
                nSlider.min = value;
            }
            if (value > parseFloat(nSlider.max)) {
                nSlider.max = value;
            }

            nSlider.value = value;
            nValue.innerText = value.toFixed(1);
            actualizarPrueba();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    nSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        nInput.value = value;
        nValue.innerText = value.toFixed(1);
        actualizarPrueba();
    });


    //-------------------------------------------------------------------------------------------------//
    // NIVEL DE SIGNIFICANCIA - alphaSlider
    //-------------------------------------------------------------------------------------------------//


    // Evento para actualizar el slider cuando cambia el input numérico
    alphaInput.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(alphaSlider.min)) {
                alphaSlider.min = value;
            }
            if (value > parseFloat(alphaSlider.max)) {
                alphaSlider.max = value;
            }

            alphaSlider.value = value;
            alphaValue.innerText = value.toFixed(2);
            actualizarPrueba();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    alphaSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        alphaInput.value = value;
        alphaValue.innerText = value.toFixed(2);
        actualizarPrueba();
    });


    // alphaSlider.addEventListener('input', function() {
    //     alphaValue.innerText = parseFloat(this.value).toFixed(2);
    //     actualizarPrueba();
    // });

    tipoTestSelect.addEventListener('change', function() {
        actualizarPrueba();
    });

    // Realizar el análisis inicial
    actualizarPrueba();
}

// Función para actualizar la Prueba de Hipótesis
function actualizarPrueba() {
    // Obtener valores de los parámetros
    const mu0 = parseFloat(document.getElementById('mu0Input').value);
    const sigma = parseFloat(document.getElementById('sigmaInput').value);
    const xBar = parseFloat(document.getElementById('xBarInput').value);
    const n = parseInt(document.getElementById('nInput').value);
    const alpha = parseFloat(document.getElementById('alphaInput').value);
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

    crearGraficoMediaMuestral(mu0, se, xBar);
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
        shapes: [], // Añadimos esta línea para incluir formas (líneas verticales)
        annotations: [] // Añadimos esta línea para incluir anotaciones de texto
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
            name: 'Zona de Rechazo'
        };
        // Área a la derecha
        const errorTipoI2 = {
            x: xValues.filter(x => x >= zCriticalUpper),
            y: yValues.slice(xValues.findIndex(x => x >= zCriticalUpper)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Región Crítica Derecha',
            showlegend: false
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
            name: 'Zona de Rechazo'
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
            name: 'Zona de Rechazo'
        };
        data.push(errorTipoI);
    }

    // Definir las áreas del p-valor en verde
    if (tipoTest === 'two-tailed') {
        // Área a la izquierda
        const pValueArea1 = {
            x: xValues.filter(x => x <= -Math.abs(z)),
            y: yValues.slice(0, xValues.findIndex(x => x > -Math.abs(z))),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
            name: 'p-Valor Izquierda',
            showlegend: false
        };
        // Área a la derecha
        const pValueArea2 = {
            x: xValues.filter(x => x >= Math.abs(z)),
            y: yValues.slice(xValues.findIndex(x => x >= Math.abs(z))),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
            name: 'p-Valor'
        };
        data.push(pValueArea1, pValueArea2);
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
        // y: [jStat.normal.pdf(z, 0, 1)],
        type: 'scatter',
        mode: 'markers',
        name: 'Estadístico Observado (z)',
        marker: { color: 'black', size: 8 }
    });

    // Añadir líneas verticales y anotaciones para los valores críticos
    if (tipoTest === 'two-tailed') {
        // Línea y anotación para zCriticalLower
        if (zCriticalLower !== null) {
            layout.shapes.push({
                type: 'line',
                x0: zCriticalLower,
                y0: 0,
                x1: zCriticalLower,
                y1: 0,
                // y1: jStat.normal.pdf(zCriticalLower, 0, 1),
                line: {
                    color: 'red',
                    width: 1,
                    dash: 'solid'
                }
            });
            layout.annotations.push({
                x: zCriticalLower,
                // y: jStat.normal.pdf(zCriticalLower, 0, 1),
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z₁ = ${zCriticalLower.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: -40,
                ay: 20,
                font: {
                    color: 'red'
                }

            });
            layout.annotations.push({
                x: z,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z = ${z.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: z < 0 ? -40 : 40, // Ajusta la dirección de la flecha según el signo de z
                ay: 20,
                font: {
                    color: 'black'
                }
            });
        }

        // Línea y anotación para zCriticalUpper
        if (zCriticalUpper !== null) {
            layout.shapes.push({
                type: 'line',
                x0: zCriticalUpper,
                y0: 0,
                x1: zCriticalUpper,
                y1: jStat.normal.pdf(zCriticalUpper, 0, 1),
                line: {
                    color: 'red',
                    width: 1,
                    dash: 'solid'
                }
            });
            layout.annotations.push({
                x: zCriticalUpper,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z₂ = ${zCriticalUpper.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: 40,
                ay: 20,
                font: {
                    color: 'red'
                }
            });
        }

    } else if (tipoTest === 'left-tailed') {
        // Línea y anotación para zCriticalLower
        if (zCriticalLower !== null) {
            layout.shapes.push({
                type: 'line',
                x0: zCriticalLower,
                y0: 0,
                x1: zCriticalLower,
                y1: jStat.normal.pdf(zCriticalLower, 0, 1),
                line: {
                    color: 'red',
                    width: 1,
                    dash: 'solid'
                }
            });
            layout.annotations.push({
                x: zCriticalLower,
                // y: jStat.normal.pdf(zCriticalLower, 0, 1),
                y: 0,
                xref: 'x', 
                yref: 'y',
                text: `z₁ = ${zCriticalLower.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: -40,
                ay: 20,
                font: {
                    color: 'red'
                }
            });
            layout.annotations.push({
                x: z,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z = ${z.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: z < 0 ? -40 : 40, // Ajusta la dirección de la flecha según el signo de z
                ay: -10,
                font: {
                    color: 'black'
                }
            });
        }

    } else if (tipoTest === 'right-tailed') {
        // Línea y anotación para zCriticalUpper
        if (zCriticalUpper !== null) {
            layout.shapes.push({
                type: 'line',
                x0: zCriticalUpper,
                y0: 0,
                x1: zCriticalUpper,
                y1: jStat.normal.pdf(zCriticalUpper, 0, 1),
                line: {
                    color: 'red',
                    width: 1,
                    dash: 'solid'
                }
            });
            layout.annotations.push({
                x: zCriticalUpper,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z₂ = ${zCriticalUpper.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: 40,
                ay: 20,
                font: {
                    color: 'red'
                }
            });
            layout.annotations.push({
                x: z,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `z = ${z.toFixed(2)}`,
                showarrow: true,
                arrowhead: 2,
                ax: z < 0 ? -40 : 40, // Ajusta la dirección de la flecha según el signo de z
                ay: 20,
                font: {
                    color: 'black'
                }
            });
        }
    }

    // Plotear el gráfico
    Plotly.newPlot('graficaDistribucion', data, layout);
}

function crearGraficoMediaMuestral(mu0, se, xBar) {
    const data = [];
    const layout = {
        title: 'Distribución de la Media Muestral',
        xaxis: { title: 'Media Muestral (x̄)' },
        yaxis: { title: 'Densidad' },
        shapes: [], // Para las líneas verticales
        annotations: [] // Para las anotaciones de texto
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

    // Calcular los límites críticos y áreas según el tipo de prueba
    const alpha = parseFloat(document.getElementById('alphaInput').value);
    const tipoTest = document.getElementById('tipoTest').value;
    let criticalLower = null;
    let criticalUpper = null;

    if (tipoTest === 'two-tailed') {
        criticalLower = mu0 + jStat.normal.inv(alpha / 2, 0, 1) * se;
        criticalUpper = mu0 + jStat.normal.inv(1 - alpha / 2, 0, 1) * se;

        // Área de Error de Tipo I (Región Crítica)
        const errorTipoIAreaLeft = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(255, 0, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Zona de Rechazo'
        };

        const errorTipoIAreaRight = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(255, 0, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            showlegend: false
           // name: 'Región Crítica Derecha'
        };

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] <= criticalLower) {
                errorTipoIAreaLeft.x.push(xValues[i]);
                errorTipoIAreaLeft.y.push(yValues[i]);
            }

            if (xValues[i] >= criticalUpper) {
                errorTipoIAreaRight.x.push(xValues[i]);
                errorTipoIAreaRight.y.push(yValues[i]);
            }
        }

        data.push(errorTipoIAreaLeft);
        data.push(errorTipoIAreaRight);

        // Área del p-Valor
        const pValueAreaLeft = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(0, 255, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'p-Valor'
        };

        const pValueAreaRight = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(0, 255, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'p-Valor Derecha',
            showlegend: false
        };

        const xBarDistance = Math.abs(xBar - mu0);

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] <= mu0 - xBarDistance) {
                pValueAreaLeft.x.push(xValues[i]);
                pValueAreaLeft.y.push(yValues[i]);
            }

            if (xValues[i] >= mu0 + xBarDistance) {
                pValueAreaRight.x.push(xValues[i]);
                pValueAreaRight.y.push(yValues[i]);
            }
        }

        data.push(pValueAreaLeft);
        data.push(pValueAreaRight);

    } else if (tipoTest === 'left-tailed') {
        criticalLower = mu0 + jStat.normal.inv(alpha, 0, 1) * se;

        // Área de Error de Tipo I (Región Crítica)
        const errorTipoIArea = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(255, 0, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Zona de Rechazo'
        };

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] <= criticalLower) {
                errorTipoIArea.x.push(xValues[i]);
                errorTipoIArea.y.push(yValues[i]);
            }
        }

        data.push(errorTipoIArea);

        // Área del p-Valor
        const pValueArea = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(0, 255, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'p-Valor'
        };

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] <= xBar) {
                pValueArea.x.push(xValues[i]);
                pValueArea.y.push(yValues[i]);
            }
        }

        data.push(pValueArea);

    } else if (tipoTest === 'right-tailed') {
        criticalUpper = mu0 + jStat.normal.inv(1 - alpha, 0, 1) * se;

        // Área de Error de Tipo I (Región Crítica)
        const errorTipoIArea = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(255, 0, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Zona de Rechazo'
        };

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] >= criticalUpper) {
                errorTipoIArea.x.push(xValues[i]);
                errorTipoIArea.y.push(yValues[i]);
            }
        }

        data.push(errorTipoIArea);

        // Área del p-Valor
        const pValueArea = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(0, 255, 0, 0)' }, // Sin línea
            fill: 'tozeroy',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'p-Valor'
        };

        for (let i = 0; i < xValues.length; i++) {
            if (xValues[i] >= xBar) {
                pValueArea.x.push(xValues[i]);
                pValueArea.y.push(yValues[i]);
            }
        }

        data.push(pValueArea);
    }

    // Añadir la media muestral observada
    data.push({
        x: [xBar],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Media Muestral Observada',
        marker: { color: 'green', size: 8 }
    });

    // Añadir la media bajo H₀
    data.push({
        x: [mu0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        name: 'Media Bajo H₀',
        marker: { color: 'red', size: 8 }
    });

    // Añadir líneas verticales y anotaciones para los valores críticos
    if (criticalLower !== null) {
        layout.shapes.push({
            type: 'line',
            x0: criticalLower,
            y0: 0,
            x1: criticalLower,
            y1: 0,
            line: {
                color: 'red',
                width: 1,
                dash: 'dash'
            }
        });

        layout.annotations.push({
            x: criticalLower,
            y: 0,
            xref: 'x',
            yref: 'y',
            text: `x̄ inferior = ${criticalLower.toFixed(2)}`,
            showarrow: true,
            arrowhead: 2,
            ax: -40,
            ay: -20,
            font: { color: 'red' }
        });
    }

    if (criticalUpper !== null) {
        layout.shapes.push({
            type: 'line',
            x0: criticalUpper,
            y0: 0,
            x1: criticalUpper,
            y1: 0,
            line: {
                color: 'red',
                width: 1,
                dash: 'dash'
            }
        });

        layout.annotations.push({
            x: criticalUpper,
            y: 0,
            xref: 'x',
            yref: 'y',
            text: `x̄ superior = ${criticalUpper.toFixed(2)}`,
            showarrow: true,
            arrowhead: 2,
            ax: 40,
            ay: -20,
            font: { color: 'red' }
        });
    }

    // Añadir anotación para el estadístico observado
    layout.annotations.push({
        x: xBar,
        y: 0,
        xref: 'x',
        yref: 'y',
        text: `x̄ = ${xBar.toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { color: 'green' }
    });

    // Añadir anotación para la media bajo H₀
    layout.annotations.push({
        x: mu0,
        y: 0,
        xref: 'x',
        yref: 'y',
        text: `μ₀ = ${mu0.toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        ax: -40,
        ay: -40,
        font: { color: 'red' }
    });

    // Plotear el gráfico
    Plotly.newPlot('graficaMediaMuestral', data, layout);
}

// Iniciar la sección de Prueba de Hipótesis cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarPruebaHipotesisMedia);