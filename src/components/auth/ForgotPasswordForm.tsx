"use client";
import { useForm } from "react-hook-form";

import FInput from "@/components/ui/FInput";
import FButton from "../ui/FButton";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log(data);

    router.push("/auth/verify");
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

      <FButton variant="primary" size="lg" className="w-full">
        Confirm
      </FButton>
    </form>
  );
};

export default ForgotPasswordForm;
