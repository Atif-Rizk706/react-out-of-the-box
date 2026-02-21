import { apiSlice } from "../../apiSlice";

export const staticPagesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        pagesFooter: builder.query({
            query: (lang) => ({
                url: `/api/pagesFooter?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["StaticPages"]
        }),
        policies: builder.query({
            query: (lang) => ({
                url: `/api/new-settings?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Blogs"]
        }),

        staticPages: builder.query({
            query: ({ lang, id }) => ({
                url: `/api/get_pages?lang=${lang}&id=${id}`,
                method: "GET",
            }),
            providesTags: ["StaticPages"]
        }),

        workingWithTaqi: builder.query({
            query: ({ lang }) => ({
                url: `/api/companywork?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["StaticPages"]
        }),

        faqs: builder.query({
            query: ({ lang, search }) => {
                let url = `/api/faq?lang=${lang}`

                if (search) {
                    url += `&search=${search}`;
                }

                return {
                    url,
                    method: "GET",
                }
            },
            providesTags: ["StaticPages"]
        }),
    })
})

export const {
    usePagesFooterQuery,
    useStaticPagesQuery,
    useWorkingWithTaqiQuery,
    useFaqsQuery,
    usePoliciesQuery
} = staticPagesSlice;