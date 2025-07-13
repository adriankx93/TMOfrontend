export const authService = {
  login: async (email, password) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Błąd logowania");
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  },

  register: async (userData) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Błąd rejestracji");
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  updateProfile: async (userData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Błąd aktualizacji profilu");
    }
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/profile/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Błąd zmiany hasła");
    }
    return data;
  },
};
