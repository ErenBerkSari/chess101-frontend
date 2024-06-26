import React, { createContext, useState } from "react";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);

  const fetchProgress = async (userId) => {
    const token = sessionStorage.getItem("tokenKey");
    try {
      const res = await fetch(`/userProgress/progress/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch progress");
      }
      const data = await res.json();
      const percentage = (data.completed / data.total) * 100;
      setProgress(percentage);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, setProgress, fetchProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
