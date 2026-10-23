# ENTRE BRASAS — Alcance y Actualizaciones
## Versión 1.2 — Estado verificado en código al 04/11/2026

**Alcance de la hamburguesería** y **registro de actualizaciones** respecto del documento contractual inicial.

| | |
|---|---|
| **Versión del documento** | 1.2 |
| **Fecha de emisión** | 04/11/2026 |
| **Sustituye a** | Alcance 1.0.1 — 21/07/2026 (`Presentaci_n_Alcance_Completo_EntreBrasas_final.pdf`) |
| **Cliente** | Entre Brasas (Hamburguesería) — Resistencia, Chaco |
| **Alcance** | Contrato técnico-funcional actualizado + bitácora de desviaciones |

### Historial de cambios

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0.1 | 17/07/2026 | Alcance inicial del proyecto. Definición de alcance, funcionalidades, restricciones y criterios de aceptación. |
| **1.2** | **04/11/2026** | Alcance re-verificado contra el código fuente. Se documenta el estado real de cada módulo, se corrigen las afirmaciones que quedaron desactualizadas, se listan las funcionalidades que se entregaron fuera del alcance original y se identifican los pendientes. |

### Cómo se elaboró este documento

- **Fuente contrastada:** `app/` (proyecto Django, 6 aplicaciones), `docs/`, `README.md`, `PRODUCT.md`, `DESIGN.md`
- **Última evidencia de desarrollo en el repo:** `docs/plan-mejoras-pendientes.md` (30/09/2026)
- **Método:** lectura de modelos, vistas, URLs, plantillas, migraciones, comandos de gestión y suites de prueba
- **Veredicto global:** el documento 1.0.1 describe **correctamente la intención original**, pero quedó desactualizado en **25 puntos** que hoy son **falsos o están a medio implementar**, y **omite por completo 7 funcionalidades ya entregadas**.

> ⚠️ **Regla de precedencia:** este documento describe lo que el código **hace hoy**, no lo que la versión 1.0.1 **prometía**. Donde 1.0.1 y el código difieren, **gana el código**.

---

## 1. Descripción del proyecto

**Entre Brasas** es una aplicación web interna de gestión para una hamburguesería de un solo local, con operación en la ciudad de Resistencia, Chaco (Argentina). No es una tienda pública: no hay carrito, no hay cliente final, no hay autenticación. La usa una sola persona (el dueño o el encargado) desde la computadora del local.

El sistema cubre el circuito operativo completo:

1. **Toma de pedidos** — carga rápida de pedidos que llegan por WhatsApp, con cálculo automático de subtotal, envío y total.
2. **Cola de cocina** — pedidos ordenados por antigüedad (FIFO) con avance de estado secuencial.
3. **Comanda a la cocina** — el sistema redacta el mensaje con el formato que ya usaba el local y lo envía por WhatsApp.
4. **Control de inventario** — stock de insumos, recetas por producto, movimientos de entrada/salida/conteo y alertas de faltantes.
5. **Reportes de ventas** — métricas calculadas sobre pedidos entregados.
6. **Costos y rentabilidad** — costo de ingredientes + mano de obra, ganancia y margen por producto.
7. **Configuración** — tarifas de envío, costo de mano de obra, WhatsApp de la cocina, clave de mapas.

Todo corre **localmente en la PC del local**, sin servidor externo, sin nube y sin dependencia de internet para la operación diaria.

### Flujo de un pedido

```
Nuevo pedido (4 pasos: Cliente → Hamburguesas → Pago → Ubicación)
        │
        ▼
   estado = pendiente ─────────────► aparece en la cola FIFO
        │
        │ "Pasar a En preparación"
        ▼
   en_preparacion  ──► se descuenta stock según recetas (puede quedar en negativo, avisa)
        │
        │ "Pasar a En camino"
        ▼
   en_camino
        │
        │ "Pasar a Entregado"
        ▼
   entregado ──────► recién acá cuenta como venta en Reportes

   (en cualquier estado previo a "entregado" → cancelado, con devolución de stock opcional)
```

---

## 2. Alcance: hasta dónde llega el 04/11

### 2.1 Entregado y funcionando

| Módulo | Estado real | Evidencia |
|---|---|---|
| **Gestión de hamburguesas** | CRUD completo, borrado lógico, precio congelado en el pedido | `app/menu/`, `menu/migrations/0001` |
| **Gestión de adicionales** | CRUD completo, M2M con hamburguesas, marca `es_medallon_extra` (Simple/Doble/Triple) | `app/menu/models.py:42` |
| **Gestión de ingredientes** | CRUD, 5 unidades de medida, `precio_compra`, stock decimal, borrado lógico | `app/inventario/models.py:39` |
| **Recetas** | Receta por hamburguesa **y por adicional** (dos FK, no polimórfico), edición en pantalla | `app/inventario/views.py:235` |
| **Crear pedido** | Multi-producto, hasta 100 unidades, nota por hamburguesa, medallones extra, cliente guardado | `app/pedidos/views.py:42` |
| **Cola FIFO** | Orden por `fecha_creacion`, búsqueda y filtro por estado, botón "Copiar comanda" | `app/pedidos/views.py:301` |
| **Detalle / gestión de pedido** | Costos desglosados, historial de estados, comanda, botón "Enviar a cocina por WhatsApp" | `app/pedidos/views.py:337` |
| **Cambio de estado** | Secuencial, sin saltos ni retrocesos; registra historial con fecha y hora | `app/pedidos/models.py:47` |
| **Cancelación** | Disponible en cualquier estado previo; devuelve stock o lo registra como pérdida | `app/pedidos/views.py:429` |
| **Historial de pedidos** | Entregados + cancelados, orden descendente, filtros por nombre/estado/rango de fechas | `app/pedidos/views.py:467` |
| **Inventario** | Stock actual, alertas de bajo y de "sin contar", CRUD, movimientos | `app/inventario/views.py:21` |
| **Movimientos de stock** | Entrada / Salida / **Conteo** (nuevo) con motivo obligatorio y precio unitario | `app/inventario/views.py:48` |
| **Recetas en pantalla** | Alta y baja de líneas de receta por producto | `app/inventario/views.py:282` |
| **Reportes de ventas** | Filtro por fechas, 4 métricas, ranking de hamburguesas y de adicionales | `app/reportes/views.py:14` |
| **Costos y rentabilidad** | Costo de ingredientes + mano de obra, ganancia y margen por hamburguesa | `app/costos/views.py:24` |
| **Panel de configuración** | Tarifa, distancia incluida, costo mínimo, mano de obra, WhatsApp de cocina, API key y coordenadas del local | `app/config/views.py:13` |
| **Mapa y direcciones** | Geocodificación y ruta por Geoapify, mosaicos servidos por el backend, Leaflet local | `app/pedidos/mapas.py` |
| **Interpretación de WhatsApp** | Pega el mensaje del cliente y completa el formulario | `app/pedidos/interpretar.py:194` |
| **Comanda a la cocina** | Texto con el formato del local + link `wa.me` | `app/pedidos/comanda.py:50` |
| **Clientes guardados** | Modelo `Cliente`, búsqueda por nombre/teléfono, copia histórica en cada pedido | `app/pedidos/models.py:14` |
| **Borrador de pedido** | Autoguardado por pestaña (sessionStorage), con 4 pasos | `app/static/js/borrador-pedido.js` |
| **Apagado del sistema** | Botón en la web; bloquea las pestañas abiertas y las deshabilita | `app/entre_brasas/views.py:24` |
| **Instalador Windows** | `instalar.bat` + icono de escritorio, sin consola, con respaldos automáticos | `iniciar.bat`, `app/iniciar.py` |
| **Inicio / dashboard** | Resumen del día, pedidos abiertos, faltantes, accesos por tarea | `app/entre_brasas/views.py:37` |

### 2.2 NO implementado (aún)

| Ítem | Estado | Nota |
|---|---|---|
| Ventas por día (desglose diario) | ❌ Ausente | `reportes/views.py` no agrupa por fecha |
| Comparación con el período anterior | ❌ Ausente | No hay nada de período previo |
| Gráficos en Reportes | ❌ Ausente | Solo tablas HTML; no hay librería de charts |
| Total facturado por hamburguesa y por método de pago | ⚠️ Parcial | Solo cantidad de pedidos/unidades, no importes |
| Tiempo de preparación por producto | ❌ Ausente | Constante fija `MINUTOS_DE_PREPARACION = 10` (`costos/views.py:21`) |
| Costo por minuto de mano de obra | ❌ Ausente | Solo `costo_hora_mano_obra` |
| Costos de adicionales | ❌ Ausente | `costos/views.py:36` solo recorre hamburguesas |
| Reporte de rentabilidad (más/menos rentables, margen promedio, rotación) | ❌ Ausente | La pantalla es una sola tabla |
| Modelo `CostoProducto` persistido | ❌ No existe | El cálculo es on-the-fly, sin tabla |
| Módulo "Cerrar el día" | ❌ Solo es una idea | `docs/ideas/cierre-del-dia.md` |
| Observación al **avanzar** estado | ❌ Ausente | Solo se guarda al cancelar |
| Edición manual del precio de compra "con caja cerrada" | ❌ Ausente | Se actualiza solo con la entrada de stock |
| Botón "Eliminar pedido" | ❓ Sin decidir | Decisión #3 del plan de mejoras |

### 2.3 Funcionalidades que el alcance 1.0.1 excluyó y que ya están entregadas

El alcance 1.0.1 (sección 5, "Funcionalidades Excluidas") declara como **fuera de alcance**:

| Excluido en la v1.0.1 | Realidad al 04/11 |
|---|---|
| *"Sistema de costos y rentabilidad — Futura versión"* | **Implementado** — app `costos` funcional |
| *"Integración con WhatsApp Business — Futura versión"* | **Implementado** — comanda a cocina + interpretación de mensajes |
| *"Notificaciones push o SMS"* | Sigue sin estar ✅ correcto |
| *"Gestión de repartidores"* | Sigue sin estar ✅ correcto |
| *"Autenticación y login"* | Sigue sin estar ✅ correcto |
| *"Programación de pedidos"* | Sigue sin estar ✅ correcto |
| *"Descuentos y cupones"* | Sigue sin estar ✅ correcto |
| *"Múltiples monedas"* | Sigue sin estar ✅ correcto |

Y la v1.0.1 **nunca mencionó**, pese a estar implementadas: mapa con Geoapify, clientes guardables, notas por ítem, medallón extra, movimiento tipo "conteo", borrador por pestaña, apagado del sistema, instalador de escritorio, respaldos automáticos, responsive.

---

## 3. Requisitos

### 3.1 Requisitos funcionales

#### RF-01 — Gestión de menú
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-01.1 | Crear hamburguesa con nombre, descripción, precio, incluye papas, activa | ✅ | Nombre único, precio > 0 |
| RF-01.2 | Editar hamburguesa | ✅ | |
| RF-01.3 | Desactivar hamburguesa (borrado lógico) | ✅ | `activa` |
| RF-01.4 | Listar hamburguesas | ✅ | |
| RF-01.5 | Crear/editar/listar/activar adicionales | ✅ | |
| RF-01.6 | Asociar adicionales a hamburguesas (M2M) | ✅ | Campo `hamburguesas` |
| RF-01.7 | Identificar el adicional "medallón extra" (doble/triple) | ✅ | `es_medallon_extra` |
| RF-01.8 | Editar el precio de un ingrediente | ✅ | Solo desde el formulario de ingrediente |

#### RF-02 — Creación de pedido
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-02.1 | Registrar datos del cliente | ✅ | Nombre siempre; teléfono y dirección **solo para envíos** |
| RF-02.2 | Buscar y reutilizar un cliente guardado | ✅ | Máx. 8 resultados, coincidencia por nombre o dígitos de teléfono |
| RF-02.3 | Seleccionar una o más hamburguesas con cantidad | ✅ | Hasta 100 unidades por pedido |
| RF-02.4 | Agregar adicionales por hamburguesa | ✅ | Solo los asociados a ese producto |
| RF-02.5 | Agregar medallones extra (Simple/Doble/Triple) | ✅ | 0–2 por unidad |
| RF-02.6 | Nota por hamburguesa (ej. "sin cebolla") | ✅ | Máx. 200 caracteres |
| RF-02.7 | Ingresar distancia de envío en km | ✅ | Hasta 1 decimal; obligatoria si es envío |
| RF-02.8 | Calcular la distancia desde el mapa | ✅ | Geoapify; distancia manual sigue disponible |
| RF-02.9 | Elegir método de pago (Efectivo / Transferencia-QR) | ✅ | |
| RF-02.10 | Calcular subtotal, envío y total | ✅ | Total congelado al crear |
| RF-02.11 | Marcar retiro en local (envío = $0) | ✅ | Oculta el campo de distancia |
| RF-02.12 | Guardar en estado "Pendiente" y mandar a la cola | ⚠️ | Redirige al **detalle** (donde está la comanda), no a la cola |
| RF-02.13 | Interpretar un mensaje de WhatsApp pegado | ✅ | No guarda nada; siempre se revisa |
| RF-02.14 | Conservar el pedido a medio cargar (borrador por pestaña) | ✅ | sessionStorage; se limpia al crear o descartar |
| RF-02.15 | Impedir más de 100 unidades y duplicados de adicional | ✅ | Validación en servidor |

#### RF-03 — Ciclo de vida del pedido
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-03.1 | Cola FIFO (más antiguo primero) | ✅ | `ordering = ['fecha_creacion']` |
| RF-03.2 | Buscar por nombre y filtrar por estado | ✅ | |
| RF-03.3 | Avanzar de estado sin saltos ni retrocesos | ✅ | `Pedido.SIGUIENTE_ESTADO` |
| RF-03.4 | Registrar historial con fecha y hora | ✅ | `HistorialEstado` con `choices` |
| RF-03.5 | Registrar observación en cada cambio | ⚠️ | Solo al **cancelar**; al avanzar no hay campo |
| RF-03.6 | Cancelar en cualquier momento previo a entregado | ✅ | |
| RF-03.7 | Descontar stock al pasar a "En preparación" | ✅ | Recetas de hamburguesa **y** de adicional |
| RF-03.8 | **No** frenar el pedido por falta de stock | ✅ | El stock puede quedar negativo; se avisa |
| RF-03.9 | Preguntar si se devuelve el stock al cancelar | ✅ | La v1.0.1 pide un popup; el código usa un formulario POST |
| RF-03.10 | Historial de pedidos finalizados con filtros | ✅ | Nombre, estado y rango de fechas |
| RF-03.11 | Ver detalle completo del pedido | ✅ | |
| RF-03.12 | Armar y enviar la comanda a la cocina | ✅ | Formato del local + link `wa.me` + copiar |

#### RF-04 — Inventario
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-04.1 | Ver stock, unidad y nivel mínimo | ✅ | Solo ingredientes del **menú activo** |
| RF-04.2 | Resaltar ingredientes con stock bajo | ✅ | |
| RF-04.3 | Avisar ingredientes en 0 o negativo (sin contar) | ✅ | Requisito nuevo, no está en la v1.0.1 |
| RF-04.4 | Registrar entrada con cantidad y motivo | ✅ | Actualiza `precio_compra` si viene precio |
| RF-04.5 | Registrar salida sin exceder el stock disponible | ✅ | |
| RF-04.6 | Registrar **conteo** físico y ajustar el stock | ✅ | Requisito nuevo, no está en la v1.0.1 |
| RF-04.7 | Historial de movimientos filtrable | ❌ | **No hay pantalla de historial de movimientos.** Se registran en la base (auditable por ORM/DB Browser) pero no se exponen en la interfaz |
| RF-04.8 | Editar/crear/desactivar ingredientes | ✅ | |
| RF-04.9 | Regla de baja de ingrediente | ⚠️ | **Distinta a la de la v1.0.1**: solo bloquea si está en la receta de un producto **activo**; los movimientos previos no bloquean |
| RF-04.10 | Asociar ingredientes y cantidades a cada producto | ✅ | Incluidos los adicionales |

#### RF-05 — Reportes de ventas
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-05.1 | Filtro por rango de fechas | ✅ | |
| RF-05.2 | Total de ventas, cantidad de pedidos, ticket promedio, total de envíos | ✅ | 4 tarjetas |
| RF-05.3 | Ventas por día (total y cantidad) | ❌ | **No implementado** |
| RF-05.4 | Ventas por método de pago (total **y** cantidad) | ⚠️ | Solo la **cantidad** de pedidos |
| RF-05.5 | Ranking de hamburguesas por cantidad **y** total facturado | ⚠️ | Solo **unidades** |
| RF-05.6 | Ranking de adicionales más solicitados | ✅ | Cuenta unidades, no "veces" |
| RF-05.7 | Comparación con el período anterior | ❌ | **No implementado** |
| RF-05.8 | Excluir cancelados | ✅ | Solo `estado='entregado'` |
| RF-05.9 | Gráficos | ❌ | **No implementado**; solo tablas |

#### RF-06 — Costos y rentabilidad
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-06.1 | Precio de compra por ingrediente, actualizado en la entrada | ✅ | |
| RF-06.2 | Asociación producto → ingredientes con cantidades | ✅ | |
| RF-06.3 | Costo unitario de ingredientes | ✅ | `cantidad × precio_compra` |
| RF-06.4 | Costo de mano de obra configurable | ⚠️ | Solo **costo por hora**; no por minuto |
| RF-06.5 | Tiempo de preparación por producto | ❌ | Constante global de 10 minutos |
| RF-06.6 | Costo total unitario (ingredientes + mano de obra) | ✅ | |
| RF-06.7 | Margen de ganancia | ⚠️ | **Fórmula distinta**: el código usa `ganancia / precio × 100`, la v1.0.1 pide `ganancia / costo × 100` |
| RF-06.8 | Rendimiento en $ | ✅ | `precio − costo total` |
| RF-06.9 | Comparación costo vs. precio vs. margen | ✅ | Es la tabla de la pantalla |
| RF-06.10 | Reporte de rentabilidad (más/menos rentables, margen promedio, rotación) | ❌ | **No implementado** |
| RF-06.11 | Editar manualmente el precio de compra con la caja cerrada | ❌ | **No implementado** |

#### RF-07 — Configuración
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-07.1 | Tarifa de envío | ✅ | **Por 100 metros**, no por km |
| RF-07.2 | Distancia incluida en el envío mínimo | ✅ | |
| RF-07.3 | Costo mínimo de envío | ✅ | |
| RF-07.4 | Costo de mano de obra | ✅ | Por hora |
| RF-07.5 | Accesos directos a los CRUD | ✅ | Menú lateral |
| RF-07.6 | Pantalla de asociación ingrediente-producto | ✅ | En Inventario |
| RF-07.7 | WhatsApp de la cocina | ✅ | Requisito nuevo |
| RF-07.8 | API key y coordenadas del local para mapas | ✅ | Requisito nuevo |

#### RF-08 — Operación en el local
| ID | Requisito | Implementado | Nota |
|---|---|---|---|
| RF-08.1 | Instalación en la PC del cliente sin terminal | ✅ | `instalar.bat` + icono |
| RF-08.2 | Arranque sin ventana de consola | ✅ | `pythonw.exe` |
| RF-08.3 | Apagado del sistema desde la web | ✅ | Solo desde `127.0.0.1` |
| RF-08.4 | Bloqueo de las pestañas al apagar | ✅ | Middleware dedicado |
| RF-08.5 | Copias de seguridad automáticas | ✅ | Al abrir; se conservan las 30 últimas |
| RF-08.6 | Base de datos fuera de la carpeta del programa | ✅ | `%LOCALAPPDATA%\EntreBrasas` |
| RF-08.7 | Log de errores en producción | ✅ | `errores.log` |

### 3.2 Requisitos no funcionales

| ID | Requisito | Estado | Nota |
|---|---|---|---|
| RNF-01 | Interfaz íntegramente en español (es-AR) | ✅ | `LANGUAGE_CODE = 'es-ar'`, `TIME_ZONE = America/Argentina/Buenos_Aires` |
| RNF-02 | Montos y precios en pesos argentinos, sin centavos | ✅ | `PositiveIntegerField` |
| RNF-03 | Sin autenticación | ✅ | `ALLOWED_HOSTS = ['127.0.0.1', 'localhost']` |
| RNF-04 | Protección CSRF en formularios | ✅ | `CsrfViewMiddleware` |
| RNF-05 | No perder datos al actualizar el software | ✅ | DB + `SECRET_KEY` fuera de la carpeta del programa |
| RNF-06 | Búsqueda y filtrado con respuesta < 3 s | ✅ (estimado) | No hay medición automatizada de carga |
| RNF-07 | Interfaz usable también en celular | ✅ | Responsive; la v1.0.1 lo daba por no necesario |
| RNF-08 | Sin dependencia de CDN ni fuentes externas | ✅ | Manrope y Leaflet en `static/` |
| RNF-09 | La operación diaria funciona sin internet | ✅ | Solo el mapa necesita internet; hay fallback manual |
| RNF-10 | No exponer la API key de mapas en el navegador | ✅ | Mosaicos y consultas proxied por el backend |
| RFQ-11 | Respaldo de la base ante error del proveedor de mapas | ✅ | Nunca se inventa distancia ni costo |
| RNF-12 | Pruebas automatizadas | ✅ | 91 tests Django + 6 suites Node |
| RNF-13 | Estructura de base versionada por migraciones | ✅ | 12 migraciones en 4 apps |
| RNF-14 | Historial inmutable de movimientos de stock | ✅ | No se edita; se revierte con el movimiento contrario |
| RNF-15 | Nada se borra, se desactiva | ✅ | Menú, inventario y clientes |
| RNF-16 | Documentación | ⚠️ | Hay README de equipo + `docs/`; **falta manual de usuario final** (requisito de la v1.0.1) |
| RNF-17 | Privacidad de datos del cliente | ⚠️ | La API key de Geoapify queda sin cifrar en la base y en sus respaldos |

---

## 4. Tecnologías y utilidades con versiones

| Capa | Tecnología | Versión | Dónde |
|---|---|---|---|
| Lenguaje | Python | **3.12** (verificada) | `README.md` §1; `DESIGN.md` advierte que 3.14 falla al instrumentar tests |
| Framework | Django | **4.2.x** (`>=4.2,<5.0`) | `app/requirements.txt` |
| Base de datos | SQLite 3 | embebida en la stdlib | `app/entre_brasas/settings.py:114` |
| Servidor WSGI (producción) | Waitress | `>=3.0,<4.0` | `app/iniciar.py:40`, puerto 8765 |
| Estáticos sin `collectstatic` | WhiteNoise | `>=6.6,<7.0` | `settings.py:80` |
| Mapas (frontend) | Leaflet | **1.9.4** (vendored, BSD-2-Clause) | `app/static/vendor/leaflet/` |
| Geocodificación y rutas | Geoapify API | servicio externo, plan gratuito | `app/pedidos/mapas.py` |
| Tipografía | Manrope 400/500/600/700/800 (OFL, local) | — | `app/static/fonts/` |
| CSS | Propio, 3 hojas, variables CSS nativas | — | `estilo.css`, `sistema.css`, `mapas-pedido.css` |
| JS | Vanilla ES6+, 7 módulos | — | `app/static/js/` |
| Pruebas JS | Node.js `node --test` | 6 suites `.cjs` | `README.md` §6 |
| Build / bundler | **Ninguno** (sin npm, sin webpack) | — | — |
| Control de versiones | Git + GitHub | — | — |
| SO del cliente | Windows 10/11 (instalador `.bat`) | — | `instalar.bat` |

### Dependencias de Python (completas)

```
Django>=4.2,<5.0
whitenoise>=6.6,<7.0
waitress>=3.0,<4.0
```

Solo 3 paquetes. Sin Django REST Framework, sin React, sin Bootstrap, sin Tailwind, sin `psycopg2`.

### Cobertura de pruebas

| Suite | Tests |
|---|---|
| `pedidos/tests.py` | 26 |
| `pedidos/tests_mapas.py` | 15 |
| `pedidos/tests_clientes.py` | 13 |
| `entre_brasas/test_servidor_local.py` | 12 |
| `inventario/tests.py` | 10 |
| `config/tests.py` | 6 |
| `menu/tests.py` | 5 |
| `entre_brasas/tests.py` | 4 |
| **Total Python** | **91** |
| Suites Node (`.cjs`) | 6 archivos: estado del sistema, borrador, clientes, envío, pasos, mapas |

---

## 5. Dificultades y soluciones

### 5.1 El cálculo de envío no era el especificado

**Problema.** La v1.0.1 fija `costo = distancia_km × tarifa_km`, con un piso de costo mínimo y una zona gratis por debajo de la distancia mínima. La tarifa por km redondeaba mal: con el menú real (precios de $10.500 a $16.500) un envío a 3 km con tarifa de $500 daba $1.500, y cualquier tramo corto se cobraba de más o de menos.

**Solución.** Se redefinió la fórmula en `app/pedidos/calculos.py:20`:

```
costo_envio = costo_minimo_envio + max(0, distancia_km − distancia_incluida) × 10 × tarifa_100m
```

- La distancia incluida **no es zona gratis**: está cubierta por el costo mínimo.
- La tarifa es **por 100 metros** (`Configuracion.tarifa_100m`, default $50), no por km. La migración `config/0003_tarifa_por_100_metros` divide la tarifa anterior por 10 para no cambiar lo que se cobraba.
- Se redondea **solo el importe** a pesos (`ROUND_HALF_UP`); la distancia nunca se redondea, para que 5,4 km no se convierta en 44 tramos.
- Retro en el precio: 0,1–1 km = $1.000; 1,1 km = $1.100; 1,3 km = $1.300.

### 5.2 No frenar pedidos por falta de stock

**Problema.** El sistema arrancaba con el inventario en 0 y bloqueaba pedidos al no encontrar stock. En la práctica frenaba la operación en el primer pedido del día, y la reacción de "cargar 999 de stock" era un número inventado que terminaba en desabastecimiento silencioso.

**Solución.** Decisión registrada el 28/09/2026 en `docs/plan-mejoras-pendientes.md` §Tanda 2:
- `descontar_stock()` **descuenta siempre**; el stock puede quedar en negativo.
- El aviso al operador se dispara **una sola vez por ingrediente** (los que ya estaban en negativo no se repiten), para no inundar la cola.
- Se agrega el movimiento tipo **"conteo"** (`inventario/views.py:116`): se escribe la cantidad real y el sistema guarda la diferencia como entrada o salida, con motivo `"Conteo: había X, se contaron Y"`.
- El inventario separa "bajo stock" de "sin contar" (≤ 0), porque requieren acciones distintas: comprar vs. contar.

### 5.3 Las recetas de los adicionales no descontaban stock

**Problema.** La versión anterior usaba un patrón polimórfico (`producto_tipo` + `producto_id`) y `descontar_stock()` solo miraba `producto_tipo='hamburger'`. Pedir "Crispy con panceta" consumía medallón, cheddar y pan, pero **no** panceta.

**Solución.** `Receta` pasó a dos FK reales (`hamburguesa` / `adicional`, ambos `null=True`), y `buscar_recetas_del_item()` (`calculos.py:75`) suma las recetas de la hamburguesa **y** de cada adicional. Además, el "Medallón extra" es un adicional más, con su propia receta, así que se cobra y se descuenta como cualquier otro.

### 5.4 Pegar un mensaje de WhatsApp y que el sistema lo entienda

**Problema.** Los pedidos llegan por WhatsApp con escritura informal: "1 pepi", "1 crispy doble sin cebolla", "retira", "cel 3624 555666", o copiado desde WhatsApp Web con el prefijo `[21:30, 27/9/2026] Agostina:`.

**Solución.** `app/pedidos/interpretar.py` (381 líneas) procesa el mensaje renglón por renglón:
- Normaliza a minúsculas y sin tildes (`unicodedata` + filtro de diacríticos).
- Tolerancia a errores con `difflib.SequenceMatcher` (ratio ≥ 0,8) más prefijo: "crispi" → Crispy, "tradicional" → Tradi.
- Reconoce cantidades en cifras y en palabras ("2", "dos", "x2") y "doble/triple" como medallones extra.
- Detecta teléfono, link de Maps, dirección escrita ("envío a Jujuy 87"), forma de pago, retiro/envío y el nombre del contacto de WhatsApp Web.
- **Lo que no entiende no se descarta**: va a Observaciones y se avisa en pantalla.
- **No guarda nada**: solo completa el formulario; siempre se revisa antes de crear el pedido.

### 5.5 Integrar mapas sin exponer la API key ni sin gastar de más

**Problema.** Leaflet desde CDN expone la clave de Geoapify en cada URL de mosaico, y los mosaicos salen de a uno y bloquean las conexiones del navegador.

**Solución.** `app/pedidos/mapas.py` mueve todo al backend:
- **Mosaicos proxied** (`/pedidos/mapas/mosaicos/<z>/<x>/<y>.png`): la clave nunca viaja al navegador. Se validan los rangos del tile y se recorta a un bounding box de Resistencia; además se exige `Sec-Fetch-Site: same-origin`.
- **Caché en dos niveles**: `mapas` (24 h, respuestas) y `mapas_control` (cuota y pausas), con `FileBasedCache` en disco.
- **Turnos y cuota**: `ESPACIO_ENTRE_CONSULTAS = 0,26 s` (menos de 5 req/s, el límite del plan gratuito) y un tope preventivo de 2.000 créditos/día por instalación. Frente a un HTTP 429 se pausa 5 minutos y se ofrece la distancia manual.
- **Semáforo de 8 trabajadores** (`BoundedSemaphore`) para que una búsqueda lenta no impida cargar pedidos ni apagar el sistema.
- **El cerrojo solo protege lo rápido** (caché, cuota, turno); la llamada de red queda **fuera** del cerrojo. Ponerla dentro hacía que cada pedacito del mapa esperara al anterior (~1 s) y el chequeo de estado no llegaba a tiempo.
- **Geometría validada** antes de devolverse al cliente: tipo `MultiLineString`, máximo 10.000 puntos y coordenadas finitas dentro de rango.
- **Geoapify devuelve metros**: 1.340 m se truncan a **1,3 km**, no 1,4. El cálculo del envío usa el recorrido real, no una distancia en línea recta.

### 5.6 Enviar la comanda a la cocina sin cambiar la costumbre del local

**Problema.** El local ya tenía su propio formato de comanda. Cualquier formato nuevo obligaría a la cocina a reaprender.

**Solución.** `app/pedidos/comanda.py` reproduce ese formato (`#12 - Agostina`, `1 Crispy + 1 medallón extra + Panceta`, `Nota: dip de alioli`, `RETIRA` / `ENVIO: dirección`). Además:
- El medallón extra se escribe **explícitamente** ("+ 1 medallón extra"), porque "doble" es ambiguo para hamburguesas que ya traen 2 o 3 medallones en su receta base.
- El link `wa.me` se arma con `quote()` en la vista, no en el template.

### 5.7 Instalar y actualizar en la PC del cliente sin perder pedidos

**Problema.** Un `git pull` que reemplaza la carpeta del programa se comería la base de datos, que estaba en `app/db.sqlite3`.

**Solución.** Doble separación en `settings.py`:
- `PRODUCCION = os.environ.get('ENTRE_BRASAS_PRODUCCION') == '1'`.
- En producción la base va a `%LOCALAPPDATA%\EntreBrasas\db.sqlite3` y los respaldos a `Documentos\Entre Brasas - Copias de seguridad` (30 últimas copias, una por arranque).
- `SECRET_KEY` se genera al azar la primera vez y se guarda **fuera** del programa.
- Con `DEBUG=False`, WhiteNoise sirve el CSS y los errores van a `errores.log` en vez de una pantalla con código.
- `instalar.bat` es idempotente: al re-ejecutarlo no vuelve a cargar los datos iniciales ni pisa lo que el cliente cambió.
- `iniciar.py` usa un **lock de archivo** (`msvcrt.locking`) para que un doble clic no levante dos servidores ni dos migraciones simultáneas, y un `threading.Event` para el apagado controlado desde la web (espera 1 s a que terminen las peticiones en vuelo).
- El apagado solo se acepta desde `127.0.0.1` o `::1`, y un middleware (`BloqueoDuranteApagadoMiddleware`) bloquea los cambios durante el cierre.

### 5.8 El historial de estados mostraba los estados en blanco

**Problema.** `HistorialEstado.estado_anterior` y `estado_nuevo` eran `CharField` sin `choices`, así que `get_estado_anterior_display()` no existía y la plantilla no tenía nada que mostrar.

**Solución.** La migración `pedidos/0002_historial_estado_choices` agrega `choices=Pedido.ESTADOS` (no cambia la base, solo el modelo). Los estados pasaron además a definirse en el modelo, junto con el mapa `SIGUIENTE_ESTADO`, para que la vista no tenga la lógica de la máquina de estados duplicada.

### 5.9 El pedido se recargaba al apretar F5

**Problema.** Patrón clásico de formularios Django: el POST creaba el pedido y, al refrescar, se enviaba de nuevo.

**Solución.** Redirección tras guardar (PRG) + un **borrador por pestaña** en `sessionStorage` (`static/js/borrador-pedido.js`): conserva cliente, unidades, extras, notas, paso y destino del mapa, y se limpia solo tras la creación confirmada o un descarte explícito — nunca al enviar un formulario que puede fallar. El borrador nunca se envía al servidor: no crea pedidos.

### 5.10 El precio de un pedido cambia al día siguiente

**Problema.** Si el precio de una hamburguesa se edita, los pedidos viejos mostrarían el precio nuevo, y los reportes historical quedarían mal.

**Solución.** `ItemPedido.precio_unitario` y `AdicionalDeItem.precio` son **copias congeladas** del precio del momento de la venta. Lo mismo para los datos del cliente: `Pedido` conserva `cliente_nombre`/`telefono`/`direccion` en texto, más la FK opcional a `Cliente` con `SET_NULL`. Editar un cliente no reescribe la historia.

### 5.11 Menú y cocina desincronizados

**Problema.** El `seed_data` cargaba un menú de prueba (BBQ, Clásica) que no era el real, y no había forma de actualizar precios sin romper los pedidos.

**Solución.** `seed_data` carga el **menú real** (sacado del sitio del local, septiembre 2026) y suma la opción `--reemplazar-menu`, que usa `update_or_create`: actualiza nombres, precios y descripciones, desactiva los productos anteriores y **no toca pedidos ni stock**. El comando normal (`get_or_create`) conserva lo que ya está cargado. Se documentó que un `git pull` por sí solo no actualiza el menú de la base.

### 5.12 Distinguir "falta stock" de "no lo conté"

**Problema.** Con el stock en 0 por diseño, la lista de faltantes no distinguía entre "hay que comprar" y "todavía no lo contamos".

**Solución.** `ingredientes_del_menu_activo()` filtra solo los insumos de productos activos, y la vista separa `faltantes` (bajo el mínimo, hay que comprar) de `sin_contar` (≤ 0, hay que contar). Los negativos se muestran en rojo.

### 5.13 Documentación que quedó vieja

**Problema.** `docs/base-de-datos.md` (11/09/2026) y `DATABASE_ESTRUCTURA.md` (17/09/2026) describen la estructura **anterior** a la unificación: `apps.config.SystemConfig` con `tarifa_km`, `Recipe` con `producto_tipo`/`producto_id`, `Hamburger.precio_base`, `Addon.productos`, y un motor "PostgreSQL (producción)".

**Solución / pendiente.** El código es la fuente de verdad. `docs/base-de-datos.md`, `DATABASE_ESTRUCTURA.md` y `docs/backend.md` **deben actualizarse**: hoy describen tablas y campos que ya no existen. Este documento (sección 6) es la referencia verificada.

---

## 6. Errores concretos del alcance 1.0.1 (transcripción de lo que NO es cierto)

Esta es la lista concreta de afirmaciones de la versión 1.0.1 que **no se corresponden con el código**. Cada una remite al archivo y línea del código que la desmiente.

### E-01 — Base de datos: PostgreSQL ❌ FALSO
> 1.0.1 §7.1: *"Base de datos | PostgreSQL"*

**Real:** SQLite 3. `app/entre_brasas/settings.py:114` fija `'ENGINE': 'django.db.backends.sqlite3'` de forma incondicional. No hay `DATABASE_URL`, no hay `psycopg2` en `requirements.txt` y no hay ninguna rama de PostgreSQL en el código. `docs/base-de-datos.md` lo admite: *"PostgreSQL nunca se usó en la práctica"*.

### E-02 — Fórmula de cálculo de envío ❌ FALSO
> 1.0.1 §4.7: *"Costo = Distancia (km) × Tarifa por km."*
> 1.0.1 §4.7: *"Distancia mínima | Si la distancia es menor a la distancia mínima configurada, no se cobra envío (costo = 0)."*
> 1.0.1 §4.7: *"Costo mínimo | Si el costo calculado es menor al costo mínimo configurado, se aplica el costo mínimo."*

**Real** (`app/pedidos/calculos.py:20-50`):
```
costo = costo_minimo_envio + max(0, distancia_km − distancia_minima) × 10 × tarifa_100m
```
La distancia mínima **no da envío gratis**: está cubierta por el costo mínimo, que se cobra siempre. El costo mínimo **no es un piso condicional**: es la base que se suma. Y la tarifa es **por 100 metros**, no por km.

### E-03 — Distancia solo por teclado ❌ INCOMPLETO
> 1.0.1 §2.2.3, §4.4, §6.1, §9.2: *"distancia ingresada por teclado en km"*

**Real:** hay geocodificación y cálculo de ruta por **Geoapify** (`app/pedidos/mapas.py`, 287 líneas), con mapa Leaflet, mosaicos servidos por el backend, caché, cuota diaria y fallback manual. La distancia por teclado sigue existiendo, pero ya no es el único camino.

### E-04 — Integración con WhatsApp excluida ❌ FALSO
> 1.0.1 §5: *"Integración con WhatsApp Business | Futura versión."*

**Real:** implementada en dos piezas — comanda a la cocina (`comanda.py` + `whatsapp_cocina`) e interpretación de mensajes (`interpretar.py`).

### E-05 — Sistema de costos excluido ❌ FALSO
> 1.0.1 §5: *"Sistema de costos y rentabilidad | Futura versión."*

**Real:** la app `costos` existe y es funcional (`app/costos/views.py`), aunque con partes del §4.11 sin implementar (ver E-10 y E-11).

### E-06 — Fórmula del margen de ganancia ❌ FALSO
> 1.0.1 §4.11: *"Margen de ganancia: ((Precio de Venta - Costo Total) / Costo Total) × 100"*

**Real** (`app/costos/views.py:55`): `margen = ganancia / precio * 100`, es decir, **margen sobre precio de venta**, no sobre costo. Con costo $5.000 y precio $10.000: la v1.0.1 da 100 %, el sistema da 50 %.

### E-07 — Ventas por día, comparaciones y gráficos ❌ NO IMPLEMENTADO
> 1.0.1 §4.10: *"Ventas por día"*, *"Comparaciones"*, y §4.10/§6.7 *"gráficos"*

**Real:** `app/reportes/views.py` calcula 4 totales, 2 conteos por método de pago y 2 rankings. **No hay** desglose diario, **no hay** comparación con el período anterior y **no hay** un solo gráfico: la pantalla `reportes_ventas.html` es íntegramente HTML de tablas.

### E-08 — "No se requiere diseño responsive" ❌ FALSO
> 1.0.1 §9.2: *"La aplicación se utiliza desde una computadora de escritorio en el local. No se requiere diseño responsive para dispositivos móviles."*

**Real:** `DESIGN.md` define un breakpoint de 760 px con navegación desplegable, tablas con desplazamiento accesible y el formulario de pedido reorganizado en pantallas bajas; `PRODUCT.md` incluye como principio *"Una tarea de escritorio también debe poder usarse en celular"*.

### E-09 — "Conexión a internet estable y permanente" ❌ FALSO como supuesto
> 1.0.1 §9.2: *"Se asume que el local cuenta con conexión a internet estable y permanente durante el horario de atención."*

**Real:** el sistema es 100 % local. Todo lo que importa (pedidos, stock, reportes, costos, comanda) funciona sin internet. Solo el **mapa** lo necesita, y ante fallo se ofrece el ingreso manual de kilómetros.

### E-10 — Tiempo de preparación por producto ❌ NO IMPLEMENTADO
> 1.0.1 §4.11: *"Se puede asignar un tiempo estimado de preparación por producto"*

**Real:** `MINUTOS_DE_PREPARACION = 10` es una **constante global** en `app/costos/views.py:21`, aplicada a todas las hamburguesas por igual. No hay campo para configurarlo por producto. Tampoco existe el "costo minuto" de mano de obra: solo `costo_hora_mano_obra`.

### E-11 — Reporte de rentabilidad ❌ NO IMPLEMENTADO
> 1.0.1 §4.11: *"Reporte de rentabilidad | Dashboard que muestra: productos más rentables, menos rentables, margen promedio del menú, rotación de productos vs. rentabilidad."*

**Real:** la pantalla `costos/ver_costos.html` es una sola tabla de hamburguesas activas. No hay ranking de rentabilidad, ni margen promedio, ni rotación, ni filtro por producto, ni desglose de costos por producto.

### E-12 — Costos de adicionales ❌ NO IMPLEMENTADO
> 1.0.1 §4.11 y §6.10 dan por hecho el cálculo para "hamburguesa/adicional".

**Real:** `costos/views.py:36` recorre `Hamburguesa.objects.filter(activa=True)`. Los adicionales **sí** tienen receta editable y **sí** descuentan stock, pero **no** aparecen en la pantalla de costos ni de rentabilidad.

### E-13 — Observación al cambiar de estado ❌ NO IMPLEMENTADO
> 1.0.1 §4.6: *"Cada cambio de estado se registra con fecha, hora y una observación opcional."*
> 1.0.1 §6.3: *"Permite cambiar el estado del pedido con un campo de observación opcional para registrar el motivo del cambio."*

**Real:** `HistorialEstado.observacion` se llena **solo al cancelar** (`views.py:457`). Al avanzar, `avanzar_pedido()` crea el historial sin observación (`views.py:414-418`) y **no existe ningún campo de observación en el formulario de avance**.

### E-14 — Regla de baja de ingredientes ❌ FALSO
> 1.0.1 §4.3: *"No se puede eliminar un ingrediente que tenga movimientos registrados (solo desactivar)."*

**Real:** la regla vigente es otra y más laxa — se permite desactivar aunque tenga movimientos, compras o consumos. Lo único que **bloquea** la baja es que el ingrediente esté en la receta de una hamburguesa **activa** o de un adicional **activo** (`app/inventario/views.py:215-222`).

### E-15 — Inventario muestra "todos los ingredientes" ❌ IMPRECISO
> 1.0.1 §4.3 / §4.8: *"Lista de todos los ingredientes"*

**Real:** la pantalla principal de inventario lista solo `ingredientes_del_menu_activo()` — los insumos de productos activos. Los demás siguen existiendo y se conservan para el historial; se ven en la pantalla de "Gestionar ingredientes".

### E-16 — Teléfono y dirección obligatorios siempre ❌ FALSO
> 1.0.1 §4.4: *"Datos del cliente | Campos obligatorios: nombre del cliente, teléfono, dirección."*

**Real:** teléfono y dirección son obligatorios **solo para envíos**. Para retiro en local alcanza el nombre (`app/pedidos/views.py:225-229`).

### E-17 — El pedido se crea y "aparece en la cola FIFO" ⚠️ IMPRECISO
> 1.0.1 §4.4 / §6.1: *"Al confirmar, el pedido se guarda con estado 'Pendiente' y aparece en la cola FIFO."*

**Real:** el pedido se guarda en `pendiente` (y efectivamente aparece en la cola), pero la redirección es a la **pantalla de detalle**, donde está la comanda lista para enviar a la cocina. Es una decisión deliberada del flujo actual.

### E-18 — "7 productos y 17 ingredientes" ❌ DESACTUALIZADO
> 1.0.1 §9.2: *"El menú cuenta con 7 productos y el inventario controla 17 ingredientes."*

**Real:** `app/menu/management/commands/seed_data.py` carga **8 hamburguesas** (Sagrada, Full, La Pepi, Crispy, Freskita, Baconera, Tradi, Cheese) y **18 ingredientes**. La cifra de la v1.0.1 corresponde a la versión anterior del proyecto.

### E-19 — Campos `precio_base` y `productos` ⚠️ NOMBRES CAMBIADOS
> 1.0.1 §4.1/§4.2: *"precio base"*, *"productos asociados"*

**Real:** `Hamburguesa.precio` y `Adicional.hamburguesas`. Funcionalmente equivalente; solo cambia el nombre del campo.

### E-20 — Receta polimórfica ⚠️ MODELO CAMBIADO
> 1.0.1 §4.11 (implícito): la receta se asocia a "cada hamburguesa/adicional".

**Real:** correcto en el comportamiento, pero el modelo ya no es `producto_tipo` + `producto_id`: son **dos ForeignKey** (`Receta.hamburguesa` / `Receta.adicional`, ambos `null=True`). `DATABASE_ESTRUCTURA.md` y `docs/base-de-datos.md` siguen documentando el modelo viejo.

### E-21 — Falta el manual de usuario ⚠️ REQUISITO DEL ALCANCE NO CUMPLIDO
> 1.0.1 §8: *"Documentación | Debe incluir manual de usuario básico."*

**Real:** hay README de **equipo** (9 secciones, con la guía de instalación en la PC del cliente) y `docs/` (backend, base de datos, plan de mejoras, mapa y envíos, idea de cierre del día). **No hay un manual de usuario final** orientado al dueño del local.

### E-22 — Reportes: importes por método de pago y por producto ⚠️ INCOMPLETO
> 1.0.1 §4.10: *"Ventas por método de pago | Total y cantidad de pedidos agrupados"* y *"Productos más vendidos | Ranking ... por cantidad vendida y total facturado"*

**Real:** solo se muestra la **cantidad** de pedidos por método de pago y la **cantidad** de unidades por producto. No se calcula el total facturado por producto ni por método de pago.

### E-23 — Historial de movimientos con filtros ❌ NO IMPLEMENTADO
> 1.0.1 §4.8: *"Historial de movimientos | Lista de todos los movimientos filtrados por ingrediente, tipo (entrada/salida) y rango de fechas."*

**Real:** **no existe ninguna pantalla de historial de movimientos.** Los movimientos se registran correctamente en la base (`MovimientoInventario`, con tipo, cantidad, motivo, precio unitario, fecha y pedido relacionado) y son auditables por ORM o por DB Browser, pero no hay vista en la interfaz web que los liste ni que permita filtrarlos. La sección 4.8 de la v1.0.1 ("Registrar entrada / Registrar salida") sí está; la de "Historial de movimientos" no.

### E-24 — Popup de devolución de stock ⚠️ IMPRECISO
> 1.0.1 §4.6/§4.8: *"el sistema muestra un popup preguntando al admin: '¿Desea devolver el stock al inventario?'"*

**Real:** la decisión se toma en el formulario de cancelación (`request.POST.get('devolver_stock') == 'si'`), no en un popup de JavaScript.

### E-25 — Technology stack incompleto ⚠️ INCOMPLETO
> 1.0.1 §7.1: *"Frontend: Django Templates | Backend: Python con Django | Hosting: Servidor Local"*

**Real:** falta **WhiteNoise** (estáticos con `DEBUG=False`), **Waitress** (WSGI de producción, puerto 8765), **Leaflet 1.9.4** y **Geoapify** (servicio externo), **Node.js** (para las 6 suites de pruebas JS) y **Manrope** (tipografía local).

---

## 7. Repositorio GitHub

| Dato | Valor |
|---|---|
| **URL** | `https://github.com/enzooz/Entre-Brasas.git` |
| **Clonación** | `git clone --branch master https://github.com/enzooz/Entre-Brasas.git` |
| **Rama principal** | `master` |
| **Flujo de trabajo** | Rama propia por desarrollador → Pull Request a `master`. **No se hace push directo a `master` ni push forzado.** |
| **Visibilidad** | Privado (el acceso al repo lo otorgan los responsables del equipo) |
| **Base de datos** | **No se versiona.** `*.sqlite3` está en `.gitignore`; lo que se comparte son las migraciones |
| **CI/CD** | **No hay** `.github/workflows/` ni pipeline automático. La verificación es manual: `manage.py check`, `makemigrations --check --dry-run`, `manage.py test` y `node --test` |
| **Ramas de trabajo** | Convención `codex/<descripcion>` (ej. `codex/mi-mejora`) |

### Migraciones incluidas (estructura de base compartida)

| App | Migraciones |
|---|---|
| `pedidos` | `0001_initial`, `0002_historial_estado_choices`, `0003_itempedido_nota`, `0004_cliente`, `0005_importar_clientes` |
| `menu` | `0001_initial`, `0002_adicional_es_medallon_extra` |
| `inventario` | `0001_initial` |
| `config` | `0001_initial`, `0002_configuracion_whatsapp_cocina`, `0003_tarifa_por_100_metros`, `0004_mapas_geoapify` |

### Comandos de gestión propios

| Comando | Qué hace |
|---|---|
| `manage.py seed_data` | Carga menú, ingredientes, recetas y configuración. Opciones `--si-esta-vacia` y `--reemplazar-menu` |
| `manage.py respaldar` | Copia de seguridad de la base (en producción, automática al arrancar) |

---

## 8. Resumen ejecutivo

| Dimensión | Alcance 1.0.1 (21/07/2026) | Real al 04/11/2026 (v1.2) |
|---|---|---|
| Base de datos | PostgreSQL | **SQLite 3** |
| Cálculo de envío | `km × tarifa_km`, con zona gratis | **mínimo + excedente × 10 × tarifa por 100 m** |
| Distancia | Solo por teclado | **Mapa Geoapify + manual** |
| WhatsApp | Excluido (futuro) | **Comanda + interpretación de mensajes** |
| Costos y rentabilidad | Excluido (futuro) | **Implementado (parcial)** |
| Ventas por día / comparaciones / gráficos | Requeridos | **No implementados** |
| Margen | Sobre costo | **Sobre precio de venta** |
| Tiempo de preparación | Configurable por producto | **Constante de 10 min** |
| Observación al cambiar estado | Requerida | **Solo al cancelar** |
| Baja de ingrediente | Bloqueada con movimientos | **Solo bloqueada por receta de producto activo** |
| Historial de movimientos en pantalla | Requerido | **No implementado** |
| Responsivo | "No se requiere" | **Implementado** |
| Internet | Supuesto estable y permanente | **Todo local; solo el mapa lo necesita** |
| Menú / ingredientes | 7 / 17 | **8 / 18** |
| Clientes | No existía | **Modelo `Cliente` + búsqueda** |
| Instalación | No especificada | **`instalar.bat` + icono de escritorio + respaldos** |
| Stack | 2 líneas | **Django 4.2 + whitenoise + waitress + Leaflet 1.9.4 + Geoapify + Node para tests** |

**Conclusión.** El documento 1.0.1 es un **contrato de alcance inicial** y sigue siendo útil como registro de las reglas de negocio originales (flujo de estados, FIFO, congelamiento de precios, eliminación lógica, exclusiones). Como **descripción del sistema** está desactualizado en 25 puntos. Esta versión 1.2 corrige esa brecha y fija el punto de partida para la siguiente entrega.

---

## 9. Actualizaciones respecto de la versión 1.0.1

Bitácora de lo que cambió en el alcance desde el 21/07/2026. Clasificación:
**🆕 Nuevo** (no estaba en el alcance) · **✏️ Modificado** (cambió la regla) · **⚠️ Parcial** (quedó a medias) · **❌ No implementado** (se pidió y no está).

### 9.1 Funcionalidades agregadas fuera del alcance original 🆕

| # | Funcionalidad | Módulo | Fecha aprox. |
|---|---|---|---|
| A-01 | Comanda a la cocina por WhatsApp (armado + link `wa.me` + copiar) | `pedidos/comanda.py` | 27/09/2026 |
| A-02 | Interpretación de mensajes de WhatsApp (completado automático del formulario) | `pedidos/interpretar.py` | 28/09/2026 |
| A-03 | Geocodificación y cálculo de ruta por mapa (Geoapify) | `pedidos/mapas.py` | sept. 2026 |
| A-04 | Mosaicos de mapa servidos por el backend (sin exponer la API key) + Leaflet local | `pedidos/mapas.py` | sept. 2026 |
| A-05 | Modelo de clientes guardados + búsqueda por nombre o teléfono | `pedidos/models.py` | Tanda 3 |
| A-06 | Notas por hamburguesa para la cocina (`ItemPedido.nota`) | `pedidos/models.py` | 27/09/2026 |
| A-07 | Medallón extra (Simple / Doble / Triple) como adicional de menú | `menu/models.py` | 27/09/2026 |
| A-08 | Movimiento de inventario tipo **conteo** físico con ajuste automático | `inventario/views.py` | 28/09/2026 |
| A-09 | Borrador de pedido por pestaña (sessionStorage) con 4 pasos | `static/js/borrador-pedido.js` | Tanda 1 |
| A-10 | Apagado del sistema desde la web con bloqueo de pestañas | `entre_brasas/views.py` | sept. 2026 |
| A-11 | Instalador Windows + icono de escritorio + respaldos automáticos | `instalar.bat` / `iniciar.py` | sept. 2026 |
| A-12 | Pantalla de inicio con resumen del día y accesos por tarea | `entre_brasas/views.py` | sept. 2026 |
| A-13 | Recetas de **adicionales** (antes solo de hamburguesas) | `inventario/models.py` | sept. 2026 |
| A-14 | Menú real del local cargable con `--reemplazar-menu` | `menu/management/commands/seed_data.py` | sept. 2026 |
| A-15 | Diseño responsive (navegación desplegable, tablas con scroll) | `DESIGN.md` / CSS | sept. 2026 |

### 9.2 Reglas de negocio modificadas ✏️

| # | Regla | Antes (1.0.1) | Ahora (1.2) | Archivo |
|---|---|---|---|---|
| M-01 | Fórmula de envío | `km × tarifa_km`, zona gratis bajo la distancia mínima | `mínimo + max(0, km − km_incluida) × 10 × tarifa_100m` | `pedidos/calculos.py:20` |
| M-02 | Unidad de la tarifa | Por kilómetro | **Por 100 metros** (`tarifa_100m`) | `config/models.py:20` |
| M-03 | Margen de ganancia | `(precio − costo) / costo` | `(precio − costo) / precio` | `costos/views.py:55` |
| M-04 | Faltante de stock | implied: frena o bloquea | **Nunca frena**; el stock puede quedar negativo y se avisa | `pedidos/calculos.py:104` |
| M-05 | Stock inicial | implied: cargado | **En 0**, con la pantalla "sin contar" para el inventario real | `menu/management/commands/seed_data.py:126` |
| M-06 | Baja de ingrediente | Bloqueada si tiene movimientos | **Solo** bloqueada si está en la receta de un producto activo | `inventario/views.py:215` |
| M-07 | Teléfono y dirección | Obligatorios siempre | **Solo para envíos**; para retiro alcanza el nombre | `pedidos/views.py:225` |
| M-08 | Destino tras crear el pedido | A la cola FIFO | Al **detalle**, donde está la comanda lista | `pedidos/views.py:88` |
| M-09 | Historial de estados | Con `choices` pendientes (mostraba en blanco) | **Resuelto** con la migración `0002` | `pedidos/migrations/0002` |
| M-10 | Motor de base | PostgreSQL | **SQLite** | `entre_brasas/settings.py:114` |
| M-11 | Lista del inventario | "Todos los ingredientes" | Solo los del **menú activo** | `inventario/models.py:18` |

### 9.3 Requisitos que quedaron a medias o sin hacer ⚠️ ❌

| # | Requisito | Estado | Observación |
|---|---|---|---|
| P-01 | Ventas por día (desglose diario) | ❌ | Sin agrupamiento por fecha |
| P-02 | Comparación con el período anterior | ❌ | No implementado |
| P-03 | Gráficos en Reportes | ❌ | Solo tablas HTML; sin librería de charts |
| P-04 | Total facturado por hamburguesa y por método de pago | ⚠️ | Solo cantidades, no importes |
| P-05 | Tiempo de preparación por producto | ❌ | Constante global de 10 min |
| P-06 | Costo por minuto de mano de obra | ❌ | Solo costo por hora |
| P-07 | Costos y rentabilidad de adicionales | ❌ | Solo hamburguesas |
| P-08 | Reporte de rentabilidad (ranking, margen promedio, rotación) | ❌ | Una sola tabla |
| P-09 | Historial de movimientos con filtros en pantalla | ❌ | No hay vista de listado |
| P-10 | Observación al cambiar de estado | ❌ | Solo se registra al cancelar |
| P-11 | Edición manual del precio de compra "con caja cerrada" | ❌ | Se actualiza solo con la entrada |
| P-12 | Manual de usuario final (dueño del local) | ❌ | Hay README de equipo, no manual de usuario |
| P-13 | Módulo "Cerrar el día" | ❌ | Solo existe como idea (`docs/ideas/cierre-del-dia.md`) |
| P-14 | Botón "Eliminar pedido" | ❓ | Decisión #3 del plan de mejoras, sin resolver |

### 9.4 Documentación del repo que quedó desactualizada ⚠️

| Documento | Fecha | Problema |
|---|---|---|
| `docs/base-de-datos.md` | 11/09/2026 | Describe `apps.config.SystemConfig`, `tarifa_km`, `Recipe.producto_tipo`, `Hamburger.precio_base` y "PostgreSQL" — nada de eso existe en el código actual |
| `DATABASE_ESTRUCTURA.md` | 17/09/2026 | Ídem: modelo de datos anterior a la unificación de `apps/` |
| `docs/backend.md` | — | Verificar contra el código actual |

**Acción pendiente:** actualizar esos tres documentos. Mientras tanto, **este documento (v1.2) y el código son la fuente de verdad**.

### 9.5 Próxima versión (v1.3) — candidatas

1. Implementar los puntos P-01 a P-11 del §9.3.
2. Actualizar `docs/base-de-datos.md`, `DATABASE_ESTRUCTURA.md` y `docs/backend.md` (§9.4).
3. Levantar un **CI en GitHub Actions** con `manage.py check`, `makemigrations --check`, `manage.py test` y `node --test` — hoy la verificación es 100 % manual.
4. Medir el requisito de rendimiento (< 3 s) con una prueba de carga: hay 30 pedidos/día previstos y 1.000/mes.
5. Cifrar la API key de Geoapify en la base (hoy queda en claro en la SQLite y en sus respaldos).

---

*Documento generado el 04/11/2026 a partir del código del repositorio `Enzooz/Entre-Brasas`. Toda afirmación del capítulo 6 remite a un archivo y línea del código.*
