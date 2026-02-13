import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 1. IMPORT YOUR CSS (Fixes the missing background & fonts)
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");

// 2. TYPESCRIPT FIX: Add the '!' exclamation mark
// This tells TypeScript "I promise the root element exists"
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
