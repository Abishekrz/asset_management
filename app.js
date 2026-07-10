require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
// Database
const sequelize = require("./config/database");
// Middleware
app.use(express.urlencoded({ extended: true }));
// View Engine
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
// Database Connection
sequelize.authenticate()
    .then(() => console.log("Database Connected"))
    .catch(err => console.error(err));
// Routes
app.use("/", require("./routes/dashboard"));
app.use("/employee", require("./routes/employee"));
app.use("/asset", require("./routes/asset"));
app.use("/category", require("./routes/category"));
app.use("/issue", require("./routes/issue"));
app.use("/scrape", require("./routes/scrape"));
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});