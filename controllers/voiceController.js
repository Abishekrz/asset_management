const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.process = async (req, res) => {

    try {

        const form = new FormData();

        form.append(
            "audio",
            fs.createReadStream(req.file.path)
        );

        const response = await axios.post(

            "http://127.0.0.1:8000/process",

            form,

            {
                headers: form.getHeaders()
            }

        );

        res.json(response.data);

    } catch(err){

        console.error("Voice Controller Error:",err);

        res.status(500).json({

            success:false,
            error:err.response?.data||err.message

        });

    } finally {

        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Unable to remove temporary voice file:", unlinkErr);
                }
            });
        }

    }

};
