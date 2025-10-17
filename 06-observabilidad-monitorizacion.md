## 6. Observabilidad y monitorización

Esta sección describe prácticas y herramientas para recoger métricas, logs y trazas en el proyecto "Turno Enlace" (Expo + React Native + Firebase). Incluye opciones para instrumentación, almacenamiento, visualización, alertas y recomendaciones prácticas adaptadas al stack.

### Objetivos

- Obtener visibilidad sobre comportamiento de la aplicación (errores, rendimiento, disponibilidad).
- Correlacionar logs, métricas y trazas para acelerar el diagnóstico de problemas.
- Configurar alertas accionables para detección temprana de anomalías.
- Mantener un coste razonable y privacidad de datos (PII).

---

### Conceptos clave

- Métricas: series temporales numéricas (latencia, uso CPU, requests/s, crash rate).
- Logs: registros textuales estructurados con contexto (request id, usuario, nivel, mensaje, metadata).
- Trazas (tracing): seguimientos distribuidos de solicitudes que atraviesan varios servicios (span/trace IDs).
- Observability pipeline: instrumentación → collector/agent → backend de almacenamiento (Prometheus, Elasticsearch, APM) → visualización/alertas (Grafana, Kibana).

---

### Herramientas y stack recomendado (alto nivel)

- Prometheus + Grafana
  - Prometheus para métricas (pull model) y Grafana para dashboards y alertas. Excelente para métricas de infraestructura y servicios backend.

- ELK (Elasticsearch, Logstash/Beats, Kibana)
  - ELK para indexación y búsqueda de logs; Kibana para visualización. Alternativa: OpenSearch.

- OpenTelemetry
  - Estándar y set de SDKs/collector para instrumentar métricas, logs y trazas. Permite enviar datos a múltiples backends (Prometheus, Jaeger, Elasticsearch, Grafana Cloud).

- APM/Crash Reporting para móvil
  - Firebase Crashlytics / Firebase Performance (integrado con Firebase) o Sentry Mobile para errores/crashes y rendimiento en dispositivos.

---

### Cómo aplicarlo al stack Turno Enlace

1) Instrumentación del backend (si existe)
   - Servicios basados en funciones o servidores (por ejemplo APIs que la app consume o funciones en Firebase) deben exponer métricas Prometheus o usar OpenTelemetry SDKs.
   - Instrumentar métricas clave: request_count, request_duration_seconds (histogram), error_count, active_users (cuando aplique), firestore_read/write latency.
   - Añadir un endpoint /metrics protegido (para Prometheus) o enviar métricas vía OTLP al Collector.

2) Instrumentación del cliente móvil
   - Errores y crashes: integrar Firebase Crashlytics o Sentry (ambos tienen SDK para React Native / Expo). Esto proporciona stack traces, device context y tasas de crash.
   - Rendimiento y traces RUM básico: Firebase Performance o Sentry RUM para medir start time, screen load, network spans.
   - Logs estructurados: ajustar `src/libs/http.ts` y servicios para registrar logs estructurados (JSON) con request id y trace id cuando estén disponibles.

3) Trazas distribuidas con OpenTelemetry
   - Para correlación: propagar headers de tracing (traceparent / tracestate) desde el cliente a backend. Si usas funciones o APIs, instrumentarlas con OpenTelemetry JS/Go/Python según corresponda.
   - Usar un OpenTelemetry Collector para recibir OTLP y exportar a Jaeger/Elasticsearch/Prometheus/Grafana.

4) Centralizar logs
   - En lugar de dispersar `console.log`, enviar logs importantes a un sistema central: Elasticsearch (ELK), Cloud Logging (GCP), or Grafana Loki.
   - Estructura recomendada para un log JSON:
     - timestamp, level, message, service, env, request_id, trace_id, user_id (si aplica), meta

---

### Alertas y paneles (qué monitorizar y ejemplos)

- Alertas críticas (ejemplos):
  - Crash rate > X% en 15m (crash-free users).
  - Error rate API > Y% durante 5m.
  - Latencia P99 API > Z ms.
  - Spike in 5xx errors (sospecha de regresión o degradación).
  - Backlog de mensajes / cola pendiente > umbral.

- Alertas operativas adicionales:
  - Fallos de despliegue o builds fallidos (CI/CD).
  - Uso anómalo de recursos (CPU/Memory) en servicios críticos.

- Dashboards sugeridos:
  - App Overview: usuarios activos, crash rate, env (staging/prod), versión app.
  - API Health: requests/s, latencia median/p95/p99, error rate por endpoint.
  - Tracing: traces distribuidos por endpoint, spans lentos, waterfall view.
  - Logs explorer: búsqueda por request_id / trace_id y nivel, con filtros por versión y dispositivo.

---

### Arquitectura de referencia (pipeline)

Client (Expo RN) → Inyecta trace headers → Backend (API/Firebase functions) → OTEL Collector → Exportadores:

- Métricas → Prometheus → Grafana
- Traces → Jaeger / Tempo / Grafana traces
- Logs → Elasticsearch / Loki → Kibana / Grafana

El Collector puede correr como servicio en la nube (k8s / VM) o usar un servicio gestionado (Grafana Cloud, Honeycomb, Elastic Cloud).

---

### Buenas prácticas de instrumentación

- Añadir identificadores correlables: request_id y trace_id en todas las entradas (logs, métricas, traces).
- No loggear PII: anonimizar o eliminar datos sensibles antes de enviar logs a terceros.
- Muestreo de trazas: usar sampling adaptativo (por error, por porcentaje) para controlar costes.
- Retención y compresión: configurar retention apropiada en Elasticsearch o Grafana Loki para balance coste/valor.

---

### Opciones gestionadas vs self‑hosted

- Managed (recomendado para equipos pequeños): Grafana Cloud, Elastic Cloud, Sentry, Datadog. Menos mantenimiento operativo.
- Self‑hosted: Prometheus + Grafana + ELK + OTEL Collector. Mayor control y coste operativo.

---

### Configuración de alertas prácticas (ejemplos)

- Grafana Alert (P99 latency):
  - Query: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
  - Condición: P99 > 1000ms durante 5m → Alert severity: high

- Error rate:
  - Query: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
  - Condición: > 0.01 (1%) durante 5m → Pager / Slack

---

### Recomendaciones rápidas para este repo

1. Integrar un SDK de crash reporting en la app:
   - Firebase Crashlytics (si prefieres mantener todo en Firebase) o Sentry (más features de trazado y releases).

2. Mejorar logs y trazabilidad local:
   - En `src/libs/http.ts` añadir middleware para inyectar `request_id` y `traceparent` en las peticiones salientes y capturar respuestas.

3. Instrumentar cualquier backend o funciones con OpenTelemetry y exponer métricas.

4. Desplegar un OpenTelemetry Collector (gestionado o en infra propia) para exportar a los backends elegidos.

5. Crear dashboards mínimos en Grafana: App Overview + API Health + Traces.

6. Configurar alertas iniciales en Grafana/Kibana y conectar a Slack/Email/PagerDuty.

---



### Recursos y lecturas

- OpenTelemetry: https://opentelemetry.io
- Prometheus: https://prometheus.io
- Grafana: https://grafana.com
- Elasticsearch / Kibana: https://www.elastic.co
- Grafana Loki (logs de texto compatibles con Grafana): https://grafana.com/oss/loki/
- Sentry (mobile + tracing): https://sentry.io
- Firebase Crashlytics & Performance: https://firebase.google.com/docs/crashlytics

---
