import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import Modal from "./modal";

function ToDoListController() {
  const { user } = useUser(); // Retrieve the user context
  const [toDoList, setToDoList] = useState([]);
  const [newTask, setNewTask] = useState({ default: "" }); // Initialize as an empty object
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setToDoList(user.toDoList || []);
      setCategories(user.categories || []); // Include this to update when categories change
    }
  }, [user]); // Add categories as a dependency

  const addCategory = async () => {
    if (newCategory.trim() === "") return; // Validate empty input

    try {
      const response = await fetch("http://localhost:3001/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          categoryName: newCategory,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        const newCategory = result.category;
        setCategories((prevCategories) => [...prevCategories, newCategory]); // Append new category
        setNewCategory(""); // Clear the input field
        setCategoryModalOpen(false); // Close the modal
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const addTask = async (category) => {
    if (!newTask[category] || newTask[category].trim() === "") return; // Ensure there's a valid task to add

    try {
      const response = await fetch("http://localhost:3001/addToDoItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          toDoItem: {
            task: newTask[category], // Task for the specific category
            completed: false,
            category,
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setToDoList(result.toDoList); // Update the to-do list
        setNewTask((prev) => ({
          ...prev,
          [category]: "", // Clear the corresponding category's task
        }));
      } else {
        console.error("Error adding task:", result.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleTaskInputChange = (category, value) => {
    setNewTask((prev) => ({
      ...prev,
      [category]: value || "", // Default to empty string if undefined
    }));
  };

  const toggleCompletion = (itemId) => {
    setToDoList((prevList) =>
      prevList.map((item) =>
        item._id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeTask = async (itemId) => {
    try {
      const response = await fetch("http://localhost:3001/removeToDoItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, toDoItemId: itemId }),
      });

      const result = await response.json();
      if (response.ok) {
        setToDoList(result.toDoList);
      } else {
        console.error("Error removing task:", result.message);
      }
    } catch (err) {
      console.error("Error removing task:", err);
    }
  };

  const groupedToDoLists = toDoList.reduce((acc, item) => {
    const category = item.category || "default"; // Retrieve category name
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const toggleCategoryModal = () => {
    setCategoryModalOpen(!isCategoryModalOpen);
  };
  
  
  const removeCategory = async (categoryId) => {
    if (!categoryId) {
      console.error("Invalid category ID");
      return; // Handle invalid input
    }
  
    try {
      const response = await fetch("http://localhost:3001/removeCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, categoryId }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Updated categories:", result.categories); // Debugging info
        setCategories(result.categories); // Update categories state
        setToDoList(result.toDoList); // Update to-do list state
      } else {
        console.error("Error removing category:", result.message);
      }
    } catch (err) {
      console.error("Error removing category:", err);
    }
  };

  return (
    <div>
      <div className="p-8 flex flex-wrap gap-4">
        {" "}
        {/* Flex layout with gap */}
        {/* Default To-Do List */}
        <div className="w-80 rounded px-6 py-3 bg-gray-200 h-full shadow-lg">
          <h1 className="flex w-full mt-3 items-center justify-center heading1 pb-2">
            TO-DO LIST
          </h1>

          <ul className="list-disc">
            {groupedToDoLists["default"]?.map((item) => (
              <li key={item._id} className="flex justify-between items-center">
                <span
                  onClick={() => toggleCompletion(item._id)}
                  className={`cursor-pointer ${
                    item.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.task}
                </span>
                <button
                  className="text-red-500 hover-text-red-700"
                  onClick={() => removeTask(item._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center mt-2">
            <input
              type="text"
              value={newTask["default"]}
              onChange={(e) => handleTaskInputChange("default", e.target.value)}
              placeholder="Enter new task"
              className="appearance-none bg-transparent border-b-2 w-full py-2 text-gray-700"
            />

            <button
              className="ml-4 bg-transparent border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover-bg-gray-200"
              onClick={() => addTask("default")}
            >
              Save
            </button>
          </div>
        </div>
        {/* Render additional categories */}
        {categories?.map((category) => (
          <div key={category._id} className="w-80 rounded px-6 py-3 bg-gray-200 h-full shadow-lg relative">
            <h2>{category?.name ?? "Unnamed Category"}</h2>{" "}
   
            <button
              className="absolute top-1 right-1 text-red-500 hover-text-red-700"
              onClick={() => removeCategory(category._id)}
              title="Remove Category"
            >
              ×
            </button>
            <ul className="list-disc">
              {groupedToDoLists[category]?.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <span
                    onClick={() => toggleCompletion(item._id)}
                    className={`cursor-pointer ${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.task}
                  </span>
                  <button
                    className="text-red-500 hover-text-red-700"
                    onClick={() => removeTask(item._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={newTask[category]} // Ensure each category's input has a unique state
                onChange={(e) =>
                  handleTaskInputChange(category, e.target.value)
                }
                placeholder="Enter new task"
                className="appearance-none bg-transparent border-b-2 w-full py-2 text-gray-700"
              />

              <button
                className="ml-4 bg-transparent border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover-bg-gray-200"
                onClick={() => addTask(category)}
              >
                Save
              </button>
            </div>
          </div>
        ))}
        {/* Modal for adding a new category */}
        <Modal isOpen={isCategoryModalOpen} onClose={toggleCategoryModal}>
          <h2 className="text-lg font-bold">Add New Category</h2>

          <input
            type="text"
            placeholder="Enter new category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border-b-2 w-full py-2 text-gray-700"
          />

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            onClick={addCategory}
          >
            Add
          </button>
        </Modal>
        {/* Button to open category modal */}
        <button
          className="ml-4 bg-transparent border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover-bg-gray-200"
          onClick={toggleCategoryModal}
        >
          Add Category
        </button>
      </div>{" "}
      {/* End of flex div */}
    </div>
  );
}

export default ToDoListController;
