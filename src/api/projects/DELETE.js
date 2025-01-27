// Custom Modules
import base_url from "../index.js";

export const DeleteProject = async (project_id, token) => {
    if (!token) throw new Error('No token provided')

    const url = `${base_url()}/projects/${project_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to delete project')
    return true
}