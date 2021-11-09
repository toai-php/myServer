var express = require('express');
var router = express.Router();

const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../module/verify_token');

require('dotenv').config();

router.post('/signup', async (req, res) => {
  
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
      }, {
      fields: ['phone', 'passwd']
      }
    ); 

    if(newUser){
      res.json({
        code: '1000',
        message: 'OK',
        data: 'data'
      });
    }
  } catch (error) {
    res.json({
      code: '9999',
      message: 'sign up failed: ' + error
    });
  }
});

router.post('/login', async (req, res) => {
  const userExist = await User.findOne({
    attributes: ['phone', 'passwd', 'name', 'avtlink', 'id'],
    where: {
      phone: req.body.phone
    }
  });
  if(!userExist){
    return res.json({
      code: '9995',
      message: 'user is not validated',
      data: req.body.phone
    });
  }

  try {
    const validPass = await bcrypt.compare(req.body.passwd, userExist.passwd);
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

router.post('/logout', async (req, res) => {
  const token = req.body.token;
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if(verified){
      res.json({
        code: '1000',
        message: 'OK'
      });
    }
    else {
      res.json({
        code: '9999',
        message: 'exeption error: token is not verified'
      });
    }
  } catch (error) {
    res.json({
      code: '9999',
      message: 'exeption error: ' + error
    });
  }
});

router.get('/getuser', async (req, res) => {
  if(req.headers.phone == null) {
    return res.json({
      code: '9999',
      message: 'missing phone query'
    });
  }

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
});

module.exports = router;
