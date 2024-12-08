const connection = require("../db");

// Get profile by user name or email

const get_profile = (req, res) => {
    const { user_name } = req.params;  // Extracting the user_name from the params
    const { user_id } = req.user;      // Extracting the user_id from the body
    
    if (!user_name) {
        return res.status(400).json({ message: 'User name is required' }); // Handle missing user_name
    }

    // Fetch user data by user_name
    connection.query(
        'SELECT * FROM user WHERE user_name = ?',
        [user_name],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching profile', error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Requested profile not found' });
            }

            const user = result[0];  // Extract the first user from the result
            delete user.password;
            user.is_friend = 0;      // Default: not a friend
            user.pending = 0;

            // Check if the user is a friend by querying the 'friend' table
            connection.query(
                `SELECT * FROM friend 
                 WHERE (user_id1 = ? AND user_id2 = ?) 
                    OR (user_id1 = ? AND user_id2 = ?)`,

                [user_id, user.user_id, user.user_id, user_id],
                (err, friendResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error checking friendship', error: err.message });
                    }

                    user.post_count = 0;
                    user.friend_count = 0;

                    // Get post and friend counts (do this irrespective of friendship)
                    connection.query(
                        'SELECT COUNT(*) AS post_count FROM post WHERE user_id = ?; SELECT COUNT(*) AS friend_count FROM friend WHERE user_id1 = ? OR user_id2 = ?',
                        [user.user_id, user.user_id, user.user_id],
                        (err, countResult) => {
                            if (err) {
                                return res.status(500).json({ message: 'Internal server error', error: err.message });
                            }

                            // Set post and friend counts from the result
                            user.post_count = countResult[0][0].post_count || 0;
                            user.friend_count = countResult[1][0].friend_count || 0;

                            // If there's no match in the friend table, return the user profile
                            if (friendResult.length === 0) {
                                return res.status(200).json(user);
                            }

                            // If a friendship exists, update the status
                            if (friendResult[0].status === 0) {
                                user.pending = 1;
                            }

                            if (friendResult[0].status === 1) {
                                user.is_friend = 1;
                            }

                            // Finally, return the complete user profile
                            return res.status(200).json(user);
                        }
                    );
                }
            );
        }
    );
};

const may_know = async (req, res)=>{
    const {user_id} = req.user;
    connection.query('SELECT * FROM user where not user_id = ? ORDER BY RAND() LIMIT 10;', [user_id], (err, result)=>{
        if(err)
            return res.status(500).json({message: 'Internal Server Error'});
        let users = result;
        if(users.length == 0)
            return res.status(400).json({message: 'No users found'});
        users = users.map(user=>{
            user = {user_id: user.user_id, user_name: user.user_name,  profile_picture: user.profile_picture}
            return user;
        })
        res.status(200).json(users);
    })
}
// Update user profile
const update_profile = (req, res) => {
    const { user_id } = req.user;
    const { profile } = req.body;

    if (!profile) {
        return res.status(400).json({ message: "Profile data is required" }); // Handle missing profile data
    }
    console.log(profile)
    // Using callback pattern with connection.query() for the update query
    connection.query(
        'UPDATE user SET user_name = ?, bio = ?, profile_picture = ?, cover_picture = ? WHERE user_id = ?',
        [profile.user_name, profile.bio, profile.profile_picture, profile.cover_picture, user_id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error while updating profile", error: err.message });
            }

            res.status(200).json({ message: "Profile updated successfully" });
        }
    );
};

// Delete user account
const delete_account = (req, res) => {
    const { user_id } = req.user;

    // Using callback pattern with connection.query() for the delete query
    connection.query(
        'DELETE FROM user WHERE user_id = ?',
        [user_id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error while deleting account", error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Account not found" });  // Handle case where account doesn't exist
            }

            res.status(200).json({ message: "Account deleted successfully" });
        }
    );
};

module.exports = { get_profile,may_know,  update_profile, delete_account };
