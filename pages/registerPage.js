import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from '@/managers/loginManager'; // Ensure this is correctly imported
import Link from "next/link";

function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!email.includes("@")) {
      newErrors.email = "Email must include '@'.";
      valid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateForm()) return; // Prevent form submission if validation fails

    try {
        const result = await registerUser(email, password);
        if (result.success) {
          
            router.push("/dashboard");  // Redirect to dashboard after registration
        } else {
            console.error("Registration Error: ", result.message);
            setErrors(prevErrors => ({ ...prevErrors, form: result.message }));
        }
    } catch (error) {
        console.error("Registration Error: ", error);
        setErrors(prevErrors => ({ ...prevErrors, form: error.message || 'Registration failed' }));
    }
};

  return (
    <div className="font-sans text-gray-800 max-w-7xl mx-auto h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <form onSubmit={handleRegister} className="max-w-lg mx-auto w-full p-6">
          <div className="mb-10">
            <h3 className="text-4xl font-extrabold">Register</h3>
            <p className="text-sm mt-6">
              Create your account. Its free and only takes a minute.
            </p>
          </div>
          <div>
            <label className="text-lg mb-3 block" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm bg-gray-100 px-4 py-4 rounded-md outline-blue-600"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>
          <div className="mt-6">
            <label className="text-lg mb-3 block" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm bg-gray-100 px-4 py-4 rounded-md outline-blue-600"
              placeholder="Create a password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Register
            </button>
          </div>
          <p className="text-sm mt-10 text-center">
            Already have an account?{" "}
            <Link
             href="/loginPage"
            className="text-blue-600 font-semibold hover:underline ml-1">
                Register here
            </Link>
              Login here
          </p>
        </form>
        {/*}
        <div className="h-full md:py-6 flex items-center relative">
          <img
            src="https://readymadeui.com/photo.webp"
            className="rounded-md lg:w-4/5 md:w-11/12 z-50 relative"
            alt="Dining Experience"
          />
        </div>
        */}
      </div>
    </div>
  );
}

export default RegisterPage;