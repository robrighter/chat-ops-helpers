module.exports = {
    type: 'JobWeekdayAtTimeEasternTime',
    hour: 10,
    minute: 30,
    callback: function(hipchatUserHandler){
        hipchatUserHandler.announceToRoom("45727_cassandra", "Good morning @all, please get your text scrum in before 11:00am");
    }
}