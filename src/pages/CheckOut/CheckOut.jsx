import "./CheckOut.scss";
import { useCitysQuery, useCountrysQuery ,useGovernoratesQuery} from "../../redux/slice/locationsSlice/locationsSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserToken, setUserToken } from "../../utils/CookisAuth";
import { useProfileQuery } from "../../redux/slice/authSlice/authSlice";
import Loading from "../../components/Loading/Loading";
import { useMakeOrderMutation } from "../../redux/slice/checkOut/checkOut";
import toast from "react-hot-toast";
import SmallLoad from "../../components/SmallLoad/SmallLoad";
import { CreditCard } from "lucide-react";

const CheckOut = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [countryId, setCountryId] = useState("")
    const token = getUserToken();
    const [paymentType, setPaymentType] = useState("creditcard");
    const { data: profile = {}, isLoading } = useProfileQuery(token);
    const { data: countrys = [] } = useCountrysQuery(i18n.language);
        const { data: governorates = [] } = useGovernoratesQuery(i18n.language);
    const [shippingPrice, setShippingPrice] = useState(0);
    const { data: citys = [] } = useCitysQuery(
        {
            lang: i18n.language,
            id: countryId,
        },
        { skip: !countryId, }
    );
    const firebaseId = localStorage.getItem("fcmToken");

    const subTotal = Number(location?.state?.totalPrice || 0);
    const total = subTotal + shippingPrice;

    const [makeOrder, { isLoading: loadSubmit }] = useMakeOrderMutation()

    const handleSubmit = async (e) => {
        e.preventDefault();

     const data = {
             payment_status: 1,
             payment_type: 1,
             name: e.target.elements.name.value,
             email: e.target.elements.email.value,
             phone: e.target.elements.phone.value,
             alt_phone: e.target.elements.alt_phone.value,
             state_id: +e.target.elements.state_id.value,
             address: e.target.elements.address.value,
            // sub_total: +location.state.totalPrice,

            sub_total: subTotal,                 // بدل ما تجيبها من location.state تاني
            delivery_price: shippingPrice,       // 👈 أضف ده
            total: total, 
             coupon_id: +location.state.coupon,
             user_id: +profile.id,
             firebase_id: firebaseId,
             online_payment_type: paymentType,
        }

         if (firebaseId || token) {
            console.log('hh');
            if (e.target.elements.state_id.value ) {
                 try {
                  const res = await makeOrder({
                        token: token,
                        payload: data
                    }).unwrap();

                    if (res?.status == false) {
                        toast.error(res.message);
                    } else {
                        toast.success("تم إرسال الطلب بنجاح");
                        navigate("/");
                    }
                 } catch {
                     toast.error(t("unexpected_error"));
                 }
            } else {
                 toast.error(t("country_city_required"));
            }
         } else {
             toast.error(t("please_login"));
             navigate("/login");
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="check-out">
            <div className="container">
                <div className="form">
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="group">
                            <div className="input-group">
                                <label>{t("name")}</label>
                                <input
                                    type="text"
                                    placeholder={t("enter_full_name")}
                                    defaultValue={profile?.name?.replace(/-/g, " ") || ""}
                                    name="name"
                                  
                                />
                            </div>

                            
                        </div>

                        <div className="group">
                            

                            <div className="input-group">
                                <label>{t("phone")}</label>
                                <input
                                    type="text"
                                    defaultValue={profile?.phone || ""}
                                    placeholder={t("input_phone")}
                                    name="phone"
                                />
                            </div>
                        </div>
                         <div className="group">
                            <div className="input-group">
                                <label>{t("alt_phone")}</label>
                                <input type="text"  name="alt_phone" defaultValue={profile?.phone || ""} 
                                 />
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
                    </form>
                </div>

                <div className="info-order">
                    <div className="total-products">
                        <p>{t("subtotal")}</p>
                        <p>EGP{location?.state?.totalPrice}</p>
                    </div>

                   <div className="shipping">
                        <p>{t("shipping")}</p>
                        <p>{shippingPrice} EGP</p>
                    </div>

                    <div className="total-products">
                        <p>{t("total")}</p>
                        <p>EGP{total}</p>
                    </div>

                    <div className="payment-type">
                        <label htmlFor="credit-card">
                            <input
                                type="radio"
                                id="credit-card"
                                value="creditcard"
                                checked={paymentType === "creditcard"}
                                onChange={() => setPaymentType("creditcard")}
                            />
                            <CreditCard />
                             الدفع عند الاستلام
                        </label>
                    </div>

                    <button className="pay" type="submit" form="checkout-form" disabled={loadSubmit}>
                        {loadSubmit ? <SmallLoad /> : t("checkout_now")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;