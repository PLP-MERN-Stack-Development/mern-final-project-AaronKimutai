import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

// YouTube Embed URL ---
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

const LessonViewer = ({ lesson, courseId, progress, setProgress }) => {
  const [isMarking, setIsMarking] = useState(false);

  // Handle case where lesson isn't selected yet
  if (!lesson)
    return (
      <div className="flex items-center justify-center h-96 bg-white/80 border-2 border-dashed border-indigo-200 rounded-xl p-8 shadow-sm">
        <p className="text-xl text-indigo-400 font-medium">
          👈 Select a lesson from the Course Outline to begin.
        </p>
      </div>
    );

  const embedUrl = getYouTubeEmbedUrl(lesson.vidUrl);
  
  const isProgressLoaded = progress && progress.completedLessons;
  const isCompleted = isProgressLoaded && progress.completedLessons.includes(lesson._id);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      await axiosInstance.post("/progress/complete", {
        courseId,
        lessonId: lesson._id,
      });

      if (setProgress) {
        setProgress((prev) => {
          const updatedLessons = new Set(prev?.completedLessons || []);
          updatedLessons.add(lesson._id);
          return {
            ...prev,
            completedLessons: Array.from(updatedLessons),
          };
        });
      }
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
          disabled={!isProgressLoaded || isCompleted || isMarking}
          className={`px-6 py-2 rounded-lg font-bold transition shadow-md flex items-center gap-2 ${
            !isProgressLoaded 
                ? "bg-gray-300 text-gray-500 cursor-wait" // Loading state
                : isCompleted
                ? "bg-green-600 text-white cursor-default" // Completed state
                : "bg-indigo-600 text-white hover:bg-indigo-700" // Active state
          }`}
        >
          {!isProgressLoaded 
            ? "Loading..." 
            : isMarking
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

export default LessonViewer;
