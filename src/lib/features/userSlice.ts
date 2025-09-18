import { storage } from "@/utils/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  user: User | null;
  isLoggedIn: boolean;
}

// Initial state
const initialState: InitialState = {
  user: null,
  isLoggedIn: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to login user set user data and is login to true
    loginUser: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;

      storage.set("user", action.payload.user);
    },

    // Action to logout user
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;

      storage.remove("user");
    },
  },
});

// Export actions
export const { loginUser, logoutUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
