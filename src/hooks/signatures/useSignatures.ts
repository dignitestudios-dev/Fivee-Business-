import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import api from "@/lib/services";
import {
  addSignature,
  deleteSignature,
  setSignatures,
  updateSignature,
} from "@/lib/features/signaturesSlice";
import toast from "react-hot-toast";

const useSignatures = () => {
  const dispatch = useAppDispatch();
  const [loadingStates, setLoadingStates] = useState({
    getting: false,
    creating: false,
    updating: false,
    deleting: false,
  });

  const setGetting = (value: boolean) =>
    setLoadingStates((prev) => ({ ...prev, getting: value }));
  const setCreating = (value: boolean) =>
    setLoadingStates((prev) => ({ ...prev, creating: value }));
  const setUpdating = (value: boolean) =>
    setLoadingStates((prev) => ({ ...prev, updating: value }));
  const setDeleting = (value: boolean) =>
    setLoadingStates((prev) => ({ ...prev, deleting: value }));

  const handleGetSignatures = async () => {
    setGetting(true);

    try {
      const response = await api.getSignatures();
      dispatch(setSignatures(response.data?.images || []));
    } catch (error: any) {
      console.error("Error fetching signatures:", error);
      toast.error(error?.message || "Failed to fetch signatures");
    } finally {
      setGetting(false);
    }
  };

  const handleCreateSignature = async (formData: FormData) => {
    setCreating(true);

    try {
      const response = await api.createSignature(formData);
      const newSig = {
        ...response.data,
        id: response.data._id,
        description: response.data.description, // Align with 'description' field
      };
      dispatch(addSignature(newSig));
      return newSig;
    } catch (error: any) {
      console.error("Error creating signature:", error);
      toast.error(error?.message || "Failed to create signature");
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateSignature = async (id: string, formData: FormData) => {
    setUpdating(true);

    try {
      const response = await api.updateSignature(id, formData);
      const updatedSig = {
        ...response.data,
        id: response.data._id,
        description: response.data.description, // Align with 'description' field
      };
      dispatch(updateSignature(updatedSig));
    } catch (error: any) {
      console.error("Error updating signature:", error);
      toast.error(error?.message || "Failed to update signature");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSignature = async (id: string) => {
    setDeleting(true);

    try {
      await api.deleteSignature(id);
      dispatch(deleteSignature(id));
    } catch (error: any) {
      console.error("Error deleting signature:", error);
      toast.error(error?.message || "Failed to delete signature");
    } finally {
      setDeleting(false);
    }
  };

  return {
    ...loadingStates,
    handleGetSignatures,
    handleCreateSignature,
    handleUpdateSignature,
    handleDeleteSignature,
  };
};

export default useSignatures;
