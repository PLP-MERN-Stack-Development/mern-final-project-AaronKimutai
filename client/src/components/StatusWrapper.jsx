import React from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader'; 

export default function StatusWrapper({
  isLoading,
  isError,
  isNotFound,
  message,
  children
}) {
  // Show Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[400px] bg-white rounded-xl shadow-lg">
        <Loader size="lg" text="Loading data..." />
      </div>
    );
  }

  // Show Error State
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center p-12 min-h-[400px] bg-red-50 border border-red-300 rounded-xl shadow-lg">
        <p className="text-2xl font-bold text-red-700 mb-4">Error Loading Content 🛑</p>
        <p className="text-gray-700">{message || "An unexpected error occurred while fetching data."}</p>
      </div>
    );
  }
  
  // Show Not Found State
  if (isNotFound) {
     return (
      <div className="flex flex-col justify-center items-center p-12 min-h-[400px] bg-yellow-50 border border-yellow-300 rounded-xl shadow-lg">
        <p className="text-2xl font-bold text-yellow-800 mb-4">Content Not Found 🔎</p>
        <p className="text-gray-700">The requested resource could not be found or does not exist.</p>
        <Link to="/courses" className="mt-4 text-sky-600 hover:underline">
          Go back to Courses
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
