import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import useCoursesHook from "../hooks/useCourses";
import useAuthHook from "../hooks/useAuth";


const getYouTubeEmbedUrl = (url) => {
  if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
    return null;
  }
  const match = url.match(
    /(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|&v=)([^#&?]*)/
  );
  const videoId = match && match[1] ? match[1] : null;
  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    : null;
};

// COMPONENT: LessonViewer 
const LessonViewer = ({ lesson, courseId, progress, setProgress }) => {
  const [isMarking, setIsMarking] = useState(false);

  if (!lesson)
    return (
      <div className="flex items-center justify-center h-96 bg-white/80 border-2 border-dashed border-indigo-200 rounded-xl p-8 shadow-sm">
        <p className="text-xl text-indigo-400 font-medium">
          👈 Select a lesson from the Course Outline to begin.
        </p>
      </div>
    );

  const embedUrl = getYouTubeEmbedUrl(lesson.vidUrl);
  const completedLessons = progress?.completedLessons || [];
  const isCompleted = completedLessons.includes(lesson._id);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      await axiosInstance.post("/progress/complete", {
        courseId,
        lessonId: lesson._id,
      });

      setProgress?.((prev) => {
        const updatedLessons = new Set(prev?.completedLessons || []);
        updatedLessons.add(lesson._id);
        return {
          ...prev,
          completedLessons: Array.from(updatedLessons),
        };
      });
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4 bg-gray-50/50">
        <h3 className="text-2xl font-extrabold text-slate-800">
          {lesson.title}
        </h3>

        <button
          onClick={handleMarkComplete}
          disabled={isCompleted || isMarking}
          className={`px-6 py-2 rounded-lg font-bold transition shadow-md flex items-center gap-2 ${
            isCompleted
              ? "bg-green-600 text-white cursor-default"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isMarking
            ? "Saving..."
            : isCompleted
            ? "Completed 🎉"
            : "Mark Complete"}
        </button>
      </div>
      <div className="p-8">
        {lesson.content && (
          <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-100">
            <h4 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
              <span>📝</span> Lesson Notes
            </h4>
            <div className="bg-indigo-50/50 p-6 rounded-lg border border-indigo-100">
                <p className="whitespace-pre-wrap">{lesson.content}</p>
            </div>
          </div>
        )}
        {embedUrl ? (
          <div className="space-y-4">
             <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>🎥</span> Video Lesson
            </h4>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border-4 border-gray-800">
                <iframe
                className="w-full h-full"
                src={embedUrl}
                title={`Embedded video player for ${lesson.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
            </div>
          </div>
        ) : lesson.vidUrl ? (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-base text-yellow-800 font-medium">
              Video link is available but cannot be embedded.
            </p>
            <a
              href={lesson.vidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all mt-1 inline-block"
            >
              Watch Video Externally &rarr;
            </a>
          </div>
        ) : null}

        {!lesson.vidUrl && !lesson.content && (
          <p className="text-gray-400 italic text-center mt-4">
            No content available for this lesson yet.
          </p>
        )}
      </div>
    </div>
  );
};

// MAIN PAGE COMPONENT 
export default function CourseDetails() {
  const { id } = useParams();
  const { courses, enrollCourse } = useCoursesHook();
  const { isSignedIn, isAdmin, isAuthReady } = useAuthHook();
  
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [] });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentCheckComplete, setEnrollmentCheckComplete] = useState(false);
  
  // Quiz States
  const [quizStatus, setQuizStatus] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      const initialLoad = !course;
      if (initialLoad) setLoading(true);
      setEnrollmentCheckComplete(false);

      try {
        let courseData = courses.find((c) => c._id === id);
        if (!courseData) {
          const res = await axiosInstance.get(`/courses/${id}`);
          courseData = res.data;
        }
        setCourse(courseData);

        // Check Enrollment
        let enrolledStatus = isAdmin;
        if (isSignedIn) {
          const checkRes = await axiosInstance.get(
            `/users/check-enrollment/${id}`
          );
          enrolledStatus = checkRes.data.isEnrolled || isAdmin;
        }
        setIsEnrolled(enrolledStatus);
        setEnrollmentCheckComplete(true);

        if (enrolledStatus) {
          try {
            const progressRes = await axiosInstance.get(`/progress`);
            const currentProgress = progressRes.data.find(
              (p) => p.course._id === id
            );
            setProgress(currentProgress || { completedLessons: [] });

            // Fetch Quiz Info
            const quizRes = await axiosInstance.get(`/quizzes/course/${id}`);
            setQuizStatus(quizRes.data.quiz);
            setQuizResult(quizRes.data.result);

          } catch (progressError) {
            console.error("Failed to fetch progress/quiz records:", progressError);
            setProgress({ completedLessons: [] });
          }
        } else {
          setProgress({ completedLessons: [] });
        }

        // Set initial lesson
        if (!selectedLesson && courseData.lessons?.length > 0) {
          setSelectedLesson(courseData.lessons[0]);
        }

        if (initialLoad) setMessage("");
      } catch (err) {
        console.error("Failed to load course data:", err);
        setMessage("Error loading course details.");
        setEnrollmentCheckComplete(true);
      } finally {
        if (initialLoad) setLoading(false);
      }
    };

    if (isAuthReady && id) fetchCourseData();
  }, [id, courses, isSignedIn, isAuthReady, isAdmin]);

  const handleEnroll = async () => {
    if (!isSignedIn) {
      setMessage("Please log in to enroll in a course.");
      return;
    }
    if (isEnrolled) {
      setMessage("You are already enrolled.");
      return;
    }

    setMessage("Enrolling...");
    try {
      await enrollCourse(id);
      setIsEnrolled(true);
      setMessage("Successfully enrolled! You can start learning now.");
      setCourse((prev) => (prev ? { ...prev, isEnrolled: true } : prev));
      setProgress({ completedLessons: [] });

      const quizRes = await axiosInstance.get(`/quizzes/course/${id}`);
      setQuizStatus(quizRes.data.quiz);
      setQuizResult(quizRes.data.result);

    } catch (err) {
      console.error("Enrollment failed:", err);
      setMessage(err.response?.data?.message || "Failed to enroll.");
    }
  };

  const isCourseComplete = (course, progress) => {
    if (!course?.lessons?.length) return false;
    if (!progress?.completedLessons?.length) return false;
    return progress.completedLessons.length >= course.lessons.length;
  };

  const allLessonsComplete = isCourseComplete(course, progress);
  const quizAvailable = !!quizStatus;
  const quizPassed = quizResult?.passed;

  const isComponentReady = !loading && enrollmentCheckComplete;

  if (!isComponentReady)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">Loading course content...</p>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600 font-bold">Course not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2">
            {course.title}
            </h1>
            <p className="text-lg text-slate-600 flex items-center gap-2">
                <span>🎓</span> Instructor: <span className="font-semibold">{course.instructor}</span>
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5 order-2 lg:order-1">
            <LessonViewer
              lesson={selectedLesson}
              courseId={course._id}
              progress={progress}
              setProgress={setProgress}
            />
          </div>
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col gap-6">
            <div className="p-6 bg-white rounded-xl shadow-lg border border-white/50">
              <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">About this Course</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {course.description}
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg border border-white/50">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Your Progress</h3>
                
                {isEnrolled ? (
                    <>
                        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm font-medium flex items-center gap-2">
                            <span>✅</span> You are enrolled in this course.
                        </div>

              
                        {quizAvailable && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-indigo-900 mb-2">Final Assessment</h4>
                                
                                {allLessonsComplete && !quizResult ? (
                                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg text-center">
                                        <p className="text-indigo-800 font-medium mb-3">All lessons complete!</p>
                                        <Link
                                            to={`/courses/${course._id}/quiz`}
                                            className="inline-block w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
                                        >
                                            Take Final Quiz 📝
                                        </Link>
                                    </div>
                                ) : quizResult ? (
                                    <div className={`p-4 rounded-lg text-center border ${quizResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <p className={`font-bold ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                                            Quiz {quizResult.passed ? 'Passed! 🎉' : 'Failed'}
                                        </p>
                                        <p className="text-sm mb-3">Score: {quizResult.scorePercentage}%</p>
                                        <Link 
                                            to={`/courses/${course._id}/quiz`}
                                            className="text-sm font-semibold underline hover:text-indigo-600"
                                        >
                                            View Details / Retake
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic text-center p-2">
                                        Complete all lessons to unlock the quiz.
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={handleEnroll}
                        disabled={!isSignedIn || !isComponentReady}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
                    >
                        Enroll Now
                    </button>
                )}
                
                {message && !message.includes("successfully") && (
                    <p className="mt-3 text-sm text-red-600 text-center">{message}</p>
                )}
            </div>

            {isEnrolled && course.lessons && (
              <div className="bg-white rounded-xl shadow-lg border border-white/50 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-slate-800">Course Content</h3>
                    <p className="text-xs text-gray-500">{course.lessons.length} Lessons</p>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                    {course.lessons.map((lesson, index) => (
                        <li
                        key={lesson._id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`p-4 cursor-pointer transition hover:bg-indigo-50 flex justify-between items-center ${
                            selectedLesson?._id === lesson._id ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
                        }`}
                        >
                        <span className="text-sm font-medium text-gray-700 truncate w-3/4">
                            {index + 1}. {lesson.title}
                        </span>
                        {progress.completedLessons.includes(lesson._id) ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Done</span>
                        ) : (
                            <span className="text-xs text-gray-400">Pending</span>
                        )}
                        </li>
                    ))}
                    </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
