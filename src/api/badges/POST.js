// Custom Modules
import base_url from "../index.js";

export const PostBadge = async (body, token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/badges`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add badge')
    return true
}