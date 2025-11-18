import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
    const isEnrolled = course.isEnrolled; 

    return (
        <Link 
            to={`/courses/${course._id}`} 
            className="bg-white rounded-lg shadow-lg p-5 hover:shadow-xl transition duration-300 relative flex flex-col h-full"
        >
            {isEnrolled && (
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Enrolled
                </span>
            )}
            <h3 className="text-xl font-extrabold mb-3 text-slate-800">{course.title}</h3>
            <p className="mt-2 text-gray-600 text-sm line-clamp-3 flex-grow">
                {course.description || "No description available"}
            </p>
            <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">By {course.instructor || "Unknown"}</span>
                <span className="text-sm font-bold text-blue-600">
                    View Details →
                </span>
            </div>
        </Link>
    );
}

