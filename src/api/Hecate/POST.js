export const PostProject = async (body, token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://hecate-cms.vercel.app/api/projects`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add project')
    return true
}


export const PostBadge = async (body, token) => {
    if (!token) throw new Error('No token provided')

    const url = `https://hecate-cms.vercel.app/api/badges`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add badge')
    return true
}


/**
 * Send a contact message using the provided request body.
 *
 * @param {Object} reqBody - The request body for the message -> {name, email, message}
 * @return {Promise<Object>} A promise that resolves to the JSON response from the server
 */
export const sendContactMessage = async (reqBody) => {

    const url = `https://hecate-cms.vercel.app/api/forms`;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}