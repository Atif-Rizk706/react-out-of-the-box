import "./Categories.scss";
import { Link } from "react-router-dom";
import { useAllCatigoriesQuery } from "../../redux/slice/productsSlice/productsSlice";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading/Loading";
import DefaultImage from "../../assets/no-image.jpg"

const Categories = () => {
    const { t, i18n } = useTranslation();
    const { data = [], isFetching } = useAllCatigoriesQuery({
        lang: i18n.language
    });

    if (isFetching) {
        return <Loading />
    }

    return (
        <div className="categories">
            <div className="content">
                <h2>{t("main_categories")}</h2>

                <div className="container">
                    {data.data.map((el, id) => (
                        <Link
                            to={`/shop/${el.id}`}
                            state={el.name}
                            className="item"
                            key={id}
                        >
                            <div className="image">
                                <img
                                    src={el.img || DefaultImage}
                                    alt={`image-category-${el.name}`}
                                    width={300}
                                    height={280}
                                />
                            </div>

                            <div className="info">
                                <h3>{el.name}</h3>
                                <p>{el.products_count} {t("item")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categories;