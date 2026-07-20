import express from "express";
import connectToDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errors.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./routers/auth.js";
import users from "./routers/users.js";
import posts from "./routers/posts.js";
import helmet from "helmet";
import cors from "cors"
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectToDB();

app.use(helmet());
app.use(cors({origin: 'http://localhost:3000'}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/users", users);
app.use("/posts", posts);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
