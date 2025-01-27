export const getMuscleGroup = () => {
    return fetch(`http://localhost:8088/muscleGroup`).then((res) =>
      res.json()
    )
  }