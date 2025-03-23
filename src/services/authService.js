// src/services/authService.js
export const setToken = (token) => {
    localStorage.setItem("authToken", token);
    console.log("Token armazenado:", token); 
  };
  
  export const getToken = () => {
    return localStorage.getItem("authToken");
    
  };
  
  export const removeToken = () => {
    localStorage.removeItem("authToken");
  };
  