const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;

const Comment = sequelize.define(
    'comment',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        id_post: {
            type: Sequelize.INTEGER,
        },
        id_owner: {
            type: Sequelize.INTEGER,
        },
        describe: {
            type: Sequelize.TEXT
        },
        time_created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


module.exports = Comment;