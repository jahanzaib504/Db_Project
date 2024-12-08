const express = require('express');
const router = express.Router();
const { 
    get_friends, 
    get_messages, 
    accept_request, 
    reject_request, 
    delete_message, 
    friend_request, 
    add_message, 
    get_pending_requests, 
    get_friend_requests, 
    remove_friend 
} = require('../Controllers/friendController');

// Friend management
router.get('/', get_friends);  // Get all friends
router.post('/remove-friend/:friend_id', remove_friend);  // Remove a friend

// Friend requests management
router.get('/all-friend/requests', get_friend_requests);  // Get all friend requests
router.get('/all-friend/pending', get_pending_requests);  // Get pending friend requests
router.post('/request/:user_id', friend_request);  // Send a friend request
router.post('/request/:user_id/accept', accept_request);  // Accept a friend request
router.post('/request/:user_id/reject', reject_request);  // Reject a friend request

// Messaging
router.get('/messages/:friend_id/:after_message_id', get_messages);  // Get messages after a specific ID
router.post('/message/:friend_id', add_message);  // Add a message
router.delete('/message/:message_id', delete_message);  // Delete a message

module.exports = router;
