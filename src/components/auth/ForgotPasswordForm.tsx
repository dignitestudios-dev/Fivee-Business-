"use client";
import { useForm } from "react-hook-form";

import FInput from "@/components/ui/FInput";
import FButton from "../ui/FButton";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/auth/useAuth";

const ForgotPasswordForm = () => {
  const { handleForgotPassword, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    handleForgotPassword({ email: data.email });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 items-center mt-5 w-full"
    >
      <FInput
        label="Email"
        placeholder="email@example.com"
        autoComplete="email"
        id="email"
        type="email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />

      <FButton loading={loading} variant="primary" size="lg" className="w-full">
        Confirm
      </FButton>
    </form>
  );
};

export default ForgotPasswordForm;
