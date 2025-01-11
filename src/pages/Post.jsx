/* eslint-disable no-unused-vars */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, addComment, deleteComment, updateComment, getCurrentUser } from "../services/api";

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(postId, { content: commentContent });
      setSuccess("Comment added successfully!");
      setCommentContent("");
      fetchPost(); // Refresh comments
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setSuccess("Comment deleted successfully");
      fetchPost(); // Refresh comments
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  const handleEdit = async (commentId) => {
    try {
      await updateComment(commentId, { content: editedContent });
      setSuccess("Comment updated successfully");
      setEditMode(null);
      fetchPost(); // Refresh comments
    } catch (err) {
      setError("Failed to update comment");
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user", err);
      setCurrentUser(null); // Gracefully handle unauthenticated state
    }
  };

  const fetchPost = async () => {
    try {
      const response = await getPostById(postId);
      setPost(response.data);
    } catch (err) {
      setError("Failed to fetch post details");
    }
  };

  useEffect(() => {
    fetchUser();  // Fetch user once when component mounts
    fetchPost();  // Fetch post details once when component mounts
  }, [postId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <>
      <button className="home-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <div className="post-container">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>
          <i>by {post.author?.username} </i>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>

        <h3>Comments:</h3>

        <form
          className="comment-section"
          onSubmit={handleAddComment}
          style={{ marginTop: "2rem" }}
        >
          <textarea
            className="comment-box"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            required
          ></textarea>
          <button className="submit-button" type="submit">
            Add Comment
          </button>
        </form>
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {post.comments?.length > 0 ? (
          <div className="comments-container">
            <ul className="comments-ul">
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.user?.username}:</p>
                  {editMode === comment.id ? (
                    <>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <button onClick={() => handleEdit(comment.id)}>
                        Save
                      </button>
                      <button onClick={() => setEditMode(null)}>Cancel</button>
                    </>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                  <p>
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {currentUser && comment.userId === currentUser.data.id && (
                    <div>
                      <button onClick={() => setEditMode(comment.id)}>
                        Edit 🖊️
                      </button>
                      <button onClick={() => handleDelete(comment.id)}>
                        Delete ❌
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </>
  );
};

export default Post;
