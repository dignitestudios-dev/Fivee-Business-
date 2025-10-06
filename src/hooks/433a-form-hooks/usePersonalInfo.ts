import api from "@/lib/services";
import { validate } from "@/lib/validation-schemas";
import { personalInfoSchema } from "@/lib/validation/form433a/personal-info-section";
import React, { useState } from "react";

const usePersonalInfo = () => {
  const [loading, setLoading] = useState(false);

  const handleSavePersonalInfo = async (info: PersonalInfoFromSchema) => {
    setLoading(true);

    try {
      // Validate data with Zod schema before API call
      const validatedData = validate(personalInfoSchema, info);
      
      await api.savePersonalInfo(validatedData);
      // save info in redux
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      throw new Error(error?.message || "Failed to save personal info");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSavePersonalInfo };
};

export default usePersonalInfo;