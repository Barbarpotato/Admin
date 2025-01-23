export const DeployPortfolio = async (token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://hecate-cms.vercel.app/api/webhook`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token
        }
    })

    if (!response.ok) throw new Error('Failed to deploy Portfolio')
    return true
}
