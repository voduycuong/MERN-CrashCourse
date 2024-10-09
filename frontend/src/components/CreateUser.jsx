import { createUser } from "../api"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CreateUser() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await createUser(user);
            if (res.status !== 200) {
                alert("User account could not be created :(");
            } else {
                alert("User account successfully created!");
            }
        } catch (error) {
            alert("An error occurred while creating the account :(");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <Input
                placeholder="Name"
                onChange={handleChange}
                name="name"
                required
                maxLength={20}
                className="mb-2"
            />
            <Input
                placeholder="Email"
                onChange={handleChange}
                name="email"
                type="email"
                required
                maxLength={40}
                className="mb-2"
            />
            <Input
                placeholder="Password"
                onChange={handleChange}
                name="password"
                type="password"
                required
                maxLength={20}
                className="mb-2"
            />
            <Button type="submit" className="mb-2">Create Account</Button>
        </form>

    )
}