export const authService = {
  // Mock authentication service
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test user credentials
    if (email === "admin" && password === "admin1234") {
      const user = {
        id: "1",
        email: "admin@orange.pl",
        firstName: "Administrator",
        lastName: "Systemu",
        role: "Admin",
        avatar: "A",
        permissions: ["all"]
      };
      
      const token = "mock-jwt-token-" + Date.now();
      
      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error("Nieprawidłowe dane logowania");
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = authService.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  },

  changePassword: async (currentPassword, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock password validation
    if (currentPassword !== "admin1234") {
      throw new Error("Nieprawidłowe obecne hasło");
    }
    
    if (newPassword.length < 6) {
      throw new Error("Nowe hasło musi mieć co najmniej 6 znaków");
    }
    
    return { success: true };
  }
};