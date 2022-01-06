const Sequelize = require('sequelize');
const sequelize = require('../database/database').sequelize;
const User = require('./User');

const Relation = sequelize.define(
    'relationship',
    {
        id1: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id2: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        status: {
            type: Sequelize.INTEGER
        },
        room: {
            type: Sequelize.INTEGER
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

User.hasMany(Relation, {foreignKey: 'id1', sourceKey: 'id'});
User.hasMany(Relation, {foreignKey: 'id2', sourceKey: 'id'});

module.exports = Relation;