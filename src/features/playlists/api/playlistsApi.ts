import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas.ts";
import {errorToast} from "@/common/utils/errorToast.ts";
import {imagesSchema} from "@/common/schemas";

export const playlistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
            responseSchema: playlistsResponseSchema,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            },
            providesTags: ['Playlist'],
        }),

        createPlaylist: build.mutation({
            query: (body: CreatePlaylistArgs) => ({ url: 'playlists', method: 'post', body }),
            responseSchema: playlistCreateResponseSchema,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            },
            invalidatesTags: ['Playlist'],
        }),

        deletePlaylist: build.mutation<void, string>({
            query: playlistId => ({
                url: `playlists/${playlistId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),

        updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
            query: ({ playlistId, body }) => ({ url: `playlists/${playlistId}`, method: 'PUT', body }),
            async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState}) {
                const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

                const patchResults: any[] = []

                args.forEach(arg => {
                    patchResults.push(
                        dispatch(
                            playlistsApi.util.updateQueryData(
                                'fetchPlaylists',
                                {
                                    pageNumber: arg.pageNumber,
                                    pageSize: arg.pageSize,
                                    search: arg.search,
                                },
                                state => {
                                    const index = state.data.findIndex(playlist => playlist.id === playlistId)
                                    if (index !== -1) {
                                        state.data[index].attributes = { ...state.data[index].attributes, ...body }
                                    }
                                }
                            )
                        )
                    )
                })

                try {
                    await queryFulfilled
                } catch {
                    patchResults.forEach(patchResult => {
                        patchResult.undo()
                    })
                }
            },
            invalidatesTags: ['Playlist'],
        }),

        uploadPlaylistCover: build.mutation({
            query: ({ playlistId, file }: { playlistId: string; file: File }) => {
                const formData = new FormData()
                formData.append('file', file)

                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'POST',
                    body: formData,
                }
            },
            responseSchema: imagesSchema,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return { status: 'CUSTOM_ERROR', error: 'Schema validation failed' }
            },
            invalidatesTags: ['Playlist'],
        }),

        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => ({
                url: `playlists/${playlistId}/images/main`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),
    }),
})

export const {
    useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useUploadPlaylistCoverMutation,
    useDeletePlaylistCoverMutation,
} = playlistsApi
