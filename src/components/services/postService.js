export const getPosts = () => {
    return fetch(`http://localhost:8088/posts?_expand=user&_expand=workout`).then((res) =>
      res.json()
    )
  }
  export const addPosts = async (post) => {
    return fetch("http://localhost:8088/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    }).then((res) => res.json())
}

export const updatePost = async (postId, updatedData) => {
  const response = await fetch(`http://localhost:8088/workouts/${postId}?_expand=user&_expand=muscleGroup`, {
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

export const deleteMyWorkouts = (post) => {
  return fetch(`http://localhost:8088/workouts/${post}`, {
      method: "DELETE"
  })
}