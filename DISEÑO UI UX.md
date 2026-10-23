# Guía de Diseño de Interfaz y Experiencia de Usuario (UI/UX) - Skill Path

## 1. Filosofía de Diseño
El objetivo del diseño es ofrecer una experiencia **intuitiva, limpia y motivadora**, orientada a estudiantes y profesionales en busca de orientación. La interfaz busca reducir la carga cognitiva mediante un flujo guiado paso a paso, retroalimentación visual clara y componentes modernos.

---

## 2. Paleta de Colores

Para mantener una estética profesional y accesible, se adopta un esquema moderno basado en tonos violeta/púrpura (acento principal), neutros oscuros para lectura y fondos claros:

| Rol de Color | Código HEX | Aplicación / Uso |
| :--- | :--- | :--- |
| **Primario (Brand/Accent)** | `#6D28D9` / `#7C3AED` | Botones principales, estados activos, bordes seleccionados. |
| **Primario Hover** | `#5B21B6` | Estado hover de botones principales. |
| **Fondo Principal** | `#F9FAFB` | Fondo general de la página para alto contraste y limpieza. |
| **Fondo Tarjetas / Cards** | `#FFFFFF` | Contenedores del cuestionario y secciones informativas. |
| **Texto Principal** | `#1F2937` | Títulos principales y texto de lectura. |
| **Texto Secundario** | `#4B5563` / `#6B7280` | Descripciones, subtítulos e indicadores secundarios. |
| **Borde / Separador** | `#E5E7EB` | Líneas divisoras y bordes por defecto en opciones inactivas. |
| **Éxito / Destacado** | `#10B981` | Indicador de finalización y tarjetas de resultado. |

---

## 3. Tipografía y Jerarquía

Se recomienda el uso de **Inter**, **Plus Jakarta Sans** o **System UI Font Stack** (`sans-serif`) por su legibilidad en pantallas.

* **Hero Title (H1):** `32px` - `40px` | Bold / ExtraBold (`font-weight: 700-800`).
* **Títulos de Sección (H2):** `24px` - `28px` | SemiBold (`font-weight: 600`).
* **Preguntas del Cuestionario (H3):** `18px` - `20px` | Medium / SemiBold.
* **Cuerpo de Texto (Body):** `15px` - `16px` | Regular (`font-weight: 400`).
* **Microtexto / Step Tracker:** `12px` - `14px` | Medium / Bold.

---

## 4. Componentes Clave e Interacciones

### A. Barra de Progreso e Indicador de Pasos (Step Tracker)
* **Diseño:** Un indicador visual horizontal numerado (Passos 1, 2 y 3) conectado por una línea sutil.
* **Estado Activo:** Círculo relleno en color primario (`#7C3AED`) con número en blanco y leve sombra (`shadow-md`).
* **Estado Inactivo:** Círculo neutro (`#E5E7EB`) con texto secundario.
* **Estado Completado:** Círculo con checkmark o fondo suavizado.

### B. Tarjetas de Opción Seleccionable (Option Cards)
* **Estado Normal (Reposo):**
  * Fondo blanco (`#FFFFFF`), borde sutil (`1px solid #E5E7EB`), esquinas redondeadas (`rounded-xl` / `12px`).
  * Incluye un icono representativo a la izquierda y el texto de la opción alineado.
  * Selector tipo *Radio Button* visual a la izquierda o derecha.
* **Estado Hover:**
  * Elevação suave (`shadow-md`), borde cambia a lavanda/primario claro (`#A78BFA`).
  * Cursor pointer.
* **Estado Seleccionado (Active):**
  * Fondo con tinte violeta muy suave (`#F3E8FF`), borde primario (`2px solid #7C3AED`).
  * El radio button interno se rellena en violeta.

### C. Botones de Acción (Call To Action)
* **Botón "Siguiente" / "Ver Resultado":**
  * Full-width en móviles, alineado a la derecha en escritorios.
  * **Habilitado:** Fondo violeta (`#7C3AED`), texto blanco, esquinas redondeadas (`rounded-lg`), sombra suave.
  * **Deshabilitado (Disabled):** Opacidad al `50%`, cursor `not-allowed`, evitando clics accidentales sin seleccionar opción.

---

## 5. Distribución de Pantalla y Wireframe Visual

```text
+-----------------------------------------------------------------------+
|  [Logo] SkillPath                       Inicio   Test   Rutas   Recursos |
+-----------------------------------------------------------------------+
|                                                                       |
|                     Descubrí tu ruta de aprendizaje                   |
|       Respondé 3 preguntas y te recomendaremos un camino ideal.       |
|                                                                       |
|                          (1) ------ (2) ------ (3)                    |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |  ¿Qué te interesa aprender principalmente?                      |  |
|  |                                                                 |  |
|  |  (o)  [</>]  Desarrollo Web                                     |  |
|  |  ( )  [📊]  Análisis de Datos                                  |  |
|  |  ( )  [🎨]  Diseño UX/UI                                       |  |
|  |                                                                 |  |
|  |                                                [ Siguiente -> ] |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 6. Microinteracciones y Transiciones

1. **Transición entre Preguntas:**
   * Animación suave de deslizamiento horizontal (*slide-left*) o *fade-in* (duración: `200ms - 300ms`) al pasar de una pregunta a otra.
2. **Feedback Visual Instantáneo:**
   * Cambio de color y borde de la tarjeta al hacer clic instantáneo (<50ms).
3. **Pantalla de Carga / Revelación de Resultado:**
   * Breve animación de *spinner* o pulso de 0.5s para simular el cálculo de la ruta recomendada, aumentando la percepción del valor del resultado.

---

## 7. Accesibilidad y Responsividad

* **Mobile-First:** La tarjeta del test ocupa el 90-95% del ancho en pantallas móviles y se limita a un `max-width: 600px` en pantallas grandes para evitar fatiga visual.
* **Contraste:** Todo el texto cumple con la relación de contraste WCAG AA (mínimo 4.5:1).
* **Focus States:** Borde visible de enfoque (`ring-2 ring-violet-500`) para usuarios que navegan mediante teclado.