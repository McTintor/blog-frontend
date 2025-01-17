import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPostById,
  addComment,
  deleteComment,
  updateComment,
  getCurrentUser,
  updatePost,
  deletePost,
} from "../services/api";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [success, setSuccess] = useState("");
  const [editModeComment, setEditModeComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

const fetchUser = async () => {
  try {
    const user = await getCurrentUser();
    setCurrentUser(user);
  } catch {
    // If user is not logged in, don't set currentUser, but allow viewing the post
  }
};


  const fetchPost = async () => {
    try {
      const response = await getPostById(postId);
      setPost(response.data);
      setEditedPost({ title: response.data.title, content: response.data.content });
    } catch {
      setError("Failed to fetch post details.");
    }
  };

  // Add a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(postId, { content: commentContent });
      setCommentContent("");
      setSuccess("Comment added successfully!");
      fetchPost();
    } catch {
      setError("Failed to add comment.");
    }
  };

  // Edit a comment
  const handleEditComment = async (commentId) => {
    try {
      await updateComment(commentId, { content: editedComment });
      setEditModeComment(null);
      setSuccess("Comment updated successfully!");
      fetchPost();
    } catch {
      setError("Failed to update comment.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setSuccess("Comment deleted successfully!");
      fetchPost();
    } catch {
      setError("Failed to delete comment.");
    }
  };

  // Edit the post
  const handleEditPost = async () => {
    try {
      await updatePost(postId, editedPost);
      setIsEditingPost(false);
      setSuccess("Post updated successfully!");
      fetchPost();
    } catch {
      setError("Failed to update post.");
    }
  };

  // Delete the post
  const handleDeletePost = async () => {
    try {
      await deletePost(postId);
      setSuccess("Post deleted successfully!");
      navigate("/");
    } catch {
      setError("Failed to delete post.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, [postId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  const isAuthor = currentUser && currentUser.data.role === "author" && post.author?.id === currentUser.data.id;
  const isAdmin = currentUser && currentUser.data.role === "admin";

  return (
    <div className="post-container">
  {isEditingPost ? (
    <>
      <input
        className="modern-input"
        type="text"
        value={editedPost.title}
        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
      />
      <textarea
        className="modern-textarea"
        value={editedPost.content}
        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
      />
      <button className="edit-button" onClick={handleEditPost}>Save</button>
      <button className="edit-button" onClick={() => setIsEditingPost(false)}>Cancel</button>
    </>
  ) : (
    <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <i>by {post.author?.username}</i>{" "}
        <span>
          {new Date(post.createdAt).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </p>
    </>
  )}

  {(isAuthor || isAdmin) && !isEditingPost && (
    <div>
      <button className="edit-button" onClick={() => setIsEditingPost(true)}>Edit Post</button>
      <button className="edit-button" onClick={handleDeletePost}>Delete Post</button>
    </div>
  )}

      <h3>Comments:</h3>
      <form className="comment-section" onSubmit={handleAddComment}>
  {currentUser && (
    <>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        required
        className="comment-box"
      ></textarea>
      <button className="submit-button" type="submit">Add Comment</button>
    </>
  )}
  {!currentUser && <p>Please log in to comment.</p>}
</form>

<div className="comments-container">
  {post.comments?.map((comment) => (
    <div key={comment.id}>
      {editModeComment === comment.id ? (
        <>
          <textarea
            className="comment-box"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            required
          />
          <br></br>
          <button className="edit-button" onClick={() => handleEditComment(comment.id)}>Save</button>
          <button className="edit-button" onClick={() => { setEditModeComment(null); setEditedComment(comment.content); }}>Cancel</button>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <p>
            <i>by {comment.user?.username}</i>{" "}
            <span>
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </>
      )}

      {(currentUser && (comment.userId === currentUser.data.id || currentUser.data.role === "admin")) && (
        <div>
          {!editModeComment && (
            <>
              <button className="edit-button" onClick={() => { setEditModeComment(comment.id); setEditedComment(comment.content); }}>Edit 🖊️</button>
              <button className="edit-button" onClick={() => handleDeleteComment(comment.id)}>Delete ❌</button>
            </>
          )}
        </div>
      )}
    </div>
  ))}
</div>


      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Post;
