import React from 'react';



export default function ButtonMain({ onClick, text }) {
    return (
        <button
            className="text-sm panel hover:highlight text-white font-semibold hover:text-white pb-2 pt-2 px-4 border border-gray-50 hover:border-transparent rounded-full"
            onClick={onClick}
        >
            {text}
        </button>
    );
}