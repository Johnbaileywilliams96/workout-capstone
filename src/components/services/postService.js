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

  export const updatePost = (post) => {
    return fetch(`http://localhost:8088/posts/${post.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
    }).then(res => res.json())
}

export const deleteMyPost = (post) => {
  return fetch(`http://localhost:8088/posts/${post}`, {
      method: "DELETE"
  })
}