// Core Modules
import { useQuery } from "react-query";

// Custom Modules
import base_url from "../index.js";

const fetchProjects = async () => {
    const url = `${base_url()}/projects`;

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
