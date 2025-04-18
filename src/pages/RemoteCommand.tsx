import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTerminal, FiPlay, FiRefreshCw, FiAlertCircle, FiActivity } from 'react-icons/fi';
import { executeCommand, AVAILABLE_COMMANDS } from '../services/remoteCommands';
import { toast } from 'react-toastify';

const RemoteCommand = () => {
  const [selectedCommand, setSelectedCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!selectedCommand) return;

    setLoading(true);
    setOutput(prev => [...prev, `\nמבצע פקודה: ${selectedCommand}...`]);

    try {
      const result = await executeCommand(selectedCommand);
      setOutput(prev => [...prev, result.output]);
      
      if (result.error) {
        toast.error('הפקודה הסתיימה עם שגיאות');
      } else {
        toast.success('הפקודה הושלמה בהצלחה');
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(prev => [...prev, `שגיאה: ${error.message}`]);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOutput([]);
    setSelectedCommand('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">פקודות מרחוק</h1>
        <p className="text-slate-400 mb-6">ביצוע פקודות מערכת מרחוק</p>
      </motion.div>

      <div className="card">
        <div className="flex mb-6">
          <div className="flex-1 relative">
            <select
              value={selectedCommand}
              onChange={(e) => setSelectedCommand(e.target.value)}
              className="input w-full text-right"
            >
              <option value="">בחר פקודה...</option>
              {Object.entries(AVAILABLE_COMMANDS).map(([command, description]) => (
                <option key={command} value={command}>
                  {description} ({command})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mr-2">
            <button
              onClick={handleExecute}
              className="btn-primary flex items-center"
              disabled={loading || !selectedCommand}
            >
              {loading ? (
                <>
                  <FiActivity className="animate-spin ml-2" />
                  מבצע...
                </>
              ) : (
                <>
                  <FiPlay className="ml-2" />
                  הפעל
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="btn-ghost flex items-center"
              disabled={loading || (!output.length && !selectedCommand)}
            >
              <FiRefreshCw className="ml-2" />
              נקה
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-md p-4 font-mono text-sm">
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-blue-500 text-xl"
                >
                  <FiActivity />
                </motion.div>
                <p className="mr-2 text-slate-400">מבצע פקודה...</p>
              </div>
            ) : output.length > 0 ? (
              <pre className="text-slate-300 whitespace-pre-wrap text-right" dir="rtl">
                {output.join('\n')}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <FiTerminal className="text-4xl mb-4" />
                <p>בחר פקודה והפעל אותה</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">פקודות נפוצות</h2>
          <div className="space-y-2">
            <p className="text-sm text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">gpupdate /force</code>
              <span className="mr-2">עדכון מדיניות קבוצתית</span>
            </p>
            <p className="text-sm text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">ipconfig /all</code>
              <span className="mr-2">הצגת הגדרות רשת מפורטות</span>
            </p>
            <p className="text-sm text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">systeminfo</code>
              <span className="mr-2">הצגת מידע מערכת מפורט</span>
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">טיפים</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• הפקודות מבוצעות בהרשאות מערכת</li>
            <li>• חלק מהפקודות עשויות לקחת זמן</li>
            <li>• ניתן לנקות את הפלט בכל עת</li>
            <li>• הפלט נשמר עד לניקוי ידני</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">אבטחה</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• רק פקודות מאושרות ניתנות להפעלה</li>
            <li>• כל הפקודות מתועדות</li>
            <li>• נדרשות הרשאות מתאימות</li>
            <li>• קיימת הגבלת קצב לפקודות</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RemoteCommand;