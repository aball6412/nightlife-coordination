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
    
    //Get timestamp so to create oauth_timestamp and the oauth_nonce (I hashed the timestamp to make nonce variable)
    var timestamp = Date.now();

    
    //Get the Yelp API Authentication variables that we need
    var oauth_consumer_key = "DFk5ftxDROCEzTzNLSPtyw";
    var oauth_token = "0qWzH2Pok-nYFbWCMw2Tto_xII-YU4Rw";
    var oauth_signature_method = "HMAC-SHA1";
    var oauth_timestamp = Math.floor(timestamp/1000);
    var oauth_version = "1.0";
    
    var hash = crypto.createHash("sha1");
    hash.update(String(oauth_timestamp));
    var oauth_nonce = hash.digest("hex");
    
    var consumer_secret = "yQLBf5l4nFtqdUTvV-k3w_xtEV0";
    var token_secret = "FzPWRb8iN_nLo3MljTv7zWMoEiQ";
    
    //Get the Yelp query variables that we will need
    //FIX THE LOCATION TO ALL IT WORK WITH WITH SPACES EX: SAN FRANCISCO. NEED TO ESCAPE THE SPACE MAYBE??
    var location = "Atlanta";
    var term = "food";
    

    //Combine compontents into a Signature Base String (according to Oauth 1.0 rules)
    //Make sure that they are all percent encoded (encodeURIComponent())
    //It's standard for these to be in alphabetical order
    var sig_base_string = "GET&" + encodeURIComponent("https://api.yelp.com/v2/search") + "&";
    sig_base_string += encodeURIComponent("location=" + location + "&");
    sig_base_string += encodeURIComponent("oauth_consumer_key=" + oauth_consumer_key + "&");
    sig_base_string += encodeURIComponent("oauth_nonce=" + oauth_nonce + "&");
    sig_base_string += encodeURIComponent("oauth_signature_method=" + oauth_signature_method + "&");
    sig_base_string += encodeURIComponent("oauth_timestamp=" + oauth_timestamp + "&");
    sig_base_string += encodeURIComponent("oauth_token=" + oauth_token + "&");
    sig_base_string += encodeURIComponent("oauth_version=" + oauth_version + "&");
    sig_base_string += encodeURIComponent("term=" + term);
    
    
    
    //Create a key to sign the request. 
    //Oauth 1.0 stipulates that you combine consumer secret and token secret with "&" in between.
    var signing_key = consumer_secret + "&" + token_secret;
    
    
    //Get the Signature Base String above and hash it with HMAC-SHA1, while using our signing key to do so
    //Make sure signature is also percent encoded
    var hmac = crypto.createHmac("sha1", signing_key);
    hmac.update(sig_base_string);
    var signature = encodeURIComponent(hmac.digest("base64"));
    


    //Create the path that we well use to query Yelp API
    //Again put these in exact order that we put the Signature Base String in (alphabetical)
    var path = "/v2/search?location=" + location + "&oauth_consumer_key=" + oauth_consumer_key + "&oauth_nonce=" + oauth_nonce + "&oauth_signature_method=" + oauth_signature_method + "&oauth_signature=" + signature + "&oauth_timestamp=" + oauth_timestamp + "&oauth_token=" + oauth_token + "&oauth_version=" + oauth_version + "&term=" + term;
    

    //Set up the options for the HTTPS request
    var options = {
        host: "api.yelp.com",
        //path: "/v2/search?term=food&location=San+Francisco",
        path: path,
        method: "GET"
        }  

    //Make the HTTPS request through Node
    https.request(options, function(res) {
        
        var str = "";
        res.on("data", function(chunk) {
            
            //As data comes add it to an empty string
            str += chunk;
            
        });
        
        res.on("end", function() {
            
            //Once all of the data is in turn the string into JSON so we can work with it
            var result = JSON.parse(str);
            //Output the JSON to the client
            response.send(result);
        });
        
    }).end();

    

    
}); //End .get("/searchapi")


app.listen(port);