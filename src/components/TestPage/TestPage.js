import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ProgressContext } from "../../contexts/ProgressContext";
import Confetti from "react-confetti";
import "./TestPage.css";

function TestPage() {
  const { lessonId } = useParams();
  const token = sessionStorage.getItem("tokenKey");
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [testQuestions, setTestQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const { progress, fetchProgress } = useContext(ProgressContext);

  useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const response = await fetch(`/lessons/${lessonId}/test`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTestQuestions(typeof data === "string" ? JSON.parse(data) : data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCompletionStatus = async () => {
      try {
        const response = await fetch(
          `/userLesson/user/${currentUser.id}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched user lessons: ", data);
        const lessonStatus = data.find(
          (lesson) => lesson.lesson.lessonId === parseInt(lessonId)
        );
        console.log("Lesson status: ", lessonStatus);
        if (lessonStatus && lessonStatus.completed) {
          setIsTestCompleted(true);
        } else {
          setIsTestCompleted(false);
        }
      } catch (error) {
        console.error("Error fetching completion status:", error);
      }
    };

    fetchTestQuestions();
    fetchCompletionStatus();
  }, [lessonId, token, currentUser.id]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = async () => {
    const results = testQuestions.questions.map((question, index) => ({
      ...question,
      userAnswer: answers[index],
      isCorrect: question.correctAnswer === answers[index],
    }));

    const correctAnswers = results.filter((result) => result.isCorrect).length;
    const score = (correctAnswers / results.length) * 100;

    if (score >= 70) {
      setMessage("Başarılı! Testi geçtiniz.");
      setIsTestCompleted(true);
      console.log("Test completed, setting isTestCompleted to true.");

      try {
        const response = await fetch(
          `/userLesson/complete-test?score=${score}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: currentUser.id,
              lessonId: parseInt(lessonId),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to mark lesson as completed");
        }

        const data = await response.json();
        console.log("Lesson completion response:", data);

        // Kullanıcı ilerlemesini güncelle
        const updateProgressResponse = await fetch(
          `/userProgress/update/${currentUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!updateProgressResponse.ok) {
          throw new Error("Failed to update user progress");
        }

        // ProgressContext'ten gelen fonksiyonu kullanarak progress bar'ı güncelle
        fetchProgress(currentUser.id);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setMessage("Başarısız. Testi yeniden çözmelisiniz.");
    }

    setResults(results);
  };

  const handleRetry = () => {
    setAnswers({});
    setResults(null);
    setMessage("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="confetti-container">
      {isTestCompleted && <Confetti />}
      <Container>
        <Typography variant="h4" component="div" gutterBottom>
          Test Sayfası
        </Typography>
        {testQuestions &&
          testQuestions.questions.map((question, index) => (
            <div
              key={index}
              className={
                results
                  ? results[index].isCorrect
                    ? "correct"
                    : "incorrect"
                  : ""
              }
            >
              <Typography variant="h6" component="div" gutterBottom>
                {question.question}
              </Typography>
              <RadioGroup
                name={`question-${index}`}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                value={answers[index] || ""}
                disabled={isTestCompleted}
              >
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                    disabled={isTestCompleted}
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isTestCompleted}
        >
          Submit
        </Button>
        {message && (
          <Typography
            variant="h6"
            component="div"
            className="test-message"
            style={{
              color: message.includes("Başarılı") ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}
        {message && !message.includes("Başarılı") && (
          <Button variant="contained" color="secondary" onClick={handleRetry}>
            Tekrar Çöz
          </Button>
        )}
        <ProgressBar
          className="test-progress-bar"
          now={progress}
          label={`${progress.toFixed(2)}%`}
        />
      </Container>
    </div>
  );
}

export default TestPage;
