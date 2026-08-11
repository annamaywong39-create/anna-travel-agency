import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Keep old HashRouter links working after the SEO-friendly BrowserRouter migration.
if (window.location.hash.startsWith('#/')) {
  const cleanPath = window.location.hash.slice(1) || '/';
  window.history.replaceState(null, '', cleanPath);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
