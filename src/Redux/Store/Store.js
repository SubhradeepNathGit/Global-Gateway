import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from '../Slice/loadingSlice';


export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    // Add other reducers here as you create them
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;