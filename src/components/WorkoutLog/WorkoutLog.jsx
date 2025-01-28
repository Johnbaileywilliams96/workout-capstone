import { useEffect, useState } from "react";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";
import "./Workout.css";
import { addSets, deleteSet } from "../services/setsService";
import { addWorkout } from "../services/getWorkout";

export const WorkoutLog = ({ currentUser }) => {
  const [muscleGroup, setMuscleGroup] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("0");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("0");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutWeight, setWorkoutWeight] = useState(0);
  const [repNumber, setRepNumber] = useState(0);
  const [loggedSets, setLoggedSets] = useState([]);

  const fetchAllMuscleGroups = async () => {
    try {
      const muscleGroupArray = await getMuscleGroup();
      setMuscleGroup(muscleGroupArray);

      const exercisesArray = await getExercises();
      setExercises(exercisesArray);
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

    if (repNumber && workoutWeight && selectedExercise !== "0") {
      const newUserSet = {
        exerciseName:
          exercises.find((ex) => ex.id === parseInt(selectedExercise))?.name ||
          "Unknown Exercise",
        reps: repNumber,
        weight: parseInt(workoutWeight),
        setOrder: loggedSets.length + 1,
      };

      try {
        // First, add the set to the database
        await addSets(newUserSet);

        // If database update is successful, update the local state
        setLoggedSets((prevSets) => [...prevSets, newUserSet]);

        // Reset the input fields for the next set
        setRepNumber(0);
        setWorkoutWeight(0);
      } catch (error) {
        console.error("Error adding set to database:", error);
      }
    }
  };

  const handleSaveWorkout = async () => {
    // Check if we have a workout name and at least one set
    if (!workoutName.trim()) {
      alert("Please enter a workout name");
      return;
    }
    
    if (loggedSets.length === 0) {
      alert("Please add at least one set to your workout");
      return;
    }
  
    try {
      const workoutData = {
        title: workoutName,
        sets: loggedSets,
        muscleGroup: muscleGroup,
        userId: currentUser.id, // Assuming currentUser has an id property
        date: new Date().toISOString()
      };
  
      await addWorkout(workoutData);
      
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
  const handleDeleteSet = async (setOrder) => {
    try {
      // First delete from database
      await deleteSet(setOrder);
      
      // Then update local state
      setLoggedSets(prevSets => prevSets.filter(set => set.setOrder !== setOrder));
      
      // Optionally reorder remaining sets
      setLoggedSets(prevSets => 
        prevSets.map((set, index) => ({
          ...set,
          setOrder: index + 1
        }))
      );
    } catch (error) {
      console.error("Error deleting set:", error);
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
    <div key={set.setOrder} className="set-box">
      <button onClick={() => handleDeleteSet(set.setOrder)}>Delete</button>
      <span>{set.exerciseName}</span>
      <span>Reps: {set.reps}</span>
      <span>Weight: {set.weight}</span>
    </div>
  ))}
</div>

        <button className="save-workout-btn"
        onClick={handleSaveWorkout}>Save Workout</button>
      </div>
    </>
  );
};
