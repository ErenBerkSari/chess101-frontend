import React, { useEffect, useState } from "react";
import Lesson from "../Lesson/Lesson";
import Container from "@mui/material/Container";
import "./Home.css";

function Home() {
  const [lessonList, setLessonList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/lessons");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await res.json();
        setLessonList(result);
        setIsLoaded(true);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    };

    fetchLessons();
  }, []);

  const renderLessons = (level) => {
    return lessonList
      .filter((lesson) => lesson.lessonLevel === level)
      .map((lesson) => (
        <Lesson
          key={lesson.lessonId}
          lessonId={lesson.lessonId}
          lessonName={lesson.lessonName}
          lessonDesc={lesson.lessonDesc}
          lessonImageUrl={lesson.lessonImageUrl}
          className="lesson"
        />
      ));
  };

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  } else {
    return (
      <Container className="home-container">
        <h2>Beginner Dersler</h2>
        <div className="lesson-category">{renderLessons("Beginner")}</div>
        <h2>Intermediate Dersler</h2>
        <div className="lesson-category">{renderLessons("Intermediate")}</div>
        <h2>Advanced Dersler</h2>
        <div className="lesson-category">{renderLessons("Advanced")}</div>
      </Container>
    );
  }
}

export default Home;
