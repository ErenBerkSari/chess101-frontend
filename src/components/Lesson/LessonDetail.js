import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./LessonDetail.css"; // Bu satırın doğru olduğundan emin olun

function LessonDetail() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const token = sessionStorage.getItem("tokenKey");

  const fetchLessonDetail = useCallback(async () => {
    try {
      const res = await fetch(`/lessons/${lessonId}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await res.json();
      setLesson(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [lessonId]);

  const checkEnrollmentStatus = useCallback(async () => {
    try {
      const res = await fetch(`/userLesson/user/${currentUser.id}/lessons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      const enrolledLesson = data.find(
        (lesson) => lesson.lesson.lessonId === parseInt(lessonId)
      );
      if (enrolledLesson) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      setErrorMessage(error.message);
    }
  }, [currentUser.id, lessonId, token]);

  const enrollInLesson = async () => {
    try {
      const res = await fetch("/userLesson/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser.id,
          lessonId: parseInt(lessonId),
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to enroll in lesson");
      }

      const result = await res.json();
      console.log("Enrollment successful:", result);
      setIsEnrolled(true);
    } catch (error) {
      alert(error.message); // Kullanıcıya dostu bir geri bildirim gösterme
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
    checkEnrollmentStatus();
  }, [fetchLessonDetail, checkEnrollmentStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    return <div>No lesson found.</div>;
  }

  return (
    <Container id="lesson-detail-container">
      <Typography variant="h4" component="h1" gutterBottom>
        {lesson.lessonName}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {lesson.lessonDesc}
      </Typography>
      <Typography variant="body2" component="p" gutterBottom>
        Level: {lesson.lessonLevel}
      </Typography>
      <img
        src={lesson.lessonImageUrl}
        alt={lesson.lessonDesc}
        className="lesson-image"
      />
      {errorMessage && (
        <Typography className="error">{errorMessage}</Typography>
      )}
      <div className="buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={enrollInLesson}
          disabled={isEnrolled}
        >
          {isEnrolled ? "Already Enrolled" : "Enroll in Lesson"}
        </Button>
        {isEnrolled && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/lessons/${lessonId}/start`)}
          >
            Proceed to Lesson
          </Button>
        )}
      </div>
    </Container>
  );
}

export default LessonDetail;
