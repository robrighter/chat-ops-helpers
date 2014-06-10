var rooms = require('../hardcoded-rooms.js');
var ThrottledMessageHandler = require("../lib/throttled-message-handler.js");
var GraphiteAlerts = require("../lib/graphite-alerts.js");

module.exports = {
    type: 'JobRecurringInterval',
    hours: 0,
    minutes: 0,
    seconds: 30,
    callback: function(hipchatUserHandler){
        var graphiteAlerts = new GraphiteAlerts(
            rooms.graphiteAlerts,
            new ThrottledMessageHandler(hipchatUserHandler)
        );
        graphiteAlerts.check();
    }
}
