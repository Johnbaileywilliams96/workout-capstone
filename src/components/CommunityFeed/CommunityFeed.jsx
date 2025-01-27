import { useEffect, useState } from "react"
import { getPosts } from "../services/postService";

export const CommunityFeed = () => {
    const [allPosts, setAllPosts] = useState([])

    const fetchAllPosts = async () => {
        try {
          const postsArray = await getPosts();
          setAllPosts(postsArray);
    
    
        } catch (error) {
            console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts()
  }, [])
      
    return (
        <>
        <h2>Community Feed</h2>
        <div className="community-feed-container">
            {allPosts.map((post) => (
                <div key={post.id} className="post-ticket">
                    <p>postId {post.id}</p>
                    <p>content {post.content}</p>
                    <p>likes {post.likesCount}</p>
                    </div>
            ))}
        </div>
        </>
    )
}