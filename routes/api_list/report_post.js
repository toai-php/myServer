var express = require('express');
var router = express.Router();
const https = require('https');

const jwt = require('jsonwebtoken');
const baseResponse = require('../api_list/sv_response');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const token = req.headers.token;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verify) {
            const data = new TextEncoder().encode(
                JSON.stringify({
                  id: req.body.id,
                  subject: req.body.subject,
                  detail: req.body.detail,
                })
              )
              
              const options = {
                hostname: 'formspree.io',
                port: 443,
                path: '/f/xdobkgpd',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
              }
              
              const reqq = https.request(options, ress => {
                console.log(`statusCode: ${ress.statusCode}`)
              
                ress.on('data', d => {
                  process.stdout.write(d)
                })
              })
              
              reqq.on('error', error => {
                console.error(error)
              })
              
              reqq.write(data)
              reqq.end()

              return res.json({
                code: '1000',
                message: baseResponse['1000'],
              });
        }
        else {
            res.json({
                code: '9995',
                message: baseResponse['9995'],
              });
        }
    } catch (error) {
      res.json({
        code: '9999',
        message: baseResponse['9999'],
      });
    }
});

module.exports = router;