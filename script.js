/* =========================================================
   SkillPath · script.js
   Lo usan index.html (rutas, recursos, navegación) y test.html (cuestionario).
   Cada bloque se activa solo si encuentra su contenedor en la página.
   ========================================================= */

/* =========================================================
   DATOS: rutas, preguntas y recursos
   Para mantener el proyecto: editá solo esta sección.
   ========================================================= */

// Rutas de aprendizaje. "steps" cambia según el nivel de partida del usuario (pregunta 3).
const ROUTES = {
  front: {
    name: "Desarrollo Frontend",
    tagline: "Interfaces que la gente ve y usa en el navegador",
    color: "var(--front)",
    desc: "Construís lo que las personas ven y tocan: páginas, formularios y aplicaciones web. Combina lógica de programación con criterio visual.",
    techs: ["HTML", "CSS", "JavaScript", "Git", "React", "Accesibilidad"],
    steps: {
      inicial: [
        "Aprendé HTML y CSS armando tu propia página personal.",
        "Sumá JavaScript: variables, funciones y manipulación del DOM.",
        "Subí tus proyectos a GitHub y publicá uno en GitHub Pages."
      ],
      intermedio: [
        "Reforzá JavaScript moderno: módulos, async/await y fetch.",
        "Armá dos proyectos que consuman una API real.",
        "Aprendé React y publicá un portfolio con cada proyecto explicado."
      ],
      avanzado: [
        "Profundizá en accesibilidad, rendimiento y pruebas de interfaces.",
        "Dominá un framework y su ecosistema (React, Vue o similar).",
        "Contribuí a un proyecto open source o creá un sistema de diseño propio."
      ]
    }
  },
  back: {
    name: "Desarrollo Backend",
    tagline: "La lógica y los datos que sostienen cada aplicación",
    color: "var(--back)",
    desc: "Diseñás lo que pasa detrás de la pantalla: reglas de negocio, bases de datos y APIs que otras aplicaciones consumen.",
    techs: ["Python o Node.js", "SQL", "APIs REST", "Git", "Docker"],
    steps: {
      inicial: [
        "Elegí un lenguaje (Python o JavaScript) y dominá lo básico.",
        "Aprendé SQL con una base de datos pequeña.",
        "Armá una API simple de alta, baja y modificación de datos, y subila a GitHub."
      ],
      intermedio: [
        "Diseñá una API REST con autenticación y validaciones.",
        "Modelá una base de datos relacional con varias tablas y consultas.",
        "Escribí pruebas y documentación para tu API."
      ],
      avanzado: [
        "Estudiá arquitectura: capas, colas, caché y escalabilidad.",
        "Contenerizá tu servicio con Docker.",
        "Sumá registros, métricas y manejo de errores a un servicio real."
      ]
    }
  },
  data: {
    name: "Análisis de Datos",
    tagline: "Convertir números en decisiones",
    color: "var(--data)",
    desc: "Limpiás, analizás y presentás información para responder preguntas del negocio con evidencia.",
    techs: ["Excel / Sheets", "SQL", "Python (pandas)", "Power BI o Tableau", "Estadística"],
    steps: {
      inicial: [
        "Practicá hojas de cálculo: tablas dinámicas y gráficos.",
        "Aprendé SQL para consultar y combinar tablas.",
        "Analizá un conjunto de datos público y contá tus hallazgos en un informe corto."
      ],
      intermedio: [
        "Aprendé Python con pandas para limpiar y transformar datos.",
        "Armá un tablero en Power BI, Tableau o Looker Studio.",
        "Repasá estadística descriptiva e inferencial aplicada."
      ],
      avanzado: [
        "Profundizá en modelado estadístico y pruebas A/B.",
        "Automatizá tus análisis con scripts y flujos de datos simples.",
        "Explorá machine learning con scikit-learn."
      ]
    }
  },
  ux: {
    name: "Diseño UX/UI",
    tagline: "Productos claros y cómodos de usar",
    color: "var(--ux)",
    desc: "Investigás cómo piensan las personas, diseñás flujos y pantallas, y probás que funcionen antes de construirlos.",
    techs: ["Figma", "Investigación de usuarios", "Wireframes y prototipos", "Sistemas de diseño", "Accesibilidad"],
    steps: {
      inicial: [
        "Aprendé los principios de usabilidad y jerarquía visual.",
        "Practicá en Figma rediseñando una pantalla de una app que uses.",
        "Hacé una prueba de uso con tres personas y anotá qué cambiarías."
      ],
      intermedio: [
        "Armá un caso completo: problema, investigación, prototipo y prueba.",
        "Construí un sistema de diseño chico con componentes reutilizables.",
        "Aprendé a entregar diseños a desarrollo con especificaciones claras."
      ],
      avanzado: [
        "Profundizá en investigación cualitativa y cuantitativa.",
        "Trabajá con métricas de producto y experimentos de diseño.",
        "Sumá HTML y CSS para prototipar con código."
      ]
    }
  },
  sec: {
    name: "Ciberseguridad",
    tagline: "Proteger sistemas, redes y datos",
    color: "var(--sec)",
    desc: "Buscás debilidades antes que otros, detectás ataques y ayudás a que las organizaciones respondan a tiempo.",
    techs: ["Redes (TCP/IP)", "Linux", "Python o Bash", "OWASP Top 10", "Wireshark"],
    steps: {
      inicial: [
        "Entendé redes y Linux: son la base de todo lo demás.",
        "Practicá en un laboratorio guiado de nivel introductorio.",
        "Aprendé el OWASP Top 10 con ejemplos prácticos."
      ],
      intermedio: [
        "Resolvé retos CTF de dificultad creciente.",
        "Automatizá tareas con Bash o Python.",
        "Aprendé análisis de registros y respuesta básica a incidentes."
      ],
      avanzado: [
        "Elegí un foco: ofensiva (pentesting), defensa (SOC) o seguridad en la nube.",
        "Preparate para una certificación acorde a ese foco.",
        "Documentá tus hallazgos en artículos públicos."
      ]
    }
  },
  cloud: {
    name: "Cloud y DevOps",
    tagline: "Infraestructura estable, automatizada y escalable",
    color: "var(--cloud)",
    desc: "Hacés que el software llegue a producción de forma segura y repetible, y que siga funcionando cuando crece el uso.",
    techs: ["Linux", "Git", "Docker", "AWS, Azure o GCP", "CI/CD", "Terraform"],
    steps: {
      inicial: [
        "Aprendé la terminal de Linux y Git.",
        "Entendé redes básicas y qué es un servidor.",
        "Publicá una página estática y un servicio simple en un proveedor cloud."
      ],
      intermedio: [
        "Contenerizá una aplicación con Docker.",
        "Armá un pipeline de CI/CD con GitHub Actions.",
        "Definí infraestructura como código con Terraform."
      ],
      avanzado: [
        "Profundizá en Kubernetes y orquestación de contenedores.",
        "Sumá monitoreo y alertas (Prometheus, Grafana).",
        "Preparate para una certificación de tu proveedor cloud."
      ]
    }
  }
};

// Preguntas. Cada opción suma puntos ("w") a una o más rutas.
// Pregunta 3 define el nivel de partida y la 4 el ritmo; no suman a rutas, personalizan el plan.
// Las preguntas 1 y 7 se usan además para desempatar.
const QUESTIONS = [
  {
    text: "¿Qué te dan más ganas de hacer en un proyecto?",
    options: [
      { label: "Ver cómo algo que armé se ve y se mueve en pantalla", w: { front: 3, ux: 1 } },
      { label: "Hacer que todo funcione por detrás: reglas, datos y servidores", w: { back: 3, cloud: 1 } },
      { label: "Encontrar patrones y respuestas dentro de los datos", w: { data: 3 } },
      { label: "Entender a las personas y diseñar cómo usan un producto", w: { ux: 3, front: 1 } },
      { label: "Proteger sistemas y detectar fallas antes que otros", w: { sec: 3, cloud: 1 } }
    ]
  },
  {
    text: "¿Qué tipo de problema disfrutás más resolver?",
    options: [
      { label: "Lograr que una pantalla sea clara y cómoda", w: { ux: 3, front: 2 } },
      { label: "Organizar la lógica para que nada se rompa", w: { back: 3, front: 1 } },
      { label: "Sacar conclusiones de muchos números", w: { data: 3 } },
      { label: "Anticipar qué podría salir mal o ser atacado", w: { sec: 3, cloud: 1 } },
      { label: "Conseguir que todo corra estable sin intervención manual", w: { cloud: 3, back: 1 } }
    ]
  },
  {
    text: "¿Cuál es tu experiencia previa en tecnología?",
    help: "Con esto adaptamos los primeros pasos de tu ruta.",
    options: [
      { label: "Estoy empezando desde cero", level: "inicial" },
      { label: "Hice cursos o proyectos chicos", level: "intermedio" },
      { label: "Trabajo o trabajé en algo relacionado con IT", level: "avanzado" }
    ]
  },
  {
    text: "¿Cuánto tiempo podés estudiar por semana?",
    options: [
      { label: "Hasta 5 horas", time: "bajo" },
      { label: "Entre 5 y 10 horas", time: "medio" },
      { label: "Más de 10 horas", time: "alto" }
    ]
  },
  {
    text: "¿Qué resultado te motiva más?",
    options: [
      { label: "Algo visible que otras personas pueden usar y comentar", w: { front: 2, ux: 2 } },
      { label: "Un sistema que no se ve, pero sostiene todo lo demás", w: { back: 2, cloud: 2 } },
      { label: "Un hallazgo que cambia una decisión importante", w: { data: 3 } },
      { label: "Saber que algo quedó a salvo de ataques", w: { sec: 3 } }
    ]
  },
  {
    text: "¿Cómo te llevás con la matemática y la estadística?",
    options: [
      { label: "Me gustan y las uso con gusto", w: { data: 3, back: 1 } },
      { label: "Me alcanza con lo básico", w: { front: 1, back: 1, cloud: 1, sec: 1 } },
      { label: "Prefiero evitarlas", w: { ux: 2, front: 2 } }
    ]
  },
  {
    text: "¿Qué proyecto armarías primero?",
    options: [
      { label: "Una web o app con un diseño muy cuidado", w: { front: 3, ux: 1 } },
      { label: "Una API que guarde y entregue información", w: { back: 3 } },
      { label: "Un tablero que muestre métricas de un negocio", w: { data: 3 } },
      { label: "El prototipo de una app para probar con usuarios", w: { ux: 3 } },
      { label: "Un laboratorio para practicar ataques y defensas", w: { sec: 3 } },
      { label: "Un servidor propio con publicación automática", w: { cloud: 3 } }
    ]
  },
  {
    text: "¿Cómo aprendés mejor?",
    options: [
      { label: "Armando cosas y corrigiendo errores", w: { front: 1, back: 1, cloud: 1 } },
      { label: "Investigando y probando hipótesis", w: { data: 2, sec: 2 } },
      { label: "Mirando trabajos ajenos y rediseñándolos", w: { ux: 2, front: 1 } },
      { label: "Siguiendo guías ordenadas con retos", w: { cloud: 1, sec: 1, back: 1 } }
    ]
  },
  {
    text: "¿Qué buscás con este cambio?",
    options: [
      { label: "Conseguir mi primer trabajo en IT", w: { front: 1, ux: 1, data: 1 } },
      { label: "Especializarme en lo que ya hago", w: { back: 1, cloud: 1, sec: 1 } },
      { label: "Trabajar de forma freelance o remota", w: { front: 2, ux: 1 } },
      { label: "Cambiar de carrera y tener un ingreso estable", w: { data: 1, cloud: 1, back: 1 } }
    ]
  }
];

const PACE = {
  bajo:  "Con hasta 5 horas semanales rendís más con sesiones cortas y frecuentes, y un solo recurso a la vez.",
  medio: "Con 5 a 10 horas semanales podés combinar estudio y práctica: dedicá una parte a aprender y otra a construir.",
  alto:  "Con más de 10 horas por semana podés avanzar en paralelo con teoría y proyectos. Cuidá el descanso para sostener el ritmo."
};

const RESOURCES = [
  { name: "freeCodeCamp en español", url: "https://www.freecodecamp.org/espanol/", desc: "Cursos gratuitos de desarrollo web, datos y más, con ejercicios.", para: "Frontend, Backend, Datos" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/es/", desc: "La referencia más confiable de HTML, CSS y JavaScript.", para: "Frontend" },
  { name: "The Odin Project", url: "https://www.theodinproject.com/", desc: "Ruta completa de desarrollo web basada en proyectos.", para: "Frontend, Backend" },
  { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", desc: "Microcursos prácticos de Python, SQL y aprendizaje automático.", para: "Datos" },
  { name: "roadmap.sh", url: "https://roadmap.sh/", desc: "Mapas visuales de lo que conviene aprender en cada rol.", para: "Todas las rutas" },
  { name: "TryHackMe", url: "https://tryhackme.com/", desc: "Laboratorios guiados para aprender seguridad practicando.", para: "Ciberseguridad" },
  { name: "CS50 de Harvard", url: "https://cs50.harvard.edu/x/", desc: "Curso de fundamentos de computación, con subtítulos.", para: "Todas las rutas" },
  { name: "Microsoft Learn", url: "https://learn.microsoft.com/es-es/training/", desc: "Rutas gratuitas de cloud, datos y herramientas de desarrollo.", para: "Cloud y DevOps, Datos" }
];

/* =========================================================
   ESTADO (RF-05): las respuestas viven solo en memoria
   ========================================================= */
const TOTAL = QUESTIONS.length;            // 9
let step = 0;                              // índice de la pregunta activa (0 a 8)
let answers = new Array(TOTAL).fill(null); // índice de la opción elegida por pregunta

const quizEl = document.getElementById("quiz");

/* =========================================================
   RENDER DEL CUESTIONARIO
   ========================================================= */
function renderQuestion() {
  const q = QUESTIONS[step];
  const isLast = step === TOTAL - 1;
  const current = step + 1;

  const stations = QUESTIONS.map((_, i) => {
    const cls = i < step ? "done" : i === step ? "current" : "";
    return `<span class="station ${cls}"></span>`;
  }).join("");

  const options = q.options.map((opt, i) => `
    <label class="option">
      <input type="radio" name="q${step}" value="${i}" ${answers[step] === i ? "checked" : ""}>
      <span class="card"><span class="dot" aria-hidden="true"></span><span>${opt.label}</span></span>
    </label>`).join("");

  quizEl.innerHTML = `
    <div class="progress-head">
      <span class="count" aria-live="polite">Paso ${current} de ${TOTAL}</span>
      <span class="hint">${Math.round((step / TOTAL) * 100)}% completado</span>
    </div>
    <div class="track" style="--p:${step / (TOTAL - 1)}" role="progressbar"
         aria-label="Progreso del test" aria-valuemin="1" aria-valuemax="${TOTAL}" aria-valuenow="${current}">
      <span class="fill"></span>
      <div class="stations">${stations}</div>
    </div>

    <fieldset class="question">
      <legend tabindex="-1" id="qLegend">${q.text}</legend>
      ${q.help ? `<p class="q-help">${q.help}</p>` : ""}
      <div class="options">${options}</div>
    </fieldset>

    <div class="quiz-actions">
      <button type="button" class="btn btn-ghost" id="btnBack" ${step === 0 ? "disabled" : ""}>Anterior</button>
      <button type="button" class="btn btn-primary" id="btnNext" ${answers[step] === null ? "disabled" : ""}>
        ${isLast ? "Ver resultado" : "Siguiente"}
      </button>
    </div>`;
}

// Selección de opción (RF-03) y habilitación del botón (RF-04)
quizEl && quizEl.addEventListener("change", (e) => {
  if (e.target.matches('input[type="radio"]')) {
    answers[step] = Number(e.target.value);
    document.getElementById("btnNext").disabled = false;
  }
});

// Botones de avance / retroceso / reinicio
quizEl && quizEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.id === "btnNext" && answers[step] !== null) {
    if (step < TOTAL - 1) { step++; renderQuestion(); focusLegend(); }
    else { showResult(); }
  }
  if (btn.id === "btnBack" && step > 0) { step--; renderQuestion(); focusLegend(); }
  if (btn.id === "btnRestart") { restart(); }
});

// Lleva el foco a la pregunta nueva para lectores de pantalla y teclado
function focusLegend() {
  const legend = document.getElementById("qLegend");
  if (legend) legend.focus({ preventScroll: true });
  keepQuizInView();
}
function keepQuizInView() {
  const top = quizEl.getBoundingClientRect().top;
  if (top < 70 || top > window.innerHeight * 0.5) quizEl.scrollIntoView({ block: "start" });
}

/* =========================================================
   LÓGICA DE RECOMENDACIÓN (RF-06)
   ========================================================= */
function calculateResult() {
  const keys = Object.keys(ROUTES);
  const score = Object.fromEntries(keys.map(k => [k, 0]));
  const tieBreak = Object.fromEntries(keys.map(k => [k, 0]));
  let level = "inicial", time = "medio";

  answers.forEach((optIndex, qIndex) => {
    const opt = QUESTIONS[qIndex].options[optIndex];
    if (opt.level) level = opt.level;
    if (opt.time) time = opt.time;
    Object.entries(opt.w || {}).forEach(([route, pts]) => {
      score[route] += pts;
      if (qIndex === 0 || qIndex === 6) tieBreak[route] += pts; // preguntas 1 y 7 desempatan
    });
  });

  const ranking = keys
    .map((k, order) => ({ key: k, score: score[k], tb: tieBreak[k], order }))
    .sort((a, b) => b.score - a.score || b.tb - a.tb || a.order - b.order);

  return { ranking, level, time };
}

function showResult() {
  const { ranking, level, time } = calculateResult();
  const top = ranking[0];
  const route = ROUTES[top.key];
  const topScore = top.score || 1;

  const nearby = ranking.slice(1, 3).map(r => {
    const pct = Math.round((r.score / topScore) * 100);
    return `
    <div class="affinity-row" style="--c2:${ROUTES[r.key].color}">
      <span>${ROUTES[r.key].name}</span>
      <span class="bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
      <span class="pct">${pct}%</span>
    </div>`;
  }).join("");

  quizEl.innerHTML = `
    <div class="result" style="--c:${route.color}" id="resultBox">
      <div class="result-band" aria-hidden="true"></div>
      <h3 class="result-title" id="resultTitle" tabindex="-1">${route.name}</h3>
      <p class="kicker">Tu ruta sugerida · ${route.tagline}</p>
      <p class="desc">${route.desc}</p>

      <h4>Tecnologías para conocer</h4>
      <ul class="chips">${route.techs.map(t => `<li class="chip">${t}</li>`).join("")}</ul>

      <h4>Tus primeros pasos (nivel ${level})</h4>
      <ol class="steps">${route.steps[level].map(s => `<li>${s}</li>`).join("")}</ol>
      <p class="pace">${PACE[time]}</p>

      <h4>Otras rutas cercanas a tu perfil</h4>
      <p class="q-help" style="margin:-0.3rem 0 0.9rem">Porcentaje respecto de tu ruta sugerida.</p>
      <div class="affinity">${nearby}</div>

      <div class="result-actions">
        <button type="button" class="btn btn-primary" id="btnRestart">Reiniciar el test</button>
        <a class="btn btn-ghost" href="index.html#recursos">Ver recursos</a>
      </div>
    </div>`;

  document.getElementById("resultTitle").focus({ preventScroll: true });
  quizEl.scrollIntoView({ block: "start" });
}

// Reinicio (RF-07): borra respuestas y vuelve a la pregunta 1
function restart() {
  answers = new Array(TOTAL).fill(null);
  step = 0;
  renderQuestion();
  focusLegend();
}

/* =========================================================
   SECCIONES ESTÁTICAS: rutas y recursos (generadas desde los datos)
   ========================================================= */
const routesEl = document.getElementById("routesList");
if (routesEl) routesEl.innerHTML = Object.values(ROUTES).map(r => `
  <li class="route-item" style="--c:${r.color}">
    <h3>${r.name}</h3>
    <p class="tag">${r.tagline}</p>
    <p class="desc">${r.desc}</p>
    <ul class="chips">${r.techs.map(t => `<li class="chip">${t}</li>`).join("")}</ul>
  </li>`).join("");

const resourcesEl = document.getElementById("resourcesList");
if (resourcesEl) resourcesEl.innerHTML = RESOURCES.map(r => `
  <li class="resource">
    <a href="${r.url}" target="_blank" rel="noopener noreferrer">
      <span class="r-name">${r.name}<span class="sr-only"> (se abre en una pestaña nueva)</span></span>
      <span class="r-desc">${r.desc}</span>
      <span class="r-for">${r.para}</span>
    </a>
  </li>`).join("");

/* =========================================================
   NAVEGACIÓN (RF-01): resalta la sección visible
   ========================================================= */
const navLinks = [...document.querySelectorAll("#navList a")];
// Solo los enlaces internos (#...) tienen una sección en esta página
const sections = navLinks.map(a => {
  const h = a.getAttribute("href");
  return h.startsWith("#") ? document.querySelector(h) : null;
});

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.removeAttribute("aria-current"));
        const active = navLinks.find(a => a.getAttribute("href") === "#" + entry.target.id);
        if (active) active.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => s && io.observe(s));
}

// Arranque: el cuestionario solo existe en test.html
if (quizEl) renderQuestion();