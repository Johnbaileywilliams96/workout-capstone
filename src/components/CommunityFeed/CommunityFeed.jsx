import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import { getWorkout } from "../services/getWorkout";
import { getUser } from "../services/userService";
import "./CommunityFeed.css"

export const CommunityFeed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const postsArray = await getPosts();
      setAllPosts(postsArray);

      const workoutArray = await getWorkout();
      setAllWorkouts(workoutArray);

      const usersArray = await getUser();
      setAllUsers(usersArray);

      const combined = postsArray.map((post) => {
        const user = usersArray.find((user) => user.id === post.userId);
        const userWorkouts = workoutArray.filter(
          (workout) => workout.userId === post.userId
        );
        return {
          ...post,
          user: user,
          workouts: userWorkouts,
        };
      });

      setCombinedData(combined);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <>
      <h2>Community Feed</h2>
      <div className="community-feed-container">
        {combinedData.map((post) => (
          <div key={post.id} className="post-ticket">
            <p> {post.user?.name}</p>
            <p> {post.content}</p>
            <p>Likes {post.likesCount}</p>
          </div>
        ))}
      </div>
    </>
  );
};
