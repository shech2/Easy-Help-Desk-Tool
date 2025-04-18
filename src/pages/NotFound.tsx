import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 100 
        }}
        className="text-9xl font-bold text-slate-700"
      >
        404
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-3xl font-bold text-white"
      >
        Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-slate-400 max-w-md"
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center"
        >
          <FiHome className="mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;