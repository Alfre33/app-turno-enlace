
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAmwpN50eAhI-zOXTXdzmq4A-pp_VwiRp0",
  authDomain: "loginautenticate-a550d.firebaseapp.com",
  projectId: "loginautenticate-a550d",
  storageBucket: "loginautenticate-a550d.firebasestorage.app",
  messagingSenderId: "904216586527",
  appId: "1:904216586527:web:a85e4a41c3e4698dd4e82a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

type RNPersistFn = (storage: any) => any;
let getRNPersist: RNPersistFn | undefined;

try {
  const authPkg = require("firebase/auth");
  if (typeof authPkg.getReactNativePersistence === "function") {
    getRNPersist = authPkg.getReactNativePersistence as RNPersistFn;
  }
} catch {}

if (!getRNPersist) {
  try {
    const rnAuth = require("firebase/auth/react-native");
    if (typeof rnAuth.getReactNativePersistence === "function") {
      getRNPersist = rnAuth.getReactNativePersistence as RNPersistFn;
    }
  } catch {}
}

declare global {
  var __APP_AUTH__: Auth | undefined;
}

const globalForAuth = globalThis as unknown as {
  __APP_AUTH__?: Auth;
};

let auth: Auth;

if (Platform.OS === "ios" || Platform.OS === "android") {
  if (!globalForAuth.__APP_AUTH__) {
    if (!getRNPersist) {
      console.warn(
        "⚠️ No se encontró getReactNativePersistence. Auth usará memoria (sin persistencia entre sesiones)."
      );
      globalForAuth.__APP_AUTH__ = getAuth(app);
    } else {
      globalForAuth.__APP_AUTH__ = initializeAuth(app, {
        persistence: getRNPersist(AsyncStorage),
      });
    }
  }
  auth = globalForAuth.__APP_AUTH__!;
} else {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

export { app, auth };

