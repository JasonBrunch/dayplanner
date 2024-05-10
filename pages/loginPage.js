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
    <div className="px-4 md:px-0 w-full  h-screen flex flex-row background font-sans text-white">
      <div className="flex w-full  justify-center items-center">
        <form className=" max-w-lg mx-auto w-full" onSubmit={handleLogin}>
          <div className="mb-10">
            <h3 className="text-4xl font-extrabold">Sign in</h3>
            <p className="text-sm mt-6 text-gray-50">
              Please sign in to continue.
            </p>
          </div>
          <div>
            <label className="text-gray-50 text-lg mb-3 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="w-full text-white text-sm bg-gray-600 px-4 py-4 rounded-md outline-blue-600"
              placeholder="Enter email"
            />
          </div>
          <div className="mt-6">
            <label
              className="text-gray-100 text-lg mb-3 block"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full text-sm bg-gray-600 px-4 py-4 rounded-md outline-blue-600"
              placeholder="Enter password"
            />
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Log in
            </button>
          </div>
          <p className="text-sm mt-10 text-center">
            Dont have an account?
            <Link
              href="/registerPage"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:flex w-2/5  overflow-hidden">
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/loginPic.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>

    </div>
  );
}

export default LoginPage;
