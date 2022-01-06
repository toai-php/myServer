var express = require('express');
var router = express.Router();
const Op = require('../../database/database').Op;

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');
const User = require('../../model/User');
const Relationship = require('../../model/Relationship');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = jwt.decode(token);
        if(verify) {
            var id = req.body.user_id ? req.body.user_id : user_id.id;
            const friends = await Relationship.findAll(
                {
                    attributes: ['id1', 'id2', 'created'],
                    where: {
                        id2:id,
                        status: 2
                    },
                    limit: req.body.count,
                offset: req.body.index,
                }
            );
            if(friends) {
                var data = [];
                for(let i = 0; i < friends.length; i++) {
                    var id_fr = friends[i].id1 == id ? friends[i].id2 : friends[i].id1;
                    const fr = await User.findOne({
                        attributes: ['id', 'name', 'avtlink'],
                where: {
                    id: id_fr,
                    },
                    });
                    if(fr) { 
                        data.push({
                            id: fr.id,
                            name: fr.name,
                            avtlink: fr.avtlink,
                            created: friends[i].created
                        });
                    }
                }
                return res.json({
                    code: '1000',
                    message: baseResponse['1000'],
                    data: data,
                });
            }
            return res.json({
                code: '9994',
                message: baseResponse['9994'],
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