import React, { useState } from "react";

function ActivityDisplay({ activities, handleRemoveActivity }) {
  const [openCardIndex, setOpenCardIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenCardIndex(openCardIndex === index ? null : index); // Toggle card open/close
  };

  // If there are no activities, display a prompt to add an activity
  if (activities.length === 0) {
    return (
      <div className="text-center heading2 p-4">
        <p>Add an activity...</p>
      </div>
    );
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
      
      <ul>
        {sortedActivities.map((activity, index) => {
          const isOpen = openCardIndex === index;

          return (
            <li
              key={index}
              onClick={() => toggleCard(index)}
              className={`panel shadow-md rounded px-2 pt-2 pb-3 mb-2 flex justify-between items-center ${
                isOpen ? "flex-col" : "flex-row"
              }`}
            >
              <div className="flex justify-between w-full heading3">
                <span>
                  {activity.title} - {activity.startTime} to {activity.endTime}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling when removing activity
                    handleRemoveActivity(activity);
                  }}
                  className="text-white hover:text-red-700"
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