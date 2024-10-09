import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
    function handleSubmit() { }
    return (
        <div className="flex flex-col w-1/2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-primary">Contact Us</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap text-center mb-8">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            <form onSubmit={handleSubmit}>
                <Label className="flex left-0 p-2">Name:</Label>
                <Input type="text" name="name" />
                <Label className="flex left-0 p-2">Email:</Label>
                <Input type="text" name="email" />
                <Label className="flex left-0 p-2">Message:</Label>
                <Textarea name="message"></Textarea>
                <Button type="submit" className="mt-5">Send</Button>
            </form>
        </div >
    )
}