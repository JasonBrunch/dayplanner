import React from "react";

export function getCurrentDate(){
    const date = new Date();
    return date.toDateString();

}

export function initializeSchedule() {
    let schedule = [];
    let title = "free"; 
    let defaultColor = "green"; 
    
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
            let timeSlot = {
                hour: hour,
                minute: minute,
                activity: title,
                isStart: false,
                isEnd: false,
                color: defaultColor
            };
            schedule.push(timeSlot);
        }
    }

    return schedule;
}

export function updateActivity(schedule, startTime, endTime, activityName, color) {
    // Create a copy of the schedule
    let updatedSchedule = [...schedule];

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let startIndex = startHour * 60 + startMinute;
    let endIndex = endHour * 60 + endMinute;

    // Only iterate through the relevant portion of the schedule
    for (let i = startIndex; i < endIndex; i++) {
        let slot = updatedSchedule[i];
        updatedSchedule[i] = {
            ...slot,
            activity: activityName,
            color: color,
            isStart: i === startIndex,
            isEnd: i === endIndex - 1
        };
    }

    return updatedSchedule;
}