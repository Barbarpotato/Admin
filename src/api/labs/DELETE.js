import base_url from "../index.js";

export const DeleteBlog = async (blog_id, token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/labs/${blog_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to delete blogs')
    return true
}
