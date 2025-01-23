export const DeployLabs = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://cerberry-backend.vercel.app/webhook/trigger-deploy`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Labs')
    return true
}
