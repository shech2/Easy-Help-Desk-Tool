import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  level: 'basic' | 'advanced' | 'admin';
  dependencies?: string[];
}

const mockPermissions: Permission[] = [
  { id: '1', name: 'view_dashboard', description: 'View Dashboard', module: 'Dashboard', level: 'basic' },
  { id: '2', name: 'manage_users', description: 'Manage Users', module: 'Users', level: 'admin' },
  { id: '3', name: 'view_reports', description: 'View Reports', module: 'Reports', level: 'basic' },
  { id: '4', name: 'manage_settings', description: 'Manage Settings', module: 'Settings', level: 'advanced' },
  { id: '5', name: 'manage_roles', description: 'Manage Roles', module: 'Roles', level: 'admin' },
  { id: '6', name: 'view_logs', description: 'View System Logs', module: 'Logs', level: 'advanced' },
  { id: '7', name: 'manage_backups', description: 'Manage Backups', module: 'System', level: 'admin' },
  { id: '8', name: 'manage_security', description: 'Manage Security', module: 'Security', level: 'admin' },
  { id: '9', name: 'view_audit_logs', description: 'View Audit Logs', module: 'Security', level: 'advanced' },
  { id: '10', name: 'manage_api_keys', description: 'Manage API Keys', module: 'API', level: 'admin' },
  { id: '11', name: 'view_metrics', description: 'View System Metrics', module: 'Monitoring', level: 'basic' },
  { id: '12', name: 'manage_alerts', description: 'Manage System Alerts', module: 'Monitoring', level: 'advanced' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Administrator',
    description: 'Complete system access with all permissions',
    permissions: mockPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'system'
  },
  {
    id: '2',
    name: 'System Administrator',
    description: 'System management and configuration access',
    permissions: mockPermissions.filter(p => p.level !== 'admin' || p.module === 'System'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'Security Manager',
    description: 'Security and audit management access',
    permissions: mockPermissions.filter(p => p.module === 'Security' || p.name === 'view_logs'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'admin'
  },
  {
    id: '4',
    name: 'Support Agent',
    description: 'Customer support and basic system access',
    permissions: mockPermissions.filter(p => p.level === 'basic'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'admin'
  }
];

const AdminPermissions = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveRole = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      // Validate permissions
      const hasRequiredPermissions = selectedRole.permissions.some(p => p.level === 'admin');
      if (!hasRequiredPermissions && selectedRole.name.toLowerCase().includes('admin')) {
        toast.warning('Administrator roles should have at least one admin-level permission');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRoles(prev => prev.map(role => 
        role.id === selectedRole.id 
          ? { 
              ...selectedRole, 
              updatedAt: new Date() 
            }
          : role
      ));
      
      toast.success('Role updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRoles(prev => prev.filter(role => role.id !== selectedRole.id));
      setSelectedRole(null);
      setShowDeleteConfirm(false);
      
      toast.success('Role deleted successfully');
    } catch (error) {
      toast.error('Failed to delete role');
      console.error('Error deleting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = useCallback((permission: Permission) => {
    if (!selectedRole || !editMode) return;

    const hasPermission = selectedRole.permissions.some(p => p.id === permission.id);
    
    // Check dependencies
    if (!hasPermission && permission.dependencies) {
      const missingDeps = permission.dependencies.filter(
        depId => !selectedRole.permissions.some(p => p.id === depId)
      );
      
      if (missingDeps.length > 0) {
        toast.warning('Some required permissions are missing');
        return;
      }
    }
    
    setSelectedRole(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        permissions: hasPermission
          ? prev.permissions.filter(p => p.id !== permission.id)
          : [...prev.permissions, permission]
      };
    });
  }, [selectedRole, editMode]);

  const filteredPermissions = useMemo(() => 
    mockPermissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.module.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const groupedPermissions = useMemo(() => 
    filteredPermissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>),
    [filteredPermissions]
  );

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-500/10 text-red-500';
      case 'advanced': return 'bg-yellow-500/10 text-yellow-500';
      case 'basic': return 'bg-green-500/10 text-green-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Permissions Management</h1>
            <p className="text-slate-400 mt-1">Manage roles and permissions for system access</p>
          </div>
          <button className="btn-primary flex items-center">
            <FiUserPlus className="mr-2" />
            Create New Role
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiShield className="mr-2" />
                Roles
              </h2>
              
              <div className="space-y-2">
                {roles.map(role => (
                  <motion.button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role);
                      setEditMode(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedRole?.id === role.id
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'hover:bg-slate-700/50 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{role.name}</h3>
                      <span className="text-xs text-slate-400">
                        {role.permissions.length} permissions
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{role.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(role.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions Management */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {selectedRole.name}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {selectedRole.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>Created by: {selectedRole.createdBy}</span>
                      <span>•</span>
                      <span>Last updated: {new Date(selectedRole.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={handleSaveRole}
                          disabled={loading}
                          className="btn-primary flex items-center"
                        >
                          <FiCheck className="mr-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRole(roles.find(r => r.id === selectedRole.id) || null);
                            setEditMode(false);
                          }}
                          className="btn-ghost"
                        >
                          <FiX className="mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditMode(true)}
                          className="btn-primary flex items-center"
                        >
                          <FiEdit2 className="mr-2" />
                          Edit Role
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="btn-danger flex items-center"
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search permissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([module, permissions]) => (
                    <motion.div
                      key={module}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-lg font-medium text-white mb-3">{module}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map(permission => {
                          const hasPermission = selectedRole.permissions.some(
                            p => p.id === permission.id
                          );
                          
                          return (
                            <motion.div
                              key={permission.id}
                              onClick={() => handleTogglePermission(permission)}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                hasPermission
                                  ? 'bg-blue-500/10 border-blue-500/20'
                                  : 'border-slate-700 hover:border-slate-600'
                              } ${editMode ? 'cursor-pointer' : 'cursor-default'}`}
                              whileHover={editMode ? { scale: 1.02 } : {}}
                              whileTap={editMode ? { scale: 0.98 } : {}}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-white">
                                    {permission.description}
                                  </h4>
                                  <p className="text-sm text-slate-400">
                                    {permission.name}
                                  </p>
                                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getLevelBadgeColor(permission.level)}`}>
                                    {permission.level}
                                  </span>
                                </div>
                                {hasPermission && (
                                  <FiCheck className="text-blue-500" />
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <FiShield className="text-4xl text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white">
                    Select a role to manage permissions
                  </h3>
                  <p className="text-slate-400 mt-1">
                    Choose a role from the list to view and edit its permissions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <FiAlertCircle className="text-2xl" />
                <h3 className="text-lg font-semibold">Delete Role</h3>
              </div>
              
              <p className="text-slate-300 mb-4">
                Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRole}
                  disabled={loading}
                  className="btn-danger"
                >
                  {loading ? 'Deleting...' : 'Delete Role'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center py-4 text-slate-400 text-sm border-t border-slate-700">
        © 2025 Rafi Ben Hamo. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminPermissions;