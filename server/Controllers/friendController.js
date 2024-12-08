const connection = require("../db");

// Get friends
const get_friends = (req, res) => {
    const { user_id } = req.user;
    connection.query(
        `SELECT DISTINCT u.user_id, u.user_name, u.profile_picture
         FROM friend f
         JOIN user u ON 
             (f.user_id1 = u.user_id AND f.user_id2 = ?) 
             OR 
             (f.user_id2 = u.user_id AND f.user_id1 = ?)
         WHERE u.user_id != ?`, 
        [user_id, user_id, user_id],
        (err, friends) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching friends", error: err.message });
            }
            res.status(200).json(friends);
        }
    );
};
const friend_request = async (req, res) => {
    const { user_id } = req.user; // Current user
    const { user_id: requested_user } = req.params; // User being requested
  
    connection.query(
      'INSERT INTO friend (user_id1, user_id2, status) VALUES (?, ?, ?)', 
      [user_id, requested_user, 0], 
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error sending friend request", err });
        }
        return res.status(201).json({ message: "Friend request sent successfully" });
      }
    );
  };

  const accept_request = async (req, res) => {
    console.log(req.user)
    const user_id2 = req.user.user_id; // Current user accepting the request
    const user_id1 = req.params.user_id; // Friend request sender
    console.log(user_id1, ' ', user_id2);
    connection.query(
      'UPDATE friend SET status = 1 WHERE user_id1 = ? AND user_id2 = ?', 
      [user_id1, user_id2], 
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal server error", err });
        }
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: "No friend request found" });
        }
        return res.status(200).json({ message: "Friend request accepted" });
      }
    );
  };
  const remove_friend = async(req, res)=>{
    const {user_id} = req.user;
    const {friend_id} = req.params;
    connection.query('delete from friend where (user_id1 = ? and user_id2 = ?) or (user_id1= ? and user_id2 = ?)', [user_id, friend_id, friend_id, user_id], (err, result)=>{
      if(err)
        return res.status(500).json({message: 'Internal server error', err});
      if(result.affectedRows === 0)
        return res.status(400).json({message: "Users are not friends", err})
      res.status(200).json({message: "Removed successfully"});
    })
  }
    
const reject_request = async (req, res) => {
  const user_id2 = req.user.user_id; // Current user rejecting the request
  const user_id1 = req.params.user_id; // Friend request sender

  connection.query(
    'DELETE FROM friend WHERE user_id1 = ? AND user_id2 = ?', 
    [user_id1, user_id2], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error", err });
      }
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "No friend request found" });
      }
      return res.status(200).json({ message: "Friend request rejected" });
    }
  );
};
const get_friend_requests = async(req, res)=>{
  const {user_id} = req.user;
  connection.query('select f.*, u.profile_picture, u.user_name from friend f join user u on u.user_id = f.user_id1 where f.user_id2 = ? and f.status = 0', [user_id], (err, result)=>{
    if(err)
     return res.status(500).json({message: "Internal Sever Error"});
    if(result.length == 0)
      return res.status(400).json({message: 'No friends requests'});

    return res.status(200).json(result);
  })
}
const get_pending_requests = async(req, res)=>{
  const {user_id} = req.user;
  connection.query('select f.*, u.profile_picture, u.user_name from friend f join user u on u.user_id = f.user_id2 where f.user_id1 = ? and f.status = 0', [user_id], (err, result)=>{
    if(err)
     return res.status(500).json({message: "Internal Sever Error"});
    if(result.length == 0)
      return res.status(400).json({message: 'No Pending Requests'});

    return res.status(200).json(result);
  })
}
// Get messages
const get_messages = (req, res) => {
    const { friend_id, after_message_id } = req.params;
    const { user_id } = req.user;

    // Check if users are friends
    connection.query(
        `SELECT 1 FROM friend 
         WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?) and status = 1`,
        [user_id, friend_id, friend_id, user_id],
        (err, friendCheck) => {
            if (err) {
                return res.status(500).json({ message: "Error checking friendship", error: err.message });
            }

            if (!friendCheck.length) {
                return res.status(400).json({ message: "Users are not friends" });
            }

            // Fetch messages
            let query = `SELECT * 
                         FROM message_view 
                         WHERE 
                             ((user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?))`;
            let queryParams = [user_id, friend_id, friend_id, user_id];

            // If after_message_id is provided, add it to the query
            if (after_message_id) {
                query += ' AND message_id > ? ORDER BY messaged_at ASC';
                queryParams.push(after_message_id);
            } else {
                query += ' ORDER BY messaged_at ASC';
            }

            connection.query(query, queryParams, (err, messages) => {
                if (err) {
                    return res.status(500).json({ message: "Error retrieving messages", error: err.message });
                }

                res.status(200).json({ message: "Messages retrieved successfully", messages });
            });
        }
    );
};

// Delete message
const delete_message = (req, res) => {
    const { message_id } = req.params;
    const { user_id } = req.user;

    // Check if the message belongs to the user
    connection.query(
        `SELECT 1 
         FROM message 
         WHERE message_id = ? AND (user_id1 = ? OR user_id2 = ?)`,
        [message_id, user_id, user_id],
        (err, messageCheck) => {
            if (err) {
                return res.status(500).json({ message: "Error checking message ownership", err });
            }

            if (!messageCheck.length) {
                return res.status(403).json({ message: "Unauthorized or message not found" });
            }

            // Delete the message
            connection.query('DELETE FROM message WHERE message_id = ?', [message_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error deleting message", err });
                }

                res.status(200).json({ message: "Message deleted successfully" });
            });
        }
    );
};

const add_message = (req, res) => {
  const { user_id } = req.user; // Assuming user ID is available from middleware
  const { friend_id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  // Check if the users are friends
  connection.query(
    `SELECT * FROM friend 
     WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?) AND status = true`,
    [user_id, friend_id, friend_id, user_id],
    (err, friendCheck) => {
      if (err) {
        console.error('Error checking friendship:', err);
        return res.status(500).json({ message: 'An error occurred while checking friendship.', err });
      }

      if (friendCheck.length === 0) {
        return res.status(403).json({ message: 'You can only message friends.', err });
      }

      // Insert the message into the database
      connection.query(
        `INSERT INTO message (user_id1, user_id2, content) VALUES (?, ?, ?)`,
        [user_id, friend_id, content],
        (err, result) => {
          if (err) {
            console.error('Error adding message:', err);
            return res.status(500).json({ message: 'An error occurred while sending the message.', err });
          }

          res.status(201).json({ message: 'Message sent successfully.', message_id: result.insertId });
        }
      );
    }
  );
};
module.exports = { get_friends, get_messages, remove_friend,get_pending_requests, get_friend_requests,delete_message , friend_request, accept_request, reject_request, add_message};
