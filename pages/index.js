import React, { useState } from "react";
import { initializeSchedule, updateActivity, createActivity, removeActivity } from "@/managers/planManager";

function Home() {
  const [daySchedule, setDaySchedule] = useState(initializeSchedule());
  const [activities, setActivities] = useState([]);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityColor, setActivityColor] = useState("green");

  const [wakeTime, setWakeTime] = useState("06:00"); // Default wake time
  const [sleepTime, setSleepTime] = useState("22:00"); // Default sleep time


  const handleAddActivity = () => {
    const newActivity = createActivity(startTime, endTime, activityTitle, activityColor);
  
    // Check for overlaps
    const overlap = activities.some(activity => {
      const [activityStartHour, activityStartMinute] = activity.startTime.split(':').map(Number);
      const [activityEndHour, activityEndMinute] = activity.endTime.split(':').map(Number);
      const [newStartHour, newStartMinute] = newActivity.startTime.split(':').map(Number);
      const [newEndHour, newEndMinute] = newActivity.endTime.split(':').map(Number);
  
      const activityStartIndex = activityStartHour * 60 + activityStartMinute;
      const activityEndIndex = activityEndHour * 60 + activityEndMinute;
      const newStartIndex = newStartHour * 60 + newStartMinute;
      const newEndIndex = newEndHour * 60 + newEndMinute;
  
      return (newStartIndex < activityEndIndex && newEndIndex > activityStartIndex);
    });
    
  
    if (overlap) {
      console.log("Cannot add activity. There is an overlap with an existing activity.");
      return; // Prevent adding the overlapping activity
    }
  
    // If no overlap, add the activity
    setActivities([...activities, newActivity]);
    const updatedSchedule = updateActivity(daySchedule, newActivity);
    setDaySchedule(updatedSchedule);
  };

  const handleRemoveActivity = (activityToRemove) => {
    const { updatedSchedule, updatedActivities } = removeActivity(daySchedule, activities, activityToRemove);
    setDaySchedule(updatedSchedule);
    setActivities(updatedActivities);
  };

  const colorMapping = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    // Add more mappings as needed
  };

// Helper function to check if a given hour is within wake and sleep times
const isWithinAwakeHours = (hour) => {
  const wakeHour = parseInt(wakeTime.split(":")[0], 10);
  const sleepHour = parseInt(sleepTime.split(":")[0], 10);
  return hour >= wakeHour && hour < sleepHour;
};

const handleWakeTimeChange = (e) => {
  setWakeTime(e.target.value);
};

// Handler for sleep time change
const handleSleepTimeChange = (e) => {
  setSleepTime(e.target.value);
};

return (
  <div className="flex">
    {/* Schedule Container */}
    <div className="flex flex-col w-3/4 p-8 bg-gray-200">
      <h1 className="py-4">TODAYS SCHEDULE</h1>
      <div className="flex flex-col items-center w-full">
        {Array.from({ length: 24 }, (_, hour) => (
          isWithinAwakeHours(hour) && (
            <div key={hour} className="flex w-full border-t border-black">
              <div className="py-2 px-6 text-center border-r border-gray-500">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex flex-1">
                {daySchedule
                  .filter((slot) => slot.hour === hour)
                  .map((slot, index) => (
                    <div
                      key={index}
                      className={`flex-1 ${slot.activity ? colorMapping[slot.activity.color] : ""}`}
                    />
                  ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>

    {/* Inputs and Button Container */}
      <div className="w-1/4 shadow">
        <div className="w-full h-20 bg-customBlue flex items-center px-10 ">
          
        </div>

        <div className="bg-gray-100 relative overflow-hidden h-full">
          <div style={{ height: "50px", width: "100%" }}>
            <img
              src="/wave.svg"
              alt="Wave"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div className=" px-2 lg:px-10 flex flex-col">
          {/* Wake Time Input */}
          <h2>Set Wake Hours</h2>
          <h3>Wake</h3>
          <input
            type="time"
            value={wakeTime}
            onChange={handleWakeTimeChange}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
          />
          {/* Sleep Time Input */}
          <h3>Sleep</h3>
          <input
            type="time"
            value={sleepTime}
            onChange={handleSleepTimeChange}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
          />
          <h2>Add Activities</h2>
            <input
              type="text"
              value={activityTitle}
              placeholder="Activity Title"
              onChange={(e) => setActivityTitle(e.target.value)}
              className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className=" bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className=" bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
            />

            {/* Color Selection Dropdown */}
            <select
              value={activityColor}
              onChange={(e) => setActivityColor(e.target.value)}
              className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4"
            >
              {Object.keys(colorMapping).map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddActivity}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
            >
              Add Activity
            </button>
          </div>

         {/* Container for displaying activities */}
    <div className="px-2 lg:px-10 flex flex-col">
<h2>Activities</h2>
<ul>
  {activities.map((activity, index) => (
    <li key={index} className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 flex justify-between items-center">
      <span>
        {activity.title} - {activity.startTime} to {activity.endTime}
      </span>
      <button 
        onClick={() => handleRemoveActivity(activity)} 
        className="text-red-500 hover:text-red-700"
      >
        X
      </button>
    </li>
  ))}
</ul>
    </div>



        </div>
      </div>
    </div>
  );
}

export default Home;