var Stock = require("./stock.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");
var svg = require('./svg-jsdom.js');
var commonHeaders = {'Content-Type': 'text/html'}
 

//Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
  //if url == "/" && GET
  if (request.url === '/'){
    if(request.method.toLowerCase() === "get") {
      //show search 
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else{
      //if url == "/" && POST
      //get the post data from body
      request.on("data", function(postBody){
        //extract the username
        var query = querystring.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {"Location": "/" + query.symbol});
	  response.end();
      });
    }
  }
}

function stock(request, response) {

  //if url == "/...."                                                                                    
  var symbol = request.url.replace("/", "");
  if (symbol.length > 0 && symbol != "favicon.ico") {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);  

    var stockData = new Stock(symbol);   
    stockData.on("end", function(stockJSON) {

    svg.svgGen(stockJSON, function (svg) {  
    //console.log(stockJSON.query.results.quote);
    values = {
	symbol : stockJSON.query.results.quote[0].Symbol,
	svg : svg,
	price : stockJSON.query.results.quote[0].Close
    }

    renderer.view("stock", values, response);
    renderer.view("footer", {}, response);  
    response.end();
    });
    });	
  }
}

module.exports.home = home;
module.exports.stock = stock;
