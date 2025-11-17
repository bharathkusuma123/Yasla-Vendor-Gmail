import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../context/firebase";
import styles from "./LoginStyles";

WebBrowser.maybeCompleteAuthSession();

const VendorLoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // GOOGLE LOGIN
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "115986608005-jap9gjhku1vsan9q2n8mtj780eg9n9q3.apps.googleusercontent.com",
  });

  // HANDLE GOOGLE SIGN-IN
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (!id_token) {
        Alert.alert("Google Login Failed", "No ID token received");
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;

          const formattedUser = {
            email: user.email,
            full_name: user.displayName,
            phone: user.phoneNumber,
            status: "active",
            user_id: user.uid,
            user_role: "vendor",
            salon: null,
          };

          login(formattedUser);
          navigation.replace("VendorTabs");
        })
        .catch((error) => {
          console.error("Google Login Error:", error);
          Alert.alert("Google Login Failed", error.message);
        });
    }
  }, [response]);

  // NORMAL LOGIN
  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter phone & password");
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await axios.post(
        `https://yaslaservice.com:81/user_login`,
        { phone, password }
      );

      const userData = loginResponse.data?.data;
      if (!userData) throw new Error("User data not found");

      const usersResponse = await axios.get(
        `https://yaslaservice.com:81/users`
      );

      const allUsers = usersResponse.data?.data || [];

      const matchedUser = allUsers.find(
        (u) => u.phone === userData.phone || u.id === userData.user_id
      );

      const formattedUser = {
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        status: userData.status,
        user_id: userData.user_id,
        user_role: userData.user_role,
        salon: matchedUser?.salon ?? null,
      };

      await login(formattedUser);

      const role = formattedUser.user_role?.toLowerCase();
      let targetRoute = "VendorTabs";

      if (role === "sub admin") targetRoute = "SubAdminTabs";
      else if (role === "receptionist") targetRoute = "ReceptionistTabs";
      else if (role === "stylist") targetRoute = "StylistTabs";

      navigation.replace(targetRoute);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Image
              source={require("../../Logos/Outsidelogo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Vendor Login</Text>

            {/* PHONE */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />

            {/* PASSWORD */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* OR */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* GOOGLE SIGN-IN BUTTON */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Google_2015_logo.svg",
                }}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* SIGNUP */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.push("Signup")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VendorLoginScreen;
