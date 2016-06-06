var express = require("express");
var app = express();
var crypto = require("crypto");
var http = require("http");
var https = require("https");
var oauthSignature = require("oauth-signature");


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



app.get("/searchapi", function(request, response) {
    
    //Make an HTTP request to Yelp's API
    
    var timestamp = Date.now();
    var random = Math.random();
    

    var oauth_consumer_key = "DFk5ftxDROCEzTzNLSPtyw";
    var oauth_token = "0qWzH2Pok-nYFbWCMw2Tto_xII-YU4Rw";
    var oauth_signature_method = "HMAC-SHA1";
    var oauth_timestamp = Math.floor(timestamp/1000);
    
    var hash = crypto.createHash("sha1");
    hash.update(String(oauth_timestamp));
    var oauth_nonce = hash.digest("hex");
    
    var oauth_version = "1.0";
    
    var consumer_secret = "yQLBf5l4nFtqdUTvV-k3w_xtEV0";
    var token_secret = "FzPWRb8iN_nLo3MljTv7zWMoEiQ";
    
    
    
    
    //INFO FOR OAUTHSIGATURE NPM MODULE///////////////////////////////
//    var httpmethod = "GET";
//    var apiurl = "https://api.yelp.com/v2/search";
//    var parameters = {
//        oauth_consumer_key: oauth_consumer_key,
//        oauth_token: oauth_token,
//        oauth_nonce: oauth_nonce,
//        oauth_timestamp: oauth_timestamp,
//        oauth_signature_method: oauth_signature_method,
//        oauth_version: oauth_version
//    }
//    
//
//    
//    var encodedSignature = oauthSignature.generate(httpmethod, apiurl, parameters, consumer_secret, token_secret);
//    
//    console.log(encodedSignature);
//    
    ///////////////////////////////////////////////////////////////////
    
    
    
    
    var sig_base_string = "GET&" + encodeURIComponent("https://api.yelp.com/v2/search") + "&";
    sig_base_string += encodeURIComponent("location=San Francisco&");
    sig_base_string += encodeURIComponent("oauth_consumer_key=" + oauth_consumer_key + "&");
    sig_base_string += encodeURIComponent("oauth_nonce=" + oauth_nonce + "&");
    sig_base_string += encodeURIComponent("oauth_signature_method=" + oauth_signature_method + "&");
    sig_base_string += encodeURIComponent("oauth_timestamp=" + oauth_timestamp + "&");
    sig_base_string += encodeURIComponent("oauth_token=" + oauth_token + "&");
    sig_base_string += encodeURIComponent("oauth_version=" + oauth_version + "&");
    sig_base_string += encodeURIComponent("term=food");
    

    //console.log(sig_base_string);
    
    //Consumer Secret + Token Secret
    var signing_key = consumer_secret + "&" + token_secret;
    //var signing_key = token_secret;
    
    var hmac = crypto.createHmac("sha1", signing_key);


    hmac.update(sig_base_string);

    
    var signature = encodeURIComponent(hmac.digest("base64"));
    

    
    
    //console.log(signature);

    
    
    
    var path = "/v2/search?location=San+Francisco&oauth_consumer_key=" + oauth_consumer_key + "&oauth_nonce=" + oauth_nonce + "&oauth_signature_method=" + oauth_signature_method + "&oauth_signature=" + signature + "&oauth_timestamp=" + oauth_timestamp + "&oauth_token=" + oauth_token + "&oauth_version=" + oauth_version + "&term=food";
    
    //console.log(path);

    
    
    var options = {
        host: "api.yelp.com",
        //path: "/v2/search?term=food&location=San+Francisco",
        path: path,
        method: "GET"
//        Authorization: 
//            OAuth "oauth_consumer_key=" + oauth_consumer_key,
//                "oauth_token=" + oauth_token,
//                "oauth_signature_method=" + oauth_signature_method,
//                "oauth_signature=" + signature,
//                "oauth_timestamp=" + oauth_timestamp,
//                "oauth_nonce=" + oauth_nonce
//
        }  
    
    
    https.request(options, function(res) {
        
        var str;
        res.on("data", function(chunk) {
            
            str += chunk;
            
        });
        
        res.on("end", function() {
            
            console.log(str);
        });
        
    }).end();

    
    
    
    
    
    response.send("hello searchapi");
    
    
}); //End .get("/searchapi")


app.listen(port);