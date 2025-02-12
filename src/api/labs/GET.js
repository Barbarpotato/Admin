import { useQuery } from "react-query";
import base_url from "../index.js";

const fetchBlogs = async ({ queryKey }) => {

    const [_key, { page, title, slug, blog_id }] = queryKey;

    // Construct query parameters dynamically
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: 8,
    });

    if (title) params.append("title", title);
    if (slug) params.append("slug", slug);
    if (blog_id) params.append("blog_id", blog_id);


    const url = `${base_url()}/labs?${params.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}

// Custom hook for fetching blogs
export const useDatablogs = ({ page, title = "", slug = "", blog_id = "" }) => {
    return useQuery({
        queryKey: ["blogs", { page, title, slug, blog_id }],
        queryFn: fetchBlogs,
        cacheTime: 3600000,
        staleTime: 1800000,
        select: (response) => ({
            current_page: response.current_page,
            per_page: response.per_page,
            last_page: response.last_page,
            total_blogs: response.total_blogs,
            data: response.data.map((blog) => ({
                ...blog,
                short_description:
                    blog.short_description.length > 40
                        ? blog.short_description.slice(0, 40) + "..."
                        : blog.short_description,
            })),
        }),
        enabled: !!page, // Prevent query from running if page is undefined
    });
};


export const fetchBlogById = async (blog_id) => {
    const url = `${base_url()}/labs/search?blog_id=${blog_id}`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}

export const useDatablogById = (blog_id) => {
    return useQuery(`blog-${blog_id}`, () => fetchBlogById(blog_id), {
        cacheTime: 3600000,
        staleTime: 1800000
    })
}


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
