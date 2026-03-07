import "./Contact.scss";
import { useTranslation } from "react-i18next";
import { useContactUsMutation } from "../../../redux/slice/contactSlice/contactSlice";
import toast from "react-hot-toast";
import SmallLoad from "../../../components/SmallLoad/SmallLoad";
import Image from "../../../assets/contact.jpg"

const Contact = () => {
    const { t } = useTranslation();
    const [contactUs, { isLoading }] = useContactUsMutation()

    const onSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const { first_name, last_name, phone_number, comments } = form.elements;

        [first_name, last_name, phone_number, comments].forEach((input) =>
            input.classList.remove("error")
        );

        let hasError = false;
        if (first_name.value.trim() === "") {
            first_name.classList.add("error");
            hasError = true;
        }
        if (last_name.value.trim() === "") {
            last_name.classList.add("error");
            hasError = true;
        }
        if (phone_number.value.trim() === "") {
            email.classList.add("error");
            hasError = true;
        }
        if (comments.value.trim() === "") {
            comments.classList.add("error");
            hasError = true;
        }

        if (hasError) {
            toast.error(t("empty_field"));
            return;
        }

        const data = {
            name: `${first_name.value}-${last_name.value}`,
            email: email.value,
            phone: form.elements.phone_number.value,
            message: comments.value,
        };

        try {
            await contactUs(data).unwrap();
            form.reset();
            toast.success(t("message_sent_success"));
        } catch {
            toast.error(t("unexpected_error"));
        }
    };


    return (
        <div className="contact">
            <div className="content">
                <h2>{t("get_in_touch")}</h2>
                <p>{t("select_topic_instruction")}</p>

                <div className="container">
                    <div className="form">
                        <form onSubmit={onSubmit}>
                            <input
                                type="text"
                                placeholder={t("first_name")}
                                name="first_name"
                            />

                            <input
                                type="text"
                                placeholder={t("last_name")}
                                name="last_name"
                            />

                            <input
                                type="text"
                                placeholder={t("email")}
                                name="email"
                            />

                            <input
                                type="text"
                                placeholder={t("phone_number")}
                                name="phone_number"
                            />

                            <textarea placeholder={t("comments_placeholder")} name="comments"></textarea>

                            <button type="submit">
                                {isLoading ? <SmallLoad /> : t("submit")}
                            </button>
                        </form>
                    </div>

                    <div className="image">
                        <img src={Image} alt="main_image" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;