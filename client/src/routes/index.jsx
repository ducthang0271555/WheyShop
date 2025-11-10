import Login from "../pages/auth/Login";
import HomePage from "../pages/home/HomePage";
import Dashboard from "../pages/admin/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ManageUser from "../pages/admin/ManageUser";
import ManageCategory from "../pages/admin/ManageCategory";
import ManagerBrand from "../pages/admin/ManageBrand";
import ManageProduct from "../pages/admin/ManageProduct";
import AdminLayout from "../layouts/AdminLayout";

const routes = [
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/auth/login",
        element: <Login/>,
    },
    {
        path: "/admin",
        element: (
            <PrivateRoute requiredRole={1}>
                <AdminLayout/>
            </PrivateRoute>
        ),
        children: [
            {
                path: "dashboard",
                element: <Dashboard/>,
            },
            {
                path: "manage-user",
                element: <ManageUser/>,
            },
            {
                path: "manage-category",
                element: <ManageCategory/>,
            },
            {
                path: "manage-brand",
                element: <ManagerBrand/>
            },
            {
                path: "manage-product",
                element: <ManageProduct/>
            },
        ],
    },
];

export default routes;
