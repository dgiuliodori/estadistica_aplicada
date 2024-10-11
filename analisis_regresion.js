// regresion.js


function iniciarAnalisisRegresion() {
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    // Limpiar contenido previo
    sidebarDiv.innerHTML = '';
    contentDiv.innerHTML = '';

    // Controles interactivos en la barra lateral
    sidebarDiv.innerHTML = `
        <h2>Parámetros</h2>
        <div class="parametros">
            <div class="slider-container">
                <label for="beta0Slider">Intercepto (β₀): <span id="beta0Value" class="slider-value">2.0</span></label>
                <input type="range" id="beta0Slider" min="-5" max="5" step="0.1" value="2.0">
            </div>
            <div class="slider-container">
                <label for="beta1Slider">Pendiente (β₁): <span id="beta1Value" class="slider-value">1.5</span></label>
                <input type="range" id="beta1Slider" min="-5" max="5" step="0.1" value="1.5">
            </div>
            <div class="slider-container">
                <label for="sigmaSlider">Desviación Estándar (σ): <span id="sigmaValue" class="slider-value">1.0</span></label>
                <input type="range" id="sigmaSlider" min="0.1" max="10" step="0.1" value="1.0">
            </div>
            <div class="slider-container">
                <label for="NSlider">Tamaño de la Población (N): <span id="NValue" class="slider-value">1000</span></label>
                <input type="range" id="NSlider" min="100" max="10000" step="100" value="1000">
            </div>
            <div class="slider-container">
                <label for="nSlider">Tamaño de la Muestra (n): <span id="nValue" class="slider-value">100</span></label>
                <input type="range" id="nSlider" min="10" max="1000" step="10" value="100">
            </div>
            <p id="errorMsg" class="error"></p>
        </div>
    `;

    // Contenedores para las gráficas y resultados
    contentDiv.innerHTML = `
        <div id="resumenModelo" class="resultado">
            <!-- Aquí se mostrará el resumen del modelo -->
        </div>
        <div id="graficaRegresion" style="width: 100%; height: 400px;"></div>
        <div id="graficaResiduos" style="width: 100%; height: 400px;"></div>
        <div id="graficaDistribucionResiduos" style="width: 100%; height: 400px;"></div>
        <div id="graficaQQPlot" style="width: 100%; height: 400px;"></div>
    `;

    // Añadir eventos a los sliders
    document.getElementById('beta0Slider').addEventListener('input', actualizarAnalisis);
    document.getElementById('beta1Slider').addEventListener('input', actualizarAnalisis);
    document.getElementById('sigmaSlider').addEventListener('input', actualizarAnalisis);
    document.getElementById('NSlider').addEventListener('input', actualizarAnalisis);
    document.getElementById('nSlider').addEventListener('input', actualizarAnalisis);

    // Actualizar los valores mostrados
    document.getElementById('beta0Slider').addEventListener('input', function() {
        document.getElementById('beta0Value').innerText = parseFloat(this.value).toFixed(1);
    });
    document.getElementById('beta1Slider').addEventListener('input', function() {
        document.getElementById('beta1Value').innerText = parseFloat(this.value).toFixed(1);
    });
    document.getElementById('sigmaSlider').addEventListener('input', function() {
        document.getElementById('sigmaValue').innerText = parseFloat(this.value).toFixed(1);
    });
    document.getElementById('NSlider').addEventListener('input', function() {
        document.getElementById('NValue').innerText = parseInt(this.value);
        // Ajustar el valor máximo de nSlider
        const N = parseInt(this.value);
        const nSlider = document.getElementById('nSlider');
        nSlider.max = N;
        if (parseInt(nSlider.value) > N) {
            nSlider.value = N;
            document.getElementById('nValue').innerText = N;
        }
    });
    document.getElementById('nSlider').addEventListener('input', function() {
        document.getElementById('nValue').innerText = parseInt(this.value);
    });

    // Realizar el análisis inicial
    actualizarAnalisis();
}

function actualizarAnalisis() {
    const beta0 = parseFloat(document.getElementById('beta0Slider').value);
    const beta1 = parseFloat(document.getElementById('beta1Slider').value);
    const sigma = parseFloat(document.getElementById('sigmaSlider').value);
    const N = parseInt(document.getElementById('NSlider').value);
    const n = parseInt(document.getElementById('nSlider').value);

    // Validación de entradas
    if (n > N) {
        document.getElementById('errorMsg').innerText = 'El tamaño de la muestra (n) no puede ser mayor que el tamaño de la población (N).';
        return;
    } else {
        document.getElementById('errorMsg').innerText = '';
    }

    // Generar datos poblacionales
    const X_poblacion = [];
    for (let i = 0; i < N; i++) {
        X_poblacion.push(Math.random() * 10); // Valores de X entre 0 y 10
    }
    const epsilon_poblacion = [];
    for (let i = 0; i < N; i++) {
        epsilon_poblacion.push(jStat.normal.sample(0, sigma));
    }
    const Y_poblacion = X_poblacion.map((x, i) => beta0 + beta1 * x + epsilon_poblacion[i]);

    // Seleccionar una muestra aleatoria de la población
    const indicesMuestra = [];
    while (indicesMuestra.length < n) {
        const index = Math.floor(Math.random() * N);
        if (!indicesMuestra.includes(index)) {
            indicesMuestra.push(index);
        }
    }

    const X_muestra = indicesMuestra.map(index => X_poblacion[index]);
    const Y_muestra = indicesMuestra.map(index => Y_poblacion[index]);

    // Ajustar el modelo de regresión lineal con la muestra
    const n_muestra = X_muestra.length;
    const sumX = math.sum(X_muestra);
    const sumY = math.sum(Y_muestra);
    const sumXY = math.sum(X_muestra.map((x, i) => x * Y_muestra[i]));
    const sumX2 = math.sum(X_muestra.map(x => x * x));
    const meanX = sumX / n_muestra;
    const meanY = sumY / n_muestra;

    const beta1_est = (n_muestra * sumXY - sumX * sumY) / (n_muestra * sumX2 - sumX * sumX);
    const beta0_est = (sumY - beta1_est * sumX) / n_muestra;

    const Y_est = X_muestra.map(x => beta0_est + beta1_est * x);
    const residuos = Y_muestra.map((y, i) => y - Y_est[i]);

    // Cálculo de estadísticas adicionales
    const SST = math.sum(Y_muestra.map(y => (y - meanY) ** 2));
    const SSR = math.sum(Y_est.map(y_est => (y_est - meanY) ** 2));
    const SSE = math.sum(residuos.map(r => r ** 2));

    const df_total = n_muestra - 1;
    const df_model = 1; // Solo una variable independiente
    const df_residual = n_muestra - 2; // n - número de parámetros estimados

    const MST = SST / df_total;
    const MSR = SSR / df_model;
    const MSE = SSE / df_residual;

    const F = MSR / MSE;
    const p_value_F = 1 - jStat.centralF.cdf(F, df_model, df_residual);

    const R2 = SSR / SST;
    const adj_R2 = 1 - ((1 - R2) * (n_muestra - 1)) / (n_muestra - 2);

    const s2 = MSE;
    const s = Math.sqrt(s2);

    const SXX = math.sum(X_muestra.map(x => (x - meanX) ** 2));
    const se_beta1 = Math.sqrt(MSE / SXX);
    const se_beta0 = Math.sqrt(MSE * (1 / n_muestra + (meanX ** 2) / SXX));

    const t_beta1 = beta1_est / se_beta1;
    const t_beta0 = beta0_est / se_beta0;

    const p_value_beta1 = 2 * (1 - jStat.studentt.cdf(Math.abs(t_beta1), df_residual));
    const p_value_beta0 = 2 * (1 - jStat.studentt.cdf(Math.abs(t_beta0), df_residual));

    const alpha = 0.05;
    const t_crit = jStat.studentt.inv(1 - alpha / 2, df_residual);

    const ci_beta1 = [
        beta1_est - t_crit * se_beta1,
        beta1_est + t_crit * se_beta1
    ];

    const ci_beta0 = [
        beta0_est - t_crit * se_beta0,
        beta0_est + t_crit * se_beta0
    ];

    // Mostrar resumen del modelo
    const resumenDiv = document.getElementById('resumenModelo');
    resumenDiv.innerHTML = `
        <div class="info">
            <h2>Resumen del Modelo</h2>
            <p><strong>Tamaño de la Población (N):</strong> ${N}</p>
            <p><strong>Tamaño de la Muestra (n):</strong> ${n_muestra}</p>
            <p><strong>Número de observaciones:</strong> ${n_muestra}</p>
            <table class="tabla-resumen">
                <tr>
                    <th>Fuente</th>
                    <th>SS</th>
                    <th>df</th>
                    <th>MS</th>
                    <th>F(${df_model}, ${df_residual})</th>
                    <th>p-value</th>
                </tr>
                <tr>
                    <td>Model</td>
                    <td>${SSR.toFixed(4)}</td>
                    <td>${df_model}</td>
                    <td>${MSR.toFixed(4)}</td>
                    <td>${F.toFixed(4)}</td>
                    <td>${p_value_F.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Residual</td>
                    <td>${SSE.toFixed(4)}</td>
                    <td>${df_residual}</td>
                    <td>${MSE.toFixed(4)}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>${SST.toFixed(4)}</td>
                    <td>${df_total}</td>
                    <td>${MST.toFixed(4)}</td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <p><strong>Estadísticas del Modelo:</strong></p>
            <ul>
                <li>R² = ${R2.toFixed(4)}</li>
                <li>R² ajustado = ${adj_R2.toFixed(4)}</li>
                <li>Error Estándar de la Estimación (Root MSE) = ${s.toFixed(4)}</li>
            </ul>
            <h3>Coeficientes</h3>
            <table class="tabla-resumen">
                <tr>
                    <th></th>
                    <th>Coeficiente</th>
                    <th>Error Estándar</th>
                    <th>t</th>
                    <th>p</th>
                    <th>Intervalo de Confianza (95%)</th>
                </tr>
                <tr>
                    <td>b₁ (Pendiente)</td>
                    <td>${beta1_est.toFixed(4)}</td>
                    <td>${se_beta1.toFixed(4)}</td>
                    <td>${t_beta1.toFixed(4)}</td>
                    <td>${p_value_beta1.toFixed(4)}</td>
                    <td>[${ci_beta1[0].toFixed(4)}, ${ci_beta1[1].toFixed(4)}]</td>
                </tr>
                <tr>
                    <td>b₀ (Intercepto)</td>
                    <td>${beta0_est.toFixed(4)}</td>
                    <td>${se_beta0.toFixed(4)}</td>
                    <td>${t_beta0.toFixed(4)}</td>
                    <td>${p_value_beta0.toFixed(4)}</td>
                    <td>[${ci_beta0[0].toFixed(4)}, ${ci_beta0[1].toFixed(4)}]</td>
                </tr>
            </table>
        </div>
    `;

    // Gráfica de dispersión y líneas de regresión
    const tracePoblacion = {
        x: X_poblacion,
        y: Y_poblacion,
        mode: 'markers',
        type: 'scatter',
        name: 'Población',
        marker: {color: 'lightgray', opacity: 0.5}
    };

    const traceMuestra = {
        x: X_muestra,
        y: Y_muestra,
        mode: 'markers',
        type: 'scatter',
        name: 'Muestra',
        marker: {color: 'blue'}
    };

    const lineaPoblacional = {
        x: [0, 10],
        y: [beta0, beta0 + beta1 * 10],
        mode: 'lines',
        type: 'scatter',
        name: 'Recta Poblacional',
        line: {color: 'green', dash: 'dash'}
    };

    const lineaMuestral = {
        x: [0, 10],
        y: [beta0_est, beta0_est + beta1_est * 10],
        mode: 'lines',
        type: 'scatter',
        name: 'Recta Muestral',
        line: {color: 'red'}
    };

    const layoutRegresion = {
        title: 'Regresión Lineal Simple',
        xaxis: {title: 'X'},
        yaxis: {title: 'Y'}
    };

    Plotly.newPlot('graficaRegresion', [tracePoblacion, traceMuestra, lineaPoblacional, lineaMuestral], layoutRegresion);

    // Gráfica de residuos vs valores ajustados
    const traceResiduos = {
        x: Y_est,
        y: residuos,
        mode: 'markers',
        type: 'scatter',
        name: 'Residuos'
    };

    const layoutResiduos = {
        title: 'Residuos vs Valores Ajustados',
        xaxis: {title: 'Valores Ajustados'},
        yaxis: {title: 'Residuos'},
        shapes: [
            {
                type: 'line',
                x0: Math.min(...Y_est),
                y0: 0,
                x1: Math.max(...Y_est),
                y1: 0,
                line: {color: 'red', dash: 'dash'}
            }
        ]
    };

    Plotly.newPlot('graficaResiduos', [traceResiduos], layoutResiduos);

    // Histograma de los residuos
    const traceHistResiduos = {
        x: residuos,
        type: 'histogram',
        name: 'Residuos',
        histnorm: 'probability density',
        opacity: 0.7,
        marker: {color: 'blue'}
    };

    const layoutHistResiduos = {
        title: 'Distribución de los Residuos',
        xaxis: {title: 'Residuos'},
        yaxis: {title: 'Densidad'}
    };

    Plotly.newPlot('graficaDistribucionResiduos', [traceHistResiduos], layoutHistResiduos);

    // QQ-Plot de los residuos
    const residuosOrdenados = [...residuos].sort((a, b) => a - b);
    const nRes = residuosOrdenados.length;
    const quantilesTeoricos = [];
    for (let i = 0; i < nRes; i++) {
        const p = (i + 0.5) / nRes;
        quantilesTeoricos.push(jStat.normal.inv(p, 0, sigma));
    }

    const traceQQPlot = {
        x: quantilesTeoricos,
        y: residuosOrdenados,
        mode: 'markers',
        type: 'scatter',
        name: 'QQ-Plot'
    };

    const layoutQQPlot = {
        title: 'QQ-Plot de los Residuos',
        xaxis: {title: 'Cuantiles Teóricos'},
        yaxis: {title: 'Cuantiles de los Residuos'},
        shapes: [
            {
                type: 'line',
                x0: Math.min(...quantilesTeoricos),
                y0: Math.min(...quantilesTeoricos),
                x1: Math.max(...quantilesTeoricos),
                y1: Math.max(...quantilesTeoricos),
                line: {color: 'red', dash: 'dash'}
            }
        ]
    };

    Plotly.newPlot('graficaQQPlot', [traceQQPlot], layoutQQPlot);
}

// Iniciar la sección de Análisis de Regresión
iniciarAnalisisRegresion();