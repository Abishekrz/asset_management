"use strict";

module.exports = {
  async up(queryInterface) {
    const [duplicates] = await queryInterface.sequelize.query(`
      SELECT LOWER(BTRIM(category_name)) AS normalized_name
      FROM asset_category_table
      GROUP BY LOWER(BTRIM(category_name))
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      throw new Error(
        "Cannot add the category-name unique index while duplicate normalized category names exist. Resolve them and rerun the migration."
      );
    }

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX category_name_normalized_unique_idx
      ON asset_category_table (LOWER(BTRIM(category_name)))
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "DROP INDEX IF EXISTS category_name_normalized_unique_idx"
    );
  }
};
