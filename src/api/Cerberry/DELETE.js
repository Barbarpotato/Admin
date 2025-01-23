export const DeleteBlog = async (blog_id, token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://cerberry-backend.vercel.app/blog_by_id/${blog_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })

    if (!response.ok) throw new Error('Failed to delete blogs')
    return true
}
