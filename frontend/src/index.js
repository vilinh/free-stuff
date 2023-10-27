import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import App from "./App";
import { UserPage } from "./components/UserPage/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ path: "user", element: <UserPage></UserPage> }],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
