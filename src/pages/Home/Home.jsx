import "./Home.scss";
import { useTranslation } from "react-i18next";
import Services from "../../components/Services/Services";
import HeadHome from "./components/HeadHome/HeadHome";
import { useBannersQuery, usePartnersQuery, useServicesQuery } from "../../redux/slice/homeSlice/homeSlice";
import { useAllCatigoriesQuery, useBestSellersQuery, useProductOffersQuery, useProductsQuery } from "../../redux/slice/productsSlice/productsSlice";
import PopularProducts from "./components/PopularProducts/PopularProducts";
import NewlyAdded from "./components/NewlyAdded/NewlyAdded";
import MarqueeComponent from "./components/Marquee/Marquee";
import Discounts from "./components/Discounts/Discounts";
import TypeOfAnimal from "./components/TypeOfAnimal/TypeOfAnimal";
import ShoppingByFood from "./components/ShoppingByFood/ShoppingByFood";

const Home = () => {
    const { i18n } = useTranslation();
    const {
        data: banners = {},
        isLoading: loadBanners,
        isFetching: fetchBanners
    } = useBannersQuery(i18n.language);
    const {
        data: mainCategories = [],
        isLoading: loadCat,
        isFetching: fetchCat
    } = useAllCatigoriesQuery({ lang: i18n.language });
    // const {
    //     data: services = [],
    //     isLoading: loadServ,
    //     isFetching: fetchServ
    // } = useServicesQuery(i18n.language);
    const {
        data: bestSellers = [],
        isLoading: loadBestSellers,
        isFetching: fetchBestSellers
    } = useBestSellersQuery(i18n.language);
    // const {
    //     data: newProducts = [],
    //     isLoading: loadNewProducts,
    //     isFetching: fetchNewProducts
    // } = useProductsQuery({ lang: i18n.language, },);
    const {
        data: productsOffers = [],
        isLoading: loadOffers,
        isFetching: fetchOffers,
    } = useProductOffersQuery({ lang: i18n.language, has_offer_end_date: 1 });
    // const {
    //     data: partners = [],
    //     isLoading: loadPartners,
    //     isFetching: fetchPartners,
    // } = usePartnersQuery({ lang: i18n.language });

    return (
        <div className="home">
            <HeadHome
                slider={banners}
                categories={mainCategories}
                loading={loadBanners || loadCat || fetchBanners || fetchCat}
            />

           {/*  <Services
                data={services}
                loading={loadServ || fetchServ}
            /> */}

          {/*   <TypeOfAnimal
                data={mainCategories}
                loading={loadCat || fetchCat}
            /> */}

           <ShoppingByFood
                data={mainCategories}
                loading={loadCat || fetchCat}
            />

            <PopularProducts
                data={bestSellers}
                loading={loadBestSellers || fetchBestSellers}
            />

            {/* <NewlyAdded data={newProducts} loading={loadNewProducts || fetchNewProducts} /> */}

            {/* <MarqueeComponent
                data={partners}
                loading={loadPartners || fetchPartners}
            /> */}

            <Discounts
                data={productsOffers}
                loading={loadOffers || fetchOffers}
            />
        </div>
    );
}

export default Home;