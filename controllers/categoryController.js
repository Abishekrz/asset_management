const Category = require("../models/Category");

// Display all category
exports.listCategory= async (req, res) => {
    try {
        const categories = await Category.findAll();

        res.render("category/list", {
            categories
        });
        // console.log(categories)

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching Assets");
    }
};
exports.getCategory = async (req, res) => {

    try {

        const category = await Category.findByPk(req.params.id);

        res.json(category);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

};

exports.editCategory = async (req, res) => {
    try {

        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json(category);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {

        await Category.update(
            {
                category_name: req.body.category_name,
            },
            {
                where: {
                    category_id: req.params.id
                }
            }
        );

        res.redirect("/category/list");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating category");
    }
};

// Show Add Category Page
exports.showAddForm = (req, res) => {
    res.render("category/add");
};

// Add Category
exports.addCategory = async (req, res) => {
    try {
        await Category.create({
            category_name: req.body.category_name,
            description: req.body.description
        });
        res.redirect("/category/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding category");
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.destroy({
            where: {
                category_id: req.params.id
            }
        });
        res.redirect("/category/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting category");
    }
};