import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  type Auth,
  type Persistence,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Adaptador para SecureStore
const secureStoragePersistence: Persistence = {
  async _get(key: string) {
    if (Platform.OS === "web") return null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async _remove(key: string) {
    if (Platform.OS === "web") return;
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
  async _set(key: string, value: string) {
    if (Platform.OS === "web") return;
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  _addListener(_key: string, _listener: () => void) {},
  _removeListener(_key: string, _listener: () => void) {},
  type: "LOCAL",
} as Persistence;

/* ---------- Auth con persistencia en RN ---------- */
let auth: Auth;
try {
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: secureStoragePersistence,
    });
  }
} catch {
  auth = getAuth(app);
}

/* ---------- Firestore para RN (long polling auto) ---------- */
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  db = getFirestore(app);
}

export { app, auth, db };

