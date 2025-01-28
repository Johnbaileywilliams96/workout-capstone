export const getWorkout = () => {
    return fetch(`http://localhost:8088/workout`).then((res) =>
      res.json()
    )
  }