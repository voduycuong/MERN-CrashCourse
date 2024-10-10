import { useState, useRef } from "react"
import { createPost } from "../api"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/hooks/use-toast"

export function CreateBlog() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [file, setFile] = useState()
    const [uploadStatus, setUploadStatus] = useState("")
    const [message, setMessage] = useState("")

    const { toast } = useToast()


    const MAX_FILE_SIZE = 15000000 // 15MB
    const inputFile = useRef(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setUploadStatus("uploading")

        let submitObject = {
            title: title,
            description: description,
            content: content,
            author: null,
            dateCreated: new Date(),
            file: file
        }

        try {
            await createPost(submitObject)
            setUploadStatus("done")
            toast({
                title: "Upload successful!",
                description: "Your post has been uploaded.",
                type: "success",
            })

            // Clear field
            setTitle("")
            setDescription("")
            setContent("")
            setFile(null)
            inputFile.current.value = ""
        } catch (error) {
            setUploadStatus("error")
            console.error("Error uploading file:", error)
            toast({
                title: "Upload failed",
                description: "There was an error uploading your file. Please try again.",
                type: "error",
            })
        }
    }

    function handleFileUpload(e) {
        const file = e.target.files[0]
        const fileExtension = file.name.substring(file.name.lastIndexOf("."))

        console.log(file)
        console.log(fileExtension)

        if (fileExtension !== ".jpg" && fileExtension !== ".png" && fileExtension !== ".jpeg") {
            toast({
                title: "Invalid file type",
                description: "Files must be jpg or png.",
                type: "error",
            })
            inputFile.current.value = ""
            inputFile.current.type = "file"
            return
        }
        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: "File size error",
                description: "File size exceeds the limit (15MB).",
                type: "error",
            })
            inputFile.current.value = "";
            inputFile.current.type = "file";
            return;
        }

        setFile(file);
        setUploadStatus("");
    }

    return (
        <form onSubmit={handleSubmit} className="w-1/2">
            <Label className="flex left-0 p-2">Blog Post Title: </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required name="title" />
            <Label className="flex left-0 p-2">Blog Post Description: </Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} required name="description" />
            <Label className="flex left-0 p-2">Blog Post Content: </Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} required name="content" />
            <Label className="flex left-0 p-2">Insert Header Image: </Label>
            <Input type="file" onChange={handleFileUpload} ref={inputFile} className="cursor-pointer hover:bg-accent" required />

            {/* Display the upload status messages */}
            {uploadStatus === "uploading" && <p>Uploading...</p>}
            {message && <p>{message}</p>} {/* Show message when it's set */}

            <Button type="submit" className="mt-4" disabled={uploadStatus === "uploading"}>Submit</Button>
        </form>
    );
}
