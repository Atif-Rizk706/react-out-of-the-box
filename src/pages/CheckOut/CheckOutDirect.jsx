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
    //const [makeOrder, { isLoading: loadSubmit }] = useMakeOrderMutation();
const [makeDirectOrder, { isLoading: loadSubmit }] = useMakeDirectOrderMutation()
    if (!order) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
/* 
        if (!token) {
            toast.error(t("please_login"));
            navigate("/login");
            return;
        } */

        if (!e.target.elements.state_id.value) {
            toast.error(t("country_city_required"));
            return;
        }
         if (!e.target.elements.phone.value) {
            toast.error(t("phone_is_required"));
            return;
        }

        const data = {
            product_id: order.product_id,
            quantity: order.quantity,
            total: order.total + shippingPrice,
            sub_total:order.total,
            name: e.target.elements.name.value,
             phone: e.target.elements.phone.value,
             alt_phone: e.target.elements.alt_phone.value,
             state_id: +e.target.elements.state_id.value,
             address: e.target.elements.address.value,
            // sub_total: +location.state.totalPrice,
            is_offer:order.is_offer,
            delivery_price: shippingPrice, 
                  // 👈 أضف ده

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
                                <input type="text" name="name"  defaultValue={profile?.name || ""}  />
                            </div>

                          
                        </div>

                        <div className="group">
                            <div className="input-group">
                                <label>{t("phone")}</label>
                                <input type="number" required name="phone" defaultValue={profile?.phone || ""}  />
                            </div>
                        </div>
                        <div className="group">
                            <div className="input-group">
                                <label>{t("alt_phone")}</label>
                                <input type="number"  name="alt_phone" defaultValue={profile?.phone || ""}  />
                            </div>
                        </div>

                        <h3>{t("ship_to_address")}</h3>

                        <div className="group">
                           

                            <div className="input-group">
                                <label>{t("city")}</label>
                                <select name="state_id" 
                                  onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                         console.log("Selected ID:", selectedId);
                                        console.log("Governorates:", governorates?.data);
                                        const selectedCity = governorates?.data?.find(
                                            (city) => city.ID === selectedId
                                        );
                                          console.log("de:", selectedCity?.delivery_price);



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
{/*                     <h3>ملخص الطلب</h3>
 */}
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
                        <p>{shippingPrice}</p>
                    </div>
                     <div className="total-products">
                        <p>{t("total")}</p>
                        <p>ُEGP{order.total +shippingPrice}</p>
                    </div>

                    

                   
                </div>
                         <button className="pay" type="submit" form="checkout-form" disabled={loadSubmit}>
                            {loadSubmit ? <SmallLoad /> : "إتمام الطلب"}
                        </button>
                    </form>
                </div>

                {/* ORDER INFO */}
               
            </div>
        </div>
    );
};

export default CheckOutDirect;
