var ejs = require('elastic.js');

module.exports = {
    "javaservices-all": ejs.TermQuery("type", "javaservices"),

    "javaservices-errors": ejs.BoolQuery()
        .must(
            ejs.TermQuery("type", "javaservices")
        )
        .must(
            ejs.FieldQuery("level", "ERROR")
        )
        .mustNot(
            ejs.FieldQuery("host", "test-services.pardot.com")
        ),

    "javaservices-timeouts": ejs.BoolQuery()
        .must(
            ejs.TermQuery("type", "javaservices")
        )
        .must(
            ejs.FieldQuery("level", "DEBUG")
        )
        .must(
            ejs.FieldQuery("classname", "com.datastax.driver.core.RequestHandler")
        ),

    "javaservices-warnings": ejs.BoolQuery()
        .must(
            ejs.TermQuery("type", "javaservices")
        )
        .must(
            ejs.FieldQuery("level", "WARN")
        )
        .mustNot(
            ejs.FieldQuery("host", "test-services.pardot.com")
        ),

    "cassandra-errors": ejs.BoolQuery()
        .must(
            ejs.TermQuery("type", "cassandra")
        )
        .must(
            ejs.FieldQuery("level", "ERROR")
        ),

    "cassandra-warnings": ejs.BoolQuery()
        .must(
            ejs.TermQuery("type", "cassandra-startup")
        )
        .must(
            ejs.FieldQuery("level", "WARN")
        )

};
