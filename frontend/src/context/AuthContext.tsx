import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authService, type AuthUser } from '../services/auth.service';

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'eq_token';
const USER_KEY = 'eq_user';

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      const user = raw ? (JSON.parse(raw) as AuthUser) : null;
      return { user, loading: !!user }; // loading = true only if we need to validate stored session
    } catch {
      return { user: null, loading: false };
    }
  });

  // Validate stored token against /api/auth/me on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }

    authService
      .getMe()
      .then((u) => {
        // Re-attach token (getMe doesn't return it)
        const freshUser = { ...u, token };
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        setState({ user: freshUser, loading: false });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user: null, loading: false });
      });
  }, []);

  const persistUser = (user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ user, loading: false });
  };

  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    persistUser(user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const user = await authService.register({ name, email, password });
    persistUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
