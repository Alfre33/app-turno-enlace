# 🔐 Guía de Acceso: Configuración de Privacidad

## 📍 Cómo acceder a la pantalla de privacidad

### **Opción 1: Desde el Perfil (Recomendado)** ✅

1. Abre la aplicación
2. Ve a la pestaña **"Profile"** en la navegación inferior
3. Verás un botón destacado: **"🔐 Configuración de Privacidad"**
4. Toca el botón para acceder

### **Opción 2: Navegación directa (En código)**

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/(app)/privacy-settings');
```

### **Opción 3: URL directa (En desarrollo)**

Si estás en Expo Go o desarrollo:
```
exp://localhost:8081/--/(app)/privacy-settings
```

---

## 🎯 Ubicación del archivo

**Ruta del componente:**
```
app/(app)/privacy-settings.tsx
```

**Ruta registrada en el router:**
```
/(app)/privacy-settings
```

---

## 🖼️ Vista previa del botón en Profile

El botón se ve así:

```
┌─────────────────────────────────────────┐
│  🔐  Configuración de Privacidad    ›   │
└─────────────────────────────────────────┘
```

**Características del botón:**
- Fondo azul claro (color primario con opacidad)
- Borde azul
- Icono de candado (🔐)
- Flecha indicando navegación (›)
- Ancho completo
- Destacado visualmente

---

## ✅ Funcionalidades disponibles en la pantalla

Una vez dentro, el usuario puede:

### **1. Exportar Datos** 📦
- Obtiene todas sus citas
- Obtiene todas sus categorías
- Obtiene información de perfil
- Formato JSON estructurado

### **2. Eliminar Cuenta** 🗑️
- Confirmación de seguridad
- Elimina todas las citas
- Elimina todas las categorías
- Elimina la cuenta de Firebase Auth
- Cierra sesión automáticamente

### **3. Acceder a Documentos Legales** 📄
- Política de Privacidad (abre GitHub)
- Términos y Condiciones (abre GitHub)

### **4. Ver Medidas de Seguridad** 🔐
- Lista de protecciones implementadas
- Información del usuario actual
- Fecha de creación de cuenta

---

## 🛠️ Cambios realizados

### **1. Registro en el Layout**
```typescript
// app/(app)/_layout.tsx
<Stack.Screen
  name="privacy-settings"
  options={{
    title: "Configuración de Privacidad",
    headerBackTitle: "Atrás",
  }}
/>
```

### **2. Botón en Profile**
```typescript
// app/(app)/profile.tsx
<TouchableOpacity
  style={styles.privacyButton}
  onPress={() => router.push("/(app)/privacy-settings")}
>
  <Text style={styles.privacyButtonIcon}>🔐</Text>
  <Text style={styles.privacyButtonText}>Configuración de Privacidad</Text>
  <Text style={styles.privacyButtonArrow}>›</Text>
</TouchableOpacity>
```

---

## 🧪 Cómo probar

1. **Iniciar la app:**
   ```bash
   npm start
   ```

2. **Navegar a Profile:**
   - Ve a la pestaña inferior "Profile"

3. **Toca el botón de privacidad:**
   - Verás el botón azul con el candado

4. **Probar funcionalidades:**
   - Exportar datos (verás un alert con resumen)
   - Ver documentos legales (abre GitHub)
   - Información de seguridad

5. **Eliminar cuenta (CUIDADO):**
   - Solo prueba en cuenta de desarrollo
   - Elimina PERMANENTEMENTE todos los datos

---

## 📝 Notas importantes

### ⚠️ **Antes de eliminar cuenta:**
- Esta acción es **IRREVERSIBLE**
- Elimina todos los datos del usuario
- No hay backup automático
- El usuario debe confirmarlo dos veces

### ✅ **Para producción:**
- Los links actualmente apuntan a GitHub
- Deberías crear modales o WebViews internos
- Considera agregar el botón también en:
  - Menú de configuración general
  - Pantalla de inicio (en un menú hamburguesa)

### 🔄 **Mejoras sugeridas:**
- Agregar animaciones al botón
- Badge "Nuevo" en el botón las primeras veces
- Confirmación más robusta para eliminar cuenta
- Enviar email de confirmación antes de eliminar

---

## 🎓 Para presentación/demo

**Flujo sugerido:**

1. "Primero vamos al perfil del usuario"
2. "Aquí pueden ver el botón de Configuración de Privacidad claramente visible"
3. "Al entrar, el usuario puede ejercer todos sus derechos GDPR/CCPA"
4. "Puede exportar sus datos en formato JSON portable"
5. "Puede eliminar su cuenta y todos sus datos (derecho al olvido)"
6. "También puede ver las medidas de seguridad implementadas"
7. "Y acceder a la política de privacidad y términos completos"

---

**¡Listo!** Ahora la pantalla de privacidad está completamente integrada y accesible. 🎉
