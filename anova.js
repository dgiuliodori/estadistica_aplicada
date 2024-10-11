// anova.js

// Función para iniciar la sección de ANOVA
function iniciarANOVA() {
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    // Limpiar contenido previo
    sidebarDiv.innerHTML = '';
    contentDiv.innerHTML = '';

    // Número fijo de tratamientos
    const k = 3;

    // Controles interactivos en la barra lateral
    sidebarDiv.innerHTML = `
        <h2>Parámetros</h2>
        <div class="parametros">
            <div class="slider-container">
                <label for="mean1">Media Tratamiento 1: <span id="mu1Value" class="slider-value">10</span></label>
                <input type="range" id="mean1" min="0" max="30" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="mean2">Media Tratamiento 2: <span id="mu2Value" class="slider-value">10</span></label>
                <input type="range" id="mean2" min="0" max="30" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="mean3">Media Tratamiento 3: <span id="mu3Value" class="slider-value">10</span></label>
                <input type="range" id="mean3" min="0" max="30" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="n1Slider">Tamaño de Muestra Tratamiento 1 (n₁): <span id="n1Value" class="slider-value">10</span></label>
                <input type="range" id="n1Slider" min="3" max="20" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="n2Slider">Tamaño de Muestra Tratamiento 2 (n₂): <span id="n2Value" class="slider-value">10</span></label>
                <input type="range" id="n2Slider" min="3" max="20" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="n3Slider">Tamaño de Muestra Tratamiento 3 (n₃): <span id="n3Value" class="slider-value">10</span></label>
                <input type="range" id="n3Slider" min="3" max="20" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="sigmaSlider">Desviación Estándar (σ): <span id="sigmaValue" class="slider-value">1.0</span></label>
                <input type="range" id="sigmaSlider" min="0.1" max="5" step="0.1" value="1.0">
            </div>
            <div class="slider-container">
                <label for="alphaSlider">Nivel de Significancia (α): <span id="alphaValue" class="slider-value">0.05</span></label>
                <input type="range" id="alphaSlider" min="0.001" max="0.1" step="0.001" value="0.05">
            </div>
        </div>
    `;

    contentDiv.innerHTML = `
        <div id="resultadosANOVA" class="resultado">
            <!-- Aquí se mostrará la tabla ANOVA y los resultados -->
        </div>
        <div id="graficaBoxplot" style="width: 100%; height: 400px;"></div>
        <div id="graficaMedias" style="width: 100%; height: 400px;"></div>
        <div id="graficaQQPlotANOVA" style="width: 100%; height: 400px;"></div>
        <div id="tukeyResultados"></div>
    `;

    // Función auxiliar para configurar eventos
    function configurarEvento(inputId, displayId, parseFunc, updateFunc) {
        document.getElementById(inputId).addEventListener('input', function() {
            document.getElementById(displayId).innerText = parseFunc(this.value);
            updateFunc();
        });
    }

    // Configurar eventos para los sliders
    configurarEvento('mean1', 'mu1Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('mean2', 'mu2Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('mean3', 'mu3Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('n1Slider', 'n1Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('n2Slider', 'n2Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('n3Slider', 'n3Value', val => parseInt(val), actualizarANOVA);
    configurarEvento('sigmaSlider', 'sigmaValue', val => parseFloat(val).toFixed(1), actualizarANOVA);
    configurarEvento('alphaSlider', 'alphaValue', val => parseFloat(val).toFixed(3), actualizarANOVA);

    // Realizar el análisis inicial
    actualizarANOVA();
}

// Función para actualizar el análisis ANOVA
function actualizarANOVA() {
    const alpha = parseFloat(document.getElementById('alphaSlider').value);
    const sigma = parseFloat(document.getElementById('sigmaSlider').value);

    // Obtener las medias de cada tratamiento
    const mean1 = parseFloat(document.getElementById('mean1').value);
    const mean2 = parseFloat(document.getElementById('mean2').value);
    const mean3 = parseFloat(document.getElementById('mean3').value);

    // Obtener los tamaños de muestra de cada tratamiento
    const n1 = parseInt(document.getElementById('n1Slider').value);
    const n2 = parseInt(document.getElementById('n2Slider').value);
    const n3 = parseInt(document.getElementById('n3Slider').value);

    const k = 3;
    const N = n1 + n2 + n3;

    console.log('Parámetros:', { alpha, sigma, mean1, mean2, mean3, n1, n2, n3, k, N });

    // Validaciones básicas
    if (sigma <= 0) {
        alert('La desviación estándar (σ) debe ser mayor que cero.');
        return;
    }
    if (n1 < 2 || n2 < 2 || n3 < 2) {
        alert('El tamaño de muestra por tratamiento (n₁, n₂, n₃) debe ser al menos 2.');
        return;
    }

    // Generar datos aleatorios para cada tratamiento
    const data = [];
    const totalData = [];

    const means = [mean1, mean2, mean3];
    const ns = [n1, n2, n3];

    for (let i = 0; i < k; i++) {
        const tratamiento = [];
        for (let j = 0; j < ns[i]; j++) {
            const value = jStat.normal.sample(means[i], sigma);
            tratamiento.push(value);
            totalData.push({ tratamiento: 'Tratamiento ' + (i + 1), valor: value });
        }
        data.push(tratamiento);
    }

    // Calcular la media general (media ponderada)
    const grandMean = (mean1 * n1 + mean2 * n2 + mean3 * n3) / N;

    // Suma de cuadrados entre tratamientos (SCE)
    let SCE = 0;
    for (let i = 0; i < k; i++) {
        SCE += ns[i] * Math.pow(means[i] - grandMean, 2);
    }

    // Suma de cuadrados dentro de tratamientos (SCD)
    let SCD = 0;
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < ns[i]; j++) {
            SCD += Math.pow(data[i][j] - means[i], 2);
        }
    }

    // Suma de cuadrados total (SCT)
    const SCT = SCE + SCD;

    // Grados de libertad
    const df_between = k - 1;
    const df_within = N - k;
    const df_total = N - 1;

    // Cuadrados medios
    const CM_between = SCE / df_between;
    const CM_within = SCD / df_within;

    // Estadístico F
    const F_obs = CM_between / CM_within;

    // p-valor
    const p_value = 1 - jStat.centralF.cdf(F_obs, df_between, df_within);

    // Conclusión
    const conclusion = p_value > alpha ? 'No se rechaza la hipótesis nula' : 'Se rechaza la hipótesis nula';

    console.log('ANOVA Resultados:', { SCE, SCD, SCT, df_between, df_within, df_total, CM_between, CM_within, F_obs, p_value, conclusion });

    // Mostrar resultados
    mostrarResultadosANOVA(data, totalData, SCE, SCD, SCT, df_between, df_within, df_total, CM_between, CM_within, F_obs, p_value, alpha, conclusion, means, grandMean);
    
    // Realizar el test de Tukey solo si se rechaza la hipótesis nula
   // if (conclusion === 'Se rechaza la hipótesis nula') {
   //     realizarTukey(data, alpha, df_within);
    // } else {
        // Si no se rechaza, limpiamos el área de Tukey
        // actualizarTukeyResultados([]);
    // }
    
    // Actualizar los gráficos
    actualizarGraficosANOVA(data, totalData, means, ns, alpha);
}

// Función para mostrar los resultados del ANOVA
function mostrarResultadosANOVA(data, totalData, SCE, SCD, SCT, df_between, df_within, df_total, CM_between, CM_within, F_obs, p_value, alpha, conclusion, means, grandMean) {
    const resultadosDiv = document.getElementById('resultadosANOVA');

    resultadosDiv.innerHTML = `
        <div class="info">
            <h2>Tabla ANOVA</h2>
            <table class="tabla-resumen">
                <tr>
                    <th>Fuente</th>
                    <th>SC</th>
                    <th>GL</th>
                    <th>CM</th>
                    <th>F</th>
                    <th>p-valor</th>
                </tr>
                <tr>
                    <td>Entre Grupos</td>
                    <td>${SCE.toFixed(4)}</td>
                    <td>${df_between}</td>
                    <td>${CM_between.toFixed(4)}</td>
                    <td>${F_obs.toFixed(4)}</td>
                    <td>${p_value.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Dentro de Grupos</td>
                    <td>${SCD.toFixed(4)}</td>
                    <td>${df_within}</td>
                    <td>${CM_within.toFixed(4)}</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>${SCT.toFixed(4)}</td>
                    <td>${df_total}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </table>
            <p><strong>Nivel de significancia (α):</strong> ${alpha}</p>
            <p><strong>Conclusión:</strong> ${conclusion}</p>
        </div>
    `;
}

// Función para actualizar los resultados de Tukey
function actualizarTukeyResultados(comparaciones) {
    const tukeyDiv = document.getElementById('tukeyResultados');

    if (comparaciones.length === 0) {
        tukeyDiv.innerHTML = '';
        return;
    }

    let tukeyHTML = `
        <div class="info">
            <h2>Resultados de la Prueba de Tukey</h2>
            <table class="tabla-resumen">
                <tr>
                    <th>Grupo 1</th>
                    <th>Grupo 2</th>
                    <th>Dif. Media</th>
                    <th>p-valor Ajustado</th>
                    <th>IC Inferior</th>
                    <th>IC Superior</th>
                    <th>Rechazar H0</th>
                </tr>
    `;

    comparaciones.forEach(c => {
        tukeyHTML += `
            <tr>
                <td>${c.group1}</td>
                <td>${c.group2}</td>
                <td>${c.meandiff}</td>
                <td>${c.p_adj}</td>
                <td>${c.lower}</td>
                <td>${c.upper}</td>
                <td>${c.reject ? 'Sí' : 'No'}</td>
            </tr>
        `;
    });

    tukeyHTML += `
            </table>
        </div>
    `;

    tukeyDiv.innerHTML = tukeyHTML;
}

// Función para actualizar los gráficos del ANOVA
function actualizarGraficosANOVA(data, totalData, means, ns, alpha) {
    // Crear boxplot
    const dataBoxplot = data.map((grupo, index) => ({
        y: grupo,
        type: 'box',
        name: 'Tratamiento ' + (index + 1)
    }));

    const layoutBoxplot = {
        title: 'Boxplot de los Tratamientos',
        yaxis: { title: 'Valores' }
    };

    Plotly.react('graficaBoxplot', dataBoxplot, layoutBoxplot);

    // Gráfico de medias con intervalos de confianza
    const medias = means;
    const errores = data.map((grupo, index) => {
        const se = math.std(grupo, true) / Math.sqrt(ns[index]);
        const t_crit = jStat.studentt.inv(1 - (alpha / 2), ns[index] - 1);
        return t_crit * se;
    });
    const nombres = ['Tratamiento 1', 'Tratamiento 2', 'Tratamiento 3'];

    const traceMedias = {
        x: nombres,
        y: medias,
        error_y: {
            type: 'data',
            array: errores,
            visible: true
        },
        type: 'bar',
        name: 'Medias',
        marker: { color: 'orange' }
    };

    const layoutMedias = {
        title: `Medias de los Tratamientos con IC al ${(1 - alpha) * 100}%`,
        yaxis: { title: 'Media' }
    };

    Plotly.react('graficaMedias', [traceMedias], layoutMedias);

    // QQ-Plot de los residuos
    const residuos = [];
    totalData.forEach(d => {
        const tratamientoIndex = parseInt(d.tratamiento.split(' ')[1]) - 1;
        const meanTratamiento = math.mean(data[tratamientoIndex]);
        residuos.push(d.valor - meanTratamiento);
    });

    const residuosOrdenados = [...residuos].sort((a, b) => a - b);
    const nRes = residuosOrdenados.length;
    const quantilesTeoricos = [];
    const residuosStd = math.std(residuos, true);

    for (let i = 0; i < nRes; i++) {
        const p = (i + 0.5) / nRes;
        quantilesTeoricos.push(jStat.normal.inv(p, 0, residuosStd));
    }

    const traceQQPlot = {
        x: quantilesTeoricos,
        y: residuosOrdenados,
        mode: 'markers',
        type: 'scatter',
        name: 'QQ-Plot',
        marker: { color: 'purple' }
    };

    const layoutQQPlot = {
        title: 'QQ-Plot de los Residuos',
        xaxis: { title: 'Cuantiles Teóricos' },
        yaxis: { title: 'Cuantiles de los Residuos' },
        shapes: [
            {
                type: 'line',
                x0: Math.min(...quantilesTeoricos),
                y0: Math.min(...quantilesTeoricos),
                x1: Math.max(...quantilesTeoricos),
                y1: Math.max(...quantilesTeoricos),
                line: { color: 'red', dash: 'dash' }
            }
        ]
    };

    Plotly.react('graficaQQPlotANOVA', [traceQQPlot], layoutQQPlot);
}

// Función para realizar la prueba de Tukey
function realizarTukey(data, alpha, df_within) {
    console.log('Iniciando la Prueba de Tukey');
    
    const tratamientosUnicos = ['Tratamiento 1', 'Tratamiento 2', 'Tratamiento 3'];
    const comparaciones = [];

    for (let i = 0; i < tratamientosUnicos.length; i++) {
        for (let j = i + 1; j < tratamientosUnicos.length; j++) {
            const grupo1 = tratamientosUnicos[i];
            const grupo2 = tratamientosUnicos[j];

            const valores1 = data[i];
            const valores2 = data[j];

            const mean1 = math.mean(valores1);
            const mean2 = math.mean(valores2);
            const diff = mean1 - mean2;

            // Calcular el error estándar ajustado para tamaños de muestra diferentes
            const se = Math.sqrt((math.var(valores1, true) / valores1.length) + (math.var(valores2, true) / valores2.length));

            // Calcular el valor crítico q
            const q_crit = jStat.studentizedRange.inv(1 - alpha, tratamientosUnicos.length, df_within);
            console.log(`q_crit para ${grupo1} vs ${grupo2}:`, q_crit);

            // Calcular el margen de error
            const marginError = (q_crit * se) / Math.sqrt(2);

            // Intervalos de confianza
            const ci_lower = diff - marginError;
            const ci_upper = diff + marginError;

            // Calcular el valor observado q_obs
            const q_obs = Math.abs(diff) / se;
            console.log(`q_obs para ${grupo1} vs ${grupo2}:`, q_obs);

            // p-valor utilizando la distribución studentized range
            const p_value = 1 - jStat.studentizedRange.cdf(q_obs, tratamientosUnicos.length, df_within);
            console.log(`p_value para ${grupo1} vs ${grupo2}:`, p_value);

            // Conclusión
            const reject = p_value < alpha;

            comparaciones.push({
                group1: grupo1,
                group2: grupo2,
                meandiff: diff.toFixed(4),
                p_adj: p_value.toFixed(4),
                lower: ci_lower.toFixed(4),
                upper: ci_upper.toFixed(4),
                reject: reject
            });
        }
    }

    console.log('Comparaciones de Tukey:', comparaciones);

    // Mostrar resultados de Tukey
    actualizarTukeyResultados(comparaciones);
}

// Función para actualizar los resultados de Tukey
function actualizarTukeyResultados(comparaciones) {
    const tukeyDiv = document.getElementById('tukeyResultados');

    if (comparaciones.length === 0) {
        tukeyDiv.innerHTML = '';
        return;
    }

    let tukeyHTML = `
        <div class="info">
            <h2>Resultados de la Prueba de Tukey</h2>
            <table class="tabla-resumen">
                <tr>
                    <th>Grupo 1</th>
                    <th>Grupo 2</th>
                    <th>Dif. Media</th>
                    <th>p-valor Ajustado</th>
                    <th>IC Inferior</th>
                    <th>IC Superior</th>
                    <th>Rechazar H0</th>
                </tr>
    `;

    comparaciones.forEach(c => {
        tukeyHTML += `
            <tr>
                <td>${c.group1}</td>
                <td>${c.group2}</td>
                <td>${c.meandiff}</td>
                <td>${c.p_adj}</td>
                <td>${c.lower}</td>
                <td>${c.upper}</td>
                <td>${c.reject ? 'Sí' : 'No'}</td>
            </tr>
        `;
    });

    tukeyHTML += `
            </table>
        </div>
    `;

    tukeyDiv.innerHTML = tukeyHTML;
}

// Iniciar la sección de ANOVA cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarANOVA);