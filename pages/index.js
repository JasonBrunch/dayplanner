import React, { useState } from "react";
import { initializeSchedule, updateActivity } from "@/managers/planManager";
import { colorMapping } from "@/managers/styleManager";



function Home() {
    const [daySchedule, setDaySchedule] = useState(initializeSchedule());
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:00');
    const [activityTitle, setActivityTitle] = useState('');
    const [activityColor, setActivityColor] = useState('green');

    const handleAddActivity = () => {
        // Call updateActivity and pass the current schedule and new activity details
        const updatedSchedule = updateActivity(daySchedule, startTime, endTime, activityTitle, activityColor);
        // Update the daySchedule state with the new schedule
        setDaySchedule(updatedSchedule);
    };

    
        return (
            <>
                {/* Schedule Container */}
                <div className="flex flex-col items-center">
                    {Array.from({ length: 24 }, (_, hour) => (
                        <div key={hour} className="flex w-full border-b border-gray-300">
                            {/* Hour Display */}
                            <div className="p-1 text-center border-r border-gray-300 w-12">
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                            
                            {/* Minute Cells */}
                            <div className="flex flex-1">
                                {daySchedule
                                    .filter(slot => slot.hour === hour)
                                    .map((slot, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex-1 border-r border-gray-300 ${colorMapping[slot.color] || ""}`}
                                        >
                                            {/* No text, only color */}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
                {/* Inputs and Button Container */}
            <div className="my-4 p-4">
                <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="mr-2"
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="mr-2"
                />
                <input
                    type="text"
                    value={activityTitle}
                    placeholder="Activity Title"
                    onChange={e => setActivityTitle(e.target.value)}
                    className="mr-2"
                />
                <input
                    type="text"
                    value={activityColor}
                    placeholder="Color"
                    onChange={e => setActivityColor(e.target.value)}
                    className="mr-2"
                />
                <button onClick={handleAddActivity} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Activity
                </button>
            </div>
        </>
    );
}

export default Home;





