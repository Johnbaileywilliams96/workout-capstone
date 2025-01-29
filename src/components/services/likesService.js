export const getLikes = () => {
    return fetch(`http://localhost:8088/likes?_expand=post&_expand=user`).then((res) =>
      res.json()
    )
}

export const createLike = (like) => {
    return fetch("http://localhost:8088/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(like),
    }).then((res) => res.json())
  }

  export const deleteLike = async (likeId) => {
    const response = await fetch(`http://localhost:8088/likes/${likeId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete like");
    }
    return true;
  };