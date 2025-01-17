/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(currentPage, pageSize);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setWarning("Please enter a search query.");
      return;
    }
    setWarning("");
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSearchParams({ page });
  };

  return (
    <div className="mainpage-container">
      <div className="search-bar-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by title or author username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {warning && <p style={{ color: "orange" }}>{warning}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>All Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="mainpage-post-container">
          <h2>
            <Link to={`/posts/${post.id}`} className="hover-text">
              {post.title}
            </Link>
          </h2>
          <p>
            by{" "}
            <Link
              className="username-hover"
              to={`/posts/author/${post.author.username}`}
            >
              {post.author.username}
            </Link>
          </p>
        </div>
      ))}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
