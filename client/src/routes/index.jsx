import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register"
import ChangePassword from "../pages/auth/ChangePassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";
import HomePage from "../pages/home/HomePage";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ManageUser from "../pages/admin/ManageUser";
import ManageCategory from "../pages/admin/ManageCategory";
import ManagerBrand from "../pages/admin/ManageBrand";
import ManageProduct from "../pages/admin/ManageProduct";
import ManageHashtag from "../pages/admin/ManageHashtag";
import ManageGift from "../pages/admin/ManageGift";
import AdminLayout from "../layouts/AdminLayout";
import ProductListingPage from "../components/product/ProductListingPage";
import ProductDetails from "../components/product/ProductDetails";
import CartPage from "../pages/cart/CartPage";
import OrderSuccess from "../pages/order/OrderSuccess";
import OrderLookup from "../pages/order/OrderLookup";
import HistoryPage from "../pages/order/HistoryPage";

const routes = [
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/cart",
        element: <CartPage/>
    },
    {
        path: "/order-success",
        element: <OrderSuccess/>
    },
    {
        path: "/order-lookup",
        element: <OrderLookup/>
    },
    {
      path: "/history",
        element: <HistoryPage/>
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login/>,
            },
            {
                path: "register",
                element: <Register/>,
            },
            {
                path: "change-password",
                element: <ChangePassword/>,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>,
            },
            {
                path: "forgot-password/verify-otp",
                element: <VerifyOTP/>,
            },
            {
                path: "reset-password",
                element: <ResetPassword/>,
            }
        ],
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
            {
                path: "manage-hashtag",
                element: <ManageHashtag/>
            },
            {
                path: "manage-gift",
                element: <ManageGift/>
            },
        ],
    },
    {
        path: "hashtag/:id",
        element: <ProductListingPage/>
    },
    {
        path: "/listing/:type",
        element: <ProductListingPage/>
    },
    {
        path: "/listing/:type",
        element: <ProductListingPage/>
    },
    {
        path: "/listing/:type/:id",
        element: <ProductListingPage/>
    },
    {
        path: "product/:id",
        element: <ProductDetails/>
    }
];

export default routes;
