import api from "@/lib/services";
import { validate } from "@/lib/validation-schemas";
import { employmentSchema } from "@/lib/validation/form433a/employment-section";
import React, { useState } from "react";

const useEmployment = () => {
  const [loading, setLoading] = useState(false);

  const handleSaveEmployment = async (info: EmploymentFromSchema) => {
    setLoading(true);

    try {
      // Validate data with Zod schema before API call
      const validatedData = validate(employmentSchema, info);

      await api.saveEmploymentInfo(validatedData);
      // save info in redux
    } catch (error: any) {
      console.error("Error saving employment info:", error);
      throw new Error(error?.message || "Failed to save employment info");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSaveEmployment };
};

export default useEmployment;
