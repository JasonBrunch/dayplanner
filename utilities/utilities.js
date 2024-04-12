export const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", // long name of the day
    year: "numeric", // numeric year
    month: "long", // long name of the month
    day: "numeric", // numeric day of the month
  });