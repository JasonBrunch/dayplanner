//loginManager.js

export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'  // Ensure cookies are sent and received
    });
    const data = await response.json();  // Attempt to parse JSON
    if (response.ok) {
      console.log('Login successful', data);
      return { success: true, data: data };
    } else {
      console.error('Failed to login', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Network error', error);
    return { success: false, message: error.message || "Network error" };
  }
};

export const registerUser = async (email, password) => {
  try {
      const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Always process the JSON to handle both success and error uniformly

      if (response.ok) {
          console.log('Registration successful', data);
          return data;
      } else {
          console.error('Failed to register', data.message);
          throw new Error(data.message || 'Unknown registration error'); // Use server-provided error message or a default
      }
  } catch (error) {
      console.error('Network error or JSON parsing error', error);
      throw new Error(error.message || 'Network or parsing error in registration');
  }
};