import base_url from "../index.js";

export const PostBlog = async (body, token) => {

    if (!token) throw new Error('No token provided')

    console.log(token)

    const url = `${base_url()}/labs`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add blogs')
    return true
}