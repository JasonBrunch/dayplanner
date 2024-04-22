import React from "react";





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
      // Preserve currentMinute flag while updating the slot with new activity
      updatedSchedule[i] = {
        ...createTimeSlot(slotHour, slotMinute, activity),
        currentMinute: updatedSchedule[i].currentMinute
      };
    }
  }

  return updatedSchedule;
}

export function createTimeSlot(hour, minute, activity = null) {
  return {
    hour: hour,
    minute: minute,
    activity: activity,
    currentMinute: false
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

