// Core Modules
import { useQuery } from "react-query";

// Custom Modules
import base_url from "../index.js";


const fetchBadges = async ({ queryKey }) => {
    const [_key, params] = queryKey;
    const { page, per_page, title } = params;

    const url = new URL(`${base_url()}/badges`);

    // Append query parameters for pagination & search
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', per_page);
    if (title) url.searchParams.append('title', title); // Add search query if exists

    const response = await fetch(url.toString(), { method: 'GET' });

    if (!response.ok) throw new Error('Failed to fetch Badges');

    return response.json(); // Return JSON response
};


export const useBadgesData = (page = 1, per_page = 8, title = '') => {
    return useQuery({
        queryKey: ["badges", { page, per_page, title }],
        queryFn: fetchBadges,
        cacheTime: 3600000, // Cache for 1 hour
        staleTime: 1800000, // Stale time for 30 mins
        select: (data) => ({
            ...data, // Preserve metadata (current_page, last_page, etc.)
            data: data.data.map((item, index) => ({
                number: (page - 1) * per_page + index + 1, // Numbering per page
                ...item
            }))
        }),
    });
};