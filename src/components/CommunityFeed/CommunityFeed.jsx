import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import "./CommunityFeed.css";
import { createLike, getLikes, deleteLike } from "../services/likesService";
import { Link } from "react-router-dom";
import { getMuscleGroup } from "../services/muscleGroupService";
import { getWorkout } from "../services/getWorkout";

export const CommunityFeed = ({ currentUser }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [filteredPosts, setAllFilteredPosts] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("0");
  const [workouts, setWorkouts] = useState([]);

  const fetchMuscleGroups = async () => {
    try {
      const muscleGroupArray = await getMuscleGroup();
      setMuscleGroups(muscleGroupArray);
    } catch (error) {
      console.error("Error fetching muscle groups:", error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const workoutArray = await getWorkout();
      setWorkouts(workoutArray);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const muscleGroupChange = (event) => {
    const muscleGroupId = event.target.value;
    setSelectedMuscleGroup(muscleGroupId);

    if (muscleGroupId === "0") {
      setAllFilteredPosts(allPosts);
    } else {
      // First, find all workouts that target this muscle group
      const workoutsWithMuscleGroup = workouts.filter(
        workout => workout.muscleGroupId === parseInt(muscleGroupId)
      );
      
      // Then, filter posts that use any of these workouts
      const filtered = allPosts.filter(post => 
        workoutsWithMuscleGroup.some(workout => workout.id === post.workoutId)
      );
      
      setAllFilteredPosts(filtered);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const postsArray = await getPosts();
      setAllPosts(postsArray);
      setAllFilteredPosts(postsArray); // Set initial filtered posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAllLikes = async () => {
    try {
      const likesArray = await getLikes();
      setUserLikes(likesArray);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      const isLiked = isPostLiked(postId);
      
      if (isLiked) {
        const likeToRemove = userLikes.find(
          (like) => like.postId === postId && like.userId === currentUser.id
        );
        
        if (likeToRemove) {
          await deleteLike(likeToRemove.id);
          setUserLikes((prevLikes) =>
            prevLikes.filter((like) => like.id !== likeToRemove.id)
          );
        }
      } else {
        const newLike = {
          userId: currentUser.id,
          postId: postId,
        };

        const createdLike = await createLike(newLike);
        setUserLikes((prevLikes) => [...prevLikes, createdLike]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isPostLiked = (postId) => {
    return userLikes.some((like) => like.postId === postId && like.userId === currentUser.id);
  };

  const getPostLikesCount = (postId) => {
    return userLikes.filter((like) => like.postId === postId).length;
  };

  useEffect(() => {
    fetchAllPosts();
    fetchAllLikes();
    fetchMuscleGroups();
    fetchWorkouts();
  }, [currentUser.id]);

  return (
    <>
      <select
        id="muscleGroups"
        value={selectedMuscleGroup}
        onChange={muscleGroupChange}
      >
        <option value="0">All Muscle Groups</option>
        {muscleGroups.map((mg) => (
          <option value={mg.id} key={mg.id}>
            {mg.name}
          </option>
        ))}
      </select>

      <h2>Community Feed</h2>
      <div className="community-feed-container">
        {filteredPosts.map((post) => {
          const liked = isPostLiked(post.id);
          const likesCount = getPostLikesCount(post.id);
          
          return (
            <div key={post.id} className="post-ticket">
              <p>{post.user?.name}</p>
              {/* <p>{post.content}</p> */}
              <Link to={`/postDetails/${post.id}`} key={post.id}>
                <h2 className="h2-communityFeed">Title: {post.workout?.title}</h2>
              </Link>
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