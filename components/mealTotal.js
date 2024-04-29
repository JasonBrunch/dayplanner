import React from "react";

function MealTotal({ meals }) {
    // Function to calculate total calories from a meals array
    function calculateTotal(meals) {
        let totalCalories = 0;
        if (Array.isArray(meals)) {
            meals.forEach(meal => {
                if (meal && typeof meal.calories === 'number') {
                    totalCalories += meal.calories;
                }
            });
        }
        return totalCalories;
    }

    // Call calculateTotal to get the sum of calories for the meals
    const totalCalories = calculateTotal(meals);

    return (
        <div className="flex w-full h-16 rounded shadow-lg">
            <div className="px-4 heading2 flex items-center w-full">
                CALORIES: {totalCalories} {/* Display the calculated total calories */}
            </div>
        </div>
    );
}

export default MealTotal;