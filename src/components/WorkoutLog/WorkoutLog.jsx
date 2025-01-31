import { useEffect, useState } from "react";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";
import "./Workout.css";
import { addSets, deleteSet } from "../services/setsService";
import {
  addWorkout,
  addWorkoutExercise,
  getWorkoutExercises,
} from "../services/getWorkout";
import { addPosts } from "../services/postService";

export const WorkoutLog = ({ currentUser }) => {
  const [muscleGroup, setMuscleGroup] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("0");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("0");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutWeight, setWorkoutWeight] = useState(0);
  const [repNumber, setRepNumber] = useState(0);
  const [loggedSets, setLoggedSets] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const fetchAllMuscleGroups = async () => {
    try {
      const muscleGroupArray = await getMuscleGroup();
      setMuscleGroup(muscleGroupArray);

      const exercisesArray = await getExercises();
      setExercises(exercisesArray);

      const workoutExerciseArray = await getWorkoutExercises();
      setWorkoutExercises(workoutExerciseArray);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    fetchAllMuscleGroups();
  }, []);

  const handleMuscleGroupChange = (event) => {
    const muscleGroupId = event.target.value;
    setSelectedMuscleGroup(muscleGroupId);
  };

  const handleExerciseChange = (event) => {
    const exerciseId = event.target.value;
    setSelectedExercise(exerciseId);
  };

  const incrementReps = () => {
    setRepNumber((prev) => prev + 1);
  };

  const decrementReps = () => {
    setRepNumber((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleAddedSet = async (event) => {
    event.preventDefault();

    if (!workoutName) {
      alert("Please enter a workout name first");
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      // Create workout if doesn't exist
      let workoutId;
      if (!currentWorkout) {
        const workout = await addWorkout({
          title: workoutName,
          muscleGroupId: parseInt(selectedMuscleGroup),
          userId: currentUser.id,
          dateCompleted: formatDate(new Date()),
        });
        setCurrentWorkout(workout);
        workoutId = workout.id;
      } else {
        workoutId = currentWorkout.id;
      }

      const workoutExercise = await addWorkoutExercise({
        workoutId: workoutId,
        exerciseId: parseInt(selectedExercise),
        order: workoutExercises.length + 1,
      });

      const newUserSet = {
        workoutExerciseId: workoutExercise.id,
        reps: repNumber,
        weight: parseInt(workoutWeight),
        setOrder: loggedSets.length + 1,
        createdAt: formatDate(new Date()),
      };

      const savedSet = await addSets(newUserSet);
      setLoggedSets((prev) => [...prev, savedSet]);
    } catch (error) {
      console.error("Error adding set:", error);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      // 1. Save the workout first to get its ID
      const workoutData = {
        title: workoutName,
        muscleGroupId: parseInt(selectedMuscleGroup),
        userId: currentUser.id,
        dateCompleted: formatDate(new Date()),
      };
      const savedWorkout = await addWorkout(workoutData);

      // 2. Create the post
      const postData = {
        userId: currentUser.id,
        content: workoutName,
        workoutId: savedWorkout.id,
        createdAt: formatDate(new Date()),
      };
      await addPosts(postData);

      // 3. Create workout exercise entries for each unique exercise in the sets
      const uniqueExercises = [
        ...new Set(loggedSets.map((set) => set.exerciseName)),
      ];
      for (const exerciseName of uniqueExercises) {
        const exercise = exercises.find((ex) => ex.name === exerciseName);
        if (exercise) {
          const exerciseWorkoutData = {
            workoutId: savedWorkout.id, // You'll need to modify your addWorkout function to return the saved workout
            exerciseId: exercise.id,
            order: workoutExercises.length + 1,
          };
          await addWorkoutExercise(exerciseWorkoutData);
        }
      }

      // Clear the form after successful save
      setWorkoutName("");
      setLoggedSets([]);
      setSelectedExercise("0");
      setSelectedMuscleGroup("0");
      setRepNumber(0);
      setWorkoutWeight(0);

      alert("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    }
  };

  const handleDeleteSet = async (setId) => {
    try {
      await deleteSet(setId);
      setLoggedSets(loggedSets.filter((set) => set.id !== setId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  return (
    <>
      <div className="muscleGroup-container">
        <h2 className="workout-h2">Log Workout</h2>
        <fieldset className="users-workout">
          <div>
            <label>Workout Name</label>
            <input
              type="text"
              name="Workout-Name"
              value={workoutName}
              onChange={(event) => setWorkoutName(event.target.value)}
              required
            />
          </div>
        </fieldset>
        <div className="muscleGroup-dropdown">
          <select
            id="muscle-group"
            value={selectedMuscleGroup}
            onChange={handleMuscleGroupChange}
          >
            <option value="0">MuscleGroup</option>$
            {muscleGroup.map((group) => {
              return (
                <option value={group.id} key={group.id}>
                  {group.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="exercise-selection">
          <div className="exercise-dropdown">
            <select
              id="exercise-group"
              value={selectedExercise}
              onChange={handleExerciseChange}
            >
              <option value="0">Exercises</option>$
              {exercises.map((exercise) => {
                return (
                  <option value={exercise.id} key={exercise.id}>
                    {exercise.name}
                  </option>
                );
              })}
            </select>
          </div>

          <fieldset className="users-reps">
            <div>
              <label>Reps</label>
              <div className="reps-counter">
                <button type="button" onClick={decrementReps}>
                  -
                </button>
                <span>{repNumber}</span>
                <button type="button" onClick={incrementReps}>
                  +
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset className="users-weight">
            <div>
              <label>weight (ibs)</label>
              <input
                type="text"
                title="Workout-Name"
                value={workoutWeight}
                onChange={(event) => setWorkoutWeight(event.target.value)}
                required
              />
            </div>
          </fieldset>

          <button type="button" onClick={handleAddedSet}>
            + set
          </button>
        </div>
        <div className="logged-sets">
          {loggedSets.map((set) => (
            <div key={set.id} className="set-box">
              <button onClick={() => handleDeleteSet(set.id)}>Delete</button>
              <span>{set.exerciseName}</span>
              <span>Reps: {set.reps}</span>
              <span>Weight: {set.weight}</span>
            </div>
          ))}
        </div>

        <button className="save-workout-btn" onClick={handleCompleteWorkout}>
          Save Workout
        </button>
      </div>
    </>
  );
};
