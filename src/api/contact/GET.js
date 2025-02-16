
// Core Modules
import { useQuery } from 'react-query'

// Custom Modules
import base_url from '../index'

export const fetchContact = async (token) => {
    const url = `${base_url()}/contact`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status === 404) throw new Error('Contact not found')
    if (!response.ok) throw new Error('Failed to fetch contact')
    return response.json()

}

export const useDataContact = (token) => {
    return useQuery(`contact`, () => fetchContact(token), {
        cacheTime: 3600000,
        staleTime: 1800000,
        refetchInterval: 10000
    })
}