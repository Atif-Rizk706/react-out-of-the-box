import "./Product.scss";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import '@smastrom/react-rating/style.css'

import { getUserToken } from "../../utils/CookisAuth";
import {
    useAddToCartMutation,
    useAddToFavMutation,
    useGetCartQuery
} from "../../redux/slice/cartSlice/cartSlice";
import { Heart } from "lucide-react";
import SmallLoad from "../SmallLoad/SmallLoad";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
    const token = getUserToken();
    const { t, i18n } = useTranslation();
    const [cuurentItem, setCuurentItem] = useState(false);
    const firebase_token = localStorage.getItem("fcmToken");
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const [addToFav, { isLoading: loadFav }] = useAddToFavMutation();
    const { data: cart = [] } = useGetCartQuery({
        lang: i18n.language,
        token: token,
        firebase_token: firebase_token
    });

    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: "#d4af37",
        inactiveFillColor: "#555",
        itemStrokeWidth: 0,
    };

    const handleAddToCart = async (ele) => {
        const data = {
            product_id: ele.id,
            quantity: 1,
            price: ele.current_price,
            firebase_id: firebase_token
        }

        try {
            await addToCart({
                token: token,
                payload: data
            }).unwrap()
            toast.success(t("added_to_cart"));
        } catch {
            toast.error(t("error"));
        }
    }

    useEffect(() => {
        const item = cart?.data?.list_item.find(el => el.id === product?.id)
        if (item) {
            setCuurentItem(true)
        } else {
            setCuurentItem(false)
        }
    }, [cart?.data?.list_item, product?.id])

    const handleAddFav = async (id) => {
        if (token) {
            const res = await addToFav({
                token: token,
                id: id
            }).unwrap()
            toast.success(res.msg);
        } else {
            toast.error(t("please_login"));
        }
    }

    return (
        <div className="product">
            <Link to={`/shop/${product?.category_id}/product-details/${product?.id}`} className="image">
                <img src={product?.image_path} alt={product?.title_img} />
            </Link>

            <div className="content">
                <button className="fav-btn" onClick={() => handleAddFav(product?.id)}>
                    {loadFav ? <SmallLoad /> : <Heart />}
                </button>

                <div className="rate">
                    <Rating
                        style={{ maxWidth: 70 }}
                        value={+product?.hasReviews}
                        itemStyles={myStyles}
                        readOnly
                    />
                    <span>{+product?.hasReviews}</span>
                </div>

                <h3>{product?.name}</h3>

                <div className="price">
                    <p className="cuurent">EGP{product?.current_price}</p>
                    {+product?.old_price > 0 &&
                        <p className="old">EGP{+product?.old_price}</p>
                    }
                </div>


                <div className="btn-cart">
                    {cuurentItem ? <p>{t("product_in_cart")}</p> :
                        <button
                            className="add-to-cart"
                            onClick={() => handleAddToCart(product)}
                            disabled={isLoading}
                        >
                            {isLoading ? <SmallLoad /> : t("add_to_cart")}
                        </button>
                    }

                    <Link
                                to="/check-out-direct"   
                                state={{
                                    product_id: product.id,
                                    product_name: product.name,
                                    quantity: 1,
                                    price:   product.current_price ,
                                    total: product.current_price * 1,
                                    is_offer:false,
                                    image: product.image_path || product.image
                                }}
                                >
                                <button className="buy-now">{t("buy_now")}</button>
                            </Link>
                </div>
                 <div className="btn-cart">
                         
                 </div>
                
            </div>
        </div>
    );
}

export default Product;