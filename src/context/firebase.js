// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC45EdSQmu4TqacZT3fhaxjOL2WxcOz9m8",
  authDomain: "yasla-vendor-f5eb0.firebaseapp.com",
  projectId: "yasla-vendor-f5eb0",
  storageBucket: "yasla-vendor-f5eb0.firebasestorage.app",
  messagingSenderId: "796283920864",
  appId: "1:796283920864:web:ed465b7cccc988cdeecb85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const googleProvider = new GoogleAuthProvider();