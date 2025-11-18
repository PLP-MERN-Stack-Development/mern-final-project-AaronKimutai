import { Link } from 'react-router-dom';
import useAuthHook from '../hooks/useAuth';

export default function Home() {
    const { isSignedIn } = useAuthHook(); // Get signed-in status

    return (
        <main className="min-h-screen flex flex-col items-center justify-center 
                       px-6 py-16 lg:py-24 
                       bg-gradient-to-br from-indigo-100 to-blue-200"> 
            
            <div className="max-w-4xl text-center">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
                    Welcome to E-Learn
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                    Learn practical skills at your own pace. Browse courses, enroll, and track your progress.
                </p>

                
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/courses" 
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition"
                    >
                        {isSignedIn ? 'Continue Browsing Courses' : 'View Courses'} 
                    </Link>
                    
                    
                    {isSignedIn && (
                        <Link 
                            to="/dashboard" 
                            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg shadow-md hover:bg-green-700 transition"
                        >
                            Go to Dashboard →
                        </Link>
                    )}
                    
                    {!isSignedIn && (
                        <Link 
                            to="/register" 
                            className="inline-block px-8 py-3 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
                        >
                            Start Learning
                        </Link>
                    )}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-800 mt-16 mb-8 border-t pt-8">Key Benefits</h2>

              
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition border-t-4 border-sky-500">
                        <h3 className="text-xl font-bold text-sky-600 mb-2">Flexible Learning</h3>
                        <p className="mt-2 text-sm text-slate-600">Access courses anytime, anywhere, and learn at your own pace.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition border-t-4 border-purple-500">
                        <h3 className="text-xl font-bold text-purple-600 mb-2">Practical Projects</h3>
                        <p className="mt-2 text-sm text-slate-600">Work on real-world projects to build your portfolio and skills.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition border-t-4 border-green-500">
                        <h3 className="text-xl font-bold text-green-600 mb-2">Community Support</h3>
                        <p className="mt-2 text-sm text-slate-600">Join a community of learners and get help from peers and instructors.</p>
                    </div>
                </div>

            </div>
        </main>
    );
}

