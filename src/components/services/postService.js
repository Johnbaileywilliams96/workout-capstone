export const getPosts = () => {
    return fetch(`http://localhost:8088/post`).then((res) =>
      res.json()
    )
  }