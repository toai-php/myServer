var express = require('express');
var router = express.Router();
const Op = require('../../database/database').Op;

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const User = require('../../model/User');
const Relationship = require('../../model/Relationship');
const Chat = require('../../model/Chat');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = jwt.decode(token);
        if(verify) {
           const listChat = await Chat.findAll({
            attributes: ['id', 'id_from', 'id_to', 'message', 'time_created', 'seen', 'room_id'],
            where: {
                room_id: req.body.id
            },
            order: [['time_created', 'DESC']],
            limit: req.body.count,
            offset: req.body.index,
           });
           if(listChat) {
             var data = [];
             for(let i = 0; i < listChat.length; i++) {
                 const sender = await User.findOne({
                    attributes: ['id', 'name', 'avtlink'],
                    where: {
                        id: listChat[i].id_from,
                        },
                 });
                 var conver = {
                     message_id: listChat[i].id,
                     message : listChat[i].message,
                     unread : listChat[i].seen,
                     created : listChat[i].time_created,
                     sender: {
                        id: sender.id,
                        username: sender.name,
                        avtlink: sender.avtlink
                     }
                 }
                 data[i] = conver;
                 await Chat.update({
                   seen: 1,
                 },{
                  where: {
                    id: listChat[i].id,
                    id_to: user_id.id,
                  }
                 });
             }
             return res.json({
                code: '1000',
                message: baseResponse['1000'],
                data: data,
                is_blocked: false
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