import base_url from "../index.js";

export const PostAuth = async (token) => {

    const response = await fetch(`${base_url()}/verify/checks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (response.status === 403) throw new Error('Access denied: Invalid or expired token.');
    if (!response.ok) throw new Error('Failed to add Keyword')
    return response.json()
}
