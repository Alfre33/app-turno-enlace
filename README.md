# Turno Enlace - App de Citas Médicas

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Descripción

**Turno Enlace** es una aplicación móvil desarrollada en React Native con Expo que permite a los usuarios gestionar citas médicas de forma segura y eficiente. La aplicación integra autenticación Firebase, almacenamiento seguro de datos y consumo de APIs externas para proporcionar información climática.

## Características Principales

- 🔐 **Autenticación Segura**: Login y registro con Firebase Authentication
- 🔒 **Almacenamiento Cifrado**: Datos sensibles protegidos con Expo SecureStore
- 🌤️ **Integración de APIs**: Consumo de OpenWeather API para información climática
- 📱 **Diseño Responsivo**: Interfaz optimizada para dispositivos móviles
- 🛡️ **Seguridad Avanzada**: Implementación de mejores prácticas de seguridad móvil

## Tecnologías Utilizadas

### Core Framework

- **React Native**: 0.81.4
- **Expo**: ~54.0.8
- **TypeScript**: ~5.9.2

### Autenticación y Seguridad

- **Firebase**: ^12.3.0 (Authentication)
- **Expo SecureStore**: ~15.0.7 (Almacenamiento cifrado)

### Navegación y UI

- **Expo Router**: ~6.0.6
- **React Navigation**: ^7.1.8
- **Expo Vector Icons**: ^15.0.2

### Formularios y Validación

- **React Hook Form**: ^7.62.0
- **Zod**: ^3.25.76
- **@hookform/resolvers**: ^5.2.2

### APIs Externas

- **OpenWeather API**: Información meteorológica en tiempo real

## Capturas de Pantalla

### Flujo de Autenticación

<div align="left">
  <img src="assets/screenshots/welcome.jpg" width="160" alt="Welcome"/>
  <img src="assets/screenshots/login.jpg" width="160" alt="Login"/>
  <img src="assets/screenshots/register.jpg" width="160" alt="Register"/>
  <img src="assets/screenshots/new-user.jpg" width="160" alt="New user"/>
  <img src="assets/screenshots/validated.jpg" width="160" alt="Validated"/>
</div>

### Pantalla Principal con Integración de Clima

<div align="left">
  <img src="assets/screenshots/home.jpg" width="160" alt="Home with Weather"/>
</div>

### Funcionalidades

<table>
  <tr>
    <td align="left">
      <img src="assets/screenshots/clima-pueb.jpg" width="200"/>
      <img src="assets/screenshots/clima-teh.jpg" width="200"/>
      <br />
      <sub><b>🌤️ Información Climática</b></sub>
    </td>
    <td align="left">
      <img src="assets/screenshots/profile.jpg" width="200"/>
      <br />
      <sub><b>👤 Perfil de Usuario</b></sub>
    </td>
  </tr>
</table>

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI: `npm install -g @expo/cli`
- Cuenta de Firebase configurada
- API Key de OpenWeather

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Alfre33/app-turno-enlace.git
   cd app-turno-enlace
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

- Clonar el archivo `.env.example` que se encuentra en la raíz del proyecto
- Renombrar el archivo `.env.example` --> `.env` en la raíz del proyecto
- Llenar cada variable de entorno
  ```env
  EXPO_PUBLIC_OPENWEATHER_API_KEY=tu_api_key_aqui
  EXPO_PUBLIC_OPENWEATHER_URL=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_MESSAGIN_SENDER_ID=tu_api_key_aqu
  EXPO_PUBLIC_FIREBASE_APP_ID=tu_api_key_aqu
  ```

4. **Ejecutar la aplicación**

   ```bash
   # Desarrollo
   npm start

   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

## Estructura del Proyecto

```
Citas-Medicas/
├── app/                        # Rutas y pantallas principales
│   ├── (app)/                 # Pantallas autenticadas
│   │   └── index.tsx         # Pantalla principal con clima
│   ├── (auth)/               # Pantallas de autenticación
│   │   ├── login.tsx         # Pantalla de inicio de sesión
│   │   ├── register.tsx      # Pantalla de registro
│   │   └── welcome.tsx       # Pantalla de bienvenida
│   └── _layout.tsx           # Layout principal con guards
├── contexts/                  # Context providers
│   ├── AuthContext.tsx       # Context de autenticación
│   └── ThemeContext.tsx      # Context de temas
├── src/
│   └── libs/
│       └── firebase.ts       # Configuración de Firebase
├── constants/                # Constantes y configuraciones
├── hooks/                    # Custom hooks
├── .env                      # Variables de entorno (no incluido)
├── app.config.ts            # Configuración de Expo
└── package.json
```

## Integración de APIs

### Firebase Authentication

La aplicación utiliza Firebase Auth para manejo seguro de usuarios:

```typescript
// Login de usuario
const login = async ({ email, password, remember }) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (remember) {
      await SecureStore.setItemAsync("remember", "1");
    }
  } catch (error) {
    // Manejo de errores
  }
};
```

### OpenWeather API

Consumo de datos meteorológicos con validación de errores:

```typescript
// Obtener datos del clima
const fetchWeather = async () => {
  const url = `${OW_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

  const response = await fetch(url, {
    signal: abortController.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
};
```

## Características de Seguridad

### 1. Autenticación(FIREBASE AUTH)

- Login/registro con Firebase Auth
- Verificación de email automática
- Gestión de sesiones segura
- Protección contra ataques de fuerza bruta

### 2. Almacenamiento Seguro(EXPO SECURESTORE)

- **Expo SecureStore** para datos sensibles
- Cifrado nativo (iOS Keychain / Android Keystore)
- Limpieza automática al cerrar sesión

### 3. Validación de Datos(ZOD)

- Sanitización de entradas de usuario
- Validación de formatos (email, API keys)
- Manejo seguro de errores

### 4. Comunicaciones

- HTTPS obligatorio para todas las APIs
- Timeouts configurados
- Validación de respuestas

## Scripts Disponibles

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

## Dependencias Principales

### Producción

```json
{
  "expo": "~54.0.8",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "firebase": "^12.3.0",
  "expo-secure-store": "~15.0.7",
  "expo-router": "~6.0.6",
  "react-hook-form": "^7.62.0",
  "zod": "^3.25.76"
}
```

### Desarrollo

```json
{
  "@types/react": "~19.1.0",
  "typescript": "~5.9.2",
  "eslint": "^9.25.0",
  "eslint-config-expo": "~10.0.0"
}
```

## Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication con Email/Password
3. Configurar dominio autorizado
4. Obtener configuración del proyecto
5. Llenar las variables de entorno en el archivo `.env`

## Configuración de OpenWeather

1. Registrarse en [OpenWeather](https://openweathermap.org/api)
2. Obtener API Key gratuita
3. Llenar las variables de entorno en el archivo `.env`

## Desarrollo y Contribución

### Estructura de Branches

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/*`: Nuevas características

### Estándares de Código

- TypeScript estricto
- ESLint con configuración Expo
- Prettier para formateo
- Conventional Commits

## Seguridad y Mejores Prácticas

Ver [SECURITY.md](./SECURITY.md) para documentación detallada de seguridad.

### Resumen de Medidas de Seguridad:

- 🔐 Firebase Authentication integrado
- 🔒 SecureStore para datos sensibles
- 🌐 HTTPS para todas las comunicaciones
- ✅ Validación estricta de datos
- 🛡️ Manejo seguro de errores
- 📱 Guards de navegación por autenticación

## FAQ

**Q: ¿Cómo obtengo una API key de OpenWeather?**
A: Registrate en openweathermap.org, confirma tu email y copia la API key gratuita.

**Q: ¿La aplicación funciona offline?**
A: La autenticación requiere conexión. Los datos del clima se cachean temporalmente.

**Q: ¿Puedo usar otros proveedores de autenticación?**
A: Sí, Firebase Auth soporta Google, Facebook, Apple, etc. Requiere configuración adicional.

**Q: ¿Dónde se almacenan los datos sensibles?**
A: En SecureStore (iOS Keychain/Android Keystore), nunca en texto plano.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## Contacto y Soporte

- **Repositorio**: [GitHub](https://github.com/AlonsoMarcos683/Citas-Medicas)
- **Issues**: [GitHub Issues](https://github.com/AlonsoMarcos683/Citas-Medicas/issues)

## Roadmap

### Version 1.1 (Próximamente)

- [ ] Gestión completa de citas médicas
- [ ] Calendario de citas integrado
- [ ] Notificaciones push
- [ ] Perfil de usuario extendido

### Version 1.2

- [ ] Modo offline mejorado
- [ ] Sincronización de datos
- [ ] Soporte multi-idioma
- [ ] Temas personalizables

---

**Turno Enlace** - Desarrollado con ❤️ usando React Native, Expo y Firebase
