import React, { useState } from "react";

const Post = ({ parm_post }) => {
  const [post, setPost] = useState(parm_post);
  const [like_count, set_like_count] = useState(parm_post.like_count);
  const [comment_count, set_comment_count] = useState(parm_post.comment_count);
  const [is_liked, set_is_liked] = useState(parm_post.liked_by_user);
  const likePost = async () => {
    if (is_liked) return; // Prevent multiple likes
    try {
      await api.post(`/post/${parm_post.post_id}/like`);
      set_like_count(like_count + 1);
      set_is_liked(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row post-row mb-4">
      {/* Spacer for larger screens */}
      <div className="col-0 col-sm-1 col-md-2"></div>

      {/* Post content */}
      <div className="col-12 col-sm-10 col-md-9">
        <div className="container post p-3 rounded-4">
          {/* User info */}
          <div className="d-flex pic-name-follow container align-items-center">
            <div className="d-flex align-items-center">
              <div className="pic">
                <img
                  src={post.profile_picture || "/imgdb/default-profpic.jpg"}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              </div>
              <div className="name pointer ms-2 fw-bold">{post.user_name}</div>
            </div>
          </div>

          {/* Caption and content */}
          <div className="description container pt-2 pb-4">
            <p className="mb-0">{post.caption}</p>
            <p className="text-muted" style={{ fontSize: "small" }}>
              {post.content}
            </p>
          </div>

          {/* Media carousel */}
          { post.images && post.images.length > 0 || post.videos && post.videos.length > 0 ? (
            <div
              id={`carousel-${post.post_id}`}
              className="carousel slide post-media container d-flex justify-content-center pb-2"
              data-bs-ride="carousel"
            >
              {/* Carousel indicators */}
              <div className="carousel-indicators">
                {post.images.map((_, index) => (
                  <button
                    key={`image-indicator-${index}`}
                    type="button"
                    data-bs-target={`#carousel-${post.post_id}`}
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
                {post.videos.map((_, index) => (
                  <button
                    key={`video-indicator-${post.images.length + index}`}
                    type="button"
                    data-bs-target={`#carousel-${post.post_id}`}
                    data-bs-slide-to={post.images.length + index}
                    aria-label={`Slide ${post.images.length + index + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel items */}
              <div className="carousel-inner">
                {post.images.map((image, index) => (
                  <div
                    key={`image-${index}`}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img src={image} className="d-block w-100" alt="Post" />
                  </div>
                ))}
                {post.videos.map((video, index) => (
                  <div
                    key={`video-${index}`}
                    className={`carousel-item ${
                      index === 0 && post.images.length === 0 ? "active" : ""
                    }`}
                  >
                    <video
                      className="d-block w-100"
                      controls
                      style={{ maxHeight: "400px" }}
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Like and comment info */}
          <div className="likes-comments-info pb-2 ps-3 pe-3 d-flex justify-content-between border-top">
            <div className="like-info d-flex align-items-center">
              <img
                src="/imgdb/like2.png"
                style={{ width: "15px", height: "15px" }}
                alt="Likes"
              />
              <div className="ps-1" style={{ fontSize: "small", fontWeight: "bold" }}>
                {like_count || 0}
              </div>
            </div>

            <div className="comment-info d-flex align-items-center">
              <div className="ps-1" style={{ fontSize: "small", fontWeight: "bold" }}>
                {comment_count || 0} Comments
              </div>
            </div>
          </div>

          {/* Post options */}
          <div className="post-opts d-flex justify-content-between pt-2">
            <div className="post-opt d-flex align-items-center p-3 rounded-4">
              <img src="/imgdb/like1.png" alt="Like" style={{backgroundColor: (is_liked)?"red":""}}/>
              <div className="ps-3 post-opt-label d-none d-md-block" onClick={likePost}>Like</div>
            </div>
            <div
              className="post-opt d-flex align-items-center p-3 rounded-4"
              data-bs-toggle="modal"
              data-bs-target="#commentsModal"
            >
              <img src="/imgdb/comment.png" alt="Comment" />
              <div className="ps-3 post-opt-label d-none d-md-block">Comment</div>
            </div>
            <div className="post-opt d-flex align-items-center p-3 rounded-4">
              <img src="/imgdb/share.png" alt="Share" />
              <div className="ps-3 post-opt-label d-none d-md-block">Share</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for larger screens */}
      <div className="col-0 col-sm-1"></div>
    </div>
  );
};

export default Post;
