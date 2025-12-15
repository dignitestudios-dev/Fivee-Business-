import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FormsState {
  // Form 433A - all forms and completed forms
  form433a: FormCase[];
  form433aCompleted: FormCase[];
  form433aPagination: PaginationState | null;
  form433aCompletedPagination: PaginationState | null;
  
  // Form 433B - all forms and completed forms
  form433b: FormCase[];
  form433bCompleted: FormCase[];
  form433bPagination: PaginationState | null;
  form433bCompletedPagination: PaginationState | null;
  
  // Form 656
  form656: FormCase[];
  form656Pagination: PaginationState | null;
}

const initialState: FormsState = {
  form433a: [],
  form433aCompleted: [],
  form433aPagination: null,
  form433aCompletedPagination: null,
  
  form433b: [],
  form433bCompleted: [],
  form433bPagination: null,
  form433bCompletedPagination: null,
  
  form656: [],
  form656Pagination: null,
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    // Form 433A - All forms
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
      state.form433aPagination = null;
    },
    set433aPagination(state, action: PayloadAction<PaginationState | null>) {
      state.form433aPagination = action.payload;
    },

    // Form 433A - Completed forms
    set433aCompletedCases(state, action: PayloadAction<FormCase[]>) {
      state.form433aCompleted = action.payload;
    },
    add433aCompletedCase(state, action: PayloadAction<FormCase>) {
      state.form433aCompleted.unshift(action.payload);
    },
    remove433aCompletedCase(state, action: PayloadAction<string>) {
      state.form433aCompleted = state.form433aCompleted.filter((c) => c._id !== action.payload);
    },
    clear433aCompletedCases(state) {
      state.form433aCompleted = [];
      state.form433aCompletedPagination = null;
    },
    set433aCompletedPagination(state, action: PayloadAction<PaginationState | null>) {
      state.form433aCompletedPagination = action.payload;
    },

    // Form 433B - All forms
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
      state.form433bPagination = null;
    },
    set433bPagination(state, action: PayloadAction<PaginationState | null>) {
      state.form433bPagination = action.payload;
    },

    // Form 433B - Completed forms
    set433bCompletedCases(state, action: PayloadAction<FormCase[]>) {
      state.form433bCompleted = action.payload;
    },
    add433bCompletedCase(state, action: PayloadAction<FormCase>) {
      state.form433bCompleted.unshift(action.payload);
    },
    remove433bCompletedCase(state, action: PayloadAction<string>) {
      state.form433bCompleted = state.form433bCompleted.filter((c) => c._id !== action.payload);
    },
    clear433bCompletedCases(state) {
      state.form433bCompleted = [];
      state.form433bCompletedPagination = null;
    },
    set433bCompletedPagination(state, action: PayloadAction<PaginationState | null>) {
      state.form433bCompletedPagination = action.payload;
    },

    // Form 656
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
    set656Pagination(state, action: PayloadAction<PaginationState | null>) {
      state.form656Pagination = action.payload;
    },

    clearAllForms(state) {
      state.form433a = [];
      state.form433aCompleted = [];
      state.form433aPagination = null;
      state.form433aCompletedPagination = null;
      state.form433b = [];
      state.form433bCompleted = [];
      state.form433bPagination = null;
      state.form433bCompletedPagination = null;
    },
  },
});

export const {
  set433aCases,
  add433aCase,
  remove433aCase,
  clear433aCases,
  set433aPagination,
  set433aCompletedCases,
  add433aCompletedCase,
  remove433aCompletedCase,
  clear433aCompletedCases,
  set433aCompletedPagination,
  set433bCases,
  add433bCase,
  remove433bCase,
  clear433bCases,
  set433bPagination,
  set433bCompletedCases,
  add433bCompletedCase,
  remove433bCompletedCase,
  clear433bCompletedCases,
  set433bCompletedPagination,
  set656Cases,
  add656Case,
  remove656Case,
  clear656Cases,
  set656Pagination,
  clearAllForms,
} = formsSlice.actions;

export default formsSlice.reducer;
