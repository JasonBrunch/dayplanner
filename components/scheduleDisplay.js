import React, { useState, useEffect } from 'react';


const ScheduleDisplay = ({ daySchedule, activities, isWithinAwakeHours, getDisplayTitle, colorMapping, convertTo12HourFormat }) => {
  
  // Render each hour if it's within the defined awake hours
  const renderSchedule = () => {
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
        <div key={hour} className="flex w-full border-t border-black">
          <div className="py-2 text-center border-r border-gray-500 w-36">
            {hourFormatted}
          </div>
          <div className="flex flex-1 relative">
            {timeSlots}
            {activityLabels}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
  
      {renderSchedule()}
    </div>
  );
};

export default ScheduleDisplay;