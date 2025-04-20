import base_url from "../index.js";

export const DeployProjects = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/webhook/deploy-projects`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Projects')
    return true
}
