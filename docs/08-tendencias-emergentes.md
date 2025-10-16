## 8. Tendencias emergentes: infraestructura inmutable, entornos efímeros, aprendizaje continuo y ética en CI/CD

Esta sección explora prácticas y conceptos emergentes que pueden elevar la resiliencia, seguridad y gobernanza del ciclo de vida de software en el proyecto "Turno Enlace" (Expo + React Native + Firebase).

### Resumen rápido

- Infraestructura inmutable: evitar cambios ad‑hoc sobre instancias en producción; desplegar nuevas unidades inmutables y descartar las antiguas.
- Entornos efímeros (EaaS — Environments as a Service): crear entornos on‑demand para PRs/testing, con vida corta y coste controlado.
- Aprendizaje continuo: usar datos de producción y pipelines automatizados para mejorar pruebas, detección de anomalías y priorización de fallos.
- Ética en CI/CD: gobernanza, privacidad, sesgos en IA, y control humano sobre decisiones automatizadas.

---

### Infraestructura inmutable (por qué y cómo)

- Qué: cada despliegue crea nuevas instancias/artefactos, evitando parcheos en caliente. Si algo falla, se hace rollback a la versión anterior reemplazando instancias.
- Beneficios: reproducibilidad, rollback trivial, menor drift de configuración y mejor seguridad.
- En el contexto de este proyecto:
  - Para APIs/servicios: usar contenedores inmutables (Docker) y despliegue mediante EAS-hosted services, Cloud Run o Kubernetes con imágenes versionadas.
  - Para infra servidorless (Firebase Functions): cada deploy es inmutable por diseño; mantener versionado y tagging de releases.

---

### Entornos efímeros (EaaS) — PR Previews y sandboxes

- Concepto: crear entornos temporales (frontend + backend mínimo) por PR para pruebas manuales, E2E y DAST.
- Implementación práctica:
  - Para la app móvil: usar release channels / preview builds en EAS para cada PR (o distribuir a testers). También se pueden generar APK/IPA temporales y subirlos a servicios de distribución interna.
  - Para el backend: crear recursos efímeros con Terraform (prefixed per-branch) o usar infra compartida con namespacing y feature flags para aislar cambios.
  - Automatizar la creación y destrucción tras merge/cierre del PR para evitar costes.

---

### Aprendizaje continuo aplicado a CI/CD

- Objetivo: usar telemetría y resultados de CI para afinar tests, priorizar fallos y reducir flakiness.
- Ideas prácticas:
  - Test selection: ejecutar primero tests relacionados con archivos cambiados (test impact analysis) — acelera feedback.
  - Flaky detection: rastrear historial de jobs para identificar tests no deterministas y aislarlos.
  - Modelos ML/heurísticos para priorizar findings de SAST/DAST y reducir ruido en alertas.
  - Re‑entrenamiento: usar data de producción (errores recurrentes, traces) para generar nuevos casos de pruebas automatizados.

---

### Ética y gobernanza en CI/CD

- Temas clave:
  - Transparencia: registrar decisiones automatizadas (por ejemplo, IA que auto‑aprueba PRs o aplica fixes).
  - Revisión humana: prevenir despliegues automáticos para cambios sensibles sin aprobación manual.
  - Privacidad: evitar que datos de usuarios (PII) sean usados en ambientes de test; usar datos sintéticos o anonimización.
  - Sesgos en IA: auditar modelos que prioricen vulnerabilidades o generen tests para asegurar que no amplifiquen sesgos.

---

### Ejemplos prácticos aplicables al repo

1. PR Previews automatizados
   - Configurar GitHub Actions para generar EAS preview builds y un backend temporal mínimo (emulado o namespaced) por PR. Publicar enlace y artefactos en el PR.

2. Cleanup automático
   - Ejecutar Terraform destroy o scripts de limpieza cuando un PR se cierra para evitar recursos huérfanos.

3. Test selection y retrain
   - Integrar una etapa que ejecute sólo tests afectados por los cambios y una job nocturna que ejecute la suite completa; usar resultados para priorizar qué tests se deben reescribir.

4. Politicas de aprobación humana
   - Definir reglas en la pipeline: cambios de infra o seguridad requieren 2 revisores y no pueden auto‑mergearse.

---

### Riesgos y mitigaciones

- Coste de entornos efímeros: mitigar con límites de tiempo, escalado automático y reuso de infra ligera.
- Complejidad operativa: documentar y automatizar (scripts, plantillas Terraform, módulos compartidos).
- Dependencia de IA: mantener logs y trazabilidad de decisiones automáticas; exigir revisión humana para cambios críticos.

---

