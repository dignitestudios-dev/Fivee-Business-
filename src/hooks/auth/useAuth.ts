import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import { getCaseId } from "@/utils/helper";
import { savePersonalInfo } from "@/lib/features/form433aSlice";
import toast from "react-hot-toast";
import { loginUser } from "@/lib/features/userSlice";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (paylaod: LoginPayload) => {
    setLoading(true);
    try {
      const response = await api.login(paylaod);

      console.log("response :", response);
      if (response?.data?.token) {
        dispatch(
          loginUser({
            user: response?.data?.token,
            accessToken: response?.data?.token,
          })
        );

        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error fetching other info:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
  };
};

export default useAuth;
