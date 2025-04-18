import { motion } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';

interface ServerStatusProps {
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  uptime: string;
  load: string;
}

const ServerStatus = ({ name, status, uptime, load }: ServerStatusProps) => {
  return (
    <motion.div 
      className="p-4 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <div className="mt-1 flex items-center">
            <StatusBadge status={status} />
          </div>
        </div>
        
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-slate-400">Uptime</p>
            <p className="text-sm font-medium text-white">{uptime}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-400">Load</p>
            <p className="text-sm font-medium text-white">{load}</p>
          </div>
        </div>
      </div>
      
      {/* Load bar */}
      <div className="mt-2 bg-slate-800 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            parseInt(load) > 80 
              ? 'bg-red-500' 
              : parseInt(load) > 60 
                ? 'bg-orange-500' 
                : 'bg-emerald-500'
          }`}
          style={{ width: load }}
        />
      </div>
    </motion.div>
  );
};

export default ServerStatus;