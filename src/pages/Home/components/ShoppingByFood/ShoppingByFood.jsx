import "./ShoppingByFood.scss";
import SmallLoad from "../../../../components/SmallLoad/SmallLoad";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

const ShoppingByFood = ({ data, loading }) => {
    const { t } = useTranslation();

    return (
        <div className="shopping-by-food">
            <div className="container">
                <h2 className="head-section">{t("shop_by_food")}</h2>

                <div className="categories">

                    {loading ? <SmallLoad /> :
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={15}
                            speed={1000}
                            loop={data?.length > 7}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper"
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                },
                                768: {
                                    slidesPerView: 4,
                                },
                                1024: {
                                    slidesPerView: 7,
                                },
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                        >
                            {data.data.map((el) => (
                                <SwiperSlide>
                                    <Link to={`/shop/${el.id}`} className="box" key={el.id}>
                                        <img src={el.img} alt={`image-${el.id}`} />
                                        <p>{el.name}</p>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    }
                </div>

            </div>
        </div>
    );
}

export default ShoppingByFood;