import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  portfolioSheetOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
  portfolioSheetOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setPortfolioSheetOpen(state, action: PayloadAction<boolean>) {
      state.portfolioSheetOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setPortfolioSheetOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
