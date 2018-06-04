module.exports = function(sequelize, DataTypes) {
    const Statistics = sequelize.define("statistics", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        experience: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        prestige: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        stage: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        food_proficiency: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        gather_proficiency: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        attack_proficiency: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        defense_proficiency: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        food_frenzy: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        ink_spray: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rank_up: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dirt_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rock_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        steel_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        worm_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fish_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        shark_collector_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
    return Statistics;
};