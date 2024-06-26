import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./StartLesson.css";

function StartLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const token = sessionStorage.getItem("tokenKey");
  const [lessonContent, setLessonContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        const response = await fetch(`/lessons/${lessonId}/content`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLessonContent(typeof data === "string" ? JSON.parse(data) : data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonId]);

  const handleTest = () => {
    navigate(`/lessons/${lessonId}/test`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!lessonContent) {
    return <div>No lesson content found.</div>;
  }

  return (
    <Container className="lesson-detail">
      <Typography variant="h4" component="div" gutterBottom>
        {lessonContent.lessonName}
      </Typography>
      <img
        src={lessonContent.lessonImageUrl}
        alt={lessonContent.lessonDesc}
        className="lesson-image"
      />
      <Typography
        variant="body1"
        color="text.secondary"
        className="lesson-description"
      >
        {lessonContent.lessonDesc}
      </Typography>
      {lessonContent.content.sections.map((section, index) => (
        <div key={index} className="lesson-section">
          <Typography variant="h5" component="div" gutterBottom>
            {section.title}
          </Typography>
          {section.type === "text" && (
            <Typography variant="body1" color="text.primary">
              {section.content}
            </Typography>
          )}
          {section.type === "image" && (
            <div className="lesson-section-image">
              <img src={section.url} alt={section.description} />
              <Typography variant="caption" color="text.secondary">
                {section.description}
              </Typography>
            </div>
          )}
          {section.type === "video" && (
            <div className="lesson-section-video">
              <iframe
                width="560"
                height="315"
                src={section.url}
                title={section.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Typography variant="caption" color="text.secondary">
                {section.description}
              </Typography>
            </div>
          )}
        </div>
      ))}
      <div className="buttons">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTest}
          style={{ marginLeft: "10px" }}
        >
          Teste Geç
        </Button>
      </div>
    </Container>
  );
}

export default StartLesson;
