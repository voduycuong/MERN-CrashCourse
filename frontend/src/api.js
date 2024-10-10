import axios from "axios";

const URL = "http://localhost:3000"

export async function getPosts() {
    try {
        const res = await axios.get(`${URL}/posts`);
        return res.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export async function getPost(id) {
    const res = await axios.get(`${URL}/posts/${id}`)
    const post = res.data
    const data = await getImage(post.imageId)
    post.image = data
    return post
}

export async function createPost(post) {
    const data = await createImage(post.file)
    const imageId = post.file.name

    post.imageId = imageId

    const res = await axios.post(`${URL}/posts`, post)
    return res
}

export async function updatePost(id, post) {
    const res = await axios.put(`${URL}/posts/${id}`, post)
    return res
}

export async function deletePost(id) {
    const res = await axios.delete(`${URL}/posts/${id}`)
    return res
}

export async function getUser(id) {
    const res = await axios.get(`${URL}/users/${id}`)

    if (res.status === 200) {
        return res.data
    } else {
        return
    }
}

export async function createUser(user) {
    const res = await axios.post(`${URL}/users`, user)
    return res
}

export async function updateUser(id, user) {
    const res = await axios.put(`${URL}/users/${id}`, user)
    return res
}

export async function verifyUser(user) {
    try {
        const res = await axios.post(`${URL}/users/login`, user);
        if (res.data.success) {
            return res.data.token;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        throw error;
    }
}

export async function createImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await axios.post(`${URL}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}

export async function getImage(id) {
    const res = await axios.get(`${URL}/images/${id}`)
    return res
}

export async function searchPosts(title) {
    try {
        const res = await axios.get(`${URL}/search?searchQuery=${title}`);
        return res.data

    } catch (error) {
        console.error("Error searching posts by title:", error);
        throw error;
    }
}
