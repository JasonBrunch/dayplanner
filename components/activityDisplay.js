import React, { useState } from "react";

function ActivityDisplay({ activities, handleRemoveActivity }) {
  const [openCardIndex, setOpenCardIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenCardIndex(openCardIndex === index ? null : index); // Toggle card open/close
  };

  if (activities.length === 0) {
    return null; // No activities to display
  }

  // Sort activities by start time
  const sortedActivities = activities.sort((a, b) => {
    const [aHour, aMinute] = a.startTime.split(":").map(Number);
    const [bHour, bMinute] = b.startTime.split(":").map(Number);

    const aTime = aHour * 60 + aMinute; // Convert to minute-based index
    const bTime = bHour * 60 + bMinute;

    return aTime - bTime; // Ascending order
  });

  return (
    <div>
      <h2 className="heading1">Activities</h2>
      <ul>
        {sortedActivities.map((activity, index) => {
          const isOpen = openCardIndex === index;

          return (
            <li
              key={index}
              onClick={() => toggleCard(index)}
              className={`bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 flex justify-between items-center ${
                isOpen ? "flex-col" : "flex-row"
              }`}
            >
              <div className="flex justify-between w-full">
                <span>
                  {activity.title} - {activity.startTime} to {activity.endTime}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling when removing activity
                    handleRemoveActivity(activity);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
              {isOpen && (
                <div className="mt-4 w-full">
                  <p>
                    Description: {activity.description}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityDisplay;