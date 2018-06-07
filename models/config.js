module.exports = function(sequelize, DataTypes) {
    const Config = sequelize.define("config", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        collection_time_modifier: {
            type: DataTypes.INTEGER,
            defaultValue: 5000
        },
        attack_counter: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        experience_growth_modifier: {
            type: DataTypes.INTEGER,
            defaultValue: 20
        },
        dirt_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 100
        },
        rock_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 10000
        },
        steel_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 20000
        },
        worm_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 100
        },
        fish_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 1000
        },
        shark_trade_cost: {
            type: DataTypes.INTEGER,
            defaultValue: 2000
        },
        dirt_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 2
        },
        rock_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 6
        },
        steel_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 12
        },
        worm_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        fish_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        },
        shark_resource_difficulty_rank: {
            type: DataTypes.INTEGER,
            defaultValue: 6
        },
        // RUL = Resource Upgrade List
        house_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'dirt'
        },
        house_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'rock'
        },
        house_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'steel'
        },
        heart_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'worm'
        },
        heart_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'fish'
        },
        heart_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'shark'
        },
        food_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'dirt'
        },
        food_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'rock'
        },
        food_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'steel'
        },
        attack_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'rock'
        },
        attack_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'steel'
        },
        attack_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'steel'
        },
        defense_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'dirt'
        },
        defense_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'rock'
        },
        defense_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'steel'
        },
        baby_RUL_rank_one: {
            type: DataTypes.STRING,
            defaultValue: 'worm'
        },
        baby_RUL_rank_two: {
            type: DataTypes.STRING,
            defaultValue: 'fish'
        },
        baby_RUL_rank_three: {
            type: DataTypes.STRING,
            defaultValue: 'shark'
        }
    });
    return Config;
};