import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormsState {
  form433a: FormCase[];
  form433b: FormCase[];
  form656: FormCase[];
  form656Pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: FormsState = {
  form433a: [],
  form433b: [],
  form656: [],
  form656Pagination: null,
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    set433aCases(state, action: PayloadAction<FormCase[]>) {
      state.form433a = action.payload;
    },
    add433aCase(state, action: PayloadAction<FormCase>) {
      state.form433a.unshift(action.payload);
    },
    remove433aCase(state, action: PayloadAction<string>) {
      state.form433a = state.form433a.filter((c) => c._id !== action.payload);
    },

    clear433aCases(state) {
      state.form433a = [];
    },

    set433bCases(state, action: PayloadAction<FormCase[]>) {
      state.form433b = action.payload;
    },
    add433bCase(state, action: PayloadAction<FormCase>) {
      state.form433b.unshift(action.payload);
    },
    remove433bCase(state, action: PayloadAction<string>) {
      state.form433b = state.form433b.filter((c) => c._id !== action.payload);
    },
    clear433bCases(state) {
      state.form433b = [];
    },
    // Form 656 (cases + pagination)
    set656Cases(state, action: PayloadAction<FormCase[]>) {
      state.form656 = action.payload;
    },
    add656Case(state, action: PayloadAction<FormCase>) {
      state.form656.unshift(action.payload);
    },
    remove656Case(state, action: PayloadAction<string>) {
      state.form656 = state.form656.filter((c) => c._id !== action.payload);
    },
    clear656Cases(state) {
      state.form656 = [];
      state.form656Pagination = null;
    },
    set656Pagination(
      state,
      action: PayloadAction<{ page: number; limit: number; total: number; totalPages: number } | null>
    ) {
      state.form656Pagination = action.payload;
    },
    clearAllForms(state) {
      state.form433a = [];
      state.form433b = [];
    },
  },
});

export const {
  set433aCases,
  add433aCase,
  remove433aCase,
  clear433aCases,
  set433bCases,
  add433bCase,
  remove433bCase,
  clear433bCases,
  set656Cases,
  add656Case,
  remove656Case,
  clear656Cases,
  set656Pagination,
  clearAllForms,
} = formsSlice.actions;

export default formsSlice.reducer;
