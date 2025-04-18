import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { z } from 'zod';

// סכמת ולידציה למשתמש
const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer']),
  permissions: z.array(z.string()),
  lastLogin: z.date().optional(),
  failedLoginAttempts: z.number().default(0),
  passwordLastChanged: z.date().optional(),
  sessionTimeout: z.number().default(3600), // ברירת מחדל שעה אחת
  securityQuestions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
});

type User = z.infer<typeof UserSchema>;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetFailedAttempts: () => void;
}

// רשימה שחורה של סיסמאות חלשות
const WEAK_PASSWORDS = ['password', '123456', 'admin', '12345678', 'qwerty'];

// בדיקת חוזק סיסמה
const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      
      login: async (username, password) => {
        try {
          set({ loading: true });

          // בדיקת קלט
          if (!username || !password) {
            throw new Error('נא למלא את כל השדות');
          }

          // בדיקת אורך שם משתמש
          if (username.length < 3) {
            throw new Error('שם המשתמש חייב להכיל לפחות 3 תווים');
          }

          // בדיקת תווים מיוחדים בשם משתמש
          if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            throw new Error('שם המשתמש מכיל תווים לא חוקיים');
          }

          // בדיקת חוזק סיסמה
          if (!isStrongPassword(password)) {
            throw new Error('הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד');
          }

          // בדיקת סיסמאות חלשות
          if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
            throw new Error('הסיסמה חלשה מדי');
          }

          // בדיקת ניסיונות כניסה כושלים
          const { user } = get();
          if (user?.failedLoginAttempts >= 3) {
            // שליחת מייל אימות
            await sendVerificationEmail(user.email);
            throw new Error('החשבון ננעל עקב ניסיונות כניסה כושלים. נשלח קוד אימות למייל');
          }

          // סימולציה של בדיקת התחברות
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser = {
            id: '1',
            username,
            email: `${username}@example.com`,
            role: username === 'admin' ? 'admin' : 'user',
            permissions: username === 'admin' 
              ? ['read', 'write', 'delete', 'admin'] 
              : ['read', 'write'],
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            passwordLastChanged: new Date(),
            sessionTimeout: 3600
          };

          // ולידציה של נתוני המשתמש
          const validatedUser = UserSchema.parse(mockUser);
          
          const mockToken = 'mock-jwt-token';
          
          set({ 
            isAuthenticated: true, 
            user: validatedUser,
            token: mockToken,
            loading: false 
          });
          
          toast.success('התחברת בהצלחה');

          // הגדרת טיימר לניתוק אוטומטי
          setTimeout(() => {
            get().logout();
            toast.info('המערכת התנתקה עקב חוסר פעילות');
          }, validatedUser.sessionTimeout * 1000);

        } catch (error) {
          set({ loading: false });
          
          // עדכון מונה ניסיונות כושלים
          if (get().user) {
            set(state => ({
              user: state.user ? {
                ...state.user,
                failedLoginAttempts: (state.user.failedLoginAttempts || 0) + 1
              } : null
            }));
          }

          if (error instanceof z.ZodError) {
            toast.error('שגיאה בנתוני המשתמש');
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('ההתחברות נכשלה');
          }
          console.error('Login error:', error);
        }
      },
      
      logout: () => {
        // ניקוי נתונים רגישים
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        });
        
        // ניקוי מידע מהדפדפן
        localStorage.removeItem('auth-token');
        sessionStorage.clear();
        
        // מחיקת עוגיות
        document.cookie.split(";").forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        
        toast.info('התנתקת בהצלחה');
      },
      
      checkAuth: async () => {
        try {
          const { token, user } = get();
          if (!token) return;
          
          // בדיקת תוקף הטוקן
          if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              throw new Error('פג תוקף החיבור');
            }
          }

          // בדיקת תוקף סיסמה
          if (user?.passwordLastChanged) {
            const daysSinceChange = Math.floor(
              (Date.now() - user.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceChange > 90) {
              toast.warning('סיסמתך לא הוחלפה מעל 90 יום');
            }
          }

          if (user) {
            set({ isAuthenticated: true });
          }
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null });
          if (error instanceof Error) {
            toast.error(error.message);
          }
          console.error('Auth check error:', error);
        }
      },
      
      updateUser: async (userData) => {
        try {
          set({ loading: true });
          const { user } = get();
          
          if (!user) throw new Error('לא נמצא משתמש');

          // ולידציה של העדכון
          const updatedUser = UserSchema.parse({ ...user, ...userData });
          
          set({ 
            user: updatedUser,
            loading: false 
          });
          
          toast.success('הפרופיל עודכן בהצלחה');
        } catch (error) {
          set({ loading: false });
          if (error instanceof z.ZodError) {
            toast.error('שגיאה בנתוני המשתמש');
          } else {
            toast.error('עדכון הפרופיל נכשל');
          }
          console.error('Update user error:', error);
        }
      },

      resetFailedAttempts: () => {
        set(state => ({
          user: state.user ? {
            ...state.user,
            failedLoginAttempts: 0
          } : null
        }));
      }
    }),
    {
      name: 'controlx-auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      }),
    }
  )
);

// פונקציית עזר לשליחת מייל אימות
const sendVerificationEmail = async (email: string) => {
  // כאן תהיה הלוגיקה של שליחת המייל
  console.log('Sending verification email to:', email);
};