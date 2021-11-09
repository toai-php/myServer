const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;
const Op = require('../database/database').Op;

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

module.exports = User;