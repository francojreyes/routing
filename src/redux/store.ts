import { configureStore } from '@reduxjs/toolkit'

import networkReducer from "./networkSlice";

const store = configureStore({
  reducer: {
    network: networkReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;