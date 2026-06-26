import {useFetchTracksInfiniteQuery} from "@/features/tracks/api/trackApi.ts";
import {useInfiniteScroll} from "@/common/hooks/useInfiniteScroll.ts";
import {TracksList} from "@/features/tracks/TrackList/TrackList.tsx";
import {LoadingTrigger} from "@/features/tracks/TrackList/LoadingTrigger.tsx";

export const TracksPage = () => {
    const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useFetchTracksInfiniteQuery()

    const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })

    const pages = data?.pages.flatMap(page => page.data) || []

    return (
        <div>
            <h1>Tracks page</h1>
            <TracksList tracks={pages} />
            {hasNextPage && (
                <LoadingTrigger isFetchingNextPage={isFetchingNextPage} observerRef={observerRef} />
            )}
            {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
        </div>
    )
}