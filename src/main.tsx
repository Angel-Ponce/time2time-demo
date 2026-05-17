import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Time2Time } from "./time-2-time.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Time2Time />
  </StrictMode>,
);
