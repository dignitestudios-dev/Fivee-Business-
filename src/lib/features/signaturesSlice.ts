import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  images: [] as Signature[],
};

const signaturesSlice = createSlice({
  name: "signatures",
  initialState,
  reducers: {
    setSignatures: (state, action) => {
      state.images = action.payload;
    },
    addSignature: (state, action) => {
      state.images.push(action.payload);
    },
    updateSignature: (state, action) => {
      const index = state.images.findIndex(
        (sig) => sig._id === action.payload._id
      );
      if (index !== -1) {
        state.images[index] = action.payload;
      }
    },
    deleteSignature: (state, action) => {
      state.images = state.images.filter((sig) => sig._id !== action.payload);
    },
  },
});

export const { setSignatures, addSignature, updateSignature, deleteSignature } =
  signaturesSlice.actions;
export default signaturesSlice.reducer;
