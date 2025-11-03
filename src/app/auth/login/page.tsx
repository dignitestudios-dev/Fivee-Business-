import LoginForm from "@/components/auth/LoginForm";
import { constants } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = () => {
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
