import React from "react";

function Header({ userName }) {
    return (
        <header className="w-full h-12 bg-gray-800 text-white flex justify-end items-center px-6">
            <h2>{userName}</h2>
        </header>
    );
}

export default Header;