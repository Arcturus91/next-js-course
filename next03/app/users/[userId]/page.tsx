import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"
import type { Metadata } from 'next'
import getAllUsers from "@/lib/getAllUsers"
import { notFound } from 'next/navigation'
type Params = {
    params: {
        userId: string
    }
}

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId)
    const user: User = await userData

    //because here we are creatging the metadata, we can add the user not found case.
    if (!user.name) {
        return {
            title: "User not found",
        }
    }

    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }

}

export default async function UserPage({ params: { userId } }: Params) {
    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)

    // If not progressively rendering with Suspense, use Promise.all
    //const [user, userPosts] = await Promise.all([userData, userPostsData])

    const user = await userData

    if (!user.name) notFound();

    return (
        <>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<h2>Loading...</h2>}>
                {/* @ts-expect-error Server Component */}
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    )
}

//function indicates as in https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export async function generateStaticParams() {
    /*     const users: Promise<User[]> = getUsers()
        const usersData: User[] = await users */
    //if we would use this, there will only be one request to the server because nextjs deduple the requests.
    //with this function it will be ssg: static site generation
    const usersData: Promise<User[]> = getAllUsers();
    const users: User[] = await usersData;

    return users.map((user) => ({
        userId: user.id.toString()
    }))
}

//The generateStaticParams function can be used in combination with dynamic route segments to statically generate routes at build time instead of on-demand at request time.

//when u build this, you will ssg instead of ssr. It means that the page will be generated at build time instead of request time.