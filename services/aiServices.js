const axios = require("axios");

async function processAI(text) {

    const response = await axios.post(
        "http://127.0.0.1:8000/process",
        {
            text
        }
    );

    return response.data;
}

module.exports = {
    processAI
};