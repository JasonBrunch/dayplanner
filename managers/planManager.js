import React from "react";



export function initializeSchedule() {
  let schedule = [];
  for (let hour = 0; hour < 30; hour++) {
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

  // Function to remove an activity
export function removeActivity(schedule, activities, activityToRemove) {
  // Remove the activity from the activities array
  const updatedActivities = activities.filter(activity => activity !== activityToRemove);

  // Convert activity start and end times to indexes
  const [startHour, startMinute] = activityToRemove.startTime.split(':').map(Number);
  const [endHour, endMinute] = activityToRemove.endTime.split(':').map(Number);
  let startIndex = startHour * 60 + startMinute;
  let endIndex = endHour * 60 + endMinute;

  // Update the schedule to set the activity to null for the timeslots of the removed activity
  let updatedSchedule = schedule.map(slot => {
    let slotIndex = slot.hour * 60 + slot.minute;
    if (slotIndex >= startIndex && slotIndex < endIndex && slot.activity === activityToRemove) {
      return createTimeSlot(slot.hour, slot.minute); // Resets to a timeslot with no activity
    } else {
      return slot;
    }
  });

  return { updatedSchedule, updatedActivities };
}