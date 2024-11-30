// menuData.js
const menuData = [
    { nombre: "Inicio", enlace: "../index.html" },
    {
        nombre: "Disciplinas", 
        subMenu: [
            { nombre: "Estadística", enlace: "../Estadistica/index.html" },
            { nombre: "Matematica", enlace: "../Matematica/index.html" },
            { nombre: "Evaluaciones de Impacto", enlace: "../Eval_Impact/index.html" },
            { nombre: "Fisica", enlace: "../Fisica/index.html" }
        ]
    },
    {
        nombre: "Conceptos Generales",
        subMenu: [
            { nombre: "Propiedasdes de los Estimadores", enlace: "estimadores.html" },
            { nombre: "Teorema Central del Límite", enlace: "tcl.html" }
        ]
    },
    {
        
        nombre: "Inferencia Estadística",
        subMenu: [
            { nombre: "Intervalos de Confianza", enlace: "ic.html" },
            { nombre: "Prueba de Hipótesis",
                subMenu: [
                    { nombre: "Prueba de Hipótesis Media", enlace: "prueba_media.html" },
                    { nombre: "Prueba de Hipótesis Varianza", enlace: "prueba_varianza.html" },
                    { nombre: "Análisis de Varianza", enlace: "anova.html" },
                    { nombre: "Potencia de una Prueba", enlace: "potencia_prueba.html" }
                ]
            },
        ]
    },
    {
        nombre: "Muestreo",
        subMenu: [
            { nombre: "Estratificado", enlace: "muestreo.html" },
            { nombre: "Conglomerado", enlace: "Muestreo_conglomerado.html" }
        ]
    },
    {
        nombre: "Modelos",
        subMenu: [
            { nombre: "Modelo de Regresión Lineal",
                subMenu: [
                    { nombre: "Regresión Lineal", enlace: "analisis_regresion.html" },
                    { nombre: "Análisis de los Supuestos", enlace: "supuestos_regresion.html" },
                    { nombre: "Variables Dicotómicas", enlace: "variable_dummy.html" },
                    { nombre: "Mínimos Cuadrados Ordinarios", enlace: "ols.html" }
                ]
            // { nombre: "Modelo de Regresión Lineal", enlace: "analisis_regresion.html" },
            },
            { nombre: "Modelo de Regresión Logística", enlace: "logit.html" },
            {
                nombre: "Series Temporales",
                subMenu: [
                    { nombre: "Autorregresivos de Media Móvil", enlace: "arma.html" },
                    { nombre: "Estimación de ARMA", enlace: "arma_boxjenkins.html" },
                    { nombre: "Autorregresivo vs Random Walk", enlace: "distribucion_ar.html" },
                    { nombre: "Regresión Espúria", enlace: "regresion_espuria.html" }
                ]
            },
            {
                nombre: "Datos de Panel",
                subMenu: [
                    { nombre: "Estimadores de Efectos Fijos vs Efectos Aleatorios", enlace: "fe_re.html" }
                ]
            }
        ]
    },
    // {
    //     nombre: "Evaluación de Impacto",
    //     subMenu: [
    //         { nombre: "PropensitPropensity Score Matching", enlace: "psm.html" },
    //         { nombre: "Regresión Discontinua", enlace: "regresion_discontinua.html" }
    //     ]
    // },
    { nombre: "Acerca de", enlace: "../acerca_de.html" }
];