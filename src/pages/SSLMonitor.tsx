import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiSearch, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { checkSSLCertificate, getExpiryStatus } from '../services/sslMonitor';
import { toast } from 'react-toastify';

interface CertificateInfo {
  domain: string;
  validFrom: Date;
  validTo: Date;
  issuer: string;
  grade: string;
  protocols: string[];
}

const SSLMonitor = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    try {
      const result = await checkSSLCertificate(domain);
      setCertInfo({
        domain: result.domain,
        validFrom: new Date(result.validFrom),
        validTo: new Date(result.validTo),
        issuer: result.issuer,
        grade: result.grade,
        protocols: result.protocols
      });
      toast.success('בדיקת SSL הושלמה בהצלחה');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-500';
      case 'A': return 'text-green-400';
      case 'B': return 'text-yellow-500';
      case 'C': return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">בדיקת SSL</h1>
        <p className="text-slate-400 mb-6">בדיקת תעודות SSL ואבטחת אתרים</p>
      </motion.div>

      <div className="card">
        <form onSubmit={handleCheck} className="flex mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiGlobe className="text-slate-400" />
            </div>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="הזן דומיין (example.com)"
              className="input pr-10 w-full text-right"
              dir="rtl"
            />
          </div>

          <div className="flex gap-2 mr-2">
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading || !domain}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin ml-2" />
                  בודק...
                </>
              ) : (
                <>
                  <FiSearch className="ml-2" />
                  בדוק
                </>
              )}
            </button>
          </div>
        </form>

        {certInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">דירוג אבטחה</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(certInfo.grade)}`}>
                    {certInfo.grade}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  {certInfo.protocols.join(', ')}
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">תוקף</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    getExpiryStatus(certInfo.validTo).status === 'valid'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {getExpiryStatus(certInfo.validTo).message}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  עד {certInfo.validTo.toLocaleDateString('he-IL')}
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">מנפיק</h3>
                </div>
                <p className="text-sm text-slate-300">{certInfo.issuer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SSLMonitor;