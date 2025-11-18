import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">
          Get in Touch
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Have questions or want to connect? Here are the best ways to reach me.
        </p>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-100">
            <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
              <span className="text-2xl">✉️</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Email</h3>
              <p className="text-gray-600 text-sm">For all professional inquiries.</p>
              <a 
                href="mailto:aaronkimutai24@gmail.com" 
                className="text-indigo-600 font-semibold hover:underline break-all"
              >
                aaronkimutai24@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50 border border-green-100">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
              <span className="text-2xl">📞</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Phone</h3>
              <p className="text-gray-600 text-sm">Mon-Fri from 8am to 5pm EAT.</p>
              <a 
                href="tel:+254791044989" 
                className="text-indigo-600 font-semibold hover:underline"
              >
                +254 791 044 989
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100">
            <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Office Location</h3>
              <p className="text-gray-600 text-sm">123 Innovation Drive, Tech Park</p>
              <p className="text-gray-600 text-sm">Nairobi, Kenya</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
