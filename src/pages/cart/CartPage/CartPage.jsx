import "./CartPage.scss";
import { useAddToCartMutation, useDelFromCartMutation, useGetCartQuery }
    from "../../../redux/slice/cartSlice/cartSlice";
import { getUserToken } from "../../../utils/CookisAuth";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";
import { Link } from "react-router-dom";
import SmallLoad from "../../../components/SmallLoad/SmallLoad";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
    const [quantities, setQuantities] = useState({});
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const { t, i18n } = useTranslation();
    const [addToCart] = useAddToCartMutation();
    const [loadingItems, setLoadingItems] = useState({});
    const [isItem, setIdItem] = useState(null)
    const [delFromCart] = useDelFromCartMutation()
    const token = getUserToken();
    const firebase_token = localStorage.getItem("fcmToken");
    const { data = {}, isLoading } = useGetCartQuery({
        token: token,
        lang: i18n.language,
        firebase_token: firebase_token
    });

    useEffect(() => {
        if (data?.data?.list_item) {
            const initialQuantities = {};
            data.data.list_item.forEach(item => {
                initialQuantities[item.id] = item.quantity;
            });
            setQuantities(initialQuantities);
        }
    }, [data]);

    const totalCartPrice = data?.data?.list_item?.reduce((acc, item) => {
        const qty = quantities[item.id] || 1;
        return acc + (item.price * qty);
    }, 0) || 0;

    if (isLoading) {
        return <Loading />
    }

    const handleUpdateCart = async (ele, newQty) => {
        setLoadingItems(prev => ({ ...prev, [ele.id]: true }));

        try {
            await addToCart({
                token: token,
                payload: {
                    product_id: ele.id,
                    quantity: newQty,
                    price: ele.price,
                    firebase_id: firebase_token
                }
            }).unwrap();

            toast.success(t("quantity_updated"));
        } catch {
            toast.error(t("update_error"));
        } finally {
            setLoadingItems(prev => ({ ...prev, [ele.id]: false }));
        }
    };

    const handleDelItemCart = async (id) => {
        setIdItem(id);
        try {
            await delFromCart({
                token: token,
                id,
                firebase_token
            }).unwrap();
            setQuantities(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            toast.success(t("removed_from_cart"));
        } finally {
            setIdItem(null);
        }
    };

    return (
        <div className="cart-page">
            <div className="page">
                {data?.data?.list_item.length > 0 ?
                    <div className="container">
                        <div className="items">
                            <table>
                                <thead>
                                    <tr>
                                        <td>{t("product")}</td>
                                        <td>{t("price")}</td>
                                        <td>{t("quantity")}</td>
                                        <td>{t("total")}</td>
                                        <td>{t("delete")}</td>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data?.data?.list_item?.length > 0 && data.data.list_item.map(el => (
                                        <tr key={el.id}>
                                            <td>
                                                <img src={el.image} alt="" />
                                                <p>{el.name}</p>
                                            </td>
                                            <td>EGP{el.price}</td>
                                            <td>
                                                <div className="quantity">
                                                    <button
                                                        onClick={() => {
                                                            const newQty = (quantities[el.id] || 1) + 1;
                                                            setQuantities(prev => ({ ...prev, [el.id]: newQty }));
                                                            handleUpdateCart(el, newQty);
                                                        }}
                                                        disabled={loadingItems[el.id]}
                                                    >
                                                        <Plus />
                                                    </button>

                                                    <span>
                                                        {loadingItems[el.id] ? <SmallLoad /> : quantities[el.id] || 1}
                                                    </span>

                                                    <button
                                                        onClick={() => {
                                                            const newQty = Math.max((quantities[el.id] || 1) - 1, 1);
                                                            setQuantities(prev => ({ ...prev, [el.id]: newQty }));
                                                            handleUpdateCart(el, newQty);
                                                        }}
                                                        disabled={loadingItems[el.id]}
                                                    >
                                                        <Minus />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                ${(el.price * (quantities[el.id] || 1)).toFixed(2)}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelItemCart(el.item_id)}
                                                    disabled={isItem === el.item_id}
                                                >
                                                    {isItem === el.item_id ? <SmallLoad /> : <Trash2 />} تتتتتتت
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="check-price">
                            <div className="subtotal">
                                <strong>{t("subtotal")}:</strong>
                                <span>EGP{totalCartPrice.toFixed(2)}</span>
                            </div>

                            <div className="coupon">
                                <input
                                    type="text"
                                    placeholder={t("enter_coupon_code")}
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    className="apply-btn"
                                    onClick={() => {
                                        if (couponCode === "000") {
                                            setDiscount(totalCartPrice * 0.1);
                                            toast.success(t("price_updated"));
                                        } else {
                                            setDiscount(0);
                                            toast.error(t("invalid_coupon"))
                                        }
                                    }}
                                >
                                    {t("apply")}
                                </button>
                            </div>

                            <div className="total">
                                <strong>{t("total_after_discount")}:</strong>
                                <span>ُEGP{Math.round((totalCartPrice - discount) * 100) / 100}</span>
                            </div>

                            <Link
                                to="/check-out"
                                state={{
                                    totalPrice: Math.round((totalCartPrice - discount) * 100) / 100,
                                    coupon: couponCode
                                }}
                                className="checkout-btn"
                            >
                                {t("checkout")}
                            </Link>
                        </div>
                    </div>
                    :
                    <p className="no-items-cart">السلة فارغة</p>
                }
            </div>
        </div>
    );
}

export default CartPage;
