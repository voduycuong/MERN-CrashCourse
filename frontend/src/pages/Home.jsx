import { getPosts } from "../api";
import { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { Progress } from "@/components/ui/progress"

export function Home() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        async function loadAllPosts() {
            setIsLoading(true)
            setProgress(0)

            try {
                setProgress(30);

                const data = await getPosts();

                data.sort((d1, d2) => new Date(d2.dateCreated).getTime() - new Date(d1.dateCreated).getTime());


                setPosts(data);
            } catch (error) {
                console.error("Error loading posts:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAllPosts();
    }, []);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-1/2 mt-4">
                {isLoading ? (
                    <div className="text-center py-4">
                        <p></p>
                        <Progress value={progress} />
                    </div>
                ) : (
                    posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}
