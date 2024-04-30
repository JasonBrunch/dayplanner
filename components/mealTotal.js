import React from "react";
import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function calculateTotal(meals, type = 'calories') {
    return meals.reduce((acc, meal) => acc + Number(meal[type] || 0), 0);
}

function CalorieProgress({ totalCalories, targetCalories }) {
    const percentage = Math.min(100, (totalCalories / targetCalories) * 100);

    return (
        <div className="w-full h-full  relative"> 
            <CircularProgressbarWithChildren
                value={percentage}
                styles={buildStyles({
                    rotation: 0.0,
                    strokeLinecap: 'round',
                    pathTransitionDuration: 0.5,
                    pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                })}
            >
                <div className="absolute w-full text-center top-1/2 transform -translate-y-1/2">
                    <div className="text-lg font-semibold">{totalCalories}</div>
                    <div className="text-sm text-gray-500">calories</div>
                </div>
            </CircularProgressbarWithChildren>
        </div>
    );
}

function NutrientProgress({ value, maxValue, color }) {
    const percentage = Math.min(100, (value / maxValue) * 100);
    return (
        <div className="w-16 h-16"> 
            <CircularProgressbar
                value={percentage}
                styles={buildStyles({
                    pathColor: color,
                    trailColor: '#ddd',
                })}
            />
        </div>
    );
}

function MealTotal({ meals }) {
    const targetCalories = 1600;
    const totalCalories = calculateTotal(meals);
    const totalProtein = calculateTotal(meals, 'protein');
    const totalCarbs = calculateTotal(meals, 'carbs');
    const totalFats = calculateTotal(meals, 'fats');

    return (
        <div className="flex w-full rounded shadow-lg bg-white">
            <div className="flex flex-col justify-center items-center w-1/2 ">
                <CalorieProgress totalCalories={totalCalories} targetCalories={targetCalories} />
            </div>
            <div className="flex flex-col justify-around items-center w-1/2">
                <div className="flex items-center">
                    <NutrientProgress value={totalProtein} maxValue={100} color="#4caf50" />
                    <div className="ml-2">
                        <div className="text-lg font-semibold">{totalProtein}g</div>
                        <div className="text-sm text-gray-500">PROTEIN</div>
                    </div>
                </div>
                <div className="flex items-center">
                    <NutrientProgress value={totalCarbs} maxValue={300} color="#ff9800" />
                    <div className="ml-2">
                        <div className="text-lg font-semibold">{totalCarbs}g</div>
                        <div className="text-sm text-gray-500">CARBS</div>
                    </div>
                </div>
                <div className="flex items-center">
                    <NutrientProgress value={totalFats} maxValue={70} color="#f44336" />
                    <div className="ml-2">
                        <div className="text-lg font-semibold">{totalFats}g</div>
                        <div className="text-sm text-gray-500">FATS</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MealTotal;