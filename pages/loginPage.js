import React from 'react';
import LoginForm from '@/components/loginForm';
import { loginUser } from '@/managers/loginManager';
import { useRouter } from 'next/router';

function LoginPage() {
  const router = useRouter();
  const handleLogin = async (username, password) => {
    try {
      const loginResponse = await loginUser(username, password);
      console.log("Login Response: ", loginResponse);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  // Avoid using javascript:void(0); in href
  const handleLinkClick = (event) => {
    event.preventDefault();
    // You can perform other actions here if needed
  };

  return (
    <div className="font-sans text-gray-800 max-w-7xl mx-auto h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <form className="max-w-lg mx-auto w-full p-6">
          <div className="mb-10">
            <h3 className="text-4xl font-extrabold">Sign in</h3>
            <p className="text-sm mt-6">Immerse yourself in a hassle-free login journey with our intuitively designed login form. Effortlessly access your account.</p>
          </div>
          <div>
            <label className="text-lg mb-3 block" htmlFor="email">Email</label>
            <div className="relative flex items-center">
              <input id="email" name="email" type="text" required className="w-full text-sm bg-gray-100 px-4 py-4 rounded-md outline-blue-600" placeholder="Enter email" />
            </div>
          </div>
          <div className="mt-6">
            <label className="text-lg mb-3 block" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <input id="password" name="password" type="password" required className="w-full text-sm bg-gray-100 px-4 py-4 rounded-md outline-blue-600" placeholder="Enter password" />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between mt-4">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-3 block text-sm">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" onClick={handleLinkClick} className="text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>
          <div className="mt-10">
            <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              Log in
            </button>
          </div>
          <p className="text-sm mt-10 text-center">Dont have an account <a href="#" onClick={handleLinkClick} className="text-blue-600 font-semibold hover:underline ml-1">Register here</a></p>
        </form>
        <div className="h-full md:py-6 flex items-center relative">
          <img src="https://readymadeui.com/photo.webp" className="rounded-md lg:w-4/5 md:w-11/12 z-50 relative" alt="Dining Experience" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;