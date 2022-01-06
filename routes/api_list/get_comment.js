var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Comment = require('../../model/Comment');
const User = require('../../model/User');
const Relation = require('../../model/Relationship');
const Post = require('../../model/Post');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            const user_id = jwt.decode(token).id;
            const listComments = await Comment.findAll({
                attributes: ['id', 'id_post', 'id_owner', 'describe', 'time_created'], 
                where: {
                    id_post: req.body.id, 
                },
                order: [['time_created', 'DESC']],
                limit: req.body.count,
                offset: req.body.index,
            });
            if(listComments) {
                var data = [];
                const post_owner = await Post.findOne({
                    attributes: ['owner_id'],
                where: {
                    id : req.body.id
                }
                });
                const stt = await Relation.findOne({
                    attributes: ['status'],
                where: {
                    [Op.or]: [
                        {[Op.and]: [
                            { id1: user_id },
                            { id2: post_owner.owner_id },
                          ]},
                          {[Op.and]: [
                            { id2: user_id },
                            { id1: post_owner.owner_id },
                          ]},
                      ]
                }
                });
                var is_blocked = false;
                if(stt) {
                    if(stt.status == -1) is_blocked = true;
                }
                for(let i = 0; i < listComments.length; i++) {
                    
                    const owner = await User.findOne({
                        attributes: ['id', 'name', 'avtlink'],
                        where: {
                          id: listComments[i].id_owner
                        }
                      });
                    const cmti = {
                        id : listComments[i].id,
                        comment : listComments[i].describe,
                        created  : listComments[i].time_created,
                        poster : owner,
                    };
                    data[i] = cmti;
                }
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
                    data: data,
                    is_blocked: is_blocked
                });
            }
            else {
                return res.json({
                    code: '9994',
                    message: baseResponse['9994'],
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
        code: '9999',
        message: baseResponse['9999'] + error,
        data: {}
      });
    }
});

module.exports = router;