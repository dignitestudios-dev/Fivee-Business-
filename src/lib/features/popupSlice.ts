import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PopupType = "success" | "error" | "info" | "confirm";

export interface PopupState {
  open: boolean;
  title?: string;
  description: string;
  type: PopupType;
}

const initialState: PopupState = {
  open: false,
  title: undefined,
  description: "",
  type: "info",
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (
      state,
      action: PayloadAction<{
        title?: string;
        description: string;
        type?: PopupType;
      }>
    ) => {
      state.open = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.type = action.payload.type || "info";
    },

    showError: (
      state,
      action: PayloadAction<{ title?: string; description: string }>
    ) => {
      state.open = true;
      state.title = action.payload.title || "Error";
      state.description = action.payload.description;
      state.type = "error";
    },

    showSuccess: (
      state,
      action: PayloadAction<{ title?: string; description: string }>
    ) => {
      state.open = true;
      state.title = action.payload.title || "Success";
      state.description = action.payload.description;
      state.type = "success";
    },

    showInfo: (
      state,
      action: PayloadAction<{ title?: string; description: string }>
    ) => {
      state.open = true;
      state.title = action.payload.title || "Info";
      state.description = action.payload.description;
      state.type = "info";
    },

    closePopup: (state) => {
      state.open = false;
      state.title = undefined;
      state.description = "";
      state.type = "info";
    },
  },
});

export const { showPopup, showError, showSuccess, showInfo, closePopup } =
  popupSlice.actions;
export default popupSlice.reducer;
