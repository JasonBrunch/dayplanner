import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";

function ToDoListController() {
  const { user } = useUser(); // Retrieve the user context
  const [toDoList, setToDoList] = useState([]);
  const [newTask, setNewTask] = useState(""); // State for the new task

  useEffect(() => {
    if (user && user.toDoList) {
      setToDoList(user.toDoList); // Initialize with user data
    }
  }, [user]);

  const toggleCompletion = (id) => {
    setToDoList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/removeToDoItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, toDoItemId: id }),
      });

      const result = await response.json();
      if (response.ok) {
        setToDoList(result.toDoList);
      } else {
        console.error("Error removing task:", result.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch("http://localhost:3001/addToDoItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          toDoItem: { task: newTask, completed: false },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setToDoList(result.toDoList);
        setNewTask(""); // Clear the input
      } else {
        console.error("Error adding task:", result.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="px-6 py-3 bg-gray-200 h-full">
      <h1 className="heading1 pt-4 pb-2">TO-DO LIST</h1>

      <ul className="list-disc">
  {toDoList.map((item) => (
    <li key={item._id} className="flex justify-between items-center"> {/* Use _id as the key */}
      <span
        onClick={() => toggleCompletion(item._id)}
        className={`cursor-pointer ${item.completed ? "line-through text-gray-500" : ""}`}
      >
        {item.task}
      </span>
      <button
        className="text-red-500 hover:text-red-700"
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
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="appearance-none bg-transparent border-b-2 w-full py-2 text-gray-700 leading-tight border-gray-400 focus:outline-none focus:border-blue-500"
        />

        <button
          className="ml-4 bg-transparent border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
          onClick={addTask}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ToDoListController;