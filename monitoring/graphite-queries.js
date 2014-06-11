var graphTypes = {
    "analyticstiming" : {
        "targets" : [
            //stats.timers.analytics.success.analytics*.median  // ...shows median timing per machine
            "alias(stats.timers.analytics.success.mean,'Average (ms)')",
            "alias(stats.timers.analytics.success.upper_90,'Upper 90th (ms)')",
            "alias(stats.timers.analytics.success.lower,'Lowest (ms)')"
        ],
        "title" : "Analytics request timing",
        "aliases" : [
            "analytics",
            "analtiming",
            "anal"
        ]
    },
    "analyticscount" : {
        "targets" : [
            "stats.timers.analytics.shard.*.count"
        ],
        "title" : "Successful analytics requests",
        "aliases" : [
            "analyticscnt",
            "analrequests",
            "analreqs"
        ]
    },
   "jobresources" : {
      "targets" : [
         "stats.gauges.job.available.ram.1.monitor",
         "stats.gauges.job.available.cpu.1.monitor"
      ],
      "title" : "Available Job-Node Resources",
      "aliases" : [
         "jobres",
         "nodewatch"
      ],
      "duration" : "7 days"
   },
    "publiccount" : {
        "targets" : [
            "stats_counts.server.request.public*"
        ],
        "title" : "Successful public requests",
        "aliases" : [
            "public",
            "publiccnt"
        ]
    },
    "requestcount" : {
        "targets" : [
            "alias(sum(stats_counts.server.request.analytics*),'Analytics Requests')",
            "alias(sum(stats_counts.server.request.app*),'App Requests')",
            "alias(sum(stats_counts.server.request.api*),'Api Requests')",
            "alias(sum(stats_counts.server.request.email*),'Email Requests')",
            "alias(sum(stats_counts.server.request.public*),'Public Requests')"
        ],
        "title" : "Request counts by type",
        "aliases" : [
            "requestcnt",
            "reqcnt"
        ]
    },
    "modulecount" : {
        "targets" : [
            "stats_counts.module.execute.siteSearch.search",
            "stats_counts.module.execute.sendgrid.notify",
            "stats_counts.module.execute.tracker.track",
            "stats_counts.module.execute.tracker.redirect",
            "stats_counts.module.execute.tracker.httpsRedirect",
            "stats_counts.module.execute.tracker.analytics",
            "stats_counts.module.execute.formHandler.submit",
            "stats_counts.module.execute.landingPage.display",
            "stats_counts.module.execute.form.display",
            "stats_counts.module.execute.customUrl.redirect",
            "stats_counts.module.execute.social.redirect"
        ],
        "title" : "Module request counts",
        "aliases" : [
            "modulecnt",
            "modules",
            "module"
        ]
    },
    "graphitecount" : {
        "targets" : [
            "carbon.agents.graphite-d1_pardot_com-a.metricsReceived",
            "carbon.agents.graphite-d1_pardot_com-a.committedPoints",
            "stats_counts.statsd.packets_received"
        ],
        "title" : "Graphite pings",
        "aliases" : [
            "graphitecnt",
            "graphite"
        ]
    },
    "signalhandlers" : {
        "targets" : [
            "stats.timers.signal.*.SignalHandlerPushNotification.mean"
        ],
        "title" : "Signal Handler Push Notifications",
        "aliases" : [
            "sighand",
            "pubsub"
        ]
    },
    "formtiming" : {
        "targets" : [
            "alias(stats.timers.form.display.mean,'Average (ms)')",
            "alias(stats.timers.form.display.upper_90,'Upper 90th (ms)')",
            "alias(stats.timers.form.display.lower,'Lowest (ms)')"
        ],
        "title" : "Form Render Timing",
        "aliases" : [
            "forms"
        ]
    },
    "newjobs" : {
        "targets" : [
            "stats.gauges.job.request.1.new.*"
        ],
        "title" : "New Jobs",
        "aliases" : [
            "newjerbs"
        ],
        "extraParams" : [
            "lineMode=connected"
        ]
    }
};

var defaultUrlParams = {
    "width" : 1000,
    "height" : 400,
    "_salt" : new Date().getTime() / 1000,
    "targets" : [ ],
    "from" : "-8hours",
    "drawLegend" : true,
    "drawDeploy" : true,
    "drawWhiteBackground" : false,
    "title" : "HalBot-created graph. You're welcome.",
    "durationString" : " over 8 hours"
};

var drawDeployString = "target=alias(drawAsInfinite(events.deploy.prod),'Deploy')";
var whiteBackgroundString = "bgcolor=white&fgcolor=black";

var reservedWordsMap = {
    "dimensions" : [ "big", "medium", "small" ],
    "graphType" : [ ],   // auto-populated from the graphTypes object
    "duration" : [ "minutes", "hours", "days" ],
    "legend" : [ "nolegend", "legend" ],
    "deploy" : [ "nodeploy", "deploy" ],
    "background" : [ "white", "black" ]
};

module.exports = {
    graphTypes: graphTypes,
    defaultUrlParams: defaultUrlParams,
    drawDeployString: drawDeployString,
    whiteBackgroundString: whiteBackgroundString,
    reservedWordsMap: reservedWordsMap
}
