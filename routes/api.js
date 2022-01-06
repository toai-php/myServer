const express = require('express');
const router = express.Router();

const addPostApi = require('./api_list/add_post_api');
const getUserApi = require('./api_list/get_user_api');
const logoutApi = require('./api_list/logout_api');
const loginApi = require('./api_list/login_api');
const signupApi = require('./api_list/signup_api');
const getpostApi = require('./api_list/get_post');
const getListPost = require('./api_list/get_list_post');
const editPostApi = require('./api_list/edit_post');
const deletePostApi = require('./api_list/delete_post');
const reportPostApi = require('./api_list/report_post');
const setCommentApi = require('./api_list/set_comment');
const getCommentApi = require('./api_list/get_comment');
const editCommentApi = require('./api_list/edit_comment')
const likeApi = require('./api_list/like');
const deleteCommentApi = require('./api_list/delete_comment')
const getListChatApi = require('./api_list/get_list_chat')
const getConversationApi = require('./api_list/get_conversation')
const getListFriendsApi = require('./api_list/get_list_friend')
const getRequestFriendsApi = require('./api_list/get_request_friend')
const setRequestFriendApi = require('./api_list/set_request_friend')
const setAcceptFriendApi = require('./api_list/set_accept_friend')
const sendApi = require('./api_list/send_chat')
const getProfile = require('./api_list/get_profile')

router.use('/add_post', addPostApi);
router.use('/getuser', getUserApi);
router.use('/login', loginApi);
router.use('/signup', signupApi);
router.use('/logout', logoutApi);
router.use('/get_post', getpostApi);
router.use('/get_list_post', getListPost);
router.use('/edit_post', editPostApi);
router.use('/delete_post', deletePostApi);
router.use('/report_post', reportPostApi);
router.use('/set_comment', setCommentApi);
router.use('/get_comment', getCommentApi);
router.use('/edit_comment', editCommentApi);
router.use('/del_comment', deleteCommentApi);
router.use('/get_list_conversation', getListChatApi);
router.use('/get_conversation', getConversationApi);
router.use('/get_list_friends', getListFriendsApi);
router.use('/get_request_friend', getRequestFriendsApi);
router.use('/set_request_friend', setRequestFriendApi);
router.use('/set_accept_friend', setAcceptFriendApi);
router.use('/send', sendApi);
router.use('/like', likeApi);
router.use('/get_profile', getProfile);

module.exports = router;