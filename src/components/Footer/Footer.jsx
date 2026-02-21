import "./Footer.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faTwitter,
    faWhatsapp,
    faInstagram
} from "@fortawesome/free-brands-svg-icons";
import LogoAtive from "../../assets/logoActive.png";
import Android from "../../assets/android.png";
import Apple from "../../assets/apple.png";
import { useContactPagesQuery } from "../../redux/slice/contactSlice/contactSlice";

const Footer = () => {
const { t, i18n } = useTranslation();    
    const { data, isLoading } = useContactPagesQuery({
        lang: i18n.language
    });

    // تحويل array إلى object
    const socials = data?.data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {}) || {};
    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <img
                            src="/lo.png"
                            alt="logo"
                            loading="lazy"
                            width={220}
                            height={50}
                        />

                        <p>{t("title_footer")}</p>

                       {/*  <div className="app">
                            <a href="">
                                <img
                                    src={Android}
                                    alt="android_logo"
                                    loading="lazy"
                                    width={130}
                                    height={43}
                                />
                            </a>
                            <a href="">
                                <img
                                    src={Apple}
                                    alt="apple_logo"
                                    loading="lazy"
                                    width={130}
                                    height={43}
                                />
                            </a>
                        </div> */}

                    </div>

                    <div className="col">
                        <h3>{t("ourPages")}</h3>


                        <div className="socials">
                            {socials.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                            )}

                            {socials.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                            )}

                            {socials.whatsapp && (
                                <a
                                    href={`https://wa.me/${socials.whatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </a>
                            )}

                            {socials.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                            )}
                        </div>


                       {/*  <Link to="/about">{t("who_we_are")}</Link>
                        <Link to="/customer-service">{t("customer_service")}</Link> */}
                    </div>

                    <div className="col">
                         <p>© {new Date().getFullYear()} OutOfBox. All rights reserved.</p>
                    </div>

                  {/*   <div className="col">
                        <h3>{t("about_us")}</h3>

                        <p>{t("commercial_num")}: 86564534</p>
                        <p>{t("tax_num")}: 8656454</p>
                    </div> */}
                </div>
            </div>

           {/*  <div className="copyright">
                <div className="container">
                    <img src={LogoAtive} alt="logo-active" />
                    <p>Powered By Active4Web</p>
                </div>
            </div> */}
        </div>
    );
}

export default Footer;