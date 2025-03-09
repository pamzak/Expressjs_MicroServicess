const express = require("express");
const bodyParser =require("body-parser");
const app = express();
const Producer =require("./producer");
const producer = new Producer();


app.use(bodyParser.json("application/json"));


app.post("/sendLog", async (req,res , next) =>
        {
            console.log(req.body);
  await producer.publishMessage(req.body.logType, req.body.message );
  res.send({
    message:req.body.message  ,
    logType:req.body.logType  

  });
        }
);

app.listen(3000 , ()=> {
    console.log("Server is running on port 3000");
});