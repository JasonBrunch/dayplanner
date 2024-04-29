import React, { useState, useEffect } from "react";
import ToDoList from "./toDoList"; // Import the ToDoList component
import { useUser } from "@/context/userContext";
import Modal from "./modal";
import MealCard from "./mealCard";
import MealTotal from "./mealTotal";

const dummyData = [
  {
    entryID: 0,
    entryDate: new Date(2024, 3, 28), // April 29, 2024
    meals: [
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
    ],
  },
  {
    entryID: 1,
    entryDate: new Date(2024, 3, 29), // April 30, 2024
    meals: [
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
    ],
  },
  {
    entryID: 2,
    entryDate: new Date(2024, 4, 1), // May 1, 2024
    meals: [
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
      {
        name: "Caesar Salad",
        calories: 350,
        protein: 15,
        carbohydrates: 15,
        fat: 25,
      },
    ],
  },
];

function MealPrepController() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close
  const [mealData, setMealData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState(0);

  // Update mealData when user data changes
  useEffect(() => {
    console.log("User mealEntries data: ", user?.mealEntries);
    setMealData(user?.mealEntries || []);
  }, [user]);

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleIncrementDate = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
  };

  const handleDecrementDate = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  function areDatesEqual(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function getDailyMealList(searchDate) {
    console.log("Searching for meals on: ", searchDate.toDateString());

    const entry = mealData.find((item) => {
      const itemDate = new Date(item.entryDate);
      console.log(
        `Comparing ${itemDate.toDateString()} to ${searchDate.toDateString()}`
      );
      return areDatesEqual(itemDate, searchDate);
    });

    console.log("Found entry: ", entry);
    return entry ? entry.meals : [];
  }

  const dailyMeals = getDailyMealList(date);

  return (
    <>
    <button onClick={handleDecrementDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Previous Day
        </button>
        <button onClick={handleIncrementDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Next Day
        </button>
      <button
        onClick={handleOpenModal}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700
    "
      >
        NEW MEAL
      </button>
      <h2>Meals for {date.toDateString()}</h2>
      <div className="flex">
        <div className="w-1/2  flex flex-col">
          {dailyMeals.length > 0 ? (
            <div className="flex flex-col gap-2">
              {dailyMeals.map((meal, index) => (
                <MealCard key={index} meal={meal} /> // Use the MealCard component
              ))}
            </div>
          ) : (
            <p>No meals found for this date.</p>
          )}
        </div>
        <div className="w-1/2  flex flex-col">
          <MealTotal meals={dailyMeals} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <input
          type="text"
          value={"Meal Name"}
          onChange={(e) => setMealName(e.target.value)}
          />
          <input
          type="number"
          value={0}
          onChange={(e) => setMealCalories(e.target.value)}
          />
        <button
          onClick={() => {
            console.log("Adding meal: ", mealName, mealCalories);
            handleCloseModal();
          }}
          />
      </Modal>
    </>
  );
}

export default MealPrepController;
