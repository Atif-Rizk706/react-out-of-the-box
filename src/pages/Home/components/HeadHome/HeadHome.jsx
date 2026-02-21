import "./HeadHome.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/pagination";

import SmallLoad from "../../../../components/SmallLoad/SmallLoad";

const HeadHome = ({ slider, categories, loading }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="head-home">
            <div className="container">
                {/* <div className="categories">
                    {loading ? <SmallLoad /> :
                        <ul>
                            {categories?.data?.map(el => (
                                <li key={el.id}>
                                    <Link to={`/shop/${el.id}`}>
                                        <span><LayoutGrid /></span>
                                        <span>{el.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    }
                </div> */}

                <div className="slider">
                    {loading ? <SmallLoad /> :
                        <Swiper
                            navigation={true}
                            className="mySwiper"
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Navigation, Autoplay, Pagination]}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            speed={1000}
                            loop={true}
                            dir="ltr"
                        >
                            {slider?.data?.map((el) => (
                                <SwiperSlide key={el.ID}>
                                    <div className="box" dir={`${i18n.language === "ar" ? "rtl" : "ltr"}`}>
                                        <img src={el.image_web} alt={`image-${el.ID}`} />

                                        <div className="info">
                                            <div className="content">
                                                <h1>{el.title}</h1>
                                                <p>{el.sub_title}</p>
                                                <Link to="/">{t("show_more")}</Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    }
                </div>
            </div>
        </div>
    );
}

export default HeadHome;