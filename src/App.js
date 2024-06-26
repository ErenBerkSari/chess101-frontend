import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import LessonDetail from "./components/Lesson/LessonDetail";
import StartLesson from "./components/Lesson/StartLesson";
import TestPage from "./components/TestPage/TestPage";
import UserGuide from "./components/UserGuide/UserGuide";
import Profile from "./components/Profile/Profile";
import Dashboard from "./components/Dashboard/Dashboard";
import MyLesson from "./components/MyLesson/MyLesson";
import { ProgressProvider } from "./contexts/ProgressContext";
import { MyLessonProvider } from "./contexts/MyLessonContext";

function App() {
  const location = useLocation();
  let currentUser = null;
  try {
    currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  } catch (error) {
    console.error("Failed to parse session storage data", error);
  }

  const isAuthenticated = () => {
    return sessionStorage.getItem("tokenKey") !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/auth" />;
  };

  return (
    <ProgressProvider>
      <MyLessonProvider>
        <div className="App">
          {location.pathname !== "/auth" && <Navbar />}
          <Routes>
            <Route
              path="/auth"
              element={currentUser ? <Navigate to="/" /> : <Auth />}
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/lessons/:lessonId"
              element={
                <PrivateRoute>
                  <LessonDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/start"
              element={
                <PrivateRoute>
                  <StartLesson />
                </PrivateRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/test"
              element={
                <PrivateRoute>
                  <TestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-guide"
              element={<UserGuide />} // user-guide herkes tarafından görülebilir
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-lessons"
              element={
                <PrivateRoute>
                  <MyLesson />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  {currentUser?.role === "ADMIN" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/" />
                  )}
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </MyLessonProvider>
    </ProgressProvider>
  );
}

export default App;
