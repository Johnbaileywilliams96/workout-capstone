import { useEffect, useState } from "react";
import "./Profile.css";
import { getUser } from "../services/userService";
import { getWorkout } from "../services/getWorkout";
import { getLikes } from "../services/likesService";
import { deleteMyWorkouts, updateWorkout } from "../services/postService";
// import { Link, useParams } from "react-router-dom";
import { getWorkoutExercises } from "../services/getWorkout";
import { getSets } from "../services/setsService";

export const Profile = ({ currentUser }) => {
  // const { postId } = useParams();
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
  const [post, setAllPosts] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState(0);
  const [sets, setSets] = useState(0);
  const [workoutStats, setWorkoutStats] = useState({});

  const isPostOwner = post.userId === currentUser.id;

  const fetchAllPosts = async () => {
    try {
      const postsArray = await getPosts();
      setAllPosts(postsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const setsData = await getSets();
        setSets(setsData);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };
    fetchSets();
  }, []);

  useEffect(() => {
    const fetchWorkoutExercises = async () => {
      try {
        const workoutExerciseData = await getWorkoutExercises();
        setWorkoutExercises(workoutExerciseData);
      } catch (error) {
        console.error("Error fetching workoutExercises:", error);
      }
    };
    fetchWorkoutExercises();
  }, []);

  const calculateTotalStats = async (workoutId) => {
    const workoutExercisesForWorkout = workoutExercises.filter(
      (we) => we.workoutId === workoutId
    );

    const totalWeight = workoutExercisesForWorkout.reduce(
      (total, workoutExercise) => {
        const exerciseSets = sets.filter(
          (set) => set.workoutExerciseId === workoutExercise.id
        );
        const exerciseWeight = exerciseSets.reduce(
          (setTotal, set) => setTotal + (set.weight || 0),
          0
        );
        return total + exerciseWeight;
      },
      0
    );

    const totalReps = workoutExercisesForWorkout.reduce(
      (total, workoutExercise) => {
        const exerciseSets = sets.filter(
          (set) => set.workoutExerciseId === workoutExercise.id
        );
        const exerciseReps = exerciseSets.reduce(
          (setTotal, set) => setTotal + (set.reps || 0),
          0
        );
        return total + exerciseReps;
      },
      0
    );

    const heaviestWeight = workoutExercisesForWorkout.reduce(
      (maxWeight, workoutExercise) => {
        const exerciseSets = sets.filter(
          (set) => set.workoutExerciseId === workoutExercise.id
        );
        const exerciseMaxWeight = Math.max(
          ...exerciseSets.map((set) => set.weight || 0)
        );
        return Math.max(maxWeight, exerciseMaxWeight);
      },
      0
    );

    return {
      totalWeight,
      totalReps,
      heaviestWeight,
    };
  };

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
    const loadStats = async () => {
      const stats = {};
      for (const workout of userWorkouts) {
        stats[workout.id] = await calculateTotalStats(workout.id);
      }
      setWorkoutStats(stats);
    };

    if (
      userWorkouts.length > 0 &&
      workoutExercises.length > 0 &&
      sets.length > 0
    ) {
      loadStats();
    }
  }, [userWorkouts, workoutExercises, sets]);

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
            <p className="date-joined">Date Joined: {user.date}</p>
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

        <div className="progress-section">
          <h3>Progress</h3>
          <div className="workout-progress">
            {userWorkouts.map((workout) => (
              <div key={workout.id} className="workout-progress-item">
                <h4>{workout.title}</h4>
              
                {workoutStats[workout.id] && (
                  <>
                    <p>
                      Total Weight: {workoutStats[workout.id].totalWeight} lbs
                    </p>
                    <p>Total Reps: {workoutStats[workout.id].totalReps}</p>
                    <p>
                      Heaviest Weight: {workoutStats[workout.id].heaviestWeight}{" "}
                      lbs
                    </p>
                    <p>Total Reps: {workoutStats[workout.id].totalReps}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
