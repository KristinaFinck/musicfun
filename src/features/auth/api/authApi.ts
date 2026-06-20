export const authApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getMe: build.query<MeResponse, void>({
            query: () => `auth/me`,
        }),
    }),
})

export const { useGetMeQuery } = authApi