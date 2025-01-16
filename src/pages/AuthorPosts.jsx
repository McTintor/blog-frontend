import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostsByAuthor } from "../services/api";

const AuthorPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract currentPage from URL query parameter or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchPosts(currentPage); // Fetch posts whenever username or currentPage changes
  }, [username, currentPage]);

  const fetchPosts = async (page) => {
    try {
      const response = await getPostsByAuthor(username, page); // Pass the page to the API call
      setPosts(response.data.posts); // Set posts from the response
      setTotalPages(response.data.totalPages); // Set total pages from the response
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPosts([]);
        setError("No posts found for this author.");
      } else {
        setPosts([]);
        setError("An error occurred while fetching posts.");
      }
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page navigation
    setSearchParams({ page }); // Update the `page` query parameter in the URL
  };

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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    className={`pagination-button ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    disabled={currentPage === page} // Disable current page button
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorPosts;
