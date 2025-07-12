import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuthGuard from "./components/AuthGuard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthGuard>
        <App />
      </AuthGuard>
    </BrowserRouter>
  </React.StrictMode>
);