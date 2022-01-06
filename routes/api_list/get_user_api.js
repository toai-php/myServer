const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../../model/User');

router.get('/', async (req, res) => {
    if(req.headers.phone != null) {
      const userExist = await User.findOne({
        attributes: ['phone', 'name', 'avtlink', 'id'],
        where: {
          phone: req.headers.phone
        }
      });
    
      if(userExist) {
        res.json({
          code: '9996',
          message: 'user is existed',
          data: userExist,
        });
      } else {
        res.json({
          code: '1000',
          message: 'can sign up',
          data: {},
        });
      }
    }
    else if(req.headers.token != null) {
      const token = req.headers.token;
      const user_id = jwt.decode(token);
      const userExist = await User.findOne({
        attributes: ['phone', 'name', 'avtlink', 'id'],
        where: {
          id: user_id.id
        }
      });
      if(userExist) {
        res.json({
          code: '1000',
          message: 'OK',
          data: userExist,
        });
      } else {
        res.json({
          code: '9998',
          message: 'Token is invalid',
          data: {},
        });
      }
    }
    
  });

module.exports = router;