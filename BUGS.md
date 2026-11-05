# Bug Report – Buggy Cars Rating

Este documento consolida los defectos y anomalías funcionales identificadas en la aplicación bajo prueba ([Buggy Cars Rating](https://buggy.justtestit.org)).

---

### Resumen de Defectos Reportados

| ID | Título | Severidad | Prioridad | Estado |
|---|---|---|---|---|
| **BUG-001** | La sección de comentarios en el detalle de modelo permite inyección de HTML/Scripts no sanitizados (Stored XSS) | **High** | High | Abierto |
| **BUG-002** | El campo "Age" en la edición de perfil acepta valores negativos, decimales y caracteres especiales | **Medium** | Medium | Abierto |
| **BUG-003** | Falta de control de idempotencia al votar un modelo permite duplicación de votos bajo condiciones de carrera | **High** | High | Abierto |
| **BUG-004** | La tabla de "Overall Rating" no persiste el ordenamiento seleccionado al cambiar de página en la paginación | **Low** | Low | Abierto |

---

## Detalle de Hallazgos

### BUG-001: Inyección de HTML / Scripts no sanitizados en comentarios de votación

- **Severidad:** High (Seguridad / Integridad de datos)
- **Componente:** `Model Page -> Comment Section (/model/:id)`
- **Precondiciones:** Usuario registrado con sesión activa.

**Pasos para reproducir:**
1. Iniciar sesión en el portal.
2. Navegar a un modelo de auto (por ejemplo, desde el bloque "Popular Model" o el catálogo).
3. En el campo de texto `Your Comment` ingresar un payload HTML o de script, por ejemplo:
   ```html
   <b>Test Bold Comment</b><script>console.log("XSS");</script>
   ```
4. Presionar el botón `Vote!`.
5. Inspeccionar la tabla inferior de comentarios y recargar la página.

**Resultado Esperado:**
El texto del comentario debe ser escapado o sanitizado antes de persistirse en base de datos y renderizarse en el DOM (mostrando el payload como texto plano legible).

**Resultado Obtenido:**
El navegador interpreta y renderiza etiquetas HTML directamente en el cuerpo de la tabla, exponiendo la aplicación a ataques de tipo Cross-Site Scripting (XSS almacenado).

---

### BUG-002: El campo "Age" en perfil de usuario acepta valores negativos y no enteros

- **Severidad:** Medium (Validación de datos)
- **Componente:** `User Profile (/profile)`
- **Precondiciones:** Usuario con sesión iniciada.

**Pasos para reproducir:**
1. Iniciar sesión en Buggy Cars Rating.
2. Hacer clic en `Profile` en la barra de navegación superior.
3. En el campo `Age`, ingresar un valor no numérico o fuera del dominio lógico: `-25` o `999999` o `abc`.
4. Completar los campos obligatorios requeridos y hacer clic en `Save`.

**Resultado Esperado:**
La aplicación debe bloquear la entrada mediante validación HTML5 (`type="number"` con atributos `min="1"` y `max="120"` o regex de enteros positivos) y la API debe retornar un error `400 Bad Request` ante entradas inválidas.

**Resultado Obtenido:**
El campo permite guardar valores negativos (ej. `-25`), persistiendo datos incoherentes en el perfil del usuario sin advertencia visual ni rechazo por parte del servidor.

---

### BUG-003: Falta de idempotencia / control de concurrencia al enviar votos

- **Severidad:** High (Regla de negocio)
- **Componente:** `Model Page -> Voting API / UI (/model/:id)`
- **Precondiciones:** Usuario autenticado que aún no ha votado por el modelo seleccionado.

**Pasos para reproducir:**
1. Navegar a un modelo de auto en el que el usuario no haya emitido voto previamente.
2. Ingresar un comentario de prueba.
3. Deshabilitar temporalmente la latencia de red (o enviar dos peticiones concurrentes rápidas mediante doble clic inmediato o request simultáneo).
4. Observar el contador global de votos del auto.

**Resultado Esperado:**
La regla de negocio estipula que cada usuario puede emitir un único voto por auto. El botón `Vote!` debe deshabilitarse inmediatamente en el primer clic, y el backend debe responder con `409 Conflict` o rechazar cualquier voto subsiguiente del mismo usuario para ese modelo.

**Resultado Obtenido:**
En condiciones de doble clic rápido o concurrencia, el contador de votos se incrementa en más de 1 unidad y se registran múltiples entradas en la tabla de comentarios para el mismo usuario.

---

### BUG-004: La tabla "Overall Rating" pierde el ordenamiento de columnas al paginar

- **Severidad:** Low (Usabilidad / UI)
- **Componente:** `Overall Rating Table (/overall)`
- **Precondiciones:** Ninguna (accesible de forma pública).

**Pasos para reproducir:**
1. Hacer clic en la tarjeta `Overall Rating` desde la página de inicio.
2. En la tabla de resultados, hacer clic en la columna `Rank` o `Votes` para ordenar de forma ascendente o descendente.
3. Navegar a la página 2 utilizando los controles de paginación inferiores (`»` o número `2`).

**Resultado Esperado:**
El criterio de ordenamiento seleccionado por el usuario debe persistirse al cambiar de página (`state preservation` o query param `?sort=votes&dir=desc&page=2`).

**Resultado Obtenido:**
Al cambiar de página, la tabla reinicia el criterio de ordenamiento al estado por defecto, obligando al usuario a volver a ordenar los datos en cada página navegada.
