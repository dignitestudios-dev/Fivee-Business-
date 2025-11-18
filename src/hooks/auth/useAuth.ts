import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import toast from "react-hot-toast";
import { loginUser } from "@/lib/features/userSlice";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  UserCredential,
} from "firebase/auth";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const response = await api.login(payload);
      if (response?.data?.token) {
        dispatch(
          loginUser({
            user: response.data.user,
            accessToken: response.data.token,
          })
        );
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (payload: SignupPayload) => {
    setLoading(true);
    try {
      const response = await api.signup(payload);
      return response;
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error(error?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    try {
      await api.forgotPassword(payload);
      toast.success("If your email exists, you will receive a reset link.");
    } catch (error: any) {
      console.error("Error during forgot password:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (payload: ResetPasswordPayload) => {
    setLoading(true);
    try {
      await api.resetPassword(payload);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (
    userCredential: UserCredential,
    provider: SignInProvider,
    employmentType: EmploymentType
  ) => {
    const { user } = userCredential;
    const [firstName, ...lastNameParts] = user.displayName?.split(" ") || [
      "",
      "",
    ];
    const lastName = lastNameParts.join(" ");

    const payload: SignupPayload = {
      email: user.email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      socialLogin: true,
      provider,
      role: "user",
      employmentType,
    };

    try {
      const response = await handleSignup(payload);
      console.log(response);
      if (response?.data?.token) {
        const userData = response.data.user;
        const token = response.data.token;

        dispatch(
          loginUser({
            user: userData,
            accessToken: token,
          })
        );

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error during social login");
      throw error;
    }
  };

  const handleGoogleSignIn = async (
    employmentType: EmploymentType = "self-employed"
  ) => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleSocialAuth(result, "google", employmentType);
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast.error(error?.message || "Error signing in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async (
    employmentType: EmploymentType = "self-employed"
  ) => {
    setAppleLoading(true);
    try {
      const provider = new OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");

      const result = await signInWithPopup(auth, provider);
      await handleSocialAuth(result, "apple", employmentType);
    } catch (error: any) {
      console.error("Apple Sign In Error:", error);
      toast.error(error?.message || "Error signing in with Apple");
    } finally {
      setAppleLoading(false);
    }
  };

  return {
    loading,
    googleLoading,
    appleLoading,
    handleLogin,
    handleSignup,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    handleResetPassword,
  };
};

export default useAuth;