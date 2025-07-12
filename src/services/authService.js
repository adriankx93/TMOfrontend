export const authService = {
  login: async (email, password) => {
    // Simulate API call delay
    try {
      // Simulate successful login for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const data = {
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: "user-1",
          firstName: "Administrator",
          lastName: "Systemu",
          email: email,
          role: "Admin"
        }
      };
      
      // Store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Nieprawidłowe dane logowania');
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd rejestracji');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Błąd rejestracji');
    }
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
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd aktualizacji profilu');
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Błąd aktualizacji profilu');
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd zmiany hasła');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Błąd zmiany hasła');
    }
  }
};