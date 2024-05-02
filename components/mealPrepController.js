import React, { useState, useEffect } from "react";
import Modal from "./modal";
import MealCard from "./mealCard";
import MealTotal from "./mealTotal";
import { useUser } from "../context/userContext";
import ButtonMain from "./buttonMain";

function MealPrepController() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealData, setMealData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dailyMeals, setDailyMeals] = useState([]);

  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState(0);
  const [mealProtein, setMealProtein] = useState(0);
  const [mealCarbohydrates, setMealCarbohydrates] = useState(0);
  const [mealFat, setMealFat] = useState(0);


  useEffect(() => {
    if (user && user.mealEntries) {
      setMealData(user.mealEntries);
    }
  }, [user]);

  useEffect(() => {
    const updatedMeals = mealData.find((entry) =>
      areDatesEqual(new Date(entry.entryDate), date)
    );
    setDailyMeals(updatedMeals ? updatedMeals.meals : []);
  }, [mealData, date]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleIncrementDate = () =>
    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
  const handleDecrementDate = () =>
    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));

  const createNewMealEntry = (
    mealName,
    mealCalories,
    mealProtein,
    mealCarbohydrates,
    mealFat
  ) => {
    const activeDate = new Date(date);
    activeDate.setHours(0, 0, 0, 0);
    const meal = {
      name: mealName,
      calories: Number(mealCalories),
      protein: Number(mealProtein),
      carbohydrates: Number(mealCarbohydrates),
      fat: Number(mealFat),
    };

    const existingEntryIndex = mealData.findIndex((entry) =>
      areDatesEqual(new Date(entry.entryDate), activeDate)
    );
    if (existingEntryIndex === -1) {
      const newEntry = createNewMealEntryData(activeDate, meal);
      handleNewEntry(newEntry);
    } else {
      const updatedEntry = addMealToExistingEntry(
        mealData,
        existingEntryIndex,
        meal
      );
      handleUpdateEntry(existingEntryIndex, updatedEntry);
    }
  };

  const addMealToExistingEntry = (mealData, entryIndex, meal) => {
    const updatedMeals = [...mealData[entryIndex].meals, meal];
    const updatedEntry = { ...mealData[entryIndex], meals: updatedMeals };
    return updatedEntry;
  };

  const createNewMealEntryData = (activeDate, meal) => {
    return {
      entryID: mealData.length,
      entryDate: activeDate,
      meals: [meal],
    };
  };

  const handleNewEntry = (newEntry) => {
    const updatedMealData = [...mealData, newEntry];
    setMealData(updatedMealData);
    updateMealEntries(updatedMealData);
  };

  const handleUpdateEntry = (index, updatedEntry) => {
    const updatedMealData = [
      ...mealData.slice(0, index),
      updatedEntry,
      ...mealData.slice(index + 1),
    ];
    setMealData(updatedMealData);
    updateMealEntries(updatedMealData);
  };

  function areDatesEqual(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  const updateMealEntries = async (updatedMealData) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateMealEntries`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          mealEntries: updatedMealData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();  // Getting response as text to avoid JSON parsing error
        console.error("Failed to update meal entries:", errorData);
        throw new Error(`Failed to update: ${response.status} ${errorData}`);
      }

      const data = await response.json(); // Assuming the server responds with JSON on success
      console.log("Meal entries updated successfully:", data);
    } catch (error) {
      console.error("Error updating meal entries:", error.message);
    }
  };


  const displayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time portion to ensure accurate comparison

    const displayDate = new Date(date);
    displayDate.setHours(0, 0, 0, 0); // Normalize this date as well

    if (displayDate.getTime() === today.getTime()) {
      return "TODAY";
    }
    return displayDate.toDateString();
  }

  return (
    <div className="flex py-8 px-10 gap-5">


      <div className="w-4/6 ">
        <div className="heading1 flex justify-center w-4/6 ">MEAL TRACKER</div>
        <MealTotal meals={dailyMeals} />
      </div>




      <div className="flex flex-col w-2/6 mr-4">
        <div className="heading1  flex justify-center ">{displayDate()}</div>



        <div className="flex gap-2 mb-3 ">
          <ButtonMain
            text="NEW MEAL"
            onClick={handleOpenModal}
          />

          <ButtonMain
            text="PREVIOUS DAY"
            onClick={handleDecrementDate}
          />
          <ButtonMain
            text="NEXT DAY"
            onClick={handleIncrementDate}

          />



        </div>

        <div className="w-full flex flex-col gap-2">
          {dailyMeals.length > 0 ? (
            dailyMeals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))
          ) : (
            <p>No meals found for this date.</p>
          )}
        </div>



      </div>










      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col">
          <div>Name</div>
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="border border-gray-400 p-2 rounded-lg"
          />
          <div>Calories</div>
          <input
            type="number"
            value={mealCalories}
            onChange={(e) => setMealCalories(Number(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg"
          />
          <div>Protein</div>
          <input
            type="number"
            value={mealProtein}
            onChange={(e) => setMealProtein(Number(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg"
          />
          <div>Carbohydrates</div>
          <input
            type="number"
            value={mealCarbohydrates}
            onChange={(e) => setMealCarbohydrates(Number(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg"
          />
          <div>Fat</div>
          <input
            type="number"
            value={mealFat}
            onChange={(e) => setMealFat(Number(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg"
          />
          <button
            onClick={() =>
              createNewMealEntry(
                mealName,
                mealCalories,
                mealProtein,
                mealCarbohydrates,
                mealFat
              )
            }
          >
            SAVE
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default MealPrepController;
