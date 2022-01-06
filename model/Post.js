const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;
const Op = require('../database/database').Op;
const Media = require('./Media');

const Post = sequelize.define(
    'posts',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        owner_id: {
            type: Sequelize.INTEGER,
        },
        time_created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        describe: {
            type: Sequelize.TEXT
        },
        like_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        cmt_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },
    {
        timestamps: false,
    }
);

Post.hasMany(Media, {foreignKey: 'id_post', sourceKey: 'id'});

module.exports = Post;