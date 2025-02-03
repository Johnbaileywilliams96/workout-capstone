export const getMuscleGroup = () => {
    return fetch(`http://localhost:8088/muscleGroups`).then((res) =>
      res.json()
    )
  }

  export const updateMuscleGroup = async (muscleGroupId, updatedData) => {
    const response = await fetch(`http://localhost:8088/muscleGroups/${muscleGroupId}`, {
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