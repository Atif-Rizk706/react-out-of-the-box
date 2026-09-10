import "./CheckOut.scss";
import { useGovernoratesQuery, useRegionsQuery } from "../../redux/slice/locationsSlice/locationsSlice";
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
    const token = getUserToken();

    const { data: profile = {}, isLoading } = useProfileQuery(token);
    const { data: governorates = [] } = useGovernoratesQuery(i18n.language);

    const [shippingPrice, setShippingPrice] = useState(0);
    const [selectedStateId, setSelectedStateId] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const { data: regionsData = {}, isLoading: loadRegions } = useRegionsQuery(selectedStateId, {
        skip: !selectedStateId,
    });

    const [makeDirectOrder, { isLoading: loadSubmit }] = useMakeDirectOrderMutation();

    if (!order) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        const nameValue = e.target.elements.name.value.trim();
        const phoneValue = e.target.elements.phone.value.trim();
        const stateIdValue = e.target.elements.state_id.value;
        const regionIdValue = e.target.elements.region_id?.value;

        if (!nameValue) errors.name = "الاسم مطلوب";

        if (!phoneValue) {
            errors.phone = t("phone_is_required");
        } else if (phoneValue.length !== 11) {
            errors.phone = "رقم الهاتف يجب أن يتكون من 11 رقم";
        }

        if (!stateIdValue) {
            errors.state_id = t("country_city_required");
        }

        if (!regionIdValue) {
            errors.region_id = "يرجى اختيار المنطقة";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("يرجى مراجعة الحقول المطلوبة وتصحيح الأخطاء");
            return;
        }

        setFormErrors({});

        const data = {
            product_id: order.product_id,
            quantity: order.quantity,
            total: order.total + shippingPrice,
            sub_total: order.total,
            name: nameValue,
            phone: phoneValue,
            alt_phone: e.target.elements.alt_phone.value,
            state_id: +stateIdValue,
            region_id: +regionIdValue,
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
                <div className="form">
                    <form id="checkout-form" onSubmit={handleSubmit} noValidate>
                        <div className="group">
                            <div className="input-group">
                                <label>{t("name")}</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={profile?.name || ""}
                                    style={{ borderColor: formErrors.name ? "red" : "" }}
                                />
                                {formErrors.name && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.name}</span>}
                            </div>
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("phone")}</label>
                                <input
                                    type="number"
                                    name="phone"
                                    defaultValue={profile?.phone || ""}
                                    style={{ borderColor: formErrors.phone ? "red" : "" }}
                                />
                                {formErrors.phone && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.phone}</span>}
                            </div>
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("alt_phone")}</label>
                                <input type="number" name="alt_phone" defaultValue={profile?.phone || ""} />
                            </div>
                        </div>

                        <h3>{t("ship_to_address")}</h3>

                        {/* 1. اختيار المحافظة (Governorate) */}
                        <div className="group">
                            <div className="input-group">
                                <label>{t("city")} (المحافظة)</label>
                                <select
                                    name="state_id"
                                    style={{ borderColor: formErrors.state_id ? "red" : "" }}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        setSelectedStateId(selectedId);

                                        const selectedCity = governorates?.data?.find(
                                            (city) => city.ID === selectedId
                                        );
                                        setShippingPrice(selectedCity?.delivery_price || 0);

                                        if (selectedId) {
                                            setFormErrors(prev => ({ ...prev, state_id: "" }));
                                        }
                                    }}
                                >
                                    <option value="">{t("select_city")}</option>
                                    {governorates?.data?.map((el) => (
                                        <option key={el.id || el.ID} value={el.ID || el.id}>
                                            {el.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.state_id && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.state_id}</span>}
                            </div>
                        </div>

                        {/* 2. اختيار المنطقة (Region) */}
                        <div className="group">
                            <div className="input-group">
                                <label>المنطقة (Region)</label>
                                <select
                                    name="region_id"
                                    disabled={!selectedStateId}
                                    style={{ borderColor: formErrors.region_id ? "red" : "" }}
                                    onChange={() => {
                                        setFormErrors(prev => ({ ...prev, region_id: "" }));
                                    }}
                                >
                                    <option value="">
                                        {loadRegions ? "جاري تحميل المناطق..." : "اختر المنطقة"}
                                    </option>
                                    {regionsData?.data?.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.region_id && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.region_id}</span>}
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
                                    <p>{order.product_names.join(" + ")}</p>
                                ) : (
                                    <p>{order.product_name}</p>
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
                                <p>{shippingPrice === 0 ? "على حسب اختيار المحافظة" : shippingPrice}</p>
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