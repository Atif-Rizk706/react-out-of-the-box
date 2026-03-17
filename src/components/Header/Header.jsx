import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { Check, ChevronDown, Heart, Mail, Menu, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MenuPhone from "./MenuPhone/MenuPhone";
import { changeLang } from "../../utils/functions";

import BoxEmpty from "../../assets/box-empty.png"
import { getUserToken } from "../../utils/CookisAuth";
import { useGetCartQuery } from "../../redux/slice/cartSlice/cartSlice";

const Header = () => {
    const { t, i18n } = useTranslation();
    const [menuControl, setMenuControl] = useState(null);
    const [menuPhone, setMenuPhone] = useState(false);
    const navigate = useNavigate();
    const userRef = useRef();
    const cartRef = useRef();
    const token = getUserToken();
    const firebase_token = localStorage.getItem("fcmToken");

    const { data: cart = [] } = useGetCartQuery({
        lang: i18n.language,
        token: token,
        firebase_token: firebase_token
    });

    console.log(cart)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                userRef.current && !userRef.current.contains(e.target) &&
                cartRef.current && !cartRef.current.contains(e.target)
            ) {
                setMenuControl(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (e.target.elements.search.value) {
            navigate(`/search?s=${e.target.elements.search.value}`);
        }
    }

    return (
        <div className="header">
            <div className="bar">
                <div className="box">
                    <Swiper
                        navigation={true}
                        modules={[Navigation, Autoplay]}
                        className="mySwiper"
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        speed={1000}
                        loop={true}
                        dir="ltr"
                    >
                        <SwiperSlide>
                            <p>{t("ads_1")}</p>
                        </SwiperSlide>
                        <SwiperSlide>
                            <p>{t("ads_2")}</p>
                        </SwiperSlide>
                        <SwiperSlide>
                            <p>{t("ads_3")}</p>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            <div className="head-1">
                <div className="container">
                    <ul>
                        {/* <li>
                            <a href="tel:0123456789">
                                <span><Phone /></span>
                                <span>0123456789</span>
                            </a>
                        </li>

                        <li>
                            <a href="mailto:user123@gmail.com">
                                <span><Mail /></span>
                                <span>user123@gmail.com</span>
                            </a>
                        </li> */}
                        <li>
                            <Link to="/about">{t("who_we_are")}</Link>
                        </li>
                        <li>
                            <Link to="/contact">{t("contact")}</Link>
                        </li>
                        <li>
                            <span><Check /></span>
                            <span>{t("free_shipping")}</span>
                        </li>
                        <li>
                            <span><Check /></span>
                            <span>{t("secure_payment")}</span>
                        </li>
                    </ul>

                    <div className="lang">
                        <p>
                            <span><ChevronDown /></span>
                            <span>
                                {i18n.language === "en" ? "English" : "العربية"}
                            </span>
                        </p>

                        <ul>
                            {i18n.language !== "en" &&
                                <li>
                                    <button onClick={() => changeLang(i18n)}>English</button>
                                </li>
                            }
                            {i18n.language !== "ar" &&
                                <li>
                                    <button onClick={() => changeLang(i18n)}>العربية</button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className="head-2">
                <div className="container">
                    <div className="logo">
                        <Link to="/">
                            <img src="/lo.png" alt="logo" />
                        </Link>

                        <div className="btns">
                            {token &&
                                <Link to="/wishlist" className="fav">
                                    <Heart />
                                </Link>
                            }

                            <Link to="/cart" className="cart">
                                <ShoppingCart />
                            </Link>

                            <button className="menu-icon" onClick={() => setMenuPhone(prev => !prev)}>
                                <Menu />
                            </button>
                        </div>
                    </div>

                    <div className="search">
                        <form onSubmit={handleSearch}>
                            <span><Search /></span>
                            <input
                                name="search"
                                type="text"
                                placeholder={t("placeholder_main_search")} />
                            <button type="submit">{t("search")}</button>
                        </form>
                    </div>

                    <div className="control">
                        {token &&
                            <Link to="/wishlist" className="fav">
                                <Heart />
                            </Link>
                        }

                        <div className="user-box" ref={userRef}>
                            {token ?
                                <Link to="/profile" className="head">
                                    <span className="user">
                                        <UserRound />
                                    </span>

                                    <div>
                                        <p>{t("hello")}</p>
                                        <span>{t("account")}</span>
                                    </div>
                                </Link>
                                :
                                <div className="head" onClick={() => setMenuControl("user")}>
                                    <span className="user">
                                        <UserRound />
                                    </span>

                                    <div>
                                        <p>{t("login")}</p>
                                        <span>{t("account")}</span>
                                    </div>
                                </div>
                            }

                            {menuControl === "user" &&
                                <div className="menu">
                                    <p>{t("register_and_enjoy_discount")}</p>
                                    <Link to="login" onClick={() => setMenuControl(null)}>{t("login")}</Link>
                                    <p>
                                        {t("new_customer")} {" "}
                                        <Link
                                            to="/register"
                                            onClick={() => setMenuControl(null)}
                                        >
                                            {t("register_now")}
                                        </Link>
                                    </p>
                                </div>
                            }
                        </div>

                        <div className="cart-box" ref={cartRef}>
                            <div className="head" onClick={() => setMenuControl("cart")}>
                                <span className="cart">
                                    <ShoppingCart />
                                </span>

                                <div>
                                    <p>EGP {Number(cart?.data?.totalPrice).toFixed(2)}</p>
                                    <span>{t("cart_total")}</span>
                                </div>
                            </div>

                            {menuControl === "cart" &&
                                <div className="menu">
                                    {cart?.data?.list_item?.length > 0 ?
                                        <div className="products">
                                            {cart?.data?.list_item.slice(0, 2).map((el) => (
                                                <div className="item" key={el.id}>
                                                    <div className="image">
                                                        <img src={el.image} alt={`image-${el.id}`} />
                                                    </div>

                                                    <div className="info">
                                                        <h4>{el.name}</h4>
                                                        <p>
                                                            <span>EGP{Number(el.price).toFixed(2)}</span>
                                                            <span>{"x"}</span>
                                                            <span>{el.quantity}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="btns">
                                                <Link to="/cart">{t("shopping_cart")}</Link>
                                                <Link
                                                    to="/check-out"
                                                    state={{
                                                        totalPrice: Number(cart?.data?.totalPrice).toFixed(2)
                                                    }}
                                                >{t("checkout")}</Link>
                                            </div>
                                        </div>
                                        :
                                        <div className="no-items">
                                            <img src={BoxEmpty} alt="box-icon" />
                                            <span>{t("no_products_in_cart")}</span>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="head-3">
                <div className="container">
                    <ul className="links">
                        <li>
                            <Link to="/">{t("home")}</Link>
                        </li>
                        <li>
                            <Link to="categories">{t("categorys")}</Link>
                        </li>
                        <li>
                            <Link to="/offers">{t("offers")}</Link>
                        </li>
                        <li>
                            <Link to="/blogs">{t("blog")}</Link>
                        </li>
                        <li>
                            <Link to="/faqs">{t("faqs")}</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <MenuPhone menuPhone={menuPhone} setMenuPhone={setMenuPhone} />
        </div>
    );
}

export default Header;