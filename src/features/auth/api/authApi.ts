import {LoginArgs, LoginResponse, MeResponse} from "@/features/auth/api/authApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {AUTH_KEYS} from "@/common/constants/constants.ts";
import {loginResponseSchema, meResponseSchema} from "@/features/auth/model/auth.schemas.ts";
import {withZodCatch} from "@/common/utils";


export const authApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getMe: build.query({
            query: () => 'auth/me',
            ...withZodCatch(meResponseSchema),
            providesTags: ['Auth'],
        }),

        login: build.mutation({
            query: payload => ({
                url: `auth/login`,
                method: 'post',
                body: { ...payload, accessTokenTTL: '15m'
                },
            }),
            ...withZodCatch(loginResponseSchema),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                console.log('5. LOGIN MUTATION STARTED')
                const { data } = await queryFulfilled
                console.log('6. LOGIN SUCCESS:', data)
                localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
                localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
                console.log(
                    '7. TOKENS SAVED:',
                    Boolean(localStorage.getItem(AUTH_KEYS.accessToken)),
                    Boolean(localStorage.getItem(AUTH_KEYS.refreshToken))
                )
                // Invalidate after saving tokens
                dispatch(authApi.util.invalidateTags(['Auth']))
            },
        }),

        logout: build.mutation<void, void>({
            query: () => {
                const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
                console.log('10. LOGOUT HAS TOKEN:', Boolean(refreshToken))
                return { url: 'auth/logout', method: 'post', body: { refreshToken } }
            },
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                console.log('11. LOGOUT STARTED')
                await queryFulfilled
                console.log('12. LOGOUT SUCCESS')
                localStorage.removeItem(AUTH_KEYS.accessToken)
                localStorage.removeItem(AUTH_KEYS.refreshToken)

                dispatch(baseApi.util.resetApiState())
            },
        }),
    }),
})

export const {
    useGetMeQuery,
    useLoginMutation,
    useLogoutMutation,
} = authApi
