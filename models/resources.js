module.exports = function(sequelize, DataTypes) {
    const Resources = sequelize.define("resources", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        food: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hearts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        babies: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        babies_active: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        babies_available: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        babies_hunger: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        babies_level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        worms: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fish: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sharks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dirt: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rocks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        steel: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        houses: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        thrusters: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        feul: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shuttle_bodies: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shuttle_computers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
            references: {
                model: "users",
                key: "id"
            }
        }
    });
    return Resources;
};