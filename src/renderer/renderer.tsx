/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit: https://electronjs.org/docs/latest/tutorial/process-model
 */

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./public/index.css";
import "./public/googlefonts/PT-Sans.css";
import "./public/fontawesome/free.css";

console.log("Versions:", window.mainApi.versions);

// render the app
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
