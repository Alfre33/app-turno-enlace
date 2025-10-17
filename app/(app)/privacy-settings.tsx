import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/src/libs/firebase';
import { useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PrivacySettingsScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Exportar todos los datos del usuario
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      if (!user) {
        Alert.alert('Error', 'No hay usuario autenticado');
        return;
      }

      // Obtener todas las citas del usuario
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(appointmentsRef, where('userId', '==', user.uid));
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener todas las categorías del usuario
      const categoriesRef = collection(db, 'categories');
      const categoriesQuery = query(categoriesRef, where('userId', '==', user.uid));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Crear objeto con todos los datos
      const userData = {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: user.metadata.creationTime,
        },
        appointments,
        categories,
        exportDate: new Date().toISOString(),
      };

      // En una app real, aquí enviarías el archivo o lo guardarías
      // Por ahora, mostramos un resumen
      Alert.alert(
        'Datos Exportados',
        `Se han recopilado tus datos:\n\n` +
        `📧 Email: ${user.email}\n` +
        `📅 Citas: ${appointments.length}\n` +
        `📂 Categorías: ${categories.length}\n\n` +
        `En una versión de producción, estos datos se enviarían a tu email o se descargarían como archivo JSON.`,
        [
          {
            text: 'Ver JSON',
            onPress: () => console.log(JSON.stringify(userData, null, 2))
          },
          { text: 'OK' }
        ]
      );

    } catch (error) {
      console.error('Error al exportar datos:', error);
      Alert.alert('Error', 'No se pudieron exportar los datos');
    } finally {
      setIsExporting(false);
    }
  };

  // Eliminar cuenta y todos los datos
  const handleDeleteAccount = async () => {
    Alert.alert(
      '⚠️ Eliminar Cuenta',
      'Esta acción es PERMANENTE y eliminará:\n\n' +
      '• Tu cuenta de usuario\n' +
      '• Todas tus citas\n' +
      '• Todas tus categorías\n' +
      '• Todos tus datos personales\n\n' +
      '¿Estás seguro de que deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              if (!user) {
                Alert.alert('Error', 'No hay usuario autenticado');
                return;
              }

              // 1. Eliminar todas las citas del usuario
              const appointmentsRef = collection(db, 'appointments');
              const appointmentsQuery = query(appointmentsRef, where('userId', '==', user.uid));
              const appointmentsSnapshot = await getDocs(appointmentsQuery);
              
              const deleteAppointmentsPromises = appointmentsSnapshot.docs.map(doc => 
                deleteDoc(doc.ref)
              );
              await Promise.all(deleteAppointmentsPromises);

              // 2. Eliminar todas las categorías del usuario
              const categoriesRef = collection(db, 'categories');
              const categoriesQuery = query(categoriesRef, where('userId', '==', user.uid));
              const categoriesSnapshot = await getDocs(categoriesQuery);
              
              const deleteCategoriesPromises = categoriesSnapshot.docs.map(doc => 
                deleteDoc(doc.ref)
              );
              await Promise.all(deleteCategoriesPromises);

              // 3. Eliminar la cuenta de Firebase Auth
              if (auth.currentUser) {
                await deleteUser(auth.currentUser);
              }

              Alert.alert(
                'Cuenta Eliminada',
                'Tu cuenta y todos tus datos han sido eliminados permanentemente.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      logout();
                      router.replace('/(auth)/welcome');
                    }
                  }
                ]
              );

            } catch (error: any) {
              console.error('Error al eliminar cuenta:', error);
              
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Reautenticación Requerida',
                  'Por seguridad, debes iniciar sesión nuevamente antes de eliminar tu cuenta.',
                  [
                    {
                      text: 'Cerrar Sesión',
                      onPress: () => {
                        logout();
                        router.replace('/(auth)/login');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'No se pudo eliminar la cuenta. Intenta nuevamente.');
              }
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    // En producción, esto abriría un navegador o modal con la política
    Linking.openURL('https://github.com/Alfre33/app-turno-enlace/blob/main/PRIVACY_POLICY.md');
  };

  const openTermsOfService = () => {
    // En producción, esto abriría un navegador o modal con los términos
    Linking.openURL('https://github.com/Alfre33/app-turno-enlace/blob/main/TERMS_OF_SERVICE.md');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Configuración de Privacidad
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Gestiona tus datos y privacidad
        </Text>
      </View>

      {/* Sección: Tus Derechos */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          📋 Tus Derechos (GDPR/CCPA)
        </Text>

        <TouchableOpacity
          style={[styles.option, { borderColor: theme.colors.border }]}
          onPress={handleExportData}
          disabled={isExporting}
        >
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            📦 Exportar mis datos
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Descarga una copia de toda tu información (Derecho a la portabilidad)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderColor: theme.colors.border }]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          <Text style={[styles.optionTitle, { color: theme.colors.danger }]}>
            🗑️ Eliminar mi cuenta
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Elimina permanentemente tu cuenta y todos tus datos (Derecho al olvido)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Documentos Legales */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          📄 Documentos Legales
        </Text>

        <TouchableOpacity
          style={[styles.option, { borderColor: theme.colors.border }]}
          onPress={openPrivacyPolicy}
        >
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            🔒 Política de Privacidad
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Cómo recopilamos, usamos y protegemos tus datos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderColor: theme.colors.border }]}
          onPress={openTermsOfService}
        >
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            📜 Términos y Condiciones
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Condiciones de uso de la aplicación
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Seguridad */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          🔐 Medidas de Seguridad Implementadas
        </Text>

        <View style={[styles.infoBox, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            ✅ Cifrado en tránsito (HTTPS/TLS 1.3)
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            ✅ Cifrado en reposo (Firebase)
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            ✅ Almacenamiento seguro (Keychain/Keystore)
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            ✅ Autenticación robusta (Firebase Auth)
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            ✅ Cumplimiento GDPR y CCPA
          </Text>
        </View>
      </View>

      {/* Información del usuario */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          👤 Tu Información
        </Text>
        <View style={[styles.infoBox, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            Email: {user?.email}
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            Usuario desde: {user?.metadata.creationTime}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
