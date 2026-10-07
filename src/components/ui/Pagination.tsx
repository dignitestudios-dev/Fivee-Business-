"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        className="flex items-center gap-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        className="flex items-center gap-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
