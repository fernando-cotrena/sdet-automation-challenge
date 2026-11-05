Challenge Técnico SDET
Sobre el challenge
Queremos ver cómo diseñás una suite de pruebas automatizadas de punta a punta: API, UI, datos de
prueba y ejecución en CI. No buscamos cantidad de tests, sino criterio, código mantenible y decisiones
justificadas.
• Plazo: 7 días corridos desde que lo recibís.
• Dedicación estimada: 6 a 8 horas. Si no llegás con todo, priorizá y contanos en el README qué
dejaste afuera y por qué.
• Lenguaje: JavaScript o TypeScript (TypeScript suma).
• Uso de IA: está permitido. En la siguiente instancia vamos a trabajar en vivo sobre tu entrega,
así que tenés que poder explicar y modificar cada parte.
• Formato: un único repositorio Git que contenga las partes 1, 2 y 3.
Parte 1 — API Testing
API: Swagger Petstore (recurso /pet). Basate solo en la documentación publicada.
Automatizá en código (Cypress cy.request, Playwright request, Supertest o la herramienta que elijas)
el ciclo de vida de una mascota:
1. Alta: crear una mascota con datos generados dinámicamente.
2. Consulta: obtenerla por id y validar que los datos coinciden con los enviados.
3. Modificación: actualizar su estado (por ejemplo, de available a sold) y verificar el cambio.
4. Baja: eliminarla y comprobar que ya no existe (la consulta posterior debe devolver 404).
Casos negativos (mínimo 3), por ejemplo:
• Consultar o eliminar un id inexistente.
• Enviar un payload inválido o con tipos incorrectos.
• Usar un id con formato inválido.
Si la API responde distinto a lo que dice la documentación, no fuerces el test para que pase: dejalo
documentado como hallazgo.
Requisitos técnicos:
• Validación de contrato/schema de las respuestas (por ejemplo con JSON Schema o Zod).
• Validación de status code y de los campos relevantes, no solo del status.
• Datos aislados: Petstore es un entorno público y compartido. Generá ids únicos, que los tests no
dependan entre sí y limpiá lo que crees aunque un test falle.
• Configuración (baseUrl, etc.) fuera del código de los tests.
Opcional: colección de Postman equivalente, ejecutable con Newman.

Parte 2 — Web Automation (Cypress)
Sitio: Buggy Cars Rating
Automatizá estos flujos:
1. Registro de usuario: cada ejecución tiene que generar su propio usuario. No uses usuarios
creados a mano.
2. Login exitoso con el usuario recién creado, validando que la sesión quedó iniciada.
3. Login fallido: credenciales inválidas y campos vacíos, validando el mensaje que muestra la app.
4. Flujo de negocio: con la sesión iniciada, votar un modelo de auto dejando un comentario y
verificar que el voto y el comentario se registraron.
5. Logout.
Requisitos técnicos:
• Patrón de diseño: Page Object Model, App Actions u otro que prefieras, siempre que lo
justifiques en el README.
• Selectores: estables y resistentes a cambios de estilo. Si el sitio no tiene buenos atributos,
explicá cómo lo resolviste.
• Sin esperas fijas (cy.wait(5000) y similares). Esperá por estado o por requests.
• Reutilización: custom commands o helpers para login y datos de prueba. Si el login por UI no es
lo que se está probando, podés hacerlo por API o con cy.session.
• Independencia: cada test tiene que poder correr solo y en cualquier orden.
• Configuración por entorno (baseUrl, credenciales y variables fuera del código).
Parte 3 — Ejecución, CI y documentación
• Repositorio Git público (GitHub, GitLab o Bitbucket) con commits que muestren cómo fuiste
avanzando. Un único commit final resta.
• Pipeline de CI (GitHub Actions, GitLab CI o similar) que instale dependencias y corra las suites de
API y de UI en cada push.
• Reporte de ejecución (Mochawesome, Allure o el que elijas) publicado como artifact del
pipeline, con capturas o videos de los tests que fallen.
• Scripts separados para correr cada suite por su lado y todo junto (por ejemplo npm run
test:api, npm run test:ui, npm test).
• Linter/formatter configurado.
• README con:
o Cómo instalar y correr todo localmente.
o Estructura del proyecto y patrón elegido, con el porqué.
o Decisiones técnicas y trade-offs.
o Qué agregarías o cambiarías con más tiempo.

Bonus (opcional)
• Reporte de bugs: el sitio Buggy Cars tiene errores a propósito. Sumá un BUGS.md con los que
encuentres: título, pasos para reproducir, resultado esperado y obtenido, y severidad.
Valoramos más 3 bugs bien reportados que 15 mal descriptos.
• Estrategia de pruebas: media página sobre qué más probarías en Buggy Cars y en qué nivel (API,
UI, contrato, performance), y qué dejarías fuera de la automatización.
• Ejecución en paralelo o en más de un navegador dentro del pipeline.
Entrega
Respondé al mail con el link al repositorio dentro del plazo. Verificá que el repo sea público y que el
último pipeline haya corrido. Si te surge una duda sobre la consigna, escribinos; si preferís no esperar la
respuesta, tomá una decisión y dejala anotada en el README.
