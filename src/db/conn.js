const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/idk")
.then(()=>{
    console.log("Successfully connected to DB");
}).catch((err)=>{
    console.log(err);
});