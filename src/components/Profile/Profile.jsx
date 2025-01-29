import { useEffect, useState } from "react";
import "./Profile.css";
import { getUser } from "../services/userService";
import { getWorkout } from "../services/getWorkout";
import { getLikes } from "../services/likesService";
import { deleteMyPost } from "../services/postService";

export const Profile = ({ currentUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [cUser, setCUser] = useState([]);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);

  const fetchAllUsersWorkouts = async () => {
    try {
      const userArray = await getUser();
      setAllUsers(userArray);

      const workoutArray = await getWorkout();

      const likesArray = await getLikes();

      const currentUserLikes = likesArray
        .filter((like) => like.userId === currentUser.id)
        .map((like) => {
          // Find the full post data from workoutArray using postId
          const fullPost = workoutArray.find(
            (workout) => workout.id === like.postId
          );
          return {
            ...like,
            post: fullPost, // This adds the full post data to each like
          };
        });

      setUserLikes(currentUserLikes);

      // Filter workouts to only get current user's workouts
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
  const handleDeletePost = async (postId) => {
    try {
      await deleteMyPost(postId);
      // Update the userWorkouts state by filtering out the deleted post
      setUserWorkouts(userWorkouts.filter(workout => workout.id !== postId));
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
              <p>Workout Type: {workout.title}</p>
              <p>Description: {workout.muscleGroup?.description}</p>
              <p>Date: {workout.dateCompleted}</p>
              <button
                className="delete-button"
                onClick={() => handleDeletePost(workout.id)}
              >
                Delete Post
              </button>
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
