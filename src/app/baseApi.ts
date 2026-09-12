import {createApi} from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth} from "@/app/baseQueryWithReauth.ts";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Playlist', 'Auth'],
    // refetchOnFocus: true,
    // refetchOnReconnect: true,
    keepUnusedDataFor: 5,
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),

})