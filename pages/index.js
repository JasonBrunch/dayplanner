import React, { useState } from "react";
import { initializeSchedule, updateActivity } from "@/managers/planManager";

function Home() {
  const [daySchedule, setDaySchedule] = useState(initializeSchedule());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityColor, setActivityColor] = useState("green");

  const handleAddActivity = () => {
    // Call updateActivity and pass the current schedule and new activity details
    const updatedSchedule = updateActivity(
      daySchedule,
      startTime,
      endTime,
      activityTitle,
      activityColor
    );
    // Update the daySchedule state with the new schedule
    setDaySchedule(updatedSchedule);
  };
  const colorMapping = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    // Add more mappings as needed
  };

  return (
    <div className="flex">
      {/* Schedule Container */}
      {/*Schedule frame*/}
      <div className=" flex flex-col  w-3/4 p-8 bg-gray-200">
      <h1 className="py-4">TODAYS SCHEDULE</h1>
        <div className="flex flex-col items-center w-full">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="flex w-full border-t  border-black">
              {/* Hour Display */}
              <div className="py-2 px-6 text-center border-r border-gray-500 ">
                {hour.toString().padStart(2, "0")}:00
              </div>

              {/* Minute Cells */}
              <div className="flex flex-1">
                {daySchedule
                  .filter((slot) => slot.hour === hour)
                  .map((slot, index) => (
                    <div
                      key={index}
                      className={`flex-1  ${
                        colorMapping[slot.color] || ""
                      }`}
                    >
                      {/* No text, only color */}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Inputs and Button Container */}
      <div className="w-1/4">
        <div className="w-full h-40 bg-customBlue flex items-center px-10 ">
          <h2 className="text-white">
            Add <br />
            Activity
          </h2>
        </div>

        <div className="bg-gray-100 relative overflow-hidden h-full">
          <div style={{ height: "80px", width: "100%" }}>
            <img
              src="/wave.svg"
              alt="Wave"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div className=" px-2 lg:px-10 flex flex-col">
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
        </div>
      </div>
    </div>
  );
}

export default Home;
