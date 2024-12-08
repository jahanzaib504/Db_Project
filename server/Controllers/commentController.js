const connection = require("../db");

// Get comments and replies
const get_comments = (req, res) => {
    const { post_id } = req.params;
    connection.query(
        `SELECT c.*, u.profile_picture, u.user_name 
         FROM comment c 
         JOIN user u ON c.user_id = u.user_id 
         WHERE c.post_id = ?`, 
        [post_id],
        (err, comments) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Fetch replies for each comment
            const commentsWithReplies = [];
            let completed = 0;

            comments.forEach((comment, index) => {
                fetchReplys(connection, comment, (err, updatedComment) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    commentsWithReplies[index] = updatedComment;
                    completed++;

                    // Once all replies are fetched, send the response
                    if (completed === comments.length) {
                        res.status(200).json(commentsWithReplies); // Return only the comments with replies
                    }
                });
            });

            // If there are no comments, send an empty array
            if (comments.length === 0) {
                res.status(200).json([]); // Return an empty array if no comments are found
            }
        }
    );
};

// Add a comment
const add_comment = (req, res) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const { user_id } = req.user;
    connection.query(
        'INSERT INTO comment (post_id, content, user_id) VALUES (?, ?, ?)', 
        [post_id, content, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ comment_id: result.insertId }); // Return only the inserted comment_id
        }
    );
};

// Delete a comment
const delete_comment = (req, res) => {
    const { comment_id } = req.params;
    const { user_id } = req.user;
    connection.query(
        'DELETE FROM comment WHERE comment_id = ? AND user_id = ?', 
        [comment_id, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Comment not found or unauthorized" });
            }

            res.status(200).json({}); // Just return an empty response for successful deletion
        }
    );
};

// Fetch replies for a comment
function fetchReplys(connection, comment, callback) {
    connection.query(
        `SELECT r.*, u.user_name, u.profile_picture 
         FROM reply r 
         JOIN user u ON r.user_id = u.user_id 
         WHERE r.comment_id = ? 
         ORDER BY r.replied_at DESC`,
        [comment.comment_id],
        (err, results) => {
            if (err) {
                return callback(err); // Pass error to the callback
            }
            comment.replies = results;
            callback(null, comment); // Pass updated comment to the callback
        }
    );
}

module.exports = { get_comments, add_comment, delete_comment };
