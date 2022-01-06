var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Chat = require('../../model/Chat');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            await Chat.create({
                id_from: req.body.id_from,
                id_to: req.body.id_to,
                message: req.body.message,
                seen: req.body.seen,
                room_id: req.body.room_id
            }, {
                fields: ['id_from', 'id_to', 'message', 'seen', 'room_id', 'time_created'],
            });
            return res.json({
                code: '1000',
                message: baseResponse['1000'],
                data: {}
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