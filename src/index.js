const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes.js");
const { default: mongoose } = require("mongoose");
const cookie=require('cookie-parser');
const app = express();

//const multer=require('multer')

app.use(bodyParser.json());

//app.use(multer().any())
app.use(cookie())

mongoose
  .connect(
    "mongodb+srv://Satyaveer1994:Satyaveer123@cluster0.pn1nk.mongodb.net/satyaveer-DB",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(4000, () => console.log("Express app running on " + 4000))


