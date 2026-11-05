# Bug Report – Buggy Cars Rating

Este documento consolida los defectos y anomalías funcionales identificadas en la aplicación bajo prueba ([Buggy Cars Rating](https://buggy.justtestit.org)).

---

### Resumen de Defectos Reportados

| ID | Título | Severidad | Prioridad | Pantalla / Componente |
|---|---|---|---|---|
| **BUG-001** | Desbordamiento en la paginación de la tabla Overall Rating permite avanzar más allá del total de páginas | **Medium** | High | `/overall` |
| **BUG-002** | Enlace roto / URL mal formada en el icono social de Twitter en el pie de página | **Low** | Low | `/overall` (Footer) |
| **BUG-003** | Parpadeo (*flickering*) de los campos de login en el header durante la recarga de página con sesión activa | **Medium** | Medium | Header / Global |
| **BUG-004** | Falta de validación de tipos de datos en la edición de perfil de usuario (edad y género) | **High** | High | `/profile` |

---

## Detalle de Hallazgos

### BUG-001: Desbordamiento en la paginación de la tabla Overall Rating

- **Severidad:** Medium (Usabilidad / Lógica de paginación)
- **Prioridad:** High
- **Componente:** `Overall Rating (/overall)`
- **Precondiciones:** Ninguna (accesible públicamente).

**Pasos para reproducir:**
1. Navegar a la pantalla de calificación general haciendo clic en `Overall Rating` desde la página principal (`https://buggy.justtestit.org/overall`).
2. Desplazarse al control de paginación ubicado en la parte inferior de la tabla de autos.
3. Observar el indicador de página actual (por ejemplo: `« page 1 of 5 »`).
4. Hacer clic repetidamente en el botón de avance de página (`»`).

**Resultado Esperado:**
El botón de avance (`»`) debe quedar deshabilitado (`disabled`) al alcanzar la última página disponible (`page 5 of 5`), impidiendo avanzar a páginas inexistentes.

**Resultado Obtenido:**
El control permite continuar avanzando indefinidamente (por ejemplo: `page 14 of 5`), mostrando la tabla vacía sin registros y rompiendo la coherencia del estado de paginación.

---

### BUG-002: Enlace roto / URL mal formada en el icono de Twitter del pie de página

- **Severidad:** Low (Navegación / UI)
- **Prioridad:** Low
- **Componente:** `Footer (Global / /overall)`
- **Precondiciones:** Ninguna.

**Pasos para reproducir:**
1. Acceder a la pantalla `Overall Rating` (`/overall`).
2. Dirigirse al pie de página donde se visualiza el texto `© 2016 Buggy Software, Inc.` y los accesos a redes sociales.
3. Hacer clic o inspeccionar el enlace asociado al icono de Twitter / X.

**Resultado Esperado:**
El icono debe contener un enlace válido con protocolo completo (ej. `https://twitter.com/buggycars`) o abrir en una nueva pestaña el perfil oficial correspondiente.

**Resultado Obtenido:**
La URL asociada está rota o mal escrita (enlace relativo incorrecto o recurso inexistente), generando un error de navegación (404 Not Found) al intentar acceder.

---

### BUG-003: Parpadeo (*flickering*) de los campos de login en el header durante la recarga con sesión iniciada

- **Severidad:** Medium (Experiencia de Usuario / Gestión de Estado)
- **Prioridad:** Medium
- **Componente:** `Header Navbar (Global)`
- **Precondiciones:** Usuario autenticado con sesión activa (`Hi, {firstName}`).

**Pasos para reproducir:**
1. Iniciar sesión exitosamente en la aplicación con cualquier usuario válido.
2. Constatar que el header muestra el saludo del usuario (`Hi, {firstName}`) y el enlace de `Logout`.
3. Recargar la página (F5 o Ctrl+R) o navegar entre diferentes secciones de la aplicación.
4. Observar atentamente la esquina superior derecha del header durante los primeros 1 a 3 segundos de carga.

**Resultado Esperado:**
El estado de autenticación (guardado en almacenamiento local o cookies de sesión) debe resolverse antes del primer render visual, o bien mostrar un *placeholder/skeleton* neutro para evitar parpadeos de interfaz.

**Resultado Obtenido:**
Durante los primeros segundos tras recargar, la aplicación renderiza transitoriamente los campos de texto `Login`, `Password` y el botón `Login`, antes de reemplazarlos abruptamente por el saludo del usuario autenticado, provocando *flickering* visual y confusión sobre el estado real de la sesión.

---

### BUG-004: Falta de validación de tipos de datos en la edición de perfil (`/profile`)

- **Severidad:** High (Integridad de datos / Validación)
- **Prioridad:** High
- **Componente:** `Profile Page (/profile)`
- **Precondiciones:** Usuario con sesión iniciada.

**Pasos para reproducir:**
1. Iniciar sesión y hacer clic en `Profile` en la barra de navegación.
2. Localizar el formulario con los datos personales del usuario.
3. En el campo `Age` (Edad), ingresar caracteres alfabéticos o símbolos (por ejemplo: `veinticinco` o `abc`).
4. En el campo `Gender` (Género), el cual debería ser un selector controlado (radio/dropdown) con valores tipados, ingresar texto arbitrario sin formato.
5. Hacer clic en el botón `Save`.

**Resultado Esperado:**
- El campo `Age` debe restringir la entrada exclusivamente a números enteros positivos mediante validación HTML5 (`type="number"`, `min="18"`) y validación en API (`400 Bad Request`).
- El campo `Gender` debe ser un tipo enumerado cerrado (`Male`, `Female`, `Other`) o validar estrictamente el valor recibido.
- La aplicación debe mostrar un mensaje de error descriptivo indicando qué campos contienen valores no válidos.

**Resultado Obtenido:**
El formulario permite guardar letras en el campo de edad y texto libre en el campo de género, persistiendo datos inconsistentes en la base de datos sin ningún tipo de advertencia ni validación por parte del servidor.
