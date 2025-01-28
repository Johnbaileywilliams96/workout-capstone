export const getLikes = () => {
    return fetch(`http://localhost:8088/likes?_expand=post&_expand=user`).then((res) =>
      res.json()
    )
}