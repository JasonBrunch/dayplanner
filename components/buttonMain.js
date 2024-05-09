import React from 'react';



export default function ButtonMain({ onClick, text }) {
    return (
        <button
            className="text-sm panel2  text-white font-semibold hover:text-white pb-2 pt-2 px-4  rounded-full"
            onClick={onClick}
        >
            {text}
        </button>
    );
}