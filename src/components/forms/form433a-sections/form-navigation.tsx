"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
  isLastStep?: boolean
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep = false,
}: FormNavigationProps) {
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
          onClick={onNext}
          className="bg-[#22b573] hover:bg-[#22b573]/90 text-white flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
