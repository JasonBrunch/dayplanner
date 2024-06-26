import React, { useState, useEffect } from 'react';


const ScheduleDisplay = ({ daySchedule, activities, isWithinAwakeHours, currentDate }) => {
  
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
  
    // Directly convert hour and minute to string without padding
    // and construct the time string with AM/PM
    return `${hour}:${minute.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
  }
  // Render each hour if it's within the defined awake hours
  const renderSchedule = () => {

    const colorMapping = (colorHex) => ({
      backgroundColor: colorHex,
    });
    return Array.from({ length: 24 }, (_, hour) => {
      const hourFormatted = convertTo12HourFormat(`${hour.toString().padStart(2, "0")}:00`);

      if (!isWithinAwakeHours(hour)) return null;

      // Activities for current hour
      const hourlyActivities = activities.filter(activity => {
        const [activityStartHour] = activity.startTime.split(":").map(Number);
        return activityStartHour === hour;
      });

      // Time slots for current hour
      const timeSlots = daySchedule.filter(slot => slot.hour === hour).map((slot, index) => {
        // Determine the style for each slot
        let slotStyle = {};
        if (slot.currentMinute) {
          slotStyle.backgroundColor = '#000000'; // Render it black if it's the current minute
          slotStyle.color = '#ffffff'; // Ensure text color is white for visibility
        } else if (slot.activity) {
          slotStyle = colorMapping(slot.activity.color); // Apply activity color if it's not the current minute
        }
      
        return (
          <div
            key={index}
            className="flex-1"
            style={slotStyle}
          />
        );
      });

      // Render activity labels
      const activityLabels = hourlyActivities.map((activity, index) => {
        const displayTitle = getDisplayTitle(activity);
        return (
          <div
            key={index}
            className="absolute text-sm whitespace-nowrap overflow-hidden px-2 py-3 h-full  activityText"
            style={{
              width: "150%",
              left: `${(new Date(`2021-01-01 ${activity.startTime}`).getMinutes() / 60) * 100}%`,
            }}
          >
            {displayTitle}
          </div>
        );
      });

      return (
        <div key={hour} className="flex w-full">
          <div className="py-2 text-center   w-24 text-gray-50 ">
            {hourFormatted}
          </div>
          <div className="flex flex-1 relative border-b border-gray-500">
            {timeSlots}
            {activityLabels}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col  w-full panel rounded-lg md:pl-3 md:pr-7 lg:pl-4 lg:pr-8 py-4 pb-6">
      <div className='border-b border-gray-500 ml-24   heading2'>{currentDate}</div>
      {renderSchedule()}
    </div>
  );
};

export default ScheduleDisplay;