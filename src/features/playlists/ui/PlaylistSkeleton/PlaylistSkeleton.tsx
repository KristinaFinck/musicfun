import 'react-loading-skeleton/dist/skeleton.css'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";

export const PlaylistSkeleton = () => {
    return (
        <div>
            <Skeleton width={240} height={240} />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </div>
    )
}
