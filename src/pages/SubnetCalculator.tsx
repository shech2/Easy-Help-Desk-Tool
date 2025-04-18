import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalculator, FiCheck } from 'react-icons/fi';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  cidr: number;
  binary: string;
}

const SubnetCalculator = () => {
  const [ip, setIp] = useState('');
  const [cidr, setCidr] = useState('24');
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo | null>(null);

  const calculateSubnet = () => {
    // בדיקת תקינות כתובת IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      alert('כתובת IP לא תקינה');
      return;
    }

    const ipParts = ip.split('.').map(Number);
    const cidrNum = parseInt(cidr);

    // בדיקת תקינות ערכים
    if (ipParts.some(part => part < 0 || part > 255) || cidrNum < 0 || cidrNum > 32) {
      alert('ערכים לא תקינים');
      return;
    }

    // חישוב מסיכת רשת
    const subnetMaskBinary = '1'.repeat(cidrNum) + '0'.repeat(32 - cidrNum);
    const subnetMaskParts = [];
    for (let i = 0; i < 32; i += 8) {
      subnetMaskParts.push(parseInt(subnetMaskBinary.substr(i, 8), 2));
    }

    // חישוב כתובת רשת
    const networkParts = ipParts.map((part, i) => part & subnetMaskParts[i]);
    
    // חישוב כתובת broadcast
    const broadcastParts = networkParts.map((part, i) => 
      part | (~subnetMaskParts[i] & 255)
    );

    // חישוב כתובות מארח ראשונה ואחרונה
    const firstHostParts = [...networkParts];
    firstHostParts[3] += 1;

    const lastHostParts = [...broadcastParts];
    lastHostParts[3] -= 1;

    const info: SubnetInfo = {
      networkAddress: networkParts.join('.'),
      broadcastAddress: broadcastParts.join('.'),
      firstHost: firstHostParts.join('.'),
      lastHost: lastHostParts.join('.'),
      totalHosts: Math.pow(2, 32 - cidrNum) - 2,
      subnetMask: subnetMaskParts.join('.'),
      cidr: cidrNum,
      binary: ipParts.map(part => 
        part.toString(2).padStart(8, '0')
      ).join('.')
    };

    setSubnetInfo(info);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">מחשבון רשתות משנה</h1>
        <p className="text-slate-400 mb-6">חישוב טווחי כתובות ומסיכות רשת</p>
      </motion.div>

      <div className="card">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">כתובת IP</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.1.0"
              className="input w-full text-right"
            />
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium text-slate-300 mb-2">CIDR</label>
            <select
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              className="input w-full text-right"
            >
              {Array.from({ length: 33 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateSubnet}
              className="btn-primary flex items-center h-10"
            >
              <FiCalculator className="ml-2" />
              חשב
            </button>
          </div>
        </div>

        {subnetInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">פרטי רשת</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">כתובת רשת:</span>
                    <span className="text-white font-mono">{subnetInfo.networkAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">מסיכת רשת:</span>
                    <span className="text-white font-mono">{subnetInfo.subnetMask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">כתובת שידור:</span>
                    <span className="text-white font-mono">{subnetInfo.broadcastAddress}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">טווח כתובות</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">כתובת ראשונה:</span>
                    <span className="text-white font-mono">{subnetInfo.firstHost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">כתובת אחרונה:</span>
                    <span className="text-white font-mono">{subnetInfo.lastHost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">סה"כ מארחים:</span>
                    <span className="text-white font-mono">{subnetInfo.totalHosts}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">ייצוג בינארי</h3>
              <div className="font-mono text-sm overflow-x-auto">
                <p className="text-white">{subnetInfo.binary}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubnetCalculator;