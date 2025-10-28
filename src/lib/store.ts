import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import form433aSlice from "./features/form433aSlice";
import form433bSlice from "./features/form433bSlice";
import form656Slice from "./features/form656Slice";
import signaturesSlice from "./features/signaturesSlice";
import cardsSlice from "./features/cardsSlice";
import formsSlice from "./features/formsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      form433a: form433aSlice,
      form433b: form433bSlice,
      form656: form656Slice,
      signatures: signaturesSlice,
      cards: cardsSlice,
      forms: formsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
