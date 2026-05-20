"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { store, persistor } from "@/store";
import { Toaster } from "@/components/ui/Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SessionProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
            <Toaster />
          </PersistGate>
        </Provider>
      </SessionProvider>
    </ThemeProvider>
  );
}
