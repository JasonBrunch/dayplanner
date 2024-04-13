import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update the time every minute

    return () => {
      clearInterval(timerId); // Clear the interval on component unmount
    };
  }, []);

  return (
    <div>
      <h1>Current Time</h1>
      <p>{time.toLocaleTimeString()}</p> {/* Displaying time in a readable format */}
    </div>
  );
};

export default Clock;