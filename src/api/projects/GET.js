// Core Modules
import { useQuery } from "react-query";

// Custom Modules
import base_url from "../index.js";

const fetchProjects = async ({ queryKey }) => {

    const [_key, params] = queryKey;
    const { page, per_page, heading } = params;

    const url = new URL(`${base_url()}/projects`);

    // Append query parameters for pagination & search
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page);
    if (heading) url.searchParams.append('heading', heading); // Add search query if exists

    const response = await fetch(url.toString(), { method: 'GET' });

    if (!response.ok) throw new Error('Failed to fetch Projects')
    return response.json()
}

export const useDataProjects = (page = 1, per_page = 8, heading = '') => {
    return useQuery({
        queryKey: ["projects", { page, per_page, heading }],
        queryFn: fetchProjects,
        cacheTime: 3600000,
        staleTime: 1800000
    })
}
