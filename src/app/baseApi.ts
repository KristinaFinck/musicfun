import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {handleErrors} from "@/common/utils";
import {isErrorWithDetailArray} from "@/common/utils/isErrorWithDetailArray.ts";
import {trimToMaxLength} from "@/common/utils/trimToMaxLength.ts"

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Playlist', 'Auth'],
    refetchOnFocus: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 5,
    baseQuery: async (args, api, extraOptions) => {
      //  await new Promise(resolve => setTimeout(resolve, 2000)) // delay
        const result = await fetchBaseQuery({
            baseUrl: import.meta.env.VITE_BASE_URL,
            headers: {
                'API-KEY': import.meta.env.VITE_API_KEY,
            },

        prepareHeaders: headers => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
            return headers
        },
            // responseHandler: () => {
            //     throw new Error('PARSING_ERROR')
            // },
        })(args, api, extraOptions)

    if ('error' in result && result.error) {
        handleErrors(result.error)
}

return result
},
    endpoints: () => ({}),
})