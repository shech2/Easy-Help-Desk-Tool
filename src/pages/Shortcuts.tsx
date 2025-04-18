import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLink, FiPlus, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Shortcut {
  id: string;
  name: string;
  url: string;
  category: string;
  description?: string;
}

const Shortcuts = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShortcut, setNewShortcut] = useState<Omit<Shortcut, 'id'>>({
    name: '',
    url: '',
    category: 'general',
    description: ''
  });

  const handleAddShortcut = () => {
    if (!newShortcut.name || !newShortcut.url) {
      toast.error('נא למלא שם וכתובת');
      return;
    }

    // בדיקת תקינות ה-URL
    try {
      new URL(newShortcut.url);
    } catch {
      toast.error('כתובת URL לא תקינה');
      return;
    }

    const shortcut: Shortcut = {
      id: Date.now().toString(),
      ...newShortcut
    };

    setShortcuts(prev => [...prev, shortcut]);
    setNewShortcut({ name: '', url: '', category: 'general', description: '' });
    setShowAddForm(false);
    toast.success('הקיצור נוסף בהצלחה');
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק קיצור זה?')) {
      setShortcuts(prev => prev.filter(s => s.id !== id));
      toast.success('הקיצור נמחק בהצלחה');
    }
  };

  const categories = {
    general: 'כללי',
    network: 'רשת',
    system: 'מערכת',
    security: 'אבטחה',
    monitoring: 'ניטור'
  };

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">קיצורי דרך</h1>
        <p className="text-slate-400 mb-6">ניהול קישורים מהירים לכלים ומשאבים</p>
      </motion.div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="ml-2" />
            הוסף קיצור דרך
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/50 p-4 rounded-lg mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">הוספת קיצור דרך חדש</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">שם</label>
                <input
                  type="text"
                  value={newShortcut.name}
                  onChange={(e) => setNewShortcut(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="שם הקיצור"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">כתובת URL</label>
                <input
                  type="url"
                  value={newShortcut.url}
                  onChange={(e) => setNewShortcut(prev => ({ ...prev, url: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">קטגוריה</label>
                <select
                  value={newShortcut.category}
                  onChange={(e) => setNewShortcut(prev => ({ ...prev, category: e.target.value }))}
                  className="input w-full text-right"
                >
                  {Object.entries(categories).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">תיאור</label>
                <input
                  type="text"
                  value={newShortcut.description}
                  onChange={(e) => setNewShortcut(prev => ({ ...prev, description: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="תיאור קצר (אופציונלי)"
                />
              </div>
            </div>
            <div className="flex justify-start mt-4 gap-2">
              <button
                onClick={handleAddShortcut}
                className="btn-primary"
              >
                הוסף
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-ghost"
              >
                ביטול
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([category, label]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-700/50 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
              <div className="space-y-3">
                {groupedShortcuts[category]?.map(shortcut => (
                  <div
                    key={shortcut.id}
                    className="bg-slate-800 p-3 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{shortcut.name}</h4>
                      {shortcut.description && (
                        <p className="text-sm text-slate-400">{shortcut.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={shortcut.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-slate-700 text-blue-500"
                        title="פתח קישור"
                      >
                        <FiExternalLink />
                      </a>
                      <button
                        onClick={() => handleDelete(shortcut.id)}
                        className="p-2 rounded-full hover:bg-slate-700 text-red-500"
                        title="מחק"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
                {!groupedShortcuts[category]?.length && (
                  <div className="text-center py-4 text-slate-400">
                    <p>אין קיצורי דרך בקטגוריה זו</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;