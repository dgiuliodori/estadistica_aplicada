// potencia_prueba.js

// JavaScript

let datosGlobales = []; // Variable para almacenar los datos generados

// Función para mostrar la sección de Potencia de una Prueba con parámetros en barra lateral
function mostrarPotenciaPrueba() {
    const sidebarDiv = document.getElementById('sidebar');
    const contentDiv = document.getElementById('content');

    // Limpiar contenido previo
    sidebarDiv.innerHTML = '';
    contentDiv.innerHTML = '';

    sidebarDiv.innerHTML = `
        <h2>Parámetros</h2>
        <div class="parametros">
            <label>
                Tipo de Prueba:
                <select id="tipoPrueba">
                    <option value="1">Prueba Izquierda</option>
                    <option value="2">Prueba Derecha</option>
                    <option value="3">Prueba Bilateral</option>
                </select>
            </label>
<br>

            <div class="parametro-container">
                <label for="mu0Input">Media bajo H₀ (μ₀):</label>
                <input type="number" id="mu0Input" value="80" step="0.1" min="50">
                <input type="range" id="mu0Slider" min="50" max="110" step="0.1" value="80">
                <span id="mu0Value">80</span>
            </div>
<br>


            <div class="parametro-container">
                <label for="sigmaInput">Desv. Estándar Poblacional (σ):</label>
                <input type="number" id="sigmaInput" value="15" step="0.1" min="1">
                
                <input type="range" id="sigmaSlider" min="1" max="30" step="0.1" value="15">
                <span id="sigmaValue">15</span>
            </div>
            <br>


            <div class="parametro-container">
                <label for="nInput">Tamaño de Muestra (n):</label>
                <input type="number" id="nInput" value="30" step="1" min="1">
                
                <input type="range" id="nSlider" min="2" max="1000" step="1" value="30">
                <span id="nValue">30</span>
            </div>
            <br>

            <div class="parametro-container">
                <label for="alfaInput">Nivel de Significancia (α):</label>
                <input type="number" id="alfaInput" value="0.05" step="0.001" min="0.2">
                <input type="range" id="alfaSlider" min="0.001" max="0.2" step="0.001" value="0.05">
                <span id="alfaValue">0.05</span>
            </div>
            <br>


            <div class="parametro-container">
                <label for="mu1Input">Media bajo H₁ (μ₁):</label>
                <input type="number" id="mu1Input" value="75" step="0.1" min="50">
                <input type="range" id="mu1Slider" min="50" max="110" step="0.1" value="75">
                <span id="mu1Value">75</span>
            </div>
            <br>

            <p id="errorMsg" class="error"></p>
        </div>
    `;

    contentDiv.innerHTML = `
        <div id="resultadosPotencia">
            <!-- Resultados y gráficos se mostrarán aquí -->
        </div>
    `;

    // Obtener referencias a los elementos
    const mu0Slider = document.getElementById('mu0Slider');
    const mu0Input = document.getElementById('mu0Input'); // Nuevo
    const sigmaSlider = document.getElementById('sigmaSlider');
    const sigmaInput = document.getElementById('sigmaInput'); // Nuevo
    const nSlider = document.getElementById('nSlider');
    const nInput = document.getElementById('nInput'); // Nuevo
    const alfaSlider = document.getElementById('alfaSlider');
    const tipoPruebaSelect = document.getElementById('tipoPrueba');
    const mu1Slider = document.getElementById('mu1Slider');
    const mu1Input = document.getElementById('mu1Input'); // Nuevo

    // Elementos para mostrar los valores actuales
    const mu0Value = document.getElementById('mu0Value');
    const sigmaValue = document.getElementById('sigmaValue');
    const nValue = document.getElementById('nValue');
    const alfaValue = document.getElementById('alfaValue');
    const mu1Value = document.getElementById('mu1Value');

    // Añadir eventos a los sliders y select
    // mu0Slider.addEventListener('input', function() {
    //     mu0Value.innerText = parseFloat(this.value).toFixed(1);
    //     calcularPotenciaPrueba();
    // });

    // sigmaSlider.addEventListener('input', function() {
    //     sigmaValue.innerText = parseFloat(this.value).toFixed(1);
    //     calcularPotenciaPrueba();
    // });

    // alfaSlider.addEventListener('input', function() {
    //     alfaValue.innerText = parseFloat(this.value).toFixed(3);
    //     calcularPotenciaPrueba();
    // });

    // mu1Slider.addEventListener('input', function() {
    //     mu1Value.innerText = parseFloat(this.value).toFixed(1);
    //     calcularPotenciaPrueba();
    // });

    tipoPruebaSelect.addEventListener('change', calcularPotenciaPrueba);



    // Sincronizar el input numérico y el slider

    //-------------------------------------------------------------------------------------------------//
    // TAMAÑO DE LA MUESTRA - n
    //-------------------------------------------------------------------------------------------------//

    nInput.addEventListener('change', function() {
        let value = parseFloat(this.value);

        if (!isNaN(value)) {
            if (value < 2) {
                value = 2;
                this.value = value;
                // Opcionalmente, puedes mostrar un mensaje de advertencia al usuario
                // document.getElementById('errorMsg').innerText = 'El valor mínimo permitido para μ₀ es 50.';
            } else {
                // Si no hay error, aseguramos que el mensaje de error esté vacío
                document.getElementById('errorMsg').innerText = '';
            }

            // Actualizamos los límites del slider si es necesario
            if (value < parseFloat(nSlider.min)) {
                nSlider.min = value;
            }
            if (value > parseFloat(nSlider.max)) {
                nSlider.max = value;
            }

            nSlider.value = value;
            nValue.innerText = value;
            calcularPotenciaPrueba();
        }
    });

    nSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 2) {
            value = 2;
            this.value = value;
        }
        nInput.value = value;
        nValue.innerText = value;
        calcularPotenciaPrueba();
    });

    // Calcular potencia inicial
    calcularPotenciaPrueba();

    //-------------------------------------------------------------------------------------------------//
    // MEDIA POBLACIONAL BAJO H0
    //-------------------------------------------------------------------------------------------------//

    mu0Input.addEventListener('change', function() {
        let value = parseFloat(this.value);

        if (!isNaN(value)) {
            if (value < 50) {
                value = 50;
                this.value = value;
                // Opcionalmente, puedes mostrar un mensaje de advertencia al usuario
                // document.getElementById('errorMsg').innerText = 'El valor mínimo permitido para μ₀ es 50.';
            } else {
                // Si no hay error, aseguramos que el mensaje de error esté vacío
                document.getElementById('errorMsg').innerText = '';
            }

            // Actualizamos los límites del slider si es necesario
            if (value < parseFloat(mu0Slider.min)) {
                mu0Slider.min = value;
            }
            if (value > parseFloat(mu0Slider.max)) {
                mu0Slider.max = value;
            }

            mu0Slider.value = value;
            mu0Value.innerText = value;
            calcularPotenciaPrueba();
        }
    });

    mu0Slider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 50) {
            value = 50;
            this.value = value;
        }
        mu0Input.value = value;
        mu0Value.innerText = value;
        calcularPotenciaPrueba();
    });


    //-------------------------------------------------------------------------------------------------//
    // DESVIACIÓN ESTÁNDAR - sigma
    //-------------------------------------------------------------------------------------------------//

    sigmaInput.addEventListener('change', function() {
        let value = parseFloat(this.value);

        if (!isNaN(value)) {
            if (value < 1) {
                value = 1;
                this.value = value;
                // Opcionalmente, puedes mostrar un mensaje de advertencia al usuario
                // document.getElementById('errorMsg').innerText = 'El valor mínimo permitido para μ₀ es 50.';
            } else {
                // Si no hay error, aseguramos que el mensaje de error esté vacío
                document.getElementById('errorMsg').innerText = '';
            }

            // Actualizamos los límites del slider si es necesario
            if (value < parseFloat(sigmaSlider.min)) {
                sigmaSlider.min = value;
            }
            if (value > parseFloat(sigmaSlider.max)) {
                sigmaSlider.max = value;
            }

            sigmaSlider.value = value;
            sigmaValue.innerText = value;
            calcularPotenciaPrueba();
        }
    });

    sigmaSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 1) {
            value = 1;
            this.value = value;
        }
        sigmaInput.value = value;
        sigmaValue.innerText = value;
        calcularPotenciaPrueba();
    });


    //-------------------------------------------------------------------------------------------------//
    // SIGNIFICANCIA - alfa
    //-------------------------------------------------------------------------------------------------//

    alfaInput.addEventListener('change', function() {
        let value = parseFloat(this.value);

        if (!isNaN(value)) {
            if (value < 0.001) {
                value = 0.001;
                this.value = value;
                // Opcionalmente, puedes mostrar un mensaje de advertencia al usuario
                // document.getElementById('errorMsg').innerText = 'El valor mínimo permitido para μ₀ es 50.';
            } else {
                // Si no hay error, aseguramos que el mensaje de error esté vacío
                document.getElementById('errorMsg').innerText = '';
            }

            // Actualizamos los límites del slider si es necesario
            if (value < parseFloat(alfaSlider.min)) {
                alfaSlider.min = value;
            }
            if (value > parseFloat(alfaSlider.max)) {
                alfaSlider.max = value;
            }

            alfaSlider.value = value;
            alfaValue.innerText = value;
            calcularPotenciaPrueba();
        }
    });

    alfaSlider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 0.001) {
            value = 0.001;
            this.value = value;
        }
        alfaInput.value = value;
        alfaValue.innerText = value;
        calcularPotenciaPrueba();
    });


    //-------------------------------------------------------------------------------------------------//
    // MEDIA POBLACIONAL BAJO H1
    //-------------------------------------------------------------------------------------------------//

    mu1Input.addEventListener('change', function() {
        let value = parseFloat(this.value);

        if (!isNaN(value)) {
            if (value < 50) {
                value = 50;
                this.value = value;
                // Opcionalmente, puedes mostrar un mensaje de advertencia al usuario
                // document.getElementById('errorMsg').innerText = 'El valor mínimo permitido para μ₀ es 50.';
            } else {
                // Si no hay error, aseguramos que el mensaje de error esté vacío
                document.getElementById('errorMsg').innerText = '';
            }

            // Actualizamos los límites del slider si es necesario
            if (value < parseFloat(mu1Slider.min)) {
                mu1Slider.min = value;
            }
            if (value > parseFloat(mu1Slider.max)) {
                mu1Slider.max = value;
            }

            mu1Slider.value = value;
            mu1Value.innerText = value;
            calcularPotenciaPrueba();
        }
    });

    mu1Slider.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 50) {
            value = 50;
            this.value = value;
        }
        mu1Input.value = value;
        mu1Value.innerText = value;
        calcularPotenciaPrueba();
    });


    // Calcular potencia inicial
    calcularPotenciaPrueba();
}

function calcularPotenciaPrueba() {
    const mu0 = parseFloat(document.getElementById('mu0Input').value);
    const sigma = parseFloat(document.getElementById('sigmaInput').value);
    const n = parseInt(document.getElementById('nInput').value); // Tomamos el valor del input numérico
    const alfa = parseFloat(document.getElementById('alfaInput').value);
    const tipo = parseInt(document.getElementById('tipoPrueba').value);
    const mu1 = parseFloat(document.getElementById('mu1Input').value);

    // Validación de entradas
    if (isNaN(mu0) || mu0 < 50 || isNaN(sigma) || isNaN(n) || isNaN(alfa) || isNaN(mu1) ||
        sigma <= 0 || n <= 1 || alfa <= 0 || alfa >= 1 || sigma < 1) {
        document.getElementById('errorMsg').innerText = 'Por favor, ingrese valores válidos. μ₀ debe ser al menos 50.';
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
        &=&P\\bigg(\\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg) \\\\
        &=&P\\bigg(Z \\leq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg)
        \\end{eqnarray}
        `;
    } else if (tipo === 2) {
        tipo_t = 'Prueba Derecha';
        ecuacion = `
        \\begin{eqnarray}
        \\phi(\\mu_{1})&=&1-\\beta(\\mu_{1})=P(X \\geq X_{crit} \\vert E(X)=\\mu_{1}) \\\\
        &=&P\\bigg(\\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\geq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg) \\\\
        &=&P\\bigg(Z \\geq \\frac{X_{crit}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg)
        \\end{eqnarray}
        `;
    } else if (tipo === 3) {
        tipo_t = 'Prueba Bilateral';
        ecuacion = `
        \\begin{eqnarray}
        \\phi(\\mu_{1})&=&1-\\beta(\\mu_{1})=1-P(X_{crit1} \\leq X \\leq X_{crit2} \\vert E(X)=\\mu_{1}) \\\\
        &=&1-P\\bigg( \\frac{X_{crit1}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq \\frac{X_{crit2}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg) \\\\
        &=&1-P\\bigg( \\frac{X_{crit1}-\\mu_{1}}{\\sigma/\\sqrt{n}} \\leq Z \\leq \\frac{X_{crit2}-\\mu_{1}}{\\sigma/\\sqrt{n}}  \\vert E(X)=\\mu_{1}\\bigg)
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

        <div id="graficoDistribuciones" style="width: 100%; height: 400px;"></div>
        <div id="graficoPotencia" style="width: 100%; height: 400px;"></div>
        
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
        shapes: shapes,
        annotations: [
            {
                x: mu1,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `μ₁ = ${mu1}`,
                showarrow: true,
                arrowhead: 1,
                ax: -40,
                ay: 10,
                font: {
                    size: 12,
                    color: 'green'
                },
                arrowcolor: 'green'
            },
            {
                x: mu0,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: `μ₀ = ${mu0}`,
                showarrow: true,
                arrowhead: 1,
                ax: 40,
                ay: 10,
                font: {
                    size: 12,
                    color: 'blue'
                },
                arrowcolor: 'blue'
            }
        ]
    };

    Plotly.newPlot('graficoDistribuciones', data, layoutDistribuciones);
}

// Iniciar la aplicación mostrando la sección de Potencia de una Prueba
mostrarPotenciaPrueba();