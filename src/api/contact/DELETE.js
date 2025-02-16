
// Core Modules
import base_url from '../index'

export const deleteContact = async (id, token) => {
    const url = `${base_url()}/contact/${id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Failed to delete contact')
    return response.json()
}