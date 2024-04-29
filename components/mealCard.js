import React from "react";

function MealCard({ meal}) {
  const { name, calories } = meal;
  return (
    <div className="flex w-full h-16  rounded-md shadow-lg">
      <div className="px-4 heading2   flex items-center w-full">{name}</div>
      <div className="heading2 bg-blue-200 items-center flex justify-center w-1/4">{calories}</div>
    </div>
  );
}

export default MealCard;
