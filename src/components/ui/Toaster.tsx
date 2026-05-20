"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
}
