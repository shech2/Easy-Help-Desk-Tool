import React from 'react';
import { motion } from 'framer-motion';

const SystemTools = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">System Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-base-200 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <p className="text-base-content/70 mb-4">View detailed system information and health status.</p>
          <button className="btn btn-primary">View Information</button>
        </div>
        
        <div className="bg-base-200 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Disk Management</h2>
          <p className="text-base-content/70 mb-4">Manage disk space and view usage statistics.</p>
          <button className="btn btn-primary">Manage Disks</button>
        </div>
        
        <div className="bg-base-200 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Process Monitor</h2>
          <p className="text-base-content/70 mb-4">Monitor and manage running system processes.</p>
          <button className="btn btn-primary">View Processes</button>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemTools;