import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import { getWorkout, getWorkoutExercises } from "../services/getWorkout";
import { getUser } from "../services/userService";
import "./CommunityFeed.css";
import { createLike, getLikes, deleteLike } from "../services/likesService";

export const CommunityFeed = ({ currentUser }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const postsArray = await getPosts();
      setAllPosts(postsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAllLikes = async () => {
    try {
      const likesArray = await getLikes(); // Changed to getLikes service
      setUserLikes(likesArray);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      const isLiked = isPostLiked(postId);
      
      if (isLiked) {
        // Find the like to remove
        const likeToRemove = userLikes.find(
          (like) => like.postId === postId && like.userId === currentUser.id
        );
        
        if (likeToRemove) {
          await deleteLike(likeToRemove.id);
          // Remove the like from userLikes array
          setUserLikes((prevLikes) =>
            prevLikes.filter((like) => like.id !== likeToRemove.id)
          );
        }
      } else {
        // Add new like
        const newLike = {
          userId: currentUser.id,
          postId: postId,
        };

        const createdLike = await createLike(newLike);
        // Add the new like to userLikes array with the id from the server
        setUserLikes((prevLikes) => [...prevLikes, createdLike]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isPostLiked = (postId) => {
    return userLikes.some((like) => like.postId === postId && like.userId === currentUser.id);
  };

  // New function to count likes for a specific post
  const getPostLikesCount = (postId) => {
    return userLikes.filter((like) => like.postId === postId).length;
  };

  useEffect(() => {
    fetchAllPosts();
    fetchAllLikes(); 
  }, [currentUser.id]);

  return (
    <>
      <h2>Community Feed</h2>
      <div className="community-feed-container">
        {allPosts.map((post) => {
          const liked = isPostLiked(post.id);
          const likesCount = getPostLikesCount(post.id);
          
          return (
            <div key={post.id} className="post-ticket">
              <p>{post.user?.name}</p>
              <p>{post.content}</p>
              <h2 className="h2-communityFeed">{post.workout?.title}</h2>
              <p className="likes-count">Likes: {likesCount}</p>
              <button
                className={`like-button ${liked ? "liked" : ""}`}
                onClick={() => handleLikeToggle(post.id)}
              >
                {liked ? "Unlike" : "Like"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};