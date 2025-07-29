import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: true, // Start with loading true for initial load
    loadingMessage: 'Loading...',
  },
  reducers: {
    showLoading: (state, action) => {
      state.isLoading = true;
      state.loadingMessage = action.payload || 'Loading...';
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
  },
});

export const { showLoading, hideLoading, setLoadingMessage } = loadingSlice.actions;
export default loadingSlice.reducer;