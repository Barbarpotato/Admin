import { useQuery } from "react-query";
import base_url from "../index.js";

const fetchBlogs = async (PageNumber) => {

    const url = `${base_url()}/labs?page=${PageNumber}&per_page=8`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}

export const useDatablogs = (PageNumber) => {
    return useQuery(['blogs', PageNumber], () => fetchBlogs(PageNumber), {
        cacheTime: 3600000,
        staleTime: 1800000,
        select: (data) => (data.map((blog) => ({
            ...blog,
            short_description: blog.short_description.length > 40 ? blog.short_description.slice(0, 40) + '...' : blog.short_description
        }))),
    })
}

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
