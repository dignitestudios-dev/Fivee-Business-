"use client";

import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import {
  saveApplicationInfo,
  savePersonalInfo,
  saveOtherInformation,
  saveSignatureDelegateInfo,
  saveAcceptanceAgentInfo,
} from "@/lib/features/formW7Slice";
import {
  fromAcceptanceAgentResponse,
  fromApplicationInfoResponse,
  fromOtherInformationResponse,
  fromPersonalInfoResponse,
  fromSignatureDelegateResponse,
  toAcceptanceAgentPayload,
  toApplicationInfoPayload,
  toOtherInformationPayload,
  toPersonalInfoPayload,
  toSignatureDelegatePayload,
} from "@/utils/formw7";

/**
 * One hook per W-7 section, built from a shared factory because every section
 * follows the same save/load shape: map the form to the DTO, POST it, and mirror
 * the result into the formW7 slice.
 */
const createSectionHook = <TForm>(config: {
  section: FormW7Section;
  save: (payload: any, caseId: string) => Promise<any>;
  toPayload: (form: TForm) => any;
  fromResponse: (data: any) => TForm;
  action: (value: TForm | null) => any;
}) =>
  function useW7SectionHook() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [loadingFormData, setLoadingFormData] = useState(false);

    const handleSave = async (form: TForm, caseId: string | null) => {
      if (!caseId) return;
      setLoading(true);
      try {
        await config.save(config.toPayload(form), caseId);
        dispatch(config.action(form));
      } catch (error: any) {
        console.error(`Error saving ${config.section}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    const handleGet = async (caseId: string | null) => {
      if (!caseId) return;
      setLoadingFormData(true);
      try {
        const response = await api.getW7SectionInfo(caseId, config.section);
        // A section that was never saved comes back as { status, data: undefined }
        const sectionData = response?.data?.data ?? null;
        dispatch(
          config.action(sectionData ? config.fromResponse(sectionData) : null)
        );
        return sectionData;
      } catch (error: any) {
        console.error(`Error fetching ${config.section}:`, error);
        throw error;
      } finally {
        setLoadingFormData(false);
      }
    };

    return { loading, loadingFormData, handleSave, handleGet };
  };

export const useW7ApplicationInfo = createSectionHook<W7ApplicationInfoFormSchema>(
  {
    section: "applicationInfo",
    save: api.saveW7ApplicationInfo,
    toPayload: toApplicationInfoPayload,
    fromResponse: fromApplicationInfoResponse,
    action: saveApplicationInfo,
  }
);

export const useW7PersonalInfo = createSectionHook<W7PersonalInfoFormSchema>({
  section: "personalInfo",
  save: api.saveW7PersonalInfo,
  toPayload: toPersonalInfoPayload,
  fromResponse: fromPersonalInfoResponse,
  action: savePersonalInfo,
});

export const useW7OtherInformation =
  createSectionHook<W7OtherInformationFormSchema>({
    section: "otherInformation",
    save: api.saveW7OtherInformation,
    toPayload: toOtherInformationPayload,
    fromResponse: fromOtherInformationResponse,
    action: saveOtherInformation,
  });

export const useW7AcceptanceAgent =
  createSectionHook<W7AcceptanceAgentFormSchema>({
    section: "acceptanceAgentInfo",
    save: api.saveW7AcceptanceAgent,
    toPayload: toAcceptanceAgentPayload,
    fromResponse: fromAcceptanceAgentResponse,
    action: saveAcceptanceAgentInfo,
  });

export const useW7SignatureDelegate =
  createSectionHook<W7SignatureDelegateFormSchema>({
    section: "signatureDelegateInfo",
    save: api.saveW7SignatureDelegate,
    toPayload: toSignatureDelegatePayload,
    fromResponse: fromSignatureDelegateResponse,
    action: saveSignatureDelegateInfo,
  });
