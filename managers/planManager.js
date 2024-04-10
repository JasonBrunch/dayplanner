import React from "react";

export function getCurrentDate(){
    const date = new Date();
    return date.toDateString();

}

export function initializeSchedule() {
  let schedule = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      schedule.push(createTimeSlot(hour, minute));
    }
  }
  return schedule;
}

export function updateActivity(schedule, activity) {
  let updatedSchedule = [...schedule];

  const [startHour, startMinute] = activity.startTime.split(':').map(Number);
  const [endHour, endMinute] = activity.endTime.split(':').map(Number);
  let startIndex = startHour * 60 + startMinute;
  let endIndex = endHour * 60 + endMinute;

  for (let i = 0; i < updatedSchedule.length; i++) {
    let slotHour = updatedSchedule[i].hour;
    let slotMinute = updatedSchedule[i].minute;
    let slotIndex = slotHour * 60 + slotMinute;

    if (slotIndex >= startIndex && slotIndex < endIndex) {
      updatedSchedule[i] = createTimeSlot(slotHour, slotMinute, activity);
    }
  }

  return updatedSchedule;
}

  function createTimeSlot(hour, minute, activity = null) {
    return {
      hour: hour,
      minute: minute,
      activity: activity
    };
  }

  export function createActivity(startTime, endTime, title, color) {
    return {
      startTime: startTime,
      endTime: endTime,
      title: title,
      color: color
    };
  }