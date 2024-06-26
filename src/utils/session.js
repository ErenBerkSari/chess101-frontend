// src/utils/session.js

export const getCurrentUser = () => {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("tokenKey");
};
