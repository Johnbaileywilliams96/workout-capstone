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
