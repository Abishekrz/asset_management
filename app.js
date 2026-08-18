require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// Database
// ==========================

const sequelize = require("./config/database");

// ==========================
// Routes
// ==========================

const voiceRouter = require("./routes/voice");
const aiRouter = require("./routes/ai");

const dashboardRouter = require("./routes/dashboard");
const employeeRouter = require("./routes/employee");
const assetRouter = require("./routes/asset");
const categoryRouter = require("./routes/category");
const issueRouter = require("./routes/issue");
const scrapeRouter = require("./routes/scrape");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
    console.log("------------------------------------");
    console.log(req.method, req.url);
    console.log("Content-Type :", req.headers["content-type"]);
    console.log("Body :", req.body);
    console.log("------------------------------------");
    next();
});
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database Connected");
    })
    .catch(err => {
        console.error("Database Error");
        console.error(err);
    });
const employeeApiRouter =
    require("./routes/api/employeeApi");

const categoryApiRouter =
    require("./routes/api/categoryApi");

const assetApiRouter =
    require("./routes/api/assetApi");

const issueApiRouter =
    require("./routes/api/issueApi");

const scrapeApiRouter =
    require("./routes/api/scrapeApi");
app.use("/api/employees", employeeApiRouter);
app.use("/api/categories", categoryApiRouter);
app.use("/api/assets", assetApiRouter);
app.use("/api/issues", issueApiRouter);
app.use("/api/scrapes", scrapeApiRouter);
app.use("/", dashboardRouter);
app.use("/employee", employeeRouter);
app.use("/asset", assetRouter);
app.use("/category", categoryRouter);
app.use("/issue", issueRouter);
app.use("/scrape", scrapeRouter);
app.use("/voice", voiceRouter);
app.use("/api/ai", aiRouter);
app.use("/", dashboardRouter);
app.use("/api/dashboard", dashboardRouter);
const dashboardApiRouter = require("./routes/dashboardApi");
app.use("/api/dashboard", dashboardApiRouter);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route Not Found"
    });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("====================================");
    console.log(`Server Running`);
    console.log(`Local   : http://localhost:${PORT}`);
    console.log(`Network : http://0.0.0.0:${PORT}`);
    console.log("====================================");
});