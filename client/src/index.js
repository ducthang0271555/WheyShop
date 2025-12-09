// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { OtpProvider } from "./contexts/OtpContext";
import routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <OtpProvider>
      {/* ToastContainer đặt ngoài RouterProvider */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        pauseOnHover={false}
        hideProgressBar={true}
      />

      <RouterProvider router={router} />
    </OtpProvider>

  </React.StrictMode>
);
