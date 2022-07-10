const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/common/errorHandler");
const DatabaseConfig = require("./utilityClasses/databaseConfig");
const app = express();
const cookieParser = require("cookie-parser");
//configureing dotenv file
dotenv.config();
//using cors
app.use(
  cors({
    origin: "*",
  })
);
// request parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//using cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));
//database connection
DatabaseConfig.config();

//routes
app.use("/auth", require("./routes/authRoute"));
app.use("/event", require("./routes/eventRoute"));
app.use("/comment", require("./routes/commentRoute"));
app.use("/reply", require("./routes/replyRoute"));
app.use("/notification", require("./routes/notificationRoute"));
//notfound handler
app.use(notFoundHandler);
//error handler
app.use(errorHandler);

//port setup
port = process.env.PORT || 5000;
app.listen(port);
