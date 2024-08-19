import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/Home";
import LoginPage from "../pages/AuthenticatePage/Login";
import RegisterPage from "../pages/AuthenticatePage/Register";
import DetailProduct from "../pages/Product/DetailProduct";
import AccountPage from "../pages/Account/AccountPage";
import CartPage from "../pages/Cart/Cart";
import OrderPage from "../pages/Cart/Order";
import OrderDetailsPage from "../pages/Cart/OrderDetailsPage";
import ProductManagementPage from "../pages/Product/ProductManagement";
const PublicRoutes = (props) => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product-detail/:id" element={<DetailProduct />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/product-management" element={<ProductManagementPage />} />
        </Routes>
    )
}

export default PublicRoutes