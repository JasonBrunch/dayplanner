export function getCurrentDateDisplay() {
  // Create two date objects, one for now and one for today at midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());



  // Check if 'now' is the same as 'today' (ignores the time component)
  if (now.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
   
      return "TODAY";
  } else {
      console.log("Date is not today.");
  }

  // If it's not today, return the formatted date
  const formattedDate = now.toLocaleDateString("en-US", {
      weekday: "long", // long name of the day
      year: "numeric", // numeric year
      month: "long", // long name of the month
      day: "numeric", // numeric day of the month
  });

  console.log("Formatted Date:", formattedDate);
  return formattedDate;
}