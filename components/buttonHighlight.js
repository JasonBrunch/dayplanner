import React from 'react';



export default function ButtonHighlight({ onClick, text }) {
    return (
        <button
            className="text-sm primary  text-white font-semibold hover:text-white pb-2 pt-2 px-4  rounded-full"
            onClick={onClick}
        >
            {text}
        </button>
    );
}