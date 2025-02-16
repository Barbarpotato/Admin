import base_url from "../index.js";

export const deleteFile = async (folder, fileName, token) => {
    if (!token) throw new Error('No token provided');
    if (!folder) throw new Error('Folder name is required');
    if (!fileName) throw new Error('File name is required');

    const url = `${base_url()}/storage/${folder}/${fileName}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('Folder name or file name is required');
        } else if (response.status === 404) {
            throw new Error('File not found');
        } else {
            throw new Error('Failed to delete file');
        }
    }

    const data = await response.json();
    return data.message;
}
