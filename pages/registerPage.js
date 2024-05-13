import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/managers/loginManager"; // Ensure this is correctly imported
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { loginGuest } from "@/managers/loginManager";

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
        router.push("/dashboard"); // Redirect to dashboard after registration
      } else {
        console.error("Registration Error: ", result.message);
        setErrors((prevErrors) => ({ ...prevErrors, form: result.message }));
      }
    } catch (error) {
      console.error("Registration Error: ", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: error.message || "Registration failed",
      }));
    }
  };
  const handleGuestRegister = async () => {
    const response = await loginGuest();
    if (response.success) {
      login(response.data); // Log in the guest user
      router.push("/dashboard"); // Redirect to the dashboard
    } else {
      setLoginError(response.message);
    }
  };

  return (
    <div
      className="flex justify-end items-center h-screen w-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url('/dayforge.jpg')` }}
    >
      <div className="w-full max-w-lg p-12 lg:mr-52 sm:border sm:border-gray-50 rounded-2xl sm:outline sm:outline-gray-100 sm:outline-2 shadow-lg">
        <form onSubmit={handleRegister} className="max-w-lg mx-auto w-full ">
          <h3 className="text-4xl font-bold text-gray-50">Register</h3>

          <div className=" py-4">
            <label className="text-lg mb-1 block text-gray-50" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black text-sm bg-gray-300 px-4 py-4 rounded-3xl"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2">{errors.email}</p>
            )}
          </div>
          <div className="mt-3">
            <label
              className="text-lg mb-1 block text-gray-50"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black text-sm bg-gray-300 px-4 py-4 rounded-3xl"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password}</p>
            )}
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white highlight hover:bg-blue-700 focus:outline-none rounded-3xl"
            >
              Register
            </button>
          </div>
          <p className="text-sm mt-10 text-center text-gray-50">
            Already have an account?{" "}
            <Link
              href="/loginPage"
              className="text-blue-300 font-semibold hover:underline ml-1"
            >
              Login here.
            </Link>
          </p>
          
        </form>
        <div className="text-sm mt-4 text-center text-white">
              Want to try it out?

              <button
                onClick={handleGuestRegister}
                className="text-blue-300 font-semibold hover:underline ml-1"
              >
                Login as Guest
              </button>   
              </div>
      </div>
    </div>
  );
}

export default RegisterPage;
