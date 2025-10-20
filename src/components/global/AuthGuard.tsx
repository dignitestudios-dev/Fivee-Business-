"use client";
import { loginUser } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { storage } from "@/utils/helper";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Run only once on mount: hydrate user from storage
  useEffect(() => {
    const cachedUser: User | null = storage.get("user");
    const accessToken: string | null = storage.get("accessToken");
    if (cachedUser && accessToken) {
      dispatch(
        loginUser({
          user: cachedUser,
          accessToken: accessToken,
        })
      );
    }
    setLoading(false);
  }, [dispatch]);

  // ✅ Run when pathname/user state changes: handle redirects
  useEffect(() => {
    if (loading) return;

    if (pathname.includes("auth") && (isLoggedIn || user)) {
      if (!user?.employmentType) {
        router.replace("/dashboard/onboard");
      } else {
        router.replace("/dashboard");
      }
    } else if (pathname.includes("dashboard") && (!isLoggedIn || !user)) {
      router.replace("/auth/login");
    } else if (
      pathname.includes("dashboard") &&
      user &&
      !user?.employmentType
    ) {
      router.replace("/dashboard/onboard");
    }
  }, [pathname, isLoggedIn, user, loading, router]);

  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <BiLoaderAlt className="animate-spin text-gray-400" size={44} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthGuard;
