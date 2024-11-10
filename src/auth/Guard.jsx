import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../utils/Loading';

function Guard() {

    const [isAuthenticated, setIsAuthenticated] = useState(null);  // Changed initial state to `null` for better handling of loading state

    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkAuth = async () => {

            if (!token) {
                setIsAuthenticated(false);  // No token, not authenticated
                return;
            }

            try {
                const response = await fetch('https://coretify.vercel.app/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                });

                if (!response.ok) {
                    setIsAuthenticated(false);  // Token is invalid, set as unauthenticated
                    localStorage.removeItem('token');  // Optionally clear token
                    return;
                }

                const data = await response.json();
                if (data?.message === "Token is valid") {
                    setIsAuthenticated(true);  // Token is valid
                } else {
                    setIsAuthenticated(false);  // Invalid token
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                setIsAuthenticated(false);  // In case of error, consider user as not authenticated
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        // While loading the authentication status, show nothing or a loading indicator
        return <Loading />
    }

    // Render children if authenticated
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default Guard;
