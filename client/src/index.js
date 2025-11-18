// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {OtpProvider} from "./contexts/OtpContext";
import routes from "./routes";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <OtpProvider>
            <RouterProvider router={router}/>
        </OtpProvider>
    </React.StrictMode>
);
