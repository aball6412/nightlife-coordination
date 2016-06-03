var express = require("express");
var app = express();


//Set up port for production and development
var port = process.env.PORT || 3000;


//Serve static files
app.use("/", express.static(__dirname + "/public"));

//Set up EJS as view engine
app.set("view engine", "ejs");



//Respond to homepage URL get requests.
app.get("/", function(request, response) {
    
    response.render("index");
    
});



app.listen(port);