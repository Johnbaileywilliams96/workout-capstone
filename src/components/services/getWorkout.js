export const getWorkout = () => {
    return fetch(`http://localhost:8088/workouts?_expand=user&_expand=muscleGroup`).then((res) =>
      res.json()
    )
  }
  export const getWorkoutExercises = () => {
    return fetch(`http://localhost:8088/workoutExercise?_expand=exercise&_expand=workout`).then((res) =>
      res.json()
    )
}

export const addWorkoutExercise = async (workout) => {
  return fetch("http://localhost:8088/workoutExercise", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
  }).then((res) => res.json())
}

export const updateWorkoutExercise = async (workoutExerciseId, updatedData) => {
  const response = await fetch(`http://localhost:8088/workoutExercise/${workoutExerciseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const addWorkout = async (workout) => {
  return fetch("http://localhost:8088/workouts", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
  }).then((res) => res.json())
}

export const deleteWorkoutExercise = async (workoutExerciseId) => {
  const response = await fetch(`http://localhost:8088/workoutExercises/${workoutExerciseId}`, {
    method: "DELETE"
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete workout exercise: ${response.status}`);
  }
}