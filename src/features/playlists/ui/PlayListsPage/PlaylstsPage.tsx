import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from "@/features/playlists/playlistsApi.ts";
import s from "./PlaylistsPage.module.css"
import {CreatePlaylistForm} from "@/features/playlists/ui/PlayListsPage/CreatePlaylistForm/CreatePlaylistForm.tsx";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/playlistsApi.types.ts";



export const PlaylistsPage = () => {
    const [playlistId, setPlaylistId] = useState<string | null>(null)

    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

    const { data } = useFetchPlaylistsQuery()

    const [deletePlaylist] = useDeletePlaylistMutation()

    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)
        }
    }

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setPlaylistId(playlist.id)
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
                tagIds: playlist.attributes.tags.map(t => t.id),
            })
        } else {
            setPlaylistId(null)
        }
    }

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />
            <div className={s.items}>
                {data?.data.map(playlist => {
                    const isEditing = playlistId === playlist.id

                    return (
                        <div className={s.item} key={playlist.id}>
                            {isEditing ? (
                                <EditPlaylistForm
                                    playlistId={playlistId}
                                    handleSubmit={handleSubmit}
                                    register={register}
                                    editPlaylist={editPlaylistHandler}
                                    setPlaylistId={setPlaylistId}
                                />
                            ) : (
                                <PlaylistItem
                                    playlist={playlist}
                                    deletePlaylist={deletePlaylistHandler}
                                    editPlaylist={editPlaylistHandler}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}



// export const PlaylistsPage = () => {
//     // 1
//     const [playlistId, setPlaylistId] = useState<string | null>(null)
//     const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
//
//     const { data } = useFetchPlaylistsQuery()
//     const [deletePlaylist] = useDeletePlaylistMutation()
//     const [updatePlaylist] = useUpdatePlaylistMutation()
//
//     const deletePlaylistHandler = (playlistId: string) => {
//         if (confirm('Are you sure you want to delete the playlist?')) {
//             deletePlaylist(playlistId)
//         }
//     }
//
//     // 3, 5
//     const editPlaylistHandler = (playlist: PlaylistData | null) => {
//         if (playlist) {
//             setPlaylistId(playlist.id)
//             reset({
//                 title: playlist.attributes.title,
//                 description: playlist.attributes.description,
//                 tagIds: playlist.attributes.tags.map(t => t.id),
//             })
//         } else {
//             setPlaylistId(null)
//         }
//     }
//
//     // 4
//     const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
//         if (!playlistId) return
//         updatePlaylist({ playlistId, body: data }).then(() => {
//             setPlaylistId(null)
//         })
//     }
//
//     return (
//         <div className={s.container}>
//             <h1>Playlists page</h1>
//             <CreatePlaylistForm />
//             <div className={s.items}>
//                 {data?.data.map(playlist => {
//                     // 2
//                     const isEditing = playlistId === playlist.id
//
//                     return (
//                         <div className={s.item} key={playlist.id}>
//                             {isEditing ? (
//                                 <form onSubmit={handleSubmit(onSubmit)}>
//                                     <h2>Edit playlist</h2>
//                                     <div>
//                                         <input {...register('title')} placeholder={'title'} />
//                                     </div>
//                                     <div>
//                                         <input {...register('description')} placeholder={'description'} />
//                                     </div>
//                                     <button type={'submit'}>save</button>
//                                     <button type={'button'} onClick={() => editPlaylistHandler(null)}>
//                                         cancel
//                                     </button>
//                                 </form>
//                             ) : (
//                                 <div>
//                                     <div>title: {playlist.attributes.title}</div>
//                                     <div>description: {playlist.attributes.description}</div>
//                                     <div>userName: {playlist.attributes.user.name}</div>
//                                     <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
//                                     <button onClick={() => editPlaylistHandler(playlist)}>update</button>
//                                 </div>
//                             )}
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

