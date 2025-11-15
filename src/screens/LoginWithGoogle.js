import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { auth, db } from "../context/firebase";
import { 
  signInWithCredential, 
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential 
} from "firebase/auth";
import { 
  doc, getDoc, setDoc, updateDoc, increment 
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleLogin(navigation) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "18361098302-duj1tuv6f1pj0un4fr6ivu0dg5dgqisk.apps.googleusercontent.com",
//     iosClientId: "YOUR_IOS_CLIENT_ID",
    expoClientId: "18361098302-5unnskphgn93bp8lt89uen2pv7oqnh97.apps.googleusercontent.com"
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication);
    }
  }, [response]);

  const handleGoogleLogin = async (authentication) => {
    try {
      const credential = GoogleAuthProvider.credential(
        null,
        authentication.accessToken
      );

      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      const generatedPassword = `${user.displayName.replace(/\s+/g, "")}@123`;

      const userDocRef = doc(db, "customers", user.uid);
      let userDoc = await getDoc(userDocRef);
      let isNewUser = false;

      // 🔗 Link Google account with email/password
      try {
        const emailCredential = EmailAuthProvider.credential(
          user.email,
          generatedPassword
        );
        await linkWithCredential(user, emailCredential);
      } catch (err) {
        if (err.code !== "auth/credential-already-in-use") {
          console.log("Link error:", err);
        }
      }

      // ➕ Add User to Firestore if New
      if (!userDoc.exists()) {
        isNewUser = true;

        await setDoc(userDocRef, {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          password: generatedPassword,
          createdAt: new Date(),
        });

        // Update dashboard count
        const dashboardRef = doc(db, "dashboard", "customers");
        const dashSnap = await getDoc(dashboardRef);

        if (dashSnap.exists()) {
          await updateDoc(dashboardRef, { count: increment(1) });
        } else {
          await setDoc(dashboardRef, { count: 1 });
        }

        // Send welcome email
        try {
          await fetch(`${baseURL}/send-welcome-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              fullName: user.displayName,
              password: generatedPassword
            })
          });
        } catch (err) {
          console.log("Email error:", err);
        }

        userDoc = await getDoc(userDocRef);
      }

      // Save to AsyncStorage
      const userData = { uid: user.uid, ...userDoc.data() };
      await AsyncStorage.setItem("customer", JSON.stringify(userData));

      alert(isNewUser ? "Account Created with Google!" : "Login Successful!");
      navigation.navigate("Home");

    } catch (error) {
      console.log("Google login error:", error);
      alert("Login Failed: " + error.message);
    }
  };

  return { promptAsync };
}
