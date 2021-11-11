const express = require("express");
const bcrypt=require("bcryptjs");
const path = require("path");
require("./db/conn");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const Idk = require("./models/registers");
//const { urlencoded } = require("express");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/register", async (req, res) => {
  res.render("registration");
});

app.post("/login", async (req, res) => {
  try {
      const email=req.body.email;
      const data=await Idk.findOne({email});
      if(!data){
        res.send("Email not registered");
      }
      if(await bcrypt.compare(req.body.password,data.password)){
        res.render("index");
      }else{
        res.send("Wrong Password");
      }
     console.log(data.password);
     console.log(req.body.password);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/registration", async (req, res) => {
  try {
    if (req.body.password === req.body.confirmpassword) {

      const bcryptHash=await bcrypt.hash(req.body.password,10);
      const registerEmployee = new Idk({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        password: bcryptHash,
        confirmpassword: req.body.confirmpassword,
        age:req.body.age
      });
      const result = await registerEmployee.save();
      if (!result) {
        console.log("Not saved , some error occured");
        res.status(404).send();
      } else {
        console.log(result);
        console.log("Successfully saved in database");
        res.send(result);
      }
    } else {
      res.send("Passwords do not match");
    }

    console.log(req.body);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});




app.listen(port, (err) => {
  if (!err) {
    console.log(`Server successfully started on port ${port}`);
  } else {
    console.log(err);
  }
});
