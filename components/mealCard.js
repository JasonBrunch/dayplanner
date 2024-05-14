import React, { useState, useEffect, useRef } from "react";

function MealCard({ meal, removeMeal }) {
  const { name, calories } = meal;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRemoveMeal = () => {
    removeMeal();
    setMenuOpen(false); // Close the menu after the action
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex w-full h-16 rounded-lg shadow-lg panel2 items-center p-3 justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
        <div className="flex flex-col">
          <div className="heading3">{name}</div>
          <div className="heading4">{calories} kcal</div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <img
          src="/kebab.svg"
          alt="Menu"
          className="w-6 h-6 cursor-pointer"
          onClick={toggleMenu}
        />
        {menuOpen && (
          <div className="absolute right-0 mt-2 panel3 shadow-lg rounded-md w-32 p-2 z-50">
            <button
              onClick={handleRemoveMeal}
              className="w-full text-left text-white p-2 hover:bg-gray-200 rounded-md"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealCard;