var NodeCache = require( "node-cache" );

module.exports = ThrottledMessageHandler;

var globalCache = new NodeCache( { stdTTL: 120, checkperiod: 150 } );

/**
 * Constrcutor
 *
 * @param hipchatUserHandler
 * @constructor
 */
function ThrottledMessageHandler(hipchatUserHandler, cache, ttl) {
    if (cache == undefined || cache == null) {
        cache = globalCache;
    }
    if (ttl == undefined) {
        ttl = 600;
    }
    this.hipchatUserHandler = hipchatUserHandler;
    this.cache = cache;
    this.ttl = ttl;
};

/**
 * Pass a message onto the hipchatUserHandler, but throttle it if it's a repeat
 * within our given window.
 *
 * @param room
 * @param message
 */
ThrottledMessageHandler.prototype.announceToRoom = function(room, message, throttleWith, throttle, callback){
    // Allows us to throttle on a less specific message
    if (throttleWith == undefined || throttleWith == null) {
        throttleWith = message;
    }
    if (throttle == undefined || throttle == null) {
        throttle = this.ttl;
    }

    var that = this;
    var key = room + '::' + throttleWith;

    that.cache.get(key, function(error, value){
        if (!error){
            if (value.hasOwnProperty(key)) {
                console.log("Suppressing message to " + room + " because it was sent within throttle window of " + throttle + " seconds: " + message);
            } else {
                that.cache.set(key, { active: true }, throttle);

                that.hipchatUserHandler.announceToRoom(
                    room,
                    message
                );

                if (callback !== undefined) {
                    callback();
                }
            }
        }
    });
};
