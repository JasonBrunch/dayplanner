import React from "react";
import {
  CircularProgressbarWithChildren,
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function calculateTotal(meals, type = "calories") {
  return meals.reduce((acc, meal) => acc + Number(meal[type] || 0), 0);
}

function CalorieProgress({ totalCalories, targetCalories }) {
  const percentage = Math.min(100, (totalCalories / targetCalories) * 100);

  return (
    <div className="w-full h-full p-6 relative ">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          rotation: 0.0,
          strokeLinecap: "round",
          pathTransitionDuration: 0.5,
          pathColor: "#BB86FC",
          trailColor: "#121212",
          backgroundColor: "#3e98c7",
        })}
      >
        <div className="absolute w-full text-center top-1/2 transform -translate-y-1/2">
          <div className=" heading1">{totalCalories}</div>
          <div className="heading3">CALORIES</div>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}

function NutrientProgress({ value, maxValue, color }) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  return (
    <div className="w-24 h-24">
      <CircularProgressbar
        value={percentage}
        styles={buildStyles({
          pathColor: "#BB86FC",
          trailColor: "#121212",
        })}
      />
    </div>
  );
}

function MealTotal({ meals }) {
  const targetCalories = 1600;
  const totalCalories = calculateTotal(meals);
  const totalProtein = calculateTotal(meals, "protein");
  const totalCarbs = calculateTotal(meals, "carbs");
  const totalFats = calculateTotal(meals, "fats");

  return (
    <div className="flex flex-col justify-center w-full sm:flex-row   ">
      <div className="min-w-80 ">
        <CalorieProgress
          totalCalories={totalCalories}
          targetCalories={targetCalories}
        />
      </div>
      <div className="flex sm:flex-col justify-center items-center gap-2">
        <div className="flex flex-col sm:flex-row  items-center w-full">
          <NutrientProgress
            value={totalProtein}
            maxValue={100}
          />
          <div className="ml-2 min-w-20  flex flex-col  justify-center items-center">
            <div className="heading2">{totalProtein}g</div>
            <div className="heading3">PROTEIN</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row  items-center w-full">
          <NutrientProgress value={totalCarbs} maxValue={300} color="#ff9800" />
          <div className="ml-2 flex min-w-20  flex-col justify-center items-center">
            <div className="heading2">{totalCarbs}g</div>
            <div className="heading3">CARBS</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row  items-center w-full">
          <NutrientProgress value={totalFats} maxValue={70} color="#f44336" />
          <div className="ml-2 flex min-w-20  flex-col justify-center items-center">
            <div className=" heading2">{totalFats}g</div>
            <div className="heading3">FATS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealTotal;
