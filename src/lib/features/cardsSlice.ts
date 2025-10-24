import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [] as Card[],
};

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCards: (state, action) => {
      state.list = action.payload;
    },
    emptyCards: (state) => {
      state.list = [];
    },
  },
});

export const { setCards, emptyCards } = cardSlice.actions;
export default cardSlice.reducer;
