
const {DataTypes}=require("sequelize")
const sequelize = require("../config/database");
const Category = require("./Category");


const Asset=sequelize.define(
    "Asset",{
        asset_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        asset_name:{
            type:DataTypes.TEXT
        },
        serial_number:{type:DataTypes.STRING},
        make:{type:DataTypes.STRING},
        model:{type:DataTypes.STRING},
        purchase_date:{type:DataTypes.DATE},
        purchase_price:{type:DataTypes.DECIMAL(10,2)},
        status: {
            type: DataTypes.ENUM(
                "IN_STOCK",
                "ISSUED",
                "REPAIR",
                "SCRAPPED"
            ),
            allowNull: false,
            defaultValue: "IN_STOCK"
        },
        category_id:{
            type:DataTypes.INTEGER,
            references:{
                model:Category,
                key:"category_id"
            }
        },
        warranty:{
            type:DataTypes.ENUM("YES", "NO"),
            allowNull: false,
            defaultValue: "NO"
        }


    },
    {
        tableName:"asset_table",
        timestamps: false
    }
);
module.exports=Asset;