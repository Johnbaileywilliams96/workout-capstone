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

export const getPostByPostId = async (postId) => {
  return fetch(`http://localhost:8088/posts?id=${postId}&_expand=user&_expand=workout`).then((res) => res.json())
}

export const updateWorkout = async (postId, updatedData) => {
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

export const updatePost = async (postId, updatedData) => {
  const response = await fetch(`http://localhost:8088/posts/${postId}?_expand=user&_expand=muscleGroup`, {
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
export const deletePost = async (postId) => {
  await fetch(`http://localhost:8088/posts/${postId}`, {
    method: "DELETE"
  });
  
  const response = await fetch(`http://localhost:8088/workouts/${postId}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// export const deleteMyPost = (post) => {
//   return fetch(`http://localhost:8088/posts/${post}`, {
//       method: "DELETE"
//   })
// }

export const deleteMyWorkouts = (post) => {
  return fetch(`http://localhost:8088/workouts/${post}`, {
      method: "DELETE"
  })
}