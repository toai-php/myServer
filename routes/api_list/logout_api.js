const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

require('dotenv').config();


router.post('/', async (req, res) => {
    const token = req.body.token;
    try {
      const phone = req.body.phone;
      console.log(req.body);
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

  module.exports = router;