const { DataTypes } = require('sequelize');
const sequelize = require('sequelize');
const db = new sequelize.Sequelize({
    dialect: 'sqlite',
    storage: process.cwd() + "/storage/db.sqlite"
});

class Suggestion extends sequelize.Model {}
class BugReport extends sequelize.Model {}
class Sanction extends sequelize.Model {}
class Ticket extends sequelize.Model {}

Suggestion.init({
    suggestion: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize.DataTypes.BOOLEAN,
        allowNull: true
    },
    author: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    msg: {
        type: sequelize.DataTypes.STRING,
	allowNull: false
    },
    response: {
        type: sequelize.DataTypes.STRING
    }
}, {
    sequelize: db
});

BugReport.init({
    description: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize.DataTypes.BOOLEAN,
        allowNull: true
    },
    author: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    msg: {
        type: sequelize.DataTypes.STRING
    },
    response: {
        type: sequelize.DataTypes.STRING
    }
}, {
    sequelize: db
});

Sanction.init({
    type: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    mod: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    user: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    reason: {
        type: sequelize.DataTypes.STRING,
    },
    revoked: {
        type: sequelize.DataTypes.BOOLEAN,
        allowNull: false
    },
    expire: {
        type: sequelize.DataTypes.INTEGER,
    },
    guild: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db
});

Ticket.init({
    id: {
        primaryKey: true,
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    user: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    closed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tier: {
        type: DataTypes.INTEGER,
        allowNull: null
    }
}, {
    sequelize: db
})

db.sync({
    alter: true
});

module.exports.db = db;
module.exports.models = {
    Suggestion,
    BugReport,
    Sanction,
    Ticket,
}
