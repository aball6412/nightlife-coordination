var express = require("express");
var app = express();


var port = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));



app.get("/", function(request, response) {
    
    response.send("Hello World");
    
});



app.listen(port);