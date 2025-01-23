import { useQuery } from "react-query";

const fetchProjects = async () => {
    const url = `https://hecate-cms.vercel.app/api/projects`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch projects')
    return response.json()
}

export const useDataProjects = () => {
    return useQuery("projects", () => fetchProjects(), {
        cacheTime: 3600000,
        staleTime: 1800000
    })
}


const fetchAllBadges = async () => {
    const url = `https://hecate-cms.vercel.app/api/badges`;

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