## 7. Herramientas de pruebas y análisis

En esta sección se recopilan herramientas, frameworks y guías para realizar pruebas de seguridad, pentesting, carga/rendimiento y conformidad aplicables al proyecto "Turno Enlace" (Expo + React Native + Firebase).

### Resumen

- Objetivo: establecer un catálogo de herramientas y procesos para evaluar la seguridad y el rendimiento de la aplicación móvil y sus servicios asociados.
- Alcance: pruebas de seguridad (DAST/SAST), análisis de apps móviles, pruebas de carga/estrés, y verificación de requisitos regulatorios (GDPR / HIPAA) donde aplique.

---

### Guías y marcos de referencia

- OWASP Mobile Application Security Verification Standard (MASVS)
  - Qué: estándar para validar el nivel de seguridad de una aplicación móvil. Cubre arquitectura, almacenamiento seguro, comunicaciones, criptografía, autenticación y autorización.
  - Uso práctico: basarse en MASVS para crear una checklist de auditoría de seguridad móvil. Priorizar los controles del nivel M1 (requisitos básicos) y M2 (recomendados para aplicaciones sensibles).

- OWASP Top Ten / OWASP ASVS
  - Para APIs y backend; útil cuando se prueban endpoints consumidos por la app.

---

### Herramientas para pruebas de penetración (DAST / pentesting)

- OWASP ZAP
  - Libre y scriptable. Ideal para integrar escaneos automáticos en pipelines contra entornos staging.
  - Para esta app: crear un conjunto de requests autenticados y pasar un spider + active scan contra los endpoints REST/Cloud Functions.

- Burp Suite
  - Suite profesional (y community). Excelente para pentesting manual, manipulación de tráfico y pruebas avanzadas.
  - Recomendado para auditorías profundas realizadas por especialistas.

- MobSF (Mobile Security Framework)
  - Análisis estático y dinámico de binarios APK/IPA. Permite detectar malas prácticas, certificados, permisos y vulnerabilidades específicas móviles.
  - Útil para analizar builds de Android / iOS generados por EAS.

---

### Pruebas de carga y rendimiento

- k6
  - Moderno, scriptable en JavaScript, fácil de integrar en pipelines CI. Ideal para pruebas de carga de APIs y medir latencia/errores bajo carga.
  - Recomendado para simular tráfico desde múltiples ubicaciones hacia APIs que nutren la app.

- Apache JMeter
  - Herramienta madura para pruebas de rendimiento; más pesada que k6 pero con más plugins y GUI.

- Recomendación práctica:
  - Empezar con k6 (scripts JS) en CI para definir SLOs (latencia p95/p99, error rate) y hacer pruebas de carga nocturnas o previo a lanzamiento.

---

### Pruebas de conformidad (GDPR / HIPAA)

- GDPR
  - Enfocarse en: minimización de datos, consentimiento explícito, derecho al borrado, protección de datos en tránsito/repouso y procesos para requests de datos.
  - Herramientas: no hay una herramienta única; combinar auditorías de configuración (Firebase rules, storage access), revisión de logs, registros de consent y políticas de retención.

- HIPAA (si aplica)
  - Requisitos: controles administrativos, técnicos y físicos; acuerdos BAA con proveedores (ej. verificar si Firebase cumple para tu caso de uso y qué servicios están permitidos).
  - Realizar auditorías y pruebas de seguridad periódicas, documentación de accesos y cifrado de datos sensibles.

- Recomendación: documentar claramente en el repo (o `docs/compliance/`) el alcance, datos sensibles almacenados y medidas de mitigación (encryption, access controls, retention policies).

---

### Flujos de pruebas sugeridos para este repo

1. Pre‑merge (PR)
   - Ejecutar SAST (CodeQL / Semgrep) y linters.
   - Ejecutar pruebas unitarias (Jest) y tests de integración rápidos.

2. Post‑merge → staging
   - Generar build EAS y ejecutar MobSF para análisis del binario.
   - Ejecutar DAST con OWASP ZAP contra staging (autenticado si aplica).
   - Ejecutar pruebas de smoke y scripts k6 básicos de carga.

3. Auditoría periódica (mensual/trimestral)
   - Pentest manual (Burp Suite) a cargo de un especialista o equipo interno.
   - Revisión de MASVS checklist y cobertura de controles.

---


