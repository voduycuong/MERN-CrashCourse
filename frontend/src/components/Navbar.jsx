import { Link } from "react-router-dom";
import { pageData } from "./pageData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { searchPosts } from "../api";
import { Input } from "@/components/ui/Input";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export function Navbar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);



    async function handleSearchChange(e) {
        const query = e.target.value;
        setSearchQuery(query)

        if (query.trim() === "") {
            setSearchResults([])
            return
        }

        try {
            const results = await searchPosts(query)
            setSearchResults(results)
        } catch (error) {
            console.error("Error searching posts:", error)
            setSearchResults([])
        }
    }

    function handleResultClick(postId) {
        navigate(`/readblog/${postId}`)
        setSearchQuery("")
        setSearchResults([])
    }

    return (
        <NavigationMenu className="bg-primary fixed w-screen top-0 left-0 h-20 p-2 flex items-center">
            <NavigationMenuList className="flex items-center">
                {pageData.map((page) => (
                    <NavigationMenuItem key={page.name}>
                        <Link to={page.path}>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                {page.name}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}

                <form>
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-3 border rounded-md ml-10"
                    />
                </form>

            </NavigationMenuList>
            {
                searchResults.length > 0 && (
                    <div className="absolute top-20 bg-white shadow-md z-10 p-4 max-h-100 overflow-y-auto w-[300px]">
                        <ul>
                            {searchResults.map((post) => (
                                <li
                                    key={post._id}
                                    onClick={() => handleResultClick(post._id)}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                >
                                    {post.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </NavigationMenu >
    );
}
