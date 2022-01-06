var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Like = require('../../model/Like');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            const post = await Post.findOne({
                attributes: ['owner_id'],
            where: {
                id : req.body.id
            }
            });
            if(post == null) {
                return res.json({
                    code: '9992',
                    message: baseResponse['9992'],
                });
            }
            const user_id = jwt.decode(token);
            const like_exists = await Like.findOne({
                attributes: ['id'],
            where: {
                id_post : req.body.id,
                id_owner : user_id.id,
            }
            });
            if(like_exists) {
                await Like.destroy({
                    where: {
                      id: like_exists.id,
                    }
                  });
            }
            else {
                await Like.create({
                    id_post : req.body.id,
                    id_owner: user_id.id,
            }, {
              fields: ['id_post','id_owner',]
                });
            }
            num_like = await Like.count({
                where: {
                    id_post : req.body.id
                }
            });

            await Post.update({ like_count: num_like }, {
                where: {
                    id : req.body.id
                }
              });
            return res.json({
                code: '1000',
                message: baseResponse['1000'],
                data: {
                    like: num_like
                }
            });
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