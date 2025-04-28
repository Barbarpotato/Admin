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

    const url = `${base_url()}/labs/search?${params.toString()}`;

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
    const url = `${base_url()}/labs?blog_id=${blog_id}`;

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


const fetchIndex = async () => {
    const url = `${base_url()}/labs/index`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch index')
    return response.json()
}


export const useDataIndex = () => {
    return useQuery(`index`, () => fetchIndex(), {
        cacheTime: 3600000,
        staleTime: 1800000,
        select: (response) => response.map((item) => item.name)
    })
}


const fetchTagSearch = async (query = "") => {
    const url = `${base_url()}/labs/tags?title=${query}`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch index')
    return response.json()
}


export const useTagSearch = (searchTerm) => {
    return useQuery(
        ['tags', searchTerm],
        () => fetchTagSearch(searchTerm),
        {
            enabled: !!searchTerm, // only fetch when searchTerm exists
            cacheTime: 3600000,
            staleTime: 1800000,
            select: (response) => response.map(item => item.name)
        }
    );
};