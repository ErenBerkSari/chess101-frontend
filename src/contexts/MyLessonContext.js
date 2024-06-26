import React, { createContext, useState, useEffect, useContext } from "react";

const MyLessonContext = createContext();

export const MyLessonProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentUser = sessionStorage.getItem("currentUser")
    ? JSON.parse(sessionStorage.getItem("currentUser"))
    : null;
  const token = sessionStorage.getItem("tokenKey");

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserLessons = async () => {
      try {
        const res = await fetch(`/userLesson/user/${currentUser.id}/lessons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Ağ yanıtı geçerli değil");
        }
        const result = await res.json();
        setLessons(result);
        setIsLoaded(true);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };

    fetchUserLessons();
  }, [currentUser, token]);

  return (
    <MyLessonContext.Provider value={{ lessons, error, isLoaded }}>
      {children}
    </MyLessonContext.Provider>
  );
};

export const useMyLesson = () => {
  return useContext(MyLessonContext);
};
