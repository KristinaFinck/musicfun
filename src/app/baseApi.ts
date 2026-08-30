import {createApi, EndpointBuilder, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {handleErrors} from "@/common/utils";
import {AUTH_KEYS} from "@/common/constants/constants.ts";
import {baseQueryWithReauth} from "@/app/baseQueryWithReauth.ts";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Playlist', 'Auth'],
    refetchOnFocus: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 5,
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),

})