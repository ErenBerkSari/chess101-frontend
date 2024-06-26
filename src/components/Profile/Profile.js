import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import { ProgressContext } from "../../contexts/ProgressContext";
import { Doughnut } from "react-chartjs-2";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userLessons, setUserLessons] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { progress, setProgress } = useContext(ProgressContext);

  const fetchUserData = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const token = sessionStorage.getItem("tokenKey");

      const userRes = await fetch(`/api/users/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User response status:", userRes.status);
      const userData = await userRes.json();
      console.log("User data:", userData);

      if (!userRes.ok) {
        throw new Error("Network response was not ok");
      }

      setUserData(userData);
      setUpdatedUsername(userData.realUsername);

      const totalLessonsRes = await fetch("/lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Total lessons response status:", totalLessonsRes.status);
      const totalLessonsData = await totalLessonsRes.json();
      console.log("Total lessons data:", totalLessonsData);

      if (!totalLessonsRes.ok) {
        throw new Error("Network response was not ok");
      }

      setTotalLessons(totalLessonsData.length);

      const lessonRes = await fetch(
        `/userLesson/user/${currentUser.id}/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Lesson response status:", lessonRes.status);
      const userLessons = await lessonRes.json();
      console.log("User lessons:", userLessons);

      if (!lessonRes.ok) {
        throw new Error("Network response was not ok");
      }

      setUserLessons(userLessons);

      const completedLessons = userLessons.filter(
        (lesson) => lesson.completed
      ).length;
      setProgress((completedLessons / totalLessonsData.length) * 100);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleUpdate = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const token = sessionStorage.getItem("tokenKey");

      const updateData = {
        username: updatedUsername,
      };

      if (newPassword) {
        const passwordChangeData = {
          currentPassword,
          newPassword,
        };

        const passwordChangeRes = await fetch(
          `/api/users/${currentUser.id}/change-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(passwordChangeData),
          }
        );

        if (!passwordChangeRes.ok) {
          const errorText = await passwordChangeRes.text();
          throw new Error(errorText);
        }
      }

      const updateRes = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        throw new Error(errorText);
      }

      const updatedUser = await updateRes.json();
      console.log("Updated user data:", updatedUser);
      setUserData(updatedUser);
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const chartData = {
    labels: ["Tamamlanan Dersler", "Tamamlanmayan Dersler"],
    datasets: [
      {
        data: [
          userLessons.filter((lesson) => lesson.completed).length,
          totalLessons -
            userLessons.filter((lesson) => lesson.completed).length,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350"],
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="left-container">
        {userData && (
          <Card className="user-info-card">
            <CardHeader
              avatar={<Avatar src={userData.avatarUrl} />}
              title={
                editMode ? (
                  <TextField
                    value={updatedUsername}
                    onChange={(e) => setUpdatedUsername(e.target.value)}
                  />
                ) : (
                  userData.realUsername || userData.email
                )
              }
              subheader={`Email: ${userData.email}`}
            />
            <CardContent>
              <p>Rol: {userData.role}</p>
              {editMode && (
                <>
                  <TextField
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <TextField
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </>
              )}
              <div className="badges">
                {userData.badges.map((badge) => (
                  <Chip key={badge} label={badge} />
                ))}
              </div>
              {editMode ? (
                <>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                >
                  Edit
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="user-lessons">
          <h3>Kayıtlı Dersler</h3>
          {userLessons.length === 0 ? (
            <p>Henüz kayıtlı ders yok</p>
          ) : (
            <List>
              {userLessons.map((lesson) => (
                <ListItem key={lesson.lesson.lessonId}>
                  <ListItemText
                    primary={lesson.lesson.lessonName}
                    secondary={lesson.completed ? "Tamamlandı" : "Tamamlanmadı"}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </div>

      <div className="right-container">
        <div className="user-progress">
          <h3>Genel İlerleme</h3>
          <LinearProgress variant="determinate" value={progress} />
          <p>{progress.toFixed(2)}%</p>
          <div className="chart-container">
            <Doughnut data={chartData} className="doughnut-chart" />
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        className="print-button"
      >
        Yazdır
      </Button>
    </div>
  );
}

export default Profile;
