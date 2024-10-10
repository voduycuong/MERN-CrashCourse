import { Link } from "react-router-dom"
import { deletePost } from "../api"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export function BlogCard({ post, isProfilePage, onDelete }) {

    let date = new Date(post.dateCreated)
    let stringDate = date.toString()

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deletePost(post._id);
            onDelete(post._id);
            console.log("Post deleted");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <Card className="flex w-full justify-center my-8 hover:bg-muted">
            <Link to={`/readblog/${post._id}`} className="w-full">
                <CardHeader>
                    <CardTitle>
                        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-primary">
                            {post.title}
                        </h1>
                    </CardTitle>
                    <CardDescription>
                        <h2>{post.description}</h2>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3>{stringDate.slice(4, 15)}</h3>
                </CardContent>
            </Link>
            {
                isProfilePage && (
                    <CardFooter>
                        <Button onClick={handleDelete} className="bg-red-500 text-white">
                            Delete
                        </Button>
                    </CardFooter>
                )
            }
        </Card>
    )
}

