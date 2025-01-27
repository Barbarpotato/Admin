// Core Modules
import { useQuery } from "react-query";

// Custom Modules
import base_url from "../index.js";

const fetchAllBadges = async () => {
    const url = `${base_url()}/badges`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch Badges')
    return response.json()
}


export const useBadgesData = () => {
    return useQuery('badges', fetchAllBadges, {
        cacheTime: 3600000,
        staleTime: 1800000,
        select: (data) => {
            return data.map((item, index) => ({
                number: index + 1,
                ...item
            }))
        },
    });
};