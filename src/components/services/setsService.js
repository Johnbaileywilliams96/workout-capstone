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

export const deleteSet = async (id) => {
    const response = await fetch(`http://localhost:8088/sets/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete set');
    }
};