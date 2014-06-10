var events = require("events");
var util = require("util");
var FREQUENCY_IN_MILLISECONDS = 10 * 1000;
var JOBS_FOLDER = __dirname + "/../jobs"

function JobWeekdayAtTimeEasternTime(hour, minute, callback){
    var lastRunTime = 1;
    this.execute = function(hipchatUserHandler, parsedDate){
        var secondsSinceLastRun = (parsedDate.time - lastRunTime)/1000;
        if(secondsSinceLastRun>59){
            if( parsedDate.est.isWeekday && (parsedDate.est.hour === hour) && (parsedDate.est.minutes === minute) ){
                callback(hipchatUserHandler, parsedDate);
                lastRunTime = parsedDate.time;
            }
        }
    }
}

function JobRecurringInterval(hours, minutes, seconds, callback){
    var lastRunTime = 1;
    var secondsInterval = (hours*60*60) + (minutes*60) + seconds;
    this.execute = function(hipchatUserHandler,parsedDate){
        if( ((parsedDate.time - lastRunTime)/1000) >= secondsInterval){
            callback(hipchatUserHandler,parsedDate);
            lastRunTime = parsedDate.time;
        }
    }
}



function RecurringManager(hipchatUserHandler){
    var that = this;
    var jobs = [];

    init();

    function init(){
        //load up the jobs
        jobs = getTheJobs();
        //kick off the jobs
        run();
    }

    function getTheJobs(){
        var ret = [];
        files = require('fs').readdirSync(JOBS_FOLDER);
        files.forEach(function(file){
           var f = require(JOBS_FOLDER+"/"+file);
           if(f.type === 'JobWeekdayAtTimeEasternTime'){
               ret.push(new JobWeekdayAtTimeEasternTime(f.hour, f.minute, f.callback));
           }
           if(f.type === 'JobRecurringInterval'){
               ret.push(new JobRecurringInterval(f.hours, f.minutes, f.seconds, f.callback));
           }
        });
        return ret;
    }

    function processTheJobs(){
        var parsedDate = getParsedTime(new Date());
        jobs.forEach(function(job){
            job.execute(hipchatUserHandler, parsedDate);
        });
    }

    function run(){
        processTheJobs();
        setTimeout(run, FREQUENCY_IN_MILLISECONDS);
    }


    function getParsedTime(date){
        //TODO: This currently assumes that the machine timezone is est, which is a bad assumption
        //The right way to do this would be to determine what the current time is in EST/EDT which
        //is a pain in javascript
        return {
            time: date.getTime(),
            est: {
                isWeekday: (date.getDay()>0 && date.getDay()<6),
                hour: date.getHours(),
                minutes: date.getMinutes(),
                dayOfMonth: date.getDate()
            },
            utc: {
                isWeekday: (date.getUTCDay()>0 && date.getUTCDay()<6),
                hour: date.getUTCHours(),
                minutes: date.getUTCMinutes(),
                dayOfMonth: date.getUTCDate()
            }
        }
    }

    this.test={
        getParsedTime: getParsedTime,
        JobWeekdayAtTimeEasternTime: JobWeekdayAtTimeEasternTime,
        JobRecurringInterval: JobRecurringInterval
    };

}

module.exports = RecurringManager;