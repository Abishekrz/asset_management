const categoryService = require("../services/categoryService");

exports.listCategory = async (req, res) => {
    const result = await categoryService.list();
    if (!result.success) {
        return res.status(500).send(result.error);
    }
    res.render("category/list", {
        categories: result.data
    });
};

exports.getCategory = async (req, res) => {
    const result = await categoryService.get(
        req.params.id
    );
    if (!result.success) {
        return res.status(404).json(result);
    }
    res.json(result.data);
};

exports.checkCategoryName = async (req, res) => {
    const result = await categoryService.findDuplicate(
        req.query.category_name
    );

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.json({
        success: true,
        exists: Boolean(result.data)
    });
};

exports.findCategoryByName = async (req, res) => {
    const result = await categoryService.findByName(
        req.query.category_name
    );

    if (!result.success) {
        return res.status(400).json(result);
    }

    if (result.data.length === 0) {
        return res.status(404).json({
            success: false,
            error: "Category not found."
        });
    }

    if (result.data.length > 1) {
        return res.status(409).json({
            success: false,
            error: "Multiple categories have this name. Use a category ID."
        });
    }

    res.json({
        success: true,
        data: result.data[0]
    });
};

exports.editCategory = async (req, res) => {
    const result = await categoryService.get(
        req.params.id
    );
    if (!result.success) {
        return res.status(404).json({
            success: false,
            message: result.error
        });
    }
    res.json(result.data);
};
exports.updateCategory = async (req, res) => {
    const result = await categoryService.update(
        req.params.id,
        {
            category_name: req.body.category_name,
            description: req.body.description
        }
    );
    if (!result.success) {
        return res.status(400).send(result.error);
    }
    res.redirect("/category/list");
};

exports.showAddForm = (req, res) => {
    res.render("category/add");
};

exports.addCategory = async (req, res) => {
    const result = await categoryService.create({
        category_name: req.body.category_name,
        description: req.body.description
    });
    if (!result.success) {
        return res.status(400).send(result.error);
    }
    res.redirect("/category/list");
};
exports.deleteCategory = async (req, res) => {
    const result = await categoryService.delete(
        req.params.id
    );
    if (!result.success) {
        return res.status(400).send(result.error);
    }
    res.redirect("/category/list");
};
