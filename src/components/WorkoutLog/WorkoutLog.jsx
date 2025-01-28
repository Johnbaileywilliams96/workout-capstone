import { useEffect, useState } from "react";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";
import "./Workout.css";
import { addSets } from "../services/setsService";

export const WorkoutLog = ({ currentUser }) => {
  const [muscleGroup, setMuscleGroup] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("0");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("0");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutWeight, setWorkoutWeight] = useState(0);
  const [repNumber, setRepNumber] = useState(0);
 

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

  const handleAddedSet = (event) => {
    event.preventDefault();

    const newUserSet = {
      reps: repNumber,
      weight: parseInt(workoutWeight),
    };
    if (repNumber && workoutWeight) {
      return addSets(newUserSet);
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
              <label>weight(ibs)</label>
              <input
                type="text"
                name="Workout-Name"
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

        <button className="add-exercise-btn">Add Exercise</button>

        <button className="save-workout-btn">Save Workout</button>
      </div>
    </>
  );
};
