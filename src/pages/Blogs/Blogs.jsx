import "./Policies.scss";
import { useTranslation } from "react-i18next";
import SmallLoad from "../../components/SmallLoad/SmallLoad";
import { usePoliciesQuery } from "../../redux/slice/staticPagesSlice/staticPagesSlice";

const Policies = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = usePoliciesQuery(i18n.language);

  if (isLoading) return <SmallLoad />;

  return (
    <div className="policies">
      <h2 className="head-page">{t("policies")}</h2>

      <div className="container">
        {data?.data?.length > 0 ? (
          data.data.map((item, index) => (
            <div className="policy-item" key={index}>
              <h4>{t(item.key)}</h4>
              <p>{item.value || t("no_content")}</p>
            </div>
          ))
        ) : (
          <p className="no-data">{t("no_result")}</p>
        )}
      </div>
    </div>
  );
};

export default Policies;
