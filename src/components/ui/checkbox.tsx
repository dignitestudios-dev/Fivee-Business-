"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/utils/helper";
import { useFormContext } from "react-hook-form";

function Checkbox({
  className,
  name,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { watch, trigger, setValue } = useFormContext<FormData433A>();

  // Handle checkbox changes
  const handleCheckboxChange = async (fieldName: string, checked: boolean) => {
    setValue(fieldName as keyof FormData433A, checked);
    await trigger(fieldName as keyof FormData433A);
  };

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-gray-300 dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      checked={watch(name as keyof FormData433A) === true}
      onCheckedChange={(checked) =>
        handleCheckboxChange(name as string, checked === true)
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
