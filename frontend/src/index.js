import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/Auth/AuthContext";
import { LocationProvider } from "./context/Location/LocationContext";
import { NotifProvider } from "./context/Notifications/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<NotifProvider>
		<AuthProvider>
			<LocationProvider>
				<App />
			</LocationProvider>
		</AuthProvider>
	</NotifProvider>
);
