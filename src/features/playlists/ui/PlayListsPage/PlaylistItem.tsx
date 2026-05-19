import {PlaylistData} from "@/features/playlists/playlistsApi.types.ts";
import defaultCover from "./../../../../assets/images/default-playlist-cover.png"
import s from "./PlaylistItem.module.css"


type Props = {
    playlist: PlaylistData
    deletePlaylist: (playlistId: string) => void
    editPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, deletePlaylist }: Props) => {
    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const src = originalCover ? originalCover?.url : defaultCover
    return (
        <div>
            <img src={src} alt={'cover'} width={'100px'} className={s.cover} />
            <div>title: {playlist.attributes.title}</div>
            <div>description: {playlist.attributes.description}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylist(playlist.id)}>delete</button>
            <button onClick={() => editPlaylist(playlist)}>update</button>
        </div>
    )
}
