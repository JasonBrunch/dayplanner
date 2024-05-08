import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden'); // Prevent scrolling when the modal is open
    } else {
      document.body.classList.remove('overflow-hidden'); // Restore scrolling when the modal is closed
    }

    return () => {
      document.body.classList.remove('overflow-hidden'); // Cleanup on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when clicking the backdrop
    >
      <div
        className="panel rounded-lg p-6 relative max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        {children} {/* This is where your form or other content will go */}
       
      </div>
    </div>,
    document.body // Render the modal at the top level of the DOM
  );
};

export default Modal;