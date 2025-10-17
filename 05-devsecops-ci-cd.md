# 5. DevSecOps y CI/CD Modernos

Esta sección resume las prácticas clave de **DevSecOps** y **CI/CD modernas** aplicadas al proyecto **Turno Enlace** (Expo + React Native + TypeScript + Firebase).  
El objetivo es integrar seguridad, calidad y automatización en todo el ciclo de vida, desde el desarrollo hasta la producción.

---

## Objetivo y Alcance

- **Meta principal:** aplicar un enfoque *shift-left* para detectar y corregir problemas de seguridad y calidad en etapas tempranas.  
- **Stack tecnológico:** React Native (Expo), TypeScript, Firebase (Auth/Firestore), Jest, EAS.  
- **Resultados esperados:** pipelines automatizados que incluyan análisis estático (SAST), auditoría de dependencias (SCA), pruebas unitarias, builds y despliegues seguros con control progresivo.

---

## Contrato Operativo

| **Elemento** | **Descripción** |
|---------------|----------------|
| **Inputs** | PR o push a ramas principales, código TypeScript/JS, configuraciones (secrets), definiciones de infraestructura (Terraform). |
| **Outputs** | Artefactos firmados (.aab/.ipa), reportes SAST/SCA/DAST, resultados de pruebas, despliegues a staging/production. |
| **Criterios de éxito** | PRs deben pasar lint + tests; vulnerabilidades críticas bloquean merge; reportes SAST sin issues críticos; despliegues automatizados y controlados. |

---

## Integración Shift-Left: Seguridad en Cada Etapa

### SAST (Static Application Security Testing)
- **Propósito:** detectar vulnerabilidades en el código fuente (inyecciones, credenciales, APIs inseguras).  
- **Herramientas:** ESLint + plugins de seguridad, TypeScript strict, Semgrep, CodeQL, SonarCloud.  
- **Ejecución:** en pre-commit (local), PRs y análisis nocturnos.  
- **Meta:** cero vulnerabilidades críticas sin justificación.

### SCA (Software Composition Analysis)
- **Propósito:** identificar vulnerabilidades y licencias en dependencias NPM/Yarn.  
- **Herramientas:** Dependabot, Renovate, Snyk, npm audit.  
- **Ejecución:** revisión rápida en PRs y escaneo completo diario.  
- **Meta:** mantener dependencias seguras y actualizadas automáticamente.

### DAST (Dynamic Application Security Testing)
- **Propósito:** probar la app desplegada y sus endpoints en condiciones reales.  
- **Herramientas:** OWASP ZAP (automático), Burp Suite (manual), MobSF (binarios móviles), Postman/Newman (API tests).  
- **Ejecución:** tras cada despliegue a *staging*.  
- **Meta:** bloquear la promoción a producción si se detectan findings críticos.

---

## Infraestructura como Código (IaC) y GitOps

- **Concepto:** la infraestructura se versiona en Git y se actualiza automáticamente con herramientas declarativas.  
- **Recomendaciones:**  
  - **Terraform**: gestionar recursos GCP/Firebase con *state remoto*.  
  - **ArgoCD / Flux**: aplicar GitOps en Kubernetes para APIs o microservicios.  
  - **Aplicación móvil:** gestionar canales OTA (EAS) y versiones con *feature flags* para lanzamientos controlados.

---

## Estrategias de Entrega Progresiva

| **Estrategia** | **Aplicación** | **Herramientas / Recomendaciones** |
|----------------|----------------|------------------------------------|
| **Blue-Green** | Backend o APIs | Despliegues paralelos con rollback inmediato. |
| **Canary** | Nuevas versiones graduales | Istio/Envoy + Flagger. |
| **Feature Flags** | Funcionalidades móviles | Firebase Remote Config, LaunchDarkly, Unleash. |
| **OTA / Release Channels** | App móvil | Expo Updates (staging/production), TestFlight y Play Store phased rollout. |

---

## Pipeline CI/CD Recomendado

1. **Pull Request / Push**
   - Lint (ESLint + TypeScript strict)
   - Pruebas unitarias (Jest)
   - SAST rápido (Semgrep/CodeQL)
   - SCA rápido (npm audit/Snyk)

2. **Integración (Merge → Main)**
   - Build (EAS o simulador)
   - Tests E2E (opcional)
   - SAST + SCA completos
   - Artefactos: `.aab`, `.ipa`, bundles EAS

3. **Despliegue a Staging**
   - Infraestructura (Terraform apply)
   - Deploy app (EAS staging)
   - DAST (OWASP ZAP) + smoke tests

4. **Release Progresivo**
   - Rollout canario o blue-green
   - Activación controlada con *feature flags*

5. **Post-Despliegue**
   - Monitoreo (Sentry, Crashlytics)
   - Alertas y métricas de rendimiento
   - Observabilidad continua (logs, traces)

**CI/CD Tools:** GitHub Actions (integrado con CodeQL y Dependabot), GitLab CI, Bitrise, CircleCI, EAS + Fastlane para builds móviles.

---

##  Integración de IA en el Pipeline

- **Selección inteligente de pruebas:** priorizar tests según cambios detectados.  
- **Generación de casos de prueba:** asistencia con IA (Copilot, GPT) para ampliar cobertura.  
- **Identificación de tests inestables:** análisis histórico de CI.  
- **Clasificación automática de findings:** ML para priorizar vulnerabilidades reales.  
- **Auto-fix sugerido:** correcciones automáticas de lint o formato (con revisión humana).

> ⚠️ La IA **asiste**, no reemplaza la revisión de seguridad ni la aprobación humana.

---



##  Recursos Clave

- 🔗 [OWASP – Shift-Left Security](https://owasp.org)  
- 🔗 [Semgrep](https://semgrep.dev)  
- 🔗 [GitHub CodeQL](https://securitylab.github.com/tools/codeql)  
- 🔗 [OWASP ZAP](https://www.zaproxy.org)  
- 🔗 [Expo EAS Documentation](https://docs.expo.dev/eas/)  
- 🔗 [Terraform Registry – Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)  

---
