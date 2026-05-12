const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    'chatApp',
    'root',
    'root', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

module.exports = sequelize;