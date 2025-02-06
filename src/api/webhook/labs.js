import base_url from "../index.js";

export const DeployLabs = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/webhook/deploy-labs`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Labs')
    return true
}