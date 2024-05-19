import React, { useState, useEffect } from "react";
import ToDoList from "./toDoList"; // Import the ToDoList component
import { useUser } from "@/context/userContext";
import Modal from "./modal";
import ButtonMain from "./buttonMain";
import ButtonHighlight from "./buttonHighlight";
import { v4 as uuidv4 } from "uuid";


function ToDoListController() {
  const { user } = useUser();
  const [lists, setLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal open/close
  const [newListName, setNewListName] = useState("");  // State for the new list name

  const [newTaskNames, setNewTaskNames] = useState({});  // State for new task names, with each key being the list ID



  // Initialize lists when the component mounts or when user changes
  useEffect(() => {
    if (user) {
      setLists(user.toDoLists || []); // Initialize lists with user.toDoLists
    }
  }, [user]); // Re-run effect if user changes


  const handleOpenModal = () => {
    setIsModalOpen(true);  // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  const handleAddTask = async (listId, taskName) => {

    // Ensure the task name is valid
    if (!taskName || taskName.trim() === "") {
      console.error("Task name cannot be empty.");
      return;
    }

    // Generate a unique ID for the new task
    const newTaskId = uuidv4();  // Generates a unique UUID

    // Create a new task object
    const newTask = {
      id: newTaskId,
      name: taskName.trim(), // Trim any extra spaces
      dateAdded: new Date(),
      completed: false,
    };

    // Create an updated list structure with the new task
    const updatedLists = lists.map((list) => {
      if (list.listId === listId) {
        return {
          ...list,
          tasks: [...list.tasks, newTask], // Add the new task to the existing tasks
        };
      }
      return list;
    });

    // Update the state with the new list structure
    setLists(updatedLists);

    try {
      // Make a POST request to the backend with the updated to-do lists
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replaceToDoLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          newToDoLists: updatedLists,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLists(data.toDoLists); // Update the state with the backend data
        setNewTaskNames((prev) => ({ ...prev, [listId]: "" })); // Reset the task name for this list
      } else {
        console.error("Failed to add task:", response.statusText); // Log error message if the request fails
      }
    } catch (error) {
      console.error("Error while adding a new task:", error); // Log unexpected errors
    }
  };

  const handleCreateList = async () => {
    // Ensure newListName has valid content
    if (newListName.trim() === "") {
      console.error("List name cannot be empty.");  // Log an error if the list name is invalid
      return;  // Prevent further execution if list name is empty
    }

    // Generate a unique ID for the new list
    const newListId = lists.length ? Math.max(...lists.map((list) => list.listId)) + 1 : 0;

    // Create a new list object
    const newList = {
      listId: newListId,
      listName: newListName,
      tasks: [],  // Start with an empty task array
    };

    // Update the state with the new list
    const updatedLists = [...lists, newList];  // Add the new list to the existing lists

    try {
      // Send the updated lists to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replaceToDoLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,  // The ID of the current user
          newToDoLists: updatedLists,  // The updated to-do lists
        }),
      });

      if (response.ok) {  // If the POST request is successful
        const data = await response.json();  // Parse the response data
        setLists(data.toDoLists);  // Update the component's state with the new data
        setNewListName("");  // Clear the input field after success
        handleCloseModal();  // Close the modal after success
      } else {
        console.error("Failed to create a new list:", response.statusText);  // Log any error messages
      }
    } catch (error) {
      console.error("Error while creating a new list:", error);  // Log any unexpected errors
    }
  };

  const handleItemClick = async (listId, taskId) => {
    const updatedLists = lists.map((list) => {
      if (list.listId === listId) {
        const updatedTasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            const completed = !task.completed;
            return {
              ...task,
              completed,
              dateCompleted: completed ? new Date() : null,
            };
          }
          return task;
        });
        return { ...list, tasks: updatedTasks };
      }
      return list;
    });

    setLists(updatedLists);

    try {
      // Make a POST request to the backend with the updated to-do lists
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replaceToDoLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          newToDoLists: updatedLists,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLists(data.toDoLists); // Update the state with the backend data
      } else {
        console.error("Failed to update task:", response.statusText); // Log error message if the request fails
      }
    } catch (error) {
      console.error("Error while updating task:", error); // Log unexpected errors
    }
  };




  const handleRemoveTask = async (listId, taskId) => {
   
    // Create updated lists with the specified task removed
    const updatedLists = lists.map((list) => {
      if (list.listId === listId) {
        const updatedTasks = list.tasks.filter((task) => task.id !== taskId); // Filter out the task
        return { ...list, tasks: updatedTasks };
      }
      return list;
    });

    setLists(updatedLists); // Update the state with the new list structure

    try {
      // Send the updated lists to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replaceToDoLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          newToDoLists: updatedLists,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLists(data.toDoLists); // Update state with the backend response
      } else {
        console.error("Failed to remove task:", response.statusText); // Handle unsuccessful POST request
      }
    } catch (error) {
      console.error("Error while removing task:", error); // Handle errors
    }
  };


  const handleRemoveCategory = async (listId) => {
    // Filter out the list with the given listId
    const updatedLists = lists.filter((list) => list.listId !== listId);

    try {
      // Send the updated lists to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replaceToDoLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,  // The current user's ID
          newToDoLists: updatedLists,  // The new list structure without the removed list
        }),
      });

      if (response.ok) {  // If the POST request is successful
        const data = await response.json();  // Parse the response data
        setLists(data.toDoLists);  // Update the state with the new data
      } else {
        console.error("Failed to remove the list:", response.statusText);  // Log error messages
      }
    } catch (error) {
      console.error("Error while removing the list:", error);  // Log any unexpected errors
    }
  };



  return (
    <div className="p-1 md:p-8  h-full">
      {lists.length === 0 && (
        <div className="heading1 backgroundText">CREATE A LIST ...</div>
      )}
      <ButtonHighlight
        onClick={handleOpenModal}
        text="Add New List"
      />


      <div className="flex flex-col sm:flex-row flex-wrap pt-4  gap-4">
        {lists.map((list) => (
          <ToDoList
            key={list.listId}
            listId={list.listId} // Ensure `listId` is passed
            listName={list.listName}
            listData={list.tasks}
            handleItemClick={(taskId) => handleItemClick(list.listId, taskId)}
            handleAddTask={(listId, taskName) => handleAddTask(list.listId, taskName)} // Pass `listId` and `taskName`
            handleRemoveTask={(listId, taskId) => handleRemoveTask(list.listId, taskId)}
            handleRemoveCategory={() => handleRemoveCategory(list.listId)}
          />
        ))}
      </div>

      {/* Modal to create a new list */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-slate-50 font-semibold">Create New List</h2>
        <input
          type="text"
          value={newListName}  // Bind to state
          onChange={(e) => setNewListName(e.target.value)}  // Update state on change
          placeholder="Enter list name"
          className="border bg-transparent text-white border-gray-300 rounded py-2 px-4 w-full mt-4"
        />
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700"
          onClick={handleCreateList}  // Calls the create new list method
        >
          Create
        </button>
      </Modal>
    </div>
  );
}

export default ToDoListController;
