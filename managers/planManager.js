import React from "react";

export function getCurrentDate(){
    const date = new Date();
    return date.toDateString();

}

export function initializeSchedule() {
    let schedule = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) { // Assuming 5-minute slots
        let timeSlot = {
          hour: hour,
          minute: minute,
          activity: null
        };
        schedule.push(timeSlot);
      }
    }
    return schedule;
  }

  export function updateActivity(schedule, startTime, endTime, activityName, color) {
    let updatedSchedule = [...schedule];
  
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let startIndex = startHour * 60 + startMinute;
    let endIndex = endHour * 60 + endMinute;
  
    for (let i = 0; i < updatedSchedule.length; i++) {
      let slotHour = updatedSchedule[i].hour;
      let slotMinute = updatedSchedule[i].minute;
      let slotIndex = slotHour * 60 + slotMinute;
  
      if (slotIndex >= startIndex && slotIndex < endIndex) {
        updatedSchedule[i] = {
          ...updatedSchedule[i],
          activity: {
            name: activityName,
            color: color
          }
        };
      }
    }
  
    return updatedSchedule;
  }