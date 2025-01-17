import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchPosts } from "../services/api";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [warning, setWarning] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const queryParam = searchParams.get("query");
  const pageParam = searchParams.get("page");

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      setSearchQuery(queryParam);
    }
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);
    fetchSearchResults(queryParam, page);
  }, [queryParam, pageParam]);

  const fetchSearchResults = async (query, page) => {
    try {
      const response = await searchPosts(query, page);
      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setPosts([]);
        setError("No posts found for your search query.");
      }
      setError("");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("An error occurred while fetching search results.");
      setPosts([]);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setWarning("Please enter a search query.");
      return;
    }
    setWarning("");
    navigate(`/search?query=${encodeURIComponent(query)}&page=1`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ query: searchQuery, page });
    fetchSearchResults(searchQuery, page);
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
      {searchQuery && <h1>Search Results for &quot;{searchQuery}&quot;</h1>}

      {posts.length === 0 && !error && searchQuery && (
        <p>No results found for &quot;{searchQuery}&quot;.</p>
      )}

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
                disabled={currentPage === page}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
