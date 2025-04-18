import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiUserPlus, FiSearch, FiEdit2, FiTrash2, FiLock, FiUnlock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AddUserModal from '../components/modals/AddUserModal';
import { useAuthStore } from '../store/authStore';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  lastLogin?: Date;
  language: string;
  timezone: string;
  notifications: boolean;
}

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (userData: Omit<User, 'id' | 'lastLogin'>) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        lastLogin: undefined
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success('המשתמש נוסף בהצלחה');
      setShowAddModal(false);
    } catch (error) {
      toast.error('הוספת המשתמש נכשלה');
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: User['status']) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success('סטטוס המשתמש עודכן בהצלחה');
    } catch (error) {
      toast.error('עדכון סטטוס המשתמש נכשל');
      console.error('Error updating user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) return;

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('המשתמש נמחק בהצלחה');
    } catch (error) {
      toast.error('מחיקת המשתמש נכשלה');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ניהול משתמשים</h1>
          <p className="text-slate-400 mt-1">ניהול משתמשי המערכת והרשאותיהם</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
          disabled={loading}
        >
          <FiUserPlus className="ml-2" />
          הוסף משתמש חדש
        </button>
      </div>

      <div className="card">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10 w-full text-right"
            />
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right border-b border-slate-700">
                  <th className="pb-3 text-slate-300 font-medium">משתמש</th>
                  <th className="pb-3 text-slate-300 font-medium">תפקיד</th>
                  <th className="pb-3 text-slate-300 font-medium">סטטוס</th>
                  <th className="pb-3 text-slate-300 font-medium">התחברות אחרונה</th>
                  <th className="pb-3 text-slate-300 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map(user => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-700"
                  >
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                        user.role === 'user' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {user.role === 'admin' ? 'מנהל' :
                         user.role === 'user' ? 'משתמש' : 'צופה'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                        user.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {user.status === 'active' ? 'פעיל' :
                         user.status === 'pending' ? 'ממתין' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 text-sm">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('he-IL')
                        : 'מעולם לא התחבר'}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(
                            user.id,
                            user.status === 'active' ? 'inactive' : 'active'
                          )}
                          className={`p-2 rounded-full hover:bg-slate-700 ${
                            user.status === 'active' 
                              ? 'text-green-500' 
                              : 'text-slate-400'
                          }`}
                          disabled={loading}
                          title={user.status === 'active' ? 'השבת משתמש' : 'הפעל משתמש'}
                        >
                          {user.status === 'active' ? <FiLock /> : <FiUnlock />}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-full hover:bg-slate-700 text-red-500"
                          disabled={loading || user.id === currentUser?.id}
                          title="מחק משתמש"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto text-4xl text-slate-500 mb-3" />
            <p className="text-slate-400">לא נמצאו משתמשים התואמים את החיפוש</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddUser}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManager;