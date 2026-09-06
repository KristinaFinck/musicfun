import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

import { baseQuery } from '@/app/baseQuery.ts'
import { AUTH_KEYS } from '@/common/constants/constants.ts'
import { handleErrors } from '@/common/utils'
import { isTokens } from '@/common/utils/isTokens.ts'

const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()

            try {
                const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

                if (!refreshToken) {
                    return result
                }

                console.log('8. REFRESH HAS TOKEN:', Boolean(refreshToken))

                const refreshResult = await baseQuery(
                    {
                        url: '/auth/refresh',
                        method: 'post',
                        body: { refreshToken },
                    },
                    api,
                    extraOptions
                )

                if (refreshResult.data && isTokens(refreshResult.data)) {
                    localStorage.setItem(
                        AUTH_KEYS.accessToken,
                        refreshResult.data.accessToken
                    )
                    localStorage.setItem(
                        AUTH_KEYS.refreshToken,
                        refreshResult.data.refreshToken
                    )

                    result = await baseQuery(args, api, extraOptions)
                } else {
                    console.log('9. REFRESH FAILED -> CLEAR AUTH')

                    localStorage.removeItem(AUTH_KEYS.accessToken)
                    localStorage.removeItem(AUTH_KEYS.refreshToken)
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()

            const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)

            if (accessToken) {
                result = await baseQuery(args, api, extraOptions)
            }
        }
    }

    if (result.error && result.error.status !== 401) {
        handleErrors(result.error)
    }

    return result
}