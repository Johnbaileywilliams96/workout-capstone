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
  const setResponse = await fetch(`http://localhost:8088/sets/${setId}`, {
      method: "DELETE"
  });
  if (!setResponse.ok) {
      throw new Error(`HTTP error! status: ${setResponse.status}`);
  }
};

  export const updateSet = async (setId, updatedData) => {
    const response = await fetch(`http://localhost:8088/sets/${setId}`, {
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
  