import s from './Pagination.module.css'
import { getPaginationPages } from '@/common/utils/getPaginationPages.ts'
import { PaginationControls } from './PaginationControls'
import { PageSizeSelector } from './PageSizeSelector'

type Props = {
    currentPage: number
    setCurrentPage: (page: number) => void
    pagesCount: number
    pageSize: number
    changePageSize: (size: number) => void
}

export const Pagination = ({
                               currentPage,
                               setCurrentPage,
                               pageSize,
                               changePageSize,
                               pagesCount,
                           }: Props) => {
    if (pagesCount <= 1) return null

    const pages = getPaginationPages(currentPage, pagesCount)

    return (
        <div className={s.container}>
            <PaginationControls
                pages={pages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <PageSizeSelector
                pageSize={pageSize}
                changePageSize={changePageSize}
            />
        </div>
    )
}