var Evaluator = require('./evaluator.js');
var https = require('https');
var http = require('http');

module.exports = GraphiteAlerts;

/**
 * Constructor
 *
 * @param Map of alerts keyed by room
 * @param handler, Hipchat-style
 */
function GraphiteAlerts(alerts, handler) {
    this.alerts = alerts;
    this.handler = handler;
}

GraphiteAlerts.prototype.requestData = function(url, callback) {
    var client = url.substring(0, 5) == 'https' ? https : http;
    client.get(url, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            var data;
            try {
                data = JSON.parse(chunk);
            } catch (e) {
                data = [];
            }
            callback(data);
        });
    }).on('error', function(e) {
        console.error(e);
    });
};

/**
 * Check graphite with a list of alerts for threshold violations
 */
GraphiteAlerts.prototype.check = function() {
    var that = this;

    Object.keys(that.alerts).forEach(function(room){
        var alerts = that.alerts[room];

        alerts.forEach(function(alert){
            var graphUrl = alert.graph + "&from=-5mins&rawData=true&format=json";

            that.requestData(graphUrl, function(data){
                if (data == null || data[0] == undefined || data[0].datapoints == undefined) {
                    return;
                }

                data[0].datapoints.reverse().forEach(function(datapoint){
                    if (datapoint[0] !== null) {
                        var sign = alert.sign === undefined ? ">" : alert.sign;
                        var throttle = alert.throttle === undefined ? null : alert.throttle;

                        if (Evaluator(sign, datapoint[0], alert.threshold)) {
                            var message = "@all Graphite: " + alert.label + 
                                " has crossed the alert threshold " + sign + " " + alert.threshold + " and is at ";

                            that.handler.announceToRoom(
                                room,
                                message + datapoint[0],
                                message,
                                throttle
                            );
                        }
                    }
                });
            });
        });
    });
};
