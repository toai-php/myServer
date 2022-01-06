var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const uuidv4 = require('uuidv4');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Media = require('../../model/Media');

require('dotenv').config();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { // setting destination of uploading files        
      if (file.fieldname === "images") { // if uploading resume
        cb(null, './upload/images');
      } else { // else uploading image
        cb(null, './upload/videos');
      }
    },
    filename: (req, file, cb) => { // naming file
      cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    try {
      const token = req.headers.token;
      const verify = jwt.verify(token, process.env.TOKEN_SECRET);
      if(!verify) {
        req.notVerified = true;
        return cb(null, false);
      }
    } catch (error) {
      req.notVerified = true;
      return cb(null, false);
    }
    if (file.fieldname === "video") { // if uploading resume
      if (
        file.mimetype.includes("video")
      ) { // check file type to be pdf, doc, or docx
        cb(null, true);
      } else {
        req.videoValidationError = true;
        cb(null, false); // else fails
      }
    } else { // else uploading image
      if (
        file.mimetype.includes("image")
      ) { // check file type to be png, jpeg, or jpg
        cb(null, true);
      } else {
        req.imageValidationError = true;
        cb(null, false); // else fails
      }
    }
  };
  
  const upload = multer({
    storage: fileStorage,
    limits: {
      filesize:'25mb'
    },
    fileFilter: fileFilter,
  })
  
  router.use("/posts", express.static("upload"))
  
  router.post("/", upload.fields([
    {
      name: 'images',
      maxCount: 12
    },
    {
      name: 'video',
      maxCount: 1
    }
  ]), async (req, res) => {
    
    try {
      const token = req.headers.token;
      const verify = jwt.verify(token, process.env.TOKEN_SECRET);
      const user_id = jwt.decode(token);
      if(verify) {
        if(req.body.describe == null && req.files == null) {
          return res.json({
            code: '9999',
            message: 'exeption error: no data for post',
            data : {}
          });
        }

        let newPost = await Post.create({
          owner_id: user_id.id,
          describe: req.body.describe,
        }, {
          fields: ['owner_id', 'describe', 'time_created']
        });

        if(newPost) {

          if(req.files) {
            if(req.files.images) {
              let i = 0;
              for(let image of req.files.images) {
                await Media.create({
                  id_post: newPost.id, 
                  link: "/img/"+image.filename,
                  stt: i,
                }, {
                  fields: ['id_post', 'link', 'stt']
                });
                i++;
              }
            }
            else if(req.files.video) {
              let i = 0;
              for(let video of req.files.video) {
                await Media.create({
                  id_post: newPost.id, 
                  link: "/vid/"+video.filename,
                  stt: -1,
                }, {
                  fields: ['id_post', 'link', 'stt']
                });
                i++;
              }
            }
          }

          res.json({
            code: '1000',
          message: 'OK',
          data: newPost.id
          });
        }
        else {
          res.json({
            code: '9999',
            message: 'exeption error: can not create post ',
            data : {}
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
        message: 'exeption error: ' + error,
        data : {}
      });
    }
    
  })

module.exports = router;