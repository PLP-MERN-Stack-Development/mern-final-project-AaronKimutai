import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="mb-4 md:mb-0">
          <p>&copy; {currentYear} E-Learn Platform. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;