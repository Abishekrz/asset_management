// const {DataTypes}=require("sequelize");
// const sequelize =require("../config/database");
// const Asset = require("./Asset");

// const Scrape=sequelize.define(
//     "Scrape",{
//         scrape_id:{
//             type:DataTypes.INTEGER,
//             primaryKey:true,
            
//         },
//         asset_id:{
//             type:DataTypes.INTEGER,
//             references:{
//                 model:Asset,
//                 key:"asset_id"
//             }
//         },
//         scrape_date:{type:DataTypes.DATE},
//         reason:{type:DataTypes.STRING}
//     },{
//         tableName:"scrape_table",
//         timestamps: false
//     }
// );
// module.exports=Scrapes