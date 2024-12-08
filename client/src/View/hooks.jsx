import { useState, useEffect } from "react";

const usePosts = () => {
  const [currPost, setCurrPost] = useState(Number.MAX_SAFE_INTEGER);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = async (isInitial = false) => {
    try {
      setLoading(true);
      const user_name = JSON.parse(localStorage.getItem("user_name") || '""');
      const newPost = undefined

      if (newPost) {
        setPosts((prevPosts) => (isInitial ? [newPost] : [...prevPosts, newPost]));
        setCurrPost(newPost.id); // Update currPost to fetch the next post
      }
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(true); // Fetch initial posts on mount
  }, []);

  return { posts, loading, error, loadPosts };
};

export default usePosts;
