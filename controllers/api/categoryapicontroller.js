const categoryService = require("../../services/categoryService");

exports.list = async (req, res) => {
    try {
        const result = await categoryService.list();

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            data: result.data
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.get = async (req, res) => {
    try {
        const result = await categoryService.get(req.params.id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            data: result.data
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await categoryService.create({
            category_name: req.body.category_name,
            description: req.body.description
        });

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const result = await categoryService.update(
            req.params.id,
            {
                category_name: req.body.category_name,
                description: req.body.description
            }
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await categoryService.delete(
            req.params.id
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};