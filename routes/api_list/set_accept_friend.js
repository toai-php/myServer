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
            if(user_id.id == req.body.user_id) {
                return res.json({
                    code: '9999',
                    message: baseResponse['9999'],
                    
                  });
            }
            const room = await Relationship.findOne(
                {
                    attributes: ['id1', 'id2'],
                    where: {
                        id1:req.body.user_id,
                        id2:user_id.id,
                        status:2,
                    },
                }
            );
            if(room) {
                await Relationship.update({
                    status: req.body.is_accept
                }, {
                    where: {
                        id1 : room.id1,
                        id2: room.id2
                    }
                });
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
                    
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