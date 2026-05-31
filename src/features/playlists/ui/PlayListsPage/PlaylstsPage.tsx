import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from "@/features/playlists/playlistsApi.ts";
import s from "./PlaylistsPage.module.css"
import {CreatePlaylistForm} from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/playlistsApi.types.ts";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx";
import {useDebounceValue} from "@/common/hooks/useDebounceValue.ts";



export const PlaylistsPage = () => {
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const debounceSearch = useDebounceValue(search)
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

    const { data, isLoading } = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize: 2,
    })

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
            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={e => setSearch(e.currentTarget.value)}
            />
            <div className={s.items}>
                {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
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
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pagesCount={data?.meta.pagesCount || 1}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


