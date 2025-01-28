export const getExercises = () => {
    return fetch(`http://localhost:8088/exercises?_expand=muscleGroup`).then((res) =>
      res.json()
    )
  }