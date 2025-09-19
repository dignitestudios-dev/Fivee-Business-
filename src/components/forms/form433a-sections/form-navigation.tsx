"use client"

import { Button } from "@/components/ui/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
  validateStep?: () => Promise<boolean>
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  validateStep,
}: FormNavigationProps) {
  const [isValidating, setIsValidating] = useState(false)

  const handleNext = async () => {
    if (validateStep) {
      setIsValidating(true)
      const isValid = await validateStep()
      setIsValidating(false)

      if (isValid) {
        onNext()
      } else {
        // Validation errors will be shown by the form components
        console.log("[v0] Form validation failed")
      }
    } else {
      onNext()
    }
  }

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>

      {currentStep === totalSteps ? (
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-[#22b573] hover:bg-[#22b573]/90 text-white flex items-center gap-2"
        >
          Submit Form
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleNext}
          disabled={isValidating}
          className="bg-[#22b573] hover:bg-[#22b573]/90 text-white flex items-center gap-2 disabled:opacity-50"
        >
          {isValidating ? "Validating..." : "Next"}
          {!isValidating && <ChevronRight className="w-4 h-4" />}
        </Button>
      )}
    </div>
  )
}
