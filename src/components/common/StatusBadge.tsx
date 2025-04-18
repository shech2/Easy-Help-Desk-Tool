interface StatusBadgeProps {
  status: 'online' | 'offline' | 'maintenance' | 'warning';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    online: {
      color: 'bg-emerald-500',
      text: 'Online',
    },
    offline: {
      color: 'bg-red-500',
      text: 'Offline',
    },
    maintenance: {
      color: 'bg-blue-500',
      text: 'Maintenance',
    },
    warning: {
      color: 'bg-orange-500',
      text: 'Warning',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="ml-2 text-xs text-slate-300">{config.text}</span>
    </div>
  );
};

export default StatusBadge;