// Core Modules
import { useQuery } from "react-query";

// Custom Modules
import base_url from "../index.js";

const fetchDeploymentPortfolioStatus = async ({ queryKey }) => {
    const [, token] = queryKey;
    const url = `${base_url()}/deployments/portfolio`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch deployment portfolio');
    return response.json();
};

const fetchDeploymentProjectsStatus = async ({ queryKey }) => {
    const [, token] = queryKey;
    const url = `${base_url()}/deployments/projects`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch deployment portfolio');
    return response.json();
};

const fetchDeploymentLabsStatus = async ({ queryKey }) => {
    const [, token] = queryKey;
    const url = `${base_url()}/deployments/labs`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch deployment labs');
    return response.json();
};

export const useDeploymentPortfolioStatus = (token) => {
    return useQuery(['deployment-portfolio', token], fetchDeploymentPortfolioStatus, {
        cacheTime: 3600000,
        staleTime: 1800000,
        refetchInterval: 10000, // Poll every 10s
        select: (data) => {
            return data.map((item, index) => ({
                number: index + 1,
                ...item
            }));
        },
        enabled: !!token, // Only run query if token is available
    });
};

export const useDeploymentLabsStatus = (token) => {
    return useQuery(['deployment-labs', token], fetchDeploymentLabsStatus, {
        cacheTime: 3600000,
        staleTime: 1800000,
        refetchInterval: 10000, // Poll every 10s
        select: (data) => {
            return data.map((item, index) => ({
                number: index + 1,
                ...item
            }));
        },
        enabled: !!token, // Only run query if token is available
    });
};

export const useDeploymentProjectsStatus = (token) => {
    return useQuery(['deployment-projects', token], fetchDeploymentProjectsStatus, {
        cacheTime: 3600000,
        staleTime: 1800000,
        refetchInterval: 10000, // Poll every 10s
        select: (data) => {
            return data.map((item, index) => ({
                number: index + 1,
                ...item
            }));
        },
        enabled: !!token, // Only run query if token is available
    });
};