import { motion } from 'framer-motion';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'info':
        return <FiInfo className="text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="text-emerald-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-orange-500" />;
      case 'error':
        return <FiXCircle className="text-red-500" />;
    }
  };
  
  return (
    <div className="space-y-4 h-full overflow-y-auto pr-2">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-start p-3 rounded-md hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(activity.type)}
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{activity.user}</p>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">{activity.action}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;