import "./WhoWeAre.scss";
import { useTranslation } from "react-i18next";
import { usePagesFooterQuery } from "../../../redux/slice/staticPagesSlice/staticPagesSlice";
import SmallLoad from "../../../components/SmallLoad/SmallLoad";

const WhoWeAre = () => {
    const { i18n } = useTranslation();
    const { data = [], isLoading } = usePagesFooterQuery(i18n.language);

    return (
      <div className="who-we-are">
    {isLoading ? <SmallLoad /> :
        <div className="container">

            {/* 1️⃣ العنوان */}
            <h2 className="title">من نحن</h2>

            {/* 2️⃣ المحتوى */}
            <div className="content">
                <div
                    dangerouslySetInnerHTML={{ __html: data?.data?.value }}
                    className="desc"
                />
            </div>

            {/* 3️⃣ الصورة */}
            <div className="image">
                <img
                    src="/lo.png"
                    alt="logo"
                    loading="lazy"
                />
            </div>

        </div>
    }
</div>

    );
}

export default WhoWeAre;