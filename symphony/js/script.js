$(function () {
    new WOW().init();
    /*************************************************
            COUNTDOWN
    *************************************************/
        $('.countdown').downCount({
            date: e(),
            offset: +5
        }, function () {
            alert('WOOT WOOT, done!');
        });
        
        function e() {
            var e = new Date;
                e.setDate(e.getDate() + 5);
            
            var dd = e.getDate();
            var mm = e.getMonth() +1;
            var y = e.getFullYear();
            
            var futureFormattedDate = mm + "/" + dd + "/" + y + ' 12:00:00';
            
            return futureFormattedDate;
        }
    
    /*****************************************
    game
    *****************************************/
    
    
});
