var express = require('express');
var router = express.Router();
const Op = require('../../database/database').Op;
const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const uuidv4 = require('uuidv4');
const baseResponse = require('../api_list/sv_response');
const Post = require('../../model/Post');
const Media = require('../../model/Media');
const User = require('../../model/User');
const Like = require('../../model/Like');
const Relation = require('../../model/Relationship');

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
  
  router.use("/posts", express.static("upload"));
  
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
        
            if(req.body.describe) {
                await Post.update({ describe: req.body.describe }, {
                    where: {
                      id: req.body.id
                    }
                  });
            }
        const image_del = req.body.image_del;
        const list_image_del = (image_del) ? image_del.split("-") : null;
        if(list_image_del) {
            for(let i = 0; i < list_image_del.length; i++) {
                await Media.destroy({ 
                    where: {
                        id_post: req.body.id,
                        stt: list_image_del[i],
                    }
                });
            }
        }
        if(req.files) {
            if(req.files.video) {
                for(let video of req.files.video) {
                  await Media.create({
                    id_post: req.body.id, 
                    link: "/vid/"+video.filename,
                    stt: -1,
                  }, {
                    fields: ['id_post', 'link', 'stt']
                  });
                }
              }
            else if(req.files.images) {
                let i = req.body.image_sort;
                for(let image of req.files.images) {
                  await Media.create({
                    id_post: req.body.id, 
                    link: "/img/"+image.filename,
                    stt: i,
                  }, {
                    fields: ['id_post', 'link', 'stt']
                  });
                  i++;
                }
              }
        }
        await Post.update({ modified: Sequelize.NOW }, {
          where: {
            id: req.body.id
          }
        });
        const dt = await getPost(token, req.body.id);
        return  res.json({
            code: '1000',
            message: baseResponse['1000'],
            data: dt,
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
        message: 'exeption error: ' + error,
      });
    }
    
  })

  async function getPost(t, id) {
    try {
        const token = t;
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = jwt.decode(token);
        if(verify) {
            const post_id = id;
            if(post_id) {
                const postExist = await Post.findOne({
                    attributes: ['id', 'owner_id', 'time_created', 'describe', 'like_count', 'cmt_count'],
                    where: {
                      id: post_id,
                    }
                  });
                if(postExist) {
                    const owner = await User.findOne({
                        attributes: ['id', 'name', 'avtlink'],
                        where: {
                          id: postExist.owner_id
                        }
                      });
                    const media = await Media.findAll({
                        attributes: ['id', 'id_post', 'link', 'stt'],
                        where: {
                          id_post: post_id
                        }
                      });
                    var can_edit = (user_id.id == postExist.owner_id);

                    const id_like = await Like.findOne({
                        attributes: ['id'],
                        where: {
                          id_post: post_id,
                          id_owner : user_id.id
                        }
                    });

                    const is_liked = (id_like != null) ? true : false;

                    const stt = await Relation.findOne({
                        attributes: ['status'],
                    where: {
                        [Op.or]: [
                            {[Op.and]: [
                                { id1: user_id.id },
                                { id2: owner.id },
                              ]},
                              {[Op.and]: [
                                { id2: user_id.id },
                                { id1: owner.id },
                              ]},
                          ]
                    }
                    });
                    var is_blocked = false;
                    if(stt) {
                        if(stt.status == -1) is_blocked = true;
                    }

                    return {
                        'id' : post_id,
                        'described': postExist.describe ? postExist.describe : '',
                        'created': postExist.time_created,
                        'modified': postExist.time_created,
                        'like' : postExist.like_count ? postExist.like_count : 0,
                        'comment' : postExist.cmt_count ? postExist.cmt_count : 0,
                        'is_liked' : is_liked,
                        'media': media,
                        'author': owner,
                        'is_blocked': is_blocked,
                        'can_edit': can_edit,
                        'can_comment': true,
                    };
                } 
                else {
                    return {
                        code: '9992',
                        message: baseResponse['9992'],
                        data: {}
                      };
                }
            }
            else {
                return {
                    code: '1004',
                    message: baseResponse['1004'],
                    data: {}
                  };
            }
        }
        else {
            return {
                code: '9995',
                message: baseResponse['9995'],
                data: {}
              };
        }
    } catch (error) {
        return {
            code: '9999',
            message: baseResponse['9999'] + error.message,
            data: {}
          };
    }
}

module.exports = router;