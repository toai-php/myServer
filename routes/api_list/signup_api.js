var express = require('express');
var router = express.Router();

const User = require('../../model/User');
const bcrypt = require('bcryptjs');

require('dotenv').config();

router.post('/', async (req, res) => {
  
    const userExist = await User.findOne({
      attributes: ['phone'],
      where: {
        phone: req.body.phone
      }
    });
    if(userExist){
      return res.json({
        code: '9996',
        message: 'user existed',
        data: userExist
      });
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.passwd, salt);
  
      let newUser = await User.create({
        phone: req.body.phone,
        passwd: hashPassword,
        name: req.body.name ?? "User",
        }, {
        fields: ['phone', 'passwd', 'name']
        }
      ); 
  
      if(newUser){
        res.json({
          code: '1000',
          message: 'OK',
          data: newUser
        });
      }
    } catch (error) {
      res.json({
        code: '9999',
        message: 'sign up failed: ' + error
      });
    }
  });

  module.exports = router;