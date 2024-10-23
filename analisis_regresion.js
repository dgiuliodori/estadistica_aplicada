// Variables para almacenar datos y modelo
let beta0, beta1, sigma, N, n;
let X_poblacion, Y_poblacion, X_muestra, Y_muestra;
let beta0_est, beta1_est, s, meanX, meanY, SXX, n_muestra;
let Y_est, residuos;
let t_crit, df_residual;

// Función para iniciar el análisis de regresión
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
                <label for="beta0Slider">Constante (β₀): <span id="beta0Value" class="slider-value">2.0</span></label>
                <input type="range" id="beta0Slider" min="-5" max="5" step="0.1" value="2.0">
            </div>
            <div class="slider-container">
                <label for="beta1Slider">Pendiente (β₁): <span id="beta1Value" class="slider-value">1.5</span></label>
                <input type="range" id="beta1Slider" min="-5" max="5" step="0.1" value="1.5">
            </div>
            <div class="slider-container">
                <label for="sigmaSlider">Desviación Estándar (σ): <span id="sigmaValue" class="slider-value">4.0</span></label>
                <input type="range" id="sigmaSlider" min="0.1" max="10" step="0.1" value="4.0">
            </div>
            <div class="slider-container">
                <label for="NSlider">Tamaño de la Población (N): <span id="NValue" class="slider-value">1000</span></label>
                <input type="range" id="NSlider" min="100" max="10000" step="100" value="1000">
            </div>
            <div class="slider-container">
                <label for="nSlider">Tamaño de la Muestra (n): <span id="nValue" class="slider-value">100</span></label>
                <input type="range" id="nSlider" min="10" max="1000" step="10" value="100">
            </div>
            <div class="input-container">
                <label for="xPredictInput">Valor de X para predecir:</label>
                <input type="number" id="xPredictInput" value="5.0" step="0.1" min="0" max="10">
            </div>
            <div class="card">
                <a href="supuestos_regresion.html" class="btn">Análisis de los Supuestos</a>
            </div>
            </br>
            <div class="card">
                <a href="variable_dummy.html" class="btn">Variables Dicotómicas</a>
            </div>
            <p id="errorMsg" class="error"></p>
        </div>
    `;

    // Contenedores para las gráficas y resultados
    contentDiv.innerHTML = `
        <div id="resumenModelo" class="resultado">
            <div id="modeloResumenContenido">
                <!-- Aquí se mostrará el resumen del modelo -->
            </div>
            <div id="prediccion" >
                <!-- Aquí se mostrará la predicción -->
            </div>
        </div>
        <div id="graficaRegresion" style="width: 100%; height: 500px;"></div>
        <div id="graficaResiduos" style="width: 100%; height: 400px;"></div>
        <div id="graficaDistribucionResiduos" style="width: 100%; height: 400px;"></div>
        <div id="graficaQQPlot" style="width: 100%; height: 400px;"></div>
    `;

    // Añadir eventos a los sliders y campos de entrada
    document.getElementById('beta0Slider').addEventListener('input', function() {
        document.getElementById('beta0Value').innerText = parseFloat(this.value).toFixed(1);
        generarDatosYModelo();
        actualizarPrediccion();
    });
    document.getElementById('beta1Slider').addEventListener('input', function() {
        document.getElementById('beta1Value').innerText = parseFloat(this.value).toFixed(1);
        generarDatosYModelo();
        actualizarPrediccion();
    });
    document.getElementById('sigmaSlider').addEventListener('input', function() {
        document.getElementById('sigmaValue').innerText = parseFloat(this.value).toFixed(1);
        generarDatosYModelo();
        actualizarPrediccion();
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
        generarDatosYModelo();
        actualizarPrediccion();
    });
    document.getElementById('nSlider').addEventListener('input', function() {
        document.getElementById('nValue').innerText = parseInt(this.value);
        generarDatosYModelo();
        actualizarPrediccion();
    });

    const xPredictInput = document.getElementById('xPredictInput');
    xPredictInput.addEventListener('input', actualizarPrediccion);
    xPredictInput.addEventListener('change', actualizarPrediccion);

    // Realizar el análisis inicial
    generarDatosYModelo();
    actualizarPrediccion();
}

// Función para generar datos y ajustar el modelo
function generarDatosYModelo() {
    beta0 = parseFloat(document.getElementById('beta0Slider').value);
    beta1 = parseFloat(document.getElementById('beta1Slider').value);
    sigma = parseFloat(document.getElementById('sigmaSlider').value);
    N = parseInt(document.getElementById('NSlider').value);
    n = parseInt(document.getElementById('nSlider').value);

    // Validación de entradas
    if (n > N) {
        document.getElementById('errorMsg').innerText = 'El tamaño de la muestra (n) no puede ser mayor que el tamaño de la población (N).';
        return;
    } else {
        document.getElementById('errorMsg').innerText = '';
    }

    // Generar datos poblacionales
    X_poblacion = [];
    for (let i = 0; i < N; i++) {
        X_poblacion.push(Math.random() * 10); // Valores de X entre 0 y 10
    }
    const epsilon_poblacion = [];
    for (let i = 0; i < N; i++) {
        epsilon_poblacion.push(jStat.normal.sample(0, sigma));
    }
    Y_poblacion = X_poblacion.map((x, i) => beta0 + beta1 * x + epsilon_poblacion[i]);

    // Seleccionar una muestra aleatoria de la población
    const indicesMuestra = [];
    while (indicesMuestra.length < n) {
        const index = Math.floor(Math.random() * N);
        if (!indicesMuestra.includes(index)) {
            indicesMuestra.push(index);
        }
    }

    X_muestra = indicesMuestra.map(index => X_poblacion[index]);
    Y_muestra = indicesMuestra.map(index => Y_poblacion[index]);

    // Ajustar el modelo de regresión lineal con la muestra
    n_muestra = X_muestra.length;
    const sumX = math.sum(X_muestra);
    const sumY = math.sum(Y_muestra);
    const sumXY = math.sum(X_muestra.map((x, i) => x * Y_muestra[i]));
    const sumX2 = math.sum(X_muestra.map(x => x * x));
    meanX = sumX / n_muestra;
    meanY = sumY / n_muestra;

    beta1_est = (n_muestra * sumXY - sumX * sumY) / (n_muestra * sumX2 - sumX * sumX);
    beta0_est = (sumY - beta1_est * sumX) / n_muestra;

    Y_est = X_muestra.map(x => beta0_est + beta1_est * x);
    residuos = Y_muestra.map((y, i) => y - Y_est[i]);

    // Cálculo de estadísticas adicionales
    const SST = math.sum(Y_muestra.map(y => (y - meanY) ** 2));
    const SSR = math.sum(Y_est.map(y_est => (y_est - meanY) ** 2));
    const SSE = math.sum(residuos.map(r => r ** 2));

    const df_total = n_muestra - 1;
    const df_model = 1; // Solo una variable independiente
    df_residual = n_muestra - 2; // n - número de parámetros estimados

    const MST = SST / df_total;
    const MSR = SSR / df_model;
    const MSE = SSE / df_residual;

    const F = MSR / MSE;
    const p_value_F = 1 - jStat.centralF.cdf(F, df_model, df_residual);

    const R2 = SSR / SST;
    const adj_R2 = 1 - ((1 - R2) * (n_muestra - 1)) / (n_muestra - 2);

    const s2 = MSE;
    s = Math.sqrt(s2);

    SXX = math.sum(X_muestra.map(x => (x - meanX) ** 2));
    const se_beta1 = Math.sqrt(MSE / SXX);
    const se_beta0 = Math.sqrt(MSE * (1 / n_muestra + (meanX ** 2) / SXX));

    const t_beta1 = beta1_est / se_beta1;
    const t_beta0 = beta0_est / se_beta0;

    const p_value_beta1 = 2 * (1 - jStat.studentt.cdf(Math.abs(t_beta1), df_residual));
    const p_value_beta0 = 2 * (1 - jStat.studentt.cdf(Math.abs(t_beta0), df_residual));

    const alpha = 0.05;
    t_crit = jStat.studentt.inv(1 - alpha / 2, df_residual);

    const ci_beta1 = [
        beta1_est - t_crit * se_beta1,
        beta1_est + t_crit * se_beta1
    ];

    const ci_beta0 = [
        beta0_est - t_crit * se_beta0,
        beta0_est + t_crit * se_beta0
    ];

    // Mostrar resumen del modelo (sin la predicción)
    const resumenContenidoDiv = document.getElementById('modeloResumenContenido');
    resumenContenidoDiv.innerHTML = `
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
                    <th>p-valor</th>
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
                <p><strong>R²</strong>  = ${R2.toFixed(4)}</p>
                <p><strong>R² ajustado</strong>  = ${adj_R2.toFixed(4)}</p>
                <p><strong>Error Estándar de la Estimación (Root MSE) </strong> = ${s.toFixed(4)}</p>
            </ul>
            <h3>Resultados del Modelo de Regresión</h3>
            <table class="tabla-resumen">
                <tr>
                    <th></th>
                    <th>Coeficiente</th>
                    <th>Error Estándar</th>
                    <th>t</th>
                    <th>p-valor</th>
                    <th>Intervalo de Confianza (95%)</th>
                </tr>
                <tr>
                    <td> Constante (b₀) </td>
                    <td>${beta0_est.toFixed(4)}</td>
                    <td>${se_beta0.toFixed(4)}</td>
                    <td>${t_beta0.toFixed(4)}</td>
                    <td>${p_value_beta0.toFixed(4)}</td>
                    <td>[${ci_beta0[0].toFixed(4)}, ${ci_beta0[1].toFixed(4)}]</td>
                </tr>
                <tr>
                    <td> Variable (X₁)</td>
                    <td>${beta1_est.toFixed(4)}</td>
                    <td>${se_beta1.toFixed(4)}</td>
                    <td>${t_beta1.toFixed(4)}</td>
                    <td>${p_value_beta1.toFixed(4)}</td>
                    <td>[${ci_beta1[0].toFixed(4)}, ${ci_beta1[1].toFixed(4)}]</td>
                </tr>
            </table>
        </div>
    `;

    // Generar las gráficas que dependen del modelo y los datos
    generarGraficasModelo();
}

// Función para actualizar la predicción y las gráficas relacionadas
function actualizarPrediccion() {
    const x_predict = parseFloat(document.getElementById('xPredictInput').value);

    // Validar que x_predict esté dentro del rango de X
    if (x_predict < 0 || x_predict > 10) {
        document.getElementById('errorMsg').innerText = 'El valor de X para predecir debe estar entre 0 y 10.';
        return;
    } else {
        document.getElementById('errorMsg').innerText = '';
    }

    // Calcular la predicción puntual y los intervalos para x_predict
    const y_predict = beta0_est + beta1_est * x_predict;
    const SE_mean_predict = s * Math.sqrt(1 / n_muestra + ((x_predict - meanX) ** 2) / SXX);
    const SE_pred_predict = s * Math.sqrt(1 + 1 / n_muestra + ((x_predict - meanX) ** 2) / SXX);
    const delta_mean_predict = t_crit * SE_mean_predict;
    const delta_pred_predict = t_crit * SE_pred_predict;

    const CI_mean_predict = [
        y_predict - delta_mean_predict,
        y_predict + delta_mean_predict
    ];

    const PI_predict = [
        y_predict - delta_pred_predict,
        y_predict + delta_pred_predict
    ];

    // Actualizar la sección de predicción en el resumen
    const prediccionDiv = document.getElementById('prediccion');
    prediccionDiv.innerHTML = `
        <div class="info">
            <h3>Predicción para X = ${x_predict.toFixed(2)}</h3>
            <table class="tabla-resumen">
                <tr>
                    <th></th>
                    <th>Predicción</th>
                    <th>Intervalo de Confianza (95%)</th>
                    <th>Intervalo de Predicción (95%)</th>
                </tr>
                <tr>
                    <td>Y estimado</td>
                    <td>${y_predict.toFixed(4)}</td>
                    <td>[${CI_mean_predict[0].toFixed(4)}, ${CI_mean_predict[1].toFixed(4)}]</td>
                    <td>[${PI_predict[0].toFixed(4)}, ${PI_predict[1].toFixed(4)}]</td>
                </tr>
            </table>
        </div>
    `;

    // Actualizar la gráfica de regresión para incluir el punto de predicción
    generarGraficaRegresion(x_predict, y_predict);
}

// Función para generar las gráficas que dependen del modelo y los datos
function generarGraficasModelo() {
    // Aquí generamos las gráficas que no dependen de x_predict

    // Gráfica de residuos vs valores ajustados
    const traceResiduos = {
        x: Y_est,
        y: residuos,
        mode: 'markers',
        type: 'scatter',
        name: 'Residuos',
        marker: {color: 'blue'}
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
        quantilesTeoricos.push(jStat.normal.inv(p, 0, s));
    }

    const traceQQPlot = {
        x: quantilesTeoricos,
        y: residuosOrdenados,
        mode: 'markers',
        type: 'scatter',
        name: 'QQ-Plot',
        marker: {color: 'blue'}
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

    // Generar la gráfica de regresión sin el punto de predicción
    generarGraficaRegresion();
}

// Función para generar la gráfica de regresión, opcionalmente incluye el punto de predicción
function generarGraficaRegresion(x_predict = null, y_predict = null) {
    // Definir el rango de X para las predicciones
    const x_min = Math.min(...X_muestra);
    const x_max = Math.max(...X_muestra);
    const x_range = x_max - x_min;
    const x_plot = [];
    const num_points = 100;
    for (let i = 0; i <= num_points; i++) {
        x_plot.push(x_min - 0.1 * x_range + (x_max + 0.2 * x_range - (x_min - 0.1 * x_range)) * i / num_points);
    }

    // Arrays para almacenar las predicciones y los intervalos
    const y_hat_plot = [];
    const CI_mean_upper = [];
    const CI_mean_lower = [];
    const PI_upper = [];
    const PI_lower = [];

    // Calcular los valores estimados y los intervalos para cada x en x_plot
    for (let i = 0; i < x_plot.length; i++) {
        const x = x_plot[i];
        const y_hat = beta0_est + beta1_est * x;
        const SE_mean = s * Math.sqrt(1 / n_muestra + ((x - meanX) ** 2) / SXX);
        const SE_pred = s * Math.sqrt(1 + 1 / n_muestra + ((x - meanX) ** 2) / SXX);
        const delta_mean = t_crit * SE_mean;
        const delta_pred = t_crit * SE_pred;
        y_hat_plot.push(y_hat);
        CI_mean_upper.push(y_hat + delta_mean);
        CI_mean_lower.push(y_hat - delta_mean);
        PI_upper.push(y_hat + delta_pred);
        PI_lower.push(y_hat - delta_pred);
    }

    // Gráfica de dispersión y líneas de regresión con intervalos
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
        x: [Math.min(...x_plot), Math.max(...x_plot)],
        y: [beta0 + beta1 * Math.min(...x_plot), beta0 + beta1 * Math.max(...x_plot)],
        mode: 'lines',
        type: 'scatter',
        name: 'Recta Poblacional',
        line: {color: 'gray', dash: 'dash'}
    };

    const lineaMuestral = {
        x: [Math.min(...x_plot), Math.max(...x_plot)],
        y: [beta0_est + beta1_est * Math.min(...x_plot), beta0_est + beta1_est * Math.max(...x_plot)],
        mode: 'lines',
        type: 'scatter',
        name: 'Recta Muestral',
        line: {color: 'red'}
    };

    // Trazos para los intervalos de predicción
    const tracePI_upper = {
        x: x_plot,
        y: PI_upper,
        mode: 'lines',
        line: {color: 'rgba(255,165,0,0.2)', width: 0},
        name: 'Límite superior IP',
        showlegend: false
    };

    const tracePI_lower = {
        x: x_plot,
        y: PI_lower,
        mode: 'lines',
        line: {color: 'rgba(255,165,0,0.2)', width: 0},
        fill: 'tonexty',
        fillcolor: 'rgba(255,165,0,0.2)',
        name: 'Intervalo de predicción',
        showlegend: true
    };

    // Trazos para los intervalos de confianza de la media
    const traceCI_mean_upper = {
        x: x_plot,
        y: CI_mean_upper,
        mode: 'lines',
        line: {color: 'rgba(0,100,80,0.2)', width: 0},
        name: 'Límite superior IC media',
        showlegend: false
    };

    const traceCI_mean_lower = {
        x: x_plot,
        y: CI_mean_lower,
        mode: 'lines',
        line: {color: 'rgba(0,100,80,0.2)', width: 0},
        fill: 'tonexty',
        fillcolor: 'rgba(0,100,80,0.2)',
        name: 'Intervalo de confianza de la media',
        showlegend: true
    };

    // Datos a graficar
    const dataRegresion = [
        tracePI_upper,
        tracePI_lower,
        traceCI_mean_upper,
        traceCI_mean_lower,
        tracePoblacion,
        traceMuestra,
        lineaPoblacional,
        lineaMuestral
    ];

    // Si se proporciona x_predict y y_predict, añadir el punto de predicción
    if (x_predict !== null && y_predict !== null) {
        const tracePredictionPoint = {
            x: [x_predict],
            y: [y_predict],
            mode: 'markers',
            type: 'scatter',
            name: 'Predicción en X',
            marker: {color: 'green', size: 14, symbol: 'diamond'}
        };
        dataRegresion.push(tracePredictionPoint);
    }

    const layoutRegresion = {
        title: 'Regresión Lineal Simple con Intervalos de Confianza y Predicción',
        xaxis: {title: 'X'},
        yaxis: {title: 'Y'},
        legend: {orientation: 'h', y: -0.2}
    };

    Plotly.newPlot('graficaRegresion', dataRegresion, layoutRegresion);
}

// Iniciar la sección de Análisis de Regresión
iniciarAnalisisRegresion();