const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;

const Like = sequelize.define(
    'likes',
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
        
        
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


module.exports = Like;