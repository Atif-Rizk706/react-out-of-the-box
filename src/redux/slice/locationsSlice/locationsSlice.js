import { apiSlice } from "../../apiSlice";

export const locationsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        countrys: builder.query({
            query: (lang) => ({
                url: `/api/countries?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Locations"]
        }),

        citys: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/cities?countries_id=${id}&lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Locations"]
        }),
         governorates: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/governorate?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Locations"]
        }),
    })
})

export const {
    useCountrysQuery,
    useCitysQuery,
    useGovernoratesQuery,
} = locationsSlice;