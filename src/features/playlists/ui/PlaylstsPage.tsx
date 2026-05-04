// export const PlaylistsPage = () => {
//     return (
//         <div>
//             <h1> Playlists page </h1>
//         </div>
//     )
// }
import { useFetchPlaylistsQuery } from '@/features/playlists/playlistsApi'

export const PlaylistsPage = () => {
    const { data } = useFetchPlaylistsQuery()

    return (
        <div>
            <h1>Playlists page</h1>
            <div>
                {data?.data.map(playlist => {
                    return (
                        <div key={playlist.id}>
                            <div>title: {playlist.attributes.title}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}