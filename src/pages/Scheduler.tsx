import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiPlus, FiEdit2, FiTrash2, FiPlay, FiPause } from 'react-icons/fi';

interface Task {
  id: string;
  name: string;
  schedule: string;
  status: 'active' | 'paused';
  lastRun: string;
  nextRun: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Database Backup',
    schedule: '0 0 * * *',
    status: 'active',
    lastRun: '2024-01-20 00:00',
    nextRun: '2024-01-21 00:00'
  },
  {
    id: '2',
    name: 'Log Rotation',
    schedule: '0 */6 * * *',
    status: 'active',
    lastRun: '2024-01-20 06:00',
    nextRun: '2024-01-20 12:00'
  },
  {
    id: '3',
    name: 'System Health Check',
    schedule: '*/30 * * * *',
    status: 'paused',
    lastRun: '2024-01-20 09:30',
    nextRun: '2024-01-20 10:00'
  }
];

const Scheduler = () => {
  const [tasks] = useState<Task[]>(mockTasks);

  return (
    <div className="content-panel">
      <div className="content-panel-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Task Scheduler</h1>
          <button className="btn-primary">
            <FiPlus className="mr-2" />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiCalendar className="text-2xl text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-blue-500">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiPlay className="text-2xl text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-500">Active</p>
                <p className="text-2xl font-bold text-white">
                  {tasks.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiPause className="text-2xl text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm text-yellow-500">Paused</p>
                <p className="text-2xl font-bold text-white">
                  {tasks.filter(t => t.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-panel-body">
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tasks.map((task) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiClock className="text-slate-400 mr-2" />
                      <span className="text-white">{task.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-300">{task.schedule}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {task.lastRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {task.nextRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-400 mr-3">
                      <FiEdit2 />
                    </button>
                    {task.status === 'active' ? (
                      <button className="text-yellow-500 hover:text-yellow-400 mr-3">
                        <FiPause />
                      </button>
                    ) : (
                      <button className="text-green-500 hover:text-green-400 mr-3">
                        <FiPlay />
                      </button>
                    )}
                    <button className="text-red-500 hover:text-red-400">
                      <FiTrash2 />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;