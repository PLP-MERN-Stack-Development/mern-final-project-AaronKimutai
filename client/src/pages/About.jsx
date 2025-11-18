import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">About E-Learn</h1>
          <p className="text-indigo-100 text-lg">
            Empowering learners worldwide through accessible, high-quality education.
          </p>
        </div>
        <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Our Mission</h2>
            <p>
              Welcome to E-Learn, a premier destination for mastering practical skills in
              programming and technology. Our mission is simple: to make
              high-quality education accessible, engaging, and effective for
              everyone, everywhere. We believe in "Learning by Doing." Our courses are
              designed with hands-on projects and instant feedback mechanisms,
              including real-time chatbot assistance and comprehensive quizzes.
            </p>
          </section>
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">About the Founder</h2>
            <p>
              Founded by <strong>Aaron Kimutai</strong>, E-Learn started as a
              passion project to help peers learn Python and JavaScript. Today, it
              serves as a robust, full-stack platform for continuous learning and
              skill development.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                <h3 className="font-bold text-indigo-700 text-lg mb-2">Interactive Learning</h3>
                <p className="text-sm">
                  Engage with video lessons, follow detailed notes, and track your
                  progress instantly.
                </p>
              </div>
              <div className="p-4 border border-purple-100 rounded-lg bg-purple-50/50">
                <h3 className="font-bold text-purple-700 text-lg mb-2">Instant Feedback</h3>
                <p className="text-sm">
                  Test your knowledge with dynamic quizzes and get immediate
                  results and answer reviews.
                </p>
              </div>
            </div>
          </section>
          <section className="text-center mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Join Our Community</h2>
            <p className="mb-6">
              Start your learning journey today. Browse our courses or reach out
              if you have any questions.
            </p>
            <div className="flex justify-center gap-4">
                <Link 
                    to="/courses"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Browse Courses
                </Link>
                <Link 
                    to="/contact"
                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                    Contact Us
                </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
