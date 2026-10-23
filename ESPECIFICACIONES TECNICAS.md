# Especificaciones Técnicas (Specs) - Proyecto Skill Path

## 1. Descripción

**Skill Path** es una landing page interactiva diseñada para guiar a los usuarios en la elección de su carrera o ruta de aprendizaje tecnológica. A través de un cuestionario dinámico de tres preguntas, la plataforma evalúa el perfil, intereses y nivel del usuario para sugerirle una ruta de estudio personalizada y adaptada a sus necesidades.

## 2. Público Objetivo (Target Audience)

El sistema está orientado a orientar a los siguientes perfiles:

* **Estudiantes e Iniciantes:** Personas que están comenzando su formación en tecnología y no tienen claro qué rol/área se adapta mejor a sus habilidades o intereses.
* **Semiprofesionales en Transición:** Personas con conocimientos básicos/intermedios que buscan especializarse o definir un camino claro de crecimiento dentro de la industria IT.
* **Profesionales en Proceso de Upskilling/Reskilling:** Perfiles de otras áreas que buscan reconvertirse laboralmente hacia el sector tecnológico pero desconocen por dónde empezar.

## 3. Objetivos

* **Objetivo General:**
  * Desarrollar una landing page funcional e interactiva que recomiende una ruta de aprendizaje tecnológica basada en un test breve de 3 preguntas.

* **Objetivos Específicos:**
  * Implementar una interfaz intuitiva con navegación clara (`Inicio`, `Test`, `Rutas`, `Recursos`).
  * Crear un flujo de cuestionario interactivo de 3 pasos con indicador visual de progreso (Paso 1 de 3, Paso 2 de 3, Paso 3 de 3).
  * Desarrollar una lógica de recomendación que evalúe las 3 respuestas y devuelva una ruta de aprendizaje sugerida (ej. Desarrollo Web, Análisis de Datos, Diseño UX/UI).
  * Garantizar una experiencia responsiva (mobile-first) y accesible sin necesidad de backend o bases de datos.

## 4. Estructura de Navegación y Vistas

La aplicación se estructurará en una sola página estática (`Single Page Application` en `index.html`) compuesta por los siguientes bloques o vistas:

* **Navbar / Encabezado:**
  * Logotipo identificatorio ("SkillPath").
  * Menú de navegación con enlaces (`Inicio`, `Test`, `Rutas`, `Recursos`).

* **Sección Hero (Bienvenida):**
  * Título principal: *"Descubrí tu ruta de aprendizaje"*.
  * Descripción corta orientada a estudiantes y profesionales en búsqueda de su rol ideal.
  * Llamado a la acción para iniciar el test.

* **Módulo del Cuestionario Interactivo:**
  * Componente visual con indicador de progreso por pasos (1, 2 y 3).
  * Tarjetas o contenedores con opciones seleccionables para cada pregunta.
  * Botón de avance (`Siguiente` / `Ver resultado`).

* **Pantalla / Tarjeta de Resultado:**
  * Visualización de la ruta sugerida, tecnologías recomendadas y un botón para reiniciar el cuestionario.

## 5. Requisitos del Sistema

### A. Requisitos Funcionales (RF)

* **RF-01 (Navegación):** El sistema debe permitir la navegación suave o cambio de vista entre las secciones principales (`Inicio`, `Test`, `Rutas`, `Recursos`).
* **RF-02 (Indicador de Progreso):** El sistema debe actualizar dinámicamente un indicador gráfico/numérico que refleje en cuál de las 3 preguntas se encuentra el usuario.
* **RF-03 (Selección Única):** Cada pregunta del test debe permitir la selección de una única opción por paso.
* **RF-04 (Validación de Paso):** El botón "Siguiente" o "Ver resultado" debe mantenerse deshabilitado hasta que el usuario haya marcado una opción en la pregunta activa.
* **RF-05 (Captura de Estado):** El sistema debe almacenar temporalmente las respuestas del usuario a lo largo de los 3 pasos en variables JavaScript.
* **RF-06 (Lógica de Recomendación):** Al finalizar la tercera pregunta, el sistema debe evaluar la combinación de respuestas y desplegar la ruta de aprendizaje que mejor se ajuste (ej. *Desarrollo Frontend Jr.*, *Análisis de Datos*, *UX/UI Design*).
* **RF-07 (Reinicio del Test):** El sistema debe ofrecer la opción de reiniciar el cuestionario, reseteando las selecciones anteriores y volviendo a la Pregunta 1.

### B. Requisitos No Funcionales (RNF)

* **RNF-01 (Despliegue y Hosting):** El código fuente debe ser 100% ejecutable y compatible con **GitHub Pages** de forma directa, sin requerir pasos intermedios de compilación (`build`).
* **RNF-02 (Rendimiento):** La carga inicial y la transición entre preguntas deben ser instantáneas (tiempo de respuesta < 100ms), ejecutándose totalmente del lado del cliente.
* **RNF-03 (Responsividad):** La interfaz debe adaptarse fluidamente a dispositivos móviles, tablets y monitores de escritorio (Mobile-First).
* **RNF-04 (Usabilidad y Accesibilidad):** Interfaz clara con contraste accesible en botones, tipografía legible y feedback visual evidente al seleccionar las opciones.
* **RNF-05 (Facilidad de Mantenimiento):** Código limpio, semántico y comentado en un solo archivo `index.html` (o separado únicamente en `style.css` y `script.js`).

## 6. Tecnologías y Estándares de Entrega

* **Arquitectura de Archivos Estática:**
  * Código estático directo para **GitHub Pages** (ejecución mediante apertura directa de `index.html`).

* **Lenguajes Base:**
  * **HTML5:** Estructura semántica completa (`<header>`, `<main>`, `<section>`, `<footer>`).
  * **CSS3:** Estilos nativos o mediante CDN de **Tailwind CSS**.
  * **JavaScript Vanilla (ES6+):** Lógica pura para la manipulación del DOM y manejo de eventos/estado.

* **Iconografía y Estilos:**
  * Iconos vectoriales vía CDN (Lucide Icons, FontAwesome) o SVGs embebidos directos.

## 7. Restricciones y Requisitos de Entrega

1. **Tiempo Límite de Implementación:** Desarrollo enfocado en MVP para completarse en un rango de 30 a 45 minutos.
2. **Formato Single Page:** Todo el flujo debe funcionar en una sola página web estática (`index.html`).
3. **Límite Estricto de Preguntas:** Exactamente 3 preguntas interactivas.
4. **Sin Dependencias de Compilación:** Prohibido usar herramientas que requieran Node.js, npm, bundlers o procesadores para su ejecución final en GitHub Pages.

## 8. Alcance del Sistema (Scope)

### Dentro del Alcance (IN SCOPE):

* ✅ Landing page completa en código estático **HTML5, CSS3 y JavaScript nativo**.
* ✅ Compatibilidad directa con **GitHub** y despliegue inmediato en **GitHub Pages**.
* ✅ Cuestionario interactivo de 3 pasos con cambio de estado dinámico en tiempo de ejecución.
* ✅ Lógica condicional en JS para calcular y mostrar la ruta recomendada según las opciones elegidas.
* ✅ Layout responsivo para pantallas móviles y de escritorio.

### Fuera del Alcance (OUT OF SCOPE) — NO IMPLEMENTAR:

* ❌ **Sin Frameworks ni Bundlers:** No usar React, Vue, Angular, Vite, Next.js ni nada que requiera proceso de build.
* ❌ **Sin Backend o Base de Datos:** No integrar Node.js, Python, Firebase, Supabase ni APIs REST externas.
* ❌ **Sin Autenticación:** No incluir registros de usuario, logins ni almacenamiento de credenciales.
* ❌ **Sin Persistencia Compleja:** No utilizar bases de datos ni integraciones persistentes de servidor.
* ❌ **Sin Tests Automatizados:** No configurar herramientas de testing como Jest, Cypress o Vitest.