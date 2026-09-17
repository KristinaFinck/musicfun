import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs, PlaylistCreatedEvent,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas.ts";
import {imagesSchema} from "@/common/schemas";
import {withZodCatch} from "@/common/utils/withZodCatch.ts";
import { io, type Socket } from 'socket.io-client'

export const playlistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                // Ждем разрешения начального запроса перед продолжением
                await cacheDataLoaded

                // Создаем Socket.IO соединение с сервером
                const socket: Socket = io('https://musicfun.it-incubator.app', {
                    path: '/api/1.0/ws', // пользовательский путь для Socket.IO сервера (по умолчанию '/socket.io/')
                    transports: ['websocket'],
                })

                socket.on('connect', () => console.log('✅ Подключен к серверу'))

                socket.on('tracks.playlist-created', (msg: PlaylistCreatedEvent) => {
                    // 1 вариант
                    const newPlaylist = msg.payload.data
                    updateCachedData(state => {
                        state.data.pop()
                        state.data.unshift(newPlaylist)
                        state.meta.totalCount = state.meta.totalCount + 1
                        state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                    })
                    // 2 вариант
                    // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
                })

                // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
                await cacheEntryRemoved
                // Выполняем шаги очистки после разрешения промиса `cacheEntryRemoved`
                socket.on('disconnect', () => console.log('❌ Соединение разорвано'))
            },
            providesTags: ['Playlist'],
        }),

        createPlaylist: build.mutation({
            query: (body: CreatePlaylistArgs) => ({ url: 'playlists', method: 'post', body }),
            ...withZodCatch(playlistCreateResponseSchema),
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
            ...withZodCatch(imagesSchema),
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
