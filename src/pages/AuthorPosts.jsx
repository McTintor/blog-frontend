import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostsByAuthor } from "../services/api";

const AuthorPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByAuthor(username);
        setPosts(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch posts by this author.");
      }
    };

    fetchPosts();
  }, [username]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mainpage-container">
      {posts.length === 0 ? (
        <p>No posts found for this author.</p>
      ) : (
        <>
          <h1>Posts by {username}</h1>
          {posts.map((post) => (
            <div key={post.id} className="mainpage-post-container">
              <h2>
                <Link to={`/posts/${post.id}`} className="hover-text">
                  {post.title}
                </Link>
              </h2>
              <p>by {post.author.username}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );  

};

export default AuthorPosts;
