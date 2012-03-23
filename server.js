var http = require('http');
var sys  = require('sys');
var fs   = require('fs');

var wallText;  // holds the current text on the wall

var server = http.createServer(function(request, response) {
	response.writeHead(200, {
		'Content-Type': 'text/html'
	});
	var rs = fs.createReadStream(__dirname + '/template.html');
	sys.pump(rs, response);
});  // serves template.html to new clients

var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function(client) {
	io.sockets.send(wallText);  // sends the current wall text to new clients
	
	client.on('message', function(message) { // called when a change is received from a client
		console.log(message);
		wallText = message;  // the new wall text is saved in the wallText variable
		client.broadcast.send(wallText);  // the new wall text is sent to all OTHER clients
	});
});

server.listen(process.env.PORT || 4000);