import {baseApi} from "@/app/baseApi.ts";
import type {FetchTracksResponse} from "@/features/tracks/api/tracksApi.types.ts";
import {fetchTracksResponseSchema} from "@/features/tracks/api/track.schema.ts";
import {withZodCatch} from "@/common/utils";

export const tracksApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchTracks: build.infiniteQuery<FetchTracksResponse, void, number>({
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage, _allPages, lastPageParam) => {
                    return lastPageParam < (lastPage.meta as { pagesCount: number }).pagesCount
                        ? lastPageParam + 1
                        : undefined
                },
            },
            query: ({ pageParam }) => {
                return {
                    url: 'playlists/tracks',
                    params: { pageNumber: pageParam, pageSize: 10, paginationType: 'offset' },
                }
            },
            ...withZodCatch(fetchTracksResponseSchema),
        }),
    }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi