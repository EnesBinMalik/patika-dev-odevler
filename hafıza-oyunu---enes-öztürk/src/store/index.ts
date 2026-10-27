import { configureStore } from '@reduxjs/toolkit';
import memoryReducer from './memorySlice';

export const store = configureStore({
  reducer: {
    memory: memoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
