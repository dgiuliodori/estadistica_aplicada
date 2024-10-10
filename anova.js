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
            <div class="input-container">
                <label for="mean1">Media Tratamiento 1:</label>
                <input type="number" id="mean1" value="5" step="0.1">
            </div>
            <div class="input-container">
                <label for="mean2">Media Tratamiento 2:</label>
                <input type="number" id="mean2" value="5" step="0.1">
            </div>
            <div class="input-container">
                <label for="mean3">Media Tratamiento 3:</label>
                <input type="number" id="mean3" value="5" step="0.1">
            </div>
            <div class="slider-container">
                <label for="nSlider">Tamaño de Muestra por Tratamiento (n): <span id="nValue" class="slider-value">10</span></label>
                <input type="range" id="nSlider" min="3" max="20" step="1" value="10">
            </div>
            <div class="slider-container">
                <label for="sigmaSlider">Desviación Estándar (σ): <span id="sigmaValue" class="slider-value">1.0</span></label>
                <input type="range" id="sigmaSlider" min="0.1" max="5" step="0.1" value="1.0">
            </div>
            <div class="slider-container">
                <label for="alphaSlider">Nivel de Significancia (α): <span id="alphaValue" class="slider-value">0.05</span></label>
                <input type="range" id="alphaSlider" min="0.001" max="0.2" step="0.001" value="0.05">
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
    `;

    // Establecer valores iniciales para los controles de medias
    document.getElementById('mean1').addEventListener('input', actualizarANOVA);
    document.getElementById('mean2').addEventListener('input', actualizarANOVA);
    document.getElementById('mean3').addEventListener('input', actualizarANOVA);

    // Añadir eventos a los sliders
    document.getElementById('nSlider').addEventListener('input', function() {
        document.getElementById('nValue').innerText = parseInt(this.value);
        actualizarANOVA();
    });
    document.getElementById('sigmaSlider').addEventListener('input', function() {
        document.getElementById('sigmaValue').innerText = parseFloat(this.value).toFixed(1);
        actualizarANOVA();
    });
    document.getElementById('alphaSlider').addEventListener('input', function() {
        document.getElementById('alphaValue').innerText = parseFloat(this.value).toFixed(3);
        actualizarANOVA();
    });

    // Realizar el análisis inicial
    actualizarANOVA();
}

// Función para actualizar el análisis ANOVA
function actualizarANOVA() {
    const alpha = parseFloat(document.getElementById('alphaSlider').value);
    const n = parseInt(document.getElementById('nSlider').value);
    const sigma = parseFloat(document.getElementById('sigmaSlider').value);

    // Obtener las medias de cada tratamiento
    const mean1 = parseFloat(document.getElementById('mean1').value);
    const mean2 = parseFloat(document.getElementById('mean2').value);
    const mean3 = parseFloat(document.getElementById('mean3').value);

    // Validaciones básicas
    if (sigma <= 0) {
        alert('La desviación estándar (σ) debe ser mayor que cero.');
        return;
    }
    if (n < 2) {
        alert('El tamaño de muestra por tratamiento (n) debe ser al menos 2.');
        return;
    }

    // Generar datos aleatorios para cada tratamiento
    const data = [];
    const totalData = [];

    const means = [mean1, mean2, mean3];

    for (let i = 0; i < 3; i++) {
        const tratamiento = [];
        for (let j = 0; j < n; j++) {
            const value = jStat.normal.sample(means[i], sigma);
            tratamiento.push(value);
            totalData.push({ tratamiento: 'Tratamiento ' + (i + 1), valor: value });
        }
        data.push(tratamiento);
    }

    const k = 3;
    const N = k * n;

    // Calcular la media general
    const grandMean = math.mean(totalData.map(d => d.valor));

    // Suma de cuadrados entre tratamientos (SCE)
    let SCE = 0;
    for (let i = 0; i < k; i++) {
        const meanTratamiento = math.mean(data[i]);
        SCE += n * Math.pow(meanTratamiento - grandMean, 2);
    }

    // Suma de cuadrados dentro de tratamientos (SCD)
    let SCD = 0;
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < n; j++) {
            const meanTratamiento = math.mean(data[i]);
            SCD += Math.pow(data[i][j] - meanTratamiento, 2);
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

    // Mostrar resultados
    mostrarResultadosANOVA(data, totalData, SCE, SCD, SCT, df_between, df_within, df_total, CM_between, CM_within, F_obs, p_value, alpha, conclusion, means, grandMean);
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

    // Realizar el test de Tukey si se rechaza la hipótesis nula
    if (conclusion === 'Se rechaza la hipótesis nula') {
        realizarTukey(data, alpha);
    } else {
        // Si no se rechaza, limpiamos el área de Tukey
        const tukeyDiv = document.getElementById('tukeyResultados');
        if (tukeyDiv) {
            tukeyDiv.innerHTML = '';
        }
    }

    // Crear gráficos, pasando 'alpha' como parámetro
    crearGraficosANOVA(data, totalData, alpha);
}

// Función para realizar la prueba de Tukey
function realizarTukey(data, alpha) {
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

            const se = Math.sqrt((math.var(valores1, true) / valores1.length) + (math.var(valores2, true) / valores2.length));

            // Calcular el valor crítico q
            const df_within = (data[0].length - 1) * 3; // df_within from ANOVA
            const q_crit = jStat.studentizedRange.inv(1 - alpha, 3, df_within);

            // Calcular el margen de error
            const marginError = (q_crit * se) / Math.sqrt(2);

            // Intervalos de confianza
            const ci_lower = diff - marginError;
            const ci_upper = diff + marginError;

            // p-valor aproximado usando la distribución studentized range
            const p_value = 1 - jStat.studentizedRange.cdf(Math.abs(diff) / se, 3, df_within);

            // Conclusión
            const conclusion = p_value < alpha ? 'Diferencia significativa' : 'No significativa';

            comparaciones.push({
                grupo1,
                grupo2,
                diff: diff.toFixed(4),
                ci_lower: ci_lower.toFixed(4),
                ci_upper: ci_upper.toFixed(4),
                p_value: p_value.toFixed(4),
                conclusion
            });
        }
    }

    // Mostrar resultados de Tukey
    const resultadosDiv = document.getElementById('resultadosANOVA');
    let tukeyHTML = `
        <div class="info" id="tukeyResultados">
            <h2>Resultados de la Prueba de Tukey</h2>
            <table class="tabla-resumen">
                <tr>
                    <th>Comparación</th>
                    <th>Diferencia de Medias</th>
                    <th>IC Inferior</th>
                    <th>IC Superior</th>
                    <th>p-valor</th>
                    <th>Conclusión</th>
                </tr>
    `;

    comparaciones.forEach(c => {
        tukeyHTML += `
            <tr>
                <td>${c.grupo1} vs ${c.grupo2}</td>
                <td>${c.diff}</td>
                <td>${c.ci_lower}</td>
                <td>${c.ci_upper}</td>
                <td>${c.p_value}</td>
                <td>${c.conclusion}</td>
            </tr>
        `;
    });

    tukeyHTML += `
            </table>
        </div>
    `;

    // Añadir o actualizar el div de Tukey
    let tukeyDiv = document.getElementById('tukeyResultados');
    if (!tukeyDiv) {
        tukeyDiv = document.createElement('div');
        tukeyDiv.id = 'tukeyResultados';
        tukeyDiv.innerHTML = tukeyHTML;
        resultadosDiv.appendChild(tukeyDiv);
    } else {
        tukeyDiv.innerHTML = tukeyHTML;
    }
}

// Función para crear los gráficos del ANOVA
function crearGraficosANOVA(data, totalData, alpha) {
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

    Plotly.newPlot('graficaBoxplot', dataBoxplot, layoutBoxplot);

    // Gráfico de medias con intervalos de confianza
    const medias = data.map(grupo => math.mean(grupo));
    const errores = data.map(grupo => {
        const se = math.std(grupo, true) / Math.sqrt(grupo.length);
        const t_crit = jStat.studentt.inv(1 - (alpha / 2), grupo.length - 1);
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

    Plotly.newPlot('graficaMedias', [traceMedias], layoutMedias);

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

    Plotly.newPlot('graficaQQPlotANOVA', [traceQQPlot], layoutQQPlot);
}

// Iniciar la sección de ANOVA cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarANOVA);