const { DataTypes } = require("sequelize");

const sequelize=require("../config/database");
const Employee=sequelize.define(
    "Employee",{
        employee_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:true
        },
        employee_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        department:{type:DataTypes.STRING},
        branch:{type:DataTypes.STRING},
            status: {
            type: DataTypes.ENUM(
                "ACTIVE","INACTIVE"
            ),
            allowNull: false,
            defaultValue: "ACTIVE"
        },
        joined_at:{type:DataTypes.DATE}
        
    },
    {
        tableName:"employee_table",
        timestamps: false

    }
);
module.exports=Employee;