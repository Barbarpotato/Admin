import base_url from "../index.js";

export const PostBlog = async (body, token) => {

    if (!token) throw new Error('No token provided')

    console.log(token)

    const url = `${base_url()}/labs`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Failed to add blogs')
    return true
}

export const uploadFile = async (folder, file, token) => {
    if (!token) throw new Error('No token provided');
    if (!file) throw new Error('No file uploaded');

    const url = `${base_url()}/storage/${folder}`;

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('No file uploaded');
        } else {
            throw new Error('Upload failed');
        }
    }

    const data = await response.json();
    return {
        message: data.message,
        url: data.url
    };
};
