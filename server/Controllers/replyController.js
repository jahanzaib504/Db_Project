// Add a reply
const add_reply = (req, res) => {
    const { comment_id } = req.params;
    const { content } = req.body;
    const { user_id } = req.user;

    connection.query(
        'INSERT INTO reply (comment_id, content, user_id) VALUES (?, ?, ?)', 
        [comment_id, content, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error while adding reply", error: err.message });
            }

            res.status(201).json({ message: "Reply added successfully", reply_id: result.insertId });
        }
    );
};

// Delete a reply
const delete_reply = (req, res) => {
    const { reply_id } = req.params;
    const { user_id } = req.user;

    connection.query(
        'DELETE FROM reply WHERE reply_id = ? AND user_id = ?', 
        [reply_id, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error while deleting reply", error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Reply not found or unauthorized" });
            }

            res.status(200).json({ message: "Reply deleted successfully" });
        }
    );
};

module.exports = { add_reply, delete_reply };
