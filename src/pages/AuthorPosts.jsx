import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostsByAuthor } from "../services/api";

const AuthorPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByAuthor(username);
        setPosts(response.data); // Set posts if the API call is successful
        setError(null); // Clear any previous errors
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Handle case where no posts exist
          setPosts([]);
          setError("No posts found for this author.");
        } else {
          // Handle other errors (e.g., network issues)
          setPosts([]);
          setError("An error occurred while fetching posts.");
        }
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <div className="mainpage-container">
      {error ? (
        <p>{error}</p> // Display the error message
      ) : posts.length === 0 ? (
        <p>No posts found for this author.</p> // Fallback for empty posts
      ) : (
        <>
          <h1 className="h1-margin">Posts by {username}</h1>
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
