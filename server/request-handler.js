/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var fs = require('fs');
var buffer = require('buffer');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);



  // console.log(body); // expecting a bunch of array objects???

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  if (request.url === '/classes/messages') {

    // body and results variables are for the 'GET' method
    if (request.method === 'GET') {
      var body = {};
      body.results = [];
      
      //console.log('GET method');
      var contents = fs.readFileSync('messageStorage.json', 'utf8');
      // take out the last comma
      contents = '[' + contents.slice(0, -1) + ']'; // array string

      var contentAsArrObj = JSON.parse(contents); // array object

      body.results = contentAsArrObj;

      // console.log(contentAsArrObj);
      // console.log(Array.isArray(contentAsArrObj));

      //console.log(body);

      statusCode = 200;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      //response.end(JSON.stringify(body));
      response.end(JSON.stringify(body));
    }

    if (request.method === 'POST') {

      request.on('error', function(err) {
        console.error(err);
      });
      request.on('data', function(chunk) {
        var bodyObj = {};
        var results = [];
        bodyObj.results = results;     

        var chunkString = '';

        chunkString += chunk;
        console.log(chunkString);

        //console.log(chunkString);
        // postRequestData.push(chunk); 

        fs.appendFileSync('messageStorage.json', (chunkString + ','));
        bodyObj.results.push(chunkString);

        // console.log(bodyObj);

        statusCode = 201;
        headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(bodyObj));

      });
      request.on('end', function() {
        /* 
        //console.log(postRequestData);
        chunkString = chunkString.replace(/\+/g, ' ' );
        // console.log(chunkString);
        // postRequestData = buffer.Buffer.concat(postRequestData).toString();
        // 'username=username123&text=text+123message&roomname=lobby'
        var reqDataArr = chunkString.split('&');
        var reqDataObj = {};

        for (var i = 0; i < reqDataArr.length; i++) {
          var tempArray = reqDataArr[i].split('=');
          reqDataObj[tempArray[0]] = tempArray[1];
        }
        // console.log(JSON.stringify(reqDataObj));
        body.results.push(reqDataObj);
        
        console.log(JSON.stringify(body.results));
        // // {"username":"username123","text":"text+123+message","roomname":"lobby"}
        
        //appends to file
        fs.appendFileSync('messageStorage.json', JSON.stringify(reqDataObj));

        console.log(JSON.stringify(body));
        
        statusCode = 201;
        headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(body.results));

        */
      });

      statusCode = 201;
    }
  } else {
    statusCode = 404;
  }

  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end('Hello, World!');
  //console.log(JSON.stringify(body));
  //response.end(JSON.stringify(body));
};

module.exports.requestHandler = requestHandler;


