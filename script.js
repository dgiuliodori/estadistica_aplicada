// script.js

// JavaScript

let datosGlobales = []; // Variable para almacenar los datos generados

// Eventos para las pestañas del menú de navegación
document.getElementById('regresion-lineal').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    mostrarFormularioParametros();
});

document.getElementById('analisis-interactivo').addEventListener('click', function(event) {
    event.preventDefault();
    mostrarAnalisisInteractivo();
});

document.getElementById('potencia-prueba').addEventListener('click', function(event) {
    event.preventDefault();
    mostrarPotenciaPrueba();
});




// Funciones existentes para Regresión Lineal Simple y Análisis Interactivo...

// Nueva función para mostrar la sección de Potencia de una Prueba con parámetros en barra lateral
function mostrarPotenciaPrueba() {
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    // Limpiar contenido previo
    sidebarDiv.innerHTML = '';
    contentDiv.innerHTML = '';

    sidebarDiv.innerHTML = `
        <h2>Parámetros</h2>
        <div class="parametros">
            <div class="slider-container">
                <label for="mu0Slider">Media bajo H₀ (μ₀): <span id="mu0Value" class="slider-value">80</span></label>
                <input type="range" id="mu0Slider" min="50" max="110" step="0.1" value="80">
            </div>
            <div class="slider-container">
                <label for="sigmaSlider">Desviación Estándar Poblacional (σ): <span id="sigmaValue" class="slider-value">15</span></label>
                <input type="range" id="sigmaSlider" min="1" max="30" step="0.1" value="15">
            </div>
            <div class="slider-container">
                <label for="nSlider">Tamaño de Muestra (n): <span id="nValue" class="slider-value">64</span></label>
                <input type="range" id="nSlider" min="5" max="200" step="1" value="64">
            </div>
            <div class="slider-container">
                <label for="alfaSlider">Nivel de Significancia (α): <span id="alfaValue" class="slider-value">0.05</span></label>
                <input type="range" id="alfaSlider" min="0.001" max="0.2" step="0.001" value="0.05">
            </div>
            <label>
                Tipo de Prueba:
                <select id="tipoPrueba">
                    <option value="1">Prueba Izquierda</option>
                    <option value="2">Prueba Derecha</option>
                    <option value="3">Prueba Bilateral</option>
                </select>
            </label>
            <div class="slider-container">
                <label for="mu1Slider">Media bajo H₁ (μ₁): <span id="mu1Value" class="slider-value">75</span></label>
                <input type="range" id="mu1Slider" min="50" max="110" step="0.1" value="75">
            </div>
            <p id="errorMsg" class="error"></p>
        </div>
    `;

    contentDiv.innerHTML = `
        <div id="resultadosPotencia">
            <!-- Resultados y gráficos se mostrarán aquí -->
        </div>
    `;

    // Añadir eventos a los sliders y select
    document.getElementById('mu0Slider').addEventListener('input', calcularPotenciaPrueba);
    document.getElementById('sigmaSlider').addEventListener('input', calcularPotenciaPrueba);
    document.getElementById('nSlider').addEventListener('input', calcularPotenciaPrueba);
    document.getElementById('alfaSlider').addEventListener('input', calcularPotenciaPrueba);
    document.getElementById('tipoPrueba').addEventListener('change', calcularPotenciaPrueba);
    document.getElementById('mu1Slider').addEventListener('input', calcularPotenciaPrueba);

    // Actualizar los valores mostrados
    document.getElementById('mu0Slider').addEventListener('input', function() {
        document.getElementById('mu0Value').innerText = parseFloat(this.value).toFixed(1);
    });
    document.getElementById('sigmaSlider').addEventListener('input', function() {
        document.getElementById('sigmaValue').innerText = parseFloat(this.value).toFixed(1);
    });
    document.getElementById('nSlider').addEventListener('input', function() {
        document.getElementById('nValue').innerText = parseInt(this.value);
    });
    document.getElementById('alfaSlider').addEventListener('input', function() {
        document.getElementById('alfaValue').innerText = parseFloat(this.value).toFixed(3);
    });
    document.getElementById('mu1Slider').addEventListener('input', function() {
        document.getElementById('mu1Value').innerText = parseFloat(this.value).toFixed(1);
    });

    // Calcular potencia inicial
    calcularPotenciaPrueba();
}

function calcularPotenciaPrueba() {
    const mu0 = parseFloat(document.getElementById('mu0Slider').value);
    const sigma = parseFloat(document.getElementById('sigmaSlider').value);
    const n = parseInt(document.getElementById('nSlider').value);
    const alfa = parseFloat(document.getElementById('alfaSlider').value);
    const tipo = parseInt(document.getElementById('tipoPrueba').value);
    const mu1 = parseFloat(document.getElementById('mu1Slider').value);

    // Validación de entradas
    if (isNaN(mu0) || isNaN(sigma) || isNaN(n) || isNaN(alfa) || isNaN(mu1) || sigma <= 0 || n <= 0 || alfa <= 0 || alfa >= 1) {
        document.getElementById('errorMsg').innerText = 'Por favor, ingrese valores válidos.';
        return;
    } else {
        document.getElementById('errorMsg').innerText = '';
    }

    // Vector de medias bajo H1 para la curva de potencia
    const mu1_values = [];
    const potencia_values = [];
    const delta_mu = 30;
    const num_points = 200;

    for (let i = 0; i <= num_points; i++) {
        mu1_values.push(mu0 - delta_mu + (2 * delta_mu * i) / num_points);
    }

    let potencia_single;
    let potencia_curve = [];

    if (tipo === 1) { // Prueba izquierda
        const z_crit = jStat.normal.inv(alfa, 0, 1);
        const x_crit = mu0 + z_crit * sigma / Math.sqrt(n);

        potencia_single = jStat.normal.cdf((x_crit - mu1) / (sigma / Math.sqrt(n)), 0, 1);

        for (let i = 0; i < mu1_values.length; i++) {
            const potencia = jStat.normal.cdf((x_crit - mu1_values[i]) / (sigma / Math.sqrt(n)), 0, 1);
            potencia_curve.push(potencia);
        }
    } else if (tipo === 2) { // Prueba derecha
        const z_crit = jStat.normal.inv(1 - alfa, 0, 1);
        const x_crit = mu0 + z_crit * sigma / Math.sqrt(n);

        potencia_single = 1 - jStat.normal.cdf((x_crit - mu1) / (sigma / Math.sqrt(n)), 0, 1);

        for (let i = 0; i < mu1_values.length; i++) {
            const potencia = 1 - jStat.normal.cdf((x_crit - mu1_values[i]) / (sigma / Math.sqrt(n)), 0, 1);
            potencia_curve.push(potencia);
        }
    } else if (tipo === 3) { // Prueba bilateral
        const z_crit_left = jStat.normal.inv(alfa / 2, 0, 1);
        const z_crit_right = jStat.normal.inv(1 - alfa / 2, 0, 1);
        const x_crit_left = mu0 + z_crit_left * sigma / Math.sqrt(n);
        const x_crit_right = mu0 + z_crit_right * sigma / Math.sqrt(n);

        const z_pot_left = (x_crit_left - mu1) / (sigma / Math.sqrt(n));
        const z_pot_right = (x_crit_right - mu1) / (sigma / Math.sqrt(n));

        potencia_single = jStat.normal.cdf(z_pot_left, 0, 1) + (1 - jStat.normal.cdf(z_pot_right, 0, 1));

        for (let i = 0; i < mu1_values.length; i++) {
            const z_pot_left_curve = (x_crit_left - mu1_values[i]) / (sigma / Math.sqrt(n));
            const z_pot_right_curve = (x_crit_right - mu1_values[i]) / (sigma / Math.sqrt(n));
            const potencia = jStat.normal.cdf(z_pot_left_curve, 0, 1) + (1 - jStat.normal.cdf(z_pot_right_curve, 0, 1));
            potencia_curve.push(potencia);
        }
    }

    const beta_single = 1 - potencia_single;

    mostrarResultadosPotencia(mu0, sigma, n, alfa, tipo, mu1, potencia_single, beta_single, mu1_values, potencia_curve);
}

function mostrarResultadosPotencia(mu0, sigma, n, alfa, tipo, mu1, potencia_single, beta_single, mu1_values, potencia_curve) {
    let tipo_t = '';
    let ecuacion = '';
    if (tipo === 1) {
        tipo_t = 'Prueba Izquierda';
        ecuacion = `
        \\begin{eqnarray}
        \\phi(\\mu_{1})&=&1-\\beta(\\mu_{1})=P(X \\leq X_{crit} \\vert E(X)=\\mu_{1}) \\\\
        &=&P\\bigg(\\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg) \\\\
        &=&P\\bigg(Z \\leq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg)
        \\end{eqnarray}
        `;
    } else if (tipo === 2) {
        tipo_t = 'Prueba Derecha';
        ecuacion = `
        \\begin{eqnarray}
        \\phi(\\mu_{1})&=&1-\\beta(\\mu_{1})=P(X \\geq X_{crit} \\vert E(X)=\\mu_{1}) \\\\
        &=&P\\bigg(\\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\geq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg) \\\\
        &=&P\\bigg(Z \\geq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg)
        \\end{eqnarray}
        `;
    } else if (tipo === 3) {
        tipo_t = 'Prueba Bilateral';
        ecuacion = `
        \\begin{eqnarray}
        \\phi(\\mu_{1})&=&1-\\beta(\\mu_{1})=1-P(X_{crit1} \\leq X \\leq X_{crit2} \\vert E(X)=\\mu_{1}) \\\\
        &=&1-P\\bigg( \\frac{X_{crit1}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X_{crit2}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg) \\\\
        &=&1-P\\bigg( \\frac{X_{crit1}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq Z \\leq \\frac{X_{crit2}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\bigg)
        \\end{eqnarray}
        `;
    }

    const resultadosDiv = document.getElementById('resultadosPotencia');
    resultadosDiv.innerHTML = `
        <div class="resultado">
            <div class="info">
                <h2>${tipo_t}</h2>
                <p><strong>μ₀:</strong> ${mu0}</p>
                <p><strong>σ:</strong> ${sigma}</p>
                <p><strong>n:</strong> ${n}</p>
                <p><strong>α:</strong> ${alfa}</p>
                <p><strong>μ₁:</strong> ${mu1}</p>
                <p><strong>Potencia:</strong> ${potencia_single.toFixed(4)}</p>
                <p><strong>Error Tipo II (β):</strong> ${(beta_single).toFixed(4)}</p>
            </div>
            <div class="equation">
                $$${ecuacion}$$
            </div>
        </div>

        <div id="graficoPotencia" style="width: 100%; height: 400px;"></div>
        <div id="graficoDistribuciones" style="width: 100%; height: 400px;"></div>
    `;

    // Renderizar ecuaciones con MathJax
    MathJax.typeset();

    // Gráfica de la curva de potencia
    const tracePotencia = {
        x: mu1_values,
        y: potencia_curve,
        mode: 'lines',
        name: 'Curva de Potencia'
    };

    const layoutPotencia = {
        title: 'Curva de Potencia',
        xaxis: { title: 'Media bajo H₁ (μ₁)' },
        yaxis: { title: 'Potencia' },
        margin: { l: 50, r: 20, t: 50, b: 50 },
        shapes: [
            {
                type: 'line',
                x0: mu0,
                x1: mu0,
                y0: 0,
                y1: 1,
                line: {
                    color: 'red',
                    dash: 'dash'
                }
            }
        ]
    };

    Plotly.newPlot('graficoPotencia', [tracePotencia], layoutPotencia);

    // Gráfica de las distribuciones bajo H0 y H1
    const x_min = mu0 - 6 * sigma / Math.sqrt(n);
    const x_max = mu0 + 6 * sigma / Math.sqrt(n);
    const x_values = [];
    const pdf_H0 = [];
    const pdf_H1 = [];

    const num_points = 1000;
    for (let i = 0; i <= num_points; i++) {
        const x = x_min + (x_max - x_min) * i / num_points;
        x_values.push(x);
        pdf_H0.push(jStat.normal.pdf(x, mu0, sigma / Math.sqrt(n)));
        pdf_H1.push(jStat.normal.pdf(x, mu1, sigma / Math.sqrt(n)));
    }

    const traceH0 = {
        x: x_values,
        y: pdf_H0,
        mode: 'lines',
        name: 'Distribución bajo H₀',
        line: { color: 'blue' }
    };

    const traceH1 = {
        x: x_values,
        y: pdf_H1,
        mode: 'lines',
        name: 'Distribución bajo H₁',
        line: { color: 'green' }
    };

    const shapes = [];
    const legendItems = [];

    if (tipo === 1) {
        const z_crit = jStat.normal.inv(alfa, 0, 1);
        const x_crit = mu0 + z_crit * sigma / Math.sqrt(n);

        // Línea del valor crítico
        shapes.push({
            type: 'line',
            x0: x_crit,
            x1: x_crit,
            y0: 0,
            y1: Math.max(...pdf_H0.concat(pdf_H1)),
            line: {
                color: 'red',
                dash: 'dash'
            }
        });

        // Rellenar áreas
        // Error Tipo I
        const errorTipoI = {
            x: x_values.filter(x => x <= x_crit),
            y: pdf_H0.slice(0, x_values.findIndex(x => x > x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Error Tipo I'
        };

        // Potencia
        const potenciaArea = {
            x: x_values.filter(x => x <= x_crit),
            y: pdf_H1.slice(0, x_values.findIndex(x => x > x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'Potencia'
        };

        // Error Tipo II
        const errorTipoII = {
            x: x_values.filter(x => x >= x_crit),
            y: pdf_H1.slice(x_values.findIndex(x => x >= x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 165, 0, 0.3)',
            name: 'Error Tipo II'
        };

        legendItems.push(errorTipoI, potenciaArea, errorTipoII);
    } else if (tipo === 2) {
        const z_crit = jStat.normal.inv(1 - alfa, 0, 1);
        const x_crit = mu0 + z_crit * sigma / Math.sqrt(n);

        // Línea del valor crítico
        shapes.push({
            type: 'line',
            x0: x_crit,
            x1: x_crit,
            y0: 0,
            y1: Math.max(...pdf_H0.concat(pdf_H1)),
            line: {
                color: 'red',
                dash: 'dash'
            }
        });

        // Rellenar áreas
        // Error Tipo I
        const errorTipoI = {
            x: x_values.filter(x => x >= x_crit),
            y: pdf_H0.slice(x_values.findIndex(x => x >= x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Error Tipo I'
        };

        // Potencia
        const potenciaArea = {
            x: x_values.filter(x => x >= x_crit),
            y: pdf_H1.slice(x_values.findIndex(x => x >= x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'Potencia'
        };

        // Error Tipo II
        const errorTipoII = {
            x: x_values.filter(x => x <= x_crit),
            y: pdf_H1.slice(0, x_values.findIndex(x => x > x_crit)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 165, 0, 0.3)',
            name: 'Error Tipo II'
        };

        legendItems.push(errorTipoI, potenciaArea, errorTipoII);
    } else if (tipo === 3) {
        const z_crit_left = jStat.normal.inv(alfa / 2, 0, 1);
        const z_crit_right = jStat.normal.inv(1 - alfa / 2, 0, 1);
        const x_crit_left = mu0 + z_crit_left * sigma / Math.sqrt(n);
        const x_crit_right = mu0 + z_crit_right * sigma / Math.sqrt(n);

        // Líneas de valores críticos
        shapes.push({
            type: 'line',
            x0: x_crit_left,
            x1: x_crit_left,
            y0: 0,
            y1: Math.max(...pdf_H0.concat(pdf_H1)),
            line: {
                color: 'red',
                dash: 'dash'
            }
        });
        shapes.push({
            type: 'line',
            x0: x_crit_right,
            x1: x_crit_right,
            y0: 0,
            y1: Math.max(...pdf_H0.concat(pdf_H1)),
            line: {
                color: 'red',
                dash: 'dash'
            }
        });

        // Rellenar áreas
        // Error Tipo I
        const errorTipoI_left = {
            x: x_values.filter(x => x <= x_crit_left),
            y: pdf_H0.slice(0, x_values.findIndex(x => x > x_crit_left)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            name: 'Error Tipo I'
        };
        const errorTipoI_right = {
            x: x_values.filter(x => x >= x_crit_right),
            y: pdf_H0.slice(x_values.findIndex(x => x >= x_crit_right)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            showlegend: false
        };

        // Potencia
        const potencia_left = {
            x: x_values.filter(x => x <= x_crit_left),
            y: pdf_H1.slice(0, x_values.findIndex(x => x > x_crit_left)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            name: 'Potencia'
        };
        const potencia_right = {
            x: x_values.filter(x => x >= x_crit_right),
            y: pdf_H1.slice(x_values.findIndex(x => x >= x_crit_right)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(0, 255, 0, 0.3)',
            showlegend: false
        };

        // Error Tipo II
        const errorTipoII = {
            x: x_values.filter(x => x >= x_crit_left && x <= x_crit_right),
            y: pdf_H1.slice(x_values.findIndex(x => x >= x_crit_left), x_values.findIndex(x => x > x_crit_right)),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            fillcolor: 'rgba(255, 165, 0, 0.3)',
            name: 'Error Tipo II'
        };

        legendItems.push(errorTipoI_left, errorTipoI_right, potencia_left, potencia_right, errorTipoII);
    }

    const data = [traceH0, traceH1, ...legendItems];

    const layoutDistribuciones = {
        title: 'Distribuciones bajo H₀ y H₁',
        xaxis: { title: 'Valor de la media muestral' },
        yaxis: { title: 'Densidad de probabilidad' },
        margin: { l: 50, r: 20, t: 50, b: 50 },
        shapes: shapes
    };

    Plotly.newPlot('graficoDistribuciones', data, layoutDistribuciones);
}

// Función existente para mostrar el formulario de parámetros inicial
function mostrarFormularioParametros() {
    // Implementación previa o vacía si no está disponible
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    sidebarDiv.innerHTML = '<h2>Bienvenido</h2><p>Seleccione una opción del menú para comenzar.</p>';
    contentDiv.innerHTML = '<p>Contenido inicial.</p>';
}

// Función existente para mostrar el análisis interactivo
function mostrarAnalisisInteractivo() {
    // Implementación previa o vacía si no está disponible
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    sidebarDiv.innerHTML = '<h2>Análisis Interactivo</h2><p>Contenido de la barra lateral para el análisis interactivo.</p>';
    contentDiv.innerHTML = '<p>Contenido principal para el análisis interactivo.</p>';
}


// Iniciar la aplicación mostrando la primera pestaña por defecto
mostrarFormularioParametros();