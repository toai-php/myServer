var express = require('express');
var router = express.Router();

const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const phone = req.body.phone;
    const password = req.body.passwd;
    const userExist = await User.findOne({
      attributes: ['phone', 'passwd', 'name', 'avtlink', 'id'],
      where: {
        phone: phone
      }
    });
    if(!userExist){
      return res.json({
        code: '9996',
        message: 'user is existed',
        data: phone
      });
    }
  
      const validPass = await bcrypt.compare(password, userExist.passwd);
      if(!validPass){
        return res.json({
          code: '9993',
          message: 'invalid password',
          data: {}
        });
      }
      const token = jwt.sign({id: userExist.id}, process.env.TOKEN_SECRET);
      res.json({
          code: '1000',
          message: 'OK',
          data: {
            id: userExist.id,
            username: userExist.name,
            token: token,
            avatar: userExist.avtlink,
            active: (userExist.name) ? 1 : -1
          }
      });
  
      
    } catch (error) {
      res.json({
        code: '9999',
        message: 'sign up failed: ' + error
      });
    }
  
  });

  module.exports = router;