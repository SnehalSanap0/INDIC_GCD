import React from 'react';

const Sheet = ({ isOpen, onClose }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* 🔲 Overlay background */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 🧾 Sliding Sheet Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-white shadow-lg w-80 sm:w-96 z-50 p-6 
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* 🔘 Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl font-bold">
            &times;
          </button>
        </div>

        {/* 📄 Content */}
        <div className="mt-4">
          <p>Your profile details will go here.</p>
          {/* You can add more content like avatar, logout button, etc. */}
        </div>
      </div>
    </div>
  );
};

export default Sheet;