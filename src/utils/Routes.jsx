import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Layout from "../pages/Layout/Layout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import SearchPage from "../pages/SearchPage/SearchPage";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import CheckOutDirect from "../pages/CheckOut/CheckOutDirect";

const WhoWeAre = React.lazy(() => import("../pages/StaticPages/WhoWeAre/WhoWeAre"));
const Contact = React.lazy(() => import("../pages/StaticPages/Contact/Contact"));
const CustomerService = React.lazy(() => import("../pages/StaticPages/CustomerService/CustomerService"));
const PrivacyPolicy = React.lazy(() => import("../pages/StaticPages/PrivacyPolicy/PrivacyPolicy"));
const ReturnPolicy = React.lazy(() => import("../pages/StaticPages/ReturnPolicy/ReturnPolicy"));
const TermsAndConditions =
    React.lazy(() => import("../pages/StaticPages/TermsAndConditions/TermsAndConditions"));
const Blogs = React.lazy(() => import("../pages/Blogs/Blogs"));
const Faqs = React.lazy(() => import("../pages/Faqs/Faqs"));
const BlogDetails = React.lazy(() => import("../pages/BlogDetails/BlogDetails"));
const Shop = React.lazy(() => import("../pages/Shop/Shop"));
const Wishlist = React.lazy(() => import("../pages/Wishlist/Wishlist"));
const CartPage = React.lazy(() => import("../pages/cart/CartPage/CartPage"));
const CheckOut = React.lazy(() => import("../pages/CheckOut/CheckOut"));
const Offers = React.lazy(() => import("../pages/Offers/Offers"));
const Categories = React.lazy(() => import("../pages/Categories/Categories"));
const Profile = React.lazy(() => import("../pages/Auth/Profile/Profile"));

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/check-out-direct",
                element: <CheckOutDirect />
            },
            {
                index: true,
                element: <Home />
            },
            {
                path: "*",
                element: <NotFound />
            },
            {
                path: "/about",
                element: <WhoWeAre />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/customer-service",
                element: <CustomerService />
            },
            {
                path: "/privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "/return-policy",
                element: <ReturnPolicy />
            },
            {
                path: "/terms-and-conditions",
                element: <TermsAndConditions />
            },
            {
                path: "/blogs",
                element: <Blogs />
            },
            {
                path: "/faqs",
                element: <Faqs />
            },
            {
                path: "/blogs/blog-details/:id",
                element: <BlogDetails />
            },
            {
                path: "/search",
                element: <SearchPage />
            },
            {
                path: "/categories",
                element: <Categories />
            },
            {
                path: "/shop/:id",
                element: <Shop />
            },
            {
                path: "/shop/:id1/product-details/:id2",
                element: <ProductDetails />
            },
            {
                path: "/wishlist",
                element: <Wishlist />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/check-out",
                element: <CheckOut />
            },
            {
                path: "/offers",
                element: <Offers />
            },
            {
                path: "/profile",
                element: <Profile />
            },
        ]
    },

])

export default routes;