import express from "express";
import connectToDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errors.js";
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
//# sourceMappingURL=app.js.map