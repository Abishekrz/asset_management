"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("asset_table", "warranty", {
      type: Sequelize.ENUM("YES", "NO"),
      allowNull: false,
      defaultValue: "NO"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("asset_table", "warranty");
  }
};