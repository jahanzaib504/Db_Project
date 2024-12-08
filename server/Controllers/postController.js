const connection = require('../db');

// Delete Post API
const delete_post = (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.user;
    
    // Attempt to delete the post and its attachments in a single query
    connection.query(
        'DELETE FROM post WHERE user_id = ? AND post_id = ?',
        [user_id, post_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error deleting post", error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Post not found or you do not have permission to delete this post" });
            }

            // Since cascading delete is enabled, attachments will be automatically deleted
            res.status(200).json({ message: "Post and its attachments deleted successfully" });
        }
    );
};


// Get Single Post API
const get_post = (req, res) => {
    const { post_id } = req.params;

    connection.query('SELECT * FROM post_view WHERE post_id = ?', [post_id], (err, post) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching post", error: err.message });
        }

        if (!post || post.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Fetch additional data for the post
        fetchOther(connection, post[0], req.user,(err, postWithAdditionalData) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching additional post data", error: err.message });
            }

            res.status(200).json(postWithAdditionalData);
        });
    });
};

// Get Posts by User API
const get_posts_user = (req, res) => {
    const { user_id } = req.params;
    connection.query('SELECT * FROM post_view WHERE user_id = ?', [user_id], (err, posts) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching posts", error: err.message });
        }
        console.log(posts);
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        // Fetch additional data for each post
        const postsWithAdditionalData = [];

        let completedRequests = 0;

        posts.forEach((post, index) => {
            fetchOther(connection, post, req.user,(err, postWithData) => {
                if (err) {
                    return res.status(500).json({ message: "Error fetching additional post data", error: err.message });
                }

                postsWithAdditionalData[index] = postWithData;
                completedRequests++;

                if (completedRequests === posts.length) {
                    res.status(200).json(postsWithAdditionalData);
                }
            });
        });
    });
};

// Get Feed API
const get_feed = (req, res) => {
    const { user_id } = req.user;

    // Ensure before_post_id is provided

    const query = `
        SELECT distinct p.* 
        FROM post_view p
        JOIN friend f 
            ON (p.user_id = f.user_id1 AND f.user_id2 = ?) 
            OR (p.user_id = f.user_id2 AND f.user_id1 = ?)
        ORDER BY p.post_id DESC 
    `;

    // Adjust the query to include before_post_id
    connection.query(query, [user_id, user_id], (err, posts) => {
        console.log(posts);
        if (err) {
            return res.status(500).json({ message: "Error fetching posts", error: err.message });
        }

        // If no posts are found, return a 404
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        // Initialize array to store posts with additional data
        const postsWithAdditionalData = [];
        let completedRequests = 0;
        console.log(posts[0])
        // Fetch additional data for each post asynchronously
        posts.forEach((post, index) => {
            fetchOther(connection, post, req.user,(err, postWithData) => {
                if (err) {
                    // If an error occurs, return a 500 and stop further processing
                    return res.status(500).json({ message: "Error fetching additional post data", error: err.message });
                }

                // Store the post with additional data
                postsWithAdditionalData[index] = postWithData;
                completedRequests++;

                // Once all posts are processed, send the response
                if (completedRequests === posts.length) {
                    res.status(200).json(postsWithAdditionalData);
                }
                console.log(postsWithAdditionalData)
            });
        });
    });
};


// Add Post API
const add_post = (req, res) => {
    const { post } = req.body;
    const { user_id } = req.user;

    const query = 'INSERT INTO post(user_id, caption, content) VALUES(?, ?, ?)';
    const params = [user_id, post.caption, post.content];

    connection.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error adding post", error: err.message });
        }

        // Insert attachments (images/videos) if any
        insert_attachments(post.images, result.insertId, 0, () => {
            insert_attachments(post.videos, result.insertId, 1, () => {
                res.status(201).json({ message: "Post added successfully", postId: result.insertId });
            });
        });
    });
};

// Like Post API
const like_post = (req, res) => {
    const { post_id, flag } = req.params;
    const { user_id } = req.user;
    
    let query, params;
    console.log(flag,' ', post_id)
    // Check if the flag is for liking or unliking
    if (flag == 1) {
        // Insert like into the database (for liking a post)
        query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
        params = [post_id, user_id];
    } else if (flag == 0) {
        // Delete like from the database (for unliking a post)
        query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
        params = [post_id, user_id];
    } else {
        return res.status(400).json({ message: "Invalid flag value. Must be 1 for like or 0 for unlike." });
    }

    // Execute the query
    connection.query(query, params, (err, result) => {
        if (err) {
            // Handle different error cases
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "You have already liked this post" });
            }
            return res.status(500).json({ message: "Error processing like request", error: err.message });
        }

        // If the flag is 1 (liking), the insertion would be successful
        if (flag == 1) {
            return res.status(201).json({ message: "Post liked successfully" });
        }

        // If the flag is 0 (unliking), check if any row was deleted
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            return res.status(404).json({ message: "Like not found for this user on this post" });
        }
    });
};


// Helper function to insert attachments
function insert_attachments(attachments, post_id, file_type, callback) {
    if (attachments && attachments.length > 0) {
        const insertPromises = attachments.map(attachment =>
            connection.query('INSERT INTO attachments(post_id, url, file_type) VALUES(?, ?, ?)', [post_id, attachment, file_type])
        );

        // Wait for all insertions to complete
        let completedInserts = 0;
        insertPromises.forEach((query, index) => {
            query((err) => {
                if (err) {
                    return callback(err);
                }
                completedInserts++;
                if (completedInserts === insertPromises.length) {
                    callback();
                }
            });
        });
    } else {
        callback();
    }
}

// Helper function to fetch additional data for posts
function fetchOther(connection, post, user,callback) {
    const query = `
        SELECT * FROM attachments WHERE post_id = ?;
        SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?;
        SELECT COUNT(*) AS comment_count FROM comment WHERE post_id = ?;
        SELECT user_id FROM likes WHERE post_id = ? AND user_id = ?;
    `;

    post.images = [];
    post.videos = [];

    connection.query(query, [post.post_id, post.post_id, post.post_id, post.post_id, user.user_id], (err, data) => {
        if (err) {
            return callback(err);
        }

        data[0].forEach(attachment => {
            
            if (attachment.file_type === 0) post.images.push(attachment.url);
            else post.videos.push(attachment.url);
        });

        post.like_count = data[1][0].like_count || 0;
        post.comment_count= data[2][0].comment_count || 0;
        post.liked_by_user = data[3].length > 0;

        callback(null, post);
    });
}

module.exports = { delete_post, get_post, get_posts_user, get_feed, add_post, like_post };
