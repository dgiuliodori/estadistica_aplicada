// prueba_hipotesis_varianza.js

// Función para iniciar la sección de Prueba de Hipótesis sobre la Varianza
function iniciarPruebaHipotesisVarianza() {
    // Obtener elementos de entrada
    const sigma0Input = document.getElementById('sigma0Input');
    const sigma0Slider = document.getElementById('sigma0Slider');
    const sInput = document.getElementById('sInput');
    const sSlider = document.getElementById('sSlider');
    // const sigma0Value = document.getElementById('sigma0Value');
    // const sSlider = document.getElementById('s');
    const sValue = document.getElementById('sValue');
    const nInput = document.getElementById('nInput');
    const nSlider = document.getElementById('nSlider');
    const nValue = document.getElementById('nValue');
    const alphaSlider = document.getElementById('alphaSlider');
    const alphaValue = document.getElementById('alphaValue');
    const tipoTestSelect = document.getElementById('tipoTest');
    
    sigma0Slider.min = "1";
    sigma0Slider.max = "100";
    sigma0Input.min = "1";
    sigma0Input.max = "100";
    sSlider.min = "1";
    sSlider.max = "100";
    sInput.min = "1";
    sInput.max = "100";
    nSlider.min = "2";
    nSlider.max = "100";
    nInput.min = "2";
    nInput.max = "100";
    alphaSlider.min = "0.01";
    alphaSlider.max = "0.5";
    alphaInput.min = "0.01";
    alphaInput.max = "0.5";


    // Sincronizar los valores iniciales
    sigma0Input.value = sigma0Slider.value;
    sigma0Value.innerText = parseFloat(sigma0Slider.value).toFixed(1);

    sInput.value = sSlider.value;
    sValue.innerText = parseFloat(sSlider.value).toFixed(1);

    nInput.value = nSlider.value;
    nValue.innerText = parseFloat(nSlider.value).toFixed(1);

    alphaInput.value = alphaSlider.value;
    alphaValue.innerText = parseFloat(alphaSlider.value).toFixed(2);

    // Añadir eventos para actualizar cuando cambien los parámetros

    //-------------------------------------------------------------------------------------------------//
    // MEDIA POBLACIONA (H0)
    //-------------------------------------------------------------------------------------------------//

    // Evento para actualizar el slider cuando cambia el input numérico
    sigma0Input.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(sigma0Slider.min)) {
                sigma0Slider.min = value;
            }
            if (value > parseFloat(sigma0Slider.max)) {
                sigma0Slider.max = value;
            }

            sigma0Slider.value = value;
            sigma0Value.innerText = value.toFixed(1);
            actualizarPruebaVarianza();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    sigma0Slider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        sigma0Input.value = value;
        sigma0Value.innerText = value.toFixed(1);
        actualizarPruebaVarianza();
    });


    //-------------------------------------------------------------------------------------------------//
    // VARIANZA MUESTRAL - sSlider
    //-------------------------------------------------------------------------------------------------//

    // Evento para actualizar el slider cuando cambia el input numérico
    sInput.addEventListener('input', function() {
        let value = parseFloat(this.value);

        // Validar si el valor es un número
        if (!isNaN(value)) {
            // Ajustar el slider para incluir el valor si está fuera del rango actual
            if (value < parseFloat(sSlider.min)) {
                sSlider.min = value;
            }
            if (value > parseFloat(sSlider.max)) {
                sSlider.max = value;
            }

            sSlider.value = value;
            sValue.innerText = value.toFixed(1);
            actualizarPruebaVarianza();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    sSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        sInput.value = value;
        sValue.innerText = value.toFixed(1);
        actualizarPruebaVarianza();
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
            nValue.innerText = value.toFixed(0);
            actualizarPruebaVarianza();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    nSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        nInput.value = value;
        nValue.innerText = value.toFixed(0);
        actualizarPruebaVarianza();
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
            actualizarPruebaVarianza();
        }
    });

    // Evento para actualizar el input numérico cuando cambia el slider
    alphaSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        alphaInput.value = value;
        alphaValue.innerText = value.toFixed(2);
        actualizarPruebaVarianza();
    });


    // alphaSlider.addEventListener('input', function() {
    //     alphaValue.innerText = parseFloat(this.value).toFixed(2);
    //     actualizarPruebaVarianza();
    // });

    tipoTestSelect.addEventListener('change', actualizarPruebaVarianza);
    
    // Realizar el análisis inicial
    actualizarPruebaVarianza();
}

// Función para actualizar la Prueba de Hipótesis sobre la Varianza
function actualizarPruebaVarianza() {
    // Obtener valores de los parámetros
    const sigma0 = parseFloat(document.getElementById('sigma0Input').value);
    const s = parseFloat(document.getElementById('sInput').value);
    const n = parseInt(document.getElementById('nInput').value);
    const alpha = parseFloat(document.getElementById('alphaInput').value);
    const tipoTest = document.getElementById('tipoTest').value;
    
    // Validaciones básicas
    if (isNaN(sigma0) || isNaN(s) || isNaN(n) || n <= 1 || sigma0 <= 0 || s <= 0) {
        alert('Por favor, ingresa valores válidos para todos los parámetros. El tamaño de muestra (n) debe ser mayor que 1.');
        return;
    }
    
    // Calcular el estadístico chi-cuadrado (χ²)
    const chi2 = (n - 1) * s / sigma0;
    
    // Determinar los valores críticos según el tipo de prueba
    let chi2CriticalLower = null;
    let chi2CriticalUpper = null;
    
    if (tipoTest === 'two-tailed') {
        chi2CriticalLower = jStat.chisquare.inv(alpha / 2, n - 1);
        chi2CriticalUpper = jStat.chisquare.inv(1 - alpha / 2, n - 1);
    } else if (tipoTest === 'left-tailed') {
        chi2CriticalLower = jStat.chisquare.inv(alpha, n - 1);
    } else if (tipoTest === 'right-tailed') {
        chi2CriticalUpper = jStat.chisquare.inv(1 - alpha, n - 1);
    }
    
    // Calcular el p-valor según el tipo de prueba
    let pValue = 0;
    if (tipoTest === 'two-tailed') {
        pValue = 2 * Math.min(jStat.chisquare.cdf(chi2, n - 1), 1 - jStat.chisquare.cdf(chi2, n - 1));
    } else if (tipoTest === 'left-tailed') {
        pValue = jStat.chisquare.cdf(chi2, n - 1);
    } else if (tipoTest === 'right-tailed') {
        pValue = 1 - jStat.chisquare.cdf(chi2, n - 1);
    }
    
    // Conclusión
    let conclusion = '';
    if (tipoTest === 'two-tailed') {
        conclusion = pValue < alpha ? 'Se rechaza la hipótesis nula.' : 'No se rechaza la hipótesis nula.';
    } else if (tipoTest === 'left-tailed') {
        conclusion = pValue < alpha ? 'Se rechaza la hipótesis nula.' : 'No se rechaza la hipótesis nula.';
    } else if (tipoTest === 'right-tailed') {
        conclusion = pValue < alpha ? 'Se rechaza la hipótesis nula.' : 'No se rechaza la hipótesis nula.';
    }
    
    // Mostrar resultados
    mostrarResultadosVarianza(sigma0, s, n, chi2, chi2CriticalLower, chi2CriticalUpper, pValue, alpha, tipoTest, conclusion);
    
    // Crear gráfico
    crearGraficoVarianza(chi2, chi2CriticalLower, chi2CriticalUpper, alpha, tipoTest, n - 1);
}

// Función para mostrar los resultados en la página
function mostrarResultadosVarianza(sigma0, s, n, chi2, chi2CriticalLower, chi2CriticalUpper, pValue, alpha, tipoTest, conclusion) {
    const resultadosDiv = document.getElementById('resultadosPruebaVarianza');
    
    // Formatear los números a 4 decimales
    const chi2Formatted = chi2.toFixed(4);
    const pValueFormatted = pValue.toFixed(4);
    const alphaFormatted = alpha.toFixed(2);
    
    // Determinar los valores críticos formateados
    let chi2CritLowerFormatted = '-';
    let chi2CritUpperFormatted = '-';
    if (chi2CriticalLower !== null) {
        chi2CritLowerFormatted = chi2CriticalLower.toFixed(4);
    }
    if (chi2CriticalUpper !== null) {
        chi2CritUpperFormatted = chi2CriticalUpper.toFixed(4);
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
            <h2>Resultados de la Prueba de Hipótesis sobre la Varianza</h2>
            <table class="tabla-resumen-prueba-hipotesis">
                <tr>
                    <th>Parámetro</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Hipótesis Nula (σ₀²)</td>
                    <td>${sigma0.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Varianza Muestral (s²)</td>
                    <td>${s.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Tamaño de Muestra (n)</td>
                    <td>${n}</td>
                </tr>
                <tr>
                    <td>Grados de Libertad (n-1)</td>
                    <td>${n-1}</td>
                </tr>
                <tr>
                    <td>Estadístico de Prueba (χ²)</td>
                    <td>${chi2Formatted}</td>
                </tr>
                <tr>
                    <td>Valor Crítico Superior (χ²₂)</td>
                    <td>${chi2CritUpperFormatted}</td>
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
            </table>
            <p><strong>Conclusión:</strong> ${conclusion}</p>
        </div>
    `;
}

// Función para crear el gráfico de la distribución chi-cuadrado
function crearGraficoVarianza(chi2, chi2CriticalLower, chi2CriticalUpper, alpha, tipoTest, df) {
    const data = [];
    const layout = {
        title: `Distribución Chi-Cuadrado (gl = ${df})`,
        xaxis: { title: 'Valor de χ²' },
        yaxis: { title: 'Densidad' },
        shapes: [],
        annotations: [ // Añadimos las anotaciones aquí
            {
                x: chi2,
                // y: jStat.normal.pdf(xBar, mu0, se),
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `Obs = ${chi2.toFixed(1)}`,
                showarrow: true,
                arrowhead: 1,
                ax: 40,
                ay: 25,
                font: {
                    color: 'green'
                }
            },
            {
                x: chi2CriticalUpper,
                y: 0, 
                xref: 'x',
                yref: 'y',
                text: `χ² = ${chi2CriticalUpper.toFixed(1)}`,
                showarrow: true,
                arrowhead: 1,
                ax: 50,
                ay: 10,
                font: {
                    color: 'red'
                }
            },
        ]
    };
    
    // Definir el rango para el gráfico
    const xMin = 0;
    const xMax = jStat.chisquare.inv(0.999, df); // Para asegurar que la gráfica cubre el área de interés
    const step = (xMax - xMin) / 1000;
    const xValues = [];
    const yValues = [];
    
    for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
        yValues.push(jStat.chisquare.pdf(x, df));
    }
    
    // Crear la curva de la distribución chi-cuadrado
    data.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Distribución Chi-Cuadrado',
        line: { color: '#1f77b4' }
    });
    
    // Definir las áreas de significancia en rojo
    if (tipoTest === 'two-tailed') {
        // Área a la izquierda
        const errorTipoI1 = {
            x: xValues.filter(x => x <= chi2CriticalLower),
            y: yValues.slice(0, xValues.findIndex(x => x > chi2CriticalLower)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)', // Rojo semitransparente
            name: 'Error Tipo I Izquierda'
        };
        // Área a la derecha
        const errorTipoI2 = {
            x: xValues.filter(x => x >= chi2CriticalUpper),
            y: yValues.slice(xValues.findIndex(x => x >= chi2CriticalUpper)),
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
            x: xValues.filter(x => x <= chi2CriticalLower),
            y: yValues.slice(0, xValues.findIndex(x => x > chi2CriticalLower)),
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
            x: xValues.filter(x => x >= chi2CriticalUpper),
            y: yValues.slice(xValues.findIndex(x => x >= chi2CriticalUpper)),
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

        
        if (cdfLower < cdfUpper) {
            // Área a la izquierda
            const pValueArea1 = {
                x: xValues.filter(x => x <= chi2),
                y: yValues.slice(0, xValues.findIndex(x => x > chi2)),
                fill: 'tozeroy',
                type: 'scatter',
                mode: 'none',
                fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
                name: 'p-Valor Izquierda'
            };
            data.push(pValueArea1);
        } else {
            // Área a la derecha
            const pValueArea2 = {
                x: xValues.filter(x => x >= chi2),
                y: yValues.slice(xValues.findIndex(x => x >= chi2)),
                fill: 'tozeroy',
                type: 'scatter',
                mode: 'none',
                fillcolor: 'rgba(0, 255, 0, 0.3)', // Verde semitransparente
                name: 'p-Valor Derecha'
            };
            data.push(pValueArea2);
        }
    } else if (tipoTest === 'left-tailed') {
        // Área a la izquierda
        const pValueArea = {
            x: xValues.filter(x => x <= chi2),
            y: yValues.slice(0, xValues.findIndex(x => x > chi2)),
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
            x: xValues.filter(x => x >= chi2),
            y: yValues.slice(xValues.findIndex(x => x >= chi2)),
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
        x: [chi2],
        // y: [jStat.chisquare.pdf(chi2, df)],
        y: 0,
        type: 'scatter',
        mode: 'markers',
        name: 'Estadístico Observado',
        marker: { color: 'green', size: 10 }
    });


    
    
    // Plotear el gráfico
    Plotly.newPlot('graficaDistribucionVarianza', data, layout);
}

// Iniciar la sección de Prueba de Hipótesis sobre la Varianza cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarPruebaHipotesisVarianza);