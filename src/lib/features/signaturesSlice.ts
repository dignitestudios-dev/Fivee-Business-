import { createSlice } from "@reduxjs/toolkit";

interface Signature {
  id: string;
  title: string;
  description: string;
  url: string;
}

const initialState = {
  list: [] as Signature[],
};

const signaturesSlice = createSlice({
  name: "signatures",
  initialState,
  reducers: {
    setSignatures: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setSignatures } = signaturesSlice.actions;
export default signaturesSlice.reducer;
