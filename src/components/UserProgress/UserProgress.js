import React, { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { ProgressContext } from "../../contexts/ProgressContext";
import "./UserProgress.css";

function UserProgress() {
  const { progress } = useContext(ProgressContext);

  return (
    <div className="user-progress-container">
      <Typography variant="body2" className="progress-text">
        {`${Math.round(progress)}%`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        className="progress-bar"
      />
    </div>
  );
}

export default UserProgress;
