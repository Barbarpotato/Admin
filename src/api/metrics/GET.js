import { useQuery } from "react-query";
import base_url from "../index.js";

const fetchMetrics = async (token) => {

    const url = `${base_url()}/metrics`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!response.ok) throw new Error('Failed to fetch metrics')
    return response.json()
}

export const useDataMetrics = (token) => {
    return useQuery('metrics', () => fetchMetrics(token), {
        refetchInterval: 60000, // Polling each 1 min
    })
}


const fetchLogs = async (token) => {

    const url = `${base_url()}/metrics/logs`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!response.ok) throw new Error('Failed to fetch logs')
    return response.json()
}

export const useDataLogs = (token) => {
    return useQuery('metrics-logs', () => fetchLogs(token), {
        refetchInterval: 60000, // Polling each 1 min
    })
}