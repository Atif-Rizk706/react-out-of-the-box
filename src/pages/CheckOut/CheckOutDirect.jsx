import "./CheckOut.scss";
import { useCitysQuery, useCountrysQuery } from "../../redux/slice/locationsSlice/locationsSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserToken } from "../../utils/CookisAuth";
import { useProfileQuery } from "../../redux/slice/authSlice/authSlice";
import Loading from "../../components/Loading/Loading";
import { useMakeOrderMutation } from "../../redux/slice/checkOut/checkOut";
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
    const { data: citys = [] } = useCitysQuery(
        { lang: i18n.language, id: countryId },
        { skip: !countryId }
    );

    const firebaseId = localStorage.getItem("fcmToken");
    const [makeOrder, { isLoading: loadSubmit }] = useMakeOrderMutation();

    if (!order) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error(t("please_login"));
            navigate("/login");
            return;
        }

        if (!e.target.elements.contrey_id.value || !e.target.elements.city_id.value) {
            toast.error(t("country_city_required"));
            return;
        }

        const data = {
            product_id: order.product_id,
            quantity: order.quantity,
            total: order.total,

            name: profile.name,
            phone: profile.phone,
            email: profile.email,

            contrey_id: +e.target.elements.contrey_id.value,
            city_id: +e.target.elements.city_id.value,
            address: e.target.elements.address.value,
            area: e.target.elements.area.value,

            payment_type: "cash",
            payment_status: 0,
            firebase_id: firebaseId,
        };

        try {
            await makeOrder({ token, payload: data }).unwrap();
            toast.success("تم إرسال الطلب بنجاح");
            navigate("/success");
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
                                <input type="text" defaultValue={profile?.name || ""} disabled />
                            </div>

                            <div className="input-group">
                                <label>{t("email")}</label>
                                <input type="text" defaultValue={profile?.email || ""} disabled />
                            </div>
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("phone")}</label>
                                <input type="text" defaultValue={profile?.phone || ""} disabled />
                            </div>
                        </div>

                        <h3>{t("ship_to_address")}</h3>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("country")}</label>
                                <select name="contrey_id" onChange={(e) => setCountryId(e.target.value)}>
                                    <option value="">{t("select_country")}</option>
                                    {countrys?.data?.map((el) => (
                                        <option key={el.ID} value={el.ID}>{el.Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>{t("city")}</label>
                                <select name="city_id">
                                    <option value="">{t("select_city")}</option>
                                    {citys?.data?.map((el) => (
                                        <option key={el.id} value={el.id}>
                                            {el.name[i18n.language]}
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

                            <div className="input-group">
                                <label>{t("area")}</label>
                                <input type="text" name="area" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* ORDER INFO */}
                <div className="info-order">
                    <h3>ملخص الطلب</h3>

                    <div className="order-product">
                        <p><strong>{order.product_name}</strong></p>
                        <p>الكمية: {order.quantity}</p>
                        <p>سعر القطعة: {order.price} $</p>
                    </div>

                    <div className="total-products">
                        <p>{t("total")}</p>
                        <p>${order.total}</p>
                    </div>

                    <button className="pay" type="submit" form="checkout-form" disabled={loadSubmit}>
                        {loadSubmit ? <SmallLoad /> : "إتمام الطلب"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckOutDirect;
