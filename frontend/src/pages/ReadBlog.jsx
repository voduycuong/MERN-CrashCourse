import { getPost } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"


export function ReadBlog() {
    const [post, setPost] = useState(null); // Initialize as null for loading state
    const [loading, setLoading] = useState(true); // Loading state

    let params = useParams();
    const navigate = useNavigate();
    let id = params.id;

    useEffect(() => {
        async function loadPost() {
            try {
                let data = await getPost(id);
                let date = new Date(data.dateCreated);
                data.dateCreated = date.toString();
                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        }
        loadPost();
    }, [id]); // Add id as a dependency to refetch if it changes

    if (loading) {
        return <p>Loading...</p>; // Show loading indicator
    }

    if (!post) {
        return <p>Post not found.</p>; // Handle case when post is not found
    }

    return (
        <div className="flex flex-col items-center w-1/2">
            <Button onClick={() => navigate(-1)} className="w-47 my-4">Back</Button>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-primary">{post.title}</h1>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-2">{post.description}</h2>

            <div className="flex w-full justify-center">
                {post.image?.data && <img src={post.image.data} alt={post.title} className="max-h-96 my-4" />} {/* Conditional rendering */}
            </div>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{new Date(post.dateCreated).toLocaleDateString()}</h3> {/* Format date */}

            <p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap text-left">{post.content}</p>
        </div >
    );
}