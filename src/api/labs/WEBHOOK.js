import base_url from "../index.js";

export const DeployLabs = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/labs/webhook/deploy`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Labs')
    return true
}
