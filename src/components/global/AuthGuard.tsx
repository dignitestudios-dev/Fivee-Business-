"use client";
import { loginUser } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { storage } from "@/utils/helper";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

// Auth routes that stay reachable with an active session — a logged-in user
// following the reset link from their email must not be bounced to /dashboard.
const SESSION_ALLOWED_AUTH_ROUTES = ["/auth/reset-password"];

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

    const isAuthRoute =
      pathname.startsWith("/auth") &&
      !SESSION_ALLOWED_AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if (pathname === "/" && (!isLoggedIn || !user)) {
      router.replace("/auth/login");
    } else if (pathname === "/" && isLoggedIn) {
      router.replace("/dashboard");
    } else if (isAuthRoute && (isLoggedIn || user)) {
      router.replace("/dashboard");
    } else if (pathname.includes("dashboard") && (!isLoggedIn || !user)) {
      router.replace("/auth/login");
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
