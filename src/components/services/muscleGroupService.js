export const getMuscleGroup = () => {
    return fetch(`http://localhost:8088/muscleGroups`).then((res) =>
      res.json()
    )
  }