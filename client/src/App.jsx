import{BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import{useAuth as useClerkAuth} from "@clerk/clerk-react";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chatbot from "./components/ChatBot";
import Admin from "./pages/AdminPanel.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import useAuthHook from "./hooks/useAuth";


import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute";


function AdminProtectedRoute({ children }) {
  const {isLoaded, isSignedIn: clerkSignedIn}=useClerkAuth();
  const {authLoading, isAdmin}=useAuthHook();
  if(!isLoaded || authLoading) {
    return<div className="p-8 text-center text-xl text-gray-500">Authorizing...</div>;
 }

 if(!clerkSignedIn || !isAdmin){
   return<Navigate to="/"replace/>;
 }

  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <NavBar />
        <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/register/*" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
              <Route path="/courses/:id/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
             
              <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

