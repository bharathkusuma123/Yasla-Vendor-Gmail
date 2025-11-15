import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleLogin(onSuccess, onFail) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "119344335-a61nrhbvjlp3rhaa9ifvjla1iiko144g.apps.googleusercontent.com",
    androidClientId:
      "119344335-983nadhmshad9vgb28ocqu739f5qraua.apps.googleusercontent.com",
    iosClientId:
      "119344335-8cspa1q97fgl7ic9r9gt1p203ae95467.apps.googleusercontent.com",
  });

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchGoogleProfile(authentication.accessToken);
    }
  }, [response]);

  // Fetch Google Profile Info
  const fetchGoogleProfile = async (accessToken) => {
    try {
      const googleResponse = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const googleUser = googleResponse.data;
      onSuccess(googleUser); // send Google user data back to screen

    } catch (err) {
      console.log("Google Profile Fetch Error:", err);
      onFail("Google Sign-In was cancelled");
    }
  };

  return { promptAsync, redirectUri };
}
