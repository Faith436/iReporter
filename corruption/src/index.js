import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ReportProvider } from "./contexts/ReportContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import reportWebVitals from "./reportWebVitals";

import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ReportProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ReportProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
