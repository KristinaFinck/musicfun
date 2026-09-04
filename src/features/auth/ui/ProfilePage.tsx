import {useGetMeQuery} from "@/features/auth/api/authApi.ts";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi.ts";
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx";
import {CreatePlaylistForm} from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx";
import s from "./ProfilePage.module.css"

export const ProfilePage = () => {
    const { data: meResponse } = useGetMeQuery()
    const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
        userId: meResponse?.userId,
    })

    return (
         <>
        <h1>{meResponse?.login} page</h1>
             <div className={s.container}>
                 <CreatePlaylistForm />
    <PlaylistsList playlists={playlistsResponse?.data || []} isPlaylistsLoading={isLoading} />
             </div>
         </>
    )
}
