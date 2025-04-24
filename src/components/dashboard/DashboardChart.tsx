import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface DashboardChartProps {
  title: string;
  children: ReactNode;
  height?: number;
  delay?: number;
}

const DashboardChart = ({ 
  title, 
  children, 
  height = 300,
  delay = 0
}: DashboardChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card hover:bg-slate-700/50 transition-all duration-300"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardChart;