import React, { useState } from "react";
import ButtonMain from "./buttonMain";

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
        onClick={() => handleRemoveTask(listId, item.id)}
        className="text-red-500 hover:text-red-700"
      >
        X
      </button>
    </div>
  ));

  return (
    <div className="w-full sm:min-w-[320px] sm:w-80 min-h-80 relative flex flex-col rounded px-4 py-3 panel h-full shadow-lg">
      <div className="relative">
        <h1 className="text-center panelText pb-2 mt-2 panelText">{listName}</h1>
        <button
          className="absolute top-0 right-0 hover:text-red-700"
          onClick={() => handleRemoveCategory(listId)}
        >
          <img src="/remove-circle.svg" alt="Delete list" />
        </button>
      </div>

      <div className="flex flex-col">{listItems}</div>

      <div className="flex items-center mt-auto">
        <input
          type="text"
          placeholder="Enter new task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="appearance-none bg-transparent border-b-2 border-white w-full py-2 text-white"
        />
        <div className="ml-2">
        <ButtonMain
          onClick={() => {
            handleAddTask(listId, taskName);
            setTaskName('');
          }}
          text="SAVE"
          
        /></div>
      </div>
    </div>
  );
}

export default ToDoList;