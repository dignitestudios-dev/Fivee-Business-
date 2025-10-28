import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import toast from "react-hot-toast";
import { loginUser } from "@/lib/features/userSlice";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      console.error("Error during signup:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleSignup,
  };
};

export default useAuth;
