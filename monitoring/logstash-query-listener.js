
var redis = require('redis');
var elasticjs = require('elastic.js');
var nc = require('elastic.js/elastic-node-client');

// Elasticsearch host configuration for use by the LogstashQueryListener
var ELASTICSEARCH_HOST = 'your.elastic.host.com';
var ELASTICSEARCH_PORT = 9200;


function LogstashQueryListener(queries, callback, _ejs, _redisClient) {
    var ejs = (_ejs) ? _ejs : (function(){
        var client = elasticjs;
        client.client = nc.NodeClient(ELASTICSEARCH_HOST, ELASTICSEARCH_PORT);
        return client;
    })();
    var redisClient = (_redisClient) ? _redisClient : redis.createClient();
    var allQueries = require("../logstash-queries.js");
    var LOGSTASH_LAST_CHECK_KEY = 'HALBOT_LOGSTASH_LAST_CHECK';

    init();

    function init() {
        queries.forEach(function(query){
            handleSearch(query, allQueries[query], callback);
        });
    }

    function handleResults(results) {
        if (results.hits) {
            var hits = results.hits.hits;
            for (var i = 0; i < hits.length; i++) {
                var hit = hits[i];

                callback.call(undefined, hit._source);
            }
        }
    }

    function handleSearch(name, query) {
        redisClient.on("error", function (err) {
            console.log("Error " + err);
        });

        redisClient.hget(LOGSTASH_LAST_CHECK_KEY, name, function(err, lastCheck){
            if (lastCheck == null) {
                redisClient.hset(LOGSTASH_LAST_CHECK_KEY, name, (new Date()).toISOString());
                return;
            }

            ejs.Request()
                .query(handleQuery(query, lastCheck))
                .doSearch(function(results){
                    handleResults(results);

                    redisClient.hset(LOGSTASH_LAST_CHECK_KEY, name, (new Date()).toISOString());
                }, function(err){
                    console.log("An error has occurred, most likely I can't find elasticsearch.", err);
                });
        });
    }

    // Wrap the query to a date range
    function handleQuery(query, date) {
        return ejs.BoolQuery()
            .must(
                ejs.RangeQuery('@timestamp')
                    .from(date)
            )
            .must(query)
        ;
    }

    this.test = {
        handleQuery: handleQuery,
        handleSearch: handleSearch,
        handleResults: handleResults
    };
}

module.exports = LogstashQueryListener;
