import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import { getWorkout } from "../services/getWorkout";
import { getUser } from "../services/userService";
import "./CommunityFeed.css";

export const CommunityFeed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const postsArray = await getPosts();
      setAllPosts(postsArray);
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
        {allPosts.map((post) => {
          return (
            <div key={post.id} className="post-ticket">
              <p> {post.user?.name}</p>
              <p> {post.content}</p>
              <h2 className="h2-communityFeed"> {post.workout?.title}</h2>
              <p>Likes {post.likesCount}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
