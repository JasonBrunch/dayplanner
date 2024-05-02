import React from 'react';



export default function ButtonMain({ onClick, text }) {
    return (
        <button
            className="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white pb-2 pt-2 px-4 border-2 border-white hover:border-transparent rounded-full"
            onClick={onClick}
        >
            {text}
        </button>
    );
}