import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import Modal from "./modal";
import ActivityDisplay from "@/components/activityDisplay";
import AddActivityUI from "@/components/addActivityUI";
import WakeTimeUI from "@/components/wakeTimeUI";
import ScheduleDisplay from "@/components/scheduleDisplay";
import { currentDate } from "@/utilities/utilities";

import {
  createTimeSlot,
  updateActivity,
  createActivity,
} from "@/managers/planManager";

function ScheduleController() {
  const { user } = useUser(); // Retrieve the user object from the User Context
  const [modalOpen, setModalOpen] = useState(false);
  const [activities, setActivities] = useState(user?.activities || []);
  const [wakeTime, setWakeTime] = useState("09:00"); // Default wake time
  const [sleepTime, setSleepTime] = useState("00:00"); // Default sleep time
  const [daySchedule, setDaySchedule] = useState(() =>
    initializeScheduleWithCurrentTime(activities)
  );

  //modal controls
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  // Initialize schedule with activities and current time consideration
  function initializeScheduleWithCurrentTime(activities) {
    // Initialize the base schedule
    let schedule = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        schedule.push(createTimeSlot(hour, minute));
      }
    }
    // Map activities to the initial schedule
    schedule.forEach((slot) => {
      const activity = activities.find((act) => {
        const [startHour, startMinute] = act.startTime.split(":").map(Number);
        const [endHour, endMinute] = act.endTime.split(":").map(Number);

        const slotIndex = slot.hour * 60 + slot.minute;
        const activityStartIndex = startHour * 60 + startMinute;
        const activityEndIndex = endHour * 60 + endMinute;

        return slotIndex >= activityStartIndex && slotIndex < activityEndIndex;
      });

      // Assign the corresponding activity to the slot
      slot.activity = activity || null;
    });

    return schedule;
  }

  useEffect(() => {
    if (user?.activities) {
      setActivities(user.activities); // Update the activities state when the user context changes
      // Reinitialize the daySchedule with the new activities
      setDaySchedule(initializeScheduleWithCurrentTime(user.activities));
    }
  }, [user]); // React when user data changes

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDaySchedule((prevSchedule) =>
        prevSchedule.map((slot) => ({
          ...slot,
          currentMinute:
            now.getHours() === slot.hour && now.getMinutes() === slot.minute,
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWakeTimeChange = (e) => {
    setWakeTime(e.target.value);
  };

  const handleSleepTimeChange = (e) => {
    setSleepTime(e.target.value);
  };

  const handleAddActivity = async (activityData) => {
    const { startTime, endTime, activityTitle, activityColor } = activityData;

    const newActivity = createActivity(
      startTime,
      endTime,
      activityTitle,
      activityColor
    );

    const overlap = activities.some((activity) => {
      const activityStart = activity.startTime.split(":").map(Number);
      const activityEnd = activity.endTime.split(":").map(Number);
      const newStart = newActivity.startTime.split(":").map(Number);
      const newEnd = newActivity.endTime.split(":").map(Number);

      return (
        newStart[0] * 60 + newStart[1] < activityEnd[0] * 60 + activityEnd[1] &&
        newEnd[0] * 60 + newEnd[1] > activityStart[0] * 60 + activityStart[1]
      );
    });

    if (overlap) {
      console.log(
        "Cannot add activity. There is an overlap with an existing activity."
      );
      return;
    }

    if (user) {
      try {
        const response = await fetch("http://localhost:3001/addActivity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            activity: newActivity,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setActivities(result.activities);

          const updatedSchedule = updateActivity(daySchedule, newActivity);
          setDaySchedule(updatedSchedule);

          console.log("Activity added successfully");
        } else {
          console.error("Failed to add activity:", result.message);
        }
      } catch (error) {
        console.error("Error during addActivity API call:", error);
      }
    }
  };

  // Helper function to clear the activity from the schedule
  const clearActivityFromSchedule = (schedule, activityToRemove) => {
    const [startHour, startMinute] = activityToRemove.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = activityToRemove.endTime
      .split(":")
      .map(Number);
    const startIndex = startHour * 60 + startMinute;
    const endIndex = endHour * 60 + endMinute;

    return schedule.map((slot) => {
      const slotIndex = slot.hour * 60 + slot.minute;
      if (slotIndex >= startIndex && slotIndex < endIndex) {
        return { ...slot, activity: null }; // Clear the activity data
      }
      return slot;
    });
  };

  const handleRemoveActivity = async (activityToRemove) => {
    if (!activityToRemove || !activityToRemove._id) {
      console.error("Activity to remove is invalid or does not have an ID.");
      return;
    }

    const userId = user?.id;
    const activityId = activityToRemove._id.toString();

    try {
      const response = await fetch("http://localhost:3001/removeActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          activityId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setActivities(result.activities);
        const newSchedule = clearActivityFromSchedule(
          daySchedule,
          activityToRemove
        );
        setDaySchedule(newSchedule);
      } else {
        console.error("Failed to remove activity:", result.message);
        alert("Failed to remove activity: " + result.message); // User feedback
      }
    } catch (error) {
      console.error("Error during removeActivity API call:", error);
      alert("Error removing activity."); // User feedback
    }
  };

  // Updated isWithinAwakeHours function for 30-hour format
  const isWithinAwakeHours = (hour) => {
    const wakeHour = parseInt(wakeTime.split(":")[0], 10);
    const sleepHour =
      parseInt(sleepTime.split(":")[0], 10) +
      (sleepTime.split(":")[0] < wakeTime.split(":")[0] ? 24 : 0); // Adjust for next day if needed
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
          convertTo12HourFormat={convertTo12HourFormat}
        />
      </div>

      {/* Inputs and Button Container */}
      <div className="w-full md:w-1/4 shadow ">
        <div className="w-full h-10 bg-customBlue flex items-center px-10 "></div>

        <div className="bg-gray-100 relative overflow-hidden h-full">
          <div className=" px-2 lg:px-10 flex flex-col mt-8">
            <WakeTimeUI
              wakeTime={wakeTime}
              sleepTime={sleepTime}
              handleWakeTimeChange={handleWakeTimeChange}
              handleSleepTimeChange={handleSleepTimeChange}
            />

            <hr className="border-t border-gray-400 my-4" />

            <AddActivityUI handleAddActivity={handleAddActivity} />
          </div>
          <div>
            {/* Button to open the modal */}
            <button
              className="mx-auto my-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={openModal}
            >
              Create Activity
            </button>

            {/* Render the modal, passing the `isOpen` and `onClose` props */}
            <Modal isOpen={modalOpen} onClose={closeModal} />
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

export default ScheduleController;
