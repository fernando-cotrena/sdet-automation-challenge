# SDET Technical Challenge – Automation Suite

[![Automated Tests Suite](https://github.com/fernando-cotrena/sdet-automation-challenge/actions/workflows/tests.yml/badge.svg)](https://github.com/fernando-cotrena/sdet-automation-challenge/actions/workflows/tests.yml)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Cypress](https://img.shields.io/badge/Framework-Cypress-17202C.svg)](https://www.cypress.io/)
[![Zod](https://img.shields.io/badge/Schema-Zod-3E67B1.svg)](https://zod.dev/)

Suite de automatización de pruebas end-to-end (API & Web UI) desarrollada en **TypeScript** y **Cypress**, cubriendo:

1. **Parte 1 — API Testing:** Ciclo de vida completo de mascotas y escenarios negativos en **Swagger Petstore** (`/pet`) con validación estricta de contratos con **Zod** y aislamiento total de datos.
2. **Parte 2 — Web Automation:** Flujos de negocio críticos de **Buggy Cars Rating** implementados bajo el patrón **Page Object Model (POM)** combinado con **Fluent Interfaces**, sin esperas fijas y con usuarios dinámicos.
3. **Parte 3 — CI/CD & Reportes:** Pipeline automatizado en **GitHub Actions**, linter, formateador y reportes unificados con **Mochawesome** (capturas de pantalla y evidencias automáticas ante fallos).
4. **Bonus:** Reporte formal de defectos identificados ([`BUGS.md`](./BUGS.md)) y propuesta de estrategia de pruebas extendida.

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- **Node.js:** Versión 18.x o 20.x (LTS recomendado).
- **npm:** Versión 9+ incluida con Node.js.

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/fernando-cotrena/sdet-automation-challenge.git
cd sdet-automation-challenge
npm install
```

### 2. Scripts de Ejecución Disponibles

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta la suite completa (API y UI) en modo headless |
| `npm run test:api` | Ejecuta exclusivamente la suite de API (Swagger Petstore) |
| `npm run test:ui` | Ejecuta exclusivamente la suite de Web UI (Buggy Cars) |
| `npm run cy:open` | Abre el Cypress Test Runner interactivo |
| `npm run lint` | Ejecuta el análisis estático de código con ESLint |
| `npm run format:check` | Verifica que el código cumpla con el formato de Prettier |
| `npm run report` | Consolida y genera el reporte HTML unificado de Mochawesome |

---

## 🏛️ Arquitectura del Proyecto y Patrones de Diseño

El framework implementa una arquitectura modular con separación clara de responsabilidades:

```text
sdet-automation-challenge/
│
├── .github/workflows/
│   └── tests.yml                 # Pipeline CI/CD en GitHub Actions
│
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   └── pets/
│   │   │       ├── pet-lifecycle.cy.ts   # Ciclo de vida: Alta, Consulta, Modificación, Baja, 404
│   │   │       └── pet-negative.cy.ts    # Casos negativos: IDs inexistentes, tipos inválidos
│   │   │
│   │   └── ui/
│   │       ├── authentication/
│   │       │   ├── registration.cy.ts    # Registro de usuarios dinámicos
│   │       │   ├── login.cy.ts           # Login exitoso, credenciales inválidas y campos vacíos
│   │       │   └── logout.cy.ts          # Cierre de sesión y retorno a estado anónimo
│   │       └── voting/
│   │           └── voting.cy.ts          # Flujo de negocio: Votación con comentario y verificación
│   │
│   ├── factories/                        # Generación dinámica de datos con Faker.js
│   │   ├── PetFactory.ts                 # IDs únicos por timestamp para entorno compartido
│   │   └── UserFactory.ts                # Usuarios conformes a complejidad de contraseñas
│   │
│   ├── pages/                            # Page Object Model + Fluent Interfaces
│   │   └── buggy-cars/
│   │       ├── BasePage.ts               # Elementos comunes, navegación, login y asserts de sesión
│   │       ├── HomePage.ts               # Acceso a modelos y secciones
│   │       ├── RegistrationPage.ts       # Formulario y validación de alertas
│   │       └── ModelPage.ts              # Votación, contador numérico y tabla de comentarios
│   │
│   ├── schemas/                          # Validación de contratos y schemas
│   │   └── pet/
│   │       └── PetSchema.ts              # Schemas Zod para respuestas exitosas y de error
│   │
│   ├── services/                         # Capa cliente de API (cy.request)
│   │   └── pet/
│   │       └── PetService.ts             # Métodos reutilizables para el endpoint /pet
│   │
│   └── support/
│       ├── commands.ts                   # Custom commands (ej. loginWithSession)
│       ├── e2e.ts                        # Hooks globales y manejo de excepciones no capturadas
│       └── index.d.ts                    # Declaraciones de tipos TypeScript
│
├── reports/                              # Reportes consolidados HTML y JSON (Mochawesome)
├── BUGS.md                               # Reporte detallado de defectos encontrados
├── cypress.config.ts                     # Configuración de entornos, baseUrl y timeouts
├── package.json                          # Scripts y dependencias
└── tsconfig.json                         # Compilación estricta y path aliases
```

### ¿Por qué Page Object Model combinado con Fluent Interfaces?

1. **Abstracción del DOM:** Los tests describen la intención del negocio (`homePage.login().expectLoggedIn()`) en lugar de selectores y detalles técnicos de implementación.
2. **Alta legibilidad y fluidez:** El encadenamiento de métodos mediante `this` permite una sintaxis declarativa y fluida que se lee como un caso de prueba en lenguaje natural:
   ```typescript
   registrationPage
     .fillForm(newUser)
     .submit()
     .expectSuccessMessage();
   ```
3. **Mantenibilidad:** Si un selector o flujo de la interfaz cambia, solo se modifica el Page Object correspondiente sin alterar los tests.

---

## ⚖️ Decisiones Técnicas y Trade-Offs

| Decisión | Justificación | Trade-off asumido |
|---|---|---|
| **Cypress como framework unificado (API & UI)** | Evita fragmentar el repositorio en múltiples herramientas (ej. Playwright para UI y Supertest/Jest para API). Permite un único runner, configuración compartida, mismo pipeline de CI y reportes consolidados. | Cypress corre en el contexto del navegador, lo que impone ciertas restricciones al manejar múltiples pestañas simultáneas (aunque no es necesario para este caso de uso). |
| **Zod para validación de contratos** | Sintaxis declarativa en TypeScript, inferencia automática de tipos (`z.infer`), validación profunda en runtime con mensajes de error explícitos. | Es una dependencia adicional frente a validar propiedades manualmente con assertions simples de Chai, pero otorga robustez de contrato de grado producción. |
| **Generación dinámica con Faker + Timestamps** | Petstore y Buggy Cars son entornos públicos compartidos. Generar IDs con `Date.now() + random` y usuarios únicos por ejecución garantiza que los tests no colisionen ni dependan de estados previos. | Se debe implementar un hook `afterEach` estricto en los tests de API para limpiar la información creada y no saturar el servicio compartido. |
| **Aislamiento sin esperas fijas (`cy.wait(fijo)`)** | Se eliminaron por completo las esperas arbitrarias (`cy.wait(5000)`). Cypress espera naturalmente por estado (`should('be.visible')`, `should('have.class')`) o por respuesta HTTP, acelerando la suite y eliminando flakiness. | Requiere que los selectores y aserciones estén bien diseñados observando cambios de estado reales en el DOM. |
| **`cy.session` para pruebas no enfocadas en auth** | Cuando el objetivo del test no es validar el formulario de login (ej. test de votación), se utiliza `cy.session` para reutilizar el estado de sesión y acelerar la ejecución. | Requiere configurar una función de validación de sesión para recrear cookies/localStorage si expiran. |

---

## 🔍 Hallazgos y Discrepancias en Swagger Petstore API

Durante la implementación de la suite de API se detectaron divergencias entre la especificación OpenAPI de Swagger y la implementación en vivo:
1. **Códigos de error en payloads malformados:** La especificación declara `405 (Invalid input)` para peticiones `POST /pet` con tipos erróneos. Sin embargo, en el servidor público v2, deserializaciones inválidas suelen arrojar `400` o `500` (deserialización Java). El test contempla este comportamiento y valida que la petición sea rechazada correctamente sin forzar un estado arbitrario.
2. **IDs no numéricos:** La documentación indica `400 (Invalid ID supplied)`, mientras que la capa de enrutamiento puede responder `404` ante fallos de coincidencia de ruta al castear el parámetro a `int64`. El test negativo documenta este hallazgo y valida el rechazo del request.

---

## 🧪 Estrategia de Pruebas para Buggy Cars Rating

Si contáramos con un ciclo de desarrollo extendido para Buggy Cars Rating, la estrategia de aseguramiento de calidad se estructuraría según la pirámide de testing:

### 1. Nivel API / Contrato (Mayor retorno de inversión)
- **Autenticación y Sesiones:** Pruebas directas contra los endpoints de autenticación (`/oauth/token` o endpoints REST de login) para verificar caducidad de tokens JWT, refresh tokens e invalidación en logout.
- **Concurrencia e Idempotencia:** Ejecución de pruebas de carrera (race conditions) sobre el endpoint de votos para certificar que un usuario no pueda registrar votos duplicados concurrentemente (ver hallazgo [BUG-003 en BUGS.md](./BUGS.md)).
- **Validación de Límites y Schemas:** Pruebas negativas en API enviando valores de borde en campos de perfil (edad negativa, cadenas extremadamente largas, caracteres especiales).

### 2. Nivel Web UI (E2E)
- **Cross-Browser & Responsive:** Ejecutar la suite en Firefox, WebKit (Safari) y Chrome en diferentes viewports (Desktop vs Mobile) mediante la matriz de ejecución de GitHub Actions.
- **Flujos de Ordenamiento y Paginación:** Cobertura de las tablas de modelos y marcas verificando que los criterios de ordenamiento (por rango, por votos, por modelo) se preserven entre páginas.

### 3. Nivel Performance & Seguridad
- **Pruebas de Carga (k6 / Artillery):** Pruebas de estrés sobre los endpoints de ranking durante eventos simulados de alta votación.
- **Pruebas de Inyección (DAST):** Escaneo con OWASP ZAP para prevenir inyecciones XSS en los campos de comentarios y perfiles.

### 4. ¿Qué dejaríamos fuera de la automatización E2E?
- **Validaciones cosméticas pixel-perfect:** No automatizar por código las posiciones exactas de píxeles o degradados de color (delegar a herramientas de Visual Regression como Percy o Applitools si fuera requerido).
- **Animaciones CSS o transiciones menores:** No ralentizar los pipelines validando la duración exacta de efectos visuales.

---

## 🔮 Qué agregarías o cambiarías con más tiempo

1. **Visual Testing Integrado:** Agregar pruebas de regresión visual automatizadas con Percy o Cypress Image Snapshot para detectar roturas accidentales de maquetación en Buggy Cars.
2. **Mocks y Stubs con `cy.intercept`:** Implementar tests adicionales con interceptores para simular respuestas lentas, caídas del servidor (`500 Internal Server Error`) o microservicios no disponibles.
3. **Colección Postman / Newman:** Generar la colección ejecutable de Swagger Petstore para correrla también vía CLI con Newman o integrarla en pre-commit hooks.
4. **Matriz de múltiples navegadores en CI:** Configurar el pipeline para correr en paralelo tanto en Electron como en Chrome y Firefox.

---

## 👥 Autor
- **Fernando Cotrena** – *SDET Automation Challenge*
- Repositorio: [github.com/fernando-cotrena/sdet-automation-challenge](https://github.com/fernando-cotrena/sdet-automation-challenge)
