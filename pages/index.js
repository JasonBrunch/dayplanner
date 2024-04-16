import React, { useEffect } from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  useEffect(() => {
    // Assuming you have a way to check authentication status
    // Redirect if not authenticated:
    router.push('/loginPage');
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* If authenticated, show home page content here */}
    </div>
  );
}

export default Home;
