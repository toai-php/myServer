const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;
const User = require('./User');

const Chat = sequelize.define(
    'chat',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_from: {
            type: Sequelize.INTEGER,
        },
        id_to: {
            type: Sequelize.INTEGER,
        },
        message: {
            type: Sequelize.TEXT
        },
        time_created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        seen: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        room_id: {
            type: Sequelize.INTEGER,
            
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

User.hasMany(Chat, {foreignKey: 'id_from', sourceKey: 'id'});
User.hasMany(Chat, {foreignKey: 'id_to', sourceKey: 'id'});

module.exports = Chat;