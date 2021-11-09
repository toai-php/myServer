const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'postgres',
    'postgres',
    '123456',
    {
        dialect: 'postgres',
        host: 'localhost',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        }
    }
);

const Op = Sequelize.Op;
module.exports = {
    sequelize,
    Op
}