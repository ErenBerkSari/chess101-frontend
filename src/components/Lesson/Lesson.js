import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "./Lesson.css";

function Lesson({ lessonId, lessonName, lessonDesc, lessonImageUrl }) {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/lessons/${lessonId}`);
  };

  return (
    <Card sx={{ width: 370 }} className="lesson">
      <CardMedia
        component="img"
        alt={lessonDesc}
        height="140"
        image={lessonImageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {lessonName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {lessonDesc}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleLearnMore}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

export default Lesson;
