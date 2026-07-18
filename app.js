const express = require("express");
const { notFound, errorHandler } = require("./middlewares/errors");
const connectToDB = require("./config/db");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToDB();
app.use("/auth", require("./routers/auth"));
app.use("/users", require("./routers/users"));
app.use("/posts", require("./routers/posts"));

app.set("view engine", "ejs");

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
