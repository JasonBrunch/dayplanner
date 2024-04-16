//loginManager.js

export const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful', data);
        // Redirect user or do something upon successful login
      } else {
        console.error('Failed to login', data.message);
        // Handle errors or display a message to the user
      }
    } catch (error) {
      console.error('Network error', error);
      // Handle network errors or display a message
    }
  };