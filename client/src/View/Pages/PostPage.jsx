import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../axios";
import { Photo, Video } from "../../utils/converter";
import UserContext from "../../UserContext";
import Post from "../Components/Post";
import Comment from "../Components/Comment"; // Assuming Comment is in this path

const PostPage = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userDetails } = useContext(UserContext);

  const deleteReply = async (reply_id) => {
    try {
      await api.delete(`/reply/${reply_id}`);
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          replies: comment.replies.filter((reply) => reply.reply_id !== reply_id),
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (comment_id) => {
    try {
      await api.delete(`/comment/${comment_id}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== comment_id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addReply = async (comment_id) => {
    const content = prompt("Enter your reply:");
    if (content) {
      try {
        const replyData = { content };
        const response = await api.post(`/reply/${comment_id}`, replyData);
        const newReply = {
          ...response.data,
          profile_picture: Photo(userDetails.profile_picture),
          user_name: userDetails.user_name,
        };
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === comment_id
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addComment = async () => {
    const content = prompt("Enter your comment:");
    if (content) {
      try {
        const response = await api.post(`/comment/${post_id}`, { content });
        const newComment = {
          ...response.data,
          profile_picture: Photo(userDetails.profile_picture),
          user_name: userDetails.user_name,
          replies: [],
        };
        setComments((prevComments) => [...prevComments, newComment]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postResponse = await api.get(`/post/${post_id}`);
        const commentResponse = await api.get(`/comment/${post_id}`);

        const processedPost = {
          ...postResponse.data,
          profile_picture: Photo(postResponse.data.profile_picture),
          images: postResponse.data.images.map(Photo),
          videos: postResponse.data.videos.map(Video),
        };

        const processedComments = commentResponse.data.map((comment) => ({
          ...comment,
          profile_picture: Photo(comment.profile_picture),
          replies: comment.replies.map((reply) => ({
            ...reply,
            profile_picture: Photo(reply.profile_picture),
          })),
        }));

        setPost(processedPost);
        setComments(processedComments);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [post_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {post && <Post parm_post={post} />}
      <button onClick={addComment} className="btn btn-primary mt-3">
        Add Comment
      </button>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.comment_id}
            parm_comment={comment}
            addReply={addReply}
            deleteComment={deleteComment}
            deleteReply={deleteReply}
          />
        ))
      ) : (
        <div>No comments available.</div>
      )}
    </div>
  );
};

export default PostPage;
