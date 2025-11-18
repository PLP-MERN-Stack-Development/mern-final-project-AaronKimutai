import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../services/axiosInstance';
import useAuthHook from '../hooks/useAuth'; 

export default function ChatBot() {
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); 

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get('/chats');
      setChats(res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (error) {
        console.error("Failed to fetch chats:", error);
    }
  };

  const sendMessage = async () => {
    if (!input || loading) return;
    
    setLoading(true);
    const userMessage = input;
    
    const temporaryUserChat = { _id: Date.now(), userMessage: userMessage, botResponse: '...' };
    setChats(prev => [...prev, temporaryUserChat]);
    setInput('');
    
    try {
        const res = await axiosInstance.post('/chats', {
          userMessage: userMessage 
        });
        
        setChats(prev => prev.map(chat => 
            chat._id === temporaryUserChat._id ? res.data : chat
        ));

    } catch (error) {
      console.error("Error sending message:", error);
      // remove temporary chat if API call fails
      setChats(prev => prev.filter(chat => chat._id !== temporaryUserChat._id));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);
  
  useEffect(scrollToBottom, [chats]); 
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300 flex justify-center py-10"> 

      <div className="w-full max-w-4xl flex flex-col rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold p-6 text-slate-800 border-b border-gray-200">
            E-Learning Assistant Chat
        </h1>
      <div className="flex-grow overflow-y-auto space-y-4 p-6 h-[60vh] md:h-[70vh]">
        {chats.map((c, index) => (
          <div key={c._id || index}>
            <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-t-xl rounded-bl-xl max-w-xs md:max-w-md shadow-md">
                    <p className="font-semibold text-sm mb-1">You</p>
                    <p className="text-base break-words">{c.userMessage}</p>
                </div>
            </div>
            <div className="flex justify-start">
                <div className="bg-gray-200 text-slate-800 p-3 rounded-t-xl rounded-br-xl max-w-xs md:max-w-md shadow-md">
                    <p className="font-semibold text-sm text-purple-700">Assistant</p>
                    <p className="text-base break-words">{c.botResponse}</p>
                </div>
            </div>

          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>
      <div className="flex space-x-3 p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <input 
            type="text"
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your courses, quizzes, or enrollment..."
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />
        <button 
            onClick={sendMessage} 
            disabled={!input || loading}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
        >
            {loading && chats.slice(-1)[0]?.botResponse === '...' ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  </div>
  );
}
