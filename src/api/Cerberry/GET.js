import { useQuery } from "react-query";

const fetchBlogs = async (PageNumber) => {
    const url = `https://cerberry-backend.vercel.app/blogs?page=${PageNumber}&per_page=8`;

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
    const url = `https://cerberry-backend.vercel.app/blog_by_id/${blog_id}`;

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


const fetchBlogsBySearch = async (searchQuery) => {
    let url = "";
    if (searchQuery != "") url = `https://cerberry-backend.vercel.app/blogs_by_search?title=${searchQuery}`;
    else url = `https://cerberry-backend.vercel.app/blogs`;

    const response = await fetch(url, {
        method: 'GET',
    })
    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}


export const useDatablogsBySearch = (searchQuery) => {
    return useQuery('blogs-data', () => fetchBlogsBySearch(searchQuery), {
        cacheTime: 3600000,
        staleTime: 1800000
    })
}


/**
 * Fetches the latest blog from the backend server.
 * 
 * @return {Promise} A promise that resolves with the JSON response containing the fetched blog.
 */
const fetchBlogLatest = async () => {

    // **
    // using public json data for efficiency
    const url = `/blog_latest.json`;

    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}


/**
 * Returns the result of a query for fetching latest blog data.
 * 
 * @return {object} The result of the query for fetching latest blog data.
 */
export const useDataBlogLatest = () => {
    return useQuery('blog-latest', () => fetchBlogLatest(), {
        cacheTime: 3600000,
        staleTime: 1800000
    })
}

/**
 * Fetches the details of a blog using the blog ID.
 *
 * @param {String} blogId - The ID of the blog to fetch details for
 * @return {Promise} A promise that resolves with the JSON representation of the blog details
 */
const fetchBlogDetail = async (blogId) => {
    const url = `https://cerberry-backend.vercel.app/blog_by_id/${blogId}`;

    const response = await fetch(url, {
        method: 'GET',
    })
    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
}


/**
 * Returns the result of a query for fetching blog data by Id.
 *
 * @param {String} blogId - The ID of the blog to fetch
 * @return {Object} The blog detail data
 */
export const useDataBlogDetail = (blogId) => {
    return useQuery(['blog', blogId], () => fetchBlogDetail(blogId), {
        cacheTime: 3600000,
        staleTime: 1800000
    })
}