import { useAppDispatch } from "@/lib/hooks";
import {
  showPopup,
  showError,
  showSuccess,
  showInfo,
  closePopup,
  PopupType,
} from "@/lib/features/popupSlice";

export const useGlobalPopup = () => {
  const dispatch = useAppDispatch();

  return {
    showPopup: (
      description: string,
      title?: string,
      type: PopupType = "info"
    ) => {
      dispatch(showPopup({ title, description, type }));
    },
    showError: (description: string, title?: string) => {
      dispatch(showError({ title, description }));
    },
    showSuccess: (description: string, title?: string) => {
      dispatch(showSuccess({ title, description }));
    },
    showInfo: (description: string, title?: string) => {
      dispatch(showInfo({ title, description }));
    },
    closePopup: () => {
      dispatch(closePopup());
    },
  };
};
