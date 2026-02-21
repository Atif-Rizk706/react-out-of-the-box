import { apiSlice } from "../../apiSlice";

export const contactSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        contactUs: builder.mutation({
            query: (payload) => ({
                url: `/api/contactUs`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["ContactUs"]
        }),

        contactPages: builder.query({
            query: ({ lang }) => ({
                url: `/api/contacts?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["ContactUs"]
        }),
    })
});

export const {
    useContactUsMutation,
    useContactPagesQuery
} = contactSlice;
