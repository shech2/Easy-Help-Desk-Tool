import { motion } from 'framer-motion';
import Logo from './common/Logo';

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200
        }}
      >
        <Logo size="large" />
      </motion.div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ 
          delay: 0.7, 
          duration: 1
        }}
        className="h-1 bg-blue-500 mt-8 rounded-full"
      />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 text-slate-400 text-sm"
      >
        מערכת ניהול Help Desk מתקדמת
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;