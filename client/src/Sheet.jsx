import React from 'react';

const Sheet = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full' // Keep the sheet off-screen to the right initially
      }`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div
        className={`bg-white w-80 sm:w-96 h-full p-6 transform transition-transform duration-300`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button onClick={onClose} className="text-gray-600">X</button>
        </div>
        <div className="mt-4">
          <p>Your profile details will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Sheet;