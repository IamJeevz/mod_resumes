require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const resumeRoute = require("./routes/resume");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/resume", resumeRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});