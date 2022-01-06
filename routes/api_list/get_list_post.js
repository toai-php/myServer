var express = require('express');
var router = express.Router();
const Op = require('../../database/database').Op;

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Media = require('../../model/Media');
const User = require('../../model/User');
const Like = require('../../model/Like');
const Relation = require('../../model/Relationship');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const last_id = req.body.last_id;
        const index = req.body.index;
        const count = req.body.count;
        if(verify) {
            const listPost = await Post.findAll({
                attributes: ['id'], 
                where: {
                    id: { [Op.gte] : last_id }, 
                },
                limit: count,
                offset: index,
            });
            if(listPost) {
                if(listPost.length <= 0) {
                    return res.json({
                        code: '9994',
                        message: baseResponse['9994'],
                        data: {
                        },
                        
                      });
                }
                var posts = [];
                for(let i = 0; i < listPost.length; i++) {
                    const p = await getPost(token, listPost[i]['id']);
                    if(p) {
                        posts[i] = p;
                    }
                }
                const l_id = listPost[listPost.length-1]['id'];
                const new_items = (l_id > last_id) ? l_id-last_id : 0;
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
                    data: {
                        posts,
                    },
                    'new_items' : new_items,
                    'last_id': l_id,
                    'in_campaign' : 0,
                    'campaign_id' : 0,
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
            res.json({
                code: '9995',
                message: baseResponse['9995'],
                data: {}
              });
        }
    } catch (error) {
        
    }
});

async function getPost(t, id) {
    try {
        const token = t;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = jwt.decode(token);
        if(verify) {
            const post_id = id;
            if(post_id) {
                const postExist = await Post.findOne({
                    attributes: ['id', 'owner_id', 'time_created', 'describe', 'like_count', 'cmt_count'],
                    where: {
                      id: post_id,
                    }
                  });
                if(postExist) {
                    const owner = await User.findOne({
                        attributes: ['id', 'name', 'avtlink'],
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

                    const id_like = await Like.findOne({
                        attributes: ['id'],
                        where: {
                          id_post: post_id,
                          id_owner : user_id.id
                        }
                    });

                    const is_liked = (id_like != null) ? true : false;

                    const stt = await Relation.findOne({
                        attributes: ['status'],
                    where: {
                        [Op.or]: [
                            {[Op.and]: [
                                { id1: user_id.id },
                                { id2: owner.id },
                              ]},
                              {[Op.and]: [
                                { id2: user_id.id },
                                { id1: owner.id },
                              ]},
                          ]
                    }
                    });
                    var is_blocked = false;
                    if(stt) {
                        if(stt.status == -1) is_blocked = true;
                    }

                    return {
                        'id' : post_id,
                        'described': postExist.describe ? postExist.describe : '',
                        'created': postExist.time_created,
                        'modified': postExist.time_created,
                        'like' : postExist.like_count ? postExist.like_count : 0,
                        'comment' : postExist.cmt_count ? postExist.cmt_count : 0,
                        'is_liked' : is_liked,
                        'media': media,
                        'author': owner,
                        'is_blocked': is_blocked,
                        'can_edit': can_edit,
                        'can_comment': true,
                    };
                } 
                else {
                    return {
                        code: '9992',
                        message: baseResponse['9992'],
                        data: {}
                      };
                }
            }
            else {
                return {
                    code: '1004',
                    message: baseResponse['1004'],
                    data: {}
                  };
            }
        }
        else {
            return {
                code: '9995',
                message: baseResponse['9995'],
                data: {}
              };
        }
    } catch (error) {
        return {
            code: '9999',
            message: baseResponse['9999'] + error.message,
            data: {}
          };
    }
}

module.exports = router;