import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiShield, FiGlobe, FiLock } from 'react-icons/fi';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3, 'שם המשתמש חייב להכיל לפחות 3 תווים'),
  email: z.string().email('כתובת האימייל אינה תקינה'),
  role: z.enum(['admin', 'user', 'viewer']),
  language: z.string(),
  timezone: z.string(),
  notifications: z.boolean(),
  status: z.enum(['active', 'pending']),
  permissions: z.array(z.string())
});

type UserFormData = z.infer<typeof userSchema>;

interface AddUserModalProps {
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  loading?: boolean;
}

const defaultPermissions = {
  admin: ['all_access', 'manage_users', 'manage_settings', 'view_analytics'],
  user: ['view_dashboard', 'edit_profile', 'view_reports'],
  viewer: ['view_dashboard', 'view_reports']
};

const AddUserModal = ({ onClose, onSubmit, loading }: AddUserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'viewer',
    language: 'he',
    timezone: 'Asia/Jerusalem',
    notifications: true,
    status: 'pending',
    permissions: defaultPermissions.viewer
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = userSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => ({
          ...acc,
          [err.path[0]]: err.message
        }), {});
        setErrors(formattedErrors);
      }
    }
  };

  const handleRoleChange = (role: UserFormData['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role]
    }));
  };

  const translatePermission = (permission: string) => {
    const translations: Record<string, string> = {
      all_access: 'גישה מלאה',
      manage_users: 'ניהול משתמשים',
      manage_settings: 'ניהול הגדרות',
      view_analytics: 'צפייה בנתונים',
      view_dashboard: 'צפייה בלוח בקרה',
      edit_profile: 'עריכת פרופיל',
      view_reports: 'צפייה בדוחות'
    };
    return translations[permission] || permission;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-lg p-6 w-full max-w-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-white">הוספת משתמש חדש</h2>
            <p className="text-sm text-slate-400 mt-1">יצירת חשבון משתמש חדש עם הרשאות ספציפיות</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiUser className="inline ml-2" />
                שם משתמש
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="input w-full text-right"
                placeholder="ישראל ישראלי"
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiMail className="inline ml-2" />
                דואר אלקטרוני
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input w-full text-right"
                placeholder="israel@example.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiShield className="inline ml-2" />
                תפקיד
              </label>
              <select
                value={formData.role}
                onChange={e => handleRoleChange(e.target.value as UserFormData['role'])}
                className="input w-full text-right"
              >
                <option value="viewer">צופה (קריאה בלבד)</option>
                <option value="user">משתמש (סטנדרטי)</option>
                <option value="admin">מנהל מערכת</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiGlobe className="inline ml-2" />
                שפה
              </label>
              <select
                value={formData.language}
                onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="input w-full text-right"
              >
                <option value="he">עברית</option>
                <option value="en">אנגלית</option>
                <option value="ar">ערבית</option>
                <option value="ru">רוסית</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiGlobe className="inline ml-2" />
                אזור זמן
              </label>
              <select
                value={formData.timezone}
                onChange={e => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="input w-full text-right"
              >
                <option value="Asia/Jerusalem">ישראל</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">לונדון</option>
                <option value="America/New_York">ניו יורק</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FiLock className="inline ml-2" />
                סטטוס התחלתי
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as 'active' | 'pending'
                }))}
                className="input w-full text-right"
              >
                <option value="pending">ממתין להפעלה</option>
                <option value="active">פעיל</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 justify-end">
              <span className="text-sm text-slate-300">הפעל התראות במייל</span>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  notifications: e.target.checked 
                }))}
                className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-sm font-medium text-slate-300 mb-3">הרשאות</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="space-y-2">
                {formData.permissions.map(permission => (
                  <div key={permission} className="flex items-center text-sm text-slate-300 justify-end">
                    {translatePermission(permission)}
                    <FiShield className="ml-2 text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'יוצר משתמש...' : 'צור משתמש'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              ביטול
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddUserModal;