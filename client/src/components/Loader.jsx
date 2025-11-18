import React from "react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-indigo-600`}
      ></div>
      {text && <p className="mt-3 text-gray-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;
