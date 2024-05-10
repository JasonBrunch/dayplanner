// pages/_app.js
import React, { useEffect } from "react";
import "../globals.css";
import { UserProvider, useUser } from "@/context/userContext";
import Head from "next/head"; 

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>Day Forge - Optimize Your Day</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Day Forge helps you organize your day with advanced day planning tools, calorie tracking, and customizable task lists. Achieve your daily goals effortlessly!" />
        <link rel="icon" href="/favicon.ico" /> 
        <meta property="og:title" content="Day Forge - Optimize Your Day" />
        <meta property="og:description" content="Discover the ultimate tool for day planning, calorie tracking, and list making to streamline your daily activities and health management." />
        <meta property="og:image" content="/dayforge.jpg" />
        <meta property="og:url" content="https://www.yourdomain.com" />
        <meta property="og:type" content="website" />
      </Head>
      <ComponentWithUser Component={Component} {...pageProps} />
    </UserProvider>
  );
}

const ComponentWithUser = ({ Component, ...props }) => {
  const { login } = useUser(); // Use the 'login' function for both login and refresh

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
          method: "GET",
          credentials: "include", // Necessary to include cookies
        });

        if (res.ok) {
          const data = await res.json();

          login(data.user); // Use 'login' to set the user data
        } else {
          const errorText = await res.text(); // Read the response text
          console.error("Failed to refresh token:", errorText);
          // Handle error, possibly logout user
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchUser();
  }, [login]);

  return <Component {...props} />;
};

export default MyApp;
