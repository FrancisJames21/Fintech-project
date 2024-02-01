const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Fintech",{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
}).then((e) => {
    console.log(`connection successful`);
}).catch(() => {
    console.log(`connection error`);
})
const logInSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
  });
  
const LogInCollection = new mongoose.model("LogInCollection", logInSchema);

module.exports=LogInCollection