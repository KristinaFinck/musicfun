import { useFetchTracksInfiniteQuery } from './../api/trackApi.ts'
import s from './../ui/TrackPage.module.css'

export const TracksPage = () => {
    const { data } = useFetchTracksInfiniteQuery({ paginationType: 'cursor', pageSize: 5 })

    const pages = data?.pages.flatMap((page) => page.data) || []

    return (
        <div>
            <h1>Tracks page</h1>
            <div className={s.list}>
                {pages.map(track => {
                    const { title, user, attachments } = track.attributes

                    return (
                        <div key={track.id} className={s.item}>
                            <div>
                                <p>Title: {title}</p>
                                <p>Name: {user.name}</p>
                            </div>
                            {attachments.length ? <audio controls src={attachments[0].url} /> : 'no file'}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}