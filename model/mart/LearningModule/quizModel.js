const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const martQuiz = sequelize.define(
    "db_mart_quiz_model", // database table name
    {
        quiz_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        questions: {
            type: DataTypes.STRING,
        },
        option1: {
            type: DataTypes.STRING,
        },
        option2: {
            type: DataTypes.STRING,
        },
        option3: {
            type: DataTypes.STRING,
        },
        option4: {
            type: DataTypes.STRING,
        },
        answer: {
            type: DataTypes.STRING,
        },
        marks: {
            type: DataTypes.INTEGER,
        },
    },
      { paranoid: true, timestamps: true }
    );
  
    return martQuiz;
  };
  