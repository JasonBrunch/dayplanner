import React, { useState } from "react";

// Define the ToDoListController component
function ToDoListController() {
  // Initialize dummy data for the To-Do List
  const [toDoList, setToDoList] = useState([
    { id: 1, task: "Buy groceries", completed: false },
    { id: 2, task: "Walk the dog", completed: true },
    { id: 3, task: "Finish the project", completed: false },
  ]);

  // Function to toggle task completion status
  const toggleCompletion = (id) => {
    setToDoList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Function to remove a task from the list
  const removeTask = (id) => {
    setToDoList((prevList) => prevList.filter((item) => item.id !== id));
  };

  // Function to add a new task to the list (for future use)
  const addTask = (task) => {
    const newId = toDoList.length > 0 ? toDoList[toDoList.length - 1].id + 1 : 1;
    setToDoList([...toDoList, { id: newId, task, completed: false }]);
  };

  return (
    <div>
      <h1 className="heading1">To Do List</h1>

      {/* Display the To-Do List */}
      <ul className="list-disc ml-6">
        {toDoList.map((item) => (
          <li key={item.id} className="flex justify-between items-center">
            {/* Display task and completion status */}
            <span
              onClick={() => toggleCompletion(item.id)}
              className={`cursor-pointer ${
                item.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {item.task}
            </span>

            {/* Remove task button */}
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeTask(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Example of adding a task (for future use) */}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => addTask("New Task")}
      >
        Add Task
      </button>
    </div>
  );
}

export default ToDoListController;