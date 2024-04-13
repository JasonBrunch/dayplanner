import React, { useState, useEffect } from "react";
import Image from "next/image";

import ActivityDisplay from "@/components/activityDisplay";
import AddActivityUI from "@/components/addActivityUI";
import WakeTimeUI from "@/components/wakeTimeUI";
import ScheduleDisplay from "@/components/scheduleDisplay";
import { currentDate } from "@/utilities/utilities";

import {
  initializeSchedule,
  updateActivity,
  createActivity,
  removeActivity,
} from "@/managers/planManager";

function Home() {
  const [daySchedule, setDaySchedule] = useState(() => initializeScheduleWithCurrentTime());
  const [activities, setActivities] = useState([]);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityColor, setActivityColor] = useState("#ff6347");
  const [wakeTime, setWakeTime] = useState("08:00"); // Default wake time
  const [sleepTime, setSleepTime] = useState("24:00"); // Default sleep time

  // Initialize schedule with current time consideration
  function initializeScheduleWithCurrentTime() {
    const initialSchedule = initializeSchedule();
    return initialSchedule.map(slot => ({
      ...slot,
      currentMinute: isCurrentMinute(slot.hour, slot.minute)
    }));
  }

  function isCurrentMinute(hour, minute) {
    const now = new Date();
    return now.getHours() === hour && now.getMinutes() === minute;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDaySchedule(prevSchedule => prevSchedule.map(slot => ({
        ...slot,
        currentMinute: now.getHours() === slot.hour && now.getMinutes() === slot.minute
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWakeTimeChange = (e) => {
    setWakeTime(e.target.value);
  };

  const handleSleepTimeChange = (e) => {
    setSleepTime(e.target.value);
  };
  const handleActivityStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleActivityEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleAddActivity = () => {
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

    // Reset input fields
    setActivityTitle(""); // Resets title
    setStartTime(endTime); // Resets start time
    setEndTime("00:00"); // Resets end time
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

  const generateActivityTimeOptions = () => {
    let options = [];
    const wakeHour = parseInt(wakeTime.split(":")[0], 10);
    const wakeMinute = parseInt(wakeTime.split(":")[1], 10);
    const sleepHour =
      parseInt(sleepTime.split(":")[0], 10) +
      (sleepTime.split(":")[0] < wakeTime.split(":")[0] ? 30 : 0);
    const sleepMinute = parseInt(sleepTime.split(":")[1], 10);

    // Starting from wake hour to sleep hour
    for (let hour = wakeHour; hour !== sleepHour; hour = (hour + 1) % 30) {
      let startMinute = hour === wakeHour ? wakeMinute : 0;
      let endMinute = hour === sleepHour % 30 ? sleepMinute : 60;
      for (let minute = startMinute; minute < endMinute; minute += 15) {
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

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Schedule Container */}
      <div className="flex flex-col w-full md:w-3/4 p-4 md:p-8 bg-gray-200">
        {/*heading*/}
        <div className="flex justify-between items-end pb-1 pt-4">
          <h1 className=" heading1">{"TODAY'S SCHEDULE"}</h1>
          <h2>{currentDate}</h2>
   
        </div>

        {/*schedule*/}
        <ScheduleDisplay
          daySchedule={daySchedule}
          activities={activities}
          isWithinAwakeHours={isWithinAwakeHours}
          getDisplayTitle={getDisplayTitle}
          colorMapping={colorMapping}
          convertTo12HourFormat={convertTo12HourFormat}
        />
      </div>

      {/* Inputs and Button Container */}
      <div className="w-full md:w-1/4 shadow ">
        <div className="w-full h-10 bg-customBlue flex items-center px-10 "></div>

        <div className="bg-gray-100 relative overflow-hidden h-full">
          <div style={{ height: "50px", width: "100%" }}>
            <Image
              src="/wave.svg"
              alt="Wave"
              layout="responsive"
              width={100}
              height={20}
            />
          </div>
          <div className=" px-2 lg:px-10 flex flex-col mt-8">
            <WakeTimeUI
              wakeTime={wakeTime}
              sleepTime={sleepTime}
              handleWakeTimeChange={handleWakeTimeChange}
              handleSleepTimeChange={handleSleepTimeChange}
              generateTimeOptions={generateTimeOptions}
            />

            <hr className="border-t border-gray-400 my-4" />

            <AddActivityUI
              activityTitle={activityTitle}
              setActivityTitle={setActivityTitle}
              activityColor={activityColor}
              setActivityColor={setActivityColor}
              startTime={startTime}
              handleActivityStartTimeChange={handleActivityStartTimeChange}
              generateActivityTimeOptions={generateActivityTimeOptions}
              endTime={endTime}
              handleActivityEndTimeChange={handleActivityEndTimeChange}
              handleAddActivity={handleAddActivity}
            />
          </div>

          {/* Container for displaying activities */}
          <div className="px-2 lg:px-10 flex flex-col">
            <hr className="border-t border-gray-400 my-4" />
            <ActivityDisplay
              activities={activities}
              handleRemoveActivity={handleRemoveActivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
