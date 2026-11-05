# SDET Technical Challenge – Project Plan

## 1. Objetivo

Desarrollar una suite de pruebas automatizadas utilizando TypeScript y Cypress, cubriendo:

- API Testing: ciclo de vida de mascotas mediante Swagger Petstore.
- Web Automation: flujos funcionales de Buggy Cars Rating.
- CI/CD: ejecución automatizada, reportes y evidencias.
- Documentación: decisiones técnicas, hallazgos y estrategia de pruebas.

El objetivo es priorizar mantenibilidad, independencia de los tests, reutilización y claridad del código.

## 2. Stack tecnológico

| Tecnología | Uso |
|---|---|
| TypeScript | Lenguaje principal |
| Cypress | Framework de automatización API y UI |
| Zod | Validación de contratos y schemas |
| Node.js | Runtime |
| Faker.js | Generación de datos dinámicos |
| Mochawesome | Reportes de ejecución |
| ESLint | Análisis estático |
| Prettier | Formateo |
| GitHub Actions | CI/CD |

**Decisión principal:** utilizar Cypress como único framework de automatización. Para API se utilizará `cy.request()` y para UI los comandos nativos de Cypress.

Esto evita mantener dos frameworks, dos configuraciones y diferentes mecanismos de ejecución.

## 3. Arquitectura

Se propone una arquitectura modular con separación de responsabilidades.

### API Testing

- **Services:** comunicación con los endpoints.
- **Schemas:** validación de contratos mediante Zod.
- **Factories:** generación de datos de prueba.
- **Tests:** escenarios y validaciones funcionales.

### UI Testing

- **Pages:** representación de páginas y componentes.
- **Actions:** operaciones de negocio reutilizables.
- **Commands:** comandos personalizados de Cypress.
- **Factories:** generación de usuarios y datos.
- **Tests:** escenarios funcionales.

### Principio de diseño

Los tests deben describir el comportamiento del negocio, no los detalles de implementación.

Se utilizará Page Object Model combinado con Fluent Interfaces para lograr una API de automatización expresiva y legible.

## 4. Fluent Interfaces

Se buscará que las operaciones puedan encadenarse naturalmente.

Ejemplo conceptual:

```typescript
buggyCars
  .visit()
  .register(user)
  .login(user)
  .voteForCar(car)
  .withComment(comment)
  .submitVote()
  .shouldHaveVoted();
```

Los métodos de negocio devolverán `this` cuando corresponda, o el siguiente Page Object cuando exista una transición de página.

No se implementarán cadenas artificiales que dificulten el debugging.

## 5. Estructura propuesta

```text
sdet-technical-challenge/
│
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── pets/
│   │   │   │   ├── pet-lifecycle.cy.ts
│   │   │   │   └── pet-negative.cy.ts
│   │   │
│   │   └── ui/
│   │       ├── authentication/
│   │       │   ├── registration.cy.ts
│   │       │   ├── login.cy.ts
│   │       │   └── logout.cy.ts
│   │       └── voting/
│   │           └── voting.cy.ts
│   │
│   ├── pages/
│   │   └── buggy-cars/
│   │       ├── LoginPage.ts
│   │       ├── RegistrationPage.ts
│   │       ├── HomePage.ts
│   │       └── ModelPage.ts
│   │
│   ├── services/
│   │   └── pet/
│   │       └── PetService.ts
│   │
│   ├── schemas/
│   │   └── pet/
│   │       └── PetSchema.ts
│   │
│   ├── factories/
│   │   ├── PetFactory.ts
│   │   └── UserFactory.ts
│   │
│   ├── support/
│   │   ├── commands/
│   │   ├── actions/
│   │   ├── e2e.ts
│   │   └── index.d.ts
│   │
│   └── fixtures/
│
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── reports/
│
├── screenshots/
│
├── videos/
│
├── BUGS.md
├── README.md
├── PROJECT_PLAN.md
├── cypress.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .gitignore
└── package.json
```

La estructura podrá ajustarse durante el desarrollo si aparece una necesidad concreta.

## 6. Convenciones de implementación

### Tests

- Cada test debe ser independiente.
- No depender del orden de ejecución.
- Utilizar datos dinámicos.
- Evitar lógica de negocio dentro de los tests.
- Validar tanto status codes como contenido.
- Evitar esperas fijas.
- Limpiar los datos creados cuando corresponda.

### API

- Centralizar endpoints y comunicación en Services.
- Validar respuestas con Zod.
- Generar IDs únicos.
- Implementar limpieza mediante hooks `afterEach` o mecanismos equivalentes.
- Documentar discrepancias entre Swagger y el comportamiento real.

### UI

- Utilizar Page Objects.
- Preferir selectores estables.
- Encapsular operaciones de negocio.
- Reutilizar autenticación cuando no sea el objetivo del test.
- Utilizar `cy.session()` cuando corresponda.
- Evitar dependencias entre usuarios, sesiones y votos.

### Datos

- Faker para usuarios y datos dinámicos.
- Factories para centralizar la generación.
- Configuración sensible fuera del repositorio.
- Variables de entorno para URLs y credenciales.

## 7. Scripts esperados

```bash
npm run test:api
npm run test:ui
npm test

npm run lint
npm run format
npm run report
```

## 8. CI/CD

GitHub Actions ejecutará:

1. Checkout del repositorio.
2. Instalación de dependencias.
3. Configuración del entorno.
4. Ejecución de API Testing.
5. Ejecución de UI Testing.
6. Generación de reportes.
7. Publicación de artifacts.
8. Conservación de capturas y videos ante fallos.

Las suites deberán poder ejecutarse por separado y también en conjunto.

## 9. Estrategia de calidad

Se priorizará:

- Cobertura de escenarios críticos.
- Validación de contratos.
- Casos negativos.
- Independencia y aislamiento.
- Manejo de errores.
- Evidencias reproducibles.
- Identificación y documentación de bugs.

No se buscará maximizar la cantidad de tests, sino demostrar criterio de ingeniería y capacidad de diseñar una solución mantenible.

## 10. Roadmap

- [ ] Inicializar proyecto y dependencias.
- [ ] Configurar TypeScript, Cypress y linting.
- [ ] Implementar infraestructura API.
- [ ] Implementar ciclo de vida de mascotas.
- [ ] Implementar casos negativos.
- [ ] Implementar Page Objects y Fluent Interfaces.
- [ ] Automatizar registro y autenticación.
- [ ] Automatizar votación y comentarios.
- [ ] Identificar y documentar bugs.
- [ ] Configurar reportes.
- [ ] Implementar GitHub Actions.
- [ ] Completar README.
- [ ] Ejecutar suite completa y validar entrega.

---

**Principio rector:** código simple, reutilizable y explicable. Cada abstracción debe resolver un problema real y justificar su existencia.
