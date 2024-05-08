import React, { useState } from "react";
import ScheduleController from "@/components/scheduleController";
import ToDoListController from "@/components/toDoListController";
import { useUser } from "@/context/userContext";

import MealPrepController from "@/components/mealPrepController";
import Navbar from "@/components/navbar";

function Dashboard() {
  const { user, login } = useUser(); // Get the current user context
  const [currentView, setCurrentView] = useState("schedule"); // Default to the Schedule view

  const refreshUserState = async () => {
 
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user); // Update the user context with new data
      } else {
        console.error("Failed to fetch user data:", res.statusText);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };
  // Construct the user icon path with the backend URL to ensure it's correct
  const userIcon = user
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.userIcon}` // Use absolute URL
    : "/defaultUser.png"; // Default fallback icon

  // Function to determine which view to show based on the current state
  const renderView = () => {
    switch (currentView) {
      case "schedule":
        return <ScheduleController />;
      case "toDoList":
        return <ToDoListController />;
      case "mealPrep":
        return <MealPrepController />;
      // Additional cases for future views can be added here
      default:
        return <ScheduleController />; // Default view
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row h-screen w-full ">
      {/* Sidebar with user icon and buttons */}
      
      <Navbar
        userIcon={userIcon}
        setCurrentView={setCurrentView}
        refreshUserState={refreshUserState}
        currentView={currentView}
      />

      {/* Main content area */}
      <div className="background  h-full  flex-grow overflow-y-auto overflow-x-hidden">
        {renderView()}
      </div>
    </div>
  );
}

export default Dashboard;
