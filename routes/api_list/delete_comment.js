var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Comment = require('../../model/Comment');
const Post = require('../../model/Post');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            await Comment.destroy({
                where: {
                  id_post: req.body.id,
                  id: req.body.id_com
                }
              });

              num_cmt = await Comment.count({
                where: {
                    id_post : req.body.id
                }
            });

            await Post.update({ cmt_count: num_cmt }, {
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