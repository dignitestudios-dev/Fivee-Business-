"use client";

import { cn } from "@/utils/helper";
import { Check, Lock } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function FormStepper({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: FormStepperProps) {
  return (
    <nav className="space-y-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Form Sections</h2>
        <p className="text-sm text-gray-500">
          Complete all sections to submit your form
        </p>
      </div>

      {steps.map((step) => {
        const isCompleted = completedSteps.has(step.id);
        const isCurrent = step.id === currentStep;
        const isAccessible =
          step.id <= currentStep || completedSteps.has(step.id);

        return (
          <button
            key={step.id}
            onClick={() => isAccessible && onStepClick(step.id)}
            disabled={!isAccessible}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              isAccessible && "hover:shadow-md cursor-pointer",
              !isAccessible && "cursor-not-allowed opacity-60",
              isCurrent &&
                "border-[#22b573] bg-[#22b573]/5 ring-2 ring-[#22b573]/20",
              isCompleted && "border-green-200 bg-green-50",
              !isCurrent &&
                !isCompleted &&
                isAccessible &&
                "border-gray-200 bg-white hover:border-gray-300",
              !isAccessible && "border-gray-100 bg-gray-50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                  isCurrent && "bg-[#22b573] text-white",
                  isCompleted && "bg-green-500 text-white",
                  !isCurrent &&
                    !isCompleted &&
                    isAccessible &&
                    "bg-gray-200 text-gray-600",
                  !isAccessible && "bg-gray-300 text-gray-500"
                )}
              >
                {!isAccessible ? (
                  <Lock className="w-3 h-3" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-[#22b573]",
                    isCompleted && "text-green-700",
                    !isCurrent &&
                      !isCompleted &&
                      isAccessible &&
                      "text-gray-900",
                    !isAccessible && "text-gray-500"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    isCurrent && "text-[#22b573]/70",
                    isCompleted && "text-green-600",
                    !isCurrent &&
                      !isCompleted &&
                      isAccessible &&
                      "text-gray-500",
                    !isAccessible && "text-gray-400"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
