import { create } from 'zustand';

interface User {
  id:    string;
  name:  string;
  email: string;
  role:  'student' | 'instructor' | 'admin';
}

interface AuthStore {
  user:        User | null;
  token:       string | null;
  setAuth:     (user: User, token: string) => void;
  logout:      () => void;
  restoreAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:  null,
  token: null,

  restoreAuth: () => {
    if (typeof window === 'undefined') return;
    const token   = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  }
}));
