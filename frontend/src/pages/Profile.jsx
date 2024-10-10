import { BlogCard } from "../components/BlogCard"
import { useState, useEffect } from "react"
import { getPosts } from "../api"
import * as jwt_decode from "jwt-decode"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Profile() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User")
            const decodedUser = jwt_decode.jwtDecode(token)
            const allPosts = await getPosts()
            const filteredPosts = allPosts.filter((post) => post.author == decodedUser._id)
            setPosts(filteredPosts)
            setUser(decodedUser)
        }
        loadUserData()
    }, [])

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) {
            return;
        }

        sessionStorage.removeItem("User");
        navigate("/");
    }

    const handleDelete = (postId) => {
        setPosts(posts.filter((post) => post._id !== postId));
    };

    return (
        <div className="w-2/3">
            {/* Name Section */}
            <div className="flex items-center mb-6">
                <label className="text-xl text-muted-foreground mr-2">Name:</label>
                <h2 className="text-xl font-semibold tracking-tight">{user.name}</h2>
            </div>

            {/* Email Section */}
            <div className="flex items-center mb-6">
                <label className="text-xl text-muted-foreground mr-2">Email:</label>
                <h2 className="text-xl font-semibold tracking-tight">{user.email}</h2>
            </div>

            {/* Join Date Section */}
            <div className="flex items-center mb-6">
                <label className="text-xl text-muted-foreground mr-2">Join Date:</label>
                <h2 className="text-xl font-semibold tracking-tight">
                    {user.joinDate}
                </h2>
            </div>

            <Button
                className={"bg-red-500 text-white"}
                onClick={handleLogout}
            >
                Log out
            </Button>

            {posts.map((post) => {
                return (
                    <BlogCard
                        key={post._id}
                        post={post}
                        isProfilePage={true}
                        onDelete={handleDelete}
                    />
                );
            })}
        </div>
    )
}