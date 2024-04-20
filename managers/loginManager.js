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
      
      return { success: true, data: data.user };  // Return the complete user object
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

    const data = await response.json();
    if (response.ok) {
      console.log('Registration successful', data);
      // Ensure to return both success status and user data
      return { success: true, data: data.user };
    } else {
      console.error('Failed to register', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Network error or JSON parsing error', error);
    return { success: false, message: error.message || 'Network or parsing error in registration' };
  }
};