import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPower, FiPlus, FiTrash2, FiEdit2, FiClock } from 'react-icons/fi';

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  lastWake?: Date;
}

const WakeOnLAN = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDevice, setNewDevice] = useState<Omit<Device, 'id'>>({
    name: '',
    mac: '',
    ip: ''
  });

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.mac || !newDevice.ip) {
      alert('נא למלא את כל השדות');
      return;
    }

    const device: Device = {
      id: Date.now().toString(),
      ...newDevice
    };

    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', mac: '', ip: '' });
    setShowAddForm(false);
  };

  const handleWake = async (device: Device) => {
    try {
      // כאן תהיה הלוגיקה של שליחת חבילת WoL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(d => 
        d.id === device.id 
          ? { ...d, lastWake: new Date() }
          : d
      ));

      alert(`מעיר את ${device.name}...`);
    } catch (error) {
      alert('שגיאה בהפעלת המחשב');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מכשיר זה?')) {
      setDevices(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">Wake-on-LAN</h1>
        <p className="text-slate-400 mb-6">הפעלת מחשבים מרחוק</p>
      </motion.div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="ml-2" />
            הוסף מכשיר
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/50 p-4 rounded-lg mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">הוספת מכשיר חדש</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">שם המכשיר</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="מחשב משרדי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">כתובת MAC</label>
                <input
                  type="text"
                  value={newDevice.mac}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, mac: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="00:11:22:33:44:55"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">כתובת IP</label>
                <input
                  type="text"
                  value={newDevice.ip}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, ip: e.target.value }))}
                  className="input w-full text-right"
                  placeholder="192.168.1.100"
                />
              </div>
            </div>
            <div className="flex justify-start mt-4 gap-2">
              <button
                onClick={handleAddDevice}
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

        <div className="space-y-4">
          {devices.map(device => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">{device.name}</h3>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span>MAC: {device.mac}</span>
                  <span>IP: {device.ip}</span>
                  {device.lastWake && (
                    <span className="flex items-center">
                      <FiClock className="ml-1" />
                      הופעל לאחרונה: {device.lastWake.toLocaleString('he-IL')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWake(device)}
                  className="btn-primary p-2"
                  title="הפעל"
                >
                  <FiPower />
                </button>
                <button
                  onClick={() => handleDelete(device.id)}
                  className="btn-danger p-2"
                  title="מחק"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}

          {devices.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FiPower className="mx-auto text-4xl mb-4" />
              <p>לא נמצאו מכשירים. הוסף מכשיר חדש כדי להתחיל.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WakeOnLAN;