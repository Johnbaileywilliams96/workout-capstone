import { useEffect, useState } from "react";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getExercises } from "../services/exerciseService";

export const WorkoutLog = () => {
  const [muscleGroup, setMuscleGroup] = useState([]);
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState("0")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("0");

  const fetchAllMuscleGroups = async () => {
    try {
      const muscleGroupArray = await getMuscleGroup();
      setMuscleGroup(muscleGroupArray);

      const exercisesArray = await getExercises()
      setExercises(exercisesArray)

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
  return (
    <>
      <div className="muscleGroup-container">
        <h2>Log Workout</h2>
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


        <button className="add-exercise-btn">Add Exercise</button>
      </div>
    </>
  );
};
