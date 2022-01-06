const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;
const Post = require('./Post');

const User = sequelize.define(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        passwd: {
            type: Sequelize.STRING
        },
        avtlink: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
    }
);

User.hasMany(Post, {foreignKey: 'owner_id', sourceKey: 'id'});

module.exports = User;