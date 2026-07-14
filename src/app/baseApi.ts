import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {toast} from "react-toastify";
import { isErrorWithProperty} from "@/common/utils";
import {isErrorWithDetailArray} from "@/common/utils/isErrorWithDetailArray.ts";
import {trimToMaxLength} from "@/common/utils/trimToMaxLength.ts";

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
        console.log(result.error)
        switch (result.error.status) {
            case 'FETCH_ERROR':
            case 'PARSING_ERROR':
            case 'CUSTOM_ERROR':
            case 'TIMEOUT_ERROR':
                toast(result.error.error, { type: 'error', theme: 'colored' })
                break

            case 400:
            case 403:
                if (isErrorWithDetailArray(result.error.data)) {
                    toast(trimToMaxLength(result.error.data.errors[0].detail, { type: "error", theme: "colored" }))
                } else {
                    toast(JSON.stringify(result.error.data), { type: "error", theme: "colored" })
                }
                break

            case 401:
        case 404:
            if (isErrorWithProperty(result.error.data, 'error')) {
                toast(result.error.data.error, { type: 'error', theme: 'colored' })
            } else {
                toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
            }
            break

        case 429:
            // ✅ 1. Type Assertions
            // toast((result.error.data as { message: string }).message, { type: 'error', theme: 'colored' })
            // ✅ 2. JSON.stringify
            // toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
            // ✅ 3. Type Predicate
            if (isErrorWithProperty(result.error.data, 'message')) {
                toast(result.error.data.message, { type: 'error', theme: 'colored' })
            } else {
                toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
            }
            break

            default:
                if (result.error.status >= 500 && result.error.status < 600) {
                    toast("Server error occurred. Please try again later.", { type: "error", theme: "colored" })
                } else {
                    toast("Some error occurred", { type: "error", theme: "colored" })
                }
    }
}

return result
},
    endpoints: () => ({}),
})