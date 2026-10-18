import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./styles.css";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";
import { NotFound } from "./not-found.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

// GitHub Pages serves dist/404.html, a copy of index.html, for every unknown path.
const isHome = location.pathname === "/" || location.pathname === "/index.html";
if (!isHome) document.title = "Page not found · Artur Rok";

createRoot(root).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">{isHome ? <App /> : <NotFound />}</MotionConfig>
  </StrictMode>,
);
