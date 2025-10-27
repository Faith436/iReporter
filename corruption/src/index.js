import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ReportProvider } from "./contexts/ReportContext";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ReportProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReportProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
