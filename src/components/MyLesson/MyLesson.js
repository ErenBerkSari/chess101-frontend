import React from "react";
import Lesson from "../Lesson/Lesson";
import { useMyLesson } from "../../contexts/MyLessonContext";
import "./MyLesson.css";

function MyLesson() {
  const { lessons, error, isLoaded } = useMyLesson();

  if (error) {
    return <div className="error">Hata: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="loading">Yükleniyor...</div>;
  } else {
    return (
      <div className="my-lesson-container">
        <h2>Kayıtlı Derslerim</h2>
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <Lesson
              key={lesson.lesson.lessonId} // Benzersiz key prop'u burada ekleniyor
              lessonId={lesson.lesson.lessonId}
              lessonName={lesson.lesson.lessonName}
              lessonDesc={lesson.lesson.lessonDesc}
              lessonImageUrl={lesson.lesson.lessonImageUrl}
              className="lesson"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MyLesson;
