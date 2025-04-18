import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiX, FiUsers, FiMessageSquare, FiCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  sender: string;
  receiver?: string;
  content: string;
  timestamp: Date;
  isPrivate?: boolean;
}

interface User {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  role: string;
  avatar?: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showUserList, setShowUserList] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuthStore();

  // סימולציה של קבלת משתמשים מהמערכת
  useEffect(() => {
    const mockUsers: User[] = [
      { 
        id: '1', 
        username: 'מנהל מערכת', 
        status: 'online', 
        role: 'admin',
        lastSeen: new Date() 
      },
      { 
        id: '2', 
        username: 'תמיכה טכנית', 
        status: 'online', 
        role: 'support',
        lastSeen: new Date() 
      },
      { 
        id: '3', 
        username: 'ישראל ישראלי', 
        status: 'away', 
        role: 'user',
        lastSeen: new Date(Date.now() - 5 * 60000) 
      },
      { 
        id: '4', 
        username: 'משה כהן', 
        status: 'offline', 
        role: 'user',
        lastSeen: new Date(Date.now() - 30 * 60000) 
      },
    ];
    setUsers(mockUsers);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'אנונימי',
      receiver: selectedUser?.username,
      content: newMessage,
      timestamp: new Date(),
      isPrivate: !!selectedUser
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'מחובר';
      case 'away': return 'לא זמין';
      case 'offline': return 'מנותק';
      default: return 'לא ידוע';
    }
  };

  const getLastSeen = (user: User) => {
    if (user.status === 'online') return 'מחובר כעת';
    if (!user.lastSeen) return 'לא ידוע';
    
    const minutes = Math.floor((Date.now() - user.lastSeen.getTime()) / 60000);
    if (minutes < 1) return 'לפני פחות מדקה';
    if (minutes < 60) return `לפני ${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    return user.lastSeen.toLocaleDateString('he-IL');
  };

  const filteredMessages = messages.filter(message => 
    !message.isPrivate || 
    message.sender === currentUser?.username || 
    message.receiver === currentUser?.username
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 w-96 bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50"
    >
      <div className="p-4 bg-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">
            {selectedUser ? `שיחה עם ${selectedUser.username}` : 'צ\'אט קבוצתי'}
          </h3>
          {selectedUser && (
            <button 
              onClick={() => setSelectedUser(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              (חזרה לצ'אט הקבוצתי)
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowUserList(!showUserList)}
            className="text-slate-400 hover:text-white"
            title="הצג משתמשים מחוברים"
          >
            <FiUsers />
          </button>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white"
          >
            <FiX />
          </button>
        </div>
      </div>

      <div className="flex h-96">
        {showUserList && (
          <div className="w-1/3 border-l border-slate-700 overflow-y-auto">
            <div className="p-2 bg-slate-700 text-sm font-medium text-white">
              משתמשים ({users.filter(u => u.status === 'online').length} מחוברים)
            </div>
            <div className="p-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setShowUserList(false);
                  }}
                  className={`w-full text-right p-2 rounded flex items-center gap-2 hover:bg-slate-700 ${
                    selectedUser?.id === u.id ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${getStatusColor(u.status)}`}>
                        <FiCircle className="w-2 h-2" />
                      </span>
                      <span className="text-sm text-white">{u.username}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {getLastSeen(u)}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-300">
                    {u.role === 'admin' ? 'מנהל' : 
                     u.role === 'support' ? 'תמיכה' : 'משתמש'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`flex-1 flex flex-col ${showUserList ? 'w-2/3' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === currentUser?.username ? 'items-start' : 'items-end'
                }`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === currentUser?.username
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{message.sender}</p>
                    {message.isPrivate && (
                      <span className="text-xs opacity-75">(הודעה פרטית)</span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-slate-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('he-IL')}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`הקלד הודעה... ${selectedUser ? `ל${selectedUser.username}` : ''}`}
                className="input flex-1 text-right"
                dir="rtl"
              />
              <button
                type="submit"
                className="btn-primary p-2"
                disabled={!newMessage.trim()}
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;