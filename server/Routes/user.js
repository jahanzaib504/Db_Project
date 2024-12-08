const express = require('express')
const router = express.Router();

const {get_profile, update_profile, delete_account, may_know} = require('../Controllers/userController');
router.get('/me', (req, res)=>{
    res.redirect(`/user/${req.user.user_name}`)
});
router.get('/may-know', may_know);
router.get('/:user_name', get_profile);
router.put('/', update_profile);
router.delete('/', delete_account);
module.exports = router