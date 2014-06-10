var events = require("events");
var util = require("util");
var net = require('net');

function OpsMessageHandler(host,port){
    var that = this;

    setupTcpListener(host,port);


    function handleOpsMessage(message){
        var parsed = message.split("\n");
        var tag = parsed[0];
        var contents = parsed.slice(1).join("\n");
        that.emit('message',tag,contents);
    }

    function setupTcpListener(host,port){
        var server = net.createServer(function(c) { //'connection' listener
            console.log('server connected');
            var data = "";
            c.on('data', function(chunk){
                data+=chunk;
            });
            c.on('end', function() {
                handleOpsMessage(data);
            });
        });
        server.listen(port, host, function() { //'listening' listener
            console.log('listening for ops messages on port '+port);
        });
        return server;
    }


}

util.inherits(OpsMessageHandler, events.EventEmitter);
module.exports = OpsMessageHandler;