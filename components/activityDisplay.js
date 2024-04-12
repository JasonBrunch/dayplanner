import React from "react";

function ActivityDisplay({ activities, handleRemoveActivity }) {
  if (activities.length === 0) {
    return null;
  }
  return (
    <div>
      <h2 className="heading2">Activities</h2>
      <ul>
        {activities.map((activity, index) => (
          <li
            key={index}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 flex justify-between items-center"
          >
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
  );
}
export default ActivityDisplay;
