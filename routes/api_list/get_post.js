var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Media = require('../../model/Media');
const User = require('../../model/User');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = jwt.decode(token);
        if(verify) {
            const post_id = req.body.id;
            if(post_id) {
                const postExist = await Post.findOne({
                    attributes: ['id', 'owner_id', 'time_created', 'describe', 'like_count', 'cmt_count'],
                    where: {
                      id: post_id,
                    }
                  });
                if(postExist) {
                    const owner = await User.findOne({
                        attributes: ['id', 'phone', 'passwd', 'name', 'avtlink'],
                        where: {
                          id: postExist.owner_id
                        }
                      });
                    const media = await Media.findAll({
                        attributes: ['id', 'id_post', 'link', 'stt'],
                        where: {
                          id_post: post_id
                        }
                      });
                    var can_edit = (user_id.id == postExist.owner_id);

                    res.json({
                        code: '1000',
                        message: baseResponse['1000'],
                        data: {
                            'id' : post_id,
                            'described': postExist.describe ? postExist.describe : '',
                            'created': postExist.time_created,
                            'modified': postExist.time_created,
                            'like' : postExist.like_count ? postExist.like_count : 0,
                            'comment' : postExist.cmt_count ? postExist.cmt_count : 0,
                            'is_liked' : 0,
                            'media': media,
                            'author': owner,
                            'is_blocked': 0,
                            'can_edit': can_edit,
                            'can_comment': 0,
                        }
                      });
                } 
                else {
                    return res.json({
                        code: '9992',
                        message: baseResponse['9992'],
                        data: {}
                      });
                }
            }
            else {
                return res.json({
                    code: '1004',
                    message: baseResponse['1004'],
                    data: {}
                  });
            }
        }
        else {
            res.json({
                code: '9995',
                message: baseResponse['9995'],
                data: {}
              });
        }
    } catch (error) {
      res.json({
        code: '9995',
        message: baseResponse['9995'],
        data: {}
      });
    }
});

module.exports = router;