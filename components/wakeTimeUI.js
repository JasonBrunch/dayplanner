import React from "react";

function WakeTimeUI({
  wakeTime,
  sleepTime,
  handleWakeTimeChange,
  handleSleepTimeChange
}) {
  return (
    <>
      <h2 className="heading2 pb-2">Set Wake Hours</h2>
      <div className="flex gap-4">
        <div className="w-1/2">
          <h3 className="heading3">Wake</h3>
          <input
            type="time"
            value={wakeTime}
            onChange={handleWakeTimeChange}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
          />
        </div>
        <div className="w-1/2">
          <h3 className="heading3">Sleep</h3>
          <input
            type="time"
            value={sleepTime}
            onChange={handleSleepTimeChange}
            className="bg-white shadow-md rounded px-2 pt-2 pb-3 mb-4 w-full"
          />
        </div>
      </div>
    </>
  );
}

export default WakeTimeUI;
