import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [newUserRole, setNewUserRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [newLesson, setNewLesson] = useState({
    lessonName: "",
    lessonDesc: "",
    lessonLevel: "Beginner",
    lessonImageUrl: "",
    content: JSON.stringify(
      {
        sections: [{ type: "text", title: "Introduction", content: "" }],
      },
      null,
      2
    ),
    testQuestions: JSON.stringify(
      [{ question: "", options: ["", "", "", ""], answer: "" }],
      null,
      2
    ),
  });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("tokenKey");

  useEffect(() => {
    fetchLessons();
    fetchUsers();
  }, []);

  const fetchLessons = async () => {
    const res = await fetch("/admin/lessons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLessons(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const handleAddLesson = async () => {
    const res = await fetch("/admin/addLesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lessonName: newLesson.lessonName,
        lessonDesc: newLesson.lessonDesc,
        lessonLevel: newLesson.lessonLevel,
        lessonImageUrl: newLesson.lessonImageUrl,
        content: newLesson.content,
        testQuestions: newLesson.testQuestions,
      }),
    });
    if (res.ok) {
      fetchLessons();
      setNewLesson({
        lessonName: "",
        lessonDesc: "",
        lessonLevel: "Beginner",
        lessonImageUrl: "",
        content: JSON.stringify(
          {
            sections: [{ type: "text", title: "Introduction", content: "" }],
          },
          null,
          2
        ),
        testQuestions: JSON.stringify(
          [{ question: "", options: ["", "", "", ""], answer: "" }],
          null,
          2
        ),
      });
    }
  };

  const handleUpdateLesson = async () => {
    const res = await fetch(`/admin/updateLesson/${selectedLesson.lessonId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lessonName: selectedLesson.lessonName,
        lessonDesc: selectedLesson.lessonDesc,
        lessonLevel: selectedLesson.lessonLevel,
        lessonImageUrl: selectedLesson.lessonImageUrl,
        content: selectedLesson.content,
        testQuestions: selectedLesson.testQuestions,
      }),
    });
    if (res.ok) {
      fetchLessons();
      setSelectedLesson(null);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const res = await fetch(`/admin/deleteLesson/${lessonId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchLessons();
    }
  };

  const fetchUserDetails = async (userId) => {
    const res = await fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUserDetails(data);
  };

  const handleUpdateUserRole = async (userId) => {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newUserRole }),
    });
    if (res.ok) {
      fetchUsers();
      setSelectedUser(null);
      setNewUserRole("");
    }
  };

  const handleDeleteUser = async (userId) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchUsers();
    }
  };

  const handleSearchUserByEmail = async () => {
    const res = await fetch(`/api/users/email/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSearchedUser(data);
    } else {
      setSearchedUser(null);
      alert("User not found");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-section">
        <h2>Add New Lesson</h2>
        <input
          type="text"
          value={newLesson.lessonName}
          onChange={(e) =>
            setNewLesson({ ...newLesson, lessonName: e.target.value })
          }
          placeholder="Lesson Name"
        />
        <textarea
          value={newLesson.lessonDesc}
          onChange={(e) =>
            setNewLesson({ ...newLesson, lessonDesc: e.target.value })
          }
          placeholder="Lesson Description"
        />
        <input
          type="text"
          value={newLesson.lessonLevel}
          onChange={(e) =>
            setNewLesson({ ...newLesson, lessonLevel: e.target.value })
          }
          placeholder="Lesson Level"
        />
        <input
          type="text"
          value={newLesson.lessonImageUrl}
          onChange={(e) =>
            setNewLesson({ ...newLesson, lessonImageUrl: e.target.value })
          }
          placeholder="Lesson Image URL"
        />
        <textarea
          value={newLesson.content}
          onChange={(e) =>
            setNewLesson({ ...newLesson, content: e.target.value })
          }
          placeholder="Lesson Content (JSON)"
        />
        <textarea
          value={newLesson.testQuestions}
          onChange={(e) =>
            setNewLesson({ ...newLesson, testQuestions: e.target.value })
          }
          placeholder="Test Questions (JSON)"
        />
        <button onClick={handleAddLesson}>Add Lesson</button>
      </div>
      <div className="dashboard-section">
        <h2>All Lessons</h2>
        <ul className="lesson-list">
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <li key={lesson.lessonId}>
                {lesson.lessonName}
                <div>
                  <button
                    onClick={() =>
                      setSelectedLesson({
                        ...lesson,
                        content: JSON.stringify(lesson.content, null, 2),
                        testQuestions: JSON.stringify(
                          lesson.testQuestions,
                          null,
                          2
                        ),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteLesson(lesson.lessonId)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No lessons available</li>
          )}
        </ul>
      </div>
      {selectedLesson && (
        <div className="dashboard-section">
          <h2>Edit Lesson</h2>
          <input
            type="text"
            value={selectedLesson.lessonName}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                lessonName: e.target.value,
              })
            }
            placeholder="Lesson Name"
          />
          <textarea
            value={selectedLesson.lessonDesc}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                lessonDesc: e.target.value,
              })
            }
            placeholder="Lesson Description"
          />
          <input
            type="text"
            value={selectedLesson.lessonLevel}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                lessonLevel: e.target.value,
              })
            }
            placeholder="Lesson Level"
          />
          <input
            type="text"
            value={selectedLesson.lessonImageUrl}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                lessonImageUrl: e.target.value,
              })
            }
            placeholder="Lesson Image URL"
          />
          <textarea
            value={selectedLesson.content}
            onChange={(e) =>
              setSelectedLesson({ ...selectedLesson, content: e.target.value })
            }
            placeholder="Lesson Content (JSON)"
          />
          <textarea
            value={selectedLesson.testQuestions}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                testQuestions: e.target.value,
              })
            }
            placeholder="Test Questions (JSON)"
          />
          <button onClick={handleUpdateLesson}>Update Lesson</button>
        </div>
      )}
      <div className="dashboard-section">
        <h2>Search User by Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
        />
        <button onClick={handleSearchUserByEmail}>Search</button>
      </div>
      {searchedUser && (
        <div className="dashboard-section">
          <h2>User Details</h2>
          <p>Username: {searchedUser.username}</p>
          <p>Email: {searchedUser.email}</p>
          <p>Role: {searchedUser.role}</p>
          <button
            onClick={() => {
              fetchUserDetails(searchedUser.userId);
              setSelectedUser(searchedUser);
            }}
          >
            Edit
          </button>
          <button onClick={() => handleDeleteUser(searchedUser.userId)}>
            Delete
          </button>
        </div>
      )}
      <div className="dashboard-section">
        <h2>All Users</h2>
        <ul className="user-list">
          {users && users.length > 0 ? (
            users.map((user) => (
              <li key={user.userId}>
                {user.username} - {user.role}
                <div>
                  <button
                    onClick={() => {
                      fetchUserDetails(user.userId);
                      setSelectedUser(user);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.userId)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No users available</li>
          )}
        </ul>
      </div>
      {selectedUser && (
        <div className="dashboard-section">
          <h2>Edit User</h2>
          <p>Username: {userDetails && userDetails.username}</p>
          <p>Email: {userDetails && userDetails.email}</p>
          <p>Current Role: {userDetails && userDetails.role}</p>
          <input
            type="text"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            placeholder="New Role"
          />
          <button onClick={() => handleUpdateUserRole(selectedUser.userId)}>
            Update Role
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
