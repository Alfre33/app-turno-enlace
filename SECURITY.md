# Documentación de Seguridad - Turno Enlace

## Principios de Seguridad Aplicados

### 1. Autenticación Segura
- **Firebase Authentication**: Implementamos Firebase Auth para manejo seguro de credenciales de usuario
- **Validación de correo electrónico**: Sistema de verificación de email integrado
- **Gestión de sesiones**: Control automático de estado de autenticación con persistencia segura

### 2. Comunicaciones Seguras
- **HTTPS obligatorio**: Todas las comunicaciones con APIs externas utilizan protocolos seguros
- **API Keys protegidas**: Uso de variables de entorno para claves sensibles
- **Validación de API Keys**: Verificación de formato y validez antes del uso

### 3. Almacenamiento Seguro Local
- **Expo SecureStore**: Implementación de almacenamiento cifrado para datos sensibles
- **Cifrado nativo**: 
  - iOS: Keychain Services (kSecClassGenericPassword)
  - Android: SharedPreferences cifradas con Android Keystore
- **Gestión de tokens**: Almacenamiento seguro de flags de sesión y preferencias

### 4. Validación de Datos
- **Sanitización de entradas**: Validación de formato de correo electrónico y contraseñas
- **Validación de respuestas de API**: Verificación de estructura de datos recibidos
- **Manejo de errores**: Mapeo seguro de códigos de error sin exposición de información sensible

## Amenazas Identificadas y Mitigación

### 1. Fuga de Credenciales de API
- **Riesgo**: Exposición de API keys en el código fuente
- **Mitigación**: 
  - Variables de entorno (`.env`) 
  - Configuración en `app.config.ts` con acceso a `process.env`
  - Validación de formato de API keys antes del uso

### 2. Intercepción de Datos de Sesión
- **Riesgo**: Acceso no autorizado a tokens de autenticación
- **Mitigación**: 
  - Uso de SecureStore para almacenamiento cifrado
  - Flags de "recordar sesión" almacenados de forma segura
  - Limpieza automática de datos al cerrar sesión

### 3. Ataques de Fuerza Bruta
- **Riesgo**: Intentos masivos de acceso con credenciales
- **Mitigación**: 
  - Firebase Auth incluye protección automática contra fuerza bruta
  - Manejo específico del error `auth/too-many-requests`
  - Mensajes de error genéricos para no revelar información del sistema

### 4. Inyección de Datos Maliciosos
- **Riesgo**: Manipulación de datos de entrada
- **Mitigación**: 
  - Codificación URI para parámetros de consulta (`encodeURIComponent`)
  - Validación estricta de formatos de datos
  - Uso de bibliotecas de validación (Zod) para esquemas de datos

### 5. Exposición de Información Sensible
- **Riesgo**: Filtración de configuraciones o datos internos
- **Mitigación**: 
  - Mapeo de errores de Firebase a mensajes genéricos
  - Ocultación de detalles técnicos en mensajes de error
  - Separación de configuración sensible del código fuente

### 6. Vulnerabilidades de Red
- **Riesgo**: Intercepción o manipulación de comunicaciones
- **Mitigación**: 
  - Uso exclusivo de HTTPS para todas las API calls
  - Timeouts configurados para prevenir ataques de denegación
  - Verificación de respuestas HTTP antes del procesamiento

## Lineamientos de Seguridad para el Equipo

### 1. Gestión de Credenciales
- **NUNCA** subir archivos `.env` al repositorio
- Colocar el archivo `.env` en `.gitignore` siempre
- Crear un archivo `.env.example` con las llaves pero con valores vacios
- Rotar API keys periódicamente
- Usar diferentes claves para desarrollo, pruebas y producción

### 2. Manejo de Variables de Entorno
- Prefijo `EXPO_PUBLIC_` solo para variables que pueden ser públicas
- Variables sensibles sin prefijo público
- Validar existencia de variables críticas en tiempo de ejecución
- Documentar todas las variables requeridas

### 3. Código Seguro
- Validar todas las entradas de usuario
- Usar bibliotecas de validación establecidas (Zod, Yup)
- Implementar timeouts en todas las llamadas de red
- Manejo explícito de errores sin exponer información interna

### 4. Autenticación
- No almacenar contraseñas en texto plano jamás
- Usar siempre los flujos oficiales de Firebase Auth
- Implementar verificación de email cuando sea posible
- Limpiar sesiones al cerrar la aplicación

### 5. Almacenamiento Local
- Usar SecureStore EXCLUSIVAMENTE para datos sensibles
- AsyncStorage solo para preferencias no críticas
- Limpiar datos locales al hacer logout
- Verificar disponibilidad de SecureStore antes del uso

### 6. Comunicaciones de Red
- Validar certificados SSL/TLS
- Implementar retry logic con backoff exponencial
- Logs de red solo en desarrollo, nunca en producción
- Validar estructura de respuestas antes del uso

### 7. Control de Acceso
- Implementar guards de navegación basados en estado de autenticación
- Verificar permisos en cada pantalla protegida
- Limpiar estado de navegación al hacer logout
- Usar context providers para estado global de autenticación

### 8. Desarrollo Seguro
- Code reviews obligatorios para cambios de seguridad
- Pruebas de penetración básicas antes de releases
- Actualización regular de dependencias
- Monitoreo de vulnerabilidades conocidas en librerías usadas

### 9. Configuración de Producción
- Deshabilitar logs de debug en builds de producción
- Configurar políticas de seguridad de red apropiadas
- Implementar certificate pinning si es necesario
- Configurar timeouts apropiados para cada endpoint

### 10. Respuesta a Incidentes
- Plan de rotación de credenciales comprometidas
- Procedimiento de revocación de sesiones activas
- Logs de seguridad para auditoría
- Contactos de emergencia para reportes de seguridad

## Cumplimiento Normativo

### GDPR (Reglamento General de Protección de Datos - UE)

#### Principios Implementados:
1. **Licitud, lealtad y transparencia**
   - ✅ Política de privacidad clara y accesible
   - ✅ Consentimiento explícito al registrarse (checkbox de términos)
   - ✅ Información sobre uso de datos disponible

2. **Limitación de la finalidad**
   - ✅ Datos recopilados solo para gestión de citas y autenticación
   - ✅ No se comparten datos con terceros (excepto proveedores de servicio)

3. **Minimización de datos**
   - ✅ Solo se solicitan: email, nombre, contraseña
   - ✅ Datos de citas y categorías bajo control del usuario

4. **Exactitud**
   - ✅ Usuario puede actualizar su información en cualquier momento
   - ✅ Función de edición de perfil disponible

5. **Limitación del plazo de conservación**
   - ✅ Datos eliminados al borrar la cuenta
   - ✅ Cuentas inactivas notificadas antes de eliminación

6. **Integridad y confidencialidad**
   - ✅ Cifrado en tránsito (TLS 1.3)
   - ✅ Cifrado en reposo (Firebase)
   - ✅ Almacenamiento seguro (Keychain/Keystore)

#### Derechos del Usuario Implementados:

- **Derecho de acceso** (Art. 15): Ver toda la información almacenada
- **Derecho de rectificación** (Art. 16): Editar datos personales
- **Derecho de supresión** (Art. 17): "Derecho al olvido" - Eliminar cuenta
- **Derecho a la portabilidad** (Art. 20): Exportar datos en formato JSON
- **Derecho de oposición** (Art. 21): Retirar consentimiento
- **Derecho a la limitación del tratamiento** (Art. 18): Control sobre uso de datos

#### Implementación Técnica:
```typescript
// Funcionalidades en app/(app)/privacy-settings.tsx:
- handleExportData(): Exporta todos los datos del usuario
- handleDeleteAccount(): Elimina cuenta y todos los datos
- Links a Política de Privacidad y Términos
```

### CCPA/CPRA (California Consumer Privacy Act)

#### Derechos del Consumidor Implementados:

1. **Derecho a saber** (Right to Know)
   - ✅ Política de privacidad detalla qué datos se recopilan
   - ✅ Información sobre con quién se comparten (Firebase, OpenWeather)

2. **Derecho a eliminar** (Right to Delete)
   - ✅ Función de eliminación de cuenta implementada
   - ✅ Proceso de eliminación en 30 días

3. **Derecho a portabilidad** (Right to Portability)
   - ✅ Exportación de datos en formato JSON
   - ✅ Incluye todas las citas, categorías y perfil

4. **Derecho a no discriminación** (Right to Non-Discrimination)
   - ✅ No hay restricciones por ejercer derechos de privacidad

5. **Derecho a limitar uso de información sensible** (CPRA)
   - ✅ Solo se recopilan datos esenciales
   - ✅ Contraseñas nunca almacenadas en texto plano

#### Divulgaciones Requeridas:

| Categoría de Datos | Propósito | Compartido con |
|-------------------|-----------|----------------|
| Email, Nombre | Autenticación | Firebase Auth |
| Contraseña (hash) | Autenticación | Firebase Auth |
| Citas médicas | Gestión personal | Firebase Firestore |
| Categorías | Organización | Firebase Firestore |
| Ciudad (opcional) | Información climática | OpenWeather API |

### Medidas de Seguridad Técnicas

#### 1. Cifrado en Tránsito
```typescript
// Todas las comunicaciones usan HTTPS
- Firebase: TLS 1.3 automático
- OpenWeather API: HTTPS obligatorio
- Validación de certificados SSL/TLS
```

#### 2. Cifrado en Reposo
```typescript
// Firebase Firestore
- Cifrado AES-256 automático
- Claves gestionadas por Google Cloud KMS

// Almacenamiento local
- iOS: Keychain Services (kSecAttrAccessibleAfterFirstUnlock)
- Android: EncryptedSharedPreferences con AES-256-GCM
```

#### 3. Gestión de Secretos
```typescript
// Implementación actual:
✅ Variables de entorno para API keys
✅ SecureStore para tokens de sesión
✅ .env excluido del control de versiones

// Recomendaciones de mejora:
🔄 Considerar rotación automática de tokens
🔄 Implementar secrets management service para producción
```

#### 4. Autenticación y Autorización
```typescript
// Firebase Authentication
- Verificación de email obligatoria
- Protección contra fuerza bruta integrada
- Sesiones con expiración automática

// Guards de navegación
- AuthContext valida usuario en cada ruta protegida
- Redirección automática si sesión expirada
```

## Auditoría de Seguridad

### Checklist de Seguridad

#### Nivel Básico (Implementado) ✅
- [x] HTTPS en todas las comunicaciones
- [x] Autenticación con Firebase
- [x] Almacenamiento seguro con SecureStore
- [x] Variables de entorno para secretos
- [x] Validación de entradas de usuario
- [x] Manejo seguro de errores
- [x] Política de privacidad documentada
- [x] Términos y condiciones documentados
- [x] Función de exportación de datos
- [x] Función de eliminación de cuenta

#### Nivel Intermedio (Opcional para producción) 🔄
- [ ] Certificate Pinning
- [ ] Detección de jailbreak/root
- [ ] Ofuscación de código
- [ ] Rate limiting en el lado del cliente
- [ ] Logs de auditoría detallados
- [ ] Monitoreo de seguridad en tiempo real

#### Nivel Avanzado (Para apps empresariales) ⚠️
- [ ] Multi-factor authentication (MFA)
- [ ] Biometría (Face ID / Touch ID)
- [ ] Detección de fraude con ML
- [ ] Penetration testing profesional
- [ ] Certificación ISO 27001
- [ ] SOC 2 Compliance

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** la publiques públicamente
2. Envía un email a: [tu-email-seguridad@ejemplo.com]
3. Incluye:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (opcional)

**Tiempo de respuesta comprometido:** 48 horas

## Recursos Adicionales

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Expo SecureStore Documentation](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [GDPR Official Text](https://gdpr-info.eu/)
- [CCPA Official Text](https://oag.ca.gov/privacy/ccpa)

---

**Última actualización:** 17 de octubre de 2025