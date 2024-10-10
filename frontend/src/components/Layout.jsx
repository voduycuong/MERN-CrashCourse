import { Navbar } from "./Navbar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"

export function Layout() {
    let user = sessionStorage.getItem("User")
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user])

    return (
        <>
            <Navbar />
            <main className="flex w-screen justify-center mt-24">
                <Outlet />
            </main>
            <Toaster />
        </>
    )
}