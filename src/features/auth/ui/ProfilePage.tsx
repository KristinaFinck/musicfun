import {useGetMeQuery} from "@/features/auth/api/authApi.ts";

export const ProfilePage = () => {
    const {data} = useGetMeQuery()
    return (
        <h1> Profile Page</h1>
    )
}
