const express = require('express')
const router = express.Router();
const {add_reply, delete_reply} = require('../Controllers/replyController');
router.post('/:comment_id', add_reply);
router.delete('/:reply_id', delete_reply);
module.exports = router