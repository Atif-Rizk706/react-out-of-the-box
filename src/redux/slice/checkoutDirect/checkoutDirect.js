import { apiSlice } from "../../apiSlice";

export const chexkOutSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        makeDirectOrder: builder.mutation({
            query: ({ token, payload }) => ({
                url: `/api/makeDirectOrder`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload
            }),
            invalidatesTags: ["Checkout"]
        }),
    })
})

export const {
    useMakeDirectOrderMutation
} = chexkOutSlice;