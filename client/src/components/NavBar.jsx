import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react'; 
import useAuthHook from '../hooks/useAuth';

export default function NavBar() {
    const { isSignedIn, isAdmin } = useAuthHook(); 

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition">
                    E-Learn
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-sky-600 transition">Home</Link>
                    <Link to="/about" className="text-gray-600 hover:text-sky-600 transition">About</Link>
                    <Link to="/courses" className="text-gray-600 hover:text-sky-600 transition">Courses</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-sky-600 transition">Contact</Link>
                    <Link to="/chatbot" className="text-gray-600 hover:text-sky-600 transition">Chatbot</Link>
                    {isSignedIn ? (
                        <>
                        <Link to="/dashboard" className="text-gray-600 hover:text-sky-600 transition">Dashboard</Link>
                            {isAdmin && (
                                <Link to="/admin" className="text-red-600 hover:text-red-800 font-medium transition">Admin</Link>
                            )}
                            <UserButton 
                                afterSignOutUrl="/" 
                            />
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Login</Link>
                            <Link to="/register" className="text-sm text-gray-600 hover:text-blue-600 transition">Register</Link>
                   </>
                    )}
                </div>
          </nav>
        </header>
    );
}
