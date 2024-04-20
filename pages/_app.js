// pages/_app.js
import React, { useEffect } from 'react';
import "../globals.css";
import { UserProvider, useUser } from "@/context/userContext";

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <ComponentWithUser Component={Component} {...pageProps} />
        </UserProvider>
    );
}

const ComponentWithUser = ({ Component, ...props }) => {
    const { login } = useUser();  // Use the 'login' function for both login and refresh

    useEffect(() => {
        
        const fetchUser = async () => {
            console.log("Attempting to fetch user data via /refresh");

            try {
                const res = await fetch('http://localhost:3001/refresh', {
                    method: 'GET',
                    credentials: 'include'  // Necessary to include cookies
                });

                console.log("Response status:", res.status);
                console.log("Response headers:", JSON.stringify([...res.headers.entries()]));

                if (res.ok) {
                    const data = await res.json();
                    console.log("Refresh token success, user data:", data);
                    login(data.user);  // Use 'login' to set the user data
                } else {
                    const errorText = await res.text();  // Read the response text
                    console.error('Failed to refresh token:', errorText);
                    // Handle error, possibly logout user
                }
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        };

        fetchUser();
    }, [login]);

    return <Component {...props} />;
}

export default MyApp;