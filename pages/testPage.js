import React from "react";
import LoginForm from "@/components/loginForm";
import { loginUser } from "@/managers/loginManager";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@/context/userContext";

function LoginPage() {
    const router = useRouter();
    const { login } = useUser();
    const [loginError, setLoginError] = React.useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        const response = await loginUser(email, password);
        console.log("Login response:", response);
        if (response.success) {
            console.log("ATTEMPTING TO LOGIN WITH THIS OBJECT:", response.data);
            login(response.data); // Store user data in context

            router.push("/dashboard");
        } else {
            console.error("Login Error: ", response.message);
            setLoginError(response.message);
        }
    };
    return (
        <div className="flex justify-end items-center h-screen w-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url('/dayforge.jpg')` }}>
            <div className="w-full max-w-lg p-12 lg:mr-52 border rounded-xl">
                <form className="space-y-6" onSubmit={handleLogin}>
                   
                        <h3 className="text-4xl font-bold text-gray-50">Sign in</h3>
                    <div>
              
                        <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            className="w-full text-black text-sm bg-gray-300 px-4 py-4 rounded-3xl"
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="mt-6">
   
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full text-black text-sm bg-gray-300 px-4 py-4 rounded-3xl"
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full shadow-xl py-3 px-4 text-md font-bold rounded text-white radial-gradient-button rounded-3xl"
                        >
                            Log in
                        </button>
                    </div>
                    <p className="text-sm mt-10 text-center text-white">
                        Dont have an account?
                        <Link
                            href="/registerPage"
                            className="text-blue-300 font-semibold hover:underline ml-1"
                        >
                            Register here
                        </Link>
                    </p>
                </form></div>









        </div>


    );
}

export default LoginPage;
