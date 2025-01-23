export const DeleteProject = async (project_id, token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://hecate-cms.vercel.app/api/projects/${project_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })

    if (!response.ok) throw new Error('Failed to delete project')
    return true
}

export const DeleteBadge = async (badge_id, token) => {

    if (!token) throw new Error('No token provided')

    const url = `https://hecate-cms.vercel.app/api/badges/${badge_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })

    if (!response.ok) throw new Error('Failed to delete badge')
    return true
}