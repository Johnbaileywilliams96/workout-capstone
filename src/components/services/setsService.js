export const getSets = () => {
    return fetch(`http://localhost:8088/sets`).then((res) =>
      res.json()
    )
  }

  export const addSets = async (set) => {
    return fetch("http://localhost:8088/sets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(set),
    }).then((res) => res.json())
}

export const deleteSet = async (setId) => {
    await fetch(`http://localhost:8088/workoutExercises/${setId}`, {
      method: "DELETE"
    });
    
    const response = await fetch(`http://localhost:8088/sets/${setId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };