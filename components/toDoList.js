import React, { useState } from "react";

function ToDoList({
  listId,
  listName,
  listData,
  handleItemClick,
  handleAddTask,
  handleRemoveTask,
  handleRemoveCategory,
}) {
  const [taskName, setTaskName] = useState(""); // State for the new task name

  const listItems = listData.map((item) => (
    <div key={item.id} className="flex items-center justify-between space-x-2">
      <div
        onClick={() => handleItemClick(item.id)}  // Click handler for toggling completion
        className={`cursor-pointer ${item.completed ? "line-through" : ""}`}
      >
        {item.name}
      </div>
      <button
  onClick={() => {
     console.log(`Remove task clicked. List ID: ${listId}, Task ID: ${item.id}`); // Use the correct variable name
    handleRemoveTask(listId, item.id); // Pass the correct listId and taskId
   
  }}  // Handler to remove task
  className="text-red-500 hover:text-red-700"
>
  Remove
</button>
    </div>
  ));

  return (
    <div className="w-80 min-h-80 relative flex flex-col rounded px-6 py-3 bg-gray-200 h-full shadow-lg">
      <div className="relative">
        <h1 className="text-center heading1 pb-2 mt-4">{listName}</h1>
        <button
          className="absolute top-0 right-0 text-red-300 hover:text-red-700"
          onClick={() => handleRemoveCategory(listId)}  // Pass listId
        >
          X
        </button>
      </div>

      <div className="flex flex-col">{listItems}</div>

      <div className="flex items-center mt-auto">
        <input
          type="text"
          placeholder="Enter new task"
          value={taskName} // Bind to the state
          onChange={(e) => {
            setTaskName(e.target.value);
        
            } }
            className="appearance-none bg-transparent border-b-2 border-gray-400 w-full py-2 text-gray-700" // Border only at the bottom
        />
        <button
          className="ml-4 bg-transparent border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100"
          onClick={() => handleAddTask(listId, taskName)}  // Pass listId and taskName
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ToDoList;