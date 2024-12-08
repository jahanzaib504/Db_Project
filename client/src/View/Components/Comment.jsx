import { useState, useContext } from "react";
import UserContext  from "../../UserContext"; // Assuming UserContext is imported from another file

const Reply = ({ parm_reply, deleteReply }) => {
  const [reply, setReply] = useState(parm_reply);

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-end">
        <div className="d-flex align-items-start">
          {/* User Photo */}
          <img
            src={reply.profile_picture || "/imgdb/text/img1.jpg"}
            alt="User Photo"
            className="rounded-circle me-3"
            width="40"
            height="40"
          />

          {/* Reply Content */}
          <div className="flex-grow-1">
            <h6 className="mb-1">{reply.user_name}</h6>
            <p className="mb-0">{reply.content}</p>
          </div>

          {/* Options Menu */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted"
              type="button"
              id={`replyOptions-${reply.reply_id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby={`replyOptions-${reply.reply_id}`}
            >
              <li onClick={() => deleteReply(reply.reply_id)}>
                <a className="dropdown-item" href="#">
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ parm_comment, addReply, deleteComment, deleteReply }) => {
  const [comment, setComment] = useState(parm_comment);
  const { userDetails } = useContext(UserContext);

  return (
    <div>
      <div className="container mt-4">
        <div className="d-flex align-items-start">
          {/* User Photo */}
          <img
            src={comment.profile_picture || "/imgdb/text/img1.jpg"}
            alt="User Photo"
            className="rounded-circle me-3"
            width="50"
            height="50"
          />

          {/* Comment Content */}
          <div className="flex-grow-1">
            <h6 className="mb-1">{comment.user_name}</h6>
            <p className="mb-0">{comment.content}</p>
          </div>

          {/* Options Menu */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted"
              type="button"
              id={`commentOptions-${comment.comment_id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby={`commentOptions-${comment.comment_id}`}
            >
              <li onClick={() => addReply(comment.comment_id)}>
                <a className="dropdown-item" href="#">
                  Reply
                </a>
              </li>
              {comment.user_id === userDetails.user_id && (
                <li onClick={() => deleteComment(comment.comment_id)}>
                  <a className="dropdown-item" href="#">
                    Delete
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Render Replies */}
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <Reply key={reply.reply_id} parm_reply={reply} deleteReply={deleteReply} />
        ))}
    </div>
  );
};

export default Comment;
