import React, { useState } from "react";
import ButtonMain from "./buttonMain";

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
              className={`panel shadow-md rounded p-3 mb-2 flex flex-col `}
            >
              <div className="flex  w-full">
                <div className="bg-red-100 w-11 h-11 rounded-full mr-4 ml-1"></div>
                <div>
                  <div className="heading3 mb-0 leading-tight">
                    {activity.title}
                  </div>
                  <div className="heading4 mt-0 mb-0 leading-tight">
                    {activity.startTime} - {activity.endTime}
                  </div>
                  {isOpen && (
                    <div className=" w-full mt-2 leading-tight">
                      <p>Description: {activity.description}</p>
                    </div>
                  )}
                </div>

              </div>
              {isOpen && (
                <div className=" flex justify-end ">
                  <ButtonMain 
                  text="Delete"
                  onClick={() => handleRemoveActivity(activity)} />
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
