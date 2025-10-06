"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: any;
  onNext: any;
  onSubmit?: any;
  loading?: boolean; // Add loading prop
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  loading = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || loading}
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
          disabled={loading}
          className="bg-[#22b573] hover:bg-[#22b573]/90 text-white flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Form"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="bg-[#22b573] hover:bg-[#22b573]/90 text-white flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Next"}
          {!loading && <ChevronRight className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
}