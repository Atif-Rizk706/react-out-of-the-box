import "./ProductInfo.scss";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation, Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-cards';
import { Link } from "react-router-dom";


import SmallLoad from "../../../components/SmallLoad/SmallLoad";
import { getUserToken } from "../../../utils/CookisAuth";
import { useAddToCartMutation } from "../../../redux/slice/cartSlice/cartSlice";
import DefaultImage from "../../../assets/no-image.jpg"

const ProductInfo = ({ productDetails, cart }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const [cuurentItem, setCuurentItem] = useState(false)
    const firebase_token = localStorage.getItem("fcmToken")
    const token = getUserToken();
    const { t } = useTranslation();
    const [openPopupImages, setOpenPopupImages] = useState(false)
    const [imagesList, setImagesList] = useState([]);

    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: "#d4af37",
        inactiveFillColor: "#555",
        itemStrokeWidth: 0,
    };

    const navigate = useNavigate();

const handleBuyNow = (offer) => {
  const product = productDetails.Data["Product-Details"][0];

  navigate("/checkout-direct", {
    state: {
      product_id: product.id,
      product_name: product.name,
      quantity: offer.number_of_peaces,
      price: offer.price,
      total: offer.number_of_peaces * offer.price,
      image: product.image_path
    }
  });
};

    const handleAddToCart = async () => {
        const data = {
            product_id: productDetails.Data["Product-Details"][0].id,
            quantity: quantity,
            price: productDetails.Data["Product-Details"][0].current_price,
            firebase_id: firebase_token
        }

        try {
            await addToCart({
                token: token,
                payload: data
            }).unwrap()

            toast.success(t("added_to_cart"));
        } catch {
            toast.error(t("unexpected_error"));
        }
    }
 
    useEffect(() => {
        const item =
            cart?.data?.list_item.find(el => el.id === productDetails.Data["Product-Details"][0].id)
        if (item) {
            setCuurentItem(true)
        }
    }, [cart?.data?.list_item, productDetails?.Data]);

    return (
        <div className="product-info">
            <div className="slider">
                <div className="swiper-gallery-container">
                    {(productDetails.Data?.["Product-Details"]?.[0]?.images || []).length > 0 ?
                        <>
                            <Swiper
                                spaceBetween={10}
                                navigation={false}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Thumbs, Navigation, Autoplay]}
                                className="main-swiper"
                                speed={800}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true
                                }}
                            >
                                {(productDetails?.Data?.["Product-Details"]?.[0]?.images || []).map((image, id) => (
                                    <SwiperSlide key={id}>
                                        <img
                                            src={image}
                                            alt={`Image-${id}`}
                                            width={415}
                                            height={300}
                                            onClick={() => {
                                                setImagesList(productDetails?.Data?.["Product-Details"]?.[0]?.images)
                                                setOpenPopupImages(true)
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Thumbs]}
                                className="thumbs-swiper"
                            >
                                {(productDetails.Data?.["Product-Details"]?.[0]?.images || []).map((image, id) => (
                                    <SwiperSlide key={id}>
                                        <img
                                            src={image}
                                            alt={`Image-${id}`}
                                            width={95}
                                            height={75}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </>
                        :
                        <>
                            {productDetails.Data?.["Product-Details"]?.[0]?.image ?
                                <img
                                    src={productDetails.Data?.["Product-Details"]?.[0]?.image}
                                    alt={`Image-Product`}
                                    width={95}
                                    height={75}
                                />
                                :
                                <img
                                    src={DefaultImage}
                                    alt={`Image-Default`}
                                    width={95}
                                    height={75}
                                />
                            }
                        </>
                    }

                </div>
            </div>

            <div className="info">
                <h3>{productDetails?.Data?.["Product-Details"]?.[0]?.name}</h3>

                <div className="rate" style={{ direction: "ltr" }}>
                    <Rating
                        style={{ maxWidth: 70 }}
                        value={+productDetails?.Data?.["Product-Details"]?.[0]?.hasReviews}
                        itemStyles={myStyles}
                        readOnly
                    />
                    <span>|</span>
                    <p>{t("ratings")}</p>
                </div>

                <div
                    dangerouslySetInnerHTML={{ __html: productDetails?.Data?.["Product-Details"]?.[0]?.detailsweb }} className="desc"
                />

                <div className="price-sku">
                    <div className="price">
                        <p className="new">
                            {productDetails?.Data?.["Product-Details"]?.[0]?.current_price} EGP
                        </p>
                        {+productDetails?.Data?.["Product-Details"]?.[0]?.old_price > 0 &&
                            <p className="old">
                                {productDetails?.Data?.["Product-Details"]?.[0]?.old_price} EGP
                            </p>
                        }
                    </div>

                    <div>
                        <p className="sku">
                            {t("sku")}: {productDetails?.Data?.["Product-Details"]?.[0]?.id}
                        </p>
                        <p className="stock">
                            {+productDetails?.Data?.["Product-Details"]?.[0]?.quantity > 0 ?
                                <>
                                    {t("in_stock")}
                                    <span
                                        style={{ color: +productDetails?.Data?.["Product-Details"]?.[0].quantity > 10 ? "" : "red" }}
                                    >
                                        ({+productDetails?.Data?.["Product-Details"]?.[0].quantity})
                                    </span>
                                </>
                                :
                                <>{t("out_of_stock")}</>
                            }
                        </p>
                    </div>
                </div>

                <div className="control">
                    {cuurentItem ? <p>{t("product_in_cart")}</p> :
                        <>
                            <div className="quantity">
                                <button onClick={() => {
                                    if (quantity === 1) {
                                        return;
                                    } else {
                                        setQuantity(quantity - 1)
                                    }
                                }}><Minus /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus /></button>
                            </div>

                            <button className="cart" onClick={handleAddToCart} disabled={isLoading}>
                                {isLoading ?
                                    <SmallLoad />
                                    :
                                    <>
                                        <ShoppingCart />
                                    </>
                                }
                            </button>
                             <Link
                                to="/check-out-direct"   
                                state={{
                                    product_id: productDetails.Data["Product-Details"][0].id,
                                    product_name: productDetails.Data["Product-Details"][0].name,
                                    quantity: quantity,
                                    price:   productDetails.Data["Product-Details"][0].current_price ,
                                    total: productDetails.Data["Product-Details"][0].current_price * quantity,
                                    is_offer:false,
                                    image: productDetails.Data["Product-Details"][0].image_path || productDetails.Data["Product-Details"][0].image
                                }}
                                >
                                <button className="buy-now">{t("buy_now")}</button>
                            </Link>
                          
                        </>
                    }
                </div>


                 {/* OFFERS – Independent from Cart */}
                {productDetails?.Data?.["Product-Details"]?.[0]?.offers?.length > 0 && (
                <div className="offers">
                <h4 className="offers-title">{t("offers")}</h4>
                
                {productDetails.Data["Product-Details"][0].offers.map((offer) => (
                    <div className="
                    offer-card" key={offer.ID}>
                    
                    <div className="offer-left">
                        <p className="offer-text">
                        {t("buy")} <span>{offer.number_of_peaces}</span> {t("pieces")}
                        </p>
                
                        <p className="offer-price">
                        {offer.price} EGP
                        </p>
                    </div>
                    <Link
                        to="/check-out-direct"
                        state={{
                            product_id: productDetails.Data["Product-Details"][0].id,
                            product_name: productDetails.Data["Product-Details"][0].name,
                            quantity: offer.number_of_peaces,
                            price:   offer.price / offer.number_of_peaces ,
                            total: offer.price,
                            is_offer:false,
                            image: productDetails.Data["Product-Details"][0].image_path || productDetails.Data["Product-Details"][0].image
                        }}
                        >
                        <button className="buy-now">{t("buy_now")}</button>
                     </Link>
                   
                
                    </div>
                ))}
                </div>
             
                )}
            </div>


           


            {/* Popup Images */}
            {openPopupImages &&
                <div className="popup-images" onClick={() => setOpenPopupImages(false)}>
                    <div className="content" onClick={(e) => e.stopPropagation()}>
                        <Swiper
                            effect={'cards'}
                            grabCursor={true}
                            modules={[EffectCards]}
                            className="mySwiper"
                        >
                            {imagesList.map((el, idx) => (
                                <SwiperSlide key={idx}>
                                    <img src={el} alt="image" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            }
        </div>
    );
}

export default ProductInfo;