import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import useAuthHook from "../hooks/useAuth";
import StatusWrapper from "../components/StatusWrapper"; 

export default function QuizPage() {
    const { id: courseId } = useParams(); 
    const navigate = useNavigate();
    const { isAuthReady, isSignedIn } = useAuthHook();

    const [quizData, setQuizData] = useState(null);
    const [result, setResult] = useState(null);
    const [fullQuizQuestions, setFullQuizQuestions] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({}); 
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showReview, setShowReview] = useState(false); 

    // Data Fetching
    useEffect(() => {
        if (!isAuthReady || !isSignedIn) {
            if (isAuthReady) navigate('/login'); 
            return;
        }

        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/quizzes/course/${courseId}`);
                setQuizData(res.data.quiz);
                
                if (res.data.quiz.fullQuestions) {
                    setFullQuizQuestions(res.data.quiz.fullQuestions);
                }
                
                if (res.data.result) {
                    setResult(res.data.result);
                    if (!res.data.quiz.fullQuestions) {
                        fetchFullQuizQuestions(res.data.quiz._id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch quiz:", err);
                if (err.response && err.response.status === 404) {
                } else {
                    setError(err.response?.data?.message || "Failed to load quiz.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        const fetchFullQuizQuestions = async (quizId) => {
            try {
                const res = await axiosInstance.get(`/quizzes/${quizId}/result`);
                setFullQuizQuestions(res.data.fullQuestions); 
            } catch (error) {
                console.error("Failed to fetch review data:", error);
            }
        };

        fetchQuiz();
    }, [courseId, isAuthReady, isSignedIn, navigate]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quizData) return;
        
        if (Object.keys(answers).length !== quizData.questions.length) {
            alert(`Please answer all ${quizData.questions.length} questions.`);
            return;
        }

        setSubmitting(true);
        setError(null);

        const submittedAnswers = Object.keys(answers).map(key => ({
            questionIndex: parseInt(key),
            selectedOptionIndex: answers[key],
        }));

        try {
            const res = await axiosInstance.post(`/quizzes/${quizData._id}/submit`, { submittedAnswers });
            setResult(res.data.result);
            setFullQuizQuestions(res.data.fullQuestions); 
            setShowReview(true); 
            
            if (res.data.passed) {
                try { await axiosInstance.post(`/quizzes/complete-course/${courseId}`); } catch (e) {}
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    const isNotFound = !loading && !quizData && !error; 
    const isError = !!error;

    //  Result View
    if (result && !loading) {
        const scoreColor = result.passed ? "text-green-600" : "text-red-600";
        const message = result.passed ? "Congratulations! You passed." : "You did not pass. Please review.";
        const canRetake = !result.passed; 
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex justify-center py-10 px-4">
                <div className="w-full max-w-4xl"> 
                    <div className="p-8 bg-white rounded-xl shadow-2xl">
                        <h2 className="text-3xl font-extrabold mb-4 border-b pb-2">Quiz Results</h2>
                        <div className={`p-4 rounded-lg font-bold text-lg mb-6 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                            {message}
                        </div>
                        <p className="text-2xl font-bold">Score: <span className={scoreColor}>{result.scorePercentage}%</span></p>
                        
                        <div className="mt-8 flex flex-wrap gap-4">
                            {canRetake && (
                                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                                    Retake Quiz
                                </button>
                            )}
                            {fullQuizQuestions && (
                                <button onClick={() => setShowReview(!showReview)} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                                    {showReview ? 'Hide Review' : 'Review Answers'}
                                </button>
                            )}
                            <button onClick={() => navigate(`/courses/${courseId}`)} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
                                Return to Course
                            </button>
                        </div>
                        
                        {showReview && fullQuizQuestions && (
                            <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Review</h3>
                                {fullQuizQuestions.map((q, qIndex) => {
                                    const sub = result.submittedAnswers.find(a => a.questionIndex === qIndex);
                                    const isCorrect = sub?.selectedOptionIndex === q.correctAnswerIndex;
                                    const statusClass = isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50';
                                    return (
                                        <div key={qIndex} className={`p-4 mb-4 rounded-lg border-2 ${statusClass}`}>
                                            <p className="font-bold mb-2">{qIndex + 1}. {q.questionText}</p>
                                            <p className="text-sm mt-1">Your Choice: {q.options[sub?.selectedOptionIndex] || 'None'}</p>
                                            {!isCorrect && <p className="text-sm mt-1 text-green-700 font-bold">Correct: {q.options[q.correctAnswerIndex]}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Form View
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex justify-center py-10 px-4">
            <div className="w-full max-w-4xl"> 
                <StatusWrapper isLoading={loading} isError={isError} isNotFound={isNotFound} message={error}>
                    <div className="p-8 bg-white rounded-xl shadow-2xl">
                        <h1 className="text-3xl font-extrabold mb-6 border-b pb-2 text-slate-800">{quizData?.title}</h1>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {quizData?.questions?.map((q, index) => (
                                <div key={index} className="p-5 border border-gray-200 rounded-lg shadow-sm">
                                    <p className="font-semibold text-lg mb-4 text-slate-800">
                                        {index + 1}. {q.questionText}
                                    </p>
                                    <div className="space-y-3">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`q-${index}`}
                                                    checked={answers[index] === oIndex}
                                                    onChange={() => handleOptionSelect(index, oIndex)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    disabled={submitting}
                                                />
                                                <label 
                                                    className="ml-3 cursor-pointer text-gray-700"
                                                    onClick={() => handleOptionSelect(index, oIndex)}
                                                >
                                                    {opt}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={submitting || Object.keys(answers).length !== (quizData?.questions?.length || 0)}
                                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        </form>
                    </div>
                </StatusWrapper>
            </div>
        </div>
    );
}
