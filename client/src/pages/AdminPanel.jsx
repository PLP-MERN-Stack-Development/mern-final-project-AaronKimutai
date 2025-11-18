import React, { useState } from "react";
import { Navigate } from "react-router-dom"; 
import axiosInstance from "../services/axiosInstance";
import useAuthHook from "../hooks/useAuth"; 

// Utility component for Course Form 
const CourseForm = ({ refreshCourses }) => {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', instructor: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Creating course...');
        try {
            await axiosInstance.post('/courses', formData);
            setMessage('Course created successfully!');
            setFormData({ title: '', description: '', category: '', instructor: '' });
            refreshCourses();
        } catch (error) {
            setMessage(`Failed to create course: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-4 border border-slate-200 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4 text-sky-700">📚 Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-sky-500 focus:border-sky-500" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-sky-500 focus:border-sky-500" rows="3" />
                <input type="text" name="category" placeholder="Category (e.g., Programming)" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded focus:ring-sky-500 focus:border-sky-500" />
                <input type="text" name="instructor" placeholder="Instructor Name" value={formData.instructor} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-sky-500 focus:border-sky-500" />
                <button type="submit" className="w-full bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition">Create Course</button>
            </form>
            {message && <p className={`mt-3 text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
};

// Utility component for Lesson Form 
const LessonForm = ({ courses }) => {
    const [formData, setFormData] = useState({ title: '', content: '', vidUrl: '', courseId: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Creating lesson...');
        if (!formData.courseId) {
            setMessage('Please select a course.');
            return;
        }
        try {
            await axiosInstance.post('/lessons', formData);
            setMessage('Lesson created and linked successfully!');
            setFormData({ title: '', content: '', vidUrl: '', courseId: formData.courseId }); 
        } catch (error) {
            setMessage(`Failed to create lesson: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-4 border border-slate-200 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4 text-green-700">🎬 Create New Lesson</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="courseId" value={formData.courseId} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500">
                    <option value="">Select Course to Link</option>
                    {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
                <input type="text" name="title" placeholder="Lesson Title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500" />
                <textarea name="content" placeholder="Text Content" value={formData.content} onChange={handleChange} className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500" rows="3" />
                <input type="url" name="vidUrl" placeholder="Video URL (Optional)" value={formData.vidUrl} onChange={handleChange} className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500" />
                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Create Lesson</button>
            </form>
            {message && <p className={`mt-3 text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
};


// Utility component for Quiz Form 
const QuizForm = ({ courses }) => {
    const [quizData, setQuizData] = useState({
        title: '',
        courseId: '',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
    });
    const [message, setMessage] = useState('');

    const handleQuizChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = quizData.questions.map((q, i) => {
            if (i === qIndex) {
                return { ...q, [field]: value };
            }
            return q;
        });
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = quizData.questions.map((q, i) => {
            if (i === qIndex) {
                const newOptions = q.options.map((option, j) => j === oIndex ? value : option);
                return { ...q, options: newOptions };
            }
            return q;
        });
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
            ]
        });
    };
    
    // Function to remove a question
    const removeQuestion = (qIndex) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== qIndex)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Creating quiz...');
        
        const finalQuestions = quizData.questions
            .filter(q => q.questionText && q.options.every(o => o)) 
            .map(q => ({
                ...q,
                correctAnswerIndex: Number(q.correctAnswerIndex) 
            }));

        const courseId = quizData.courseId;

        if (!courseId || finalQuestions.length === 0) {
            setMessage('Please select a course and add at least one complete question.');
            return;
        }

        try {
            const quizTitle = quizData.title || `${courses.find(c => c._id === courseId)?.title} Final Quiz`;


            await axiosInstance.post('/quizzes', {
                title: quizTitle,
                course: courseId, 
                questions: finalQuestions
            });
            setMessage('Quiz created successfully!');
            setQuizData({ title: '', courseId: '', questions: [{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }] });
        } catch (error) {
            setMessage(`Failed to create quiz: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-4 border border-slate-200 rounded-lg shadow-md bg-white col-span-2">
            <h2 className="text-xl font-bold mb-4 text-purple-600"> Create New Quiz</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <select name="courseId" value={quizData.courseId} onChange={handleQuizChange} required className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Course to Link Quiz</option>
                    {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
                <input type="text" name="title" placeholder="Quiz Title (Optional, defaults to Course Name)" value={quizData.title} onChange={handleQuizChange} className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500" />
                
                <h3 className="text-lg font-semibold border-b pb-2">Questions:</h3>
                {quizData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border border-purple-100 rounded-lg bg-purple-50 space-y-3">
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                placeholder={`Question ${qIndex + 1} Text`}
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                required
                                className="w-full p-2 border rounded font-semibold text-slate-700 focus:ring-purple-500 focus:border-purple-500"
                            />
                            {qIndex > 0 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeQuestion(qIndex)}
                                    className="ml-3 text-red-600 hover:text-red-800"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        <p className="text-sm font-medium">Options (Select Correct Answer):</p>
                        {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={`correctAnswerIndex-${qIndex}`}
                                    checked={q.correctAnswerIndex === oIndex}
                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', oIndex)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    required
                                    className="w-full p-2 border rounded text-sm focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        ))}
                    </div>
                ))}
                <button type="button" onClick={addQuestion} className="w-full bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 transition border border-purple-300">
                    + Add Another Question
                </button>

                <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Finalize and Create Quiz</button>
            </form>
            {message && <p className={`mt-3 text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
};


// Main Admin Panel Component
export default function AdminPanel() {
    const { isAdmin, authLoading, isAuthReady, isSignedIn } = useAuthHook();
    const [availableCourses, setAvailableCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const res = await axiosInstance.get('/courses');
            setAvailableCourses(res.data);
        } catch (error) {
            console.error('Failed to fetch courses for admin panel:', error);
        }
    };

    React.useEffect(() => {
        if (isAuthReady && isSignedIn) {
            fetchCourses();
        }
    }, [isAuthReady, isSignedIn]);
    
    if (authLoading || !isAuthReady) {
        return <div className="p-8 text-center text-xl text-gray-500">Authorizing admin access...</div>;
    }

    // Redirect/Deny access if user is signed in but NOT admin
    if (!isAdmin) {
        return <Navigate to="/" replace />; 
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-red-600">Admin Panel</h1>
            <p className="text-gray-700 mb-6">Use these forms to add new educational content.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <CourseForm refreshCourses={fetchCourses} />
                
                <LessonForm courses={availableCourses} />
            </div>
            <div className="mt-8">
                <QuizForm courses={availableCourses} />
            </div>

        </div>
    );
};
