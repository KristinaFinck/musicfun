import {Route, Routes} from 'react-router'
import {MainPage} from "@/app/ui/main-page/MainPage.tsx";
import {TracksPage} from "@/features/tracks/ui/TracksPage.tsx";
import {ProfilePage} from "@/features/auth/ui/ProfilePage.tsx";
import {PlayListsPage} from "@/features/playlists/ui/PlayListsPage.tsx";
import {PageNotFound} from "@/common/components/PageNotFound";

export const Path = {
    Main: '/',
    Playlists: '/playlists',
    Tracks: '/tracks',
    Profile: '/profile',
    NotFound: '*',
} as const

export const Routing = () => (
    <Routes>
        <Route path={Path.Main} element={<MainPage />} />
        <Route path={Path.Playlists} element={<PlayListsPage />} />
        <Route path={Path.Tracks} element={<TracksPage />} />
        <Route path={Path.Profile} element={<ProfilePage />} />
        <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
)