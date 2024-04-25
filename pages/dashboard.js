import React, { useState } from 'react';
import ScheduleController from '@/components/scheduleController';
import ToDoListController from '@/components/toDoListController';
import Header from '@/components/header';
import { useUser } from '@/context/userContext';
import Image from 'next/image';

function Dashboard() {
  const { user } = useUser(); // Get the current user context
  const [currentView, setCurrentView] = useState('schedule'); // Default to the Schedule view

  // Construct the user icon path with the backend URL to ensure it's correct
  const userIcon = user
    ? `http://localhost:3001${user.userIcon}` // Use absolute URL
    : '/defaultUser.png'; // Default fallback icon

  // Function to determine which view to show based on the current state
  const renderView = () => {
    switch (currentView) {
      case 'schedule':
        return <ScheduleController />;
      case 'toDoList':
        return <ToDoListController />;
      // Additional cases for future views can be added here
      default:
        return <ScheduleController />; // Default view
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main content with a sidebar on the left and variable content on the right */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar with user icon and buttons */}
        <div className=" px-4 py-8 w-20 bg-gray-800 flex flex-col items-center gap-3">
          {/* User icon */}
          <Image
            src={userIcon} // Use the absolute URL
            alt="User Icon"
            width={40}
            height={40}
          />
          <hr className='w-full mb-5 mt-4'/>
          {/* Schedule button */}
          <button
            className="hover:bg-gray-300  rounded shadow  w-full h-11 flex justify-center items-center"
            onClick={() => setCurrentView('schedule')} // Set view to schedule
          >
            <Image
              src="/scheduleIcon.svg"
              alt="Schedule Icon"
              width={28}
              height={28}
            />
          </button>

          {/* To Do List button */}
          <button
            className="hover:bg-gray-300  rounded shadow  w-full h-11 flex justify-center items-center"
            onClick={() => setCurrentView('toDoList')} // Set view to to-do list
          >
            <Image
              src="/toDoListIcon.svg"
              alt="To Do List Icon"
              width={28}
              height={28}
            />
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-grow bg-gray-100">
          {renderView()} {/* Render the current view */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;