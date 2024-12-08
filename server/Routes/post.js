const express = require('express')
const router = express.Router();
const { delete_post, get_post, get_posts_user, get_feed, add_post, like_post } = require('../Controllers/postController');
router.delete('/:post_id', delete_post);
router.get('/feed/:before_post_id', get_feed);
router.get('/user/:user_id', get_posts_user);
router.get('/:post_id', get_post);
router.post('/', add_post);
router.post('/:post_id/like/:flag', like_post);
module.exports = router
