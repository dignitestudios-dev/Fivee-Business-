"use client";
import LoginForm from "@/components/auth/LoginForm";
import { constants } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Apple from "@/components/icons/Apple";
import Google from "@/components/icons/Google";
import FButton from "@/components/ui/FButton";
import useAuth from "@/hooks/auth/useAuth";

const Login = () => {
  const { handleGoogleSignIn, handleAppleSignIn, googleLoading, appleLoading } =
    useAuth();
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="w-fit p-2 bg-[var(--primary)] rounded-xl mb-5">
        <Image
          src={constants.APP_CONFIG.logo}
          alt={constants.APP_CONFIG.name}
          height={50}
          width={50}
        />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-center">
        Welcome Back
      </h2>
      <p className="text-[var(--desc)] text-center">
        Please enter your details to log in.
      </p>

      <LoginForm />

      <div className="w-full flex items-center gap-5 mt-4 mb-2">
        <div className="h-[.5px] w-full bg-[#E3E3E3]" />
        <span className="text-[var(--desc)]">OR</span>
        <div className="h-[.5px] w-full bg-[#E3E3E3]" />
      </div>

      <FButton
        variant="outline"
        size="lg"
        icon={<Google />}
        className="w-full"
        onClick={() => handleGoogleSignIn("self-employed")}
        disabled={googleLoading}
      >
        {googleLoading ? "Please wait..." : "Continue with Google"}
      </FButton>

      <FButton
        variant="outline"
        size="lg"
        icon={<Apple />}
        className="w-full"
        onClick={() => handleAppleSignIn("self-employed")}
        disabled={appleLoading}
      >
        {appleLoading ? "Please wait..." : "Continue with Apple"}
      </FButton>

      <p className="text-center text-black  mt-3">
        Don't have an account?{" "}
        <Link
          href={"/auth/signup"}
          className="text-[var(--primary)] hover:underline"
        >
          Sign Up
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
