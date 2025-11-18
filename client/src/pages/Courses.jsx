import { useEffect, useState } from "react";
import CourseCard from '../components/CourseCard.jsx'; 
import axiosInstance from "../services/axiosInstance";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
          setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  
  if (loading) return <p className="p-8 text-center text-gray-500">Loading available courses...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center"> 
      <div className="w-full max-w-7xl mx-auto p-8 rounded-2xl shadow-xl 
                      bg-gradient-to-br from-pink-100 to-purple-100"> 
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 border-b pb-3">Available Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? (
            courses.map(course => (
                <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No courses are available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
}
