import { useEffect, useState } from "react";
import { createLike, deleteLike, getLikes } from "../services/likesService";
import { useParams } from "react-router-dom";
import {
  deletePost,
  getPostByPostId,
  updatePost,
  deleteMyWorkouts,
} from "../services/postService";
import "./PostDetails.css";
import { getMuscleGroup } from "../services/muscleGroupService";
import {
  getWorkout,
  getWorkoutExercises,
  deleteWorkoutExercise,
} from "../services/getWorkout";
import { getSets, updateSet, deleteSet } from "../services/setsService";
import { updateMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";
import { updateWorkout } from "../services/postService";

export const PostDetails = ({ currentUser }) => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [likes, setAllLikes] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});
  const [editingSetId, setEditingSetId] = useState(null);
  const [editedSets, setEditedSets] = useState({});
  const [editedMuscleGroup, setEditedMuscleGroup] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [sets, setSets] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editedWorkout, setEditedWorkout] = useState({
    title: "",
    muscleGroupId: null,
    dateCompleted: "",
  });

  const hasUserLiked = postLikes.some((like) => like.userId === currentUser.id);
  const isPostOwner = post.userId === currentUser.id;

  const getSetsByWorkoutExercise = (workoutExerciseId) => {
    return sets.filter((set) => set.workoutExerciseId === workoutExerciseId);
  };

  const getWorkoutExercisesByWorkout = (workoutId) => {
    return workoutExercises.filter((we) => we.workoutId === workoutId);
  };

  const getWorkoutDetails = (workoutId) => {
    return workouts.find((w) => w.id === workoutId);
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : "Unknown";
  };

  const getMuscleGroupName = (muscleGroupId) => {
    const muscleGroup = muscleGroups.find((mg) => mg.id === muscleGroupId);
    return muscleGroup ? muscleGroup.name : "Unknown";
  };

  const fetchAllLikes = async () => {
    getLikes().then((likesArray) => {
      setAllLikes(likesArray);
      const currentPostLikes = likesArray.filter(
        (like) => like.postId === parseInt(postId)
      );
      setPostLikes(currentPostLikes);
    });
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

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutData = await getWorkout();
        setWorkouts(workoutData);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const muscleGroupsData = await getMuscleGroup();
        setMuscleGroups(muscleGroupsData);
      } catch (error) {
        console.error("Error fetching muscle groups:", error);
      }
    };
    fetchMuscleGroups();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesData = await getExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, []);

  const handleSetInputChange = (setId, field, value) => {
    const originalSet = sets.find((s) => s.id === setId);
    setEditedSets((prev) => ({
      ...prev,
      [setId]: {
        ...originalSet,
        ...prev[setId],
        [field]: field === "createdAt" ? value : parseInt(value),
      },
    }));
  };

  const handleMuscleGroupChange = (event) => {
    setEditedWorkout((prev) => ({
      ...prev,
      muscleGroupId: parseInt(event.target.value),
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPost({ ...post });
    setEditingWorkoutId(post.workoutId);
    setEditedWorkout({
      title: post.workout?.title,
      muscleGroupId: post.workout?.muscleGroupId,
      dateCompleted: post.workout?.dateCompleted,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPost({ ...post });
  };

  const handleSave = async () => {
    try {
      const postToUpdate = {
        userId: post.userId,
        content: editedPost.content,
        workoutId: post.workoutId,
        createdAt: post.createdAt,
        id: parseInt(postId),
      };

      await updatePost(parseInt(postId), postToUpdate);

      if (editingWorkoutId) {
        const workoutToUpdate = {
          id: editingWorkoutId,
          title: editedWorkout.title,
          muscleGroupId: editedWorkout.muscleGroupId,
          dateCompleted: editedWorkout.dateCompleted,
          userId: currentUser.id,
        };
        await updateWorkout(editingWorkoutId, workoutToUpdate);
      }

      for (const [setId, setData] of Object.entries(editedSets)) {
        const originalSet = sets.find((s) => s.id === parseInt(setId));
        await updateSet(parseInt(setId), { ...originalSet, ...setData });
      }

      const updatedSets = await getSets();
      setSets(updatedSets);

      const updatedPost = await getPostByPostId(postId);
      setPost(updatedPost[0]);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkoutInputChange = (e) => {
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
  const handleUpdateWorkout = async () => {
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

  const handleLike = async () => {
    if (!currentUser) return;

    if (hasUserLiked) {
      const likeToDelete = postLikes.find(
        (like) => like.userId === currentUser.id
      );
      if (likeToDelete) {
        await deleteLike(likeToDelete.id);
      }
    } else {
      const newLike = {
        userId: currentUser.id,
        postId: parseInt(postId),
      };
      await createLike(newLike);
    }
    fetchAllLikes();
  };

  useEffect(() => {
    fetchAllLikes();
  }, [postId]);

  useEffect(() => {
    getPostByPostId(postId).then((data) => {
      const singlePost = data[0];
      if (singlePost) {
        setPost(singlePost);
        setEditedPost(singlePost);
      }
    });
  }, [postId]);

  const handleDeletePost = async (postId) => {
    try {
      const workoutExercises = getWorkoutExercisesByWorkout(post.workoutId);

      for (const workoutExercise of workoutExercises) {
        const relatedSets = getSetsByWorkoutExercise(workoutExercise.id);
        for (const set of relatedSets) {
          await deleteSet(set.id);
        }
      }

      await deletePost(postId);
      await deleteMyWorkouts(post.workoutId);

      window.location.href = "/workoutLog";
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <>
      <h1 className="post-details-title">Post Details</h1>
      <section className="post">
        <header className="post-header">{post.user?.name}</header>
        <h3>Content: {post.content}</h3>
        {isEditing ? (
          <>
            <div>
              <span className="post-info">Workout Title: </span>
              <input
                type="text"
                name="title"
                value={editedWorkout.title || ""}
                onChange={handleWorkoutInputChange}
                className="edit-input"
              />
            </div>
            <div>
              <span className="post-info">Muscle Group: </span>
              <select
                value={editedWorkout.muscleGroupId || ""}
                onChange={handleMuscleGroupChange}
                className="edit-input"
              >
                {muscleGroups.map((mg) => (
                  <option key={mg.id} value={mg.id}>
                    {mg.name}
                  </option>
                ))}
              </select>
            </div>

            {post.workoutId && (
              <div className="workout-details">
                <h4>Exercises:</h4>
                {getWorkoutExercisesByWorkout(post.workoutId).map(
                  (workoutExercise) => (
                    <div key={workoutExercise.id} className="exercise-details">
                      <h5>{getExerciseName(workoutExercise.exerciseId)}:</h5>

                      <div className="sets-list">
                        {getSetsByWorkoutExercise(workoutExercise.id).map(
                          (set) => (
                            <div key={set.id} className="set-details">
                              <span>Set {set.setOrder}: </span>
                              <input
                                type="number"
                                value={
                                  (editedSets[set.id]?.weight ?? set.weight) ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleSetInputChange(
                                    set.id,
                                    "weight",
                                    e.target.value
                                  )
                                }
                                className="edit-input"
                              />
                              <span>lbs </span>
                              <input
                                type="number"
                                value={
                                  (editedSets[set.id]?.reps ?? set.reps) || ""
                                }
                                onChange={(e) =>
                                  handleSetInputChange(
                                    set.id,
                                    "reps",
                                    e.target.value
                                  )
                                }
                                className="edit-input"
                              />
                              <span>reps</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            <textarea
              name="content"
              value={editedPost.content || ""}
              onChange={handleInputChange}
              className="edit-input"
            />
            <div className="edit-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="post-info">Workout: </span>
              {post.workout?.title}
            </div>
            <div>
              <span className="post-info">Muscle Group: </span>
              {post.workout?.muscleGroupId
                ? getMuscleGroupName(post.workout.muscleGroupId)
                : "Not specified"}
            </div>
            <div>
              <span className="post-info">Date: </span>
              {post.createdAt}
            </div>

            {post.workoutId && (
              <div className="workout-details">
                <h4>Exercises:</h4>
                {Array.from(
                  new Set(
                    getWorkoutExercisesByWorkout(post.workoutId).map(
                      (we) => we.exerciseId
                    )
                  )
                ).map((exerciseId) => {
                  const workoutExercisesForThisExercise =
                    getWorkoutExercisesByWorkout(post.workoutId).filter(
                      (we) => we.exerciseId === exerciseId
                    );

                  return (
                    <div key={exerciseId} className="exercise-details">
                      <h5>{getExerciseName(exerciseId)}</h5>
                      <div className="sets-list">
                        {workoutExercisesForThisExercise.flatMap(
                          (workoutExercise) =>
                            getSetsByWorkoutExercise(workoutExercise.id).map(
                              (set) => (
                                <div key={set.id} className="set-details">
                                  <span>Set {set.setOrder}: </span>
                                  <span>Weight: {set.weight}lbs </span>
                                  <span>Reps: {set.reps}</span>
                                </div>
                              )
                            )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <span className="post-info">Likes: </span>
              {postLikes.length}
            </div>
            <div className="action-buttons">
              <button
                onClick={handleLike}
                className={hasUserLiked ? "liked" : ""}
              >
                {hasUserLiked ? "Unlike" : "Like"}
              </button>
              {isPostOwner && <button onClick={handleEdit}>Edit Post</button>}
              {isPostOwner && (
                <button onClick={handleDeletePost}>Delete</button>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};
