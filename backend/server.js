const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const env = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
env.config();
//const userRoutes = require("./routes/user.js");

const app = express();

app.use(cors());
app.use(express.json())
//ROUTES
//const userRoutes = require("./routes/user.js");
//app.use("/",userRoutes)
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//DATABASE
mongoose
  .connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
  })
  .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
  .catch((err) => console.log("ERROR CONNECTING TO MONGODB", err));

app.get("/", (req, res) => {
  res.send("welcome from home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON ${PORT}..`);
});
