import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  change?: number;
  delay?: number;
}

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  change,
  delay = 0
}: DashboardCardProps) => {
  // Color variants
  const colorVariants = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  
  const isPositive = change && change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card hover:bg-slate-700/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded-md ${colorVariants[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <FiTrendingUp className="text-emerald-500 mr-1" />
              ) : (
                <FiTrendingDown className="text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                isPositive ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {isPositive ? '+' : ''}{change}% from last period
              </span>
            </div>
          )}
        </div>
        
        {/* Optional sparkline here */}
      </div>
    </motion.div>
  );
};

export default DashboardCard;