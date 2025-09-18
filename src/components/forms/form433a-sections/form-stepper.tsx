"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface FormStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  return (
    <nav className="space-y-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Form Sections</h2>
        <p className="text-sm text-gray-500">Complete all sections to submit your form</p>
      </div>

      {steps.map((step) => {
        const isCompleted = step.id < currentStep
        const isCurrent = step.id === currentStep

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all duration-200",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              isCurrent && "border-[#22b573] bg-[#22b573]/5 ring-2 ring-[#22b573]/20",
              isCompleted && "border-green-200 bg-green-50",
              !isCurrent && !isCompleted && "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                  isCurrent && "bg-[#22b573] text-white",
                  isCompleted && "bg-green-500 text-white",
                  !isCurrent && !isCompleted && "bg-gray-200 text-gray-600",
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-[#22b573]",
                    isCompleted && "text-green-700",
                    !isCurrent && !isCompleted && "text-gray-900",
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    isCurrent && "text-[#22b573]/70",
                    isCompleted && "text-green-600",
                    !isCurrent && !isCompleted && "text-gray-500",
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </nav>
  )
}
