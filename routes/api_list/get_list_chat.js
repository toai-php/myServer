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
            const room = await Relationship.findAll(
                {
                    attributes: ['room'],
                    where: {
                        [Op.or]: [
                            {[Op.and]: [
                                { id1: user_id.id },
                                { status: {
                                    [Op.ne] : -1
                                } },
                              ]},
                              {[Op.and]: [
                                { id2: user_id.id },
                                { status: {[Op.ne] : -1 } },
                              ]},
                          ]
                    },
                    limit: req.body.count,
                offset: req.body.index,
                }
            );
            if(room) {
                var data = [];
                var numNewMessages = 0;
                for(let i = 0; i < room.length; i++) {
                    const c = await findChat(room[i].room, user_id.id);
                    if(c) {
                        data[i] = c;
                        if(c.lastmessage.unread == true) {
                            numNewMessages++;
                        }
                    }

                }
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
                    data: data,
                    numNewMessages: numNewMessages
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

async function findChat(chatId, userId) { 
    try {
        const chat = await Chat.findOne({
            attributes: ['id', 'id_from', 'id_to', 'message', 'time_created', 'seen', 'room_id'],
            where: {
                room_id: chatId
            },
            order: [['time_created', 'DESC']],
            limit: 1,
        });
        if(chat) {
            var partner = null;
            if(userId == chat.id_from) {
                partner = await User.findOne({
                    attributes: ['id', 'name', 'avtlink'],
                where: {
                    id: chat.id_to,
                    },
                });
            }
            else {
                partner = await User.findOne({
                    attributes: ['id', 'name', 'avtlink'],
                where: {
                    id: chat.id_from,
                    },
                });
            }
            if(partner == null) {return null;}
            var unread = 0;
            if(chat.seen == 0 && chat.id_to == userId) {
                unread = 1;
            }
            return {
                id: chatId,
                partner: {
                    id : partner.id,
                    username: partner.name,
                    avtlink: partner.avtlink
                },
                lastmessage: {
                    message: chat.message,
                    created: chat.time_created,
                    unread: unread,
                }
            }
        }
        else return null;
    } catch (error) {
        return null;
    }
}

module.exports = router;