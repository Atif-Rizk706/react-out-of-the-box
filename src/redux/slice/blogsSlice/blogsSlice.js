import { apiSlice } from "../../apiSlice";

export const blogsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        allBlogs: builder.query({
            query: (lang) => ({
                url: `/api/new-settings?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Blogs"]
        }),

        showBlog: builder.query({

            query: ({ lang, id }) => ({
                url: `/api/blogs/${id}?lang=${lang}`,
                method: "GET",
            }),
            providesTags: ["Blogs"]
        }),

        addComment: builder.mutation({
            query: ({ token, payload, id }) => ({
                url: `/api/blog_comment/${id}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload
            }),
            invalidatesTags: ["Blogs"],
        }),

        addReply: builder.mutation({
            query: ({ token, payload, id }) => ({
                url: `/api/reply_blog_comment/${id}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         

         
           }),
            invalidatesTags: ["Blogs"],
        }),
    })
})

export const {
    useAllBlogsQuery,
    useShowBlogQuery,
    useAddCommentMutation,
    useAddReplyMutation
} = blogsSlice;