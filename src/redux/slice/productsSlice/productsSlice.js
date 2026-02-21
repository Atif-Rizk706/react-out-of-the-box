import { apiSlice } from "../../apiSlice";

export const staticPagesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        allCatigories: builder.query({
            query: ({ lang }) => {
                return {
                    url: `/api/categories?lang=${lang}`,
                    method: "GET",
                };
            },
            providesTags: ["Products"],
        }),

        subCatigories: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/getSubCategories?store_id=34&lang=${lang}&category_id=${id}`,
                method: "GET",
            }),
            providesTags: ["Products"]
        }),

        products: builder.query({
            query: ({ lang, catid, subid }) => {
                const params = new URLSearchParams();
                params.append("lang", lang);

                if (catid) {
                    params.append("category_id", catid);
                }

                if (subid) {
                    params.append("sub_category_id", subid);
                }

                return {
                    url: `/api/products?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Products"],
        }),

        productDetails: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/productDetails?product_id=${id}&lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Products"]
        }),

        productOffers: builder.query({
            query: ({ lang, has_offer_end_date, search }) => {
                let url = `/api/get_all_offers?lang=${lang}`;

                if (has_offer_end_date !== undefined) {
                    url += `&has_offer_end_date=${has_offer_end_date}`;
                }

                if (search) {
                    url += `&search=${search}`;
                }

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["Products"],
        }),

        categoriesHome: builder.query({
            query: (lang) => ({
                url: `/api/categories/web_home?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Products"]
        }),

        bestSellers: builder.query({
            query: (lang) => ({
                url: `api/products/best-sellers?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Products"]
        }),

        searchProducts: builder.query({
            query: ({ lang, text }) => ({
                url: `/api/products?lang=${lang}&search=${text}`,
                method: "GET",
            }),
            providesTags: ["Search"],
        }),

        reviewsProduct: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/allReviews?lang=${lang}&prod_id=${id}`,
                method: "GET",
            }),
            providesTags: ["Comments"],
        }),

        addReview: builder.mutation({
            query: ({ token, payload }) => ({
                url: `/api/reviews`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload
            }),
            invalidatesTags: ["Comments"],
        }),
    })
})

export const {
    useAllCatigoriesQuery,
    useSubCatigoriesQuery,
    useProductsQuery,
    useProductDetailsQuery,
    useProductOffersQuery,
    useCategoriesHomeQuery,
    useBestSellersQuery,
    useSearchProductsQuery,
    useReviewsProductQuery,
    useAddReviewMutation
} = staticPagesSlice;