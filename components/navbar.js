import React from "react";
import Image from "next/image";

const Navbar = ({ userIcon, setCurrentView, refreshUserState }) => {
  return (
    <div className="flex-shrink-0 sm:px-4 py-2 sm:py-8 sm:w-20 sidebar flex flex-row sm:flex-col items-center sm:gap-3 sm:h-full">
      {/* Schedule button */}
      <button
        className="hover:bg-gray-300 rounded shadow w-full h-11 flex justify-center items-center order-1"
        onClick={() => {
          setCurrentView("schedule");
          refreshUserState(); // Refresh user state when switching to the schedule view
        }}
      >
     
        <img
          src="/scheduleIcon.svg"
          alt="Schedule Icon"
          style={{ width: 28, height: 28 }}
        />
   
      </button>

      {/* To Do List button */}
      <button
        className="hover:bg-gray-300 rounded shadow w-full h-11 flex justify-center items-center order-2"
        onClick={() => {
          setCurrentView("toDoList");
          refreshUserState(); // Refresh user state when switching to the to-do list view
        }}
      >
        
        <img
          src="/toDoListIcon.svg"
          alt="To Do List Icon"
          style={{ width: 28, height: 28 }}
        />
        
      </button>

      {/* Meal prep button*/}
      <button
        className="hover:bg-gray-300 rounded shadow w-full h-11 flex justify-center items-center order-3"
        onClick={() => {
          setCurrentView("mealPrep");
          refreshUserState(); // Refresh user state when switching to the meal prep view
        }}
      >
      {/*
        <Image src="/meal.svg" alt="Meal Prep Icon" width={28} height={28} />
      */}
      <img src="/meal.svg" alt="Meal Prep Icon" style={{ width: 28, height: 28 }} />
      
      </button>

      {/* User icon */}

      <div className="w-full h-11 flex justify-center items-center order-last sm:order-none">

        <img
          src={userIcon} // Use the absolute URL
          alt="User Icon"
          style={{ width: 40, height: 40 }}
        />
      </div>

      <hr className="hidden sm:block w-full mb-5 mt-4" />
    </div>
  );
};

export default Navbar;
