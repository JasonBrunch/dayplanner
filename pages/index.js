import React, { useState } from "react";
import { GithubPicker } from "react-color";
import {
  initializeSchedule,
  updateActivity,
  createActivity,
  removeActivity,

} from "@/managers/planManager";

function Home() {
  const [daySchedule, setDaySchedule] = useState(initializeSchedule());
  const [activities, setActivities] = useState([]);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityColor, setActivityColor] = useState("#ff6347");

  const [wakeTime, setWakeTime] = useState("06:00"); // Default wake time
  const [sleepTime, setSleepTime] = useState("22:00"); // Default sleep time

  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: 'long', // long name of the day
    year: 'numeric', // numeric year
    month: 'long', // long name of the month
    day: 'numeric' // numeric day of the month
  });

  const handleAddActivity = () => {
    console.log("Selected color:", activityColor);
    const newActivity = createActivity(
      startTime,
      endTime,
      activityTitle,
      activityColor
    );

    // Check for overlaps
    const overlap = activities.some((activity) => {
      const [activityStartHour, activityStartMinute] = activity.startTime
        .split(":")
        .map(Number);
      const [activityEndHour, activityEndMinute] = activity.endTime
        .split(":")
        .map(Number);
      const [newStartHour, newStartMinute] = newActivity.startTime
        .split(":")
        .map(Number);
      const [newEndHour, newEndMinute] = newActivity.endTime
        .split(":")
        .map(Number);

      const activityStartIndex = activityStartHour * 60 + activityStartMinute;
      const activityEndIndex = activityEndHour * 60 + activityEndMinute;
      const newStartIndex = newStartHour * 60 + newStartMinute;
      const newEndIndex = newEndHour * 60 + newEndMinute;

      return (
        newStartIndex < activityEndIndex && newEndIndex > activityStartIndex
      );
    });

    if (overlap) {
      console.log(
        "Cannot add activity. There is an overlap with an existing activity."
      );
      return; // Prevent adding the overlapping activity
    }

    // If no overlap, add the activity
    setActivities([...activities, newActivity]);
    const updatedSchedule = updateActivity(daySchedule, newActivity);
    setDaySchedule(updatedSchedule);
  };

  const handleRemoveActivity = (activityToRemove) => {
    const { updatedSchedule, updatedActivities } = removeActivity(
      daySchedule,
      activities,
      activityToRemove
    );
    setDaySchedule(updatedSchedule);
    setActivities(updatedActivities);
  };

  const colorMapping = (colorHex) => ({
    backgroundColor: colorHex,
  });

  // Updated isWithinAwakeHours function for 30-hour format
  const isWithinAwakeHours = (hour) => {
    const wakeHour = parseInt(wakeTime.split(":")[0], 10);
    const sleepHour =
      parseInt(sleepTime.split(":")[0], 10) +
      (sleepTime.split(":")[0] < wakeTime.split(":")[0] ? 30 : 0); // Adjust for next day if needed
    return hour >= wakeHour && hour < sleepHour;
  };

  const handleWakeTimeChange = (e) => {
    setWakeTime(e.target.value);
  };

  // Handler for sleep time change
  const handleSleepTimeChange = (e) => {
    setSleepTime(e.target.value);
  };

  const getDisplayTitle = (activity) => {
    const { startTime, endTime, title } = activity;
    const duration =
      new Date(`2021-01-01 ${endTime}`) - new Date(`2021-01-01 ${startTime}`);
    const durationMinutes = duration / 60000; // Convert milliseconds to minutes

    if (durationMinutes < 15 && title.length > 15) {
      return `${title.substring(0, 15)}...`; // Abbreviate title
    }
    return title;
  };

  const generateTimeOptions = () => {
    let options = [];
    for (let hour = 0; hour < 30; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(
          <option key={timeString} value={timeString}>
            {convertTo12HourFormat(timeString)}
          </option>
        );
      }
    }
    return options;
  };

  function convertTo12HourFormat(time) {
    let [hour, minute] = time.split(":").map(Number);
    const isPM = hour >= 12 && hour < 24;
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // Convert 0 hour to 12 for 12-hour format

    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
  }

  const handleActivityStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleActivityEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Schedule Container */}
      <div className="flex flex-col w-full md:w-3/4 p-4 md:p-8 bg-gray-200">
        <div className="flex justify-between items-end pb-1 pt-4"><h1 className=" heading1">{"TODAY'S SCHEDULE"}</h1>
        <h2>{currentDate}</h2></div>
        <div className="flex flex-col items-center w-full">
          {Array.from({ length: 30 }, (_, hour) => {
            const hourFormatted = convertTo12HourFormat(
              `${hour.toString().padStart(2, "0")}:00`
            );

            return (
              isWithinAwakeHours(hour) && (
                <div key={hour} className="flex w-full border-t border-black">
                  <div className="py-2 px-6 text-center border-r border-gray-500">
                    {hourFormatted}
                  </div>
                  <div className="flex flex-1 relative">
                    {daySchedule
                      .filter((slot) => slot.hour === hour)
                      .map((slot, index) => (
                        <div
                          key={index}
                          className="flex-1"
                          style={
                            slot.activity
                              ? colorMapping(slot.activity.color)
                              : {}
                          }
                        />
                      ))}
                    {activities
                      .filter((activity) => {
                        const [activityStartHour] = activity.startTime
                          .split(":")
                          .map(Number);
                        return activityStartHour === hour;
                      })
                      .map((activity, index) => {
                        const displayTitle = getDisplayTitle(activity);
                        return (
                          <div
                            key={index}
                            className="absolute text-sm whitespace-nowrap overflow-hidden"
                            style={{
                              width: "150%",
                              left: `${
                                (new Date(
                                  `2021-01-01 ${activity.startTime}`
                                ).getMinutes() /
                                  60) *
                                100
                              }%`,
                            }}
                          >
                            {displayTitle}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

      {/* Inputs and Button Container */}
      <div className="w-full md:w-1/4 shadow h-screen">
        <div className="w-full h-10 bg-customBlue flex items-center px-10 "></div>

        <div className="bg-gray-100 relative overflow-hidden h-full">
          <div style={{ height: "50px", width: "100%" }}>
            <img
              src="/wave.svg"
              alt="Wave"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div className=" px-2 lg:px-10 flex flex-col mt-8">
            {/* Wake Time Input */}
            <h2 className="heading2 pb-2">Set Wake Hours</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <h3 className="heading3">Wake</h3>
                <select
                  value={wakeTime}
                  onChange={handleWakeTimeChange}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
                >
                  {generateTimeOptions()}
                </select>
              </div>
              <div className="w-1/2">
                <h3 className="heading3">Sleep</h3>
                <select
                  value={sleepTime}
                  onChange={handleSleepTimeChange}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
                >
                  {generateTimeOptions()}
                </select>
              </div>
            </div>
            <hr className="border-t border-gray-400 my-4" />
            <h2 className="heading2 pb-2">Add Activities</h2>

            <div className="flex  gap-4">
              <div className=" w-full">
                <h3 className="heading3">Title</h3>
                <input
                  type="text"
                  value={activityTitle}
                  placeholder="Enter activity title"
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
                />
              </div>

              {/* Color Picker Dropdown */}
              <div>
                <h3 className="heading3">Color</h3>
                <button
                  onClick={toggleColorPicker}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 lg:w-12 lg:h-11"
                  style={{ backgroundColor: activityColor }}
                ></button>
                {showColorPicker && (
                  <GithubPicker
                    color={activityColor}
                    onChangeComplete={(color) => setActivityColor(color.hex)}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <h3 className="heading3">Start</h3>
                <select
                  value={startTime}
                  onChange={handleActivityStartTimeChange}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
                >
                  {generateTimeOptions()}
                </select>
              </div>
              <div className="w-1/2">
                <h3 className="heading3">End</h3>
                <select
                  value={endTime}
                  onChange={handleActivityEndTimeChange}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
                >
                  {generateTimeOptions()}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddActivity}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md mt-4"
            >
              Add Activity
            </button>
          </div>

          {/* Container for displaying activities */}
          <div className="px-2 lg:px-10 flex flex-col">
            <hr className="border-t border-gray-400 my-4" />
            <h2 className="heading2">Activities</h2>
            <ul>
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 flex justify-between items-center"
                >
                  <span>
                    {activity.title} - {activity.startTime} to{" "}
                    {activity.endTime}
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
