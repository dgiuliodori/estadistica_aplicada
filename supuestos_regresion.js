// analisis_regresion_supuestos.js

// Función para iniciar la sección de Supuestos de la Regresión
function iniciarSupuestosRegresion() {
    // Obtener elementos de entrada para parámetros de regresión
    const interceptoSlider = document.getElementById('intercepto');
    const pendienteSlider = document.getElementById('pendiente');
    const desviacionErroresSlider = document.getElementById('desviacionErrores');
    const tamanoPoblacionSlider = document.getElementById('tamanoPoblacion');
    const tamanoMuestraSlider = document.getElementById('tamanoMuestra');
    
    // Obtener elementos para mostrar los valores actuales
    const interceptoValue = document.getElementById('interceptoValue');
    const pendienteValue = document.getElementById('pendienteValue');
    const desviacionErroresValue = document.getElementById('desviacionErroresValue');
    const tamanoPoblacionValue = document.getElementById('tamanoPoblacionValue');
    const tamanoMuestraValue = document.getElementById('tamanoMuestraValue');
    
    // Obtener elementos de entrada para violación de supuestos
    const violacionLinealidad = document.getElementById('violacionLinealidad');
    const violacionHomoscedasticidad = document.getElementById('violacionHomoscedasticidad');
    const violacionNormalidad = document.getElementById('violacionNormalidad');
    const violacionMulticolinealidad = document.getElementById('violacionMulticolinealidad');
    // const resetSupuestos = document.getElementById('resetSupuestos');
    
    // Añadir eventos para actualizar cuando cambien los parámetros de regresión
    interceptoSlider.addEventListener('input', function() {
        interceptoValue.innerText = parseFloat(this.value).toFixed(1);
        actualizarGraficosSupuestos();
    });
    
    pendienteSlider.addEventListener('input', function() {
        pendienteValue.innerText = parseFloat(this.value).toFixed(1);
        actualizarGraficosSupuestos();
    });
    
    desviacionErroresSlider.addEventListener('input', function() {
        desviacionErroresValue.innerText = parseFloat(this.value).toFixed(1);
        actualizarGraficosSupuestos();
    });
    
    tamanoPoblacionSlider.addEventListener('input', function() {
        tamanoPoblacionValue.innerText = parseInt(this.value);
        actualizarGraficosSupuestos();
    });
    
    tamanoMuestraSlider.addEventListener('input', function() {
        tamanoMuestraValue.innerText = parseInt(this.value);
        actualizarGraficosSupuestos();
    });
    
    // Añadir eventos para violación de supuestos
    violacionLinealidad.addEventListener('change', actualizarGraficosSupuestos);
    violacionHomoscedasticidad.addEventListener('change', actualizarGraficosSupuestos);
    violacionNormalidad.addEventListener('change', actualizarGraficosSupuestos);
    // violacionMulticolinealidad.addEventListener('change', actualizarGraficosSupuestos);
    // resetSupuestos.addEventListener('click', restablecerSupuestos);
    
    // Realizar el análisis inicial
    actualizarGraficosSupuestos();
}

// Función para restablecer los supuestos
function restablecerSupuestos() {
    document.getElementById('violacionLinealidad').checked = false;
    document.getElementById('violacionHomoscedasticidad').checked = false;
    document.getElementById('violacionNormalidad').checked = false;
    // document.getElementById('violacionMulticolinealidad').checked = false;
    actualizarGraficosSupuestos();
}

// Función para actualizar los gráficos según los supuestos seleccionados y parámetros de regresión
function actualizarGraficosSupuestos() {
    // Obtener valores de los parámetros de regresión
    const intercepto = parseFloat(document.getElementById('intercepto').value);
    const pendiente = parseFloat(document.getElementById('pendiente').value);
    const desviacionErrores = parseFloat(document.getElementById('desviacionErrores').value);
    const tamanoPoblacion = parseInt(document.getElementById('tamanoPoblacion').value);
    const tamanoMuestra = parseInt(document.getElementById('tamanoMuestra').value);
    
    // Obtener estado de las violaciones
    const isLinealidadViolada = document.getElementById('violacionLinealidad').checked;
    const isHomoscedasticidadViolada = document.getElementById('violacionHomoscedasticidad').checked;
    const isNormalidadViolada = document.getElementById('violacionNormalidad').checked;
    // const isMulticolinealidadViolada = document.getElementById('violacionMulticolinealidad').checked;
    
    // Generar datos de regresión
    const datosRegresion = generarDatosRegresion(intercepto, pendiente, desviacionErrores, tamanoPoblacion, tamanoMuestra, isLinealidadViolada, isHomoscedasticidadViolada, isNormalidadViolada);
    
    // Crear gráficos
    crearGraficoLinealidad(datosRegresion.xPoblacion, datosRegresion.yPoblacion, datosRegresion.xMuestra, datosRegresion.yMuestra, datosRegresion.yPred, datosRegresion.residuos, isLinealidadViolada);
    crearGraficoHomoscedasticidad(datosRegresion.yPred, datosRegresion.residuos, isHomoscedasticidadViolada);
    crearGraficoNormalidad(datosRegresion.residuos, isNormalidadViolada);
    // crearGraficoMulticolinealidad(datosRegresion.xPoblacion, datosRegresion.yPoblacion, datosRegresion.xMuestra, datosRegresion.yMuestra, isMulticolinealidadViolada);
    
    // Actualizar explicaciones
    // actualizarExplicaciones(isLinealidadViolada, isHomoscedasticidadViolada, isNormalidadViolada, isMulticolinealidadViolada);
    actualizarExplicaciones(isLinealidadViolada, isHomoscedasticidadViolada, isNormalidadViolada);
}

// Función para generar datos de regresión
function generarDatosRegresion(intercepto, pendiente, desviacionErrores, tamanoPoblacion, tamanoMuestra, violarLinealidad, violarHomoscedasticidad, violarNormalidad) {
    let xPoblacion = [];
    let yPoblacion = [];
    let xMuestra = [];
    let yMuestra = [];

    // Generar datos de la población
    for (let i = 0; i < tamanoPoblacion; i++) {
        let xi = jStat.uniform.sample(0, 10); // Variable independiente distribuida uniformemente
        let yi;
        if (!violarLinealidad) {
            yi = intercepto + pendiente * xi + jStat.normal.sample(0, desviacionErrores);
        } else {
            // Introducir no linealidad, por ejemplo, una relación cuadrática
            yi = intercepto + pendiente * xi + 0.5 * xi * xi + jStat.normal.sample(0, desviacionErrores);
        }
        if (violarHomoscedasticidad) {
            // Variación creciente con xi
            yi += xi * jStat.uniform.sample(-1, 1);
        }
        if (violarNormalidad) {
            // Introducir outliers o errores no normales
            if (Math.random() < 0.25) { // % de los puntos son outliers
                yi += jStat.uniform.sample(-10, 10);
            }
        }
        xPoblacion.push(xi);
        yPoblacion.push(yi);
    }

    // Seleccionar una muestra aleatoria de la población
    let indicesMuestra = [];
    while (indicesMuestra.length < tamanoMuestra) {
        let idx = Math.floor(jStat.uniform.sample(0, tamanoPoblacion));
        if (!indicesMuestra.includes(idx)) {
            indicesMuestra.push(idx);
        }
    }

    for (let idx of indicesMuestra) {
        xMuestra.push(xPoblacion[idx]);
        yMuestra.push(yPoblacion[idx]);
    }

    // Calcular regresión lineal sobre la muestra
    let result = linearRegression(xMuestra, yMuestra);
    let yPred = xMuestra.map(val => result.intercept + result.slope * val);

    // Calcular residuos
    let residuos = yMuestra.map((val, idx) => val - yPred[idx]);

    return { xPoblacion, yPoblacion, xMuestra, yMuestra, yPred, residuos };
}

// Función de regresión lineal simple
function linearRegression(x, y) {
    let n = x.length;
    let sum_x = jStat.sum(x);
    let sum_y = jStat.sum(y);
    let sum_xy = jStat.sum(x.map((xi, idx) => xi * y[idx]));
    let sum_xx = jStat.sum(x.map(xi => xi * xi));
    let slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    let intercept = (sum_y - slope * sum_x) / n;
    return { slope, intercept };
}

// Función para crear el gráfico de Linealidad
function crearGraficoLinealidad(xPoblacion, yPoblacion, xMuestra, yMuestra, yPred, residuos, violado) {
    // Crear trazados
    const data = [
        {
            x: xPoblacion,
            y: yPoblacion,
            mode: 'markers',
            name: 'Población',
            marker: { color: 'lightgray', size: 6 },
            opacity: 0.5
        },
        {
            x: xMuestra,
            y: yMuestra,
            mode: 'markers',
            name: 'Muestra',
            marker: { color: 'blue' }
        },
        {
            x: xMuestra,
            y: yPred,
            mode: 'lines',
            name: 'Regresión Lineal',
            line: { color: 'red' }
        },
        // {
        //     x: xMuestra,
        //     y: residuos,
        //     mode: 'markers',
        //     name: 'Residuos',
        //     marker: { color: 'green' },
        //     yaxis: 'y2'
        // }
    ];

    const layout = {
        title: 'Linealidad de la Relación',
        xaxis: { title: 'Variable Independiente (X)' },
        yaxis: { title: 'Variable Dependiente (Y)' },
        yaxis2: {
            title: 'Residuos',
            overlaying: 'y',
            side: 'right'
        },
        showlegend: true
    };

    Plotly.newPlot('graficoLinealidad', data, layout);
}

// Función para crear el gráfico de Homoscedasticidad
function crearGraficoHomoscedasticidad(yPred, residuos, violado) {
    // Crear trazados
    const data = [
        {
            x: yPred,
            y: residuos,
            mode: 'markers',
            name: 'Residuos vs Predicciones',
            marker: { color: 'purple' }
        }
    ];

    const layout = {
        title: 'Homoscedasticidad (Residuos vs Predicciones)',
        xaxis: { title: 'Valores Predichos (Ŷ)' },
        yaxis: { title: 'Residuos (e)' },
        showlegend: true
    };

    Plotly.newPlot('graficoHomoscedasticidad', data, layout);
}

// Función para crear el gráfico de Normalidad de los Errores con estandarización de residuos
function crearGraficoNormalidad(residuos, violado) {
    // Calcular la media y desviación estándar de los residuos
    const meanResiduales = jStat.mean(residuos);
    const stdResiduales = jStat.stdev(residuos, true); // true para muestra
    
    // Estandarizar los residuos
    const residuosEstandarizados = residuos.map(e => (e - meanResiduales) / stdResiduales);
    
    // Crear Q-Q plot
    let sortedResiduos = residuosEstandarizados.slice().sort((a, b) => a - b);
    let theoreticalQuantiles = sortedResiduos.map((val, idx) => jStat.normal.inv((idx + 0.5) / residuosEstandarizados.length, 0, 1));
    
    const data = [
        {
            x: theoreticalQuantiles,
            y: sortedResiduos,
            mode: 'markers',
            name: 'Residuos Estandarizados',
            marker: { color: 'orange' }
        },
        {
            x: [Math.min(...theoreticalQuantiles), Math.max(...theoreticalQuantiles)],
            y: [Math.min(...theoreticalQuantiles), Math.max(...theoreticalQuantiles)],
            mode: 'lines',
            name: 'Línea Perfecta',
            line: { color: 'black', dash: 'dash' }
        }
    ];
    
    const layout = {
        title: 'Normalidad de los Errores (Q-Q Plot)',
        xaxis: { title: 'Cuantiles Teóricos' },
        yaxis: { title: 'Cuantiles Observados' },
        showlegend: true
    };
    
    Plotly.newPlot('graficoNormalidad', data, layout);
}

// Función para crear el gráfico de Multicolinealidad
function crearGraficoMulticolinealidad(xPoblacion, yPoblacion, xMuestra, yMuestra, violado) {
    // Calcular correlación entre X1 y X2 en la población
    let correlacion = jStat.corrcoeff(xPoblacion, yPoblacion); // Suponiendo X1 vs X2

    // Crear trazados
    const data = [
        {
            x: xPoblacion,
            y: yPoblacion,
            mode: 'markers',
            name: 'Población',
            marker: { color: 'lightgray', size: 6 },
            opacity: 0.5
        },
        {
            x: xMuestra,
            y: yMuestra,
            mode: 'markers',
            name: 'Muestra',
            marker: { color: 'teal' }
        }
    ];

    const layout = {
        title: `Multicolinealidad (Correlación: ${correlacion.toFixed(2)})`,
        xaxis: { title: 'Variable Independiente X1' },
        yaxis: { title: 'Variable Independiente X2' },
        showlegend: true
    };

    Plotly.newPlot('graficoMulticolinealidad', data, layout);
}

// Función para actualizar las explicaciones
// function actualizarExplicaciones(linealidad, homoscedasticidad, normalidad, multicolinealidad) {
function actualizarExplicaciones(linealidad, homoscedasticidad, normalidad) {
    let explicacion = '<p><strong>Supuestos de la Regresión:</strong></p><ul>';

    if (linealidad) {
        explicacion += '<li><strong>Linealidad Violada:</strong> La relación entre las variables no es lineal, lo que puede llevar a estimaciones sesgadas.</li>';
    } else {
        explicacion += '<li><strong>Linealidad:</strong> La relación entre las variables es lineal.</li>';
    }

    if (homoscedasticidad) {
        explicacion += '<li><strong>Homoscedasticidad Violada:</strong> La varianza de los errores no es constante, lo que puede afectar la eficiencia de los estimadores.</li>';
    } else {
        explicacion += '<li><strong>Homoscedasticidad:</strong> La varianza de los errores es constante.</li>';
    }

    if (normalidad) {
        explicacion += '<li><strong>Normalidad de los Errores Violada:</strong> Los errores no siguen una distribución normal, lo que puede afectar las inferencias estadísticas.</li>';
    } else {
        explicacion += '<li><strong>Normalidad de los Errores:</strong> Los errores siguen una distribución normal.</li>';
    }

    // if (multicolinealidad) {
    //     explicacion += '<li><strong>Multicolinealidad Violada:</strong> Las variables independientes están altamente correlacionadas, lo que puede inflar las varianzas de los coeficientes estimados.</li>';
    // } else {
    //     explicacion += '<li><strong>No Multicolinealidad:</strong> Las variables independientes no están altamente correlacionadas.</li>';
    // }

    explicacion += '</ul>';

    document.getElementById('explicacionSupuestos').innerHTML = explicacion;
}

// Función de regresión lineal simple (ya incluida anteriormente)

// Iniciar la sección cuando la página carga
document.addEventListener('DOMContentLoaded', iniciarSupuestosRegresion);