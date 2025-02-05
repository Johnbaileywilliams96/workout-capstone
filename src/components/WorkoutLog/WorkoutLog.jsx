import { useEffect, useState } from "react";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";
import "./Workout.css";
import { addSets, deleteSet } from "../services/setsService";
import {
  addWorkout,
  addWorkoutExercise,
  getWorkoutExercises,
  deleteWorkoutExercise,
} from "../services/getWorkout";
import { addPosts } from "../services/postService";
import { useNavigate } from "react-router-dom";

export const WorkoutLog = ({ currentUser }) => {
  const navigate = useNavigate();
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
  const [selectedDescription, setSelectedDescription] = useState("")
  const [selectedMuscleGroupDescription, setSelectedMuscleGroupDescription] = useState("")

  const getWorkoutExercisesByWorkout = (workoutId) => {
    return workoutExercises.filter((we) => we.workoutId === workoutId);
  };

  const fetchAllMuscleGroups = async () => {
    try {
      const muscleGroupArray = await getMuscleGroup();
      setMuscleGroup(muscleGroupArray);

      const exercisesArray = await getExercises();
      setExercises(exercisesArray);

      const workoutExerciseArray = await getWorkoutExercises();
      setWorkoutExercises(workoutExerciseArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllMuscleGroups();
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

  const handleMuscleGroupChange = (event) => {
    const muscleGroupId = parseInt(event.target.value);
    const selected = muscleGroup.find(group => group.id === muscleGroupId)
    setSelectedMuscleGroupDescription(selected?.description || "")
    setSelectedMuscleGroup(event.target.value);
  };

  const handleExerciseChange = (event) => {
    const exerciseId = parseInt(event.target.value);
    const selected = exercises.find(exercise => exercise.id === exerciseId)
    setSelectedDescription(selected?.description || "")
    setSelectedExercise(event.target.value);
  };

  const incrementReps = () => {
    setRepNumber((prev) => prev + 1);
  };

  const decrementReps = () => {
    setRepNumber((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddedSet = async (event) => {
    event.preventDefault();

    if (!workoutName) {
      alert("Please enter a workout name first");
      return;
    }

    if (selectedMuscleGroup === "0") {
      alert("Please select a muscle group");
      return;
    }

    if (selectedExercise === "0") {
      alert("Please select an exercise");
      return;
    }

    try {
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

      setWorkoutExercises((prev) => [...prev, workoutExercise]);

      const newUserSet = {
        workoutExerciseId: workoutExercise.id,
        reps: repNumber,
        weight: parseInt(workoutWeight),
        setOrder: loggedSets.length + 1,
        createdAt: formatDate(new Date()),
      };

      const savedSet = await addSets(newUserSet);
      setLoggedSets((prev) => [...prev, savedSet]);

      setRepNumber(0);
      setWorkoutWeight(0);
    } catch (error) {
      console.error("Error adding set:", error);
      alert("Failed to add set. Please try again.");
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      if (!currentWorkout) {
        alert(
          "No workout has been started. Please add at least one set first."
        );
        return;
      }

      if (loggedSets.length === 0) {
        alert("Please add at least one set before saving the workout.");
        return;
      }

      const postData = {
        userId: currentUser.id,
        content: workoutName,
        workoutId: currentWorkout.id,
        createdAt: formatDate(new Date()),
      };
      await addPosts(postData);

      setWorkoutName("");
      setLoggedSets([]);
      setSelectedExercise("0");
      setSelectedMuscleGroup("0");
      setRepNumber(0);
      setWorkoutWeight(0);
      setCurrentWorkout(null);

      navigate("/communityFeed");

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
      console.error("Error deleting set:", error);
      alert("Failed to delete set. Please try again.");
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
            <option value="0">MuscleGroup</option>
            {muscleGroup.map((group) => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        {selectedMuscleGroupDescription && (
      <div className="description-box">
        {selectedMuscleGroupDescription}
      </div>
    )}

        <div className="exercise-selection">
          <div className="exercise-dropdown">
            <select
              id="exercise-group"
              value={selectedExercise}
              onChange={handleExerciseChange}
            >
              <option value="0">Exercises</option>
              {exercises.map((exercise) => (
                <option value={exercise.id} key={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          {selectedDescription && (
      <div className="description-box">
        {selectedDescription}
      </div>
    )}



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
              <label>Weight (lbs)</label>
              <input
                type="text"
                title="Workout-Weight"
                value={workoutWeight}
                onChange={(event) => setWorkoutWeight(event.target.value)}
                required
              />
            </div>
          </fieldset>

          <button type="button" onClick={handleAddedSet}>
            + Set
          </button>
        </div>

        <div className="logged-sets">
          {loggedSets.map((set) => {
            const workoutExercise = workoutExercises.find(
              (we) => we.id === set.workoutExerciseId
            );
            const exercise = exercises.find(
              (e) => e.id === workoutExercise?.exerciseId
            );

            return (
              <div key={set.id} className="set-box">
                <button onClick={() => handleDeleteSet(set.id)}>Delete</button>
                <span>{exercise?.name}</span>
                <span>Reps: {set.reps}</span>
                <span>Weight: {set.weight}</span>
              </div>
            );
          })}
        </div>

        <button className="save-workout-btn" onClick={handleCompleteWorkout}>
          Save Workout
        </button>
      </div>
    </>
  );
};
