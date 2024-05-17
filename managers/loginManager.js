//loginManager.js

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'  // Ensure cookies are sent and received
    });
    const data = await response.json();  // Attempt to parse JSON
    if (response.ok) {
    
      
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'  // Ensure cookies are sent and received
    });

    const data = await response.json();
    if (response.ok) {

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

export const loginGuest = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Ensure cookies are sent and received
    });
    const data = await response.json();  // Attempt to parse JSON
    if (response.ok) {
      console.log('Guest login successful', data);
      return { success: true, data: data.user };  // Return the complete user object
    } else {
      console.error('Failed to login guest', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Network error', error);
    return { success: false, message: error.message || "Network error" };
  }
};