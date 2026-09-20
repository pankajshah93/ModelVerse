import { useCallback, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const TOKEN_STORAGE_KEY = "chat_app_token";

/**
 * Owns everything related to who's logged in.
 *
 * Bug fix vs. the original: the token used to live only in React state,
 * so a page refresh silently logged the user out. It's now persisted to
 * localStorage and restored on mount.
 */
export function useAuth() {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || null
  );
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const persistToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authApi.fetchProfile(token);
      setUser(data.user || data);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  // Whenever we have a token (including on first mount from localStorage),
  // make sure we know who the user is.
  useEffect(() => {
    if (token) loadProfile();
  }, [token, loadProfile]);

  async function signIn({ email, password }) {
    const data = await authApi.login({ email, password });
    persistToken(data.token);
    setUser(data.user || null);
  }

 

  async function signUp({ name, email, age, password }) {
    // Bug fix: age was being sent as a string from the form input.
    const data = await authApi.signup({
      name,
      email,
      age: Number(age),
      password,
    });
    persistToken(data.token);
    setUser(data.user || null);
  }

  async function signOut() {
    try {
      await authApi.logout(token);
    } catch {
      // Even if the server call fails, log the user out locally.
    }
    persistToken(null);
    setUser(null);
  }

  return {
    token,
    user,
    error,
    isAuthenticated: Boolean(token),
    signIn,
    signUp,
    signOut,
  };
}
