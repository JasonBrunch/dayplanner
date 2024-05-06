import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from '@/managers/loginManager'; // Ensure this is correctly imported
import Link from "next/link";
import { useUser } from "@/context/userContext";


function RegisterPage() {
  const { login } = useUser();
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
          login(result.data);
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
<div className="px-4 md:px-0 w-full  h-screen flex flex-row background font-sans text-white">
      <div className="flex w-full  justify-center items-center">
        <form onSubmit={handleRegister} className="max-w-lg mx-auto w-full ">
          <div className="mb-10">
            <h3 className="text-4xl font-extrabold text-gray-50">Register</h3>
            <p className="text-sm mt-6 text-gray-50">
              Create your account. Its free and only takes a minute.
            </p>
          </div>
          <div>
            <label className="text-lg mb-3 block text-gray-50" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm bg-gray-600 px-4 py-4 rounded-md outline-blue-600"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>
          <div className="mt-6">
            <label className="text-lg mb-3 block text-gray-50" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm bg-gray-600 px-4 py-4 rounded-md outline-blue-600"
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
          <p className="text-sm mt-10 text-center text-gray-50">
            Already have an account?{" "}
            <Link
             href="/loginPage"
            className="text-blue-600 font-semibold hover:underline ml-1">
                Login here.
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
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>

    </div>
  );
}

export default RegisterPage;