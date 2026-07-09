const { DataTypes } = require("sequelize");

const sequelize=require("../config/database");
const Asset = require("./Asset");
const Employee = require("./Employee");
const Issue=sequelize.define(
    "Issue",{
        issue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        asset_id:{
            type:DataTypes.INTEGER,
            references:{
                model:Asset,
                key:"asset_id"
            }
        },
        employee_id:{
            type:DataTypes.INTEGER,
            references:{
                model:Employee,
                key:"employee_id"
            }
        },
        issue_date:{
            type:DataTypes.DATE
        },
        return_date:{
            type:DataTypes.DATE
        },
        reason:{
            type:DataTypes.STRING
        }
    },
    {
        tableName:"asset_issue_table",
        timestamps: false
    }
);
module.exports=Issue;