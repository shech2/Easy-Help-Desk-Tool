import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiWifi, FiGlobe, FiSearch, FiActivity, FiAlertCircle, FiCheckCircle, FiStopCircle, FiRefreshCw, FiPlay } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { pingHost } from '../services/networkTools';

const NetworkTools = () => {
  const [selectedTab, setSelectedTab] = useState('ping');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isPinging, setIsPinging] = useState(false);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // קבלת הכתובת מהניווט אם קיימת
  useEffect(() => {
    if (location.state?.host) {
      setInput(location.state.host);
      // הפעלת הפינג אוטומטית
      const event = new Event('submit');
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(event);
      }
    }
  }, [location.state?.host]);

  const handleStopPing = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
      setIsPinging(false);
      setResults(prev => [...prev, '\nהפינג הופסק על ידי המשתמש.']);
    }
  }, []);

  const handleReset = () => {
    handleStopPing();
    setResults([]);
    setInput('');
  };

  const executePing = useCallback(async (host: string) => {
    try {
      const result = await pingHost(host);
      const pingTime = result.time === 'unknown' ? 'תם הזמן' : `${result.time}ms`;
      const status = result.alive ? 'תשובה מ-' : 'אין תשובה מ-';
      
      setResults(prev => [...prev, 
        `${status} ${host}: זמן=${pingTime} TTL=${result.ttl || 'N/A'}`
      ]);
    } catch (error) {
      if (error instanceof Error) {
        setResults(prev => [...prev, `שגיאה: ${error.message}`]);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && selectedTab !== 'ipconfig') return;
    
    setLoading(true);
    setResults([]);
    handleStopPing();
    
    try {
      switch (selectedTab) {
        case 'ping': {
          setResults([`מבצע פינג ל-${input}...`]);
          await executePing(input);
          setIsPinging(true);
          pingIntervalRef.current = setInterval(() => executePing(input), 1000);
          break;
        }
        case 'traceroute': {
          setResults([
            `מבצע מעקב נתיב ל-${input}...`,
            'פונקציית Traceroute תיושם בקרוב.',
          ]);
          break;
        }
        case 'dig': {
          setResults([
            `מבצע בדיקת DNS ל-${input}...`,
            'פונקציית DNS Lookup תיושם בקרוב.',
          ]);
          break;
        }
        case 'nmap': {
          setResults([
            `סורק פורטים ב-${input}...`,
            'פונקציית סריקת פורטים תיושם בקרוב.',
          ]);
          break;
        }
        case 'ipconfig': {
          setResults([
            'הגדרות רשת',
            '',
            'מתאם רשת Ethernet:',
            '   סיומת DNS ספציפית לחיבור  . : local',
            '   כתובת IPv4. . . . . . . . . . . : 192.168.1.100',
            '   מסיכת רשת משנה . . . . . . . . . . . : 255.255.255.0',
            '   שער ברירת מחדל . . . . . . . . . : 192.168.1.1',
          ]);
          break;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setResults([`שגיאה: ${error.message}`]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const tabs = [
    { id: 'ping', label: 'פינג', icon: <FiActivity /> },
    { id: 'traceroute', label: 'מעקב נתיב', icon: <FiServer /> },
    { id: 'dig', label: 'בדיקת DNS', icon: <FiGlobe /> },
    { id: 'nmap', label: 'סריקת פורטים', icon: <FiSearch /> },
    { id: 'ipconfig', label: 'הגדרות רשת', icon: <FiWifi /> },
  ];
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">כלי רשת</h1>
        <p className="text-slate-400 mb-6">כלי אבחון לפתרון בעיות רשת</p>
      </motion.div>
      
      <div className="card">
        <div className="flex overflow-x-auto mb-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                handleStopPing();
                setSelectedTab(tab.id);
                setResults([]);
                setInput('');
              }}
              className={`px-4 py-2 rounded-md flex items-center ml-2 ${
                selectedTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              } transition-colors`}
            >
              <span className="ml-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {selectedTab === 'ping' && <FiActivity className="text-slate-400" />}
              {selectedTab === 'traceroute' && <FiServer className="text-slate-400" />}
              {selectedTab === 'dig' && <FiGlobe className="text-slate-400" />}
              {selectedTab === 'nmap' && <FiSearch className="text-slate-400" />}
              {selectedTab === 'ipconfig' && <FiWifi className="text-slate-400" />}
            </div>
            
            <input
              type="text"
              className="input pr-10 w-full text-right"
              placeholder={
                selectedTab === 'ping' ? 'הזן כתובת IP או שם מארח (למשל: 8.8.8.8)' :
                selectedTab === 'traceroute' ? 'הזן כתובת IP או שם מארח למעקב' :
                selectedTab === 'dig' ? 'הזן דומיין לבדיקה' :
                selectedTab === 'nmap' ? 'הזן כתובת IP או שם מארח לסריקה' :
                'לחץ על הפעל להצגת הגדרות רשת'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={selectedTab === 'ipconfig' || loading}
            />
          </div>
          
          <div className="flex gap-2 mr-2">
            {selectedTab === 'ping' && isPinging ? (
              <button
                type="button"
                onClick={handleStopPing}
                className="btn-danger flex items-center"
                disabled={loading}
              >
                <FiStopCircle className="ml-2" />
                עצור
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary flex items-center"
                disabled={loading || (!input && selectedTab !== 'ipconfig')}
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
            )}
            
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost flex items-center"
              disabled={loading || (!results.length && !input)}
            >
              <FiRefreshCw className="ml-2" />
              נקה
            </button>
          </div>
        </form>
        
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
            ) : results.length > 0 ? (
              <pre className="text-slate-300 whitespace-pre-wrap text-right" dir="rtl">
                {results.join('\n')}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <FiAlertCircle className="text-2xl mb-2" />
                <p>אין תוצאות. הזן יעד והפעל פקודה.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTools;