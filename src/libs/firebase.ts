
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmwpN50eAhI-zOXTXdzmq4A-pp_VwiRp0",
  authDomain: "loginautenticate-a550d.firebaseapp.com",
  projectId: "loginautenticate-a550d",
  storageBucket: "loginautenticate-a550d.firebasestorage.app",
  messagingSenderId: "904216586527",
  appId: "1:904216586527:web:a85e4a41c3e4698dd4e82a"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
