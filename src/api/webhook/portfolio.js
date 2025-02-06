import base_url from "../index.js";

export const DeployPortfolio = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/webhook/deploy-portfolio`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Portfolio')
    return true
}
