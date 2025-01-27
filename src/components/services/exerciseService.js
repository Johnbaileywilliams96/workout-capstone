export const getExercises = () => {
    return fetch(`http://localhost:8088/exercise`).then((res) =>
      res.json()
    )
  }