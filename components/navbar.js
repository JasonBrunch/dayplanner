import React from "react";
import ScheduleIcon from "./icons/scheduleIcon";
import MealIcon from "./icons/mealIcon";
import ToDoIcon from "./icons/todoIcon";

const Navbar = ({
  userIcon,
  setCurrentView,
  refreshUserState,
  currentView,
}) => {
  return (
    <div className="flex-shrink-0 sm:px-4 py-2 sm:py-8 sm:w-16 background flex flex-row sm:flex-col items-center  sm:gap-7 h-16 sm:h-full sticky top-0 sm:top-auto sm:bottom-0  z-50  border-r">
      {/* Schedule button */}
      <button
        className="  w-full  flex justify-center items-center order-1"
        onClick={() => {
          setCurrentView("schedule");
          refreshUserState();
        }}
      >
        <ScheduleIcon isActive={currentView === "schedule"} />
      </button>

      {/* To Do List button */}
      <button
        className="  w-full  flex justify-center items-center order-2"
        onClick={() => {
          setCurrentView("toDoList");
          refreshUserState();
        }}
      >
        <ToDoIcon isActive={currentView === "toDoList"} />
      </button>

      {/* Meal prep button*/}
      <button
        className=" w-full flex justify-center items-center order-3"
        onClick={() => {
          setCurrentView("mealPrep");
          refreshUserState();
        }}
      >
        <MealIcon isActive={currentView === "mealPrep"} />
      </button>

      {/* User icon */}

      <div className=" w-full  flex justify-center items-center order-last sm:order-none">
      <img src={userIcon} alt="User Icon" className="w-8 h-8" />
      </div>

      <hr className="hidden sm:block w-full mb-3 mt-3" />
    </div>
  );
};

export default Navbar;
