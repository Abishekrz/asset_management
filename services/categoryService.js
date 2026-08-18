const BaseService = require("./BaseService");
const { Category } = require("../models");
const { Op } = require("sequelize");

function normalizeCategoryName(categoryName) {
    return String(categoryName || "").trim().toLowerCase();
}

class CategoryService extends BaseService {
    constructor() {
        super(Category, "category_id");
    }

    async findDuplicate(categoryName, excludeCategoryId = null) {
        const normalizedName = normalizeCategoryName(categoryName);

        if (!normalizedName) {
            return {
                success: false,
                error: "Category name is required."
            };
        }

        const conditions = [
            this.model.sequelize.where(
                this.model.sequelize.fn(
                    "lower",
                    this.model.sequelize.fn(
                        "btrim",
                        this.model.sequelize.col("category_name")
                    )
                ),
                normalizedName
            )
        ];

        if (excludeCategoryId !== null) {
            conditions.push({
                category_id: {
                    [Op.ne]: excludeCategoryId
                }
            });
        }

        try {
            const category = await this.model.findOne({
                where: {
                    [Op.and]: conditions
                }
            });

            return {
                success: true,
                data: category
            };
        } catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async findByName(categoryName) {
        const normalizedName = normalizeCategoryName(categoryName);

        if (!normalizedName) {
            return {
                success: false,
                error: "Category name is required."
            };
        }

        try {
            const categories = await this.model.findAll({
                where: this.model.sequelize.where(
                    this.model.sequelize.fn(
                        "lower",
                        this.model.sequelize.fn(
                            "btrim",
                            this.model.sequelize.col("category_name")
                        )
                    ),
                    normalizedName
                ),
                order: [["category_id", "ASC"]],
                limit: 2
            });

            return {
                success: true,
                data: categories
            };
        } catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async create(data, transaction = null) {
        const categoryName = String(data.category_name || "").trim();
        const duplicate = await this.findDuplicate(categoryName);

        if (!duplicate.success) {
            return duplicate;
        }

        if (duplicate.data) {
            return {
                success: false,
                error: "Category already exists."
            };
        }

        return await super.create(
            {
                ...data,
                category_name: categoryName
            },
            transaction
        );
    }

    async update(id, data, transaction = null) {
        const categoryName = String(data.category_name || "").trim();
        const duplicate = await this.findDuplicate(categoryName, id);

        if (!duplicate.success) {
            return duplicate;
        }

        if (duplicate.data) {
            return {
                success: false,
                error: "Category already exists."
            };
        }

        return await super.update(
            id,
            {
                ...data,
                category_name: categoryName
            },
            transaction
        );
    }
}
module.exports = new CategoryService();
