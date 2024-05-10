import React, { useEffect } from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/loginPage');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="mb-4">Welcome to the Home Page</h1>
        <div className="w-64 h-2 bg-gray-300 overflow-hidden">
          <div className="bg-blue-500 h-2 w-full animate-pulse"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes load {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;