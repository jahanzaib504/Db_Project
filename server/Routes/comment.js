const express = require('express')
const router = express.Router();
const { get_comments, add_comment, delete_comment} = require('../Controllers/commentController')
router.get('/:post_id', get_comments);
router.post('/:post_id', add_comment);
router.delete('/:comment_id', delete_comment);
module.exports = router