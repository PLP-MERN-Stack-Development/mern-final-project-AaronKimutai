import { useEffect, useState } from "react";
import useAuthHook from "../hooks/useAuth";
import { Link } from "react-router-dom"; 
import StatusWrapper from '../components/StatusWrapper'; 
import axiosInstance from "../services/axiosInstance"; 


import userService from "../services/userService";
import { getErrorMessage } from "../utils/handleError";

// Calculate progress percentage
const calculateProgressPercentage = (course, progressRecords) => {
    const progress = progressRecords.find(p => p.course._id === course._id);
    const completedCount = progress ? progress.completedLessons.length : 0;
    const totalLessons = course.lessons?.length || 0; 
    
    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
};

export default function Dashboard() {
  const { userData } = useAuthHook();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [quizResults, setQuizResults] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
        if (!userData) {
            setLoading(false);
            return;
        }
        try {
            const coursesData = await userService.getEnrolledCourses(); 
            setEnrolledCourses(coursesData);
            
            
            const progressRes = await axiosInstance.get("/progress"); 
            setProgressRecords(progressRes.data);

            const quizResultsRes = await axiosInstance.get("/quizzes/quizresults"); 
            setQuizResults(quizResultsRes.data);
            
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(getErrorMessage(err)); 
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [userData]);

  const getCourseStatus = (course) => {
    const progress = progressRecords.find(p => p.course._id === course._id);
    const completedCount = progress ? progress.completedLessons.length : 0;
    const totalLessons = course.lessons?.length || 0; 
    
    // Check if quiz is passed
    const quizResult = getLatestQuizResult(course._id);
    const isQuizPassed = quizResult && quizResult.passed;

    if (totalLessons === 0) return { text: "No Lessons", color: "text-gray-500" };
    
    if (completedCount === totalLessons && isQuizPassed) {
        return { text: "Completed", color: "text-green-600" };
    }
    if (completedCount === totalLessons && !isQuizPassed) {
        return { text: "Final Quiz Pending", color: "text-purple-600" };
    }
    if (completedCount > 0) return { text: "In Progress", color: "text-yellow-600" };
    
    return { text: "Start Learning", color: "text-sky-600" };
  };

    const getLatestQuizResult = (courseId) => {
        const courseResults = quizResults
            .filter(r => r.course._id === courseId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return courseResults.length > 0 ? courseResults[0] : null;
    };

    const uniqueCourses = [];
    const seenIds = new Set();
    
    enrolledCourses.forEach(course => {
        if (!seenIds.has(course._id)) {
            uniqueCourses.push(course);
            seenIds.add(course._id);
        }
    });
    
    const totalCourses = uniqueCourses.length;
    const totalCompletedLessons = progressRecords.reduce((sum, record) => sum + record.completedLessons.length, 0);
    const completedCoursesCount = uniqueCourses.filter(course => getCourseStatus(course).text === "Completed").length;
    const coursesWithResults = uniqueCourses.filter(course => getLatestQuizResult(course._id));

    const dashboardIsError = !!error;
    const dashboardIsNotFound = !loading && !error && uniqueCourses.length === 0;


  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100"> 
        
        <StatusWrapper 
            isLoading={loading}
            isError={dashboardIsError}
            isNotFound={dashboardIsNotFound}
            message={error}
        >
            
            <h1 className="text-4xl font-extrabold mb-2 text-sky-800">
                Welcome, {userData?.name?.split(' ')[0] || 'User'}! 
            </h1>
            <p className="text-gray-600 mb-8">Ready to continue your learning journey?</p>

           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-sky-100">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Total Enrolled</p>
                    <p className="text-4xl font-bold text-sky-600 mt-2">{totalCourses}</p>
                    <p className="text-sm text-gray-500 mt-1">Courses</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Courses Completed</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{completedCoursesCount}</p>
                    <p className="text-sm text-gray-500 mt-1">Out of {totalCourses}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Total Lessons Done</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{totalCompletedLessons}</p>
                    <p className="text-sm text-gray-500 mt-1">Total lessons marked complete</p>
                </div>
            </div>
            {coursesWithResults.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b pb-2">Latest Quiz Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coursesWithResults.map(course => {
                            const result = getLatestQuizResult(course._id);
                            if (!result) return null; 

                            const statusClass = result.passed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50';
                            const statusText = result.passed ? 'PASSED' : 'FAILED';
                            const scoreColor = result.passed ? 'text-green-700' : 'text-red-700';

                            return (
                                <div key={`quiz-${course._id}`} className={`p-4 rounded-xl shadow-md ${statusClass}`}>
                                    <p className="font-bold text-lg text-slate-800">{course.title} Quiz</p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        Status: <span className={`font-extrabold ${scoreColor}`}>{statusText}</span>
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Score: {result.scorePercentage}%
                                    </p>
                                    <Link 
                                        to={`/courses/${course._id}/quiz`} 
                                        className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block"
                                    >
                                        Review / Retake
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
         
            <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b pb-2">Your Enrolled Courses</h2>
            
            <div className="space-y-4">
                {uniqueCourses.length === 0 ? ( 
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p className="text-gray-600">
                            You are not enrolled in any courses yet. <Link to="/courses" className="text-blue-600 hover:underline font-medium">Browse available courses</Link> to start learning!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {uniqueCourses.map(course => {
                            const status = getCourseStatus(course); 
                            const progressPercentage = calculateProgressPercentage(course, progressRecords);
                            
                            let statusPillClass = "";
                            if (status.text === "Completed") statusPillClass = "bg-green-100 text-green-700";
                            else if (status.text === "Final Quiz Pending") statusPillClass = "bg-purple-100 text-purple-700";
                            else if (status.text === "In Progress") statusPillClass = "bg-yellow-100 text-yellow-700";
                            else statusPillClass = "bg-blue-100 text-blue-700";

                            let progressBarColor = "bg-sky-500";
                            if (status.text === "Completed") progressBarColor = "bg-green-500";
                            if (status.text === "Final Quiz Pending") progressBarColor = "bg-purple-500";

                            return (
                                <Link 
                                    key={course._id} 
                                    to={`/courses/${course._id}`} 
                                    className="block bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xl font-bold text-slate-800">{course.title}</span>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusPillClass}`}>
                                            {status.text} {status.text === "Completed" ? '🎉' : ''}
                                        </span>
                                    </div>

                                   
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{progressPercentage}% Content Complete</span>
                                        <span className="font-medium text-sky-600 hover:text-sky-700">
                                            {status.text === "Completed" ? 'Review Course' : 'Continue Learning →'}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </StatusWrapper>
    </div>
  );
}
