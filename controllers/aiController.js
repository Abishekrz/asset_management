const dispatcher = require("../services/dispatcher");

exports.execute = async (req, res) => {

    try {

        console.log("\n========== AI REQUEST ==========");
        console.log(req.body);
        console.log("================================\n");

        const result = await dispatcher.dispatch(req.body);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};