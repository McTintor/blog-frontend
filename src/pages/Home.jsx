/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { getPosts } from "../services/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage-container">
      <h1>All Posts</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.map((post) => (
        <div key={post.id} className="mainpage-post-container">
          <h2>{post.title}</h2>
          <p>
            <i>by {post.author?.username || "Unknown"}</i>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Home;
