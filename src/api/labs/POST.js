import base_url from "../index.js";

export const PostBlog = async (body, token) => {

    if (!token) throw new Error('No token provided')

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

    return await response.json();
}


export const PostBlogTags = async (blogId, tags, token) => {
    if (!token) throw new Error('No token provided');
    if (!blogId) throw new Error('No blog ID provided');
    if (!tags || !Array.isArray(tags)) throw new Error('Tags must be an array');

    const url = `${base_url()}/labs/${blogId}/tags`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add tags: ${errorText}`);
    }

    return true;
};