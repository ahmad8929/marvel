"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SessionUser } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

type AuthState = {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const token = useRef<string | null>(null);

  const applySession = useCallback(
    (data: { accessToken: string; user: SessionUser }) => {
      token.current = data.accessToken;
      setUser(data.user);
    },
    [],
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) throw new Error("no session");
      applySession(await res.json());
    } catch {
      token.current = null;
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [applySession]);

  useEffect(() => {
    // Establish the session from the refresh cookie on first mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error?.message ?? "Invalid email or password");
      }
      applySession(await res.json());
    },
    [applySession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error?.message ?? "Could not create account");
      }
      applySession(await res.json());
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    token.current = null;
    setUser(null);
  }, []);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const run = () =>
        fetch(`${API}${path}`, {
          ...init,
          headers: {
            ...(init.headers ?? {}),
            ...(token.current ? { authorization: `Bearer ${token.current}` } : {}),
          },
        });
      let res = await run();
      if (res.status === 401) {
        await refresh();
        res = await run();
      }
      return res;
    },
    [refresh],
  );

  const value = useMemo<AuthState>(
    () => ({ user, ready, login, register, logout, authFetch }),
    [user, ready, login, register, logout, authFetch],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
