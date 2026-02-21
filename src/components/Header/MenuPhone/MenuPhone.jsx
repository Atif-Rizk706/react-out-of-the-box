import "./MenuPhone.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Check,
    FileText,
    HelpCircle,
    Home,
    Info,
    LayoutGrid,
    Phone,
    Tag,
    UserRound,
    X
} from "lucide-react";
import { changeLang } from "../../../utils/functions";
import { useState } from "react";

const MenuPhone = ({ menuPhone, setMenuPhone }) => {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState(false)

    return (
        <div className={`menu-phone ${menuPhone ? "active" : ""}`}>
            <div className="head-menu">
                <button className="close-menu" onClick={() => setMenuPhone(false)}>
                    <X />
                </button>

                <div className="lang">
                    <button onClick={() => setLang(prev => !prev)}>
                        {i18n.language === "en" ? "English" : "العربية"}
                    </button>

                    {lang &&
                        <div className="menu">
                            <ul>
                                {i18n.language !== "en" &&
                                    <li>
                                        <button onClick={() => {
                                            changeLang(i18n);
                                            setMenuPhone(false)
                                            setLang(false)
                                        }}>English</button>
                                    </li>
                                }
                                {i18n.language !== "ar" &&
                                    <li>
                                        <button onClick={() => {
                                            changeLang(i18n);
                                            setMenuPhone(false)
                                            setLang(false)
                                        }}>العربية</button>
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                </div>

                <div className="logo">
                    <img src="/lo.png" alt="logo" />
                </div>
            </div>

            <div className="links">
                <ul>
                    <li>
                        <Link to="/" onClick={() => setMenuPhone(false)}>
                            <span><Home size={18} /></span>
                            <span>{t("home")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/categories" onClick={() => setMenuPhone(false)}>
                            <span><LayoutGrid size={18} /></span>
                            <span>{t("categorys")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setMenuPhone(false)}>
                            <span><Info size={18} /></span>
                            <span>{t("who_we_are")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" onClick={() => setMenuPhone(false)}>
                            <span><Phone size={18} /></span>
                            <span>{t("contact")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/offers" onClick={() => setMenuPhone(false)}>
                            <span><Tag size={18} /></span>
                            <span>{t("offers")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/blogs" onClick={() => setMenuPhone(false)}>
                            <span><FileText size={18} /></span>
                            <span>{t("blog")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/faqs" onClick={() => setMenuPhone(false)}>
                            <span><HelpCircle size={18} /></span>
                            <span>{t("faqs")}</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="other-links">
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
                        <span><Check /></span>
                        <span>{t("free_shipping")}</span>
                    </li>
                    <li>
                        <span><Check /></span>
                        <span>{t("secure_payment")}</span>
                    </li>
                </ul>
            </div>

            <Link to="/login" className="user-menu" onClick={() => setMenuPhone(false)}>
                <span className="user">
                    <UserRound />
                </span>

                <div>
                    <p>{t("login")}</p>
                    <span>{t("account")}</span>
                </div>
            </Link>
        </div>
    );
}

export default MenuPhone;