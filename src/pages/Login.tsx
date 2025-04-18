import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    navigate('/dashboard');
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-300">
            שם משתמש
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiMail className="text-slate-500" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input pr-10 w-full text-right"
              placeholder="הזן שם משתמש"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            סיסמה
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiLock className="text-slate-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10 w-full text-right"
              placeholder="הזן סיסמה"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 border-slate-600 rounded bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
            />
            <label htmlFor="remember-me" className="mr-2 block text-sm text-slate-400">
              זכור אותי
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
              שכחת סיסמה?
            </a>
          </div>
        </div>
        
        <div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center h-10"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              "התחבר"
            )}
          </motion.button>
        </div>
      </form>
      
      <div className="mt-6">
        <p className="text-center text-sm text-slate-500">
          פרטי התחברות לדוגמה: שם משתמש "admin" עם כל סיסמה
        </p>
      </div>
    </div>
  );
};

export default Login;