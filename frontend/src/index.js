import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/Auth/AuthContext";
import { LocationProvider } from "./context/Location/LocationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <LocationProvider>
       <App />
    </LocationProvider>
  </AuthProvider>
);
