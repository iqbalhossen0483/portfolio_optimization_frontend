import { configureStore, type Reducer } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { api } from "./api";
import chatReducer from "./slices/chatSlice";
import trainingReducer from "./slices/trainingSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";

const trainingPersistConfig = {
  key: "training",
  storage,
  whitelist: ["jobIds"],
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    chat: chatReducer,
    training: persistReducer(
      trainingPersistConfig,
      trainingReducer,
    ) as unknown as Reducer,
    ui: uiReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
