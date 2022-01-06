var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Comment = require('../../model/Comment');

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
            await Comment.update({ describe: req.body.comment }, {
                where: {
                  id: req.body.id_com
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