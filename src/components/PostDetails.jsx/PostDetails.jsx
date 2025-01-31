import { useEffect, useState } from "react";
import { createLike, deleteLike, getLikes } from "../services/likesService";
import { useParams } from "react-router-dom";
import { deletePost, getPostByPostId, updatePost } from "../services/postService";
import "./PostDetails.css"

export const PostDetails = ({ currentUser }) => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [likes, setAllLikes] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});

  const hasUserLiked = postLikes.some((like) => like.userId === currentUser.id);
  const isPostOwner = post.userId === currentUser.id;

  const fetchAllLikes = async () => {
    getLikes().then((likesArray) => {
      setAllLikes(likesArray);
      const currentPostLikes = likesArray.filter(
        (like) => like.postId === parseInt(postId)
      );
      setPostLikes(currentPostLikes);
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPost({ ...post });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPost({ ...post });
  };

  const handleSave = async () => {
    try {
      // Make sure editedPost has the id
      const postToUpdate = {
        ...editedPost,
        id: parseInt(postId), // Ensure id is included and is a number
      };

      await updatePost(postToUpdate); // Pass single post object
      setPost(postToUpdate);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLike = async () => {
    if (!currentUser) return;

    if (hasUserLiked) {
      const likeToDelete = postLikes.find(
        (like) => like.userId === currentUser.id
      );
      if (likeToDelete) {
        await deleteLike(likeToDelete.id);
      }
    } else {
      const newLike = {
        userId: currentUser.id,
        postId: parseInt(postId),
      };
      await createLike(newLike);
    }
    fetchAllLikes();
  };

  useEffect(() => {
    fetchAllLikes();
  }, [postId]);

  useEffect(() => {
    getPostByPostId(postId).then((data) => {
      const singlePost = data[0];
      if (singlePost) {
        setPost(singlePost);
        setEditedPost(singlePost);
      }
    });
  }, [postId]);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPost(post.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <h1 className="post-details-title">Post Details</h1>
      <section className="post">
        <header className="post-header">{post.user?.name}</header>
        {isEditing ? (
          <>
            <div>
              <span className="post-info">Title: </span>
              <input
                type="text"
                name="title"
                value={editedPost.title || ""}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            <div>
              <span className="post-info">Content: </span>
              <textarea
                name="body"
                value={editedPost.content || ""}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="post-info">Workout: </span>
              {post.workout?.title}
            </div>
            <div>
              <span className="post-info">Muscle Group: </span>
              {post.workout?.muscleGroupId}
            </div>
            <div>
              <span className="post-info">Content: </span>
              {post.content}
            </div>
            <div>
              <span className="post-info">Date: </span>
              {post.createdAt}
            </div>
            <div>
              <span className="post-info">Likes: </span>
              {postLikes.length}
            </div>
            <div className="action-buttons">
              <button
                onClick={handleLike}
                className={hasUserLiked ? "liked" : ""}
              >
                {hasUserLiked ? "Unlike" : "Like"}
              </button>
              {isPostOwner && <button onClick={handleEdit}>Edit Post</button>}
                {isPostOwner && <button onClick={handleDeletePost}>Delete</button>}
            </div>
          </>
        )}
      </section>
    </>
  );
};
