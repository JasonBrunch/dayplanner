import React from "react";
import ButtonMain from "./buttonMain"; // Assuming this is the correct button component

function MealCard({ meal, removeMeal }) {
  const { name, calories } = meal;
  return (
    <div className="flex w-full h-16 rounded-md shadow-lg panel2 justify-between items-center">
      <div className="px-4 heading2">{name}</div>
      <div className="heading2">{calories} kcal</div>
      <ButtonMain text="Remove" onClick={removeMeal} />
    </div>
  );
}

export default MealCard;