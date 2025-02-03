import { useEffect, useState } from "react";
import "./Profile.css";
import { getUser } from "../services/userService";
import { getWorkout } from "../services/getWorkout";
import { getLikes } from "../services/likesService";
import { deleteMyWorkouts, updateWorkout } from "../services/postService";

export const Profile = ({ currentUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [cUser, setCUser] = useState([]);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editedWorkout, setEditedWorkout] = useState({
    title: "",
    muscleGroupId: null,
    dateCompleted: "",
  });

  const fetchAllUsersWorkouts = async () => {
    try {
      const userArray = await getUser();
      setAllUsers(userArray);

      const workoutArray = await getWorkout();

      const likesArray = await getLikes();

      const currentUserLikes = likesArray
        .filter((like) => like.userId === currentUser.id)
        .map((like) => {
          const fullPost = workoutArray.find(
            (workout) => workout.id === like.postId
          );
          return {
            ...like,
            post: fullPost,
          };
        });

      setUserLikes(currentUserLikes);

      const currentUsersWorkouts = workoutArray.filter(
        (workout) => workout.userId === currentUser.id
      );
      setUserWorkouts(currentUsersWorkouts);

      const currentUserProfile = userArray.filter(
        (user) => user.id === currentUser.id
      );
      setCUser(currentUserProfile);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleEdit = (workout) => {
    setIsEditing(true);
    setEditingWorkoutId(workout.id);
    setEditedWorkout({
      title: workout.title,
      muscleGroupId: workout.muscleGroup?.id,
      dateCompleted: workout.dateCompleted,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "muscleGroupId") {
      setEditedWorkout((prev) => ({
        ...prev,
        muscleGroup: parseInt(value),
      }));
    } else {
      setEditedWorkout((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingWorkoutId(null);
    setEditedWorkout({
      title: "",
      muscleGroupId: null,
      dateCompleted: "",
    });
  };

  const handleUpdatePost = async () => {
    try {
      const updatedPost = {
        id: editingWorkoutId,
        title: editedWorkout.title,
        muscleGroupId: editedWorkout.muscleGroupId,
        dateCompleted: editedWorkout.dateCompleted,
        userId: currentUser.id,
      };

      const updatedData = await updateWorkout(editingWorkoutId, updatedPost);

      setUserWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === editingWorkoutId ? updatedData : workout
        )
      );

      await fetchAllUsersWorkouts();

      setIsEditing(false);
      setEditingWorkoutId(null);
      setEditedWorkout({
        title: "",
        muscleGroupId: { description: "" },
        dateCompleted: "",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await deleteMyWorkouts(workoutId);
      setUserWorkouts(
        userWorkouts.filter((workout) => workout.id !== workoutId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    fetchAllUsersWorkouts();
  }, [currentUser.id]);

  return (
    <div className="Profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="Profile-grid">
        {cUser.map((user) => (
          <div key={user.id} className="Profile-item">
            <p>Name: {user.name}</p>
            <p className="email">Email: {user.email}</p>
          </div>
        ))}
        <div className="Workouts-section">
          <h3>Your Workouts</h3>
          {userWorkouts.map((workout) => (
            <div key={workout.id} className="Workout-item">
              {isEditing && editingWorkoutId === workout.id ? (
                <div className="edit-post">
                  <input
                    type="text"
                    name="title"
                    value={editedWorkout.title}
                    onChange={handleInputChange}
                    placeholder="Workout Type"
                    className="title-edit"
                  />
                  <input
                    type="number"
                    name="muscleGroupId"
                    value={editedWorkout.muscleGroupId || ""}
                    onChange={handleInputChange}
                    placeholder="Muscle Group ID"
                    className="edit-description"
                  />
                  <input
                    type="date"
                    name="dateCompleted"
                    value={editedWorkout.dateCompleted}
                    onChange={handleInputChange}
                    className="edit-date"
                  />
                  <div className="post-update">
                    <button onClick={handleUpdatePost} className="update-post">
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="workout-title">Workout Type: {workout.title}</p>
                  <p className="workout-description">
                    Description: {workout.muscleGroup?.description}
                  </p>
                  <p className="workout-date">Date: {workout.dateCompleted}</p>
                  <div className="buttons">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="edit-post-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="edit-delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="Likes-section">
          <h3>Your Likes</h3>
          {userLikes.map((like) => (
            <div key={like.id} className="likes-item">
              <p>{like.post?.title}</p>
              <p>{like.post?.dateCompleted}</p>
              <p>{like.post?.muscleGroup.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
