var express = require('express');
var router = express.Router();
const Op = require('../../database/database').Op;
const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const Relationship = require('../../model/Relationship');

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
                    attributes: ['id1', 'id2', 'status'],
                    where: {
                        [Op.or]: [
                            {[Op.and]: [
                                { id1: user_id.id },
                                { id2: req.body.user_id },
                              ]},
                              {[Op.and]: [
                                { id2: user_id.id },
                                { id1: req.body.user_id },
                              ]},
                          ]
                    },
                }
            );
            if(room) {
                if(room.status == 0) {
                    await Relationship.update({
                        id1: user_id.id,
                        id2:req.body.user_id,
                        status: 2,
                        created: Sequelize.fn('NOW'),
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
                return res.json({
                    code: '9999',
                    message: baseResponse['9999'],
                    
                  });
            }
            else {
                await Relationship.create({
                    id1: user_id.id,
                    id2: req.body.user_id,
                    status: 2,

                }, {
                    fields: ['id1', 'id2', 'status', 'created']
                });
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
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