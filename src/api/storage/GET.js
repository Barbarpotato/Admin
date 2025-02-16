import base_url from "../index.js";

export const fetchFiles = async ({ folder, pageToken = "", limit = 25, search = "", token }) => {
    if (!token) throw new Error('No token provided');

    const url = new URL(`${base_url()}/storage/${folder}`);
    if (pageToken) url.searchParams.append("pageToken", pageToken);
    if (limit) url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No files found in the folder or no matching files found');
        } else {
            throw new Error('Failed to list files');
        }
    }

    return response.json();
};

export const useDataFiles = ({ folder, pageToken = "", limit = 25, search = "", token }) => {
    return useQuery({
        queryKey: ["files", { folder, pageToken, limit, search }],
        queryFn: () => fetchFiles({ folder, pageToken, limit, search, token }),
        cacheTime: 3600000,
        staleTime: 1800000,
        select: (response) => ({
            message: response.message,
            files: response.files,
            nextPageToken: response.nextPageToken,
        }),
        enabled: !!folder && !!token, // Prevent query from running if folder or token is undefined
    });
};
