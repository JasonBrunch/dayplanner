import React, { useState } from "react";
import { GithubPicker } from "react-color";

function AddActivityUI({
  activityTitle,
  setActivityTitle,
  activityColor,
  setActivityColor,
  startTime,
  handleActivityStartTimeChange,
  generateActivityTimeOptions,
  endTime,
  handleActivityEndTimeChange,
  handleAddActivity,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChangeComplete = (color) => {
    setActivityColor(color.hex);
    setShowColorPicker(false); // Close the color picker after selection
  };

  return (
    <>
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
              onChangeComplete={handleColorChangeComplete}
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
            {generateActivityTimeOptions()}
          </select>
        </div>
        <div className="w-1/2">
          <h3 className="heading3">End</h3>
          <select
            value={endTime}
            onChange={handleActivityEndTimeChange}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
          >
            {generateActivityTimeOptions()}
          </select>
        </div>
      </div>

      <button
        onClick={handleAddActivity}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md mt-4"
      >
        Add Activity
      </button>
    </>
  );
}

export default AddActivityUI;