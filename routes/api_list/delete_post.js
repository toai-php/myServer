var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Media = require('../../model/Media');
const Comment = require('../../model/Comment');
const Like = require('../../model/Like');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            await Media.destroy({
                where: {
                  id_post: req.body.id
                }
              });

            await Like.destroy({
              where: {
                id_post: req.body.id
              }
            });
            await Comment.destroy({
              where: {
                id_post: req.body.id
              }
            });

            await Post.destroy({
                where: {
                    id : req.body.id
                }
            });
            return res.json({
                code: '1000',
                message: baseResponse['1000'],
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