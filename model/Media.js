const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;

const Media = sequelize.define(
    'media',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        id_post: {
            type: Sequelize.INTEGER,
        },
        link: {
            type: Sequelize.STRING,
        },
        stt: {
            type: Sequelize.INTEGER
        }
        
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Media;