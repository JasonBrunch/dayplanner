// loginPage.js

import React from 'react';
import LoginForm from '@/components/loginForm';
import { loginUser } from '@/managers/loginManager';
import { useRouter } from 'next/router';

function LoginPage() {
    const router = useRouter();
  const handleLogin = async (username, password) => {
    try {
      const loginResponse = await loginUser(username, password);
      // Handle response, e.g., set user context, redirect, etc.


      console.log("Login Response: ", loginResponse);

      router.push('/dashboard');
    } catch (error) {
      // Error handling, e.g., show error message to the user
      console.error("Login Error: ", error);
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;