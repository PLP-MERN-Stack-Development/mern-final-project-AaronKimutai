import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "./AuthContext";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const { userData, isSignedIn, authLoading, setUserData, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateCoursesWithEnrollment = (allCourses, user) => {
    if (!user || !user.enrolledCourses) return allCourses.map(c => ({ ...c, isEnrolled: false }));

    const enrolledIds = user.enrolledCourses.map(c => c._id || c); 

    return allCourses.map(course => ({
      ...course,
      isEnrolled: enrolledIds.includes(course._id),
    }));
  };

  // Fetch all courses
  const fetchCourses = async (user) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/courses");
      // Mark enrollment status
      setCourses(updateCoursesWithEnrollment(res.data, user)); 
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) {
      fetchCourses(userData);
    }
  }, [userData, authLoading]);

  // enroll in a course
  const enrollCourse = async (courseId) => {
    if (!isSignedIn) throw new Error("User must be signed in to enroll.");

    try {
      const res = await axiosInstance.post(`/users/enroll/${courseId}`);
      
      const updatedUser = res.data;
      
      setUserData(updatedUser);
      refreshUser?.();

      // Update local courses state
      setCourses(prev =>
        prev.map(c =>
          c._id === courseId ? { ...c, isEnrolled: true } : c
        )
      );

      return res.data;
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  return (
    <CourseContext.Provider value={{ courses, loading, setCourses, enrollCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  return useContext(CourseContext);
}
