import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-slate-900/90 z-10"></div>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
          alt="Help desk support center"
        />
        <div className="absolute inset-0 flex flex-col justify-center z-20 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Easy HelpDesk TOOL
          </h1>
          <p className="text-xl text-slate-300 max-w-lg">
            The comprehensive management solution for enterprise help desk and system administration.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Logo size="large" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Advanced help desk management system
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
        © 2025 Rafi Ben Hamo. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;