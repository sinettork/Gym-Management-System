import { useEffect, useState } from 'react';

async function requestJson(url, options) {
  let response;

  try {
    response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch {
    throw new Error('Backend offline');
  }

  const rawPayload = await response.text();
  const payload = rawPayload ? JSON.parse(rawPayload) : {};

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await requestJson('/api/auth/me');
      setUser(payload.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    setError('');

    try {
      const payload = await requestJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(payload.user);
      return payload.user;
    } catch (loginError) {
      setError(loginError.message);
      throw loginError;
    }
  };

  const logout = async () => {
    try {
      await requestJson('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
}
