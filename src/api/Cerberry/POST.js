export const PostBlog = async (body, token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://cerberry-backend.vercel.app/blog`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add blogs')
    return true
}
