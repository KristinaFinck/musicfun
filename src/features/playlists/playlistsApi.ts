// Во избежание ошибок импорт должен быть из `@reduxjs/toolkit/query/react`
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {CreatePlaylistArgs, PlaylistData, PlaylistsResponse} from "@/features/playlists/playlistsApi.types.ts";
import {UpdatePlaylistArgs} from "@/features/playlists/playlistsApi.types.ts";

// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const playlistsApi = createApi({
    // `reducerPath` - имя куда будут сохранены состояние и экшены для этого `API`
    reducerPath: 'playlistsApi',
    // `baseQuery` - конфигурация для `HTTP-клиента`, который будет использоваться для отправки запросов
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            'API-KEY': import.meta.env.VITE_API_KEY,
        },
        prepareHeaders: headers => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
            return headers
        },
    }),
    // `endpoints` - метод, возвращающий объект с эндпоинтами для `API`, описанными
    // с помощью функций, которые будут вызываться при вызове соответствующих методов `API`
    // (например `get`, `post`, `put`, `patch`, `delete`)
    endpoints: build => ({
        fetchPlaylists: build.query<PlaylistsResponse, void>({
            query: () => `playlists`,
        }),

        createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
            query: body => ({
                url: 'playlists',
                method: 'POST',
                body: {
                    data: {
                        type: 'playlists' as const,
                        attributes: body,
                    },
                },
            }),
        }),
        deletePlaylist: build.mutation<void, string>({
            query: playlistId => ({
                url: `playlists/${playlistId}`,
                method: 'DELETE',
            }),
        }),
        updatePlaylist: build.mutation<void, { playlistId: string, body: UpdatePlaylistArgs}>({
            query: ({playlistId, body}) => ({
                url: `playlists/${playlistId}`,
                method: 'PUT',
                body,
            }),
        }),
    }),
})


// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const { useFetchPlaylistsQuery,
        useCreatePlaylistMutation,
        useDeletePlaylistMutation,
        useUpdatePlaylistMutation,
    } = playlistsApi