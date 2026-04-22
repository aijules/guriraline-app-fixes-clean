// Token management utility using sessionStorage (and localStorage as fallback)

export const setToken = (token) => {
  try {
    // Try sessionStorage first (cleared when browser closes)
    sessionStorage.setItem('token', token);
    
    // Also save to localStorage as backup (persists across sessions)
    localStorage.setItem('token', token);
    
    // Also try to set cookie as fallback (for backend compatibility)
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; SameSite=Lax; max-age=${90 * 24 * 60 * 60}`;
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = () => {
  try {
    // Try sessionStorage first
    let token = sessionStorage.getItem('token');
    
    // If not in sessionStorage, try localStorage
    if (!token) {
      token = localStorage.getItem('token');
      // If found in localStorage, also save to sessionStorage
      if (token) {
        sessionStorage.setItem('token', token);
      }
    }
    
    // If still not found, try reading from cookie
    if (!token && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
          token = value;
          // Save to sessionStorage and localStorage
          if (token) {
            sessionStorage.setItem('token', token);
            localStorage.setItem('token', token);
          }
          break;
        }
      }
    }
    
    return token;
  } catch (error) {
    console.error('Error reading token:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    
    // Also clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const hasToken = () => {
  return !!getToken();
};

