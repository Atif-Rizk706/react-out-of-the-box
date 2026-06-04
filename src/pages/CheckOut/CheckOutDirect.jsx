import "./CheckOut.scss";
import { useCitysQuery, useCountrysQuery ,useGovernoratesQuery} from "../../redux/slice/locationsSlice/locationsSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserToken } from "../../utils/CookisAuth";
import { useProfileQuery } from "../../redux/slice/authSlice/authSlice";
import Loading from "../../components/Loading/Loading";
import { useMakeDirectOrderMutation } from "../../redux/slice/checkoutDirect/checkoutDirect";
import toast from "react-hot-toast";
import SmallLoad from "../../components/SmallLoad/SmallLoad";

const CheckOutDirect = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state;

    const { t, i18n } = useTranslation();
    const [countryId, setCountryId] = useState("");
    const token = getUserToken();

    const { data: profile = {}, isLoading } = useProfileQuery(token);
    const { data: countrys = [] } = useCountrysQuery(i18n.language);
    const { data: governorates = [] } = useGovernoratesQuery(i18n.language);
    const [shippingPrice, setShippingPrice] = useState(0);

    const { data: citys = [] } = useCitysQuery(
        { lang: i18n.language, id: countryId },
        { skip: !countryId }
    );

    const firebaseId = localStorage.getItem("fcmToken");
    const [makeDirectOrder, { isLoading: loadSubmit }] = useMakeDirectOrderMutation();
    
    if (!order) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!e.target.elements.state_id.value) {
            toast.error(t("country_city_required"));
            return;
        }

        const phoneValue = e.target.elements.phone.value;
        if (!phoneValue || phoneValue.length !== 11) {
            // رسالة خطأ إذا لم يكن الرقم 11 رقماً
            toast.error("رقم الهاتف يجب أن يتكون من 11 رقم"); 
            return;
        }

        const data = {
            product_id: order.product_id,
            quantity: order.quantity,
            total: order.total + shippingPrice,
            sub_total: order.total,
            name: e.target.elements.name.value,
            phone: phoneValue,
            alt_phone: e.target.elements.alt_phone.value,
            state_id: +e.target.elements.state_id.value,
            address: e.target.elements.address.value,
            is_offer: order.is_offer,
            delivery_price: shippingPrice, 
            payment_type: "cash",
            payment_status: 0,
        };

        try {
            await makeDirectOrder({ token, payload: data }).unwrap();
            toast.success("تم إرسال الطلب بنجاح");
            navigate("/");
        } catch {
            toast.error(t("unexpected_error"));
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="check-out">
            <div className="container">
                {/* FORM */}
                <div className="form">
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="group">
                            <div className="input-group">
                                <label>{t("name")}</label>
                                {/* جعل حقل الاسم إجبارياً هنا */}
                                <input type="text" name="name" required defaultValue={profile?.name || ""} />
                            </div>
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("phone")}</label>
                                {/* جعل حقل الهاتف يقبل 11 رقم فقط */}
                                <input 
                                    type="tel" 
                                    required 
                                    name="phone" 
                                    maxLength="11"
                                    minLength="11"
                                    pattern="\d{11}"
                                    defaultValue={profile?.phone || ""} 
                                />
                            </div>
                        </div>
                        <div className="group">
                            <div className="input-group">
                                <label>{t("alt_phone")}</label>
                                <input type="number" name="alt_phone" defaultValue={profile?.phone || ""} />
                            </div>
                        </div>

                        <h3>{t("ship_to_address")}</h3>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("city")}</label>
                                <select name="state_id" 
                                  onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        const selectedCity = governorates?.data?.find(
                                            (city) => city.ID === selectedId
                                        );
                                        setShippingPrice(selectedCity?.delivery_price || 0);
                                    }}
                                >
                                    <option value="">{t("select_city")}</option>
                                    {governorates?.data?.map((el) => (
                                        <option key={el.id} value={el.ID}>
                                            {el.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("address")}</label>
                                <input type="text" name="address" />
                            </div>
                        </div>
                        
                        <div className="group">
                            <div className="input-group">
                                <label>{t("notes")}</label>
                                <input type="text" name="notes" />
                            </div>
                        </div>

                        <div className="info-order">
                            <div className="total-products">
                                <p>{t("product_name")} :</p>

                                {order.is_relatedoffer ? (
                                    <p>
                                        {order.product_names.join(" + ")}
                                    </p>
                                ) : (
                                    <p>
                                        {order.product_name}
                                    </p>
                                )}
                            </div>

                            {!order.is_relatedoffer && (
                                <>
                                    <div className="total-products">
                                        <p>الكمية:</p>
                                        <p>{order.quantity}</p>
                                    </div>              

                                    <div className="total-products">
                                        <p>سعر القطعة:</p>
                                        <p>{order.price} EGP</p>
                                    </div>
                                </>
                            )}
                   
                            <div className="total-products">
                                <p>{t("shipping")}</p>
                                {/* تعديل الشحن ليظهر نص قبل اختيار المحافظة */}
                                <p>{shippingPrice === 0 ? "على حسب الاختيار" : shippingPrice}</p>
                            </div>
                            <div className="total-products">
                                <p>{t("total")}</p>
                                <p>EGP {order.total + shippingPrice}</p>
                            </div>
                        </div>
                        
                        <button className="pay" type="submit" form="checkout-form" disabled={loadSubmit}>
                            {loadSubmit ? <SmallLoad /> : "إتمام الطلب"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckOutDirect;